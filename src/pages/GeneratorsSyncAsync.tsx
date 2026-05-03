import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GeneratorsSyncAsync() {
  return (
    <PageContainer
      title="Generators: sync* e async* com yield"
      subtitle="Funções que &quot;produzem&quot; valores sob demanda — Iterables e Streams sem esforço."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        Imagine uma <strong>máquina de pipoca</strong>: ela produz pipocas <em>uma de cada vez</em>, conforme você pede. Você não precisa esperar todas estourarem para começar a comer — basta pegar a próxima quando estiver pronta. Em Dart, esse padrão é implementado pelos <strong>generators</strong>: funções marcadas com <code>sync*</code> ou <code>async*</code> que usam a palavra-chave <code>yield</code> para entregar valores sob demanda. Eles permitem criar coleções (Iterables) e fluxos de eventos (Streams) sem armazenar tudo na memória de uma vez.
      </p>

      <h2>sync*: gerador síncrono que produz Iterable</h2>
      <p>
        Uma função marcada com <code>sync*</code> retorna um <code>Iterable&lt;T&gt;</code>. Cada vez que você pede o próximo elemento (com <code>moveNext</code> ou implicitamente em um <code>for-in</code>), a função <strong>avança até o próximo <code>yield</code></strong>, entrega o valor e <em>pausa</em> ali, esperando o próximo pedido.
      </p>
      <pre><code>{`Iterable<int> contar(int ate) sync* {
  for (var i = 1; i <= ate; i++) {
    print('produzindo \$i');
    yield i;
  }
}

void main() {
  final c = contar(3);
  print('antes do for');
  for (final x in c) {
    print('consumindo \$x');
  }
}
// Saída:
// antes do for
// produzindo 1
// consumindo 1
// produzindo 2
// consumindo 2
// produzindo 3
// consumindo 3`}</code></pre>

      <p>
        Repare: o &quot;produzindo&quot; só aparece <em>depois</em> que o for começa a iterar. Isso é a essência da <strong>lazy evaluation</strong>: nada é calculado até alguém pedir.
      </p>

      <h2>yield* — delegar para outro Iterable</h2>
      <p>
        Quando seu generator quer entregar &quot;todos os elementos de outro generator/Iterable&quot;, em vez de fazer um <code>for</code> com <code>yield</code> dentro, use <code>yield*</code>. É o equivalente do spread <code>...</code>, mas para generators:
      </p>
      <pre><code>{`Iterable<int> umAteTres() sync* {
  yield 1;
  yield 2;
  yield 3;
}

Iterable<int> zeroAteCinco() sync* {
  yield 0;
  yield* umAteTres(); // delega: 1, 2, 3
  yield 4;
  yield 5;
}

void main() {
  print(zeroAteCinco().toList()); // [0, 1, 2, 3, 4, 5]
}`}</code></pre>

      <h2>Caso clássico: Fibonacci infinito</h2>
      <p>
        Um generator pode produzir <strong>infinitos</strong> valores — e isso não trava, porque só calcula sob demanda. Use <code>take</code> para pegar quantos quiser:
      </p>
      <pre><code>{`Iterable<int> fibonacci() sync* {
  var a = 0, b = 1;
  while (true) {     // loop infinito sem medo
    yield a;
    final t = a + b;
    a = b;
    b = t;
  }
}

void main() {
  print(fibonacci().take(10).toList());
  // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
}`}</code></pre>

      <AlertBox type="warning" title="Cuidado com take e materialização">
        Se você esquecer o <code>take</code> e chamar <code>toList()</code> ou <code>length</code> em um generator infinito, seu programa congela tentando produzir o &quot;próximo&quot; para sempre. Sempre limite o consumo.
      </AlertBox>

      <h2>async*: gerador assíncrono que produz Stream</h2>
      <p>
        A versão assíncrona de <code>sync*</code> é <code>async*</code>. Ela retorna uma <code>Stream&lt;T&gt;</code> — uma sequência de valores que chegam <strong>com o tempo</strong>, possivelmente com pausas (espera de rede, timer, IO). Dentro de uma função <code>async*</code>, você pode usar <code>await</code> e <code>yield</code> juntos.
      </p>
      <pre><code>{`Stream<int> tickAteCinco() async* {
  for (var i = 1; i <= 5; i++) {
    await Future.delayed(const Duration(seconds: 1));
    yield i;
  }
}

Future<void> main() async {
  await for (final v in tickAteCinco()) {
    print('chegou: \$v');
  }
}
// Imprime &quot;chegou: 1&quot; após 1s, &quot;chegou: 2&quot; após mais 1s, etc.`}</code></pre>

      <h2>Caso real: ler arquivo linha por linha</h2>
      <p>
        Em vez de carregar um arquivo gigante inteiro na memória, você pode lê-lo como Stream de linhas e processar uma de cada vez:
      </p>
      <pre><code>{`import 'dart:convert';
import 'dart:io';

Stream<String> linhasNaoVazias(String caminho) async* {
  final arquivo = File(caminho);
  final stream = arquivo.openRead()
      .transform(utf8.decoder)
      .transform(const LineSplitter());

  await for (final linha in stream) {
    if (linha.trim().isNotEmpty) {
      yield linha;
    }
  }
}

Future<void> main() async {
  await for (final l in linhasNaoVazias('grande.txt')) {
    print(l);
  }
}`}</code></pre>

      <AlertBox type="info" title="Iterable vs Stream em uma frase">
        Iterable: &quot;me dá tudo agora, um de cada vez, sem esperar&quot;. Stream: &quot;me avisa quando o próximo chegar, pode demorar&quot;. Generators sync* produzem o primeiro; async*, o segundo.
      </AlertBox>

      <h2>Quando usar generator vs lista comum</h2>
      <ul>
        <li><strong>Use generator</strong> quando a sequência é grande/infinita, ou cada item é caro de calcular.</li>
        <li><strong>Use generator</strong> quando o consumidor pode parar antes do fim (não desperdice trabalho).</li>
        <li><strong>Use lista</strong> quando precisa de acesso por índice, recontagem (length), ou iterar várias vezes.</li>
      </ul>

      <h2>yield em loops aninhados</h2>
      <pre><code>{`Iterable<(int, int)> paresAte(int n) sync* {
  for (var i = 1; i <= n; i++) {
    for (var j = 1; j <= n; j++) {
      yield (i, j);
    }
  }
}

void main() {
  print(paresAte(2).toList()); // [(1, 1), (1, 2), (2, 1), (2, 2)]
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>*</code></strong> em <code>sync</code>/<code>async</code>: vira função normal e <code>yield</code> não compila.</li>
        <li><strong>Usar <code>return valor;</code></strong> em generator: ele só pode <code>return;</code> sem valor (encerra a sequência).</li>
        <li><strong>Materializar generator infinito</strong> (<code>toList</code>, <code>length</code>) — seu programa congela.</li>
        <li><strong>Confundir <code>yield</code> com <code>yield*</code></strong>: o primeiro produz UM elemento, o segundo delega TODOS de outro Iterable/Stream.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>sync*</code> + <code>yield</code> cria <code>Iterable&lt;T&gt;</code> lazy.</li>
        <li><code>async*</code> + <code>yield</code> cria <code>Stream&lt;T&gt;</code> assíncrono.</li>
        <li><code>yield*</code> delega a outro generator/Iterable/Stream.</li>
        <li>Permite sequências infinitas sem estourar memória.</li>
        <li>Use <code>take</code>/<code>where</code>/<code>map</code> para consumir só o necessário.</li>
      </ul>
    </PageContainer>
  );
}
