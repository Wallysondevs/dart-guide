import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IterableBase() {
  return (
    <PageContainer
      title="Iterable<T>: a interface mãe de todas as coleções"
      subtitle="A abstração que une List, Set, Map.keys, generators e muito mais."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Todo programador Dart, mais cedo ou mais tarde, esbarra em um tipo chamado <code>Iterable&lt;T&gt;</code>. Apesar do nome misterioso, a ideia é simples: <strong>um Iterable é qualquer coisa pela qual você consegue caminhar elemento por elemento</strong>. Uma <code>List</code> é Iterable. Um <code>Set</code> é Iterable. As chaves de um <code>Map</code> são Iterable. Até funções especiais (chamadas <em>generators</em>) produzem Iterables. É a espinha dorsal das coleções — quando você aprende Iterable, aprende a falar a língua de todas elas.
      </p>

      <h2>O que &quot;iterar&quot; significa</h2>
      <p>
        Iterar é o ato de pegar os elementos um por um, do começo ao fim. Imagine uma <strong>esteira de fábrica</strong>: você fica em um ponto fixo e os itens passam para você um de cada vez. O Iterable é a esteira; cada chamada interna pede &quot;me dá o próximo&quot; até a esteira terminar.
      </p>
      <pre><code>{`final lista = [10, 20, 30];

// O for-in usa o iterator por baixo dos panos.
for (final n in lista) {
  print(n);
}

// Versão &quot;manual&quot;, mostrando o que o for-in esconde:
final it = lista.iterator;
while (it.moveNext()) {
  print(it.current);
}`}</code></pre>
      <p>
        Cada Iterable tem o método <code>iterator</code>, que devolve um objeto com dois membros: <code>moveNext()</code> (avança e retorna <code>true</code> se sobrou item) e <code>current</code> (o elemento atual). É só isso.
      </p>

      <h2>Iterable é &quot;preguiçoso&quot; (lazy)</h2>
      <p>
        Aqui está a parte mais importante e também a que mais confunde iniciantes: <strong>Iterable não armazena seus elementos prontos</strong>. Muitos métodos retornam um Iterable que <em>descreve uma receita</em>, e a receita só é executada quando você itera. Pense em um <strong>cardápio</strong>: ele lista pratos, mas a comida só é cozinhada quando você pede. Isso economiza memória e tempo.
      </p>
      <pre><code>{`final numeros = [1, 2, 3, 4, 5];

// Aqui NADA é calculado ainda — só uma receita.
final dobro = numeros.map((x) {
  print('calculando \$x * 2');
  return x * 2;
});

print('antes do for');
for (final d in dobro) {
  print(d);
}
// Saída: 'antes do for' aparece ANTES das mensagens 'calculando'.`}</code></pre>

      <AlertBox type="warning" title="Iterar duas vezes recalcula">
        Como Iterable é lazy, percorrê-lo duas vezes executa a receita duas vezes. Se a receita é cara (rede, disco, computação pesada), <strong>materialize</strong> com <code>.toList()</code> uma única vez e itere a lista resultante.
      </AlertBox>

      <h2>Materializando: toList, toSet, length</h2>
      <pre><code>{`final receita = [1, 2, 3, 4].where((x) => x.isEven);

// Forçar avaliação completa:
final lista = receita.toList(); // [2, 4]
final conj  = receita.toSet();  // {2, 4}
final tam   = receita.length;   // 2 — também força percorrer tudo

// Pegar só os primeiros sem materializar tudo:
final primeiros2 = receita.take(2);   // ainda Iterable
final pulados   = receita.skip(1);    // ainda Iterable`}</code></pre>

      <h2>Métodos que todo Iterable tem</h2>
      <pre><code>{`final n = [3, 1, 4, 1, 5, 9, 2, 6];

n.first;             // 3 — lança se vazio
n.last;              // 6
n.firstWhere((x) => x > 4);          // 5
n.firstWhere((x) => x > 100, orElse: () => -1);
n.any((x) => x.isEven);              // true se ALGUM casa
n.every((x) => x > 0);               // true se TODOS casam
n.contains(9);                       // true
n.elementAt(2);                      // 4 (índice)
n.forEach(print);                    // executa para cada um
n.join(', ');                        // &quot;3, 1, 4, 1, 5, 9, 2, 6&quot;
n.reduce((a, b) => a + b);           // soma
n.fold(100, (a, b) => a + b);        // soma começando em 100`}</code></pre>

      <h2>Construindo Iterables com generators</h2>
      <p>
        A forma mais elegante de criar um Iterable do zero é com uma <strong>função geradora</strong>, marcada com <code>sync*</code>. Cada <code>yield</code> &quot;empurra&quot; um elemento na esteira:
      </p>
      <pre><code>{`Iterable<int> contadorAte(int n) sync* {
  for (var i = 1; i <= n; i++) {
    yield i;
  }
}

void main() {
  for (final v in contadorAte(5)) {
    print(v); // 1, 2, 3, 4, 5
  }
}`}</code></pre>

      <AlertBox type="info" title="Iterable vs Stream">
        <strong>Iterable</strong> é síncrono: cada <code>moveNext</code> bloqueia até ter o próximo valor pronto. <strong>Stream</strong> é a versão assíncrona: os valores chegam <em>com o tempo</em> (por exemplo, mensagens de WebSocket). A relação Iterable→Stream é a mesma de Função→Future: um entrega já, o outro entrega no futuro.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Iterar duas vezes</strong> esperando cache: cada iteração re-executa a receita lazy.</li>
        <li><strong>Chamar <code>first</code> em Iterable vazio</strong>: lança <code>StateError</code>. Use <code>firstOrNull</code> ou <code>orElse</code>.</li>
        <li><strong>Confundir <code>length</code> com baixo custo</strong>: em Iterables lazy, <code>length</code> percorre tudo!</li>
        <li><strong>Modificar a lista de origem</strong> durante iteração: pode lançar <code>ConcurrentModificationError</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Iterable é a abstração comum: List, Set, Map.keys e generators implementam.</li>
        <li>É <strong>lazy</strong>: descreve uma receita; só executa quando iterado.</li>
        <li><code>iterator</code>, <code>moveNext</code>, <code>current</code> são a base do <code>for-in</code>.</li>
        <li>Materialize com <code>toList</code>/<code>toSet</code> quando precisar consultar várias vezes.</li>
        <li>Generators (<code>sync*</code>) criam Iterables sob demanda; Streams são o equivalente assíncrono.</li>
      </ul>
    </PageContainer>
  );
}
