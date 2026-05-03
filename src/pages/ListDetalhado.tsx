import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ListDetalhado() {
  return (
    <PageContainer
      title="List<T> detalhado: a workhorse das coleções"
      subtitle="Tudo o que você precisa saber sobre a estrutura de dados mais usada do Dart."
      difficulty="iniciante"
      timeToRead="14 min"
    >
      <p>
        A <strong>List</strong> é a coleção mais usada em qualquer programa Dart. Pense nela como uma <em>fila de gavetas numeradas</em>: cada gaveta tem uma posição (chamada <strong>índice</strong>, começando em 0) e guarda um valor. Quando você precisa de uma sequência ordenada — uma lista de tarefas, uma fila de mensagens, uma sequência de pixels — a <code>List&lt;T&gt;</code> é a primeira opção. O <code>&lt;T&gt;</code> é o <strong>tipo genérico</strong>: <code>List&lt;int&gt;</code> só guarda inteiros, <code>List&lt;String&gt;</code> só guarda textos. Isso evita a confusão de misturar tipos por engano.
      </p>

      <h2>Maneiras de criar uma List</h2>
      <p>Há várias formas, e cada uma tem um motivo de existir:</p>
      <pre><code>{`// 1) Literal — a forma mais comum e legível.
final numeros = <int>[1, 2, 3];

// 2) List.of — copia outra coleção, inferindo o tipo.
final copia = List.of(numeros); // List<int>

// 3) List.from — parecido, mas aceita Iterable<dynamic> e converte.
final convertida = List<int>.from(<num>[1, 2, 3]);

// 4) List.generate — cria N elementos a partir de uma função.
final quadrados = List.generate(5, (i) => i * i);
// [0, 1, 4, 9, 16]

// 5) List.filled — N posições preenchidas com o mesmo valor.
final zeros = List.filled(3, 0); // [0, 0, 0]

// 6) List vazia tipada — para depois ir alimentando.
final tarefas = <String>[];`}</code></pre>

      <AlertBox type="info" title="of vs from">
        Use <code>List.of</code> quando o tipo do iterável de origem já casa com o destino (mais rápido, sem conversão). Use <code>List.from</code> quando você precisa <strong>converter</strong> (por exemplo, de <code>Iterable&lt;num&gt;</code> para <code>List&lt;int&gt;</code>).
      </AlertBox>

      <h2>Tamanho fixo vs crescível</h2>
      <p>
        Por padrão, listas são <strong>crescíveis</strong> (você pode adicionar e remover). Mas <code>List.filled</code> e <code>List.generate</code> aceitam o parâmetro <code>growable: false</code> para criar listas de tamanho fixo, mais econômicas em memória:
      </p>
      <pre><code>{`// Lista de tamanho fixo: pode trocar valores, mas não pode add/remove.
final fixa = List<int>.filled(3, 0, growable: false);
fixa[0] = 10; // OK
// fixa.add(99); // ERRO em runtime: Cannot add to a fixed-length list

// Lista crescível (padrão):
final cresce = <int>[1, 2];
cresce.add(3); // [1, 2, 3]`}</code></pre>

      <h2>Adicionando e removendo elementos</h2>
      <p>Os métodos mais usados no dia a dia:</p>
      <pre><code>{`final tarefas = <String>['estudar', 'cozinhar'];

tarefas.add('treinar');           // ['estudar','cozinhar','treinar']
tarefas.addAll(['ler', 'dormir']); // adiciona vários de uma vez
tarefas.insert(0, 'acordar');      // insere no início
tarefas.remove('cozinhar');        // remove a primeira ocorrência
tarefas.removeAt(0);               // remove pelo índice
tarefas.removeLast();              // remove o último

// removeWhere: remove TODOS que casam com a condição.
final n = [1, 2, 3, 4, 5, 6];
n.removeWhere((x) => x.isEven); // [1, 3, 5]

// retainWhere: o contrário — mantém só os que casam.
n.retainWhere((x) => x > 1);

tarefas.clear(); // esvazia tudo`}</code></pre>

      <h2>Leitura e fatiamento</h2>
      <pre><code>{`final letras = ['a', 'b', 'c', 'd', 'e'];

print(letras[0]);           // 'a' — acesso por índice
print(letras.first);        // 'a'
print(letras.last);         // 'e'
print(letras.length);       // 5

// sublist(start, [end]) — retorna uma NOVA lista (não modifica a original).
print(letras.sublist(1, 4));  // ['b', 'c', 'd']
print(letras.sublist(2));     // ['c', 'd', 'e'] (até o fim)

// indexOf: posição do primeiro elemento igual; -1 se não achar.
print(letras.indexOf('c'));   // 2
print(letras.indexOf('z'));   // -1
print(letras.contains('b'));  // true

// asMap: vira um Map<int, T> com índice -> valor.
final mapa = letras.asMap();
print(mapa); // {0: a, 1: b, 2: c, 3: d, 4: e}`}</code></pre>

      <AlertBox type="warning" title="Acesso fora do alcance">
        Tentar acessar <code>lista[10]</code> em uma lista de 3 elementos lança <code>RangeError</code>. Sempre cheque o <code>length</code> antes ou use <code>elementAtOrNull</code> (Dart 3.0+) para receber <code>null</code> em vez de uma exceção.
      </AlertBox>

      <h2>Ordenação</h2>
      <p>
        <code>sort</code> ordena <strong>no lugar</strong> (modifica a própria lista). Para tipos que implementam <code>Comparable</code> (<code>int</code>, <code>String</code>, etc.), pode chamar sem argumentos:
      </p>
      <pre><code>{`final n = [3, 1, 4, 1, 5, 9, 2, 6];
n.sort();                       // [1, 1, 2, 3, 4, 5, 6, 9]
n.sort((a, b) => b.compareTo(a)); // ordem decrescente

// Ordenar objetos por campo:
class Pessoa {
  final String nome;
  final int idade;
  Pessoa(this.nome, this.idade);
}
final pessoas = [Pessoa('Ana', 30), Pessoa('Beto', 22)];
pessoas.sort((a, b) => a.idade.compareTo(b.idade));`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Modificar uma lista enquanto itera:</strong> use <code>removeWhere</code> em vez de remover dentro de um <code>for</code>.</li>
        <li><strong>Esquecer que <code>sort</code> muda a original:</strong> se quiser preservar, faça <code>final ordenada = [...lista]..sort();</code>.</li>
        <li><strong>Usar lista de tamanho fixo achando que vai crescer:</strong> <code>List.filled</code> sem <code>growable: true</code> não aceita <code>add</code>.</li>
        <li><strong>Confiar em índice negativo:</strong> Dart não suporta. <code>lista[-1]</code> dá erro; use <code>lista.last</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>List é uma sequência ordenada indexada a partir de 0.</li>
        <li>Crie com literal <code>[]</code>, <code>List.of</code>, <code>List.from</code>, <code>List.generate</code> ou <code>List.filled</code>.</li>
        <li>É crescível por padrão — use <code>growable: false</code> para fixa.</li>
        <li>Métodos chave: <code>add</code>, <code>insert</code>, <code>remove</code>, <code>removeWhere</code>, <code>sublist</code>, <code>sort</code>, <code>indexOf</code>, <code>asMap</code>.</li>
        <li><code>sort</code> ordena no lugar; <code>sublist</code> retorna nova lista.</li>
      </ul>
    </PageContainer>
  );
}
