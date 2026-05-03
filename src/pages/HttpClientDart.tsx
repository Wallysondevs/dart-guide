import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HttpClientDart() {
  return (
    <PageContainer
      title="Fazendo HTTP requests com dart:io HttpClient"
      subtitle="Como falar com APIs REST e baixar conteúdo da web usando o cliente HTTP nativo do Dart — e quando preferir o pacote http."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Toda vez que seu app abre uma página, faz login ou puxa uma lista de produtos, alguém está mandando uma <strong>requisição HTTP</strong> pela rede e esperando resposta. HTTP (HyperText Transfer Protocol) é o &quot;idioma&quot; padrão da web. O Dart traz, dentro de <code>dart:io</code>, uma classe pronta para essa conversa: <code>HttpClient</code>. É de baixo nível (você monta tudo na mão), mas entender ela ajuda a apreciar wrappers como o pacote <code>http</code>.
      </p>

      <h2>Anatomia de uma requisição</h2>
      <p>
        Toda chamada HTTP tem quatro partes: <strong>método</strong> (GET, POST, PUT, DELETE...), <strong>URL</strong>, <strong>cabeçalhos</strong> (metadados como <code>Content-Type</code>) e, opcionalmente, <strong>corpo</strong> (dados enviados). A resposta também tem cabeçalhos, corpo e um <strong>status code</strong> (200 = OK, 404 = não achou, 500 = erro servidor).
      </p>

      <h2>GET simples</h2>
      <pre><code>{`import 'dart:convert';
import 'dart:io';

Future<void> main() async {
  final client = HttpClient();
  try {
    final req = await client.getUrl(Uri.parse('https://api.github.com/zen'));
    // Aqui poderiamos setar headers: req.headers.add('User-Agent', 'meu-app');

    final resp = await req.close(); // dispara a requisicao e recebe a resposta
    print('Status: \${resp.statusCode}');

    // O corpo eh um Stream<List<int>>; transformamos em texto:
    final corpo = await resp.transform(utf8.decoder).join();
    print('Corpo: \$corpo');
  } finally {
    client.close(force: false); // libera recursos
  }
}`}</code></pre>
      <p>
        Note o &quot;duplo passo&quot;: <code>getUrl</code> devolve um <code>HttpClientRequest</code> que você pode <em>configurar</em> antes de mandar; só quando você chama <code>close()</code> é que a requisição efetivamente sai e a resposta chega.
      </p>

      <h2>POST com corpo JSON</h2>
      <p>
        Para enviar dados ao servidor, escrevemos no corpo da requisição. Um padrão clássico é mandar JSON: convertemos um <code>Map</code> em string com <code>jsonEncode</code>, definimos <code>Content-Type</code> e escrevemos via <code>req.write</code>.
      </p>
      <pre><code>{`import 'dart:convert';
import 'dart:io';

Future<Map<String, dynamic>> criarPost(String titulo, String corpo) async {
  final client = HttpClient();
  try {
    final req = await client.postUrl(
      Uri.parse('https://jsonplaceholder.typicode.com/posts'),
    );
    req.headers.contentType = ContentType('application', 'json', charset: 'utf-8');
    req.headers.add('Accept', 'application/json');

    // Corpo:
    final payload = jsonEncode({
      'title': titulo,
      'body': corpo,
      'userId': 1,
    });
    req.write(payload);

    final resp = await req.close();
    final texto = await resp.transform(utf8.decoder).join();

    if (resp.statusCode >= 200 && resp.statusCode < 300) {
      return jsonDecode(texto) as Map<String, dynamic>;
    }
    throw HttpException(
      'Falha (\${resp.statusCode}): \$texto',
      uri: req.uri,
    );
  } finally {
    client.close();
  }
}`}</code></pre>

      <AlertBox type="info" title="Por que <code>jsonEncode</code>?">
        HTTP transporta texto e bytes, não objetos Dart. Para mandar um <code>Map</code>, primeiro converta para string JSON (<code>jsonEncode</code>) e, do outro lado, converta de volta com <code>jsonDecode</code>. É a &quot;tradução&quot; padrão entre apps.
      </AlertBox>

      <h2>Lendo grande resposta como Stream</h2>
      <p>
        Para downloads de arquivos grandes, não decodifique tudo de uma vez — escreva o stream direto no disco:
      </p>
      <pre><code>{`import 'dart:io';

Future<void> baixar(String url, String destino) async {
  final client = HttpClient();
  try {
    final req = await client.getUrl(Uri.parse(url));
    final resp = await req.close();
    if (resp.statusCode != 200) {
      throw HttpException('status \${resp.statusCode}', uri: req.uri);
    }
    final saida = File(destino).openWrite();
    await resp.pipe(saida); // joga a resposta direto no arquivo
    print('baixado em: \$destino');
  } finally {
    client.close();
  }
}`}</code></pre>

      <h2>Status code: nem toda resposta &quot;recebida&quot; é sucesso</h2>
      <p>
        Um detalhe que pega muito iniciante: <code>HttpClient</code> só joga exceção em problemas <em>de rede</em> (DNS, conexão, timeout). Se o servidor responder <code>404</code> ou <code>500</code>, a requisição &quot;teve sucesso técnico&quot; — você precisa checar o <code>statusCode</code> e tratar manualmente.
      </p>
      <pre><code>{`final resp = await req.close();
final ok = resp.statusCode >= 200 && resp.statusCode < 300;

if (!ok) {
  final corpo = await resp.transform(utf8.decoder).join();
  throw HttpException(
    'HTTP \${resp.statusCode}: \$corpo',
    uri: req.uri,
  );
}`}</code></pre>

      <h2>Timeouts e cancelamento</h2>
      <p>
        Sem timeout, uma rede lenta pode pendurar seu app indefinidamente. Defina sempre limites:
      </p>
      <pre><code>{`import 'dart:async';
import 'dart:io';

Future<String> buscarComLimite(String url) async {
  final client = HttpClient()..connectionTimeout = const Duration(seconds: 5);
  try {
    final req = await client.getUrl(Uri.parse(url));
    final resp = await req
        .close()
        .timeout(const Duration(seconds: 10)); // timeout total da resposta

    return await resp.transform(SystemEncoding().decoder).join();
  } on TimeoutException {
    throw 'Servidor demorou demais.';
  } on SocketException catch (e) {
    throw 'Falha de rede: \${e.message}';
  } finally {
    client.close(force: true);
  }
}`}</code></pre>

      <AlertBox type="warning" title="Sempre feche o client">
        <code>HttpClient</code> mantém conexões reutilizáveis em memória. Se você cria um novo a cada chamada e nunca chama <code>close()</code>, o programa vaza handles. O padrão é: ou reutilize uma única instância para várias chamadas, ou feche em <code>finally</code>.
      </AlertBox>

      <h2>Quando preferir o pacote <code>http</code></h2>
      <p>
        O cliente nativo é poderoso mas verboso. Para a maioria dos apps, o pacote oficial <a href="https://pub.dev/packages/http">http</a> é mais ergonômico, funciona em <em>todas as plataformas</em> (incluindo Flutter Web, onde <code>dart:io</code> não roda) e tem API muito mais simples.
      </p>
      <pre><code>{`// pubspec.yaml: dependencies: http: ^1.2.0
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> listarPosts() async {
  final resp = await http.get(
    Uri.parse('https://jsonplaceholder.typicode.com/posts'),
    headers: {'Accept': 'application/json'},
  );
  if (resp.statusCode != 200) {
    throw Exception('HTTP \${resp.statusCode}');
  }
  return jsonDecode(resp.body) as List<dynamic>;
}

Future<void> exemplo() async {
  // POST com JSON em uma linha:
  final r = await http.post(
    Uri.parse('https://api.exemplo.com/login'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'user': 'ana', 'pass': 'segredo'}),
  );
  print(r.statusCode);
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Não checar <code>statusCode</code></strong> e tratar resposta 404 como se fosse JSON válido.</li>
        <li><strong>Esquecer <code>client.close()</code></strong> e vazar conexões.</li>
        <li><strong>Não definir timeout</strong> — apps congelam em redes lentas.</li>
        <li><strong>Usar <code>HttpClient</code> em Flutter Web</strong> e ver crash em runtime; lá use o pacote <code>http</code>.</li>
        <li><strong>Esquecer <code>Content-Type</code></strong> em POST — o servidor pode rejeitar ou parsear errado.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>HttpClient</code> de <code>dart:io</code>: cliente nativo de baixo nível, só fora do navegador.</li>
        <li>Fluxo: <code>getUrl/postUrl</code> → configurar → <code>close()</code> → consumir resposta como Stream.</li>
        <li>Erros HTTP (4xx, 5xx) <em>não</em> lançam exceção — cheque <code>statusCode</code> manualmente.</li>
        <li>Defina <code>connectionTimeout</code> e use <code>.timeout(...)</code> nas respostas.</li>
        <li>Sempre feche o client; reutilize a instância quando possível.</li>
        <li>Para apps reais (e Web), use o pacote <code>http</code> — mais simples e portável.</li>
      </ul>
    </PageContainer>
  );
}
