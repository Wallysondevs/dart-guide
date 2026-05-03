import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StreamController() {
  return (
    <PageContainer
      title="StreamController: criando streams manualmente"
      subtitle="Como produzir os próprios fluxos de eventos — base de padrões reativos como BLoC e ChangeNotifier."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine que você é o dono de uma rádio: tem o <strong>microfone</strong> (onde fala) e o <strong>transmissor</strong> (onde os ouvintes sintonizam). O microfone é seu, privado; a estação é pública. <code>StreamController</code> em Dart funciona assim: você guarda o controlador (microfone) e expõe a <code>stream</code> dele (transmissor) para quem quiser escutar.
      </p>

      <h2>Anatomia básica</h2>
      <pre><code>{`import 'dart:async';

void main() {
  final ctrl = StreamController<int>();

  // Quem escuta:
  ctrl.stream.listen(
    (n) => print('recebi \$n'),
    onDone: () => print('acabou'),
  );

  // Quem produz:
  ctrl.sink.add(1);
  ctrl.sink.add(2);
  ctrl.sink.add(3);

  // Sempre fechar quando terminar.
  ctrl.close();
}`}</code></pre>
      <p>
        <strong><code>sink</code></strong> é o lado &quot;entrada&quot; (você escreve nele com <code>add</code>, <code>addError</code>, <code>addStream</code>); <strong><code>stream</code></strong> é o lado &quot;saída&quot; (consumidor escuta).
      </p>

      <h2>Single vs broadcast</h2>
      <p>
        <code>StreamController()</code> cria por padrão um controller <em>single-subscription</em>. Para vários ouvintes simultâneos, use o construtor <code>broadcast</code>:
      </p>
      <pre><code>{`final s = StreamController<String>();           // 1 listener
final b = StreamController<String>.broadcast(); // N listeners

b.stream.listen((v) => print('A: \$v'));
b.stream.listen((v) => print('B: \$v'));
b.add('oi');`}</code></pre>

      <AlertBox type="warning" title="Single guarda buffer; broadcast não">
        Se ninguém estiver escutando ainda, o controller single armazena os eventos e dispara quando o listener chega. O broadcast <strong>descarta</strong> tudo que sai sem listener vivo.
      </AlertBox>

      <h2>Tratando erros e fim</h2>
      <pre><code>{`Future<void> main() async {
  final ctrl = StreamController<int>();

  ctrl.stream.listen(
    (n) => print('valor \$n'),
    onError: (e, st) => print('erro: \$e'),
    onDone: () => print('done'),
  );

  ctrl.add(10);
  ctrl.addError(StateError('algo falhou'));
  ctrl.add(20); // ainda chega — addError não fecha.
  await ctrl.close();
}`}</code></pre>

      <h2>onListen, onPause, onResume, onCancel</h2>
      <p>
        Para criar fontes de evento <em>sob demanda</em> (ex.: ligar um sensor só quando alguém escuta), passe callbacks ao construtor:
      </p>
      <pre><code>{`StreamController<int>? c;
Timer? timer;

void main() {
  c = StreamController<int>(
    onListen: () {
      print('alguém escutou — ligando sensor');
      var i = 0;
      timer = Timer.periodic(
        const Duration(seconds: 1),
        (_) => c!.add(i++),
      );
    },
    onPause: () {
      print('pausa — desligando sensor');
      timer?.cancel();
    },
    onResume: () {
      print('retomando');
    },
    onCancel: () async {
      print('cancelado — limpeza');
      timer?.cancel();
    },
  );

  final sub = c!.stream.listen((v) => print('val=\$v'));
  Future.delayed(const Duration(seconds: 3), sub.cancel);
}`}</code></pre>

      <h2>Caso prático: contador reativo (mini BLoC)</h2>
      <p>
        O padrão <strong>BLoC</strong> (Business Logic Component) — muito usado em Flutter — nada mais é que <code>StreamController</code>s expondo estado e recebendo eventos:
      </p>
      <pre><code>{`class ContadorBloc {
  int _valor = 0;
  final _saida = StreamController<int>.broadcast();
  final _entrada = StreamController<String>(); // 'inc' | 'dec' | 'reset'

  Stream<int> get valor => _saida.stream;
  Sink<String> get acao => _entrada.sink;

  ContadorBloc() {
    _entrada.stream.listen((evento) {
      switch (evento) {
        case 'inc': _valor++;
        case 'dec': _valor--;
        case 'reset': _valor = 0;
      }
      _saida.add(_valor);
    });
    _saida.add(_valor); // estado inicial
  }

  void dispose() {
    _entrada.close();
    _saida.close();
  }
}

void main() {
  final bloc = ContadorBloc();
  bloc.valor.listen((v) => print('contador = \$v'));
  bloc.acao.add('inc');
  bloc.acao.add('inc');
  bloc.acao.add('dec');
  bloc.acao.add('reset');
  bloc.dispose();
}`}</code></pre>

      <AlertBox type="info" title="No Flutter moderno">
        Hoje muita gente usa <em>Riverpod</em>, <em>Provider</em> ou <em>flutter_bloc</em> em vez de <code>StreamController</code> cru. Ainda assim, entender o controller é essencial — é o tijolo embaixo de quase tudo.
      </AlertBox>

      <h2>Boas práticas</h2>
      <ul>
        <li><strong>Sempre <code>close()</code></strong> no final do ciclo de vida (no <code>dispose</code> do widget, por exemplo).</li>
        <li><strong>Esconda o controller</strong>: exponha apenas <code>stream</code> e/ou <code>sink</code> publicamente.</li>
        <li><strong>Tipo explícito</strong>: <code>StreamController&lt;Algo&gt;()</code>. Sem isso, vira <code>dynamic</code>.</li>
        <li><strong>Errors têm que ser tratados</strong> — não-tratado vira unhandled.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>close</code>:</strong> a Stream nunca emite <code>onDone</code> e listeners ficam vivos eternamente.</li>
        <li><strong>Adicionar a controller fechado:</strong> exception. Cheque <code>isClosed</code>.</li>
        <li><strong>Usar single quando precisa de N listeners:</strong> erro <em>StreamController already listened</em>.</li>
        <li><strong>Expor o controller:</strong> consumidores podem fechar/quebrar a stream.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>StreamController</code> = ponte entre &quot;quem produz&quot; (sink) e &quot;quem consome&quot; (stream).</li>
        <li>Use <code>.broadcast()</code> para vários listeners simultâneos.</li>
        <li>Callbacks <code>onListen/onPause/onResume/onCancel</code> permitem fontes sob demanda.</li>
        <li>Base do padrão BLoC e de muitos sistemas reativos no Flutter.</li>
        <li><strong>Sempre feche</strong> o controller no fim.</li>
      </ul>
    </PageContainer>
  );
}
