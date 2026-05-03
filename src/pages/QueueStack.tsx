import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function QueueStack() {
  return (
    <PageContainer
      title="Queue<T> e implementações de pilha em Dart"
      subtitle="Filas (FIFO) e pilhas (LIFO): estruturas essenciais para algoritmos."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine duas situações cotidianas: a <strong>fila do banco</strong> — quem chega primeiro é atendido primeiro (FIFO, &quot;First In, First Out&quot;) — e uma <strong>pilha de pratos</strong> — quem foi colocado por último é o primeiro a sair (LIFO, &quot;Last In, First Out&quot;). Em programação, essas duas estruturas aparecem o tempo todo: filas em algoritmos de busca, processamento de mensagens, scheduling; pilhas em parsers, navegadores (botão &quot;voltar&quot;) e desfazer/refazer. O Dart oferece a classe <code>Queue&lt;T&gt;</code>, com métodos para usar tanto como fila quanto como pilha.
      </p>

      <h2>Importando dart:collection</h2>
      <p>
        Diferente de <code>List</code>, <code>Map</code> e <code>Set</code> (que estão sempre disponíveis), as classes de fila ficam em <code>dart:collection</code>:
      </p>
      <pre><code>{`import 'dart:collection';

final fila = Queue<int>();
final lista = ListQueue<int>();      // baseada em array circular (default)
final encadeada = DoubleLinkedQueue<int>(); // lista duplamente ligada`}</code></pre>

      <p>
        Quando você instancia <code>Queue&lt;T&gt;()</code> sem mais nada, na verdade está criando uma <code>ListQueue</code>. Ela é mais rápida para uso geral. <code>DoubleLinkedQueue</code> é interessante quando você precisa de operações eficientes <em>no meio</em> da fila (raro).
      </p>

      <h2>Usando como FIFO (fila)</h2>
      <p>
        O padrão clássico: <code>addLast</code> para enfileirar (entra no fim) e <code>removeFirst</code> para desenfileirar (sai do começo).
      </p>
      <pre><code>{`import 'dart:collection';

void main() {
  final atendimento = Queue<String>();

  atendimento.addLast('Ana');
  atendimento.addLast('Beto');
  atendimento.addLast('Carla');

  while (atendimento.isNotEmpty) {
    final proximo = atendimento.removeFirst();
    print('Atendendo: \$proximo');
  }
  // Atendendo: Ana
  // Atendendo: Beto
  // Atendendo: Carla
}`}</code></pre>

      <h2>Usando como LIFO (pilha)</h2>
      <p>
        Para usar a mesma <code>Queue</code> como pilha, basta sempre adicionar e remover do mesmo lado. Convencionalmente: <code>addFirst</code> + <code>removeFirst</code>.
      </p>
      <pre><code>{`import 'dart:collection';

void main() {
  final historico = Queue<String>();

  historico.addFirst('home');
  historico.addFirst('produtos');
  historico.addFirst('detalhes');

  // Botão &quot;voltar&quot; — desempilha o topo.
  print(historico.removeFirst()); // detalhes
  print(historico.removeFirst()); // produtos
  print(historico.removeFirst()); // home
}`}</code></pre>

      <AlertBox type="info" title="E uma List não basta?">
        Tecnicamente, dá para usar <code>List</code> como pilha (<code>add</code> + <code>removeLast</code>) e até como fila (<code>add</code> + <code>removeAt(0)</code>). Mas <code>removeAt(0)</code> em List é <strong>O(n)</strong> porque precisa deslocar todos os elementos. <code>Queue</code> faz isso em <strong>O(1)</strong>. Para pilha pura, List é OK; para fila, sempre Queue.
      </AlertBox>

      <h2>Métodos importantes</h2>
      <pre><code>{`import 'dart:collection';

final q = Queue<int>.from([1, 2, 3, 4]);

print(q.first);       // 1 — espia o começo, sem remover
print(q.last);        // 4 — espia o fim
print(q.length);      // 4
print(q.isEmpty);     // false

q.addLast(5);         // enfileira no fim
q.addFirst(0);        // empilha no começo
print(q);             // {0, 1, 2, 3, 4, 5}

q.removeFirst();      // tira do começo (FIFO/LIFO comum)
q.removeLast();       // tira do fim
q.remove(3);          // remove primeira ocorrência igual a 3

q.clear();            // esvazia`}</code></pre>

      <h2>Caso real: BFS (busca em largura)</h2>
      <p>
        Um dos algoritmos mais clássicos que <em>precisa</em> de fila. Imagine um grafo de amizades e você quer descobrir, em ordem de proximidade, todo mundo conectado a você:
      </p>
      <pre><code>{`import 'dart:collection';

void bfs(Map<String, List<String>> grafo, String inicio) {
  final visitados = <String>{};
  final fila = Queue<String>()..addLast(inicio);

  while (fila.isNotEmpty) {
    final atual = fila.removeFirst();
    if (!visitados.add(atual)) continue; // já visitado
    print('Visitando: \$atual');

    for (final vizinho in grafo[atual] ?? const []) {
      if (!visitados.contains(vizinho)) {
        fila.addLast(vizinho);
      }
    }
  }
}

void main() {
  final amigos = {
    'Ana':   ['Beto', 'Carla'],
    'Beto':  ['Ana', 'Davi'],
    'Carla': ['Ana', 'Eva'],
    'Davi':  ['Beto'],
    'Eva':   ['Carla'],
  };
  bfs(amigos, 'Ana');
}`}</code></pre>

      <h2>ListQueue vs DoubleLinkedQueue</h2>
      <ul>
        <li><strong>ListQueue</strong> (default): array circular interno. Operações nas duas pontas em O(1) amortizado. Ótima para 99% dos casos.</li>
        <li><strong>DoubleLinkedQueue</strong>: cada elemento é um nó ligado. Permite remover/inserir em qualquer ponto em O(1) <em>se você já tem o nó</em>. Consome mais memória.</li>
      </ul>

      <AlertBox type="warning" title="Iterar sem alocar">
        <code>Queue</code> implementa <code>Iterable</code>, então funciona em <code>for-in</code>, <code>where</code>, <code>map</code>, etc. Mas se você precisa só consumir tudo na ordem, <code>while (q.isNotEmpty)</code> + <code>removeFirst</code> é o padrão.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>import 'dart:collection'</code></strong> — o IDE oferece sugestão.</li>
        <li><strong>Misturar <code>addLast</code> e <code>removeLast</code>:</strong> não é nem fila nem pilha, é confusão.</li>
        <li><strong>Chamar <code>removeFirst</code> em fila vazia:</strong> lança <code>StateError</code>. Cheque <code>isNotEmpty</code> antes.</li>
        <li><strong>Usar List como fila</strong> em loops grandes — desempenho ruim.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Fila = FIFO (entra no fim, sai do começo); Pilha = LIFO (entra e sai do mesmo lado).</li>
        <li><code>Queue&lt;T&gt;</code> em <code>dart:collection</code> serve para os dois casos.</li>
        <li>Métodos: <code>addFirst</code>/<code>addLast</code>, <code>removeFirst</code>/<code>removeLast</code>, <code>first</code>/<code>last</code>.</li>
        <li>Use <code>Queue</code>, não <code>List</code>, para filas — operações em O(1).</li>
        <li><code>ListQueue</code> é o default; <code>DoubleLinkedQueue</code> para casos especiais.</li>
      </ul>
    </PageContainer>
  );
}
