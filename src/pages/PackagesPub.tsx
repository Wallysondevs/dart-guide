import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PackagesPub() {
  return (
    <PageContainer
      title="pub.dev: o repositório de pacotes do Dart"
      subtitle="A loja oficial de bibliotecas Dart e Flutter — onde você baixa código pronto e aproveita o trabalho da comunidade."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Imagine que cada vez que você precisasse fazer um carro, tivesse que forjar os parafusos do zero. Seria insustentável. Por isso a engenharia inventou o conceito de <em>peças padronizadas</em>. Em programação, essas peças se chamam <strong>pacotes</strong> (ou <em>libraries</em>): pedaços de código que outras pessoas já escreveram, testaram e disponibilizaram para você usar. O <strong>pub.dev</strong> é a loja oficial de pacotes Dart, mantida pela equipe do Google.
      </p>

      <h2>O que é o pub.dev?</h2>
      <p>
        Acessível em <code>https://pub.dev</code>, é o repositório central onde toda a comunidade publica bibliotecas Dart e Flutter. Em 2024 ele tem mais de 50.000 pacotes — desde clientes HTTP até frameworks de gerenciamento de estado, passando por animações, banco de dados embarcados, integrações com Firebase, e muito mais.
      </p>
      <p>
        Toda vez que você roda <code>dart pub add &lt;nome&gt;</code>, o Dart conversa com o pub.dev, baixa o pacote pedido (mais suas dependências transitivas) e instala em uma pasta cache do seu sistema.
      </p>

      <AlertBox type="info" title="Cache global">
        Os pacotes não ficam dentro do seu projeto. São armazenados em <code>~/.pub-cache</code> (Linux/macOS) ou <code>%LOCALAPPDATA%\\Pub\\Cache</code> (Windows), compartilhados entre todos os seus projetos. Isso economiza disco e acelera <code>pub get</code>.
      </AlertBox>

      <h2>Adicionando seu primeiro pacote</h2>
      <p>
        Vamos adicionar o pacote <code>http</code>, que faz requisições à internet:
      </p>
      <pre><code>{`# Adiciona ao pubspec.yaml e baixa
dart pub add http

# Output:
# Resolving dependencies...
# + http 1.2.0
# Changed 1 dependency!`}</code></pre>
      <p>
        O comando <strong>edita</strong> seu <code>pubspec.yaml</code> automaticamente, adicionando:
      </p>
      <pre><code>{`dependencies:
  http: ^1.2.0`}</code></pre>
      <p>
        Agora você pode usar no seu código:
      </p>
      <pre><code>{`import 'package:http/http.dart' as http;

Future<void> main() async {
  // Faz GET em uma API pública e imprime o status
  final resposta = await http.get(
    Uri.parse('https://api.github.com/users/dart-lang'),
  );
  print('Status: \${resposta.statusCode}');
  print('Tamanho: \${resposta.body.length} bytes');
}`}</code></pre>

      <h2>Constraints de versão</h2>
      <p>
        O <code>^1.2.0</code> ao lado do nome é um <strong>constraint</strong>: a regra de quais versões são aceitas. As mais comuns:
      </p>
      <ul>
        <li><code>^1.2.0</code> — qualquer versão <strong>compatível</strong>: <code>&gt;=1.2.0 &lt;2.0.0</code>. Padrão.</li>
        <li><code>&gt;=1.0.0 &lt;2.0.0</code> — explícito, equivalente.</li>
        <li><code>1.2.0</code> — versão exata. Use só se precisar mesmo.</li>
        <li><code>any</code> — qualquer uma. Evite — quebra builds futuros.</li>
      </ul>
      <p>
        A regra do <code>^</code> segue o <em>SemVer</em>: enquanto o número MAJOR não mudar (1.x.x), as APIs são compatíveis. Quando muda para 2.0.0, espera-se que algo tenha quebrado e você deve revisar.
      </p>

      <h2>O pubspec.lock: a memória das versões</h2>
      <p>
        Após o primeiro <code>dart pub get</code>, é gerado o arquivo <code>pubspec.lock</code>. Ele guarda a <strong>versão exata</strong> de cada pacote (e de cada subdependência transitiva) instalada naquele momento. É como uma foto do estado atual.
      </p>
      <pre><code>{`# Trecho do pubspec.lock
http:
  dependency: "direct main"
  description:
    name: http
    sha256: "9d3..."
    url: "https://pub.dev"
  source: hosted
  version: "1.2.1"`}</code></pre>
      <p>
        Esse arquivo deve ser <strong>commitado em apps</strong> (garante que todos do time tenham as mesmas versões), mas geralmente <strong>não é commitado em pacotes</strong> publicáveis (deixa o consumidor escolher).
      </p>

      <h2>Scores e qualidade no pub.dev</h2>
      <p>
        Ao buscar um pacote no pub.dev, você verá três indicadores:
      </p>
      <ul>
        <li><strong>Likes</strong>: votos da comunidade.</li>
        <li><strong>Pub Points</strong>: nota técnica (0–160) com base em documentação, análise estática, plataformas suportadas, null-safety etc.</li>
        <li><strong>Popularity</strong>: percentil de downloads (quanto mais alto, mais gente usa).</li>
      </ul>
      <p>
        Para escolher entre dois pacotes parecidos, prefira o de maior popularity — geralmente é o mais maduro e mantido. Verifique também a <em>data do último commit</em> e a aba <em>versions</em>.
      </p>

      <AlertBox type="warning" title="Cuidado com pacotes abandonados">
        Um pacote sem updates há 2+ anos pode ter problemas de segurança, incompatibilidade com Dart 3 ou null-safety. Procure alternativas mantidas.
      </AlertBox>

      <h2>Pacotes populares que você vai encontrar</h2>
      <table>
        <thead><tr><th>Pacote</th><th>Para quê</th></tr></thead>
        <tbody>
          <tr><td><code>http</code></td><td>Cliente HTTP simples</td></tr>
          <tr><td><code>dio</code></td><td>Cliente HTTP avançado (interceptors, retry)</td></tr>
          <tr><td><code>path</code></td><td>Manipulação de caminhos de arquivos</td></tr>
          <tr><td><code>intl</code></td><td>Internacionalização e formatação de datas/números</td></tr>
          <tr><td><code>freezed</code></td><td>Gera classes imutáveis e unions</td></tr>
          <tr><td><code>json_serializable</code></td><td>Serialização JSON com geração de código</td></tr>
          <tr><td><code>riverpod</code></td><td>Gerenciamento de estado moderno (Flutter)</td></tr>
          <tr><td><code>go_router</code></td><td>Roteamento declarativo (Flutter)</td></tr>
          <tr><td><code>get_it</code></td><td>Service locator / injeção de dependências</td></tr>
          <tr><td><code>shared_preferences</code></td><td>Persistência simples chave-valor</td></tr>
        </tbody>
      </table>

      <h2>Comandos pub que você vai usar sempre</h2>
      <pre><code>{`# Adicionar / remover
dart pub add http
dart pub add --dev test
dart pub remove http

# Baixar (após clonar projeto ou editar pubspec à mão)
dart pub get

# Atualizar para versões compatíveis mais novas
dart pub upgrade

# Atualizar IGNORANDO constraint (quebra major)
dart pub upgrade --major-versions

# Ver árvore de dependências
dart pub deps

# Verificar se há atualizações disponíveis
dart pub outdated`}</code></pre>

      <h2>Publicando seu próprio pacote</h2>
      <p>
        Quando você desenvolve uma biblioteca útil, pode publicá-la para o mundo:
      </p>
      <pre><code>{`# Verifica se o pacote está pronto
dart pub publish --dry-run

# Publica de fato (pede login com Google)
dart pub publish`}</code></pre>
      <p>
        Para publicar você precisa: nome único, <code>description</code> entre 60 e 180 caracteres, README, LICENSE, CHANGELOG, código bem documentado e analisador limpo. O pub.dev calcula seu pub points automaticamente.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Adicionar dep e não importar</strong>: o pacote precisa de <code>import 'package:nome/nome.dart';</code> no arquivo.</li>
        <li><strong>Esquecer <code>dart pub get</code></strong> após editar o pubspec à mão.</li>
        <li><strong>Constraint <code>any</code></strong>: gera builds imprevisíveis.</li>
        <li><strong>Misturar <code>git:</code> e <code>hosted:</code></strong> em projetos grandes — confunde colaboradores.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>pub.dev é o repositório oficial de pacotes Dart/Flutter.</li>
        <li><code>dart pub add</code> instala e atualiza o pubspec.</li>
        <li>Use <code>^x.y.z</code> como constraint padrão (SemVer).</li>
        <li>O <code>pubspec.lock</code> grava versões exatas — comite em apps.</li>
        <li>Avalie pacotes por likes, pub points e popularity.</li>
        <li>Você também pode publicar seus próprios pacotes.</li>
      </ul>
    </PageContainer>
  );
}
