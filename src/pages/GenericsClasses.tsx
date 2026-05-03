import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GenericsClasses() {
  return (
    <PageContainer
      title="Generics em classes: tipos parametrizados"
      subtitle="Como escrever uma estrutura uma vez e usá-la com qualquer tipo, sem perder a segurança."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine que você tem uma caixa de presentes. Sem generics, você teria que fabricar uma caixa para cada tipo de conteúdo: uma para joias, outra para livros, outra para chocolates — todas iguais por dentro, só com etiqueta diferente. Generics é a ideia de fabricar <strong>uma caixa só</strong>, mas com uma etiqueta vazia que você preenche na hora de usar: <em>Caixa de Joias</em>, <em>Caixa de Livros</em>. Em programação, isso evita repetição de código e mantém o sistema de tipos sabendo exatamente o que está dentro.
      </p>

      <h2>O problema sem generics</h2>
      <p>
        Sem generics, você acabaria criando classes específicas ou usando <code>dynamic</code> e perdendo a segurança:
      </p>
      <pre><code>{`// Solução ruim 1: uma classe por tipo
class CaixaInt {
  int valor;
  CaixaInt(this.valor);
}
class CaixaString {
  String valor;
  CaixaString(this.valor);
}

// Solução ruim 2: dynamic perdendo segurança
class CaixaQualquer {
  dynamic valor;
  CaixaQualquer(this.valor);
}
final c = CaixaQualquer(10);
print(c.valor.length); // EXPLODE: int não tem .length`}</code></pre>

      <h2>A sintaxe básica: &lt;T&gt;</h2>
      <p>
        Em Dart, declaramos generics com colchetes angulares e uma letra (por convenção, <code>T</code> de &quot;Type&quot;). Esse <code>T</code> é um <em>parâmetro de tipo</em>: um espaço reservado que será preenchido na hora de instanciar.
      </p>
      <pre><code>{`class Caixa<T> {
  T valor;
  Caixa(this.valor);

  T pegar() => valor;
  void trocar(T novo) => valor = novo;
}

void main() {
  final cInt = Caixa<int>(42);
  print(cInt.pegar());          // 42
  // cInt.trocar('texto');      // ERRO: esperava int

  final cStr = Caixa<String>('oi');
  print(cStr.pegar().length);   // 2: o compilador sabe que é String
}`}</code></pre>

      <AlertBox type="info" title="Inferência de tipo">
        Você pode omitir o tipo se o Dart conseguir deduzir: <code>final c = Caixa(42);</code> infere <code>Caixa&lt;int&gt;</code>. Mas escrever <code>Caixa&lt;int&gt;(42)</code> torna o código mais claro em casos ambíguos.
      </AlertBox>

      <h2>Múltiplos parâmetros</h2>
      <p>
        Você pode ter quantos parâmetros de tipo quiser. A convenção mais comum é <code>K</code> para chaves e <code>V</code> para valores (como em <code>Map&lt;K, V&gt;</code>):
      </p>
      <pre><code>{`class Par<A, B> {
  final A primeiro;
  final B segundo;
  Par(this.primeiro, this.segundo);

  @override
  String toString() => '(\$primeiro, \$segundo)';
}

void main() {
  final p = Par<String, int>('idade', 30);
  print(p);                     // (idade, 30)
  print(p.primeiro.toUpperCase()); // IDADE — sabe que é String
}`}</code></pre>

      <h2>Generics em métodos</h2>
      <p>
        Métodos individuais também podem ser genéricos, independentemente de a classe ser:
      </p>
      <pre><code>{`class Utils {
  // O método em si é genérico, com seu próprio T.
  static T primeiro<T>(List<T> lista) {
    if (lista.isEmpty) throw StateError('lista vazia');
    return lista.first;
  }
}

void main() {
  final n = Utils.primeiro<int>([10, 20, 30]);
  print(n);                       // 10
  final s = Utils.primeiro(['a', 'b']); // inferido como String
  print(s.toUpperCase());         // A
}`}</code></pre>

      <h2>Reified generics: tipos vivos em runtime</h2>
      <p>
        Diferente de Java ou TypeScript, em Dart os tipos genéricos são <strong>reified</strong>: o compilador (programa que traduz seu código) preserva a informação de tipo até o runtime (a hora em que o programa de fato roda). Isso significa que você pode checar tipos genéricos em execução, e o sistema de tipos garante consistência total.
      </p>
      <pre><code>{`final lista = <String>['a', 'b'];

print(lista is List<String>); // true
print(lista is List<int>);    // false — em Java daria true por type erasure!
print(lista.runtimeType);     // List<String>

// Você pode até usar T em runtime dentro de um método genérico:
T? buscarPrimeiro<T>(List<dynamic> lista) {
  for (final item in lista) {
    if (item is T) return item;
  }
  return null;
}`}</code></pre>

      <AlertBox type="warning" title="Reified ≠ Java/TypeScript">
        Java apaga os tipos genéricos em runtime (<em>type erasure</em>) — uma <code>List&lt;String&gt;</code> vira só <code>List</code>. TypeScript faz o mesmo. Dart NÃO faz isso. É um dos motivos pelos quais o Dart consegue garantir soundness real.
      </AlertBox>

      <h2>Exemplo prático: pilha (Stack) genérica</h2>
      <p>
        Vamos implementar uma pilha — estrutura LIFO (último a entrar, primeiro a sair) — usando generics:
      </p>
      <pre><code>{`class Pilha<T> {
  final List<T> _itens = [];

  void empilhar(T item) => _itens.add(item);

  T desempilhar() {
    if (_itens.isEmpty) throw StateError('Pilha vazia');
    return _itens.removeLast();
  }

  T? get topo => _itens.isEmpty ? null : _itens.last;
  int get tamanho => _itens.length;
  bool get vazia => _itens.isEmpty;
}

void main() {
  final p = Pilha<int>();
  p.empilhar(1);
  p.empilhar(2);
  p.empilhar(3);
  print(p.desempilhar()); // 3
  print(p.topo);          // 2
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o parâmetro de tipo</strong>: <code>Caixa(42)</code> sem contexto pode virar <code>Caixa&lt;dynamic&gt;</code> indesejado.</li>
        <li><strong>Confundir T da classe com T do método</strong>: são escopos diferentes.</li>
        <li><strong>Usar <code>dynamic</code> em vez de generic</strong>: perde a segurança que o generic oferece.</li>
        <li><strong>Tentar criar uma instância de T</strong> diretamente: o Dart não permite (use factory ou injeção de fábrica).</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Generics permitem reutilizar uma estrutura para vários tipos sem perder segurança.</li>
        <li>Sintaxe: <code>class Nome&lt;T&gt;</code> e <code>T</code> em campos, parâmetros e retornos.</li>
        <li>Métodos podem ser genéricos independentemente da classe.</li>
        <li>Em Dart, generics são <strong>reified</strong>: o tipo persiste em runtime.</li>
      </ul>
    </PageContainer>
  );
}
