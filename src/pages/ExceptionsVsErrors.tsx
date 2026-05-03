import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ExceptionsVsErrors() {
  return (
    <PageContainer
      title="Exception vs Error: a diferença que importa"
      subtitle="Em Dart, há dois tipos de coisas que podem ser lançadas. Confundir os dois é a fonte de muitos bugs — e de muito código defensivo desnecessário."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Imagine que você é um carteiro entregando encomendas. Existem dois tipos de problema que podem aparecer: o destinatário não está em casa (acontece o tempo todo, você anota e tenta de novo) ou o seu caminhão pega fogo no meio da rua (não acontece em condições normais; algo está muito errado). O primeiro caso é uma situação <em>esperada</em> que você sabe lidar. O segundo é um <em>bug</em> do mundo — você não tem como tratar com elegância no meio do trajeto. Em Dart, essa mesma distinção existe e tem nome: <strong>Exception</strong> e <strong>Error</strong>.
      </p>

      <h2>A hierarquia dos &quot;throwables&quot;</h2>
      <p>
        Dart permite que você lance (com <code>throw</code>) <em>qualquer</em> objeto. Mas, por convenção, o mundo Dart se organiza em duas árvores principais que implementam um conceito comum chamado &quot;throwable&quot;:
      </p>
      <pre><code>{`// Visão simplificada da hierarquia da biblioteca core do Dart:
//
// Object
//  ├── Exception (interface)         <- erros recuperáveis
//  │    ├── FormatException
//  │    ├── IOException
//  │    └── TimeoutException
//  └── Error (classe)                <- bugs do programador
//       ├── StateError
//       ├── RangeError
//       ├── ArgumentError
//       ├── TypeError
//       └── UnsupportedError
//
// Você pode lançar QUALQUER objeto, mas siga a convenção.`}</code></pre>

      <h2>Exception: condição esperada</h2>
      <p>
        Uma <code>Exception</code> representa algo que <em>pode dar errado em condições normais</em> e que você, como programador, deveria estar preparado para tratar. Exemplos clássicos: o arquivo que você quer ler não existe, a rede caiu, o usuário digitou um e-mail malformado, a API remota respondeu HTTP 503. Nada disso é &quot;bug do código&quot; — é a vida acontecendo. Para esses casos, você usa <code>try/catch</code> e segue em frente.
      </p>
      <pre><code>{`import 'dart:io';

Future<String> lerConfig(String caminho) async {
  final arquivo = File(caminho);
  try {
    return await arquivo.readAsString();
  } on PathNotFoundException {
    // Esperado: o arquivo pode não existir na primeira execução.
    return '{}'; // devolve config padrão
  } on FileSystemException catch (e) {
    // Esperado: permissão negada, disco cheio, etc.
    print('Falha de IO: \${e.message}');
    rethrow;
  }
}`}</code></pre>

      <AlertBox type="info" title="Regra de bolso">
        Se a única forma de evitar a exceção é <strong>checar o ambiente antes</strong> (existe arquivo? rede está de pé?), então é uma <code>Exception</code> e você deve tratar.
      </AlertBox>

      <h2>Error: bug do programador</h2>
      <p>
        Já um <code>Error</code> sinaliza um <em>defeito no código</em>. Não é algo a ser &quot;tratado&quot; — é algo a ser <em>corrigido</em>. Acessar índice -1 de uma lista (<code>RangeError</code>), chamar um método em um objeto em estado inválido (<code>StateError</code>), passar <code>null</code> onde se exige não-nulo (<code>ArgumentError</code>): tudo isso é culpa de quem escreveu o programa. A reação correta é deixar o programa quebrar, ler o stack trace e arrumar.
      </p>
      <pre><code>{`void exemploDeBug() {
  final lista = <int>[10, 20, 30];
  print(lista[10]); // RangeError: indice fora dos limites
                    // Não capture isso; conserte o codigo!

  final iter = lista.iterator;
  // Esqueci de chamar moveNext():
  print(iter.current); // StateError: nao iniciado
}

// Forma idiomatica de validar argumentos e LANCAR um Error:
int dividir(int a, int b) {
  if (b == 0) {
    throw ArgumentError.value(b, 'b', 'nao pode ser zero');
  }
  return a ~/ b;
}`}</code></pre>

      <h2>Por que essa diferença importa?</h2>
      <p>
        Porque dita o estilo do seu código. <strong>Exception você captura; Error você previne.</strong> Se você ficar envolvendo todo bloco em <code>try &#123; ... &#125; catch (_) &#123;&#125;</code> só para o app não crashar, você está mascarando bugs e deixando o programa em estado inconsistente — pior do que crashar. O crash, ao menos, te dá um stack trace para investigar.
      </p>
      <pre><code>{`// ANTI-PATTERN: silenciar tudo
try {
  fazerCoisa();
} catch (_) {
  // engole geral, inclusive bugs reais
}

// CORRETO: capture o tipo certo
try {
  await api.buscarUsuario();
} on TimeoutException {
  mostrarSnack('Servidor demorou demais.');
} on FormatException catch (e) {
  log.warning('JSON malformado: \${e.message}');
}`}</code></pre>

      <AlertBox type="warning" title="Nunca capture Error de propósito">
        Se você se vê fazendo <code>on Error</code>, pare. Provavelmente o código a montante está com bug — corrija lá. <code>Error</code>s indicam violações de contrato.
      </AlertBox>

      <h2>Onde &quot;throwable&quot; entra?</h2>
      <p>
        O termo &quot;throwable&quot; (vindo do Java) descreve qualquer objeto que pode ser lançado por <code>throw</code>. Em Dart, isso é literalmente <em>qualquer Object</em>. Lançar uma <code>String</code> é sintaticamente válido, mas é considerado mau gosto: você perde a hierarquia de tipos, perde o stack trace bem formatado e dificulta o <code>on Tipo catch</code>. Sempre lance algo que estende <code>Exception</code> ou <code>Error</code>.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Capturar <code>Error</code> para esconder bug:</strong> camufla o problema; o app continua rodando em estado quebrado.</li>
        <li><strong>Lançar <code>String</code></strong> ou <code>int</code> em vez de uma classe — funciona, mas atrapalha o tratamento por tipo.</li>
        <li><strong>Confundir <code>Exception</code> com tipo concreto</strong>: <code>Exception</code> é só uma interface; em logs <code>e.toString()</code> dá &quot;Exception&quot; sem detalhe. Prefira tipos específicos como <code>FormatException</code>.</li>
        <li><strong>Achar que <code>Error</code> é &quot;mais grave&quot; que <code>Exception</code>:</strong> não é; é <em>diferente</em>. Error = bug; Exception = condição esperada.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Exception</code>: condição esperada, recuperável (arquivo não existe, rede caiu) — capture com <code>try/catch</code>.</li>
        <li><code>Error</code>: bug do programador (índice fora, estado inválido) — corrija o código, não capture.</li>
        <li>Em Dart você pode lançar qualquer <code>Object</code>, mas sempre prefira algo da hierarquia <code>Exception</code>/<code>Error</code>.</li>
        <li>Capturar tudo com <code>catch (_)</code> mascara bugs — pior do que deixar crashar.</li>
        <li>Use tipos específicos no <code>on</code> (ex: <code>on TimeoutException</code>) para tratar com precisão.</li>
      </ul>
    </PageContainer>
  );
}
