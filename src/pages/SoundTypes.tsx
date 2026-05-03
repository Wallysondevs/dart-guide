import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SoundTypes() {
  return (
    <PageContainer
      title="Sound type system: o que isso significa na prática"
      subtitle="Por que o Dart pode dizer com convicção: &quot;se compilou, o tipo está correto&quot;."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Quando dizemos que o Dart tem um <strong>sistema de tipos sólido</strong> (<em>sound type system</em>), estamos dizendo que ele não mente. Imagine uma balança de joalheiro: se ela diz que o anel pesa 10 gramas, é porque pesa 10 gramas — sem arredondamento, sem &quot;mais ou menos&quot;. Em programação, sound significa que se o compilador (o programa que traduz seu código em algo executável) afirma que uma variável é do tipo <code>List&lt;int&gt;</code>, então em runtime (o ambiente onde o programa de fato roda) <em>jamais</em> você vai encontrar uma <code>String</code> dentro dela.
      </p>
      <p>
        Parece óbvio, mas várias linguagens populares — incluindo TypeScript — não garantem isso. Elas fazem checagens em tempo de compilação, mas no runtime tudo pode acontecer. Em Dart, as duas camadas conversam.
      </p>

      <h2>O que significa &quot;sound&quot; na prática</h2>
      <p>
        Soundness é a combinação de dois pilares:
      </p>
      <ul>
        <li><strong>Static checks</strong> (estáticos): o analisador olha seu código antes de rodar e rejeita atribuições erradas.</li>
        <li><strong>Runtime checks</strong> (em execução): para conversões e generics, o próprio Dart verifica novamente quando os dados chegam, garantindo que ninguém burlou o sistema.</li>
      </ul>
      <pre><code>{`final lista = <int>[1, 2, 3];     // List<int> — só inteiros, prometido.
final dynamicLista = lista as dynamic;
// dynamicLista.add('texto');     // ERRO em runtime: 'String' não é 'int'.`}</code></pre>
      <p>
        Em uma linguagem unsound, esse <code>add(&apos;texto&apos;)</code> passaria batido e só causaria estrago muito depois. Em Dart, o programa quebra na hora — o que é melhor: erro rápido é erro fácil de consertar.
      </p>

      <h2>Generics covariantes e seguros</h2>
      <p>
        Em Dart, <code>List&lt;Cachorro&gt;</code> é considerado um subtipo de <code>List&lt;Animal&gt;</code> (covariância). Isso é conveniente, mas pode quebrar a soundness se não houver checagem extra. O Dart resolve isso com checagens dinâmicas em escritas:
      </p>
      <pre><code>{`class Animal {}
class Cachorro extends Animal {}
class Gato extends Animal {}

final cachorros = <Cachorro>[Cachorro()];
final List<Animal> animais = cachorros; // ok: covariante

// animais.add(Gato()); // ERRO em runtime: lista é, na verdade, List<Cachorro>!`}</code></pre>

      <AlertBox type="info" title="Por que checar de novo em runtime?">
        Sem essa checagem, alguém pegaria sua <code>List&lt;Cachorro&gt;</code> via uma referência <code>List&lt;Animal&gt;</code> e enfiaria um <code>Gato</code> nela. Depois, o restante do código que esperava só cachorros explodiria. O Dart prefere falhar no momento exato do erro.
      </AlertBox>

      <h2>List&lt;int&gt; nunca contém uma String</h2>
      <p>
        Essa é a promessa mais visível. Em runtime, qualquer tentativa de violar o tipo é detectada — mesmo passando por <code>dynamic</code>:
      </p>
      <pre><code>{`void inserir(List<int> alvo, dynamic valor) {
  alvo.add(valor); // só funciona se 'valor' for int de verdade
}

void main() {
  final nums = <int>[1, 2];
  inserir(nums, 3);       // ok
  // inserir(nums, 'a'); // type 'String' is not a subtype of type 'int'
}`}</code></pre>

      <h2>Comparação com TypeScript</h2>
      <p>
        TypeScript adiciona tipos sobre o JavaScript, mas em runtime tudo continua sendo JS puro. Isso significa que checagens só ocorrem em compilação; depois, o programa &quot;esquece&quot; os tipos. É chamado de <strong>type erasure</strong>. O Dart, ao contrário, mantém os tipos vivos: ele tem <strong>reified generics</strong> (tipos preservados em runtime).
      </p>
      <pre><code>{`// Dart: o tipo continua existindo em runtime
final lista = <String>['a', 'b'];
print(lista.runtimeType);          // List<String>
print(lista is List<String>);      // true
print(lista is List<int>);         // false

// TS equivalente perderia o parâmetro genérico no runtime.`}</code></pre>

      <AlertBox type="warning" title="dynamic é a fuga de soundness">
        Se você converter algo para <code>dynamic</code>, o Dart relaxa as checagens estáticas — mas mantém as runtime. Use <code>dynamic</code> só quando estritamente necessário; prefira <code>Object?</code> quando quiser &quot;qualquer coisa, mas com segurança&quot;.
      </AlertBox>

      <h2>Performance: o ganho silencioso</h2>
      <p>
        Soundness não é só segurança — é também velocidade. Como o compilador AOT (Ahead-of-Time, que pré-compila para código de máquina) sabe os tipos com certeza, ele gera código mais enxuto: nada de checagens redundantes nem &quot;adivinhação&quot;. Por isso apps Flutter compilados para iOS e Android atingem performance próxima de nativo.
      </p>
      <pre><code>{`// O compilador sabe que 'a' e 'b' são int e gera soma direta na CPU.
int somar(int a, int b) => a + b;

// Em uma linguagem sem soundness, ele teria que checar tipos antes da operação.`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Assumir que <code>as</code> sempre converte</strong>: se o tipo real não bater, o cast falha em runtime.</li>
        <li><strong>Usar <code>dynamic</code> por preguiça</strong>: você perde o autocompletar e introduz bugs invisíveis.</li>
        <li><strong>Confundir covariância com permissividade</strong>: a lista pode ser usada como mais geral, mas escrever nela ainda exige o tipo real.</li>
        <li><strong>Esperar comportamento de TypeScript</strong>: em Dart, o tipo está vivo em runtime — confie nele.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Sound type system = estático + runtime, sempre coerentes.</li>
        <li>Dart tem <strong>reified generics</strong>: o tipo persiste em execução.</li>
        <li>Covariância é permitida com checagem em escrita.</li>
        <li>Soundness traz segurança e performance — pague o pequeno preço de ser explícito.</li>
      </ul>
    </PageContainer>
  );
}
