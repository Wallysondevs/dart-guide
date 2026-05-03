import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TiposPrimitivos() {
  return (
    <PageContainer
      title="Tipos primitivos: int, double, num, bool, String"
      subtitle="Os blocos básicos com os quais você constrói tudo em Dart — números, verdades/falsidades e textos."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Antes de construir uma casa, você precisa conhecer os tijolos. Em Dart, os <strong>tipos primitivos</strong> são esses tijolos: pedaços simples de informação que o computador sabe manipular nativamente. Curiosidade boa de saber: em Dart, mesmo os primitivos são <em>objetos</em> — todo número, texto e booleano herda de <code>Object</code> e tem métodos. Isso é diferente de Java/C++, onde &quot;primitivo&quot; é algo separado de &quot;objeto&quot;.
      </p>

      <h2><code>int</code>: números inteiros</h2>
      <p>
        <code>int</code> guarda números <strong>sem casa decimal</strong>. Em Dart nativo (mobile, desktop, servidor), <code>int</code> tem 64 bits — vai de aproximadamente <code>-9.2 × 10^18</code> até <code>+9.2 × 10^18</code>. No Dart compilado para JavaScript (web), o <code>int</code> é representado como número de ponto flutuante de 64 bits do JS, com precisão até 2^53.
      </p>
      <pre><code>{`int idade = 25;
int negativo = -7;
int hex = 0xFF;          // hexadecimal: 255
int binario = 0;         // Dart não tem literal binária; use int.parse('1010', radix: 2)

// Métodos úteis em int
print(10.isEven);        // true
print(10.isOdd);         // false
print((-7).abs());       // 7
print(5.toRadixString(2)); // '101'`}</code></pre>

      <h2><code>double</code>: ponto flutuante IEEE 754</h2>
      <p>
        <code>double</code> guarda números com casa decimal, seguindo o padrão <strong>IEEE 754 de 64 bits</strong> — o mesmo usado na maioria das linguagens. Ele é incrivelmente útil, mas tem uma armadilha clássica: <strong>nem todo decimal pode ser representado exatamente</strong>. Por isso <code>0.1 + 0.2</code> dá <code>0.30000000000000004</code>, não <code>0.3</code>.
      </p>
      <pre><code>{`double altura = 1.72;
double tempC = -3.5;
double cientifico = 1.5e3;   // 1500.0

print(0.1 + 0.2);            // 0.30000000000000004
print(double.infinity);       // +Infinity
print(double.nan == double.nan); // false! NaN nunca é igual a si mesmo`}</code></pre>

      <AlertBox type="warning" title="Não use double para dinheiro">
        Para valores monetários, prefira armazenar em <strong>centavos como int</strong> ou usar uma biblioteca como <code>decimal</code>. Erros de centavos somando virar problema legal.
      </AlertBox>

      <h2><code>num</code>: a superclasse comum</h2>
      <p>
        <code>num</code> é o &quot;guarda-chuva&quot; que cobre <code>int</code> e <code>double</code>. Use quando uma função precisa aceitar qualquer número, seja inteiro ou decimal.
      </p>
      <pre><code>{`num qualquerNumero = 10;     // pode ser int
qualquerNumero = 3.14;        // ou double

double dobrar(num x) => x * 2.0;
print(dobrar(5));             // 10.0
print(dobrar(2.5));           // 5.0

// num tem métodos comuns
print((3.7).round());         // 4
print((3.7).floor());          // 3
print((3.2).ceil());           // 4`}</code></pre>

      <h2><code>bool</code>: estritamente <code>true</code> ou <code>false</code></h2>
      <p>
        Booleano em Dart é <em>estrito</em>: só aceita <code>true</code> ou <code>false</code>. Não existe &quot;truthy/falsy&quot; como em JavaScript ou Python. Strings vazias, zero, ou null <strong>não</strong> são automaticamente falsos — você precisa comparar explicitamente.
      </p>
      <pre><code>{`bool ativo = true;
bool fechado = false;

// JavaScript permitiria: if (texto) { ... }
// Dart NÃO permite:
String texto = '';
// if (texto) {}        // ERRO: texto não é bool

if (texto.isEmpty) {     // Você precisa ser explícito
  print('Vazio');
}

int n = 0;
// if (n) {}             // ERRO
if (n == 0) print('zero');`}</code></pre>

      <h2><code>String</code>: sequência de caracteres UTF-16</h2>
      <p>
        <code>String</code> em Dart é uma sequência imutável de <strong>code units UTF-16</strong>. Imutável significa que toda operação que &quot;modifica&quot; uma string na verdade cria uma nova. UTF-16 é uma codificação de texto que cobre praticamente todos os idiomas do mundo, mas precisa de <em>dois</em> code units para representar emojis e caracteres mais raros.
      </p>
      <pre><code>{`String saudacao = 'Olá, mundo!';
String dupla = "também funciona";

print(saudacao.length);         // 11
print(saudacao.toUpperCase());  // OLÁ, MUNDO!
print(saudacao.contains('mundo'));  // true
print(saudacao.substring(0, 3)); // 'Olá'

// Dart não tem tipo 'char'! Um caractere é uma String de tamanho 1
String letra = saudacao[0];      // 'O'`}</code></pre>

      <h2>Runes: lidando com emojis e caracteres Unicode</h2>
      <p>
        Como UTF-16 usa 2 unidades para emojis, contar &quot;letras&quot; com <code>length</code> dá errado. Para isso existem as <strong>runes</strong> — code points Unicode completos.
      </p>
      <pre><code>{`String s = '🐦Dart';
print(s.length);           // 6 (o pássaro ocupa 2 code units!)
print(s.runes.length);     // 5 (5 caracteres reais)

for (final rune in s.runes) {
  print(String.fromCharCode(rune));
}

// Para grafemas mais complexos (emojis com modificadores),
// use o pacote 'characters' do Dart team.`}</code></pre>

      <AlertBox type="info" title="Nada de tipo char">
        Dart não tem um tipo separado para caractere (como <code>char</code> em Java). Um caractere é simplesmente uma <code>String</code> de tamanho 1. Para o valor numérico do code point, use <code>'A'.codeUnitAt(0)</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Comparar <code>double</code> com <code>==</code>:</strong> use <code>(a - b).abs() &lt; 1e-9</code> para tolerância.</li>
        <li><strong>Esperar truthy de strings/números:</strong> Dart é estrito; sempre compare.</li>
        <li><strong>Dividir <code>int</code> por <code>int</code> esperando <code>int</code>:</strong> <code>10 / 3</code> dá <code>double</code> (3.333...). Use <code>~/</code> para divisão inteira.</li>
        <li><strong>Achar que <code>length</code> conta letras com emojis:</strong> conta code units, não grafemas.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>int</code>: inteiros de 64 bits (53 no web).</li>
        <li><code>double</code>: ponto flutuante IEEE 754, com imprecisões previsíveis.</li>
        <li><code>num</code>: superclasse de <code>int</code> e <code>double</code>.</li>
        <li><code>bool</code>: estritamente <code>true</code> ou <code>false</code>, sem truthy.</li>
        <li><code>String</code>: imutável, UTF-16, sem tipo <code>char</code> separado.</li>
        <li><code>runes</code> e o pacote <code>characters</code> resolvem emojis/Unicode.</li>
      </ul>
    </PageContainer>
  );
}
