import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PubspecYaml() {
  return (
    <PageContainer
      title="Entendendo o pubspec.yaml"
      subtitle="O passaporte do seu projeto Dart — quem ele é, com quem se relaciona e o que precisa para funcionar."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Todo projeto Dart tem um arquivo chamado <code>pubspec.yaml</code> na raiz. Pense nele como o <em>RG</em> do projeto: contém o nome, a descrição, a versão, com quais SDKs é compatível e quais bibliotecas externas precisa para rodar. Sem esse arquivo, ferramentas como <code>dart pub</code> e <code>flutter</code> não sabem nem por onde começar.
      </p>

      <h2>Antes: o que é YAML?</h2>
      <p>
        <strong>YAML</strong> (&quot;YAML Ain&apos;t Markup Language&quot;) é um formato de texto estruturado, criado para ser fácil de ler por humanos. Diferente de JSON, ele usa <em>indentação</em> (espaços) para mostrar hierarquia, e dispensa aspas na maioria dos casos. Regras básicas:
      </p>
      <ul>
        <li>Indentação com <strong>espaços</strong> (nunca tabs!) — geralmente 2.</li>
        <li><code>chave: valor</code> para campos simples.</li>
        <li><code>-</code> antes de cada item para listas.</li>
        <li><code>#</code> para comentários.</li>
      </ul>
      <pre><code>{`# Exemplo simples de YAML
nome: Maria
idade: 30
hobbies:
  - leitura
  - corrida
endereco:
  cidade: Recife
  cep: 50000-000`}</code></pre>

      <AlertBox type="warning" title="Cuidado com tabs!">
        YAML <strong>quebra</strong> se você misturar tabs e espaços. Configure seu editor para inserir 2 espaços ao apertar Tab dentro de arquivos <code>.yaml</code>.
      </AlertBox>

      <h2>Estrutura de um pubspec.yaml mínimo</h2>
      <pre><code>{`name: meu_app
description: Meu primeiro app em Dart.
version: 0.1.0

environment:
  sdk: ^3.5.0

dependencies:
  http: ^1.2.0

dev_dependencies:
  test: ^1.25.0
  lints: ^4.0.0`}</code></pre>
      <p>
        Vamos esmiuçar campo por campo.
      </p>

      <h2>Campos obrigatórios: name, description, version</h2>
      <ul>
        <li><strong>name</strong>: identificador único do pacote. Só letras minúsculas, números e <code>_</code>. Sem espaços, sem hífen.</li>
        <li><strong>description</strong>: 60–180 caracteres. Aparece no pub.dev se você publicar.</li>
        <li><strong>version</strong>: segue <em>SemVer</em> — semântico de versão.</li>
      </ul>
      <p>
        SemVer tem três números: <code>MAJOR.MINOR.PATCH</code>. <strong>MAJOR</strong> sobe quando você quebra compatibilidade; <strong>MINOR</strong> sobe quando adiciona funcionalidade nova compatível; <strong>PATCH</strong> sobe em correções pequenas. Exemplo: <code>2.4.1</code>.
      </p>

      <h2>environment: o SDK constraint</h2>
      <p>
        Esse bloco diz ao Dart com quais versões do SDK seu projeto é compatível:
      </p>
      <pre><code>{`environment:
  sdk: ^3.5.0           # qualquer Dart >= 3.5.0 e < 4.0.0
  flutter: ">=3.24.0"   # opcional, em projetos Flutter`}</code></pre>
      <p>
        O símbolo <code>^</code> (caret) significa &quot;compatível com&quot; — aceita qualquer versão até o próximo MAJOR. É a forma mais comum.
      </p>

      <h2>dependencies vs dev_dependencies</h2>
      <p>
        Aqui mora a parte mais usada. Existem dois tipos de dependências:
      </p>
      <ul>
        <li><strong>dependencies</strong>: pacotes que seu programa precisa em <em>produção</em> (vão junto no app final). Ex: cliente HTTP, banco de dados, formatadores de data.</li>
        <li><strong>dev_dependencies</strong>: usados só durante o desenvolvimento — testes, geradores de código, linters. Não vão para produção.</li>
      </ul>
      <pre><code>{`dependencies:
  http: ^1.2.0           # cliente HTTP
  intl: ^0.19.0          # internacionalização
  shared_preferences: ^2.2.0  # persistência simples (Flutter)

dev_dependencies:
  test: ^1.25.0          # framework de testes
  lints: ^4.0.0          # regras de estilo
  build_runner: ^2.4.0   # gerador de código
  freezed: ^2.5.0        # immutables`}</code></pre>

      <AlertBox type="info" title="Como adicionar sem editar na mão?">
        Use o CLI: <code>dart pub add http</code> adiciona em <code>dependencies</code>; <code>dart pub add --dev test</code> em <code>dev_dependencies</code>. O arquivo é atualizado para você.
      </AlertBox>

      <h2>Sintaxes de constraint de versão</h2>
      <pre><code>{`dependencies:
  pacote_a: ^1.2.3        # >=1.2.3 e <2.0.0 (mais comum)
  pacote_b: ">=1.0.0 <2.0.0"  # mesma coisa, explícito
  pacote_c: 1.2.3         # exatamente essa versão (raro)
  pacote_d: any           # qualquer versão (NÃO use em produção)
  pacote_e:
    git:
      url: https://github.com/usuario/pacote.git
      ref: main
  pacote_f:
    path: ../pacote_local  # caminho local para desenvolvimento`}</code></pre>

      <h2>A seção flutter (em projetos Flutter)</h2>
      <p>
        Em apps Flutter, há uma seção especial para configurar assets, fontes e plugins:
      </p>
      <pre><code>{`flutter:
  uses-material-design: true

  assets:
    - assets/images/                  # pasta inteira
    - assets/icons/logo.png           # arquivo específico
    - assets/data/perguntas.json

  fonts:
    - family: Roboto
      fonts:
        - asset: fonts/Roboto-Regular.ttf
        - asset: fonts/Roboto-Bold.ttf
          weight: 700
        - asset: fonts/Roboto-Italic.ttf
          style: italic`}</code></pre>
      <p>
        Toda vez que você adiciona um asset ou fonte, precisa rodar <code>flutter pub get</code> para o Flutter empacotá-los no app.
      </p>

      <h2>Exemplo comentado completo</h2>
      <pre><code>{`# pubspec.yaml de um app Flutter realista
name: tarefas_app
description: Gerenciador de tarefas com sincronização em nuvem.
publish_to: 'none'   # impede publicação acidental no pub.dev
version: 1.4.2+18    # 1.4.2 é a versão; +18 é o build number (Android/iOS)

environment:
  sdk: ^3.5.0
  flutter: ">=3.24.0"

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.8
  http: ^1.2.0
  intl: ^0.19.0
  go_router: ^14.0.0
  riverpod: ^2.5.0
  freezed_annotation: ^2.4.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
  build_runner: ^2.4.0
  freezed: ^2.5.0
  json_serializable: ^6.8.0

flutter:
  uses-material-design: true
  assets:
    - assets/images/
  fonts:
    - family: Inter
      fonts:
        - asset: fonts/Inter-Regular.ttf
        - asset: fonts/Inter-SemiBold.ttf
          weight: 600`}</code></pre>

      <h2>O pubspec.lock</h2>
      <p>
        Ao rodar <code>dart pub get</code>, é criado um <code>pubspec.lock</code> com as <strong>versões exatas</strong> instaladas (ex.: <code>http: 1.2.1</code>). Esse arquivo deve ser commitado em projetos de aplicação para garantir builds reprodutíveis. Em pacotes (bibliotecas), normalmente <em>não</em> se comita.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Indentação errada</strong>: YAML é rígido. Use sempre 2 espaços, nunca tabs.</li>
        <li><strong>Esquecer rodar <code>dart pub get</code></strong> após editar à mão.</li>
        <li><strong>Usar <code>any</code> como constraint</strong>: quebra builds com atualizações inesperadas.</li>
        <li><strong>Nome com hífen</strong> (<code>meu-app</code>) — o pub rejeita; só use <code>_</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>pubspec.yaml</code> identifica o projeto e lista dependências.</li>
        <li>YAML usa indentação por espaços para hierarquia.</li>
        <li><code>dependencies</code> = produção; <code>dev_dependencies</code> = só dev.</li>
        <li>Versões com <code>^</code> (compatível) são o padrão recomendado.</li>
        <li>Em Flutter, há seção <code>flutter:</code> para assets e fontes.</li>
        <li><code>pubspec.lock</code> trava versões exatas; comite em apps.</li>
      </ul>
    </PageContainer>
  );
}
