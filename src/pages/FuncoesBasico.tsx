import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FuncoesBasico() {
  return (
    <PageContainer
      title="Funções: blocos reutilizáveis de lógica"
      subtitle="Aprenda a empacotar instruções com nome, parâmetros e retorno — o tijolo de qualquer programa Dart."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine que toda manhã você prepara café: pega o pó, ferve a água, coa, serve. Se cada vez você tivesse que reinventar esse processo, perderia horas. Em programação acontece o mesmo: <strong>função</strong> é uma sequência de instruções que recebe um nome para que você possa "fazer café" simplesmente chamando <code>fazerCafe()</code>. Funções são o jeito de dar nome a uma ideia e reaproveitar.
      </p>

      <h2>Anatomia de uma função</h2>
      <p>
        Em Dart, uma função tem quatro partes: o <em>tipo de retorno</em> (o que ela devolve), o <em>nome</em>, a lista de <em>parâmetros</em> entre parênteses e o <em>corpo</em> entre chaves. Quando ela não devolve nada, usamos <code>void</code> — palavra latina para "vazio".
      </p>
      <pre><code>{`// Não recebe nada, não devolve nada.
void cumprimentar() {
  print('Olá!');
}

// Recebe um nome (String) e devolve uma saudação (String).
String saudacao(String nome) {
  return 'Olá, \$nome!';
}

void main() {
  cumprimentar();              // Olá!
  print(saudacao('Ana'));      // Olá, Ana!
}`}</code></pre>
      <p>
        O <code>return</code> encerra a função e entrega o valor para quem a chamou. Se o tipo de retorno é <code>String</code>, você é <strong>obrigado</strong> a devolver uma <code>String</code> — o compilador (programa que verifica seu código antes de rodar) reclama caso contrário.
      </p>

      <h2>Atalho com a seta <code>=&gt;</code></h2>
      <p>
        Quando o corpo é uma <strong>única expressão</strong>, Dart oferece a forma curta com <code>=&gt;</code> (lê-se "seta gorda"). É o mesmo que escrever <code>&#123; return ...; &#125;</code>, só que mais elegante.
      </p>
      <pre><code>{`int dobrar(int x) => x * 2;
int somar(int a, int b) => a + b;

void main() {
  print(dobrar(5));     // 10
  print(somar(3, 4));   // 7
}`}</code></pre>

      <AlertBox type="info" title="Por que &quot;seta gorda&quot;?">
        A seta <code>=&gt;</code> é apelidada de <em>fat arrow</em> porque é mais larga que a seta fina <code>-&gt;</code> usada em algumas linguagens. Em Dart ela só funciona com <strong>uma expressão</strong>; se precisar de mais de uma linha, volte para chaves.
      </AlertBox>

      <h2>Parâmetros: a entrada da função</h2>
      <p>
        Parâmetros são as "ingredientes" que a função pede para trabalhar. Cada parâmetro tem um <em>tipo</em> e um <em>nome</em>. Dentro do corpo, você usa o nome como uma variável local.
      </p>
      <pre><code>{`double calcularImc(double peso, double altura) {
  return peso / (altura * altura);
}

void main() {
  final imc = calcularImc(70, 1.75);
  print('IMC: \${imc.toStringAsFixed(1)}'); // IMC: 22.9
}`}</code></pre>
      <p>
        Os valores que você passa na <em>chamada</em> (<code>70</code> e <code>1.75</code>) são chamados <strong>argumentos</strong>. Parâmetros e argumentos são frequentemente usados como sinônimos, mas tecnicamente: parâmetro é a variável dentro da função; argumento é o valor que entra na chamada.
      </p>

      <h2>Escopo: cada função é uma ilha</h2>
      <p>
        Variáveis declaradas dentro de uma função só existem ali — somem quando a função termina. Isso é o <strong>escopo local</strong>. É como uma sala de reunião: o que se discute lá fica lá.
      </p>
      <pre><code>{`int contador() {
  var x = 10;       // x só existe dentro desta função.
  return x + 1;
}

void main() {
  print(contador());
  // print(x); // ERRO: x não existe aqui fora.
}`}</code></pre>

      <h2>Funções são valores (first-class)</h2>
      <p>
        Em Dart, uma função pode ser <strong>guardada em variável</strong>, <strong>passada como argumento</strong> e <strong>retornada</strong> de outra função. Isso se chama "funções de primeira classe" e abre as portas para callbacks, eventos do Flutter, etc.
      </p>
      <pre><code>{`int triplicar(int x) => x * 3;

void main() {
  // Variável que aponta para a função.
  final operacao = triplicar;
  print(operacao(4)); // 12

  // Lista de funções.
  final operacoes = [triplicar, (int x) => x + 100];
  for (final f in operacoes) {
    print(f(2));
  }
}`}</code></pre>

      <AlertBox type="warning" title="Sem tipo de retorno = dynamic">
        Se você omitir o tipo, Dart assume <code>dynamic</code> (o "vale tudo"). Isso desliga a verificação do compilador e pode esconder bugs. Sempre escreva <code>void</code>, <code>int</code>, <code>String</code>, etc., explicitamente.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>return</code></strong> em função não-void: o compilador acusa "A non-void function must return a value".</li>
        <li><strong>Confundir <code>=&gt;</code> com <code>=</code></strong>: <code>=&gt;</code> é seta de função; <code>=</code> é atribuição.</li>
        <li><strong>Chamar a função sem <code>()</code></strong>: <code>cumprimentar</code> referencia a função; <code>cumprimentar()</code> a executa.</li>
        <li><strong>Passar argumentos do tipo errado</strong>: <code>somar('a', 1)</code> falha em compilação porque <code>a</code> e <code>b</code> esperam <code>int</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Função = nome + parâmetros + corpo + retorno.</li>
        <li><code>void</code> indica que nada é devolvido.</li>
        <li><code>=&gt;</code> é atalho para uma única expressão.</li>
        <li>Variáveis dentro de uma função são locais (escopo).</li>
        <li>Funções são valores: podem ser guardadas, passadas e retornadas.</li>
        <li>Sempre tipar evita o modo permissivo <code>dynamic</code>.</li>
      </ul>
    </PageContainer>
  );
}
