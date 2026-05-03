import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PrimeiroPrograma() {
  return (
    <PageContainer
      title="Seu primeiro programa em Dart"
      subtitle="Do terminal vazio ao primeiro &quot;Olá!&quot; rodando — em menos de cinco minutos."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Toda jornada com uma linguagem nova começa do mesmo ponto: criar o &quot;hello world&quot; e ver alguma coisa aparecer na tela. Esse momento é importante porque confirma que sua instalação funciona, que o editor enxerga o código e que o terminal sabe rodar Dart. Vamos do zero ao primeiro programa em sete passos curtos.
      </p>

      <h2>Passo 1: criar o projeto</h2>
      <p>
        Em vez de criar o arquivo na mão, deixe o Dart montar a estrutura para você. Abra um terminal em uma pasta de estudos:
      </p>
      <pre><code>{`# Cria uma pasta meu_app/ com tudo configurado
dart create -t console meu_app
cd meu_app`}</code></pre>
      <p>
        O parâmetro <code>-t console</code> escolhe o template &quot;aplicação de linha de comando&quot;. Existem outros (<code>package</code>, <code>server-shelf</code>), mas para começar este é perfeito.
      </p>

      <h2>Passo 2: entender a estrutura mínima</h2>
      <p>
        Liste o conteúdo da pasta criada (no Linux/macOS use <code>ls -la</code>, no Windows <code>dir</code>):
      </p>
      <pre><code>{`meu_app/
├── analysis_options.yaml   # regras de análise estática
├── bin/
│   └── meu_app.dart        # ponto de entrada (main)
├── CHANGELOG.md            # histórico de versões
├── pubspec.lock            # versões exatas das dependências
├── pubspec.yaml            # manifesto do projeto
└── README.md`}</code></pre>
      <ul>
        <li><strong>bin/</strong>: aqui ficam programas executáveis (cada arquivo com função <code>main</code>).</li>
        <li><strong>pubspec.yaml</strong>: o &quot;passaporte&quot; do projeto — nome, versão, dependências.</li>
        <li><strong>pubspec.lock</strong>: gerado automaticamente, fixa as versões instaladas.</li>
        <li><strong>analysis_options.yaml</strong>: configura o quão exigente o linter será.</li>
      </ul>

      <AlertBox type="info" title="Por que &quot;bin&quot;?">
        É convenção desde os anos 70 do Unix: <em>bin</em> = <em>binaries</em> (executáveis). No mundo Dart, qualquer <code>.dart</code> dentro de <code>bin/</code> que tenha uma função <code>main()</code> pode ser executado com <code>dart run</code>.
      </AlertBox>

      <h2>Passo 3: abrir no editor</h2>
      <p>
        Abra a pasta no seu editor (VS Code é uma ótima escolha para começar):
      </p>
      <pre><code>{`# Abre o VS Code já apontado para a pasta atual
code .

# Ou Android Studio
studio .`}</code></pre>
      <p>
        Abra o arquivo <code>bin/meu_app.dart</code>. O conteúdo gerado é parecido com isto:
      </p>
      <pre><code>{`import 'package:meu_app/meu_app.dart' as meu_app;

void main(List<String> arguments) {
  print('Hello world: \${meu_app.calculate()}!');
}`}</code></pre>

      <h2>Passo 4: rodar pela primeira vez</h2>
      <p>
        Volte ao terminal, na pasta <code>meu_app</code>, e rode:
      </p>
      <pre><code>{`dart run

# Saída esperada:
# Building package executable...
# Built meu_app:meu_app.
# Hello world: 42!`}</code></pre>
      <p>
        Se você viu <code>Hello world: 42!</code>, parabéns — seu primeiro programa Dart está rodando. Por baixo dos panos, o Dart leu o <code>pubspec.yaml</code>, baixou dependências (se houvesse), compilou seu código em modo JIT e executou a função <code>main</code>.
      </p>

      <h2>Passo 5: simplificar para entender melhor</h2>
      <p>
        Vamos deletar todo o conteúdo de <code>bin/meu_app.dart</code> e escrever uma versão minimalista do zero, só para fixar o conceito:
      </p>
      <pre><code>{`// bin/meu_app.dart
// Ponto de entrada: toda execução começa aqui
void main() {
  // print imprime no terminal e adiciona quebra de linha
  print('Olá, Dart!');

  // Variáveis com inferência de tipo
  final nome = 'Maria';
  final idade = 28;

  // Interpolação: \$nome insere o valor; \${expr} avalia uma expressão
  print('\$nome tem \$idade anos.');
  print('Daqui a 10 anos terá \${idade + 10}.');
}`}</code></pre>
      <p>
        Salve e rode novamente:
      </p>
      <pre><code>{`dart run

# Saída:
# Olá, Dart!
# Maria tem 28 anos.
# Daqui a 10 anos terá 38.`}</code></pre>

      <AlertBox type="warning" title="Salvou e nada mudou?">
        Confira que: (1) você salvou o arquivo (Ctrl+S), (2) está rodando na pasta certa (<code>pwd</code>), (3) editou <code>bin/meu_app.dart</code>, não outro arquivo. Em editores como o VS Code, o título da aba sem &quot;ponto&quot; indica que está salvo.
      </AlertBox>

      <h2>Passo 6: receber argumentos do terminal</h2>
      <p>
        Programas reais geralmente recebem dados de fora. Vamos receber o nome via argumento:
      </p>
      <pre><code>{`void main(List<String> args) {
  // args é a lista de palavras digitadas após "dart run"
  if (args.isEmpty) {
    print('Uso: dart run <seu_nome>');
    return;
  }
  final nome = args.first;
  print('Olá, \$nome! Seja bem-vindo ao Dart.');
}`}</code></pre>
      <pre><code>{`dart run -- Ana
# Olá, Ana! Seja bem-vindo ao Dart.

dart run
# Uso: dart run <seu_nome>`}</code></pre>
      <p>
        Note os <code>--</code> antes do <code>Ana</code>: eles dizem ao Dart &quot;tudo o que vier depois é argumento do programa, não do <code>dart run</code>&quot;.
      </p>

      <h2>Passo 7: explorar o que aprendeu</h2>
      <p>
        Você já dominou:
      </p>
      <ul>
        <li>Criar um projeto com <code>dart create</code>.</li>
        <li>Estrutura mínima: <code>bin/</code>, <code>pubspec.yaml</code>.</li>
        <li>A função <code>main</code> como ponto de entrada.</li>
        <li><code>print</code> e interpolação de strings.</li>
        <li>Argumentos de linha de comando via <code>List&lt;String&gt;</code>.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>&quot;No pubspec.yaml found&quot;</strong>: você está fora da pasta do projeto. <code>cd meu_app</code>.</li>
        <li><strong>Esquecer <code>;</code></strong> no fim das instruções — o erro é <em>Expected ';' after this</em>.</li>
        <li><strong>Trocar <code>main</code> por <code>Main</code></strong>: Dart é case-sensitive. O arquivo &quot;compila&quot; mas não roda.</li>
        <li><strong>Não salvar o arquivo</strong>: o editor mostra um pontinho na aba quando há mudanças não salvas.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dart create -t console nome</code> monta o projeto inicial.</li>
        <li><code>bin/&lt;nome&gt;.dart</code> contém a função <code>main</code>, o ponto de entrada.</li>
        <li><code>dart run</code> compila em JIT e executa.</li>
        <li><code>print</code> escreve no terminal; aspas simples ou duplas são equivalentes.</li>
        <li>Argumentos chegam em <code>List&lt;String&gt; args</code>.</li>
      </ul>
    </PageContainer>
  );
}
