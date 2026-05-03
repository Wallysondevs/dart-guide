import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartFrog() {
  return (
    <PageContainer
      title="Dart Frog: backend rápido inspirado no Next.js"
      subtitle="File-based routing, middleware composável e dev experience moderna em Dart, criado pela Very Good Ventures."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Se você já mexeu com <strong>Next.js</strong> ou <strong>SvelteKit</strong>, conhece a ideia de &quot;file-based routing&quot;: a estrutura de pastas <em>é</em> a estrutura das rotas. Cria <code>routes/usuarios.dart</code>? Acabou de criar a rota <code>/usuarios</code>. <strong>Dart Frog</strong>, da <em>Very Good Ventures</em>, traz essa filosofia para o backend Dart, em cima do confiável shelf, com hot-reload e CLI gostosa.
      </p>

      <h2>Instalação</h2>
      <pre><code>{`# Instala a CLI globalmente
dart pub global activate dart_frog_cli

# Cria um novo projeto
dart_frog create api_pedidos
cd api_pedidos

# Sobe servidor com hot-reload
dart_frog dev`}</code></pre>
      <p>
        Pronto: <code>http://localhost:8080</code> está respondendo. Edite qualquer arquivo dentro de <code>routes/</code> e o servidor recarrega — sem precisar matar e religar processo.
      </p>

      <h2>File-based routing</h2>
      <p>
        A estrutura de pastas vira rotas automaticamente. Cada arquivo Dart exporta uma função <code>onRequest</code> que recebe um <code>RequestContext</code>:
      </p>
      <pre><code>{`routes/
├── index.dart              → GET /
├── saude.dart              → GET /saude
├── usuarios/
│   ├── index.dart          → /usuarios
│   └── [id].dart           → /usuarios/:id (parâmetro dinâmico)
└── api/
    └── v1/
        └── pedidos.dart    → /api/v1/pedidos`}</code></pre>
      <pre><code>{`// routes/index.dart
import 'package:dart_frog/dart_frog.dart';

Response onRequest(RequestContext context) {
  return Response(body: 'Bem-vindo à API!');
}`}</code></pre>

      <h2>Diferenciando métodos HTTP</h2>
      <p>
        Use o <code>context.request.method</code> ou um <code>switch</code> com <em>pattern matching</em> (Dart 3):
      </p>
      <pre><code>{`// routes/usuarios/index.dart
import 'dart:convert';
import 'package:dart_frog/dart_frog.dart';

final _usuarios = <Map<String, Object?>>[];

Future<Response> onRequest(RequestContext context) async {
  return switch (context.request.method) {
    HttpMethod.get => Response.json(body: _usuarios),
    HttpMethod.post => await _criar(context),
    _ => Response(statusCode: 405, body: 'Método não permitido'),
  };
}

Future<Response> _criar(RequestContext context) async {
  final dados = await context.request.json() as Map<String, dynamic>;
  final novo = {'id': _usuarios.length + 1, 'nome': dados['nome']};
  _usuarios.add(novo);
  return Response.json(statusCode: 201, body: novo);
}`}</code></pre>

      <h2>Parâmetros dinâmicos com [colchetes]</h2>
      <p>
        Coloque colchetes no nome do arquivo para criar uma rota com parâmetro:
      </p>
      <pre><code>{`// routes/usuarios/[id].dart
import 'package:dart_frog/dart_frog.dart';

Response onRequest(RequestContext context, String id) {
  return Response.json(body: {'id': id, 'nome': 'Exemplo'});
}`}</code></pre>
      <p>
        Acesso: <code>GET /usuarios/42</code> chega com <code>id = &quot;42&quot;</code>.
      </p>

      <AlertBox type="info" title="Convenções inspiradas em Next.js">
        Quem vem do mundo JavaScript se sente em casa: <code>[id]</code> para param dinâmico, <code>_middleware.dart</code> para middleware do diretório, <code>index.dart</code> para a rota raiz da pasta.
      </AlertBox>

      <h2>Middleware por diretório</h2>
      <p>
        Crie um arquivo <code>_middleware.dart</code> em qualquer pasta. Ele se aplica a todas as rotas filhas — recursivamente. Perfeito para autenticação, logging, CORS.
      </p>
      <pre><code>{`// routes/api/_middleware.dart
import 'package:dart_frog/dart_frog.dart';

Handler middleware(Handler handler) {
  return (context) async {
    final token = context.request.headers['authorization'];
    if (token == null) {
      return Response(statusCode: 401, body: 'Não autorizado');
    }
    final response = await handler(context);
    return response.copyWith(headers: {
      ...response.headers,
      'x-powered-by': 'Dart Frog',
    });
  };
}`}</code></pre>

      <h2>Injeção de dependências (provider)</h2>
      <p>
        Para compartilhar instâncias (DB, repositório, logger) entre rotas, use <code>provider</code> dentro de um middleware:
      </p>
      <pre><code>{`// routes/_middleware.dart
import 'package:dart_frog/dart_frog.dart';
import '../lib/repositorio.dart';

final _repo = RepositorioUsuarios();

Handler middleware(Handler handler) {
  return handler.use(provider<RepositorioUsuarios>((_) => _repo));
}

// routes/usuarios/index.dart
Response onRequest(RequestContext context) {
  final repo = context.read<RepositorioUsuarios>();
  return Response.json(body: repo.listar());
}`}</code></pre>

      <h2>Build e deploy</h2>
      <pre><code>{`# Gera build de produção em build/
dart_frog build

# Cria também um Dockerfile pronto:
# build/Dockerfile

cd build
docker build -t minha-api .
docker run -p 8080:8080 minha-api`}</code></pre>
      <p>
        Como gera Dockerfile, deploy em Cloud Run, Fly.io, Railway, Render ou Kubernetes é trivial.
      </p>

      <h2>Comparando com shelf e Serverpod</h2>
      <ul>
        <li><strong>shelf</strong>: minimalista, você monta tudo. Ideal quando quer controle total.</li>
        <li><strong>Dart Frog</strong>: estrutura opinativa (file-based), hot-reload, CLI. Sweet spot para APIs REST/JSON médias.</li>
        <li><strong>Serverpod</strong>: full-stack com ORM, auth, real-time, codegen para cliente. Quando quer Dart fim-a-fim com todas as ferramentas.</li>
      </ul>

      <AlertBox type="success" title="Quando escolher Dart Frog?">
        Você quer construir uma API REST/JSON razoavelmente padrão, gosta da convenção sobre configuração e quer hot-reload de qualidade. É o &quot;Express do Dart&quot; com toques modernos.
      </AlertBox>

      <h2>Casos de uso</h2>
      <ul>
        <li>Backend para um app Flutter da própria equipe.</li>
        <li>API REST/JSON pública com poucos endpoints.</li>
        <li>Webhook receivers e proxies.</li>
        <li>BFF (Backend For Frontend) para um SPA web.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>_</code> em <code>_middleware.dart</code></strong>: o arquivo vira rota normal e aparece em <code>/middleware</code>.</li>
        <li><strong>Esquecer <code>await</code> em <code>context.request.json()</code></strong>: vem um <code>Future</code>, não os dados.</li>
        <li><strong>Estado global em variáveis top-level</strong>: funciona em dev, mas em produção com várias instâncias os dados não são compartilhados — use banco.</li>
        <li><strong>Editar <code>build/main.dart</code></strong> manualmente: é gerado, vai ser sobrescrito.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>File-based routing inspirado em Next.js.</li>
        <li>Middlewares por diretório com <code>_middleware.dart</code>.</li>
        <li>Hot-reload e Dockerfile pronto via <code>dart_frog build</code>.</li>
        <li>Sweet spot entre shelf (cru) e Serverpod (full-stack).</li>
        <li>Ótimo para APIs REST e BFF de apps Flutter.</li>
      </ul>
    </PageContainer>
  );
}
