import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SwitchExpressions() {
  return (
    <PageContainer
      title="Switch expressions: expressão em vez de declaração"
      subtitle="Quando o switch deixa de &quot;executar passos&quot; e passa a &quot;produzir um valor&quot;."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Imagine duas formas de pedir um café: na primeira, você diz ao barista &quot;moa o grão, esquente a água, derrame na xícara, traga para mim&quot; — uma sequência de comandos. Na segunda, você simplesmente diz &quot;quero um expresso&quot; e recebe a xícara pronta. A diferença é que a segunda é uma <em>expressão</em>: você pede algo e recebe um <strong>valor</strong>. O Dart 3 trouxe essa segunda forma para o <code>switch</code>: agora ele não precisa mais ser apenas uma sequência de comandos (declaração) — ele pode ser uma expressão que <em>devolve</em> um valor.
      </p>

      <h2>Da declaração à expressão</h2>
      <p>
        Comparar lado a lado é a melhor forma de entender a evolução:
      </p>
      <pre><code>{`// Switch statement (declaração) — estilo antigo
String descreverV1(int n) {
  String resultado;
  switch (n) {
    case 1:
      resultado = 'um';
      break;
    case 2:
      resultado = 'dois';
      break;
    default:
      resultado = 'outro';
  }
  return resultado;
}

// Switch expression (Dart 3) — estilo novo
String descreverV2(int n) => switch (n) {
  1 => 'um',
  2 => 'dois',
  _ => 'outro',
};`}</code></pre>

      <p>
        A versão nova é mais curta, não precisa de variável intermediária, não precisa de <code>break</code> e devolve diretamente o valor. Note as três mudanças sintáticas principais:
      </p>
      <ul>
        <li>Cada caso usa <code>=&gt;</code> em vez de <code>:</code>.</li>
        <li>Casos terminam com <code>,</code> em vez de <code>break;</code>.</li>
        <li>O default é representado por <code>_</code> (wildcard).</li>
      </ul>

      <h2>Sem break, sem fall-through</h2>
      <p>
        No switch statement antigo, esquecer um <code>break</code> fazia o código &quot;cair&quot; para o próximo case (o famoso <em>fall-through</em>) — fonte clássica de bugs sutis. Em switch expressions, isso simplesmente não existe: cada case é uma expressão isolada.
      </p>

      <AlertBox type="info" title="Por que essa mudança importa?">
        Eliminar fall-through e <code>break</code> reduz drasticamente a chance de erro. O <code>=&gt;</code> deixa explícito: &quot;esse caso produz esse valor, e ponto&quot;.
      </AlertBox>

      <h2>Exhaustive checking: o compilador conta os casos</h2>
      <p>
        Switch expressions são <strong>exaustivas</strong>: o compilador (programa que checa o código antes de rodar) garante que <em>todos</em> os valores possíveis estão cobertos. Se você esquecer um, ele reclama. Isso é especialmente poderoso com <code>enum</code> e <code>sealed class</code>.
      </p>
      <pre><code>{`enum Cor { vermelho, verde, azul }

String hex(Cor c) => switch (c) {
  Cor.vermelho => '#FF0000',
  Cor.verde    => '#00FF00',
  Cor.azul     => '#0000FF',
  // Sem default! O compilador sabe que cobrimos tudo.
};

// Se eu adicionasse Cor.amarelo no enum, o switch acima ficaria com erro
// de compilação: "missing case for 'amarelo'". Refatoração segura.`}</code></pre>

      <h2>Integração com sealed classes</h2>
      <p>
        Sealed classes (hierarquias fechadas em um único arquivo) potencializam isso ainda mais. O Dart consegue saber todos os subtipos possíveis e exigir que cada um seja tratado.
      </p>
      <pre><code>{`sealed class Forma {}
class Circulo extends Forma { final double raio; Circulo(this.raio); }
class Quadrado extends Forma { final double lado; Quadrado(this.lado); }
class Triangulo extends Forma {
  final double base, altura;
  Triangulo(this.base, this.altura);
}

double area(Forma f) => switch (f) {
  Circulo(:final raio)              => 3.14 * raio * raio,
  Quadrado(:final lado)             => lado * lado,
  Triangulo(:final base, :final altura) => base * altura / 2,
};`}</code></pre>

      <h2>Patterns dentro do case</h2>
      <p>
        Cada case de uma switch expression aceita qualquer pattern (padrão), tornando-a extremamente expressiva.
      </p>
      <pre><code>{`String classificar((int, int) ponto) => switch (ponto) {
  (0, 0)              => 'origem',
  (final x, 0)        => 'eixo x em \$x',
  (0, final y)        => 'eixo y em \$y',
  (final x, final y) when x == y => 'diagonal em \$x',
  _                   => 'qualquer outro',
};`}</code></pre>

      <AlertBox type="warning" title="when para condições">
        Se você precisa filtrar valores além da forma (ex.: &quot;positivos apenas&quot;), use <code>when</code> depois do pattern. Sem <code>when</code>, o switch só compara estrutura.
      </AlertBox>

      <h2>Comparação completa: statement vs expression</h2>
      <p>
        A regra prática: use <strong>switch expression</strong> sempre que você quer um valor; use <strong>switch statement</strong> só quando precisa executar efeitos colaterais (imprimir, salvar, navegar).
      </p>
      <pre><code>{`// Expression: produzir valor (preferido)
final mensagem = switch (status) {
  200 => 'OK',
  404 => 'Não encontrado',
  500 => 'Erro interno',
  _   => 'Status \$status',
};

// Statement: efeitos colaterais
switch (acao) {
  case 'salvar':
    salvar();
  case 'imprimir':
    imprimir();
  case 'sair':
    exit(0);
}`}</code></pre>

      <h2>Combinando casos com ||</h2>
      <p>
        Se vários valores devem produzir o mesmo resultado, use <code>||</code> dentro do pattern (chama-se &quot;logical-or pattern&quot;):
      </p>
      <pre><code>{`String tipoDia(String dia) => switch (dia) {
  'sáb' || 'dom' => 'fim de semana',
  'seg' || 'ter' || 'qua' || 'qui' || 'sex' => 'útil',
  _ => 'desconhecido',
};`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer a vírgula</strong> no fim de cada case — não compila.</li>
        <li><strong>Usar <code>:</code> em vez de <code>=&gt;</code></strong> — confusão entre statement e expression.</li>
        <li><strong>Não cobrir todos os casos</strong> sem <code>_</code> — exhaustiveness reclama.</li>
        <li><strong>Misturar <code>break</code></strong> em uma expression — não existe ali; o ponto é não precisar.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Switch expressions usam <code>=&gt;</code> e <code>,</code> em cada caso, sem <code>break</code>.</li>
        <li>São <strong>exaustivas</strong>: o compilador exige cobertura total para enums e sealed classes.</li>
        <li>Suportam patterns completos, inclusive <code>when</code> e <code>||</code>.</li>
        <li>Use expression para produzir valor; statement para efeitos colaterais.</li>
      </ul>
    </PageContainer>
  );
}
