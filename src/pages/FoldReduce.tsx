import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FoldReduce() {
  return (
    <PageContainer
      title="fold e reduce: redução de coleções"
      subtitle="Como transformar uma coleção inteira em um único valor — somatórios, agregações e estatísticas."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        &quot;Reduzir&quot; uma coleção significa <strong>combinar todos os seus elementos em um único resultado</strong>. Pense em um liquidificador: você joga várias frutas e tira um suco. Em programação, esse suco pode ser uma soma, uma média, uma string concatenada, um mapa de contagens, ou qualquer outra coisa. O Dart oferece dois métodos para isso: <code>reduce</code>, mais simples e restrito, e <code>fold</code>, mais poderoso e flexível.
      </p>

      <h2>reduce: combina elementos do mesmo tipo</h2>
      <p>
        <code>reduce</code> recebe uma função que combina <strong>dois elementos da coleção</strong> em um. O resultado tem que ser do mesmo tipo dos elementos. Internamente, ele pega o primeiro elemento, combina com o segundo, depois combina com o terceiro, e assim por diante.
      </p>
      <pre><code>{`final n = [1, 2, 3, 4];

final soma = n.reduce((a, b) => a + b);     // 10
final prod = n.reduce((a, b) => a * b);     // 24
final maior = n.reduce((a, b) => a > b ? a : b); // 4

// Com strings:
final palavras = ['oi', 'mundo', 'feliz'];
final junto = palavras.reduce((a, b) => '\$a-\$b');
// 'oi-mundo-feliz'`}</code></pre>

      <AlertBox type="warning" title="reduce em coleção vazia explode">
        Se você chamar <code>reduce</code> em um Iterable vazio, recebe <code>StateError: No element</code>. Sempre cheque <code>isEmpty</code> antes ou prefira <code>fold</code>, que aceita coleção vazia (devolve o valor inicial).
      </AlertBox>

      <h2>fold: o irmão mais flexível</h2>
      <p>
        <code>fold</code> resolve as duas limitações do <code>reduce</code>: ele aceita um <strong>valor inicial</strong> (chamado &quot;semente&quot; ou <em>seed</em>) e o tipo do acumulador pode ser <strong>diferente</strong> do tipo dos elementos. Isso abre um universo de possibilidades.
      </p>
      <pre><code>{`final n = [1, 2, 3, 4];

// Soma começando em 100 (acc é int, elementos são int).
final s = n.fold<int>(100, (acc, x) => acc + x); // 110

// Concatenar números em uma string (acc é String, elementos são int).
final str = n.fold<String>('[', (acc, x) => '\$acc \$x') + ' ]';
// '[ 1 2 3 4 ]'

// Em coleção vazia, NÃO explode — devolve a semente.
final vazia = <int>[].fold<int>(0, (a, b) => a + b);
print(vazia); // 0`}</code></pre>

      <h2>Caso clássico: mapa de contagem</h2>
      <p>
        Um dos usos mais comuns de <code>fold</code> é construir um <code>Map</code> que conta quantas vezes cada item aparece:
      </p>
      <pre><code>{`final votos = ['azul', 'verde', 'azul', 'azul', 'verde', 'rosa'];

final contagem = votos.fold<Map<String, int>>({}, (acc, cor) {
  acc[cor] = (acc[cor] ?? 0) + 1;
  return acc;
});

print(contagem); // {azul: 3, verde: 2, rosa: 1}`}</code></pre>

      <h2>Estatísticas em uma passada só</h2>
      <p>
        Outro caso elegante: calcular várias coisas de uma vez (mínimo, máximo, soma) sem percorrer a lista três vezes. Use um <code>record</code> como acumulador (Dart 3+):
      </p>
      <pre><code>{`final n = [4, 1, 7, 3, 9, 2];

final stats = n.fold<({int min, int max, int soma})>(
  (min: n.first, max: n.first, soma: 0),
  (acc, x) => (
    min: x < acc.min ? x : acc.min,
    max: x > acc.max ? x : acc.max,
    soma: acc.soma + x,
  ),
);

print('min=\${stats.min} max=\${stats.max} soma=\${stats.soma}');
// min=1 max=9 soma=26`}</code></pre>

      <h2>fold vs reduce: como escolher</h2>
      <ul>
        <li>Se o acumulador é do <strong>mesmo tipo</strong> dos elementos e a coleção <strong>nunca é vazia</strong>: <code>reduce</code>, mais conciso.</li>
        <li>Se o acumulador tem <strong>tipo diferente</strong>, ou se a coleção <strong>pode ser vazia</strong>: <code>fold</code>.</li>
        <li>Para somar uma <code>List&lt;num&gt;</code>, prefira <code>list.fold&lt;num&gt;(0, (a, b) =&gt; a + b)</code> em vez de <code>reduce</code>.</li>
      </ul>

      <AlertBox type="info" title="Reduce é &quot;fold sem semente&quot;">
        Mentalmente, <code>lista.reduce(f)</code> equivale a <code>lista.skip(1).fold(lista.first, f)</code>. Por isso ele exige pelo menos um elemento.
      </AlertBox>

      <h2>Quando NÃO usar fold/reduce</h2>
      <p>
        Existem helpers prontos para casos comuns; usar <code>reduce</code> nesses casos é &quot;reinventar a roda&quot;:
      </p>
      <pre><code>{`final n = [1, 2, 3, 4];

// Em vez de fold para somar inteiros: importa 'package:collection'
// e usa list.sum (extensão IterableNumberExtension).
// import 'package:collection/collection.dart';
// final s = n.sum;

// Para max/min:
// final m = n.max; final p = n.min;

// Para juntar strings, use join:
final s2 = ['a', 'b', 'c'].join('-'); // 'a-b-c'`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Modificar a lista original</strong> dentro do callback — sempre acumule em uma <em>nova</em> estrutura.</li>
        <li><strong>Esquecer o tipo genérico</strong> de <code>fold&lt;T&gt;</code> e ver erros de tipo confusos.</li>
        <li><strong>Esquecer de retornar o acumulador</strong> dentro do callback — devolve <code>null</code> e dá erro.</li>
        <li><strong>Usar <code>reduce</code> em coleção vazia</strong> sem checar — <code>StateError</code> em runtime.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>reduce</code> combina elementos do mesmo tipo, sem semente.</li>
        <li><code>fold</code> aceita semente e tipo de acumulador diferente.</li>
        <li>Ambos rodam em uma única passada da coleção.</li>
        <li>Use <code>fold</code> para mapas de contagem e estatísticas combinadas.</li>
        <li>Para casos comuns, prefira helpers de <code>package:collection</code>.</li>
      </ul>
    </PageContainer>
  );
}
