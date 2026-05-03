import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartServerpod() {
  return (
    <PageContainer
      title="Serverpod: framework backend full-stack em Dart"
      subtitle="Backend completo em Dart com ORM, autenticação, real-time e código compartilhado com seu app Flutter."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <p>
        Imagine que você tem um time pequeno construindo um app Flutter e precisa de backend. Em vez de aprender Node, escolher um ORM, configurar Postgres, montar autenticação do zero e criar uma camada de WebSocket para tempo real, você usa <strong>uma ferramenta só</strong> que vem com tudo pré-montado e fala Dart de ponta a ponta. Essa é a proposta do <strong>Serverpod</strong>: um framework backend full-stack escrito em Dart, criado pensando em apps Flutter.
      </p>

      <h2>O que vem na caixa</h2>
      <ul>
        <li><strong>ORM próprio</strong> com migrações geradas a partir de arquivos YAML.</li>
        <li><strong>Code generation</strong> de cliente Dart tipado — o app chama métodos como se fossem locais.</li>
        <li><strong>Autenticação</strong> built-in (email/senha, Google, Apple, Firebase).</li>
        <li><strong>Real-time</strong> via Streaming Endpoints (WebSocket por baixo).</li>
        <li><strong>Cache</strong> distribuído com Redis.</li>
        <li><strong>Tarefas em fila</strong> (Future Calls) e cron.</li>
        <li><strong>Cloud deploy</strong> com Terraform pré-pronto para AWS/GCP.</li>
      </ul>

      <h2>Estrutura de um projeto</h2>
      <p>
        Ao rodar <code>serverpod create meu_projeto</code>, você ganha três pastas:
      </p>
      <pre><code>{`meu_projeto/
├── meu_projeto_server/      # backend Dart
├── meu_projeto_client/      # cliente Dart gerado (auto)
└── meu_projeto_flutter/     # app Flutter já configurado`}</code></pre>
      <p>
        O cliente é <strong>regenerado automaticamente</strong> sempre que você muda o servidor. Adicionou um endpoint? Salvou? Já está disponível tipado no Flutter. Sem Postman, sem swagger, sem decorators de OpenAPI — o tipo viaja nativamente.
      </p>

      <h2>Definindo um modelo (entidade)</h2>
      <p>
        Modelos são descritos em YAML. O Serverpod gera classe Dart, tabela Postgres, migração e código de serialização.
      </p>
      <pre><code>{`# meu_projeto_server/lib/src/protocol/usuario.spy.yaml
class: Usuario
table: usuario
fields:
  nome: String
  email: String
  idade: int?
  criadoEm: DateTime, defaultPersist=now
indexes:
  email_unique:
    fields: email
    unique: true`}</code></pre>
      <pre><code>{`# Gera código Dart + migração SQL
serverpod generate
serverpod create-migration`}</code></pre>

      <h2>Endpoints: a API do servidor</h2>
      <p>
        Endpoints são classes que estendem <code>Endpoint</code>. Cada método público vira automaticamente uma chamada de API.
      </p>
      <pre><code>{`import 'package:serverpod/serverpod.dart';
import '../generated/protocol.dart';

class UsuarioEndpoint extends Endpoint {
  Future<Usuario> criar(Session s, String nome, String email) async {
    final u = Usuario(nome: nome, email: email);
    await Usuario.db.insertRow(s, u);
    return u;
  }

  Future<List<Usuario>> listar(Session s) async {
    return Usuario.db.find(s, orderBy: (t) => t.nome);
  }

  Future<Usuario?> buscarPorEmail(Session s, String email) async {
    return Usuario.db.findFirstRow(
      s,
      where: (t) => t.email.equals(email),
    );
  }
}`}</code></pre>

      <h2>Chamando do Flutter (com tipo!)</h2>
      <p>
        No app, importe o cliente gerado e chame como se fosse uma função local:
      </p>
      <pre><code>{`import 'package:meu_projeto_client/meu_projeto_client.dart';

final client = Client('http://localhost:8080/')
  ..connectivityMonitor = FlutterConnectivityMonitor();

Future<void> exemplo() async {
  final novo = await client.usuario.criar('Maria', 'maria@ex.com');
  print('Criado id=\${novo.id}');

  final lista = await client.usuario.listar();
  for (final u in lista) {
    print('\${u.id}: \${u.nome}');
  }
}`}</code></pre>

      <AlertBox type="info" title="A grande sacada">
        Não há JSON manual, não há cast, não há &quot;esqueci de atualizar o cliente&quot;. Mudou o servidor → rodou <code>serverpod generate</code> → o IDE já mostra novos métodos no Flutter.
      </AlertBox>

      <h2>Real-time com Streaming Endpoints</h2>
      <p>
        Para chat ou dashboards ao vivo, use <code>StreamingEndpoint</code>. Cada cliente conectado tem uma sessão persistente; o servidor pode enviar mensagens a qualquer momento.
      </p>
      <pre><code>{`class ChatEndpoint extends Endpoint {
  @override
  Future<void> streamOpened(StreamingSession s) async {
    print('Cliente conectado');
  }

  @override
  Future<void> handleStreamMessage(
    StreamingSession s,
    SerializableEntity msg,
  ) async {
    if (msg is MensagemChat) {
      // Re-emite para todos os outros clientes
      for (final outra in await sessionManager.streamingSessions) {
        sendStreamMessage(outra, msg);
      }
    }
  }
}`}</code></pre>

      <h2>Autenticação built-in</h2>
      <p>
        Adicione o módulo <code>serverpod_auth</code> ao <code>pubspec.yaml</code> do servidor. Ele já cria tabelas, endpoints (<code>signIn</code>, <code>signOut</code>, <code>signUp</code>), envio de email de verificação e suporte a OAuth (Google/Apple/Firebase).
      </p>
      <pre><code>{`dependencies:
  serverpod_auth_server: ^2.1.0
  serverpod_auth_email_server: ^2.1.0`}</code></pre>
      <pre><code>{`// Endpoint protegido
class PrivadoEndpoint extends Endpoint {
  @override
  bool get requireLogin => true;

  Future<String> meuPerfil(Session s) async {
    final userId = await s.authenticated;
    return 'Olá usuário \$userId';
  }
}`}</code></pre>

      <AlertBox type="success" title="Casos de uso">
        Serverpod brilha quando: 1) você quer Dart fim-a-fim; 2) o app é Flutter-first; 3) precisa de real-time + autenticação sem juntar 5 libs.
      </AlertBox>

      <h2>Deploy</h2>
      <p>
        O CLI fornece <strong>Terraform</strong> pronto para subir AWS (com ALB, Postgres RDS, Redis, S3) ou GCP. Para projetos menores, basta um Docker Compose com Postgres + Redis + a imagem do servidor.
      </p>
      <pre><code>{`# Terraform deploy
cd meu_projeto_server/deploy/aws/terraform
terraform init
terraform apply`}</code></pre>

      <h2>Quando NÃO usar Serverpod?</h2>
      <ul>
        <li>Você precisa de um endpoint REST público consumido por times em outras linguagens (use shelf + OpenAPI).</li>
        <li>Backend mínimo, microsserviço pequeno (use Dart Frog ou shelf direto).</li>
        <li>Sua equipe odeia codegen.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>serverpod generate</code></strong> após mudar YAML/endpoint — cliente fica desatualizado.</li>
        <li><strong>Deploy sem migração rodada</strong>: a tabela não existe e o servidor explode.</li>
        <li><strong>Mexer manualmente em arquivos gerados</strong>: tudo é sobrescrito na próxima geração.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Backend Dart full-stack: ORM, auth, real-time, cache, jobs.</li>
        <li>Cliente Dart é gerado automaticamente — chamada tipada de ponta a ponta.</li>
        <li>Endpoints são classes Dart; modelos são YAML.</li>
        <li>Ideal para apps Flutter com necessidade de backend rico.</li>
        <li>Deploy via Terraform pronto para AWS/GCP.</li>
      </ul>
    </PageContainer>
  );
}
