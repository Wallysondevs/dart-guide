import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SortComparator() {
  return (
    <PageContainer
      title="Ordenando listas: sort e Comparator"
      subtitle="Da ordem natural à ordenação multi-campo customizada."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Ordenar uma lista parece banal, mas há várias decisões importantes escondidas: <em>como</em> comparar dois elementos, se a ordenação é estável, se queremos a ordem natural ou uma customizada, se vamos modificar a lista original ou criar uma nova. Neste capítulo, vamos do <code>sort</code> mais simples até comparadores compostos por vários campos.
      </p>

      <h2>O sort básico (ordem natural)</h2>
      <p>
        Quando você chama <code>list.sort()</code> sem argumentos, o Dart usa a <strong>ordem natural</strong> dos elementos. Isso só funciona se os elementos implementarem a interface <code>Comparable</code> — o que é verdade para <code>int</code>, <code>double</code>, <code>String</code>, <code>DateTime</code> e várias outras classes do core. <code>sort</code> ordena <strong>no lugar</strong>: a própria lista é modificada.
      </p>
      <pre><code>{`final n = [3, 1, 4, 1, 5, 9, 2, 6];
n.sort();
print(n); // [1, 1, 2, 3, 4, 5, 6, 9]

final palavras = ['banana', 'abacaxi', 'caju'];
palavras.sort();
print(palavras); // [abacaxi, banana, caju]`}</code></pre>

      <AlertBox type="warning" title="sort modifica a original">
        Se você precisa preservar a ordem original, faça uma cópia antes:
        <br /><code>final ordenada = [...lista]..sort();</code>
        <br />A sintaxe <code>..</code> (cascade) chama <code>sort</code> e devolve a própria lista — perfeito para uma linha.
      </AlertBox>

      <h2>Comparator: a função de comparação</h2>
      <p>
        Um <strong>Comparator&lt;T&gt;</strong> é simplesmente uma função que recebe dois elementos e devolve um <code>int</code>:
      </p>
      <ul>
        <li>Negativo se <code>a</code> deve vir <strong>antes</strong> de <code>b</code>.</li>
        <li>Zero se são <strong>equivalentes</strong> para a ordenação.</li>
        <li>Positivo se <code>a</code> deve vir <strong>depois</strong> de <code>b</code>.</li>
      </ul>
      <pre><code>{`final n = [3, 1, 4, 1, 5];

// Crescente (equivalente ao sort sem args para int):
n.sort((a, b) => a.compareTo(b));

// Decrescente: invertemos a, b.
n.sort((a, b) => b.compareTo(a));
print(n); // [5, 4, 3, 1, 1]

// Para int, dá para usar a - b (mas cuidado com overflow em long).
n.sort((a, b) => a - b);`}</code></pre>

      <h2>Ordenando objetos por campo</h2>
      <p>
        O caso mais comum no mundo real: você tem uma lista de objetos e quer ordenar por algum campo:
      </p>
      <pre><code>{`class Pessoa {
  final String nome;
  final int idade;
  Pessoa(this.nome, this.idade);
  @override
  String toString() => '\$nome(\$idade)';
}

final p = [
  Pessoa('Ana', 30),
  Pessoa('Beto', 22),
  Pessoa('Carla', 41),
];

// Por idade crescente:
p.sort((a, b) => a.idade.compareTo(b.idade));
print(p); // [Beto(22), Ana(30), Carla(41)]

// Por nome alfabético:
p.sort((a, b) => a.nome.compareTo(b.nome));`}</code></pre>

      <h2>Ordenação por múltiplos campos</h2>
      <p>
        E se você quer &quot;ordenar por idade; em caso de empate, por nome&quot;? Basta encadear comparações: se a primeira deu zero, vá para a próxima.
      </p>
      <pre><code>{`final p = [
  Pessoa('Ana', 30),
  Pessoa('Beto', 30),
  Pessoa('Carla', 25),
  Pessoa('Beto', 25),
];

p.sort((a, b) {
  final porIdade = a.idade.compareTo(b.idade);
  if (porIdade != 0) return porIdade;
  return a.nome.compareTo(b.nome); // desempate
});
print(p); // [Beto(25), Carla(25), Ana(30), Beto(30)]`}</code></pre>
      <p>
        Para muitos campos, dá para extrair em uma função utilitária ou usar a extensão <code>sortedBy</code>/<code>thenBy</code> do <code>package:collection</code>.
      </p>

      <h2>Estabilidade e desempenho</h2>
      <p>
        Uma ordenação é <strong>estável</strong> quando elementos com mesma chave preservam a ordem em que apareciam na entrada. O <code>List.sort</code> do Dart é estável a partir do Dart 2.14, então você pode contar com isso para ordenações em camadas (ordene primeiro pelo critério secundário, depois pelo principal).
      </p>
      <pre><code>{`final p = [
  Pessoa('Ana', 30),
  Pessoa('Beto', 25),
  Pessoa('Carla', 30),
];

// Ordenação em &quot;duas passadas&quot; — funciona porque sort é estável.
p.sort((a, b) => a.nome.compareTo(b.nome));   // por nome
p.sort((a, b) => a.idade.compareTo(b.idade)); // depois por idade
// Idade ASC; nomes do mesmo grupo ficam em ordem alfabética.`}</code></pre>

      <AlertBox type="info" title="Helpers úteis">
        O pacote <code>package:collection</code> traz <code>sortedBy</code>, <code>sortedByCompare</code>, <code>sorted</code> (que devolve uma <em>nova</em> lista) e <code>min</code>/<code>max</code> com comparator. Vale a pena ter no seu <code>pubspec.yaml</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar <code>sort()</code> em lista de objetos sem Comparable</strong>: o Dart joga erro de tipo. Forneça um Comparator.</li>
        <li><strong>Esquecer que <code>sort</code> muda a lista</strong>: clone com <code>[...lista]..sort()</code> se quiser preservar.</li>
        <li><strong>Usar <code>a - b</code> com <code>double</code></strong>: subtração devolve <code>double</code>, não <code>int</code>. Sempre use <code>compareTo</code>.</li>
        <li><strong>Comparador inconsistente</strong> (não respeita transitividade) gera ordenação imprevisível.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>list.sort()</code> usa ordem natural; ordena no lugar.</li>
        <li>Comparator é <code>(a, b) =&gt; int</code>: negativo, zero, positivo.</li>
        <li>Para inverter, troque <code>a</code> e <code>b</code>: <code>(a, b) =&gt; b.compareTo(a)</code>.</li>
        <li>Para múltiplos campos, encadeie comparações ou aproveite a estabilidade.</li>
        <li><code>package:collection</code> oferece helpers como <code>sortedBy</code>.</li>
      </ul>
    </PageContainer>
  );
}
