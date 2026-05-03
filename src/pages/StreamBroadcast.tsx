import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StreamBroadcast() {
  return (
    <PageContainer
      title="Single-subscription vs Broadcast streams"
      subtitle="Entendendo a diferença entre uma fila particular (1 ouvinte) e uma estação de rádio (N ouvintes)."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <p>
        Streams em Dart vêm em <strong>dois sabores</strong>: <em>single-subscription</em> e <em>broadcast</em>. A diferença muda completamente o comportamento e gera muitas dúvidas para quem está começando. Pense assim: <strong>single</strong> é um WhatsApp privado — só uma pessoa lê e ela pode ler tudo desde o começo; <strong>broadcast</strong> é uma rádio — quem sintonizar tarde perde os primeiros segundos, mas várias pessoas podem ouvir ao mesmo tempo.
      </p>

      <h2>Single-subscription: o padrão</h2>
      <p>
        Quando você cria um <code>StreamController()</code> sem argumento, ou usa <code>Stream.fromIterable</code>, <code>Stream.fromFuture</code>, ou recebe a stream de uma resposta HTTP, ela é <strong>single-subscription</strong>. Características:
      </p>
      <ul>
        <li>Aceita <strong>um único <code>listen</code></strong> ao longo da vida.</li>
        <li>Se ninguém escuta ainda, a stream <strong>guarda eventos</strong> até alguém chegar (no caso de controllers).</li>
        <li>Garantia de não perder dados — ideal para arquivos, conexões, downloads.</li>
      </ul>
      <pre><code>{`final s = Stream.fromIterable([1, 2, 3]);
s.listen((v) => print('A: \$v'));
// s.listen((v) => print('B: \$v')); // ❌ Bad state: Stream has already been listened to.`}</code></pre>

      <h2>Broadcast: vários listeners</h2>
      <p>
        Use <code>StreamController.broadcast()</code> ou converta com <code>asBroadcastStream()</code>. Características:
      </p>
      <ul>
        <li>Aceita <strong>N listeners</strong> simultaneamente.</li>
        <li><strong>Não armazena buffer</strong>: eventos emitidos sem ouvinte são perdidos.</li>
        <li>Listeners que entram tarde <strong>perdem o que passou</strong>.</li>
      </ul>
      <pre><code>{`import 'dart:async';

Future<void> main() async {
  final ctrl = StreamController<int>.broadcast();

  ctrl.stream.listen((v) => print('A: \$v'));

  ctrl.add(1); // 'A: 1'
  ctrl.add(2); // 'A: 2'

  // Listener B chega depois — perde 1 e 2.
  ctrl.stream.listen((v) => print('B: \$v'));
  ctrl.add(3); // 'A: 3', 'B: 3'

  await ctrl.close();
}`}</code></pre>

      <AlertBox type="warning" title="Late listener miss">
        Em broadcast, <strong>quem chega tarde, perde os eventos passados</strong>. Se você precisa de &quot;estado atual + atualizações&quot;, considere padrões como <em>BehaviorSubject</em> (do pacote <code>rxdart</code>) que mantém o último valor.
      </AlertBox>

      <h2>asBroadcastStream(): convertendo single → broadcast</h2>
      <p>
        Tem uma stream single em mãos e precisa de vários listeners? Use <code>asBroadcastStream()</code>. Cuidado: ele &quot;começa a escutar&quot; a original imediatamente.
      </p>
      <pre><code>{`final original = Stream.periodic(
  const Duration(seconds: 1),
  (i) => i,
).take(5);

final bcast = original.asBroadcastStream();

bcast.listen((v) => print('X: \$v'));
bcast.listen((v) => print('Y: \$v'));`}</code></pre>
      <p>
        Os parâmetros <code>onListen</code> e <code>onCancel</code> deixam você reagir quando o primeiro listener entra ou o último sai — útil para parar/reiniciar a fonte.
      </p>

      <h2>Pause, resume e cancel: comportamento difere</h2>
      <p>
        Em <strong>single</strong>, pausar a única assinatura <em>pausa a fonte</em> — eventos ficam represados. Em <strong>broadcast</strong>, pausar uma assinatura só pausa <em>aquela</em>, e ela perde tudo no intervalo.
      </p>
      <pre><code>{`final ctrl = StreamController<int>.broadcast();
final sub = ctrl.stream.listen(print);
sub.pause();
ctrl.add(1);   // perdido para 'sub'
ctrl.add(2);   // perdido
sub.resume();  // não recupera os anteriores`}</code></pre>

      <h2>Quando usar cada um</h2>
      <ul>
        <li><strong>Single</strong>: leitura de arquivo, resposta HTTP, importação de dados, qualquer coisa onde &quot;perder evento = bug&quot;.</li>
        <li><strong>Broadcast</strong>: cliques, eventos de UI, mensagens de WebSocket compartilhadas entre telas, atualizações de localização.</li>
      </ul>

      <AlertBox type="info" title="Hot vs Cold">
        Em terminologia reativa, single ≈ <em>cold stream</em> (cada subscrição re-executa a fonte) e broadcast ≈ <em>hot stream</em> (a fonte roda independente). É um modelo mental útil quando você for para RxDart.
      </AlertBox>

      <h2>Convertendo broadcast em &quot;com último valor&quot;</h2>
      <p>
        Se quer broadcast mas com &quot;último valor para quem chegar&quot;, monte manualmente:
      </p>
      <pre><code>{`class StreamCacheado<T> {
  final StreamController<T> _ctrl = StreamController<T>.broadcast();
  T? _ultimo;

  Stream<T> get stream async* {
    if (_ultimo != null) yield _ultimo as T;
    yield* _ctrl.stream;
  }

  void add(T v) {
    _ultimo = v;
    _ctrl.add(v);
  }

  Future<void> close() => _ctrl.close();
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Listen duplo em single:</strong> <em>Stream has already been listened to</em>. Converta para broadcast.</li>
        <li><strong>Esperar buffer em broadcast:</strong> não existe — eventos sem ouvinte somem.</li>
        <li><strong>Pausar broadcast esperando &quot;recuperar depois&quot;:</strong> não funciona; eventos no intervalo são perdidos.</li>
        <li><strong>Confundir asBroadcastStream com hot reload de eventos passados:</strong> ele só converte daqui para frente.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Single-subscription: 1 listener; pode ter buffer; ideal para fluxos &quot;não pode perder&quot;.</li>
        <li>Broadcast: N listeners; sem buffer; quem chega tarde perde.</li>
        <li><code>asBroadcastStream()</code> converte single em broadcast.</li>
        <li>Pause/resume se comportam diferente nos dois tipos.</li>
        <li>Para &quot;último valor + atualizações&quot;, use BehaviorSubject (rxdart) ou implemente cache manual.</li>
      </ul>
    </PageContainer>
  );
}
