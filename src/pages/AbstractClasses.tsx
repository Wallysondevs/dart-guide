import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AbstractClasses() {
  return (
    <PageContainer
      title="Classes abstratas: contratos parcialmente implementados"
      subtitle="Como definir um molde que obriga subclasses a fornecer detalhes — sem nunca instanciar a mãe."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine o conceito de <strong>&quot;Forma geométrica&quot;</strong>. Você sabe que toda forma tem uma <em>área</em>, mas não dá para calcular a área de uma &quot;forma genérica&quot; — depende de qual forma é. <em>Forma</em> é uma ideia abstrata; só existe de verdade quando vira <em>círculo</em>, <em>quadrado</em>, <em>triângulo</em>. Em Dart, classes abstratas modelam exatamente isso: elas definem o <strong>contrato</strong> (&quot;tem que ter área&quot;) sem fornecer implementação completa.
      </p>

      <h2>Sintaxe</h2>
      <p>
        Marque a classe com <code>abstract</code>. Métodos sem corpo (terminados em <code>;</code>) são automaticamente <strong>abstratos</strong> — subclasses são obrigadas a implementá-los.
      </p>
      <pre><code>{`abstract class Forma {
  // Método abstrato: sem corpo, só assinatura.
  double calcularArea();

  // Método concreto: tem implementação, é herdado normalmente.
  void descrever() {
    print('Esta forma tem área de \${calcularArea()}');
  }
}`}</code></pre>
      <p>
        Note: <code>calcularArea()</code> não tem <code>&#123; ... &#125;</code>, só ponto-e-vírgula. Isso diz ao Dart: &quot;quem herdar precisa fornecer&quot;.
      </p>

      <h2>Não pode instanciar</h2>
      <pre><code>{`void main() {
  // final f = Forma(); // ERRO: Abstract classes can't be instantiated.
}`}</code></pre>
      <p>
        Faz sentido: como Dart calcularia a área de uma &quot;forma genérica&quot;? Ele se recusa, no compilador, evitando o erro em tempo de execução.
      </p>

      <h2>Subclasses concretas</h2>
      <pre><code>{`class Circulo extends Forma {
  final double raio;
  Circulo(this.raio);

  @override
  double calcularArea() => 3.14159 * raio * raio;
}

class Quadrado extends Forma {
  final double lado;
  Quadrado(this.lado);

  @override
  double calcularArea() => lado * lado;
}

void main() {
  final formas = <Forma>[Circulo(2), Quadrado(3)];
  for (final f in formas) {
    f.descrever(); // método concreto herdado
  }
}`}</code></pre>
      <p>
        Cada filha foi <strong>obrigada</strong> a implementar <code>calcularArea</code>. Se esquecer, o compilador reclama. E todas ganham de graça o método <code>descrever</code> da mãe.
      </p>

      <AlertBox type="info" title="Polimorfismo na prática">
        Note como armazenamos <code>Circulo</code> e <code>Quadrado</code> em uma lista de <code>Forma</code>. Esse é o ganho real: código que opera sobre <code>Forma</code> funciona com qualquer subclasse — atual ou futura.
      </AlertBox>

      <h2>Misturando concreto e abstrato</h2>
      <p>
        Uma classe abstrata pode ter campos, construtores, getters concretos — basicamente tudo de uma classe normal. O que ela <em>não pode</em> é ser instanciada diretamente.
      </p>
      <pre><code>{`abstract class Funcionario {
  final String nome;
  final double salarioBase;

  Funcionario(this.nome, this.salarioBase);

  // Abstrato: cada cargo calcula bônus de jeito diferente.
  double calcularBonus();

  // Concreto: usa o método abstrato.
  double salarioTotal() => salarioBase + calcularBonus();
}

class Vendedor extends Funcionario {
  final double comissao;
  Vendedor(super.nome, super.salarioBase, this.comissao);

  @override
  double calcularBonus() => salarioBase * comissao;
}`}</code></pre>

      <h2>Quando usar abstrata vs. interface</h2>
      <p>
        Use <strong>classe abstrata</strong> quando quer fornecer parte da implementação (template method pattern). Use apenas <strong>interface</strong> (via <code>implements</code>, sem <code>extends</code>) quando o objetivo é <em>somente</em> definir o contrato. Veremos interfaces no próximo capítulo.
      </p>

      <h2>Sealed classes (Dart 3)</h2>
      <p>
        Uma evolução: <code>sealed class</code> é uma classe abstrata cujas subclasses precisam estar todas no <strong>mesmo arquivo</strong>. Isso permite ao Dart verificar com <code>switch</code> se você cobriu todos os casos — exhaustiveness check.
      </p>
      <pre><code>{`sealed class Resultado {}
class Sucesso extends Resultado { final String dado; Sucesso(this.dado); }
class Falha extends Resultado { final String erro; Falha(this.erro); }

String descrever(Resultado r) => switch (r) {
  Sucesso(:final dado) => 'OK: \$dado',
  Falha(:final erro) => 'ERRO: \$erro',
  // Sem 'default'! O compilador valida que cobrimos tudo.
};`}</code></pre>

      <AlertBox type="warning" title="Mudança em Dart 3">
        Antes, <code>abstract class</code> também podia ser usada com <code>implements</code> para virar interface. Em Dart 3, novos modificadores (<code>interface</code>, <code>base</code>, <code>final</code>, <code>sealed</code>) deixam essa intenção explícita. Para começar, basta saber: <code>abstract</code> = não pode instanciar; subclasses preenchem.
      </AlertBox>

      <h2>Exemplo Flutter: Widget</h2>
      <p>
        No Flutter, a classe <code>Widget</code> é abstrata — você nunca cria um <code>Widget</code> direto, e sim subclasses como <code>StatelessWidget</code> e <code>StatefulWidget</code>. Cada uma fornece uma forma específica de descrever a interface.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar instanciar a classe abstrata</strong>: o compilador bloqueia, mas iniciantes esquecem.</li>
        <li><strong>Esquecer de implementar método abstrato</strong>: subclasse vira abstrata implícita e não compila se você tentar instanciá-la.</li>
        <li><strong>Confundir abstract com interface</strong>: abstract permite herdar implementação; interface só obriga reimplementar.</li>
        <li><strong>Construtor inútil</strong>: criar construtor em abstract é OK quando subclasses precisam dele via <code>super</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>abstract class</code> define um molde que não pode ser instanciado.</li>
        <li>Métodos sem corpo são abstratos; subclasses são obrigadas a implementar.</li>
        <li>Pode misturar livremente métodos abstratos e concretos.</li>
        <li>Em Dart 3, considere <code>sealed</code> quando todas as subclasses são conhecidas.</li>
        <li>Permite polimorfismo: tratar muitas subclasses como o tipo abstrato.</li>
      </ul>
    </PageContainer>
  );
}
