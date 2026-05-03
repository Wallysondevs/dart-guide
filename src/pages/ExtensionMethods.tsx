import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ExtensionMethods() {
  return (
    <PageContainer
      title="Extension methods: adicionar métodos a tipos existentes"
      subtitle="Como ensinar truques novos a classes velhas — inclusive String, int e até classes de bibliotecas externas."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine que você comprou uma <strong>geladeira pronta</strong> e queria que ela tivesse um botão extra de &quot;abrir devagar&quot;. Você não pode reabrir a fábrica para mudar o modelo, mas pode <em>colar um adesivo com instruções</em> que ensina o uso novo. Em Dart, <strong>extension methods</strong> fazem isso: adicionam funcionalidades a tipos existentes (até mesmo <code>String</code>, <code>int</code>, ou classes de pacotes que não são seus) sem precisar herdar nem modificar o código original.
      </p>

      <h2>Sintaxe</h2>
      <p>
        Use a palavra <code>extension Nome on Tipo</code>. Dentro, escreva métodos, getters, setters, operadores — tudo como se fosse parte da classe original.
      </p>
      <pre><code>{`extension StringExtras on String {
  // Capitaliza a primeira letra.
  String get capitalizada {
    if (isEmpty) return this;
    return this[0].toUpperCase() + substring(1);
  }

  // Repete a string n vezes.
  String repetir(int n) => List.filled(n, this).join();
}

void main() {
  print('olá'.capitalizada); // Olá
  print('-'.repetir(10));    // ----------
}`}</code></pre>
      <p>
        Note que dentro da extension, <code>this</code> refere-se à <em>instância do tipo estendido</em>. Você pode usar todos os membros públicos do tipo original como se estivesse dentro dele.
      </p>

      <h2>Por que usar?</h2>
      <ul>
        <li>Adicionar utilidades a tipos da biblioteca padrão (<code>int</code>, <code>List</code>, <code>DateTime</code>).</li>
        <li>Estender classes de pacotes externos sem &quot;forkar&quot; o pacote.</li>
        <li>Manter código de cliente <em>fluente</em> e legível: <code>3.diasAtras</code> em vez de <code>diasAtras(3)</code>.</li>
      </ul>

      <h2>Exemplo: enriquecendo <code>int</code></h2>
      <pre><code>{`extension DataHelpers on int {
  Duration get dias => Duration(days: this);
  Duration get horas => Duration(hours: this);

  DateTime get diasAtras => DateTime.now().subtract(dias);
  DateTime get diasDaqui => DateTime.now().add(dias);
}

void main() {
  final ontem = 1.diasAtras;
  final ano2027 = 365.diasDaqui;
  print(ontem);
}`}</code></pre>

      <AlertBox type="info" title="Inspirado em outras linguagens">
        Extension methods existem em C# e Kotlin. A ideia é universal: <em>adicionar métodos sem alterar a fonte original</em>. Em Dart, a vantagem é o checking estático completo — o compilador valida tipos.
      </AlertBox>

      <h2>Genéricas</h2>
      <p>
        Extensions também aceitam tipo genérico. Exemplo: estender qualquer <code>List&lt;T&gt;</code>:
      </p>
      <pre><code>{`extension ListaUtils<T> on List<T> {
  // Retorna o segundo elemento, ou null se não existir.
  T? get segundo => length >= 2 ? this[1] : null;

  // Divide a lista em pedaços de tamanho n.
  List<List<T>> emBlocos(int n) {
    final r = <List<T>>[];
    for (var i = 0; i < length; i += n) {
      r.add(sublist(i, i + n > length ? length : i + n));
    }
    return r;
  }
}

void main() {
  final nums = [1, 2, 3, 4, 5];
  print(nums.segundo);        // 2
  print(nums.emBlocos(2));    // [[1,2],[3,4],[5]]
}`}</code></pre>

      <h2>Resolução de conflito</h2>
      <p>
        E se duas extensions definem o <em>mesmo nome de método</em> para o mesmo tipo? Dart não escolhe sozinho: dá erro. Você resolve apelidando uma das importações.
      </p>
      <pre><code>{`// arquivo: a.dart
extension A on String { String get titulo => '[A] \$this'; }

// arquivo: b.dart
extension B on String { String get titulo => '[B] \$this'; }

// arquivo: main.dart
import 'a.dart';
import 'b.dart' as bx;

void main() {
  // print('x'.titulo); // ERRO: ambíguo
  print(A('x').titulo);          // chamada explícita pela extensão A
  print(bx.B('x').titulo);       // explícita pela B
}`}</code></pre>
      <p>
        Você também pode importar com <code>show</code>/<code>hide</code> para esconder uma extensão.
      </p>

      <h2>Escopo: precisa estar &quot;visível&quot;</h2>
      <p>
        Extensão só funciona se o arquivo que a define estiver <strong>importado</strong> no arquivo que a usa. Não há mágica global — tudo continua explícito.
      </p>

      <AlertBox type="warning" title="Não substitui herança">
        Extension não pode <em>sobrescrever</em> métodos existentes do tipo original. Se <code>String</code> já tem <code>toLowerCase</code>, sua extensão com mesmo nome será ignorada — Dart prefere o método &quot;de verdade&quot;.
      </AlertBox>

      <h2>Extension types (Dart 3)</h2>
      <p>
        Em Dart 3 surgiu também <code>extension type</code>: permite criar um <em>novo tipo</em> que &quot;embrulha&quot; outro com zero overhead em runtime. Útil para dar significado a tipos primitivos.
      </p>
      <pre><code>{`extension type Email(String valor) {
  bool get valido => valor.contains('@');
}

void main() {
  final e = Email('a@x.com');
  print(e.valido); // true
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer de importar</strong> a extension: o método &quot;some&quot;.</li>
        <li><strong>Conflito não resolvido</strong>: duas extensions com mesmo nome — apelide uma com <code>as</code>.</li>
        <li><strong>Querer sobrescrever</strong> método existente: extension perde para o membro real do tipo.</li>
        <li><strong>Acessar membros privados</strong> da classe estendida: o <code>_</code> só vale dentro da biblioteca original.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Extensions adicionam métodos/getters/setters/operadores a tipos existentes.</li>
        <li>Sintaxe: <code>extension Nome on Tipo &#123; ... &#125;</code>.</li>
        <li>Dentro, <code>this</code> é a instância estendida.</li>
        <li>Extensões podem ser genéricas e respeitam o escopo de import.</li>
        <li>Não sobrescrevem métodos originais; conflitos exigem apelido com <code>as</code>.</li>
      </ul>
    </PageContainer>
  );
}
