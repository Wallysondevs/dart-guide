import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Mixins() {
  return (
    <PageContainer
      title="Mixins: with para compor comportamentos"
      subtitle="Como reaproveitar pedaços de código entre classes que não estão na mesma hierarquia."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine uma <strong>receita de bolo</strong>: o &quot;modo de bater claras em neve&quot; pode ser usado em receitas de mousse, suspiro, bolo. Não faz sentido criar uma classe-mãe &quot;Comida&quot; só para compartilhar essa técnica. Em programação, queremos um jeito de pegar um <em>pedaço de comportamento</em> e enxertar em várias classes. Em Dart, isso se chama <strong>mixin</strong>, usado com a palavra <code>with</code>.
      </p>

      <h2>Por que mixins?</h2>
      <p>
        Em Dart, herança é <strong>única</strong> — você só pode <code>extends</code> uma classe. Se uma <code>Capivara</code> precisa &quot;andar&quot; e &quot;nadar&quot;, e essas habilidades vêm de classes diferentes, você está preso. Mixins resolvem isso permitindo &quot;misturar&quot; várias fontes de comportamento sem criar o famoso <strong>problema do diamante</strong> (ambiguidade de qual mãe chamar).
      </p>

      <h2>Sintaxe básica</h2>
      <p>
        Declare com <code>mixin Nome</code> e use com <code>with Nome</code>. Mixins não podem ser instanciados sozinhos — só são úteis quando aplicados a uma classe.
      </p>
      <pre><code>{`mixin Andador {
  void andar() => print('passos: 1, 2, 1, 2');
}

mixin Nadador {
  void nadar() => print('mergulha e impulsiona');
}

class Capivara with Andador, Nadador {}

void main() {
  final c = Capivara();
  c.andar();
  c.nadar();
}`}</code></pre>

      <h2>Combinando com herança</h2>
      <p>
        Você pode usar <code>extends</code> e <code>with</code> juntos. Um mixin é aplicado <em>sobre</em> a classe-mãe, formando uma cadeia.
      </p>
      <pre><code>{`class Animal {
  void respirar() => print('respira');
}

mixin Carnivoro {
  void caçar() => print('caçando presa');
}

class Onca extends Animal with Carnivoro {}

void main() {
  Onca()..respirar()..caçar();
}`}</code></pre>

      <AlertBox type="info" title="Cascade ..">
        O <code>..</code> chama vários métodos no mesmo objeto. <code>obj..a()..b()</code> equivale a <code>obj.a(); obj.b();</code>. Útil quando o método não devolve <code>this</code>.
      </AlertBox>

      <h2>Restrição com <code>on</code></h2>
      <p>
        Às vezes o mixin só faz sentido quando aplicado a um tipo específico — porque chama métodos desse tipo. Use <code>on</code> para impor essa restrição.
      </p>
      <pre><code>{`class Veiculo {
  int velocidade = 0;
}

// Esse mixin só pode ser usado em Veiculo (ou subclasses).
mixin TurboBoost on Veiculo {
  void ativarTurbo() {
    velocidade += 50; // só posso porque garanto que sou um Veiculo
    print('turbo! velocidade: \$velocidade');
  }
}

class Carro extends Veiculo with TurboBoost {}

// class Pessoa with TurboBoost {} // ERRO: 'on Veiculo' não satisfeito.`}</code></pre>

      <h2>Ordem importa</h2>
      <p>
        Quando vários mixins definem o mesmo método, o último listado <strong>vence</strong>. Pense em camadas de tinta: a última passada cobre as anteriores.
      </p>
      <pre><code>{`mixin A {
  void saudar() => print('A');
}

mixin B {
  void saudar() => print('B');
}

class XAB with A, B {} // último: B
class XBA with B, A {} // último: A

void main() {
  XAB().saudar(); // B
  XBA().saudar(); // A
}`}</code></pre>

      <h2>Chamadas <code>super</code></h2>
      <p>
        Mixins podem chamar <code>super.metodo()</code> para encadear. Cada camada faz sua parte e delega ao próximo na cadeia. Isso permite construir <em>pipelines</em> elegantes.
      </p>
      <pre><code>{`class Logger {
  void log(String msg) => print('[base] \$msg');
}

mixin TimestampLog on Logger {
  @override
  void log(String msg) {
    super.log('\${DateTime.now()} \$msg');
  }
}

mixin UpperCaseLog on Logger {
  @override
  void log(String msg) {
    super.log(msg.toUpperCase());
  }
}

class MeuLog extends Logger with TimestampLog, UpperCaseLog {}

void main() {
  MeuLog().log('oi');
  // [base] 2024-... OI
}`}</code></pre>

      <AlertBox type="warning" title="Mixin ≠ Herança múltipla">
        Apesar de parecer, mixins não são herança múltipla. Eles são <em>linearizados</em> em uma sequência única, eliminando ambiguidade. É essencialmente herança em fila, não em árvore.
      </AlertBox>

      <h2>Quando usar mixin vs. interface vs. herança?</h2>
      <ul>
        <li><strong>Herança (<code>extends</code>)</strong>: relação IS-A clara, uma única &quot;mãe natural&quot;.</li>
        <li><strong>Interface (<code>implements</code>)</strong>: contratos puros, sem reuso de código.</li>
        <li><strong>Mixin (<code>with</code>)</strong>: pedaços de comportamento reutilizáveis em classes não-relacionadas.</li>
      </ul>

      <h2>Exemplo prático: capacidades de personagem</h2>
      <pre><code>{`mixin Voa { void voar() => print('voando'); }
mixin Nada { void nadar() => print('nadando'); }
mixin Cava { void cavar() => print('cavando'); }

class Tartaruga with Nada, Cava {}
class Pato with Voa, Nada {}
class Aguia with Voa {}

void main() {
  Pato()..voar()..nadar();
}`}</code></pre>
      <p>
        Veja: nem precisamos definir uma classe-mãe comum. Cada mixin é independente, plugável.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar instanciar mixin</strong>: não dá, mixin é só ingrediente.</li>
        <li><strong>Mixin com construtor</strong>: proibido — mixins não podem ter construtor.</li>
        <li><strong>Esquecer <code>on</code></strong> quando usa membros de outro tipo: o compilador não permite acessar campo que não está garantido.</li>
        <li><strong>Confiar em ordem aleatória</strong>: a ordem em <code>with A, B</code> importa para resolução de conflito.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Mixin é um pedaço de comportamento reutilizável, declarado com <code>mixin Nome</code>.</li>
        <li>Aplicado com <code>with</code>, podendo combinar vários: <code>class X extends Y with A, B</code>.</li>
        <li><code>on Tipo</code> restringe quais classes podem usar o mixin.</li>
        <li>Ordem dos mixins importa — o último na lista &quot;vence&quot; em conflitos.</li>
        <li>Permite reuso sem os perigos da herança múltipla clássica.</li>
      </ul>
    </PageContainer>
  );
}
