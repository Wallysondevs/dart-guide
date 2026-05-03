import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CondicionaisIf() {
  return (
    <PageContainer
      title="Condicionais: if, else, switch e if expression"
      subtitle="Tomando decisões no código — desde o velho if até as elegantes switch expressions de Dart 3."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Programar é, em grande parte, <strong>tomar decisões</strong>. &quot;Se o usuário está logado, mostre o painel; senão, mande para a tela de login.&quot; Cada bifurcação do código é uma escolha. Em Dart, você tem várias ferramentas para isso, desde o clássico <code>if</code> (presente em quase toda linguagem) até a moderna <strong>switch expression</strong> introduzida em Dart 3, que permite trabalhar com padrões de forma quase mágica.
      </p>

      <h2><code>if</code>, <code>else if</code>, <code>else</code></h2>
      <p>
        A estrutura mais básica. A condição entre parênteses precisa ser obrigatoriamente <code>bool</code> (Dart é estrito — nada de truthy/falsy).
      </p>
      <pre><code>{`int idade = 17;

if (idade >= 18) {
  print('Maior de idade');
} else if (idade >= 13) {
  print('Adolescente');
} else {
  print('Criança');
}

// Sem chaves para uma única instrução (não recomendado!)
if (idade > 0) print('Idade válida');

// Boa prática: SEMPRE chaves, mesmo para 1 linha`}</code></pre>

      <AlertBox type="warning" title="Sempre use chaves">
        O bug mais clássico do mundo (Apple SSL &quot;goto fail&quot;) aconteceu por causa de <code>if</code> sem chaves. Use chaves sempre — leva milissegundos para digitar e evita anos de cabelo branco.
      </AlertBox>

      <h2>If como expressão? Use o ternário ou switch expression</h2>
      <p>
        Diferente de Kotlin ou Rust, em Dart o <code>if</code> não é uma expressão (não retorna valor). Para isso, use o ternário <code>?:</code> ou a nova <strong>switch expression</strong>.
      </p>
      <pre><code>{`int idade = 20;

// Ternário
String categoria = idade >= 18 ? 'adulto' : 'menor';

// Switch expression (Dart 3+) é ainda mais legível
String faixa = switch (idade) {
  < 13 => 'criança',
  < 18 => 'adolescente',
  < 60 => 'adulto',
  _    => 'idoso',
};
print(faixa);`}</code></pre>

      <h2><code>switch</code> clássico (statement)</h2>
      <p>
        O <code>switch</code> tradicional compara um valor contra vários casos. Cada <code>case</code> precisa terminar com <code>break</code>, <code>return</code>, <code>continue</code> ou <code>throw</code> — Dart <strong>não tem fall-through implícito</strong> como C.
      </p>
      <pre><code>{`String dia = 'segunda';

switch (dia) {
  case 'segunda':
  case 'terça':
  case 'quarta':
  case 'quinta':
  case 'sexta':
    print('Dia útil');
    break;
  case 'sábado':
  case 'domingo':
    print('Fim de semana');
    break;
  default:
    print('Dia desconhecido');
}`}</code></pre>

      <h2>Switch expression (Dart 3): a nova estrela</h2>
      <p>
        Switch <em>expression</em> retorna um valor diretamente. Usa <code>=&gt;</code> em cada caso e <code>_</code> como wildcard (default). É exaustiva: o compilador exige que todos os casos possíveis sejam cobertos.
      </p>
      <pre><code>{`String mensagem(int codigo) => switch (codigo) {
  200 => 'OK',
  201 => 'Criado',
  301 || 302 => 'Redirecionamento',     // padrão OR
  >= 400 && < 500 => 'Erro do cliente', // padrão relacional
  >= 500 => 'Erro do servidor',
  _ => 'Desconhecido',
};

print(mensagem(404));   // Erro do cliente
print(mensagem(500));   // Erro do servidor`}</code></pre>

      <h2>Patterns e a guarda <code>when</code></h2>
      <p>
        Cada caso de switch pode usar <strong>patterns</strong>: destruturação de records, listas, objetos. E você pode adicionar uma <strong>guarda</strong> com <code>when</code> para condições extras.
      </p>
      <pre><code>{`(int, int) ponto = (3, 4);

String descreverPonto((int, int) p) => switch (p) {
  (0, 0)              => 'origem',
  (var x, 0)          => 'sobre o eixo X em \$x',
  (0, var y)          => 'sobre o eixo Y em \$y',
  (var x, var y) when x == y => 'diagonal em \$x',
  (var x, var y)      => 'ponto livre (\$x, \$y)',
};

print(describirPonto((0, 0)));     // (exemplo)
print(descreverPonto((3, 4)));    // ponto livre (3, 4)`}</code></pre>

      <AlertBox type="info" title="when é só dentro de patterns">
        Diferente de Kotlin, Dart não tem <code>when</code> como uma estrutura independente. <code>when</code> existe apenas como guarda de pattern dentro de switch.
      </AlertBox>

      <h2>Exhaustiveness check com sealed classes</h2>
      <p>
        Quando você combina <code>switch</code> expression com <strong>sealed classes</strong> (classes seladas — Dart 3), o compilador <em>obriga</em> você a cobrir todos os subtipos. Esquecer um vira erro de compilação. Isso elimina uma classe inteira de bugs.
      </p>
      <pre><code>{`sealed class Forma {}
class Circulo extends Forma { final double r; Circulo(this.r); }
class Quadrado extends Forma { final double l; Quadrado(this.l); }
class Triangulo extends Forma {
  final double base, altura;
  Triangulo(this.base, this.altura);
}

double area(Forma f) => switch (f) {
  Circulo(:final r)            => 3.14159 * r * r,
  Quadrado(:final l)           => l * l,
  Triangulo(:final base, :final altura) => base * altura / 2,
};

// Se você adicionar 'class Pentagono extends Forma',
// o compilador vai gritar até você lidar com ele aqui.`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>break</code> num switch statement</strong> — Dart proíbe fall-through; vira erro.</li>
        <li><strong>Usar <code>if (x)</code> com <code>x</code> não-bool</strong> — Dart é estrito.</li>
        <li><strong>Esquecer o caso <code>_</code> em switch expression</strong> sobre tipos abertos — gera erro de não-exaustividade.</li>
        <li><strong>Usar <code>=</code> em vez de <code>==</code></strong> em condições — felizmente o compilador pega.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>if/else if/else</code> exige <code>bool</code> e sempre use chaves.</li>
        <li><code>switch</code> statement não tem fall-through; precisa <code>break</code>.</li>
        <li>Switch expression (<code>=&gt;</code>) retorna valor e é exaustiva.</li>
        <li>Patterns permitem destruturar e usar <code>when</code> como guarda.</li>
        <li>Sealed classes + switch expression = exaustividade garantida.</li>
        <li>Para if que retorna valor, use ternário ou switch expression.</li>
      </ul>
    </PageContainer>
  );
}
