import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartIoIntro() {
  return (
    <PageContainer
      title="dart:io: arquivos, processos e mais"
      subtitle="A &quot;caixa de ferramentas&quot; do Dart para conversar com o sistema operacional — arquivos, redes, processos, variáveis de ambiente."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Imagine que o seu programa Dart é um inquilino dentro de um prédio (o sistema operacional). Para sair do apartamento e <em>fazer coisas</em> no mundo — abrir uma carta (ler arquivo), ligar para alguém (HTTP), pedir uma pizza (rodar outro processo) — ele precisa de uma porta. Essa porta é a biblioteca <code>dart:io</code>. Ela contém praticamente tudo que envolve <strong>entrada e saída</strong> com o sistema.
      </p>

      <h2>Onde <code>dart:io</code> roda — e onde NÃO roda</h2>
      <p>
        Esse é o ponto crucial: <code>dart:io</code> só funciona em ambientes que <em>têm</em> um sistema operacional para conversar. Isso significa:
      </p>
      <ul>
        <li><strong>Funciona:</strong> apps de linha de comando (CLI), servidores HTTP em Dart, scripts, Flutter para Android/iOS/desktop (Windows/macOS/Linux).</li>
        <li><strong>NÃO funciona:</strong> Flutter Web e qualquer Dart compilado para JavaScript — porque o navegador <em>não dá acesso</em> ao sistema de arquivos por segurança. Lá você usa <code>dart:html</code> ou pacotes específicos (<code>http</code>, <code>web</code>).</li>
      </ul>
      <pre><code>{`// Importacao no topo do arquivo:
import 'dart:io';

void main() {
  print('Sistema: \${Platform.operatingSystem}');
  print('Usuario: \${Platform.environment["USER"] ?? "?"}');
}`}</code></pre>

      <AlertBox type="warning" title="Cuidado com o erro &quot;Unsupported operation&quot;">
        Se você importar <code>dart:io</code> num projeto Flutter Web, o build até passa, mas qualquer chamada (<code>File</code>, <code>Platform</code>, etc.) explode em runtime no navegador. Use <code>kIsWeb</code> ou pacotes condicionais para isolar.
      </AlertBox>

      <h2>O panteão das classes principais</h2>
      <p>
        <code>dart:io</code> é grande, mas você usará principalmente este punhado:
      </p>
      <pre><code>{`import 'dart:io';

void tour() {
  // Arquivos:
  final f = File('config.json');

  // Pastas:
  final dir = Directory('logs');

  // Processos externos (rodar comandos do sistema):
  // Process.run('git', ['status']);

  // Servidores HTTP:
  // HttpServer.bind('0.0.0.0', 8080);

  // Cliente HTTP:
  // HttpClient().getUrl(Uri.parse('https://example.com'));

  // Sockets brutos (TCP/UDP):
  // Socket.connect('host', 22);

  // Plataforma e ambiente:
  print(Platform.numberOfProcessors);
  print(Platform.environment['HOME']);

  // Entrada/Saida padrao:
  stdout.writeln('escrevendo no terminal');
  stderr.writeln('mensagem de erro');
  // final linha = stdin.readLineSync();
}`}</code></pre>

      <h2><code>Platform</code>: descobrindo onde você está</h2>
      <p>
        A classe <code>Platform</code> expõe metadados do ambiente: qual SO, qual versão do Dart, separador de path, variáveis de ambiente. Útil para escrever código portável.
      </p>
      <pre><code>{`import 'dart:io';

void main() {
  if (Platform.isWindows) {
    print('Estamos no Windows. Path separator: \${Platform.pathSeparator}');
  } else if (Platform.isLinux || Platform.isMacOS) {
    print('Estamos em Unix-like. Shell: \${Platform.environment["SHELL"]}');
  }
  print('Dart \${Platform.version}');
  print('CPU cores: \${Platform.numberOfProcessors}');
}`}</code></pre>

      <h2>Argumentos da linha de comando</h2>
      <p>
        Quando você roda <code>dart run app.dart --nome Ana --idade 30</code>, esses textos depois do nome do arquivo chegam dentro de <code>main</code> via o parâmetro <code>List&lt;String&gt; args</code>. <code>dart:io</code> não é necessário só pra isso, mas é nesse contexto que você costuma usá-los.
      </p>
      <pre><code>{`void main(List<String> args) {
  print('Recebi \${args.length} argumentos: \$args');
  if (args.contains('--help')) {
    print('Uso: app [--help] [--versao]');
    return;
  }
}

// $ dart run app.dart --versao --debug
// Recebi 2 argumentos: [--versao, --debug]`}</code></pre>

      <h2>Códigos de saída (<em>exit codes</em>)</h2>
      <p>
        Programas de linha de comando devolvem um número inteiro ao terminar: <code>0</code> = sucesso, qualquer outro = erro (cada valor com significado próprio). Scripts shell, CI/CD e ferramentas como <code>make</code> dependem desses códigos para saber se algo falhou.
      </p>
      <pre><code>{`import 'dart:io';

Future<void> main(List<String> args) async {
  if (args.isEmpty) {
    stderr.writeln('uso: app <arquivo>');
    exitCode = 64; // codigo padrao "uso incorreto"
    return;
  }

  final f = File(args.first);
  if (!await f.exists()) {
    stderr.writeln('arquivo nao encontrado: \${args.first}');
    exit(2); // sai imediatamente com codigo 2
  }

  print(await f.readAsString());
  // exitCode permanece 0 (sucesso) implicitamente.
}`}</code></pre>

      <AlertBox type="info" title="<code>exit</code> versus <code>exitCode</code>">
        <code>exitCode = N</code> apenas <em>marca</em> o código que será usado quando o programa terminar normalmente. <code>exit(N)</code> termina o processo na hora — pulando código pendente, blocos <code>finally</code> de timers, etc. Prefira <code>exitCode = N; return;</code> sempre que possível.
      </AlertBox>

      <h2>Async em <code>dart:io</code></h2>
      <p>
        Quase tudo em <code>dart:io</code> tem duas variantes: <strong>assíncrona</strong> (devolve <code>Future</code>) e <strong>síncrona</strong> (sufixo <code>Sync</code>). Como I/O é &quot;lento&quot; (disco, rede), o padrão recomendado é o assíncrono — ele libera a thread principal para outras tarefas. Use a versão <code>Sync</code> só em scripts curtos onde simplicidade vale mais que paralelismo.
      </p>
      <pre><code>{`import 'dart:io';

Future<void> assincrono() async {
  final txt = await File('a.txt').readAsString();
  print(txt);
}

void sincrono() {
  // Bloqueia o programa inteiro ate terminar de ler:
  final txt = File('a.txt').readAsStringSync();
  print(txt);
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Importar <code>dart:io</code> em Flutter Web</strong> e ver app crashar no navegador.</li>
        <li><strong>Usar APIs <code>Sync</code> em servidor</strong> — bloqueia todas as requisições enquanto lê o disco.</li>
        <li><strong>Esquecer <code>await</code></strong> em chamadas async — o programa termina antes da operação concluir.</li>
        <li><strong>Usar <code>exit(0)</code> em meio a transações</strong> e perder dados não persistidos.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dart:io</code> dá acesso a arquivos, pastas, rede, processos e ambiente.</li>
        <li>Só funciona em CLI, servidores e Flutter mobile/desktop — <strong>não</strong> em Web.</li>
        <li>Classes-estrela: <code>File</code>, <code>Directory</code>, <code>Process</code>, <code>HttpClient</code>, <code>HttpServer</code>, <code>Platform</code>, <code>stdout</code>/<code>stderr</code>/<code>stdin</code>.</li>
        <li>Quase tudo tem versão async (preferida) e <code>Sync</code> (use só em scripts).</li>
        <li>Exit codes: <code>0</code> = sucesso; <code>exitCode = N; return;</code> é mais seguro que <code>exit(N)</code>.</li>
      </ul>
    </PageContainer>
  );
}
