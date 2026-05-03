import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ComparableComparator() {
  return (
    <PageContainer
      title="Comparable e Comparator: ordenação customizada"
      subtitle="Defina a &quot;ordem natural&quot; das suas classes ou crie comparações sob medida."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Em algum momento você vai querer usar <code>list.sort()</code> em uma classe que <em>você</em> escreveu, ou colocar seus objetos como chaves de um <code>SplayTreeMap</code>. Para que isso funcione, o Dart precisa saber: <strong>quem vem antes de quem?</strong> A resposta vem de duas abstrações intimamente ligadas: <code>Comparable</code>, que define uma ordem &quot;natural&quot; embutida na própria classe, e <code>Comparator</code>, uma função externa que compara dois objetos.
      </p>

      <h2>Comparable&lt;T&gt;: ordem embutida</h2>
      <p>
        Implementar <code>Comparable&lt;T&gt;</code> significa adicionar à sua classe o método <code>int compareTo(T other)</code>. O contrato é:
      </p>
      <ul>
        <li>Retorna <strong>negativo</strong> se <code>this</code> deve vir antes de <code>other</code>.</li>
        <li>Retorna <strong>zero</strong> se são equivalentes na ordem.</li>
        <li>Retorna <strong>positivo</strong> se <code>this</code> deve vir depois.</li>
      </ul>
      <pre><code>{`class Pessoa implements Comparable<Pessoa> {
  final String nome;
  final int idade;
  Pessoa(this.nome, this.idade);

  // Ordem natural: por idade crescente.
  @override
  int compareTo(Pessoa other) => idade.compareTo(other.idade);

  @override
  String toString() => '\$nome(\$idade)';
}

void main() {
  final pessoas = [Pessoa('Ana', 30), Pessoa('Beto', 22), Pessoa('Carla', 41)];
  pessoas.sort(); // funciona sem comparator!
  print(pessoas); // [Beto(22), Ana(30), Carla(41)]
}`}</code></pre>

      <p>
        Repare na elegância: a classe define sua ordem natural <em>uma vez</em>, e qualquer lugar do código que precise (sort, SplayTreeMap, max/min) funciona sem precisar repetir a lógica.
      </p>

      <h2>Comparator&lt;T&gt;: ordens alternativas</h2>
      <p>
        Mas e se em outro lugar do programa você quiser ordenar pessoas por nome em vez de idade? Aí entra o <code>Comparator</code>: uma <em>função</em> avulsa que pode mudar de cenário em cenário.
      </p>
      <pre><code>{`// Comparator é só um typedef:
// typedef Comparator<T> = int Function(T a, T b);

final pessoas = [Pessoa('Ana', 30), Pessoa('Beto', 22), Pessoa('Carla', 41)];

// Por nome:
pessoas.sort((a, b) => a.nome.compareTo(b.nome));

// Por idade decrescente:
pessoas.sort((a, b) => b.idade.compareTo(a.idade));

// Comparator pode ser uma variável ou função nomeada:
int porNome(Pessoa a, Pessoa b) => a.nome.compareTo(b.nome);
pessoas.sort(porNome);`}</code></pre>

      <h2>Comparações lexicográficas (múltiplos campos)</h2>
      <p>
        &quot;Ordem lexicográfica&quot; é o nome técnico para o jeito que a gente ordena palavras no dicionário: compare a primeira letra; se empatou, a segunda; e assim por diante. Para objetos, compare o primeiro campo; se empatou, o segundo.
      </p>
      <pre><code>{`int comparar(Pessoa a, Pessoa b) {
  // 1) Por idade
  final c1 = a.idade.compareTo(b.idade);
  if (c1 != 0) return c1;
  // 2) Em caso de empate, por nome
  final c2 = a.nome.compareTo(b.nome);
  if (c2 != 0) return c2;
  // 3) Outro desempate, se quiser...
  return 0;
}

final p = [Pessoa('Carla', 30), Pessoa('Ana', 30), Pessoa('Beto', 25)];
p.sort(comparar);
print(p); // [Beto(25), Ana(30), Carla(30)]`}</code></pre>

      <AlertBox type="info" title="Helper: Comparable.compare">
        O Dart oferece <code>Comparable.compare(a, b)</code> como atalho para <code>a.compareTo(b)</code>, útil quando os objetos são <code>Comparable</code> mas você está em um contexto genérico onde isso não é claro.
      </AlertBox>

      <h2>Extensão sortedBy do package:collection</h2>
      <p>
        O pacote oficial <code>collection</code> traz extensões muito convenientes que extraem o &quot;campo de ordenação&quot; e devolvem uma <strong>nova lista</strong> sem mexer na original:
      </p>
      <pre><code>{`// pubspec.yaml -> dependencies: collection: ^1.18.0
import 'package:collection/collection.dart';

final p = [Pessoa('Ana', 30), Pessoa('Beto', 22), Pessoa('Carla', 41)];

final porIdade = p.sortedBy<num>((x) => x.idade);
final porNome  = p.sortedBy<String>((x) => x.nome);

// Comparator customizado e composto:
final composto = p.sorted(
  (a, b) {
    final c = a.idade.compareTo(b.idade);
    return c != 0 ? c : a.nome.compareTo(b.nome);
  },
);

// thenBy/thenByCompare também existem em outras libs.`}</code></pre>

      <h2>Comparable em chaves de SplayTreeMap e Set</h2>
      <p>
        Como os objetos têm ordem natural, eles podem ser chaves de <code>SplayTreeMap</code> (ou elementos de <code>SplayTreeSet</code>) sem precisar de Comparator extra:
      </p>
      <pre><code>{`import 'dart:collection';

final ranking = SplayTreeMap<Pessoa, String>();
ranking[Pessoa('Ana', 30)] = 'campeã';
ranking[Pessoa('Beto', 22)] = 'novato';
ranking[Pessoa('Carla', 41)] = 'veterana';

for (final entry in ranking.entries) {
  print('\${entry.key} -> \${entry.value}');
}
// Beto(22) -> novato
// Ana(30) -> campeã
// Carla(41) -> veterana`}</code></pre>

      <AlertBox type="warning" title="Coerência com == e hashCode">
        Quando objetos forem usados em <code>Set</code>/<code>Map</code>, lembre que <code>compareTo</code> e <code>==</code> devem ser <strong>consistentes</strong>: se <code>a.compareTo(b) == 0</code>, idealmente <code>a == b</code> também. Caso contrário, <code>SplayTreeSet</code> e amigos podem se comportar de forma inesperada.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>implements Comparable&lt;T&gt;</code></strong>: <code>list.sort()</code> falha em runtime.</li>
        <li><strong>Comparator não-transitivo</strong>: ordenação fica imprevisível.</li>
        <li><strong>Usar <code>a - b</code> em <code>double</code></strong>: gera double, não int. Use <code>compareTo</code>.</li>
        <li><strong>Comparable inconsistente com igualdade</strong>: bugs sutis em SplayTreeMap.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Comparable&lt;T&gt;</code> embute a ordem natural na classe via <code>compareTo</code>.</li>
        <li><code>Comparator&lt;T&gt;</code> é uma função externa <code>(a, b) =&gt; int</code>.</li>
        <li>Para múltiplos campos, encadeie comparações.</li>
        <li><code>package:collection</code> tem <code>sortedBy</code>/<code>sorted</code> que não modificam a original.</li>
        <li>Mantenha <code>compareTo</code> coerente com <code>==</code>/<code>hashCode</code>.</li>
      </ul>
    </PageContainer>
  );
}
