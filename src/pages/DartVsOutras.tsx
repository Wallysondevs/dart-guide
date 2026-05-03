import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartVsOutras() {
  return (
    <PageContainer
      title="Dart vs JavaScript, Java, Kotlin, Swift e TypeScript"
      subtitle="Comparações lado a lado para você situar o Dart no mapa das linguagens modernas."
      difficulty="iniciante"
      timeToRead="14 min"
    >
      <p>
        Aprender uma linguagem nova fica mais fácil quando você compara com algo que já conhece — ou pelo menos com linguagens que você já ouviu falar. Pense neste capítulo como um <em>tour turístico</em>: vamos parar em cada linguagem famosa e mostrar onde o Dart se parece e onde ele se diferencia. No fim, você vai saber exatamente em que &quot;bairro&quot; o Dart mora.
      </p>

      <h2>Dart vs JavaScript</h2>
      <p>
        JavaScript é a linguagem do navegador. Dart foi <em>literalmente</em> criado para substituí-lo (e falhou nessa missão original, como vimos no capítulo de história). Hoje os dois convivem: Dart até <strong>compila para JavaScript</strong> via <code>dart compile js</code>. As diferenças importantes:
      </p>
      <ul>
        <li><strong>Tipagem</strong>: JS é dinamicamente tipado (uma variável aceita qualquer coisa). Dart é estaticamente tipado e com null-safety obrigatória.</li>
        <li><strong>Modelo de concorrência</strong>: ambos são single-threaded com loop de eventos. Dart adiciona <em>isolates</em> (veremos abaixo) para paralelismo real.</li>
        <li><strong>Compilação</strong>: JS roda interpretado/JIT no V8. Dart pode rodar em VM (JIT) ou compilar AOT para nativo.</li>
      </ul>
      <pre><code>{`// JavaScript
function soma(a, b) { return a + b; }
console.log(soma(2, 3));

// Dart equivalente
int soma(int a, int b) => a + b;
void main() => print(soma(2, 3));`}</code></pre>

      <AlertBox type="info" title="O que é &quot;single-threaded&quot;?">
        Significa que a linguagem executa <strong>uma instrução por vez</strong> em uma única &quot;fila&quot;. Para fazer várias coisas ao mesmo tempo, usa um <em>loop de eventos</em>, agendando tarefas. Em Dart, quando você precisa de paralelismo real (ex.: processar imagens em segundo plano), usa <em>isolates</em> — pequenos processos isolados, cada um com sua própria memória.
      </AlertBox>

      <h2>Dart vs TypeScript</h2>
      <p>
        TypeScript é &quot;JavaScript com tipos&quot;. Dart também tem tipos, mas é uma linguagem nova de verdade — não um superset de outra. Comparando:
      </p>
      <pre><code>{`// TypeScript
interface Usuario { nome: string; idade: number }
const u: Usuario = { nome: 'Ana', idade: 30 };

// Dart
class Usuario {
  final String nome;
  final int idade;
  Usuario({required this.nome, required this.idade});
}
final u = Usuario(nome: 'Ana', idade: 30);`}</code></pre>
      <p>
        TS apaga os tipos no build (JavaScript final não sabe nada de tipos). Dart usa os tipos em <em>runtime</em> também — eles são <strong>sound</strong>, ou seja, o que o compilador promete, o programa cumpre. Em TypeScript, é fácil &quot;mentir&quot; com <code>as any</code>. Em Dart, isso não existe.
      </p>

      <h2>Dart vs Java</h2>
      <p>
        Java é o avô das linguagens orientadas a objeto modernas. Dart herda muito da estética dele: <code>class</code>, <code>extends</code>, <code>implements</code>, <code>final</code>. Mas Dart é menos cerimonioso:
      </p>
      <pre><code>{`// Java
public class Pessoa {
    private String nome;
    public Pessoa(String nome) { this.nome = nome; }
    public String getNome() { return nome; }
}

// Dart — bem mais enxuto
class Pessoa {
  final String nome;
  Pessoa(this.nome);
}`}</code></pre>
      <p>
        Diferenças-chave: Dart tem <em>top-level functions</em> (você não precisa de classe para tudo), inferência de tipos com <code>var</code>/<code>final</code>, e construtores muito mais curtos. Por baixo dos panos, Java roda em JVM e Dart roda em Dart VM — conceitos similares.
      </p>

      <h2>Dart vs Kotlin</h2>
      <p>
        Se Dart se parece com alguma linguagem moderna, é com Kotlin. Ambas são linguagens de aplicações móveis (Kotlin no Android nativo, Dart no Flutter). Sintaxe muito próxima:
      </p>
      <pre><code>{`// Kotlin
data class User(val name: String, val age: Int)
fun main() {
  val u = User("Ana", 30)
  println("\${u.name}")
}

// Dart 3
class User {
  final String name;
  final int age;
  const User(this.name, this.age);
}
void main() {
  const u = User('Ana', 30);
  print(u.name);
}`}</code></pre>
      <p>
        Kotlin tem <code>data class</code> automática; Dart precisa de pacotes (<code>freezed</code>) ou Records para algo similar. Ambas têm null-safety, ambas compilam AOT.
      </p>

      <h2>Dart vs Swift</h2>
      <p>
        Swift é a linguagem da Apple para iOS. Filosoficamente, Swift e Dart 3 caminham em direções parecidas: imutabilidade, pattern matching, sealed types. Diferença prática: Swift só roda em ecossistema Apple e é AOT puro; Dart é multiplataforma e tem JIT no desenvolvimento (hot reload).
      </p>
      <pre><code>{`// Swift
enum Pagamento { case pix(String); case cartao(Int) }

// Dart 3 — sealed class equivalente
sealed class Pagamento {}
class Pix extends Pagamento { final String chave; Pix(this.chave); }
class Cartao extends Pagamento { final int numero; Cartao(this.numero); }`}</code></pre>

      <h2>Flutter vs React Native</h2>
      <p>
        Aqui mora a maior briga atual em mobile multiplataforma. Resumo honesto:
      </p>
      <ul>
        <li><strong>React Native</strong>: usa JavaScript/TypeScript, renderiza widgets <em>nativos</em> (UIButton no iOS, Button no Android). Ponte JS↔nativo pode ser gargalo.</li>
        <li><strong>Flutter</strong>: usa Dart, desenha cada pixel via Skia/Impeller. UI é idêntica em qualquer dispositivo. Performance previsível, animações suaves.</li>
      </ul>
      <table>
        <thead><tr><th>Aspecto</th><th>Dart/Flutter</th><th>JS/RN</th></tr></thead>
        <tbody>
          <tr><td>Tipagem</td><td>Sound, obrigatória</td><td>Opcional (TS)</td></tr>
          <tr><td>Concorrência</td><td>Isolates + async</td><td>Event loop + workers</td></tr>
          <tr><td>Compilação</td><td>JIT + AOT</td><td>JIT (V8/Hermes)</td></tr>
          <tr><td>UI</td><td>Pintada (Skia)</td><td>Componentes nativos</td></tr>
        </tbody>
      </table>

      <AlertBox type="success" title="Quando escolher Dart?">
        Quando você quer um único codebase que rode em iOS, Android, web e desktop com UI consistente, animações fluidas e tipagem forte. Para sistemas backend pesados, talvez Go/Rust sejam melhores; para scripting rápido, Python.
      </AlertBox>

      <h2>Erros comuns ao comparar</h2>
      <ul>
        <li><strong>Achar que Dart é &quot;Java mais bonito&quot;</strong>: ele incorporou ideias de muitas linguagens modernas.</li>
        <li><strong>Confundir &quot;sound types&quot; com &quot;tipos chatos&quot;</strong>: a inferência ajuda muito; você quase não escreve tipos.</li>
        <li><strong>Comparar Flutter com bibliotecas web</strong>: Flutter é um framework completo de UI, não uma lib.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Dart é estaticamente tipado, com null-safety sound, JIT em dev e AOT em produção.</li>
        <li>Sintaxe próxima de Kotlin/Swift, herança histórica de Java/JS.</li>
        <li>Concorrência: single-threaded + isolates para paralelismo real.</li>
        <li>Flutter pinta a UI; React Native usa componentes nativos.</li>
      </ul>
    </PageContainer>
  );
}
