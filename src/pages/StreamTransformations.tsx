import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StreamTransformations() {
  return (
    <PageContainer
      title="Transformando streams: map, where, transform"
      subtitle="A mesma cara dos métodos de Iterable, só que assíncrona — pipelines reativos limpos."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Se você já usou <code>list.map(...).where(...)</code>, vai se sentir em casa. Streams têm os mesmos verbos para construir <strong>pipelines de transformação</strong>: cada etapa devolve uma nova Stream, e nada roda até alguém escutar. Imagine uma esteira de fábrica: a peça entra crua na primeira estação, vai sendo refinada em cada estação seguinte, e sai pronta no final.
      </p>

      <h2>map: transformar cada evento</h2>
      <pre><code>{`Stream<int> numeros = Stream.fromIterable([1, 2, 3]);
Stream<String> texto = numeros.map((n) => 'n=\$n');

texto.listen(print);
// n=1
// n=2
// n=3`}</code></pre>

      <h2>where: filtrar eventos</h2>
      <pre><code>{`Stream.fromIterable([1, 2, 3, 4, 5])
    .where((n) => n.isEven)
    .listen(print);
// 2
// 4`}</code></pre>

      <h2>take, skip, distinct</h2>
      <pre><code>{`final s = Stream.fromIterable([1, 1, 2, 2, 3, 3, 4])
    .distinct()       // remove duplicados consecutivos
    .skip(1)          // pula os primeiros N
    .take(2);         // pega só os primeiros N

s.listen(print);
// 2
// 3`}</code></pre>
      <p>
        <code>distinct()</code> compara cada evento com o <em>imediatamente anterior</em>. Não é um &quot;set global&quot;: <code>[1,2,1,2]</code> sai todo mundo.
      </p>

      <h2>asyncMap: transformação assíncrona</h2>
      <p>
        Quando a transformação envolve outro Future (ex: chamar API por evento), use <code>asyncMap</code>. Ele <strong>espera</strong> o Future de cada evento antes de processar o próximo, garantindo ordem.
      </p>
      <pre><code>{`Future<String> buscarTitulo(int id) async {
  await Future.delayed(const Duration(milliseconds: 200));
  return 'titulo \$id';
}

void main() {
  Stream.fromIterable([1, 2, 3])
      .asyncMap(buscarTitulo)
      .listen(print);
  // titulo 1, titulo 2, titulo 3 (em ordem)
}`}</code></pre>

      <AlertBox type="info" title="asyncExpand para múltiplos eventos por entrada">
        <code>asyncMap</code> entrega 1 saída por entrada. Se cada entrada gera <em>vários</em> eventos, use <code>asyncExpand</code> — semelhante a <code>flatMap</code> de outras linguagens.
      </AlertBox>

      <h2>expand e asyncExpand: 1→N</h2>
      <pre><code>{`Stream.fromIterable([1, 2, 3])
    .expand((n) => [n, n * 10])
    .listen(print);
// 1, 10, 2, 20, 3, 30

Stream.fromIterable(['ana', 'bia']).asyncExpand((nome) async* {
  yield 'oi, \$nome';
  await Future.delayed(const Duration(milliseconds: 100));
  yield 'tchau, \$nome';
}).listen(print);`}</code></pre>

      <h2>transform com StreamTransformer custom</h2>
      <p>
        Para casos avançados, crie seu próprio <code>StreamTransformer</code>. Por exemplo, um buffer que junta eventos a cada N:
      </p>
      <pre><code>{`import 'dart:async';

StreamTransformer<int, List<int>> buffer(int n) {
  return StreamTransformer.fromHandlers(
    handleData: (() {
      final chunk = <int>[];
      return (int v, EventSink<List<int>> sink) {
        chunk.add(v);
        if (chunk.length >= n) {
          sink.add(List.of(chunk));
          chunk.clear();
        }
      };
    })(),
    handleDone: (sink) => sink.close(),
  );
}

void main() {
  Stream.fromIterable([1, 2, 3, 4, 5, 6, 7])
      .transform(buffer(3))
      .listen(print);
  // [1, 2, 3]
  // [4, 5, 6]
  // (7 fica retido — buffer parcial)
}`}</code></pre>

      <h2>Encadeamento fluente</h2>
      <pre><code>{`Stream.periodic(const Duration(milliseconds: 100), (i) => i)
    .take(20)
    .where((n) => n.isEven)
    .map((n) => n * n)
    .listen((v) => print('quadrado par: \$v'));`}</code></pre>

      <h2>Debounce e throttle (via package)</h2>
      <p>
        A biblioteca padrão <em>não</em> traz <code>debounce</code>/<code>throttle</code>. Use o pacote <code>rxdart</code> ou <code>stream_transform</code>:
      </p>
      <pre><code>{`// pubspec.yaml -> dependencies: rxdart: ^0.27.0
import 'package:rxdart/rxdart.dart';

void main() {
  final input = Stream.fromIterable(['a', 'ab', 'abc'])
      .debounceTime(const Duration(milliseconds: 300));
  input.listen(print); // só o último 'abc' (após 300ms parado)
}`}</code></pre>

      <AlertBox type="warning" title="Cada chamada cria uma Stream nova">
        <code>map</code>, <code>where</code> etc. NÃO modificam a stream original — devolvem uma nova. Se você escutar a original em paralelo, ela é independente das transformadas.
      </AlertBox>

      <h2>Caso real: barra de busca reativa</h2>
      <pre><code>{`Stream<String> buscas; // texto digitado
Stream<List<Resultado>> resultados = buscas
    .where((q) => q.length >= 2)
    .distinct()
    .debounceTime(const Duration(milliseconds: 300))
    .asyncMap(api.buscar);
resultados.listen(atualizarLista);`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar map mudar a original:</strong> ele cria uma <em>nova</em> Stream.</li>
        <li><strong>Usar <code>distinct()</code> achando que dedupa global:</strong> só compara com vizinho.</li>
        <li><strong>asyncMap sem await dentro:</strong> serializa à toa; use <code>map</code> simples.</li>
        <li><strong>Esquecer de cancelar:</strong> pipelines longos vivem para sempre se ninguém chamar <code>cancel</code>.</li>
        <li><strong>Tentar usar debounce sem package:</strong> não vem na lib padrão.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Streams têm <code>map/where/take/skip/distinct/expand</code> — mesma família de Iterable.</li>
        <li><code>asyncMap</code> permite transformar com Futures, mantendo ordem.</li>
        <li><code>transform</code> + <code>StreamTransformer</code> abre tudo (buffers, agrupamento).</li>
        <li><code>debounce</code>/<code>throttle</code> moram em <code>rxdart</code> ou <code>stream_transform</code>.</li>
        <li>Cada operador retorna uma <em>nova</em> Stream; nada roda até alguém escutar.</li>
      </ul>
    </PageContainer>
  );
}
