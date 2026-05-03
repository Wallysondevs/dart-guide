import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HerancaExtends() {
  return (
    <PageContainer
      title="Herança com extends: reutilizando comportamento"
      subtitle="Como uma classe filha herda campos e métodos da mãe — e o que cuidar para não criar problemas."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Pense em uma <strong>árvore genealógica</strong>: filhos herdam características dos pais — cor dos olhos, sobrenome, talvez o nariz da avó. Em programação orientada a objetos, <strong>herança</strong> é o mesmo: uma classe (<em>filha</em> ou <em>subclasse</em>) recebe automaticamente campos e métodos de outra (<em>mãe</em> ou <em>superclasse</em>). Em Dart, isso é feito com a palavra-chave <code>extends</code>.
      </p>

      <h2>A relação &quot;é-um&quot; (IS-A)</h2>
      <p>
        Use herança quando consegue dizer com naturalidade <em>&quot;X é um Y&quot;</em>. Cão é um Animal. Botão é um Widget. Carro é um Veículo. Se você precisa forçar a frase (<em>&quot;Motor é um Carro&quot;</em>?), provavelmente não é herança — é <strong>composição</strong> (Motor faz <em>parte</em> de Carro).
      </p>

      <h2>Sintaxe básica</h2>
      <pre><code>{`class Animal {
  String nome;
  Animal(this.nome);

  void respirar() {
    print('\$nome está respirando');
  }
}

class Cao extends Animal {
  // Cão herda 'nome' e 'respirar()' automaticamente.
  Cao(super.nome); // repassa para o construtor da mãe

  void latir() {
    print('\$nome: au au!');
  }
}

void main() {
  final rex = Cao('Rex');
  rex.respirar(); // Rex está respirando (herdado)
  rex.latir();    // Rex: au au!
}`}</code></pre>
      <p>
        Note o <code>super.nome</code>: é o atalho do Dart 2.17+ que repassa o parâmetro para o construtor da superclasse, evitando escrever <code>Cao(String nome) : super(nome);</code>.
      </p>

      <h2>Sobrescrever (override)</h2>
      <p>
        A subclasse pode <strong>substituir</strong> um método herdado, fornecendo nova implementação. Marque com <code>@override</code> — não é obrigatório, mas o linter pede e o compilador detecta erros de digitação no nome do método.
      </p>
      <pre><code>{`class Animal {
  void apresentar() => print('Sou um animal');
}

class Cao extends Animal {
  @override
  void apresentar() {
    print('Sou um cão');
  }
}

void main() {
  Cao().apresentar(); // Sou um cão
}`}</code></pre>

      <h2>Chamar a versão da mãe com <code>super</code></h2>
      <p>
        Em vez de jogar fora o comportamento herdado, você pode <em>complementá-lo</em>. <code>super.metodo()</code> chama a implementação original.
      </p>
      <pre><code>{`class Cao extends Animal {
  @override
  void apresentar() {
    super.apresentar();        // Sou um animal
    print('mais especificamente, um cão');
  }
}`}</code></pre>

      <AlertBox type="info" title="@override é seu amigo">
        Se você escrever <code>aprestar</code> (com erro de digitação), sem <code>@override</code> o Dart só cria um método novo. Com a anotação, ele reclama — porque você prometeu sobrescrever algo que não existe.
      </AlertBox>

      <h2>Herança única</h2>
      <p>
        Em Dart, uma classe <strong>só pode estender uma única classe</strong>. Isso evita o famoso <em>problema do diamante</em> (quando duas mães têm o mesmo método e a filha não sabe qual herdar). Para reaproveitar pedaços de várias classes, Dart oferece <strong>mixins</strong> e <strong>interfaces</strong> — veremos depois.
      </p>

      <h2>Polimorfismo</h2>
      <p>
        Uma variável do tipo da mãe pode guardar um objeto da filha. Quando você chama um método nessa variável, Dart escolhe a versão correta em tempo de execução. Isso é <strong>polimorfismo</strong>.
      </p>
      <pre><code>{`class Animal {
  void emitirSom() => print('som genérico');
}

class Cao extends Animal {
  @override
  void emitirSom() => print('au au');
}

class Gato extends Animal {
  @override
  void emitirSom() => print('miau');
}

void main() {
  final List<Animal> bichos = [Cao(), Gato(), Animal()];
  for (final a in bichos) {
    a.emitirSom(); // au au, miau, som genérico
  }
}`}</code></pre>

      <h2>&quot;Protected&quot; via underscore</h2>
      <p>
        Dart não tem <code>protected</code>. Para que subclasses no mesmo arquivo enxerguem um campo &quot;privado&quot;, basta colocá-las no <strong>mesmo arquivo</strong> (mesma biblioteca). Como o <code>_</code> só impede acesso entre arquivos, dentro do arquivo todo mundo enxerga.
      </p>
      <pre><code>{`// arquivo: animais.dart
class Animal {
  int _energia = 100;
  void _gastarEnergia(int n) => _energia -= n;
}

class Cao extends Animal {
  void correr() {
    _gastarEnergia(10); // OK: mesmo arquivo
    print('Energia: \$_energia');
  }
}`}</code></pre>

      <AlertBox type="warning" title="Prefira composição">
        Herança cria acoplamento forte: mudanças na mãe afetam todas as filhas. Sempre que viável, prefira <strong>composição</strong> (um campo do tipo X, em vez de <em>ser</em> um X). É mais flexível e menos frágil.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer de chamar <code>super(...)</code></strong>: se a superclasse exige parâmetros, a filha precisa fornecer.</li>
        <li><strong>Sobrescrever método sem <code>@override</code></strong>: o linter avisa, e você pode estar criando método novo por engano.</li>
        <li><strong>Mudar a assinatura</strong> ao sobrescrever (mudar tipos de parâmetro): Dart valida — tem que ser compatível.</li>
        <li><strong>Herdar &quot;por preguiça&quot;</strong>: quando a relação não é IS-A, vira frankenstein. Use composição.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>class Filha extends Mae</code> faz Filha herdar campos e métodos.</li>
        <li>Herança única em Dart; para múltiplos, use mixins/interfaces.</li>
        <li><code>@override</code> + <code>super.metodo()</code> permitem refinar o comportamento herdado.</li>
        <li>Polimorfismo: mesma chamada, comportamentos diferentes em tempo de execução.</li>
        <li>Prefira composição quando a relação não for claramente IS-A.</li>
      </ul>
    </PageContainer>
  );
}
