import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LinkedHashMap() {
  return (
    <PageContainer
      title="LinkedHashMap, HashMap, SplayTreeMap"
      subtitle="As três implementações de Map e como escolher entre elas."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Quando você escreve <code>{`final m = {}`}</code> em Dart, recebe um Map. Mas qual Map, exatamente? O core do Dart oferece <strong>três implementações principais</strong> da interface <code>Map&lt;K,V&gt;</code>, cada uma com características diferentes. Saber escolher faz seu código ficar mais rápido em situações específicas e evitar surpresas com ordem de iteração.
      </p>

      <h2>O default invisível: LinkedHashMap</h2>
      <p>
        Toda vez que você escreve um <strong>literal de Map</strong> (<code>{`{'a': 1}`}</code>) ou chama <code>Map()</code>, o Dart cria por baixo um <code>LinkedHashMap</code>. O nome é confuso, mas a ideia é simples: ele combina <strong>hash</strong> (lookup rápido por chave) com uma <strong>lista ligada</strong> que registra a ordem em que cada chave foi inserida. Resultado: você itera na mesma ordem que adicionou.
      </p>
      <pre><code>{`import 'dart:collection';

final m = <String, int>{};
m['c'] = 3;
m['a'] = 1;
m['b'] = 2;

for (final k in m.keys) {
  print(k); // c, a, b — ordem de inserção preservada
}

print(m.runtimeType); // _LinkedHashMap<String, int>`}</code></pre>

      <p>
        Essa preservação de ordem é incrivelmente útil: você gera JSON com chaves na ordem desejada, exibe listas na UI sem surpresas, e faz debug de forma consistente.
      </p>

      <h2>HashMap: o veloz sem ordem</h2>
      <p>
        Quando você não se importa com ordem de iteração, pode usar <code>HashMap</code>. Ele economiza um pouquinho de memória (não mantém os ponteiros da lista ligada) e é marginalmente mais rápido em inserções/remoções. A iteração devolve as chaves em ordem <strong>imprevisível</strong> — pode até parecer ordenada por acidente, mas não conte com isso.
      </p>
      <pre><code>{`import 'dart:collection';

final h = HashMap<String, int>();
h['c'] = 3;
h['a'] = 1;
h['b'] = 2;

// A ordem aqui pode ser QUALQUER coisa.
for (final k in h.keys) {
  print(k);
}`}</code></pre>

      <AlertBox type="warning" title="Não confie em ordem de HashMap">
        Programas que &quot;funcionam&quot; com a ordem atual podem quebrar quando você atualizar o Dart, mudar de plataforma ou só por acaso. Se a ordem importa, use <code>LinkedHashMap</code>.
      </AlertBox>

      <h2>SplayTreeMap: sempre ordenado por chave</h2>
      <p>
        <code>SplayTreeMap</code> usa internamente uma <strong>árvore balanceada</strong> (árvore splay). Ele mantém as chaves <em>ordenadas pela ordem natural</em> (ou por um Comparator que você fornecer), o tempo todo. As operações são O(log n) em vez de O(1), mas você ganha de graça: lista ordenada de chaves, &quot;menor chave maior que X&quot;, intervalos.
      </p>
      <pre><code>{`import 'dart:collection';

final s = SplayTreeMap<String, int>();
s['gamma'] = 3;
s['alpha'] = 1;
s['beta']  = 2;

print(s.keys.toList()); // [alpha, beta, gamma] — alfabético

// Comparator customizado: ordem reversa.
final inv = SplayTreeMap<int, String>((a, b) => b.compareTo(a));
inv[1] = 'um';
inv[3] = 'três';
inv[2] = 'dois';
print(inv.keys.toList()); // [3, 2, 1]

// Operações exclusivas:
print(s.firstKey()); // 'alpha'
print(s.lastKey());  // 'gamma'
print(s.firstKeyAfter('alpha')); // 'beta'`}</code></pre>

      <h2>Comparativo prático</h2>
      <pre><code>{`// Resumo das características:
//
// LinkedHashMap (default literal {})
//   - Lookup, insert, delete: O(1) amortizado
//   - Itera em ordem de INSERÇÃO
//   - Memória: alta (hash + lista ligada)
//
// HashMap
//   - Lookup, insert, delete: O(1) amortizado
//   - Itera em ordem IMPREVISÍVEL
//   - Memória: menor que LinkedHashMap
//
// SplayTreeMap
//   - Lookup, insert, delete: O(log n)
//   - Itera em ordem das CHAVES (Comparable ou Comparator)
//   - Memória: alta (nós da árvore)
//   - Bonus: firstKey, lastKey, ranges`}</code></pre>

      <h2>Como escolher</h2>
      <ul>
        <li><strong>LinkedHashMap (default):</strong> 99% dos casos. Você quer ordem previsível e lookup rápido.</li>
        <li><strong>HashMap:</strong> caches internos onde a iteração é rara e a economia de memória/tempo importa.</li>
        <li><strong>SplayTreeMap:</strong> quando você precisa de chaves sempre ordenadas (rankings, indexação por data, range queries).</li>
      </ul>

      <h2>Conversões entre eles</h2>
      <pre><code>{`import 'dart:collection';

final literal = {'b': 2, 'a': 1, 'c': 3}; // LinkedHashMap

final hm  = HashMap<String, int>.from(literal);
final stm = SplayTreeMap<String, int>.from(literal);
final lhm = LinkedHashMap<String, int>.from(literal);

// Voltar para um literal &quot;normal&quot;:
final voltou = Map<String, int>.from(stm);`}</code></pre>

      <AlertBox type="info" title="Map.fromEntries também serve">
        Você pode construir qualquer um deles passando uma lista de <code>MapEntry</code>:
        <br /><code>SplayTreeMap.fromEntries(...)</code>, <code>HashMap.fromIterables(...)</code>, etc.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar ordem em HashMap</strong>: testes podem passar localmente e quebrar em CI.</li>
        <li><strong>Usar SplayTreeMap onde LinkedHashMap basta</strong>: O(log n) sem motivo.</li>
        <li><strong>Esquecer Comparator em SplayTreeMap com tipos não-Comparable</strong>: erro em runtime.</li>
        <li><strong>Achar que <code>{`{}`}</code> dá HashMap</strong>: sempre vem LinkedHashMap.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Map literal e <code>Map()</code> criam <code>LinkedHashMap</code> (ordem de inserção).</li>
        <li><code>HashMap</code> é mais leve, mas sem ordem garantida.</li>
        <li><code>SplayTreeMap</code> mantém chaves ordenadas; ótimo para ranges.</li>
        <li>Importe <code>dart:collection</code> para usar HashMap/SplayTreeMap explicitamente.</li>
        <li>Escolha pela necessidade real, não por &quot;parecer mais rápido&quot;.</li>
      </ul>
    </PageContainer>
  );
}
