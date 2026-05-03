import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ListasArrays() {
  return (
    <PageContainer
      title="Listas: a coleção mais usada de Dart"
      subtitle="Aprenda a guardar e manipular sequências ordenadas de valores — a estrutura que você vai usar 10 vezes por dia."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Pense numa <strong>lista</strong> como uma fileira de gavetinhas numeradas: cada uma guarda um valor, e o número (chamado <em>índice</em>) começa em <strong>0</strong>. Em algumas linguagens essa estrutura se chama &quot;array&quot;; em Dart, o nome oficial é <code>List</code>. Listas são, sem dúvida, a coleção mais usada — desde guardar tarefas de um app até resultados de uma API. Dominar listas é dominar metade do dia a dia em Dart.
      </p>

      <h2>Criando listas</h2>
      <p>
        A forma mais comum é usar um <strong>literal de lista</strong> — colchetes <code>[]</code> com os valores separados por vírgulas.
      </p>
      <pre><code>{`// Literal: o tipo é inferido a partir dos itens
var numeros = [1, 2, 3, 4, 5];          // List<int>
var nomes = ['Ana', 'Beto', 'Caio'];   // List<String>

// Tipo explícito (recomendado em APIs públicas)
List<int> idades = [20, 30, 40];
final List<String> cores = <String>['azul', 'verde'];

// Lista vazia (precisa do tipo!)
var vazia = <int>[];
List<String> vazia2 = [];`}</code></pre>

      <h2><code>List.filled</code> e <code>List.generate</code></h2>
      <p>
        Quando você precisa de uma lista com tamanho fixo ou gerada por uma fórmula:
      </p>
      <pre><code>{`// Lista com 5 zeros (fixed-length por padrão!)
var zeros = List<int>.filled(5, 0);
print(zeros);   // [0, 0, 0, 0, 0]

// Para que seja redimensionável, passe growable: true
var crescivel = List<int>.filled(5, 0, growable: true);

// List.generate cria com base em uma função do índice
var quadrados = List<int>.generate(5, (i) => i * i);
print(quadrados);   // [0, 1, 4, 9, 16]`}</code></pre>

      <AlertBox type="warning" title="filled é fixo por padrão">
        Listas criadas com <code>List.filled</code> são <strong>fixed-length</strong> — você não pode usar <code>add</code> ou <code>removeAt</code>. Tentar isso lança <code>UnsupportedError</code>. Passe <code>growable: true</code> ou prefira <code>List.generate</code>.
      </AlertBox>

      <h2>Adicionando, removendo, acessando</h2>
      <p>
        Operações básicas no dia a dia:
      </p>
      <pre><code>{`var lista = <String>['a', 'b', 'c'];

// Acesso por índice (0-based)
print(lista[0]);           // 'a'
print(lista.first);        // 'a'
print(lista.last);         // 'c'
// print(lista[10]);       // RangeError

// Adicionar
lista.add('d');            // ['a', 'b', 'c', 'd']
lista.addAll(['e', 'f']);  // ['a', 'b', 'c', 'd', 'e', 'f']
lista.insert(0, 'zero');   // ['zero', 'a', 'b', 'c', 'd', 'e', 'f']

// Remover
lista.removeAt(0);         // remove primeiro
lista.removeLast();        // remove último
lista.remove('b');         // remove primeira ocorrência de 'b'
lista.removeWhere((s) => s == 'd');

// Buscar
print(lista.indexOf('c'));  // índice ou -1
print(lista.contains('a')); // true/false
print(lista.length);        // tamanho
print(lista.isEmpty);
print(lista.isNotEmpty);`}</code></pre>

      <h2>Iterando e transformando</h2>
      <p>
        Você pode percorrer uma lista com <code>for-in</code>, <code>forEach</code> ou usar métodos funcionais que retornam novas listas.
      </p>
      <pre><code>{`final nums = [1, 2, 3, 4, 5];

// Percorrer
for (final n in nums) {
  print(n);
}

// forEach
nums.forEach(print);

// Map: transforma cada item (volta Iterable; .toList() materializa)
final dobrados = nums.map((n) => n * 2).toList();   // [2,4,6,8,10]

// Where: filtra
final pares = nums.where((n) => n.isEven).toList(); // [2,4]

// Reduce: agrega
final soma = nums.reduce((acc, n) => acc + n);      // 15

// Fold: igual reduce, mas com valor inicial
final somaComBase = nums.fold<int>(100, (acc, n) => acc + n); // 115`}</code></pre>

      <h2>Spread e collection-if/for</h2>
      <p>
        Dart tem operadores que tornam montar listas algo elegante. O <code>...</code> espalha uma lista dentro da outra; <code>...?</code> faz o mesmo se a lista não for null. Você também pode incluir <code>if</code> e <code>for</code> dentro de literais!
      </p>
      <pre><code>{`final base = [1, 2, 3];
final extras = [4, 5];

final juntos = [0, ...base, ...extras, 6];
print(juntos);   // [0, 1, 2, 3, 4, 5, 6]

// Spread null-aware
List<int>? talvez;
final segura = [...?talvez, 99];   // [99]

// Collection if
final mostrarPremium = true;
final menus = ['Início', 'Perfil', if (mostrarPremium) 'Premium'];

// Collection for
final dobros = [for (final n in base) n * 2];   // [2, 4, 6]`}</code></pre>

      <AlertBox type="success" title="Collection literals em Flutter">
        Em widgets Flutter, esses recursos são ouro: você adiciona elementos condicionalmente em uma <code>Column</code> sem fazer ginástica de listas auxiliares.
      </AlertBox>

      <h2>Listas imutáveis</h2>
      <p>
        Marcar uma lista como <code>const</code> a torna profundamente imutável. Outra opção é usar <code>List.unmodifiable</code> para envolver uma lista existente.
      </p>
      <pre><code>{`const cores = ['vermelho', 'verde', 'azul'];
// cores.add('amarelo');   // ERRO: lista const

final original = [1, 2, 3];
final segura = List<int>.unmodifiable(original);
// segura.add(4);          // ERRO em runtime

// Cuidado: original ainda pode mudar!
original.add(4);            // OK
print(segura);              // [1,2,3,4] — segura espelha original!`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>RangeError ao acessar índice fora dos limites</strong> — sempre cheque <code>length</code> antes.</li>
        <li><strong>Modificar lista durante <code>for-in</code></strong> — gera <code>ConcurrentModificationError</code>.</li>
        <li><strong>Esquecer <code>.toList()</code> depois de <code>map</code>/<code>where</code></strong> — você fica com um <code>Iterable</code> preguiçoso.</li>
        <li><strong>Achar que <code>List.filled</code> é growable</strong> — não é, por padrão.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Listas são sequências ordenadas, indexadas a partir de 0.</li>
        <li>Literal <code>[1, 2, 3]</code>, <code>List.filled</code>, <code>List.generate</code>.</li>
        <li>Adicionar: <code>add</code>, <code>addAll</code>, <code>insert</code>; remover: <code>removeAt</code>, <code>removeLast</code>, <code>removeWhere</code>.</li>
        <li>Buscar: <code>indexOf</code>, <code>contains</code>, <code>first</code>, <code>last</code>, <code>length</code>.</li>
        <li>Métodos funcionais: <code>map</code>, <code>where</code>, <code>reduce</code>, <code>fold</code>.</li>
        <li>Spread (<code>...</code>) e collection-if/for criam listas elegantes.</li>
      </ul>
    </PageContainer>
  );
}
