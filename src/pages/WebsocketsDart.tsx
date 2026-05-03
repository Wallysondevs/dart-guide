import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function WebsocketsDart() {
  return (
    <PageContainer
      title="WebSockets em Dart: cliente e servidor"
      subtitle="Comunicação em tempo real bidirecional — o canal aberto que torna possíveis chats, notificações ao vivo e jogos online."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        HTTP tradicional é como um interfone: você toca, fala, espera resposta, desliga. Para cada pedido, uma nova ligação. <strong>WebSocket</strong> é diferente: é um <em>telefone aberto</em>. Cliente e servidor abrem a linha uma vez, e dali em diante qualquer um dos dois pode falar a qualquer momento, sem precisar chamar de novo. Por isso é a base de chats, dashboards ao vivo, multiplayer, etc.
      </p>

      <h2>O pacote web_socket_channel</h2>
      <p>
        Esse é o pacote oficial mantido pela equipe Dart. Ele oferece uma abstração chamada <code>WebSocketChannel</code> que funciona igual em servidor (<code>IOWebSocketChannel</code>, baseado em <code>dart:io</code>) e no navegador (<code>HtmlWebSocketChannel</code>). Uma única API, vários ambientes.
      </p>
      <pre><code>{`# pubspec.yaml
dependencies:
  web_socket_channel: ^3.0.0`}</code></pre>

      <h2>Cliente: conectando-se a um servidor</h2>
      <p>
        Vamos conectar a um servidor de eco público (<code>wss://</code> = WebSocket sobre TLS, equivalente seguro do <code>https://</code>):
      </p>
      <pre><code>{`import 'package:web_socket_channel/io.dart';

Future<void> main() async {
  // Abre o canal
  final canal = IOWebSocketChannel.connect(
    Uri.parse('wss://echo.websocket.events'),
  );

  // Stream: ouve mensagens vindas do servidor
  canal.stream.listen(
    (mensagem) => print('Recebido: \$mensagem'),
    onDone: () => print('Conexão fechada'),
    onError: (erro) => print('Erro: \$erro'),
  );

  // Sink: envia mensagens para o servidor
  canal.sink.add('Olá!');
  canal.sink.add('Tudo bem?');

  // Aguarda 2s e fecha
  await Future<void>.delayed(const Duration(seconds: 2));
  await canal.sink.close();
}`}</code></pre>
      <p>
        Note os dois lados do canal: <strong>stream</strong> (você escuta) e <strong>sink</strong> (você fala). Lembre-se: <em>Stream</em> em Dart é um cano de dados que vão chegando ao longo do tempo — você se inscreve com <code>listen</code>. <em>Sink</em> é a outra ponta: onde você joga dados pra dentro.
      </p>

      <AlertBox type="info" title="ws:// vs wss://">
        <code>ws://</code> é WebSocket cru (sem criptografia). <code>wss://</code> é WebSocket sobre TLS — sempre prefira em produção, igual a HTTPS.
      </AlertBox>

      <h2>Servidor: aceitando conexões com shelf_web_socket</h2>
      <p>
        Para criar um servidor WebSocket, combinamos <code>shelf</code> com <code>shelf_web_socket</code>. Cada cliente que conecta vira um <code>WebSocketChannel</code> independente:
      </p>
      <pre><code>{`# pubspec.yaml
dependencies:
  shelf: ^1.4.1
  shelf_web_socket: ^2.0.0
  web_socket_channel: ^3.0.0`}</code></pre>
      <pre><code>{`import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_web_socket/shelf_web_socket.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

Future<void> main() async {
  final handler = webSocketHandler((WebSocketChannel canal, _) {
    // Conexão estabelecida
    canal.sink.add('bem-vindo!');

    // Escuta o que o cliente envia
    canal.stream.listen(
      (msg) {
        print('Cliente disse: \$msg');
        canal.sink.add('echo: \$msg');
      },
      onDone: () => print('Cliente saiu'),
    );
  });

  await io.serve(handler, '0.0.0.0', 8080);
  print('WebSocket em ws://localhost:8080');
}`}</code></pre>

      <h2>Exemplo prático: mini chat broadcast</h2>
      <p>
        Vamos guardar todos os clientes conectados num <code>Set</code> e, sempre que um envia mensagem, repassar para os outros:
      </p>
      <pre><code>{`import 'package:shelf/shelf_io.dart' as io;
import 'package:shelf_web_socket/shelf_web_socket.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

final Set<WebSocketChannel> clientes = <WebSocketChannel>{};

void broadcast(String msg, WebSocketChannel autor) {
  for (final c in clientes) {
    if (c != autor) c.sink.add(msg);
  }
}

Future<void> main() async {
  final handler = webSocketHandler((WebSocketChannel canal, _) {
    clientes.add(canal);
    canal.sink.add('Você entrou. Há \${clientes.length} usuários.');

    canal.stream.listen(
      (msg) => broadcast(msg.toString(), canal),
      onDone: () => clientes.remove(canal),
    );
  });

  await io.serve(handler, '0.0.0.0', 8080);
  print('Chat ouvindo em ws://localhost:8080');
}`}</code></pre>
      <p>
        Em ~20 linhas você tem um servidor de chat funcional. Conecte vários clientes (testando com <code>websocat</code> ou um app Flutter) e veja as mensagens propagando.
      </p>

      <h2>Cliente em Flutter (com StreamBuilder)</h2>
      <pre><code>{`import 'package:flutter/material.dart';
import 'package:web_socket_channel/web_socket_channel.dart';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});
  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final canal = WebSocketChannel.connect(
    Uri.parse('ws://10.0.2.2:8080'),
  );
  final txt = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Chat')),
      body: Column(children: [
        Expanded(child: StreamBuilder(
          stream: canal.stream,
          builder: (_, snap) => Text(snap.data?.toString() ?? '...'),
        )),
        TextField(controller: txt, onSubmitted: (v) {
          canal.sink.add(v);
          txt.clear();
        }),
      ]),
    );
  }

  @override
  void dispose() {
    canal.sink.close();
    super.dispose();
  }
}`}</code></pre>

      <AlertBox type="warning" title="Endereço dentro do emulador">
        No emulador Android, <code>localhost</code> aponta para o próprio emulador, não pra sua máquina! Use <code>10.0.2.2</code>. No iOS Simulator, <code>localhost</code> funciona.
      </AlertBox>

      <h2>Heartbeat e reconexão</h2>
      <p>
        Conexões WebSocket morrem silenciosamente (Wi-Fi caiu, proxy cortou após inatividade). Em produção:
      </p>
      <ul>
        <li>Envie um <strong>ping</strong> periódico (a cada 30s) para detectar morte cedo.</li>
        <li>Implemente <strong>reconexão com backoff exponencial</strong>: tente em 1s, depois 2s, 4s, 8s, etc.</li>
        <li>Buffere mensagens enquanto desconectado.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Não fechar o canal</strong>: vaza memória e mantém socket aberto no servidor.</li>
        <li><strong>Chamar <code>sink.add</code> após <code>sink.close</code></strong>: dispara <code>StateError</code>.</li>
        <li><strong>Não tratar <code>onError</code></strong>: a conexão pode cair e seu app trava.</li>
        <li><strong>Tentar enviar binário como String</strong>: use <code>Uint8List</code> para dados binários.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>WebSocket = canal bidirecional persistente entre cliente e servidor.</li>
        <li><code>web_socket_channel</code> oferece API unificada para web e nativo.</li>
        <li>Cliente: <code>canal.stream.listen(...)</code> e <code>canal.sink.add(...)</code>.</li>
        <li>Servidor: <code>shelf_web_socket</code> com <code>webSocketHandler</code>.</li>
        <li>Em produção: heartbeat, reconexão e <code>wss://</code>.</li>
      </ul>
    </PageContainer>
  );
}
