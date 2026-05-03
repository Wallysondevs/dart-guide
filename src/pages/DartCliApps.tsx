import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartCliApps() {
  return (
    <PageContainer
      title="Construindo CLIs robustas em Dart"
      subtitle="Aprenda a criar ferramentas de linha de comando profissionais como git, npm ou docker — só que escritas em Dart."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Uma <strong>CLI</strong> (Command Line Interface, ou interface de linha de comando) é um programa que você usa pelo terminal, digitando comandos como <code>git commit -m &quot;mensagem&quot;</code>. É como um balcão de atendimento sem botões nem menus: você fala o que quer em texto e a ferramenta responde. Dart é excelente para CLIs porque compila para um único executável nativo, sem precisar de runtime instalado.
      </p>

      <h2>Lendo argumentos crus do terminal</h2>
      <p>
        Quando você roda <code>dart run app.dart --nome Maria</code>, tudo após o nome do arquivo chega no parâmetro da função <code>main</code> como uma lista de strings:
      </p>
      <pre><code>{`// bin/cli.dart
void main(List<String> args) {
  print('Recebi \${args.length} argumentos:');
  for (final a in args) {
    print('  - \$a');
  }
}`}</code></pre>
      <p>
        Funciona, mas é primitivo. Para qualquer coisa séria, queremos algo como <code>--ajuda</code>, flags com valor padrão, validação automática e mensagens de erro bonitas. Para isso existe o pacote oficial <strong>args</strong>.
      </p>

      <h2>O pacote args e o ArgParser</h2>
      <p>
        Adicione no <code>pubspec.yaml</code>:
      </p>
      <pre><code>{`dependencies:
  args: ^2.5.0`}</code></pre>
      <p>
        O <strong>ArgParser</strong> é como um formulário: você descreve as caixas (flags e opções) que aceita, ele valida o que o usuário digitou e devolve um objeto pronto.
      </p>
      <pre><code>{`import 'package:args/args.dart';

void main(List<String> args) {
  final parser = ArgParser()
    ..addOption('nome', abbr: 'n', help: 'Seu nome', defaultsTo: 'mundo')
    ..addFlag('verbose', abbr: 'v', help: 'Saída detalhada', negatable: false)
    ..addFlag('help', abbr: 'h', help: 'Mostra esta ajuda', negatable: false);

  final ArgResults resultado = parser.parse(args);

  if (resultado['help'] as bool) {
    print('Uso: cli [opcoes]');
    print(parser.usage);
    return;
  }

  final nome = resultado['nome'] as String;
  if (resultado['verbose'] as bool) {
    print('Modo verbose ativado.');
  }
  print('Olá, \$nome!');
}`}</code></pre>
      <p>
        Agora seu programa aceita: <code>dart run cli.dart -n Ana -v</code>, <code>dart run cli.dart --help</code>, etc. E gera ajuda formatada automaticamente — sem você escrever nada manualmente.
      </p>

      <AlertBox type="info" title="Por que usar args em vez de parsear na mão?">
        Você ganha mensagens de erro consistentes, ajuda automática, suporte a abreviações (<code>-n</code>) e formas longas (<code>--nome</code>), e validação de tipos. Reinventar isso é trabalho perdido.
      </AlertBox>

      <h2>Subcomandos com CommandRunner</h2>
      <p>
        Ferramentas como <code>git</code> têm subcomandos: <code>git commit</code>, <code>git push</code>, <code>git log</code>. Cada um tem suas próprias flags. O pacote args resolve isso com <strong>CommandRunner</strong>.
      </p>
      <pre><code>{`import 'package:args/command_runner.dart';

class CommitCommand extends Command<void> {
  @override
  final name = 'commit';
  @override
  final description = 'Cria um novo commit';

  CommitCommand() {
    argParser.addOption('message', abbr: 'm', mandatory: true);
  }

  @override
  void run() {
    final msg = argResults!['message'] as String;
    print('Commit criado: \$msg');
  }
}

class PushCommand extends Command<void> {
  @override
  final name = 'push';
  @override
  final description = 'Envia commits ao remoto';

  @override
  void run() => print('Enviando para origin...');
}

void main(List<String> args) {
  CommandRunner<void>('mygit', 'Mini Git em Dart')
    ..addCommand(CommitCommand())
    ..addCommand(PushCommand())
    ..run(args);
}`}</code></pre>
      <p>
        Agora rodamos: <code>dart run mygit.dart commit -m &quot;feat: nova feature&quot;</code> ou <code>dart run mygit.dart push</code>. O <code>CommandRunner</code> ainda gera ajuda hierárquica (<code>mygit help commit</code>) gratuitamente.
      </p>

      <h2>Saída colorida e interatividade</h2>
      <p>
        Para tornar a CLI agradável, use o pacote <code>dart_console</code>, <code>cli_util</code> ou códigos ANSI puros (sequências especiais que o terminal interpreta como cor).
      </p>
      <pre><code>{`const verde = '\\x1B[32m';
const vermelho = '\\x1B[31m';
const reset = '\\x1B[0m';

void sucesso(String msg) => print('\${verde}✓ \$msg\$reset');
void erro(String msg) => print('\${vermelho}✗ \$msg\$reset');

void main() {
  sucesso('Build concluído');
  erro('Testes falharam');
}`}</code></pre>

      <h2>Compilando para executável nativo</h2>
      <p>
        Aqui está a parte mágica: Dart compila a CLI inteira para um único binário <strong>AOT</strong> (Ahead Of Time, traduzido antes de rodar). O usuário não precisa ter Dart instalado.
      </p>
      <pre><code>{`# Linux/macOS
dart compile exe bin/mygit.dart -o mygit

# Windows
dart compile exe bin/mygit.dart -o mygit.exe

# Roda direto
./mygit commit -m "primeiro"`}</code></pre>

      <AlertBox type="success" title="Vantagem real">
        O binário pesa ~5-8MB, inicia em milissegundos (não tem JVM ou Node engatando) e é distribuível como qualquer outro executável. Compare com Node.js, que exige o runtime instalado, ou Java, que precisa da JVM.
      </AlertBox>

      <h2>Cross-platform: um build para cada SO</h2>
      <p>
        <code>dart compile exe</code> gera um binário <strong>para o SO em que você rodou o comando</strong>. Para distribuir em Linux, macOS e Windows, você compila em cada plataforma — geralmente via GitHub Actions com matrix strategy. O Dart também oferece <code>dart compile aot-snapshot</code> e <code>jit-snapshot</code> para casos específicos, mas <code>exe</code> é o padrão para CLIs distribuíveis.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Cast manual</strong>: <code>resultado[&apos;nome&apos;] as String</code> falha se a opção não foi definida no parser.</li>
        <li><strong>Não tratar exceções de parse</strong>: envolva <code>parser.parse(args)</code> num <code>try</code> e mostre a ajuda.</li>
        <li><strong>Esquecer <code>negatable: false</code></strong> em flags simples — senão Dart aceita <code>--no-verbose</code> automaticamente.</li>
        <li><strong>Compilar no Linux e tentar rodar no Windows</strong> — binários AOT não são portáveis.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Argumentos chegam em <code>List&lt;String&gt; args</code> dentro de <code>main</code>.</li>
        <li>Pacote <strong>args</strong> com <code>ArgParser</code> faz validação, ajuda e flags.</li>
        <li><code>CommandRunner</code> organiza subcomandos no estilo git.</li>
        <li><code>dart compile exe</code> gera binário nativo, sem runtime.</li>
        <li>Distribuição cross-platform exige um build por SO alvo.</li>
      </ul>
    </PageContainer>
  );
}
