import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GrpcDart() {
  return (
    <PageContainer
      title="gRPC com Dart: protobuf e codegen"
      subtitle="Comunicação cliente-servidor super rápida e tipada usando contratos .proto compartilhados."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <p>
        REST é como mandar carta: você envia texto (JSON), o outro lado precisa entender o formato e responder. <strong>gRPC</strong> (Remote Procedure Call do Google) é como ter um interfone direto: você &quot;chama uma função&quot; no servidor como se ela estivesse na sua máquina, e os dados trafegam num formato binário compactado chamado <strong>Protocol Buffers</strong> (ou protobuf). É mais rápido, menor e fortemente tipado — o compilador detecta erros que em REST só apareceriam em runtime.
      </p>

      <h2>O contrato: arquivo .proto</h2>
      <p>
        Tudo começa com um arquivo <code>.proto</code> que descreve <em>mensagens</em> (estruturas de dados) e <em>services</em> (funções que o servidor expõe). Esse arquivo é a fonte da verdade, compartilhado entre cliente e servidor.
      </p>
      <pre><code>{`// proto/saudacao.proto
syntax = "proto3";

package saudacao;

message PedidoSaudacao {
  string nome = 1;
}

message RespostaSaudacao {
  string mensagem = 1;
}

service Saudador {
  rpc Saudar(PedidoSaudacao) returns (RespostaSaudacao);
  rpc SaudarVarios(PedidoSaudacao) returns (stream RespostaSaudacao);
  rpc Conversar(stream PedidoSaudacao) returns (stream RespostaSaudacao);
}`}</code></pre>
      <p>
        Os números (<code>= 1</code>) não são valores; são <em>tags</em> que o protobuf usa para identificar campos no formato binário. Nunca mude um número depois que estiver em produção, ou clientes antigos quebram.
      </p>

      <h2>Geração de código com protoc</h2>
      <p>
        O <strong>protoc</strong> é o compilador que lê <code>.proto</code> e gera código Dart. Você precisa do plugin específico:
      </p>
      <pre><code>{`# Instala o plugin Dart do protoc
dart pub global activate protoc_plugin

# Gera os arquivos Dart
protoc --dart_out=grpc:lib/src/generated -Iproto proto/saudacao.proto

# Resultado:
# lib/src/generated/saudacao.pb.dart      → mensagens (PedidoSaudacao, RespostaSaudacao)
# lib/src/generated/saudacao.pbgrpc.dart  → cliente + base do servidor`}</code></pre>

      <AlertBox type="info" title="Não edite manualmente">
        Os arquivos <code>.pb.dart</code> e <code>.pbgrpc.dart</code> são <strong>gerados</strong>. Sempre regenere ao mudar o <code>.proto</code> — não tente corrigir o código gerado à mão.
      </AlertBox>

      <h2>Implementando o servidor</h2>
      <p>
        O codegen cria uma classe abstrata <code>SaudadorServiceBase</code>. Você herda e implementa os métodos:
      </p>
      <pre><code>{`# pubspec.yaml
dependencies:
  grpc: ^4.0.1
  protobuf: ^3.1.0`}</code></pre>
      <pre><code>{`import 'package:grpc/grpc.dart';
import 'src/generated/saudacao.pbgrpc.dart';

class ServicoSaudador extends SaudadorServiceBase {
  @override
  Future<RespostaSaudacao> saudar(
    ServiceCall call,
    PedidoSaudacao req,
  ) async {
    return RespostaSaudacao(mensagem: 'Olá, \${req.nome}!');
  }

  @override
  Stream<RespostaSaudacao> saudarVarios(
    ServiceCall call,
    PedidoSaudacao req,
  ) async* {
    for (var i = 1; i <= 3; i++) {
      await Future<void>.delayed(const Duration(seconds: 1));
      yield RespostaSaudacao(mensagem: 'Olá #\$i, \${req.nome}!');
    }
  }
}

Future<void> main() async {
  final server = Server.create(services: [ServicoSaudador()]);
  await server.serve(port: 50051);
  print('gRPC ouvindo na porta 50051');
}`}</code></pre>

      <h2>Cliente: chamando o servidor</h2>
      <pre><code>{`import 'package:grpc/grpc.dart';
import 'src/generated/saudacao.pbgrpc.dart';

Future<void> main() async {
  final canal = ClientChannel(
    'localhost',
    port: 50051,
    options: const ChannelOptions(
      credentials: ChannelCredentials.insecure(), // sem TLS p/ teste
    ),
  );

  final cliente = SaudadorClient(canal);

  // RPC unário
  final r = await cliente.saudar(PedidoSaudacao(nome: 'Maria'));
  print(r.mensagem); // Olá, Maria!

  // RPC server-streaming
  await for (final m in cliente.saudarVarios(PedidoSaudacao(nome: 'João'))) {
    print(m.mensagem);
  }

  await canal.shutdown();
}`}</code></pre>

      <h2>Streaming bidirecional</h2>
      <p>
        gRPC suporta quatro tipos de RPC: unário (1 pedido → 1 resposta), server-streaming (1 → N), client-streaming (N → 1) e <strong>bidirecional</strong> (N ↔ N, ambos enviam ao mesmo tempo). Bidi é perfeito para chats e jogos.
      </p>
      <pre><code>{`@override
Stream<RespostaSaudacao> conversar(
  ServiceCall call,
  Stream<PedidoSaudacao> requests,
) async* {
  await for (final pedido in requests) {
    yield RespostaSaudacao(mensagem: 'Eco: \${pedido.nome}');
  }
}

// No cliente:
final pedidos = Stream.fromIterable([
  PedidoSaudacao(nome: 'um'),
  PedidoSaudacao(nome: 'dois'),
]);
await for (final r in cliente.conversar(pedidos)) {
  print(r.mensagem);
}`}</code></pre>

      <h2>gRPC vs REST: quando usar?</h2>
      <ul>
        <li><strong>gRPC</strong>: comunicação interna entre microserviços, alta performance, contratos rígidos, streaming nativo, Flutter ↔ backend Dart.</li>
        <li><strong>REST</strong>: API pública consumida por qualquer linguagem, debugging simples (curl), cache HTTP, navegadores sem proxy.</li>
      </ul>
      <p>
        Em números aproximados: payload binário do protobuf é 3–10× menor que JSON; latência cai porque HTTP/2 multiplexa conexões. Mas você perde legibilidade no Wireshark e suporte direto no navegador (precisa de <em>gRPC-Web</em>, uma variante).
      </p>

      <AlertBox type="warning" title="Navegador não fala gRPC nativo">
        Para chamar gRPC do Flutter Web você precisa do <strong>gRPC-Web</strong> via proxy Envoy. No mobile/desktop/CLI, gRPC normal funciona direto.
      </AlertBox>

      <h2>TLS em produção</h2>
      <pre><code>{`final canal = ClientChannel(
  'api.meusite.com',
  port: 443,
  options: const ChannelOptions(
    credentials: ChannelCredentials.secure(),
  ),
);`}</code></pre>
      <p>
        No servidor, configure certificado X.509 via <code>Server.create(privateKey: ..., certificateChain: ...)</code>.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Mudar o número da tag</strong> de um campo — quebra compatibilidade silenciosamente.</li>
        <li><strong>Esquecer de regenerar</strong> após editar <code>.proto</code> — código fica desatualizado.</li>
        <li><strong>Não fechar o canal</strong> com <code>shutdown()</code> — vaza socket.</li>
        <li><strong>Tentar usar gRPC puro no navegador</strong> — precisa de gRPC-Web + proxy.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Define-se o contrato em <code>.proto</code>; <code>protoc</code> gera Dart.</li>
        <li>Protobuf é binário, compacto e fortemente tipado.</li>
        <li>Quatro modos: unário, server-stream, client-stream, bidi.</li>
        <li>Use gRPC entre serviços; use REST para APIs públicas.</li>
        <li>Para web, configure gRPC-Web com proxy.</li>
      </ul>
    </PageContainer>
  );
}
