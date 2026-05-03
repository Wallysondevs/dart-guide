import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HttpFlutter() {
  return (
    <PageContainer
      title="Consumindo APIs com http e dio"
      subtitle="Como conversar com servidores na web a partir do seu app Flutter, do GET simples ao retry com interceptor."
      difficulty="intermediario"
      timeToRead="15 min"
    >
      <p>
        Um app Flutter sozinho é uma ilha. Para ter notícias, contatos, mapas, ele precisa &quot;ligar para fora&quot; — para um servidor HTTP. Pense nisso como uma ligação telefônica: você disca um número (URL), faz um pedido (método), espera tocar (latência) e recebe uma resposta (JSON, geralmente). Vamos ver duas ferramentas: <code>http</code>, oficial e simples; e <code>dio</code>, mais robusto, com interceptor e timeout.
      </p>

      <h2>Instalando os pacotes</h2>
      <pre><code>{`# pubspec.yaml
dependencies:
  http: ^1.2.2
  dio: ^5.4.3+1`}</code></pre>
      <p>
        No Android, abra <code>android/app/src/main/AndroidManifest.xml</code> e garanta a permissão de internet (geralmente já vem):
      </p>
      <pre><code>{`<uses-permission android:name="android.permission.INTERNET" />`}</code></pre>

      <h2>GET simples com http</h2>
      <p>
        O método <code>get</code> retorna um <code>Future&lt;Response&gt;</code>. Um <strong>Future</strong> é uma promessa: &quot;daqui a alguns milissegundos teremos a resposta&quot;. Use <code>await</code> para esperar.
      </p>
      <pre><code>{`import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<Post>> buscarPosts() async {
  final uri = Uri.parse('https://jsonplaceholder.typicode.com/posts');
  final resp = await http.get(uri, headers: {
    'Accept': 'application/json',
  });

  if (resp.statusCode != 200) {
    throw Exception('Falha HTTP \${resp.statusCode}');
  }

  // jsonDecode transforma o texto JSON em estrutura Dart (List/Map).
  final lista = jsonDecode(resp.body) as List<dynamic>;
  return lista.map((j) => Post.fromJson(j as Map<String, dynamic>)).toList();
}`}</code></pre>

      <h2>Modelando a resposta</h2>
      <p>
        Trabalhar com <code>Map&lt;String, dynamic&gt;</code> é horrível: erra o nome de campo e o app explode em runtime. Sempre crie uma classe modelo com <code>fromJson</code>:
      </p>
      <pre><code>{`class Post {
  final int id;
  final String titulo;
  final String corpo;

  const Post({required this.id, required this.titulo, required this.corpo});

  factory Post.fromJson(Map<String, dynamic> j) => Post(
        id: j['id'] as int,
        titulo: j['title'] as String,
        corpo: j['body'] as String,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': titulo,
        'body': corpo,
      };
}`}</code></pre>

      <h2>POST com corpo JSON</h2>
      <pre><code>{`Future<Post> criarPost(String titulo, String corpo) async {
  final resp = await http.post(
    Uri.parse('https://jsonplaceholder.typicode.com/posts'),
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({'title': titulo, 'body': corpo, 'userId': 1}),
  );
  if (resp.statusCode != 201) {
    throw Exception('Falha ao criar');
  }
  return Post.fromJson(jsonDecode(resp.body) as Map<String, dynamic>);
}`}</code></pre>

      <h2>FutureBuilder: mostrando loading e dados</h2>
      <p>
        Como rede é assíncrona, a UI precisa lidar com três estados: carregando, erro, sucesso. <code>FutureBuilder</code> faz exatamente isso:
      </p>
      <pre><code>{`class TelaPosts extends StatefulWidget {
  const TelaPosts({super.key});
  @override
  State<TelaPosts> createState() => _TelaPostsState();
}

class _TelaPostsState extends State<TelaPosts> {
  late final Future<List<Post>> _futuro = buscarPosts();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Posts')),
      body: FutureBuilder<List<Post>>(
        future: _futuro,
        builder: (context, snap) {
          if (snap.connectionState != ConnectionState.done) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snap.hasError) {
            return Center(child: Text('Erro: \${snap.error}'));
          }
          final posts = snap.data!;
          return ListView.builder(
            itemCount: posts.length,
            itemBuilder: (_, i) => ListTile(
              title: Text(posts[i].titulo),
              subtitle: Text(posts[i].corpo, maxLines: 2),
            ),
          );
        },
      ),
    );
  }
}`}</code></pre>

      <AlertBox type="warning" title="Future criado em build = bug">
        Sempre crie o <code>Future</code> em <code>initState</code> ou em campo <code>late final</code>, nunca direto no <code>build</code>. Caso contrário, a cada rebuild uma nova requisição é disparada — você surra a API.
      </AlertBox>

      <h2>dio: HTTP com superpoderes</h2>
      <p>
        Para apps reais, <code>dio</code> é melhor: timeout configurável, interceptors (anexar token, log, retry), upload com progresso, cancelamento.
      </p>
      <pre><code>{`import 'package:dio/dio.dart';

final dio = Dio(BaseOptions(
  baseUrl: 'https://api.exemplo.com',
  connectTimeout: const Duration(seconds: 10),
  receiveTimeout: const Duration(seconds: 15),
  headers: {'Accept': 'application/json'},
))..interceptors.add(InterceptorsWrapper(
    onRequest: (options, handler) {
      // Anexa token de auth automaticamente.
      options.headers['Authorization'] = 'Bearer \$tokenAtual';
      return handler.next(options);
    },
    onError: (e, handler) {
      // Aqui dá pra implementar retry, logout em 401, etc.
      if (e.response?.statusCode == 401) {
        // ... renovar token e refazer
      }
      return handler.next(e);
    },
  ));

Future<List<Post>> buscarPostsDio() async {
  final r = await dio.get<List<dynamic>>('/posts');
  return r.data!.map((j) => Post.fromJson(j as Map<String, dynamic>)).toList();
}`}</code></pre>

      <h2>Tratamento de erro robusto</h2>
      <pre><code>{`try {
  final posts = await buscarPostsDio();
  // ...
} on DioException catch (e) {
  switch (e.type) {
    case DioExceptionType.connectionTimeout:
    case DioExceptionType.receiveTimeout:
      mostrarErro('Conexão lenta, tente novamente.');
    case DioExceptionType.badResponse:
      mostrarErro('Servidor retornou \${e.response?.statusCode}');
    default:
      mostrarErro('Sem internet?');
  }
} catch (_) {
  mostrarErro('Erro inesperado');
}`}</code></pre>

      <AlertBox type="tip" title="Use sempre HTTPS">
        Android 9+ e iOS 9+ bloqueiam HTTP em texto puro por padrão. Use HTTPS ou configure exceções (não recomendado em produção).
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer permissão de internet</strong> no Android — falha silenciosa.</li>
        <li><strong>jsonDecode dentro de cast errado</strong>: <code>as Map</code> em uma <code>List</code> = exception.</li>
        <li><strong>Não fechar requisições</strong>: dio tem <code>CancelToken</code> para abortar quando a tela some.</li>
        <li><strong>Bloquear UI esperando</strong>: sempre <code>await</code>, nunca <code>.then</code> em chains gigantes.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>http</code> resolve casos simples; <code>dio</code> escala melhor.</li>
        <li>Sempre modele a resposta com classe + <code>fromJson</code>.</li>
        <li><code>FutureBuilder</code> trata loading/error/data com elegância.</li>
        <li>Crie o Future em <code>initState</code>, nunca em <code>build</code>.</li>
        <li>Interceptors do dio: lugar perfeito para auth e retry.</li>
      </ul>
    </PageContainer>
  );
}
