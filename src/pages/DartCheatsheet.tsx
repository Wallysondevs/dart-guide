import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartCheatsheet() {
  return (
    <PageContainer
      title="Cheatsheet final de Dart: tudo em uma página"
      subtitle="Referência rápida com a mínima quantidade de código necessária para lembrar cada feature da linguagem."
      difficulty="iniciante"
      timeToRead="20 min"
    >
      <p>
        Este capítulo é um <strong>mapa</strong> da linguagem. Não é para ler do começo ao fim como livro — é para abrir quando você esqueceu &quot;como era a sintaxe de records?&quot; ou &quot;qual era o operador de spread?&quot;. Marque essa página e volte sempre. Cada bloco mostra a feature em sua forma mínima, com comentário curto explicando.
      </p>

      <h2>Tipos primitivos e variáveis</h2>
      <pre><code>{`int idade = 30;                    // inteiro 64 bits
double pi = 3.14;                  // ponto flutuante 64 bits
num qualquerNumero = 42;           // pai de int e double
String nome = 'Ana';               // texto (UTF-16)
bool ativo = true;                 // true ou false
List<int> nums = [1, 2, 3];        // lista tipada
Set<String> tags = {'a', 'b'};     // sem duplicatas
Map<String, int> idades = {'Ana': 30};

var inferida = 'String';           // tipo deduzido
final naoMuda = 'imutável';        // só atribui uma vez
const compileTime = 3.14;          // constante de compilação
late String tarde;                 // inicializa depois`}</code></pre>

      <h2>Strings: literais e interpolação</h2>
      <pre><code>{`final nome = 'Ana';
final s1 = 'Olá, \$nome!';                   // interpolação simples
final s2 = 'Em 2 anos: \${30 + 2}';          // expressão entre chaves
final s3 = '''Múltiplas
linhas
sem barras''';
final s4 = r'\\n não vira quebra';           // raw string
final concat = 'Olá ' 'mundo';               // adjacentes coladas
final bytes = nome.codeUnits;                // List<int>`}</code></pre>

      <h2>Null safety</h2>
      <pre><code>{`String? talvez = obter();
final tam = talvez?.length ?? 0;        // ?. e ??
final certo = talvez!.toUpperCase();    // ! força não-nulo
talvez ??= 'padrão';                    // só atribui se for null

if (talvez != null) {
  print(talvez.length);                 // promovido para String
}`}</code></pre>

      <h2>Fluxo de controle</h2>
      <pre><code>{`if (idade >= 18) print('adulto');
else if (idade > 12) print('adolescente');
else print('criança');

for (var i = 0; i < 10; i++) print(i);
for (final n in [1, 2, 3]) print(n);
[1, 2, 3].forEach(print);

while (cond) {}
do {} while (cond);

switch (status) {
  case 'ok': print('bem'); break;
  case 'erro': print('mal'); break;
  default: print('?');
}

try {
  arriscar();
} on FormatException catch (e) {
  print(e);
} catch (e, s) {
  print('\$e em \$s');
} finally {
  print('sempre');
}`}</code></pre>

      <h2>Coleções: spread, if, for em literais</h2>
      <pre><code>{`final extras = [4, 5];
final lista = [1, 2, 3, ...extras, if (incluir) 99,
               for (var i = 0; i < 3; i++) i * 10];
// → [1, 2, 3, 4, 5, 99, 0, 10, 20]

final mapa = {'a': 1, 'b': 2, ...outroMapa};`}</code></pre>

      <h2>Funções</h2>
      <pre><code>{`int dobrar(int x) => x * 2;            // arrow
int somar(int a, int b) {              // bloco
  return a + b;
}

void cumprimentar(String nome, {int? idade, bool gritar = false}) {}
// chamada: cumprimentar('Ana', idade: 30, gritar: true);

void posicionais(String nome, [String? sobrenome]) {}
// chamada: posicionais('Ana');

// função como valor
final op = (int a, int b) => a + b;

// closure
Function contador() {
  var n = 0;
  return () => ++n;
}`}</code></pre>

      <h2>Classes</h2>
      <pre><code>{`class Pessoa {
  final String nome;
  int idade;

  Pessoa(this.nome, this.idade);
  Pessoa.bebe(this.nome) : idade = 0;     // construtor nomeado
  const Pessoa.const_(this.nome, this.idade); // const ctor

  factory Pessoa.fromMap(Map m) =>
      Pessoa(m['nome'] as String, m['idade'] as int);

  String saudar() => 'Olá, \$nome';

  // getter/setter
  bool get adulto => idade >= 18;
  set anos(int v) => idade = v;

  @override
  String toString() => 'Pessoa(\$nome, \$idade)';
}`}</code></pre>

      <AlertBox type="info" title="Açúcar de construtor">
        <code>Pessoa(this.nome, this.idade)</code> equivale a receber e atribuir. Use sempre essa forma curta.
      </AlertBox>

      <h2>Herança, mixins e abstract</h2>
      <pre><code>{`abstract class Animal {
  String get som;                  // método abstrato
  void apresentar() => print('Sou um \$runtimeType, faço \$som');
}

mixin Voador {
  void voar() => print('voando!');
}

class Pato extends Animal with Voador {
  @override
  String get som => 'quack';
}

interface class API {              // só pode ser implementada
  void chamar() {}
}

class Cliente implements API {
  @override
  void chamar() {}
}`}</code></pre>

      <h2>Sealed classes + pattern matching (Dart 3)</h2>
      <pre><code>{`sealed class Forma {}
class Circulo extends Forma { final double r; Circulo(this.r); }
class Quadrado extends Forma { final double l; Quadrado(this.l); }

double area(Forma f) => switch (f) {
  Circulo(:final r) => 3.14 * r * r,
  Quadrado(:final l) => l * l,
};`}</code></pre>

      <h2>Records (Dart 3)</h2>
      <pre><code>{`(int, String) par = (1, 'um');
print(par.\$1);                     // 1
print(par.\$2);                     // 'um'

({String nome, int idade}) p = (nome: 'Ana', idade: 30);
print(p.nome);

// destructuring
final (a, b) = (10, 20);
final (nome: n, idade: i) = p;`}</code></pre>

      <h2>Patterns</h2>
      <pre><code>{`final lista = [1, 2, 3];
if (lista case [final primeiro, _, final ultimo]) {
  print('\$primeiro e \$ultimo');
}

final mapa = {'tipo': 'admin', 'idade': 35};
switch (mapa) {
  case {'tipo': 'admin', 'idade': final i} when i > 18:
    print('admin maior');
  case {'tipo': final t}:
    print('tipo: \$t');
}`}</code></pre>

      <h2>Generics</h2>
      <pre><code>{`class Caixa<T> {
  T conteudo;
  Caixa(this.conteudo);
}

T primeiro<T>(List<T> lista) => lista.first;

// limitando
T maior<T extends num>(T a, T b) => a > b ? a : b;`}</code></pre>

      <h2>Async / await</h2>
      <pre><code>{`Future<String> buscar() async {
  await Future<void>.delayed(const Duration(seconds: 1));
  return 'pronto';
}

void main() async {
  final r = await buscar();
  print(r);

  // paralelo
  final lista = await Future.wait([buscar(), buscar()]);
}`}</code></pre>

      <h2>Streams</h2>
      <pre><code>{`Stream<int> contar() async* {
  for (var i = 1; i <= 3; i++) {
    await Future<void>.delayed(const Duration(seconds: 1));
    yield i;
  }
}

void main() async {
  await for (final n in contar()) print(n);

  // ou via listen
  contar().listen(print, onDone: () => print('fim'));
}`}</code></pre>

      <AlertBox type="success" title="Dica de bolso">
        <code>Future</code> = uma única promessa futura. <code>Stream</code> = uma sequência de valores no tempo. Use <code>async*</code> com <code>yield</code> para criar streams.
      </AlertBox>

      <h2>Operadores úteis</h2>
      <pre><code>{`a ?? b           // se a for null, b
a ??= b          // atribui b a a se a for null
a?.b             // chama b só se a não for null
a..b()..c()      // cascade: chama vários em a, retorna a
'\$a + \$b'        // interpolação
a is int         // verifica tipo
a as int         // cast (lança se falhar)
a is! String     // negação de tipo
~/ % * / + -     // aritméticos (~ / divisão inteira)`}</code></pre>

      <h2>Erros comuns no dia a dia</h2>
      <ul>
        <li><strong>Esquecer <code>await</code></strong>: você guarda um <code>Future</code>, não o valor.</li>
        <li><strong>Modificar lista durante <code>for-in</code></strong>: dispara <code>ConcurrentModificationError</code>.</li>
        <li><strong>Usar <code>==</code> com objetos sem override</strong>: compara identidade, não conteúdo.</li>
        <li><strong>Tipar como <code>dynamic</code></strong>: você perde toda checagem do compilador.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Dart é fortemente tipado, com inferência (<code>var</code>/<code>final</code>).</li>
        <li>Null safety com <code>?</code>, <code>!</code>, <code>late</code>, <code>??</code>, <code>?.</code>.</li>
        <li>Records, patterns e sealed classes (Dart 3) trazem expressividade nova.</li>
        <li><code>async/await</code> para Future; <code>async*/yield</code> para Stream.</li>
        <li>Mixins, abstract, interface — várias formas de reuso.</li>
      </ul>
    </PageContainer>
  );
}
