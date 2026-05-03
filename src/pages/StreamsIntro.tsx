import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StreamsIntro() {
  return (
    <PageContainer
      title="Streams: sequência assíncrona de eventos"
      subtitle="Se Future é uma carta que chega uma vez, Stream é uma assinatura de revista — vários eventos ao longo do tempo."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Um <code>Future&lt;T&gt;</code> entrega <strong>um único valor</strong> em algum momento futuro. Mas e quando você precisa de <em>vários valores ao longo do tempo</em>? Cliques de botão, mensagens de WebSocket, leituras de sensor, posições de GPS, notificações… para isso existe a <strong>Stream</strong>: uma sequência assíncrona de eventos. Pense num cano onde, de tempos em tempos, sai uma gota — a Stream é o cano; cada gota é um evento.
      </p>

      <h2>Future vs Stream</h2>
      <ul>
        <li><strong>Future&lt;T&gt;</strong>: 1 valor (sucesso ou erro), eventualmente.</li>
        <li><strong>Stream&lt;T&gt;</strong>: 0, 1, N valores (ou nenhum), terminada por &quot;done&quot; ou erro.</li>
      </ul>
      <pre><code>{`// Future: única entrega.
Future<int> futuroNumero() async => 42;

// Stream: várias entregas.
Stream<int> contagemRegressiva(int de) async* {
  for (var i = de; i >= 0; i--) {
    await Future.delayed(const Duration(seconds: 1));
    yield i; // emite um evento
  }
}`}</code></pre>

      <h2>Construtores prontos de Stream</h2>
      <p>
        Você raramente vai criar Streams do zero — a biblioteca padrão dá várias atalhos:
      </p>
      <pre><code>{`// 1) A partir de um Iterable (lista, set, geração).
final s1 = Stream.fromIterable([1, 2, 3]);

// 2) Periódica: emite a cada intervalo.
final s2 = Stream.periodic(
  const Duration(seconds: 1),
  (i) => 'tick #\$i',
).take(5);

// 3) A partir de uma Future.
final s3 = Stream.fromFuture(Future.value('pronto!'));

// 4) Vazia (útil em testes/condicionais).
final s4 = Stream<int>.empty();

// 5) Que sempre falha (útil em testes).
final s5 = Stream<int>.error(StateError('erro!'));`}</code></pre>

      <h2>Consumindo: listen()</h2>
      <p>
        A forma mais flexível é registrar callbacks com <code>listen</code>. Você recebe três tipos de evento: dado (<code>onData</code>), erro (<code>onError</code>) e fim (<code>onDone</code>).
      </p>
      <pre><code>{`void main() {
  final s = Stream<int>.periodic(
    const Duration(milliseconds: 500),
    (i) => i,
  ).take(4);

  final sub = s.listen(
    (n) => print('Recebi \$n'),
    onError: (e, st) => print('Erro: \$e'),
    onDone: () => print('Acabou!'),
    cancelOnError: true,
  );

  // Você pode pausar, retomar ou cancelar:
  // sub.pause(); sub.resume(); sub.cancel();
}`}</code></pre>
      <p>
        O retorno é um <code>StreamSubscription</code> — sua &quot;assinatura&quot;. Cancelar é importante para evitar vazamentos de memória.
      </p>

      <AlertBox type="warning" title="Sempre cancele em widgets que somem">
        No Flutter, dentro do <code>dispose()</code> do widget, chame <code>subscription.cancel()</code>. Esquecer isso é a causa #1 de leaks em apps Flutter.
      </AlertBox>

      <h2>Consumindo: await for</h2>
      <p>
        Dentro de função <code>async</code>, dá pra iterar com <code>await for</code> — sintaxe parecida com um <code>for</code> normal, porém esperando cada evento.
      </p>
      <pre><code>{`Future<void> imprimirTudo(Stream<int> s) async {
  await for (final n in s) {
    print('valor: \$n');
  }
  print('Stream terminou.');
}

void main() async {
  await imprimirTudo(Stream.fromIterable([10, 20, 30]));
}`}</code></pre>
      <p>
        Use <code>break</code> dentro do laço para cancelar a assinatura cedo.
      </p>

      <h2>Single-subscription vs Broadcast</h2>
      <p>
        Toda Stream é de um destes dois tipos:
      </p>
      <ul>
        <li><strong>Single-subscription</strong> (padrão): aceita <em>um único listener</em>. Se você chamar <code>listen</code> de novo, dá erro. Útil para fluxos que &quot;não podem perder eventos&quot;: leitura de arquivo, resposta HTTP.</li>
        <li><strong>Broadcast</strong>: aceita N listeners. Eventos são distribuídos a todos os assinantes <em>vivos no momento</em>. Eventos emitidos antes do listener entrar são perdidos. Útil para eventos UI (cliques, mouse).</li>
      </ul>
      <pre><code>{`final single = Stream.fromIterable([1, 2, 3]);
final bcast = single.asBroadcastStream(); // converte

bcast.listen((v) => print('A: \$v'));
bcast.listen((v) => print('B: \$v'));`}</code></pre>

      <AlertBox type="info" title="Stream parece infinita?">
        <code>Stream.periodic</code> nunca termina sozinha. Combine com <code>.take(n)</code> ou <code>.timeout(...)</code> para evitar loops eternos em testes.
      </AlertBox>

      <h2>Pequeno exemplo: chat ticker</h2>
      <pre><code>{`Stream<String> mensagensFalsas() async* {
  final lista = ['oi', 'tudo bem?', 'até mais'];
  for (final m in lista) {
    await Future.delayed(const Duration(seconds: 1));
    yield m;
  }
}

Future<void> main() async {
  await for (final msg in mensagensFalsas()) {
    print('chat> \$msg');
  }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Listen em single-subscription duas vezes:</strong> <em>Bad state: Stream has already been listened to</em>. Converta para broadcast antes.</li>
        <li><strong>Não cancelar subscription em widget:</strong> vaza memória, callbacks rodam após dispose.</li>
        <li><strong>Confundir Stream com Iterable:</strong> Stream é <em>assíncrona</em>; <code>List</code>/<code>Iterable</code> são síncronas.</li>
        <li><strong>Esquecer <code>.take(n)</code> em <code>Stream.periodic</code>:</strong> ele emite para sempre.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Stream&lt;T&gt;</code> = sequência assíncrona de eventos (0..N).</li>
        <li>Tipos: <em>single-subscription</em> (1 listener) e <em>broadcast</em> (N).</li>
        <li>Consuma com <code>listen</code> (mais controle) ou <code>await for</code> (mais simples).</li>
        <li>Construtores: <code>fromIterable</code>, <code>periodic</code>, <code>fromFuture</code>, <code>empty</code>.</li>
        <li>Sempre cancele assinaturas em widgets que somem.</li>
      </ul>
    </PageContainer>
  );
}
