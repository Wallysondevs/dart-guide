import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GenericsBounds() {
  return (
    <PageContainer
      title="Restrições genéricas: &lt;T extends Comparable&gt;"
      subtitle="Como dizer ao compilador &quot;qualquer tipo, contanto que ele saiba se comparar&quot;."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Imagine que você abre uma confeitaria e aceita encomendas em qualquer recipiente — desde que o recipiente <em>tenha tampa</em>. Você não se importa se é um pote de vidro, plástico ou metal; o requisito é simples: precisa fechar. Em programação, essa é a essência de uma <strong>restrição genérica</strong> (<em>generic bound</em>): você diz ao compilador (programa que checa e traduz seu código) que aceita qualquer tipo <code>T</code>, <strong>desde que</strong> ele tenha certas capacidades.
      </p>

      <h2>O problema: generics permissivos demais</h2>
      <p>
        Sem restrições, um <code>T</code> é apenas <code>Object?</code>. Você não pode chamar quase nada nele, porque o compilador não sabe quais métodos existem.
      </p>
      <pre><code>{`T maior<T>(T a, T b) {
  // return a > b ? a : b; // ERRO: '>' não está definido para T
  return a;
}`}</code></pre>
      <p>
        Para chamar <code>&gt;</code>, precisamos garantir que <code>T</code> sabe se comparar. É aí que entra <code>extends</code>.
      </p>

      <h2>A sintaxe: T extends Tipo</h2>
      <p>
        Em Dart, restrições usam a palavra-chave <code>extends</code> dentro dos colchetes angulares. Ela significa &quot;<code>T</code> deve ser um subtipo de Tipo&quot; — pode ser o próprio Tipo, ou qualquer descendente.
      </p>
      <pre><code>{`// T deve ser comparável consigo mesmo (Comparable<T>)
T maior<T extends Comparable<T>>(T a, T b) {
  return a.compareTo(b) > 0 ? a : b;
}

void main() {
  print(maior<int>(3, 7));        // 7
  print(maior<String>('ab', 'a')); // ab
  // print(maior<Object>(1, 'a')); // ERRO: Object não é Comparable
}`}</code></pre>

      <AlertBox type="info" title="Por que Comparable&lt;T&gt; e não Comparable?">
        <code>Comparable</code> é uma interface genérica. Dizer <code>Comparable&lt;T&gt;</code> garante que o método <code>compareTo</code> aceita exatamente <code>T</code>, evitando confusão entre tipos diferentes (você não quer comparar uma <code>String</code> com um <code>int</code>).
      </AlertBox>

      <h2>Restrição com classe abstrata</h2>
      <p>
        Você pode restringir a uma classe abstrata sua, criando &quot;contratos&quot; reutilizáveis. Quem quiser usar a função genérica precisa implementar a interface.
      </p>
      <pre><code>{`abstract class Identificavel {
  String get id;
}

class Usuario implements Identificavel {
  @override
  final String id;
  final String nome;
  Usuario(this.id, this.nome);
}

void imprimirIds<T extends Identificavel>(List<T> itens) {
  for (final i in itens) {
    print(i.id);
  }
}

void main() {
  imprimirIds<Usuario>([
    Usuario('u1', 'Ana'),
    Usuario('u2', 'Bia'),
  ]);
}`}</code></pre>

      <h2>Object? como bound padrão</h2>
      <p>
        Quando você não escreve <code>extends</code>, o Dart assume <code>extends Object?</code>. Isso é o mais permissivo possível: aceita qualquer coisa, inclusive <code>null</code>. Se quiser apenas valores não-nulos, escreva <code>extends Object</code>.
      </p>
      <pre><code>{`class Caixa<T> { T valor; Caixa(this.valor); }
final c1 = Caixa<int?>(null);          // ok: T pode ser nullable

class CaixaForte<T extends Object> { T valor; CaixaForte(this.valor); }
final c2 = CaixaForte<int>(10);
// final c3 = CaixaForte<int?>(null); // ERRO: int? não é Object`}</code></pre>

      <h2>Múltiplas restrições? Use composição</h2>
      <p>
        Diferente de Java, o Dart <strong>não suporta &amp;</strong> para múltiplas restrições (como <code>T extends A &amp; B</code>). A solução é declarar uma interface intermediária que estenda ambas, e usar essa interface como bound.
      </p>
      <pre><code>{`abstract class Comparavel implements Comparable<Comparavel> {}
abstract class Imprimivel { String formatar(); }

// Quero T que seja Comparavel E Imprimivel: crio interface combinada.
abstract class CompImp implements Comparavel, Imprimivel {}

T maiorEFormatar<T extends CompImp>(T a, T b) {
  final escolhido = a.compareTo(b) > 0 ? a : b;
  print(escolhido.formatar());
  return escolhido;
}`}</code></pre>

      <AlertBox type="warning" title="Limitação real">
        Em Dart, não há sintaxe direta para &quot;intersecção de tipos&quot;. Se você precisa muito disso, repense o desenho: talvez uma interface única ou um método não-genérico seja mais simples.
      </AlertBox>

      <h2>Exemplo prático: ordenação genérica</h2>
      <p>
        Vamos implementar um <code>bubbleSort</code> genérico que funciona para qualquer tipo comparável (<code>int</code>, <code>String</code>, <code>DateTime</code>, etc.):
      </p>
      <pre><code>{`void bubbleSort<T extends Comparable<T>>(List<T> lista) {
  for (var i = 0; i < lista.length - 1; i++) {
    for (var j = 0; j < lista.length - 1 - i; j++) {
      if (lista[j].compareTo(lista[j + 1]) > 0) {
        // troca elementos adjacentes
        final tmp = lista[j];
        lista[j] = lista[j + 1];
        lista[j + 1] = tmp;
      }
    }
  }
}

void main() {
  final nums = [3, 1, 4, 1, 5, 9, 2, 6];
  bubbleSort(nums);
  print(nums); // [1, 1, 2, 3, 4, 5, 6, 9]

  final palavras = ['banana', 'abacate', 'cereja'];
  bubbleSort(palavras);
  print(palavras); // [abacate, banana, cereja]

  final datas = [DateTime(2024, 5), DateTime(2023, 1), DateTime(2025, 3)];
  bubbleSort(datas);
  print(datas);
}`}</code></pre>

      <h2>Bounds em classes (não só funções)</h2>
      <p>
        Classes também aceitam bounds. Útil para coleções que só fazem sentido com tipos específicos.
      </p>
      <pre><code>{`class ListaOrdenada<T extends Comparable<T>> {
  final List<T> _itens = [];

  void adicionar(T item) {
    _itens.add(item);
    _itens.sort();
  }

  List<T> get itens => List.unmodifiable(_itens);
}

void main() {
  final lo = ListaOrdenada<int>();
  lo.adicionar(3);
  lo.adicionar(1);
  lo.adicionar(2);
  print(lo.itens); // [1, 2, 3]
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar usar <code>&amp;</code> para múltiplas restrições</strong> — não existe; crie interface combinada.</li>
        <li><strong>Esquecer <code>extends Comparable&lt;T&gt;</code></strong> e tentar usar <code>&gt;</code> direto — o compilador rejeita.</li>
        <li><strong>Usar <code>extends Object?</code></strong> sem necessidade — é o padrão; só escreva se quiser deixar explícito.</li>
        <li><strong>Confundir <code>extends</code> em generics com herança</strong> — em generics significa &quot;subtipo de&quot;, não herança real.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>&lt;T extends Tipo&gt;</code> restringe <code>T</code> a subtipos de <code>Tipo</code>.</li>
        <li>Sem bound, <code>T</code> equivale a <code>Object?</code>.</li>
        <li>Use <code>Comparable&lt;T&gt;</code> para algoritmos de ordenação genéricos.</li>
        <li>Não há intersecção (<code>&amp;</code>); use uma interface combinada.</li>
      </ul>
    </PageContainer>
  );
}
