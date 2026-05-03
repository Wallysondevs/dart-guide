import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ConversoesParse() {
  return (
    <PageContainer
      title="Conversões de tipos: parse, toString, as, is"
      subtitle="Como traduzir valores entre tipos de forma segura — sem deixar o programa explodir em runtime."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine que você recebe uma carta escrita à mão (uma <code>String</code> como <code>&quot;42&quot;</code>) e quer usar esse valor para fazer matemática. O computador não consegue somar texto com número — ele precisa de uma <strong>tradução</strong>. Essa tradução entre tipos é o que chamamos de <strong>conversão</strong>. Em Dart, há ferramentas para isso, e é fundamental escolher a versão segura para o seu programa não explodir quando o usuário digitar <code>&quot;abc&quot;</code> em vez de um número.
      </p>

      <h2><code>int.parse</code> e <code>double.parse</code>: texto vira número</h2>
      <p>
        <code>parse</code> tenta converter uma string em número. Se conseguir, devolve o valor; se não conseguir, <strong>lança uma exceção</strong> (interrompe o programa). Use só quando você tem certeza de que a string é válida.
      </p>
      <pre><code>{`int n = int.parse('42');           // 42
double pi = double.parse('3.14');  // 3.14
int hex = int.parse('FF', radix: 16); // 255

// Se falhar, joga exceção:
// int.parse('abc');  // FormatException`}</code></pre>

      <h2>As versões seguras: <code>tryParse</code></h2>
      <p>
        Para conversões vindas do mundo real (input de usuário, JSON, arquivos), use <code>tryParse</code>. Ele devolve <code>null</code> em vez de lançar exceção, permitindo lidar com o erro de forma controlada.
      </p>
      <pre><code>{`int? n = int.tryParse('42');     // 42
int? falha = int.tryParse('abc'); // null
double? d = double.tryParse('3.14'); // 3.14

// Padrão idiomático: tryParse + ?? para fallback
int idade = int.tryParse(entrada) ?? 0;

// Ou validação explícita
final valor = int.tryParse(entrada);
if (valor == null) {
  print('Entrada inválida');
} else {
  print('Você digitou \$valor');
}`}</code></pre>

      <AlertBox type="warning" title="parse vs tryParse">
        Use <code>parse</code> apenas quando a entrada é <strong>controlada por você</strong> (constantes, configs internas). Para qualquer dado externo, <code>tryParse</code> é a regra de ouro.
      </AlertBox>

      <h2><code>toString()</code>: qualquer coisa vira texto</h2>
      <p>
        Todo objeto em Dart herda <code>toString()</code> de <code>Object</code>. Por padrão, devolve algo como <code>Instance of 'MinhaClasse'</code>, mas você pode (e deve!) sobrescrever para representações úteis.
      </p>
      <pre><code>{`int n = 42;
print(n.toString());           // '42'
print(3.14.toString());        // '3.14'
print(true.toString());        // 'true'
print([1, 2, 3].toString());   // '[1, 2, 3]'

// Em interpolação, toString() é chamado automaticamente
var x = 10;
print('Valor: \$x');           // 'Valor: 10'

// Sobrescrevendo para classes próprias
class Pessoa {
  final String nome;
  final int idade;
  Pessoa(this.nome, this.idade);

  @override
  String toString() => 'Pessoa(\$nome, \$idade)';
}

print(Pessoa('Ana', 30));      // Pessoa(Ana, 30)`}</code></pre>

      <h2><code>is</code>: verificar o tipo de um valor</h2>
      <p>
        <code>is</code> pergunta &quot;este valor é do tipo X?&quot; e devolve <code>bool</code>. Como bônus, dentro de um <code>if (x is Tipo)</code>, Dart faz <strong>type promotion</strong>: trata <code>x</code> como sendo daquele tipo automaticamente, sem precisar de cast.
      </p>
      <pre><code>{`Object qualquer = 'olá';

if (qualquer is String) {
  // Aqui Dart promove qualquer para String
  print(qualquer.length);    // sem cast!
  print(qualquer.toUpperCase());
}

print(42 is int);            // true
print(42 is num);            // true (int é num)
print('abc' is! int);        // true (is! = não é)`}</code></pre>

      <h2><code>as</code>: cast explícito (com risco)</h2>
      <p>
        <code>as</code> diz &quot;trate este valor como sendo do tipo X&quot;. Se você estiver errado, lança uma exceção em runtime. É o último recurso — prefira <code>is</code> com type promotion.
      </p>
      <pre><code>{`Object x = 'olá';
String s = x as String;       // OK
print(s.toUpperCase());

// Object n = 42;
// String erro = n as String;   // TypeError em runtime!

// Padrão mais seguro: is + uso direto
if (x is String) {
  print(x.toUpperCase());      // sem precisar de cast
}`}</code></pre>

      <AlertBox type="info" title="Não existe as?">
        Diferente de C# ou Kotlin, Dart <strong>não tem operador <code>as?</code></strong> (cast seguro que devolve null). Para isso, use <code>is</code> seguido do uso, ou um pattern matching.
      </AlertBox>

      <h2>Conversões entre números</h2>
      <p>
        <code>int</code> e <code>double</code> têm métodos para converter um no outro. Cuidado com a perda de precisão.
      </p>
      <pre><code>{`int n = 10;
double d = n.toDouble();     // 10.0

double pi = 3.14;
int truncado = pi.toInt();    // 3 (descarta decimal)
int arred = pi.round();       // 3
int teto = pi.ceil();         // 4
int chao = pi.floor();        // 3

// num para int:
num x = 5.7;
int y = x.toInt();            // 5

// String com formatação:
print((3.14159).toStringAsFixed(2));  // '3.14'
print(255.toRadixString(16));         // 'ff'`}</code></pre>

      <h2>Convertendo coleções e patterns</h2>
      <p>
        Dart 3 trouxe <strong>patterns</strong>, que tornam type-checks ainda mais elegantes em condicionais e switches.
      </p>
      <pre><code>{`Object? recebido = 'abc';

// Switch com pattern de tipo
String descrever(Object? x) => switch (x) {
  int n  => 'inteiro: \$n',
  double d => 'decimal: \$d',
  String s => 'texto de \${s.length} chars',
  null   => 'nulo',
  _      => 'outra coisa',
};

print(describe(42));      // (exemplo)
print(descrever('oi'));   // texto de 2 chars

// Conversão de lista:
List<dynamic> lista = ['1', '2', '3'];
List<int> nums = lista
  .map((e) => int.tryParse(e.toString()) ?? 0)
  .toList();`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar <code>parse</code> em entrada de usuário</strong> e ver o app crashar.</li>
        <li><strong>Esquecer que <code>toInt()</code> trunca</strong> em vez de arredondar — use <code>.round()</code> se quiser arredondamento.</li>
        <li><strong>Tentar <code>as</code> em tipo errado</strong> — pegue <code>TypeError</code> em runtime.</li>
        <li><strong>Esperar <code>as?</code></strong> — não existe; use <code>is</code> com promotion.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>int.parse</code>/<code>double.parse</code>: lança em erro.</li>
        <li><code>tryParse</code>: devolve <code>null</code> em erro — preferível.</li>
        <li><code>toString()</code>: converte para texto; sobrescreva nas suas classes.</li>
        <li><code>is</code>: testa tipo e ativa type promotion.</li>
        <li><code>as</code>: cast explícito; risco de exceção.</li>
        <li>Para num→int: <code>toInt</code>, <code>round</code>, <code>floor</code>, <code>ceil</code>.</li>
      </ul>
    </PageContainer>
  );
}
