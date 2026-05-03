import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function InterfacesImplements() {
  return (
    <PageContainer
      title="Interfaces: implements em vez de keyword interface"
      subtitle="Como Dart permite que toda classe vire um contrato — sem nenhuma palavra-chave especial."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine um <strong>plug elétrico</strong>: ele define o formato dos pinos. Qualquer aparelho que tiver pinos no formato certo (rádio, abajur, computador) pode ser ligado na tomada — não importa o &quot;parentesco&quot; entre eles, importa apenas que <em>cumpram o contrato</em>. Em Dart, esse contrato é uma <strong>interface</strong>. E o curioso: <em>não existe</em> a palavra <code>interface</code> para criar uma — toda classe já é uma!
      </p>

      <h2>Interface implícita</h2>
      <p>
        Toda classe em Dart, ao ser declarada, ganha automaticamente uma interface com a <strong>mesma assinatura</strong> (campos, getters, setters, métodos). Para usar essa interface, outra classe declara <code>implements NomeDaClasse</code>.
      </p>
      <pre><code>{`class Animal {
  String nome = '';
  void respirar() => print('\$nome respira');
}

// Cão NÃO herda código de Animal — apenas o contrato.
class Cao implements Animal {
  @override
  String nome = '';

  @override
  void respirar() => print('\$nome late e respira');
}`}</code></pre>

      <h2><code>extends</code> vs <code>implements</code></h2>
      <p>
        Diferença crucial:
      </p>
      <ul>
        <li><strong><code>extends</code></strong>: você herda <em>tudo</em> — campos, métodos concretos, construtores. Pode reaproveitar o código.</li>
        <li><strong><code>implements</code></strong>: você herda <em>apenas a forma</em>. Tem que reimplementar <strong>cada</strong> membro do contrato. Não há ganho de código.</li>
      </ul>
      <pre><code>{`class A {
  void cumprimentar() => print('Olá da A');
}

class B extends A {} // herda 'cumprimentar' pronto
class C implements A {
  @override
  void cumprimentar() => print('C reimplementou'); // obrigatório!
}`}</code></pre>

      <AlertBox type="info" title="Por que reimplementar tudo?">
        Porque <code>implements</code> diz: &quot;eu sou compatível com aquela forma, mas a implementação é minha&quot;. É um contrato puro, sem reaproveitamento. Para reaproveitar, use <code>extends</code> ou <code>with</code> (mixin).
      </AlertBox>

      <h2>Múltiplas interfaces</h2>
      <p>
        Diferente do <code>extends</code> (uma única superclasse), você pode <code>implements</code> <strong>várias</strong> interfaces ao mesmo tempo. É assim que Dart oferece &quot;herança múltipla de tipo&quot; sem o problema do diamante.
      </p>
      <pre><code>{`class Voador {
  void voar() => print('voando');
}

class Nadador {
  void nadar() => print('nadando');
}

class Pato implements Voador, Nadador {
  @override
  void voar() => print('o pato voa baixinho');
  @override
  void nadar() => print('o pato nada feliz');
}`}</code></pre>

      <h2>Exemplo clássico: <code>Comparable</code></h2>
      <p>
        A biblioteca padrão de Dart define <code>Comparable&lt;T&gt;</code> com um método <code>compareTo(T outro)</code>. Qualquer classe que implementar essa interface poderá ser ordenada por funções como <code>List.sort</code>.
      </p>
      <pre><code>{`class Idade implements Comparable<Idade> {
  final int anos;
  Idade(this.anos);

  @override
  int compareTo(Idade outra) => anos - outra.anos;

  @override
  String toString() => '\$anos anos';
}

void main() {
  final lista = [Idade(30), Idade(10), Idade(25)];
  lista.sort();
  print(lista); // [10 anos, 25 anos, 30 anos]
}`}</code></pre>

      <h2>Definindo &quot;interfaces puras&quot;</h2>
      <p>
        Embora qualquer classe sirva, é convenção criar <strong>classes abstratas só com assinaturas</strong> quando você quer documentar uma interface clara. Em Dart 3, há ainda o modificador <code>interface</code> — declarar <code>interface class Foo</code> impede que outras classes façam <code>extends Foo</code>; apenas <code>implements Foo</code> é permitido.
      </p>
      <pre><code>{`interface class Repositorio {
  Future<List<String>> listar();
  Future<void> salvar(String item);
}

class RepoMemoria implements Repositorio {
  final List<String> _itens = [];

  @override
  Future<List<String>> listar() async => _itens;

  @override
  Future<void> salvar(String item) async => _itens.add(item);
}`}</code></pre>
      <p>
        <code>Future</code> é o &quot;promessa de valor futuro&quot; — quando uma operação pode demorar (ler arquivo, chamar API), Dart devolve um <code>Future</code> que se resolve depois. Veremos em detalhes em capítulos sobre assincronicidade.
      </p>

      <AlertBox type="warning" title="Cuidado: implements obriga TUDO">
        Se a classe implementada tem 20 métodos, você precisa implementar os 20 — mesmo os triviais. Para reaproveitar, prefira <code>extends</code> ou <code>with</code>. Use <code>implements</code> quando o objetivo for <em>cumprir contrato</em>, não <em>reaproveitar código</em>.
      </AlertBox>

      <h2>Polimorfismo via interface</h2>
      <pre><code>{`void processar(Comparable<dynamic> c) {
  print('vou comparar \$c');
}

void main() {
  processar(Idade(20)); // funciona porque Idade implements Comparable
  processar(42);        // int também implementa Comparable<num>
  processar('texto');   // String também
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer de implementar um método</strong>: erro de compilação <em>&quot;Missing concrete implementation of...&quot;</em>.</li>
        <li><strong>Pensar que <code>implements</code> herda código</strong>: não herda nada — só o formato.</li>
        <li><strong>Misturar campos</strong>: ao implementar uma classe com campo público, você precisa expor um getter (e setter, se mutável) com o mesmo tipo.</li>
        <li><strong>Confundir com <code>extends</code></strong>: lembre — extends pega o código junto; implements só pede a forma.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Toda classe em Dart é também uma interface implícita.</li>
        <li><code>implements</code> obriga reimplementar todos os membros — sem reuso de código.</li>
        <li>Pode implementar várias interfaces; só pode estender uma.</li>
        <li><code>interface class</code> (Dart 3) força que outras classes apenas implementem, nunca herdem.</li>
        <li>Use interfaces para definir contratos polimórficos como <code>Comparable</code>.</li>
      </ul>
    </PageContainer>
  );
}
