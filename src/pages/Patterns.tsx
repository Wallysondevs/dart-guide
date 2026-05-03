import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Patterns() {
  return (
    <PageContainer
      title="Patterns: pattern matching em Dart 3"
      subtitle="Decomponha estruturas complexas em uma linha — como peneirar areia até achar a pepita."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine que você recebe um pacote dos correios e quer, sem rasgar tudo, descobrir três coisas: se é um livro, qual o título e quem é o autor. Você não vai abrir métodos diferentes para cada hipótese — você quer um único &quot;teste e extraia tudo de uma vez&quot;. <strong>Patterns</strong> (padrões) em Dart 3 fazem exatamente isso: combinam <em>checagem de tipo/forma</em> com <em>extração de valores</em> em uma única expressão. É um dos recursos mais elegantes que o Dart ganhou recentemente, inspirado em linguagens como Rust, Swift e Scala.
      </p>

      <h2>if-case: testar e extrair em um único if</h2>
      <p>
        A estrutura <code>if (x case Pattern)</code> testa se <code>x</code> bate com o padrão e, se sim, vincula variáveis. Pense como um <em>if</em> turbinado.
      </p>
      <pre><code>{`Object dado = [1, 2, 3];

if (dado case [int a, int b, int c]) {
  // Bate: dado é uma lista de exatamente 3 inteiros.
  print('soma = \${a + b + c}'); // 6
}

Object resposta = (status: 200, corpo: 'OK');
if (resposta case (status: 200, corpo: final c)) {
  print('sucesso: \$c');
}`}</code></pre>

      <h2>Switch statement com patterns</h2>
      <p>
        O <code>switch</code> ganhou superpoderes: cada <code>case</code> pode ser um pattern complexo, e variáveis vinculadas ficam disponíveis dentro do bloco.
      </p>
      <pre><code>{`Object o = (1, 2);

switch (o) {
  case (0, 0):
    print('origem');
  case (final x, 0):
    print('eixo x em \$x');
  case (0, final y):
    print('eixo y em \$y');
  case (final x, final y):
    print('ponto (\$x, \$y)');
  default:
    print('desconhecido');
}`}</code></pre>

      <h2>Padrão de lista: [1, 2, ...]</h2>
      <p>
        Você pode descrever a forma de uma lista com elementos fixos e usar <code>...</code> para &quot;qualquer coisa no meio&quot;.
      </p>
      <pre><code>{`final lista = [1, 2, 3, 4, 5];

switch (lista) {
  case [1, ..., 5]:
    print('começa com 1 e termina com 5');
  case [final primeiro, ..., final ultimo]:
    print('extremos: \$primeiro..\$ultimo');
  case []:
    print('vazia');
}

// Pegar a cauda em uma variável:
if (lista case [final cabeca, ...final cauda]) {
  print('cabeça=\$cabeca, cauda=\$cauda'); // cabeça=1, cauda=[2,3,4,5]
}`}</code></pre>

      <AlertBox type="info" title="Rest pattern">
        O <code>...</code> sozinho descarta os elementos do meio; <code>...final cauda</code> os captura em uma nova lista.
      </AlertBox>

      <h2>Object pattern: extrair campos por nome</h2>
      <p>
        Para classes, use o nome da classe e os campos com <code>:</code> antes do nome. Isso vincula automaticamente o valor do campo a uma variável de mesmo nome — chamamos isso de <em>shorthand</em>.
      </p>
      <pre><code>{`class Pessoa {
  final String nome;
  final int idade;
  Pessoa(this.nome, this.idade);
}

Object p = Pessoa('Ana', 30);

if (p case Pessoa(:final nome, :final idade)) {
  print('\$nome tem \$idade'); // Ana tem 30
}

// Renomeando a variável extraída:
if (p case Pessoa(nome: final n, idade: final i)) {
  print('\$n / \$i');
}

// Filtrando dentro do pattern (com 'when'):
if (p case Pessoa(:final idade) when idade >= 18) {
  print('é maior de idade');
}`}</code></pre>

      <h2>Wildcard _: &quot;não me importa&quot;</h2>
      <p>
        Use <code>_</code> (underscore) para indicar &quot;tem que existir, mas eu não quero esse valor&quot;. Útil para ignorar partes de uma estrutura.
      </p>
      <pre><code>{`final ponto = (1, 2, 3);

if (ponto case (final x, _, final z)) {
  print('x=\$x, z=\$z'); // ignora o do meio
}

switch (ponto) {
  case (0, _, _):
    print('x é zero');
  case (_, _, _):
    print('qualquer outra coisa');
}`}</code></pre>

      <h2>Padrões aninhados: o poder real</h2>
      <p>
        Patterns podem ser combinados livremente. Você consegue, em uma linha, validar e extrair dados profundos de uma estrutura JSON, por exemplo.
      </p>
      <pre><code>{`final resposta = {
  'usuario': {'nome': 'Bia', 'idade': 25},
  'tags': ['admin', 'beta'],
};

if (resposta case {
  'usuario': {'nome': final String n, 'idade': final int i},
  'tags': [final String primeira, ...],
}) {
  print('\$n (\$i) — primeira tag: \$primeira');
}`}</code></pre>

      <AlertBox type="warning" title="Cuidado com a profundidade">
        Patterns aninhados ficam ilegíveis se forem fundo demais. Se passar de 2-3 níveis, considere extrair um método auxiliar ou usar parsing dedicado.
      </AlertBox>

      <h2>Patterns em declarações: destructuring</h2>
      <p>
        Você também pode usar patterns para extrair valores em <code>final</code> e <code>var</code>:
      </p>
      <pre><code>{`final (x, y) = (10, 20);
print('\$x \$y'); // 10 20

final lista = [1, 2, 3];
final [a, b, c] = lista;
print('\$a \$b \$c'); // 1 2 3

// Trocando variáveis sem auxiliar
var nome = 'Ana', sobrenome = 'Silva';
(nome, sobrenome) = (sobrenome, nome);
print('\$nome \$sobrenome'); // Silva Ana`}</code></pre>

      <h2>Logical patterns: &amp;&amp; e ||</h2>
      <p>
        Você pode combinar patterns com <code>&amp;&amp;</code> (ambos) e <code>||</code> (qualquer um):
      </p>
      <pre><code>{`int avaliar(Object o) {
  return switch (o) {
    int n when n > 0 || n == 100 => 1,
    String s && var x when x.isNotEmpty => 2,
    _ => 0,
  };
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>final</code>/<code>var</code></strong> ao vincular: <code>case (x, y)</code> não declara x e y novos.</li>
        <li><strong>Pattern de lista com tamanho errado</strong>: <code>[a, b]</code> só bate em listas de 2 elementos exatos (sem <code>...</code>).</li>
        <li><strong>Confundir <code>_</code> com declaração</strong>: ele é só wildcard, não cria variável.</li>
        <li><strong>Esquecer <code>when</code></strong> para condições adicionais — sem ele, o pattern só checa estrutura, não valores.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>if (x case Pattern)</code> testa e extrai em uma só expressão.</li>
        <li>Switch, declarações e <code>if</code> aceitam patterns.</li>
        <li>Listas suportam <code>[a, b]</code>, <code>[primeiro, ...resto]</code>.</li>
        <li>Objetos: <code>Pessoa(:nome, :idade)</code> extrai campos por nome.</li>
        <li><code>_</code> ignora; <code>when</code> adiciona condições.</li>
      </ul>
    </PageContainer>
  );
}
