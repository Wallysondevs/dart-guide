import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Operadores() {
  return (
    <PageContainer
      title="Operadores aritméticos, lógicos e relacionais"
      subtitle="Os símbolos que fazem o trabalho pesado: somar, comparar, combinar condições e proteger contra null."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Operadores são <strong>símbolos com superpoderes</strong>: cada um faz uma operação específica entre valores. Em Dart, eles são bastante parecidos com os de Java, C# ou JavaScript, com algumas adições muito úteis (como o operador <code>~/</code> de divisão inteira e o <code>??</code> para tratamento de null). Pense em operadores como ferramentas de uma caixinha — saber qual usar em cada momento é o que separa código verboso de código elegante.
      </p>

      <h2>Aritméticos: a matemática do dia a dia</h2>
      <p>
        Os clássicos: soma, subtração, multiplicação, divisão. A novidade interessante é o <code>~/</code>, que faz <strong>divisão inteira</strong> (descarta a parte decimal), e o <code>%</code>, que devolve o resto da divisão.
      </p>
      <pre><code>{`int a = 10;
int b = 3;

print(a + b);   // 13  (soma)
print(a - b);   // 7   (subtração)
print(a * b);   // 30  (multiplicação)
print(a / b);   // 3.3333333333333335  (sempre double!)
print(a ~/ b);  // 3   (divisão inteira)
print(a % b);   // 1   (resto da divisão)
print(-a);      // -10 (negação unária)

// Incremento e decremento
int i = 0;
i++;            // pós-incremento: usa e depois soma
++i;            // pré-incremento: soma e depois usa
i--;            // pós-decremento
--i;            // pré-decremento`}</code></pre>

      <AlertBox type="info" title="Divisão sempre devolve double">
        Em Dart, <code>/</code> SEMPRE devolve <code>double</code>, mesmo que ambos os operandos sejam <code>int</code>. Para resultado inteiro, use <code>~/</code>.
      </AlertBox>

      <h2>Relacionais: comparando valores</h2>
      <p>
        Operadores relacionais comparam dois valores e devolvem <code>bool</code>. Use-os em <code>if</code>, <code>while</code> e em qualquer expressão que precise de verdade/falsidade.
      </p>
      <pre><code>{`int x = 5, y = 10;

print(x == y);   // false (igualdade)
print(x != y);   // true  (diferença)
print(x < y);    // true
print(x > y);    // false
print(x <= 5);   // true
print(y >= 10);  // true

// Em strings, == compara conteúdo:
print('Ana' == 'Ana');   // true
print('ana' == 'Ana');   // false (case-sensitive)`}</code></pre>

      <h2>Lógicos: combinando condições</h2>
      <p>
        São três: <code>&amp;&amp;</code> (E), <code>||</code> (OU) e <code>!</code> (NÃO). Eles também usam <strong>short-circuit</strong>: se o resultado já é claro pelo primeiro operando, o segundo nem é avaliado.
      </p>
      <pre><code>{`bool logado = true;
bool admin = false;

if (logado && admin) print('mostra painel');
if (logado || admin) print('mostra menu');
if (!logado) print('faça login');

// Short-circuit evita erros
String? nome;
if (nome != null && nome.length > 3) {
  print(nome);  // só roda length se nome != null
}`}</code></pre>

      <h2>Operadores null-aware: <code>??</code>, <code>??=</code> e <code>?.</code></h2>
      <p>
        Em Dart, valores podem ser <code>null</code> (ausência de valor). Estes operadores tornam trabalhar com null seguro e enxuto.
      </p>
      <pre><code>{`String? apelido;
String exibicao = apelido ?? 'Anônimo';
// Se apelido for null, usa 'Anônimo'

apelido ??= 'Padrão';   // Atribui só se for null

// ?. acessa um membro só se o objeto não for null
String? texto;
int? tam = texto?.length;  // null se texto for null

// Combinando: se for null, usa 0
int tamanho = texto?.length ?? 0;`}</code></pre>

      <AlertBox type="success" title="Null-safety na prática">
        Esses três operadores eliminam montanhas de <code>if (x != null)</code>. Use-os sempre que estiver lidando com valores opcionais.
      </AlertBox>

      <h2>Cascade <code>..</code>: chamando vários métodos no mesmo objeto</h2>
      <p>
        O <strong>cascade</strong> é uma joia exclusiva de Dart. Ele permite encadear chamadas no mesmo objeto sem repetir o nome dele.
      </p>
      <pre><code>{`// Sem cascade
var lista = <int>[];
lista.add(1);
lista.add(2);
lista.add(3);

// Com cascade
var lista2 = <int>[]
  ..add(1)
  ..add(2)
  ..add(3);

// Funciona com null-aware também: ?..
String? texto;
texto?..trim()..toUpperCase();`}</code></pre>

      <h2>Bitwise: trabalhando com bits</h2>
      <p>
        Operações bit a bit são úteis para manipular flags, máscaras e protocolos de baixo nível. Você raramente vai usar isso em apps Flutter, mas é bom conhecer.
      </p>
      <pre><code>{`int a = 0xF0;  // 11110000
int b = 0x0F;  // 00001111

print(a & b);   // 0x00  (AND)
print(a | b);   // 0xFF  (OR)
print(a ^ b);   // 0xFF  (XOR)
print(~a & 0xFF); // 0x0F (NOT, mascarado)
print(1 << 4);  // 16   (shift left)
print(16 >> 2); // 4    (shift right)`}</code></pre>

      <h2>Ternário <code>?:</code> e atribuição condicional</h2>
      <p>
        O operador ternário é um <code>if/else</code> em uma linha — perfeito para atribuições simples baseadas em uma condição.
      </p>
      <pre><code>{`int idade = 18;
String categoria = idade >= 18 ? 'adulto' : 'menor';

// Aninhar é possível mas evite — fica ilegível:
String nota(int n) =>
  n >= 90 ? 'A' :
  n >= 80 ? 'B' :
  n >= 70 ? 'C' : 'D';`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Confundir <code>=</code> (atribuição) com <code>==</code> (comparação)</strong> — Dart te ajuda barrando <code>if (x = 1)</code>.</li>
        <li><strong>Esperar inteiro de <code>/</code></strong> — sempre vira double; use <code>~/</code>.</li>
        <li><strong>Encadear <code>..</code> com método que retorna outro objeto</strong> — cascade ignora retorno; use <code>.</code> normal nesse caso.</li>
        <li><strong>Esquecer parênteses em <code>(a + b) * c</code></strong> — precedência de operadores pega muita gente.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Aritméticos: <code>+ - * / ~/ %</code> e incremento <code>++/--</code>.</li>
        <li>Relacionais devolvem <code>bool</code>; <code>==</code> compara conteúdo.</li>
        <li>Lógicos: <code>&amp;&amp;</code>, <code>||</code>, <code>!</code> com short-circuit.</li>
        <li>Null-aware: <code>??</code>, <code>??=</code>, <code>?.</code> simplificam null.</li>
        <li>Cascade <code>..</code> encadeia chamadas no mesmo objeto.</li>
        <li>Bitwise para manipulação de bits; ternário <code>?:</code> para atribuição condicional.</li>
      </ul>
    </PageContainer>
  );
}
