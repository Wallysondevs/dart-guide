import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function WhereMapTolist() {
  return (
    <PageContainer
      title="where, map, toList: trio essencial"
      subtitle="Os três métodos que aparecem em quase todo código Dart de qualidade."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Se existem três métodos de coleção que <strong>todo</strong> programador Dart usa todo dia, são <code>where</code>, <code>map</code> e <code>toList</code>. Eles são o equivalente Dart do trio &quot;filter, map, collect&quot; do mundo funcional. Combinados, eles substituem dezenas de loops manuais por uma única expressão clara, lendo quase como uma frase em português: &quot;dos pedidos, pegue só os pagos, transforme em ID e devolva como lista&quot;.
      </p>

      <h2>where: filtro</h2>
      <p>
        <code>where</code> recebe uma função que devolve <code>true</code>/<code>false</code> e mantém apenas os elementos para os quais a função devolve <code>true</code>. É como uma <strong>peneira</strong>: passa pelo buraco quem casa com o critério.
      </p>
      <pre><code>{`final numeros = [1, 2, 3, 4, 5, 6];

// Pega só os pares.
final pares = numeros.where((n) => n.isEven);
print(pares.toList()); // [2, 4, 6]

// Pode usar qualquer expressão booleana.
final maiores = numeros.where((n) => n > 3 && n < 6);
print(maiores.toList()); // [4, 5]`}</code></pre>

      <h2>map: projeção</h2>
      <p>
        <code>map</code> aplica uma função em <strong>cada</strong> elemento e devolve um novo Iterable com o resultado. O tipo do resultado pode ser totalmente diferente do tipo de entrada — você pode mapear uma lista de números para uma lista de strings, ou de objetos para IDs.
      </p>
      <pre><code>{`final numeros = [1, 2, 3];
final dobrados = numeros.map((n) => n * 2);
print(dobrados.toList()); // [2, 4, 6]

// Mudando o tipo: int -> String.
final rotulos = numeros.map((n) => 'Item #\$n');
print(rotulos.toList()); // [Item #1, Item #2, Item #3]

// Em listas de objetos, é o jeito clean de extrair campos.
class Produto { final String nome; final double preco;
  Produto(this.nome, this.preco); }
final lista = [Produto('Pão', 5), Produto('Leite', 6)];
final nomes = lista.map((p) => p.nome).toList();`}</code></pre>

      <AlertBox type="info" title="Tudo é lazy">
        <code>where</code> e <code>map</code> NÃO calculam nada na hora — eles retornam Iterables que <em>descrevem o que fazer</em>. A computação só acontece quando você itera (com <code>for-in</code>) ou materializa (com <code>toList</code>, <code>toSet</code>, <code>length</code>, etc.).
      </AlertBox>

      <h2>toList e toSet: materializando</h2>
      <p>
        Como Iterables são lazy, na prática a gente quase sempre termina a cadeia com <code>toList()</code> (ou <code>toSet()</code>) para forçar o cálculo e ter um resultado sólido nas mãos:
      </p>
      <pre><code>{`final n = [1, 2, 3, 4, 5];

// Cadeia clássica: filtra, transforma, materializa.
final result = n
    .where((x) => x.isOdd)
    .map((x) => x * 10)
    .toList();
print(result); // [10, 30, 50]

// toSet remove duplicatas se a transformação gerar.
final letras = ['a', 'A', 'b', 'B'].map((s) => s.toLowerCase()).toSet();
print(letras); // {a, b}`}</code></pre>

      <h2>Encadeando vários passos</h2>
      <p>
        A grande beleza desse trio é que dá para encadear quantos <code>where</code> e <code>map</code> você quiser. Cada elo da cadeia é uma transformação isolada e fácil de ler:
      </p>
      <pre><code>{`class Pedido {
  final int id;
  final double valor;
  final String status; // 'pago' ou 'pendente'
  Pedido(this.id, this.valor, this.status);
}

final pedidos = [
  Pedido(1, 100, 'pago'),
  Pedido(2,  50, 'pendente'),
  Pedido(3, 200, 'pago'),
  Pedido(4,  30, 'pago'),
];

final ticketsAltos = pedidos
    .where((p) => p.status == 'pago')
    .where((p) => p.valor > 80)
    .map((p) => p.id)
    .toList();

print(ticketsAltos); // [1, 3]`}</code></pre>

      <h2>expand: o &quot;flatMap&quot; do Dart</h2>
      <p>
        Às vezes a função de mapeamento devolve <em>uma coleção</em> para cada elemento, e você quer um Iterable plano (não uma lista de listas). É aí que entra <code>expand</code>: ele faz <code>map</code> + <code>flatten</code> em um só passo.
      </p>
      <pre><code>{`final palavras = ['oi mundo', 'tudo bem'];

// Sem expand: vira List<List<String>>.
final ruim = palavras.map((s) => s.split(' ')).toList();
// [[oi, mundo], [tudo, bem]]

// Com expand: vira List<String> plana.
final bom = palavras.expand((s) => s.split(' ')).toList();
// [oi, mundo, tudo, bem]

// Outro caso: para cada cliente, suas tags.
class Cliente { final List<String> tags; Cliente(this.tags); }
final c = [Cliente(['vip', 'novo']), Cliente(['vip', 'frequente'])];
final todasTags = c.expand((x) => x.tags).toSet();
print(todasTags); // {vip, novo, frequente}`}</code></pre>

      <AlertBox type="warning" title="Lembre do toList no fim">
        Esquecer <code>toList</code>/<code>toSet</code> e tentar usar o Iterable como se fosse uma lista (acessando por índice, modificando) gera erros chatos. Quando em dúvida, materialize.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Iterar a mesma cadeia duas vezes</strong>: cada iteração re-executa <code>where</code>/<code>map</code>. Materialize uma vez se for usar várias.</li>
        <li><strong>Modificar a lista original</strong> dentro do <code>map</code>: o callback deve ser puro (não causar efeitos colaterais).</li>
        <li><strong>Usar <code>map</code> só para ter efeito colateral</strong> (tipo print): use <code>forEach</code> ou um <code>for-in</code>.</li>
        <li><strong>Esperar mudança de tipo na lista original</strong>: <code>map</code> sempre devolve um <em>novo</em> Iterable; a original permanece intacta.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>where</code> filtra; <code>map</code> transforma; <code>toList</code>/<code>toSet</code> materializa.</li>
        <li>São lazy: a cadeia só executa ao iterar.</li>
        <li>Encadeie quantos passos quiser — cada um é uma transformação isolada.</li>
        <li>Use <code>expand</code> quando o map retorna coleção e você quer achatar.</li>
        <li>Sempre materialize antes de iterar várias vezes.</li>
      </ul>
    </PageContainer>
  );
}
