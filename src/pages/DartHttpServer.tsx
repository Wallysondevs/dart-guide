import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartHttpServer() {
  return (
    <PageContainer
      title="Servidor HTTP em Dart: o framework shelf"
      subtitle="Como construir APIs web em Dart usando o pacote oficial shelf — pequeno, composável e sem mágica."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Um <strong>servidor HTTP</strong> é um programa que fica esperando ligações pela internet (porta TCP, geralmente 8080 ou 443), recebe pedidos vindos de navegadores ou apps e devolve respostas. É o garçom do restaurante: cliente faz o pedido, ele leva pra cozinha, traz a comida. Em Dart, o jeito padrão de escrever esse garçom é com o pacote <strong>shelf</strong>, mantido pela própria equipe Dart.
      </p>

      <h2>O conceito central: Handler</h2>
      <p>
        No shelf, todo o universo gira em torno de uma única função chamada <strong>Handler</strong> — um <em>typedef</em> (apelido para um tipo) que descreve uma função que recebe um <code>Request</code> e devolve um <code>Response</code> (eventualmente assíncrono).
      </p>
      <pre><code>{`// Definição conceitual do Handler:
// typedef Handler = FutureOr<Response> Function(Request request);

import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;

Response _ola(Request req) => Response.ok('Olá, mundo!');

Future<void> main() async {
  final servidor = await io.serve(_ola, 'localhost', 8080);
  print('Servindo em http://\${servidor.address.host}:\${servidor.port}');
}`}</code></pre>
      <p>
        Pronto: você tem um servidor real escutando na porta 8080. Acesse <code>http://localhost:8080</code> no navegador e verá o texto. Não há classes herdadas, não há decorators mágicos — só uma função.
      </p>

      <h2>Pipeline e middleware</h2>
      <p>
        Um <strong>middleware</strong> (literalmente &quot;programa do meio&quot;) é uma camada que intercepta o pedido antes do handler final, ou a resposta antes dela voltar. Pense em filtros de uma cafeteira: a água passa por vários estágios antes de virar café. No shelf, montamos a sequência com <code>Pipeline</code>:
      </p>
      <pre><code>{`import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;

Middleware logador() {
  return (Handler inner) {
    return (Request req) async {
      final t0 = DateTime.now();
      final resp = await inner(req);
      final ms = DateTime.now().difference(t0).inMilliseconds;
      print('\${req.method} \${req.url} → \${resp.statusCode} (\${ms}ms)');
      return resp;
    };
  };
}

void main() async {
  final pipeline = const Pipeline()
      .addMiddleware(logador())
      .addMiddleware(logRequests()) // built-in
      .addHandler((req) => Response.ok('ok'));

  await io.serve(pipeline, '0.0.0.0', 8080);
}`}</code></pre>

      <AlertBox type="info" title="Por que essa arquitetura?">
        Como handler é só uma função, qualquer coisa que receba e devolva uma função é compatível. Isso torna o shelf <em>composável</em>: autenticação, CORS, logging, compressão — todos viram middlewares plugáveis.
      </AlertBox>

      <h2>Roteamento com shelf_router</h2>
      <p>
        Para mapear caminhos como <code>/usuarios/123</code> para funções diferentes, usamos o pacote <code>shelf_router</code>:
      </p>
      <pre><code>{`import 'dart:convert';
import 'package:shelf/shelf.dart';
import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_router/shelf_router.dart';

void main() async {
  final router = Router()
    ..get('/saude', (Request r) => Response.ok('UP'))
    ..get('/usuarios/<id>', (Request r, String id) {
      return Response.ok(jsonEncode({'id': id, 'nome': 'Ana'}),
          headers: {'content-type': 'application/json'});
    })
    ..post('/usuarios', (Request r) async {
      final body = await r.readAsString();
      final dados = jsonDecode(body) as Map<String, dynamic>;
      return Response(201, body: jsonEncode({'criado': dados['nome']}));
    });

  final handler = const Pipeline()
      .addMiddleware(logRequests())
      .addHandler(router.call);

  await io.serve(handler, '0.0.0.0', 8080);
  print('API rodando em http://localhost:8080');
}`}</code></pre>

      <h2>Servindo arquivos estáticos</h2>
      <p>
        O pacote <code>shelf_static</code> resolve o caso clássico de servir HTML/CSS/JS de uma pasta:
      </p>
      <pre><code>{`import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_static/shelf_static.dart';

void main() async {
  final handler = createStaticHandler(
    'public',
    defaultDocument: 'index.html',
    listDirectories: false,
  );
  await io.serve(handler, '0.0.0.0', 8080);
}`}</code></pre>
      <p>
        Tudo dentro de <code>public/</code> é servido. <code>index.html</code> é mostrado quando o caminho é apenas <code>/</code>.
      </p>

      <h2>Deploy: container Docker</h2>
      <p>
        A forma mais comum de colocar um servidor Dart em produção é dentro de um container Docker. O Dockerfile fica curto:
      </p>
      <pre><code>{`# Dockerfile
FROM dart:stable AS build
WORKDIR /app
COPY pubspec.* ./
RUN dart pub get
COPY . .
RUN dart compile exe bin/server.dart -o bin/server

FROM scratch
COPY --from=build /runtime/ /
COPY --from=build /app/bin/server /app/bin/server
EXPOSE 8080
CMD ["/app/bin/server"]`}</code></pre>
      <p>
        O resultado é uma imagem de menos de 30MB. Compare com Node.js (Alpine ~80MB) ou Java (JRE ~250MB). Esse tamanho enxuto é vantagem para serverless e edge.
      </p>

      <AlertBox type="success" title="Comparação prática">
        Em relação ao <strong>Express</strong> (Node) ou <strong>Fastify</strong>, shelf é mais minimalista — sem decorators, sem injection container, sem ORM acoplado. Você compõe o que precisa. É a filosofia &quot;pequeno e tipado&quot; do Dart.
      </AlertBox>

      <h2>Quando usar shelf?</h2>
      <ul>
        <li><strong>Backend para app Flutter</strong>: cliente e servidor na mesma linguagem reduz contexto mental.</li>
        <li><strong>Microserviços</strong>: imagem pequena, AOT rápido, baixo consumo de memória.</li>
        <li><strong>API REST/JSON</strong>: o caso clássico, super bem servido.</li>
        <li><strong>Webhook/integração</strong>: rotas curtas que processam JSON.</li>
      </ul>
      <p>
        Para projetos maiores, considere <strong>Dart Frog</strong> (file-based routing) ou <strong>Serverpod</strong> (full-stack com codegen). Shelf é a base sob ambos.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Bind em <code>localhost</code> dentro de container</strong>: use <code>0.0.0.0</code> para aceitar conexões externas.</li>
        <li><strong>Esquecer o <code>content-type</code></strong> em respostas JSON — clientes podem confundir.</li>
        <li><strong>Bloquear o handler com I/O síncrono</strong>: use sempre versões assíncronas (<code>readAsString</code>, não <code>readAsStringSync</code>).</li>
        <li><strong>Não capturar exceções</strong> — adicione um middleware <em>try/catch</em> ou use <code>shelf_helmet</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Handler é uma função: <code>Request → Response</code>.</li>
        <li>Pipeline encadeia middlewares (log, auth, CORS, etc.).</li>
        <li><code>shelf_router</code> mapeia caminhos; <code>shelf_static</code> serve arquivos.</li>
        <li>Deploy em Docker resulta em imagens enxutas.</li>
        <li>Shelf é a base — Dart Frog e Serverpod são camadas acima dele.</li>
      </ul>
    </PageContainer>
  );
}
