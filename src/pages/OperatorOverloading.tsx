import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function OperatorOverloading() {
  return (
    <PageContainer
      title="Sobrecarga de operadores em Dart"
      subtitle="Como ensinar suas classes a responder a +, -, ==, [] e outros símbolos."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Você já escreve <code>3 + 4</code> sem pensar duas vezes. Mas e <code>vetor1 + vetor2</code>? Faz todo sentido somar vetores, mas como o Dart sabe o que isso significa? A resposta é <strong>sobrecarga de operadores</strong>: você ensina à classe que <code>+</code> equivale a chamar um método específico. É como dar um <em>nome carinhoso</em> a uma função — em vez de <code>v1.somar(v2)</code>, escreve <code>v1 + v2</code>.
      </p>

      <h2>Sintaxe</h2>
      <p>
        Use a palavra-chave <code>operator</code> seguida do símbolo. O método deve ser declarado dentro da classe, com tipo de retorno apropriado.
      </p>
      <pre><code>{`class Vetor {
  final double x, y;
  const Vetor(this.x, this.y);

  // Sobrecarrega o operador + para somar dois vetores.
  Vetor operator +(Vetor outro) => Vetor(x + outro.x, y + outro.y);

  // Sobrecarrega o operador - para subtrair.
  Vetor operator -(Vetor outro) => Vetor(x - outro.x, y - outro.y);

  // Multiplicação por escalar.
  Vetor operator *(double escalar) => Vetor(x * escalar, y * escalar);

  // Negação unária (-v).
  Vetor operator -() => Vetor(-x, -y);

  @override
  String toString() => '(\$x, \$y)';
}

void main() {
  final a = Vetor(1, 2);
  final b = Vetor(3, 4);
  print(a + b);   // (4, 6)
  print(a * 2.0); // (2, 4)
  print(-a);      // (-1, -2)
}`}</code></pre>

      <h2>Operadores que podem ser sobrecarregados</h2>
      <p>
        Nem todo símbolo aceita sobrecarga. Os permitidos são:
      </p>
      <ul>
        <li>Aritméticos: <code>+ - * / ~/ %</code></li>
        <li>Comparação: <code>== &lt; &gt; &lt;= &gt;=</code></li>
        <li>Bitwise: <code>&amp; | ^ ~ &lt;&lt; &gt;&gt; &gt;&gt;&gt;</code></li>
        <li>Acesso indexado: <code>[]</code> e <code>[]=</code></li>
        <li>Negação unária: <code>-</code> (sem operando à esquerda)</li>
      </ul>
      <p>
        <strong>Não dá para sobrecarregar</strong>: <code>=</code>, <code>&amp;&amp;</code>, <code>||</code>, <code>!</code>, <code>?:</code> e <code>!=</code> (este último é gerado automaticamente como o oposto de <code>==</code>).
      </p>

      <h2>Igualdade: <code>==</code> exige <code>hashCode</code></h2>
      <p>
        Quando você sobrescreve <code>==</code>, o Dart <strong>obriga</strong> a também sobrescrever <code>hashCode</code>. Isso porque estruturas como <code>Set</code> e <code>Map</code> usam o hash para indexar — dois objetos &quot;iguais&quot; precisam produzir o mesmo hash.
      </p>
      <pre><code>{`class Ponto {
  final double x, y;
  const Ponto(this.x, this.y);

  @override
  bool operator ==(Object outro) {
    if (identical(this, outro)) return true;
    return outro is Ponto && outro.x == x && outro.y == y;
  }

  @override
  int get hashCode => Object.hash(x, y);
}

void main() {
  final a = Ponto(1, 2);
  final b = Ponto(1, 2);
  print(a == b);            // true
  print({a, b}.length);     // 1 — Set vê como o mesmo
}`}</code></pre>

      <AlertBox type="warning" title="Quebra de contrato">
        Se você sobrescreve só <code>==</code> sem mexer em <code>hashCode</code>, <code>Set</code> e <code>Map</code> ficam inconsistentes — dois objetos &quot;iguais&quot; ocupam slots diferentes. Bug sutil e doloroso.
      </AlertBox>

      <h2>Acesso indexado <code>[]</code> e <code>[]=</code></h2>
      <p>
        Útil para classes que se comportam como coleções: matrizes, dicionários customizados, buffers.
      </p>
      <pre><code>{`class Matriz {
  final int linhas, colunas;
  final List<double> _dados;

  Matriz(this.linhas, this.colunas)
      : _dados = List.filled(linhas * colunas, 0);

  // Leitura: m[linha][coluna] — aqui aceita um Record (Dart 3).
  double operator [](({int l, int c}) idx) => _dados[idx.l * colunas + idx.c];

  // Escrita.
  void operator []=(({int l, int c}) idx, double v) =>
      _dados[idx.l * colunas + idx.c] = v;
}

void main() {
  final m = Matriz(3, 3);
  m[(l: 1, c: 2)] = 9.0;
  print(m[(l: 1, c: 2)]); // 9.0
}`}</code></pre>
      <p>
        O <code>(l: 1, c: 2)</code> é um <strong>record</strong> de Dart 3: um par de valores nomeados, criado &quot;na hora&quot; sem precisar declarar uma classe.
      </p>

      <h2>Comparação ordenada</h2>
      <p>
        Sobrecarregar <code>&lt;</code>, <code>&gt;</code> etc. é direto, mas se a ideia é tornar a classe ordenável por <code>List.sort</code>, prefira implementar <code>Comparable</code>.
      </p>
      <pre><code>{`class Dinheiro implements Comparable<Dinheiro> {
  final int centavos;
  const Dinheiro(this.centavos);

  bool operator <(Dinheiro outro) => centavos < outro.centavos;
  bool operator >(Dinheiro outro) => centavos > outro.centavos;

  @override
  int compareTo(Dinheiro outro) => centavos - outro.centavos;
}`}</code></pre>

      <AlertBox type="info" title="Use com parcimônia">
        Sobrecarga de operadores fica linda em classes matemáticas (vetor, matriz, dinheiro, complexo). Em classes de negócio comuns, <code>pedido + item</code> pode confundir mais que esclarecer. Quando em dúvida, prefira um método com nome explícito.
      </AlertBox>

      <h2>Vetor completo</h2>
      <pre><code>{`class Vetor {
  final double x, y, z;
  const Vetor(this.x, this.y, this.z);

  Vetor operator +(Vetor o) => Vetor(x + o.x, y + o.y, z + o.z);
  Vetor operator -(Vetor o) => Vetor(x - o.x, y - o.y, z - o.z);
  Vetor operator -() => Vetor(-x, -y, -z);
  Vetor operator *(double s) => Vetor(x * s, y * s, z * s);
  double operator [](int i) => switch (i) {
        0 => x,
        1 => y,
        2 => z,
        _ => throw RangeError('índice \$i'),
      };

  @override
  bool operator ==(Object o) =>
      o is Vetor && o.x == x && o.y == y && o.z == z;

  @override
  int get hashCode => Object.hash(x, y, z);

  @override
  String toString() => '(\$x, \$y, \$z)';
}

void main() {
  final a = Vetor(1, 2, 3);
  final b = Vetor(4, 5, 6);
  print(a + b);   // (5.0, 7.0, 9.0)
  print((a - b)); // (-3.0, -3.0, -3.0)
  print(a[1]);    // 2.0
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Sobrescrever <code>==</code> sem <code>hashCode</code></strong>: bug em Sets/Maps.</li>
        <li><strong>Esquecer <code>@override</code></strong> ao sobrescrever <code>==</code> ou <code>hashCode</code>: o linter avisa.</li>
        <li><strong>Tentar sobrecarregar operadores não-permitidos</strong> (<code>=</code>, <code>!=</code>, <code>&amp;&amp;</code>): erro de compilação.</li>
        <li><strong>Confundir <code>identical</code> com <code>==</code></strong>: <code>identical</code> verifica se é o mesmo objeto em memória; <code>==</code> verifica igualdade de valor.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Use <code>operator</code> + símbolo dentro da classe para sobrecarregar.</li>
        <li>Permitidos: aritméticos, comparação, bitwise, indexação, negação unária.</li>
        <li>Sobrescrever <code>==</code> exige sobrescrever <code>hashCode</code> juntos.</li>
        <li><code>[]</code> e <code>[]=</code> permitem APIs estilo coleção.</li>
        <li>Use com parcimônia — clareza vence concisão em código de negócio.</li>
      </ul>
    </PageContainer>
  );
}
