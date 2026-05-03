import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Recursao() {
  return (
    <PageContainer
      title="Recursão: funções que chamam a si mesmas"
      subtitle="Quebre um problema grande em uma versão menor do mesmo problema — até chegar num caso simples."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine duas pessoas com espelhos um de frente para o outro: você vê uma sequência infinita de imagens, cada uma um reflexo da anterior. <strong>Recursão</strong> é a versão programada disso: uma função que chama a si mesma com um problema um pouquinho menor. Diferente dos espelhos, porém, o programa precisa parar em algum momento — e esse "parar" se chama <strong>caso base</strong>. Sem ele, o programa entra em loop infinito até quebrar.
      </p>

      <h2>A regra de ouro: caso base + chamada recursiva</h2>
      <p>
        Toda função recursiva tem duas partes: o <em>caso base</em> (a condição em que ela devolve direto, sem chamar a si mesma) e o <em>passo recursivo</em> (a chamada para uma versão menor do problema).
      </p>
      <pre><code>{`// Soma de 1 até n: contagem regressiva via recursão.
int soma(int n) {
  if (n <= 0) return 0;       // caso base
  return n + soma(n - 1);     // passo recursivo
}

void main() {
  print(soma(5));   // 15  (5+4+3+2+1)
  print(soma(0));   // 0
}`}</code></pre>
      <p>
        Cada chamada empilha um pouco de memória (chamada de <em>stack frame</em>): <code>soma(5)</code> espera <code>soma(4)</code>, que espera <code>soma(3)</code>, e assim por diante até <code>soma(0)</code> retornar zero. Aí a pilha desempilha somando os resultados.
      </p>

      <h2>Exemplo clássico: fatorial</h2>
      <p>
        O fatorial de <code>n</code> (escrito <code>n!</code>) é o produto de todos os inteiros de 1 até <code>n</code>. A definição já é recursiva: <code>n! = n * (n-1)!</code> e <code>0! = 1</code>.
      </p>
      <pre><code>{`BigInt fatorial(int n) {
  if (n < 0) throw ArgumentError('n deve ser >= 0');
  if (n <= 1) return BigInt.one;          // caso base
  return BigInt.from(n) * fatorial(n - 1);
}

void main() {
  print(fatorial(5));   // 120
  print(fatorial(20));  // 2432902008176640000
}`}</code></pre>

      <AlertBox type="info" title="Por que BigInt?">
        Em Dart, <code>int</code> guarda inteiros de 64 bits. Fatorial cresce <em>muito</em> rápido — <code>21!</code> já estoura. <code>BigInt</code> é um tipo de inteiro de tamanho ilimitado, perfeito quando os números fogem do controle.
      </AlertBox>

      <h2>Fibonacci e o problema das chamadas redundantes</h2>
      <p>
        A sequência de Fibonacci é <code>0, 1, 1, 2, 3, 5, 8, 13...</code> — cada termo é a soma dos dois anteriores. A versão recursiva ingênua é elegante mas terrível em performance: ela recalcula os mesmos valores muitas vezes.
      </p>
      <pre><code>{`// Versão ingênua: O(2^n) — lenta a partir de fib(35).
int fibLento(int n) {
  if (n < 2) return n;
  return fibLento(n - 1) + fibLento(n - 2);
}`}</code></pre>
      <p>
        A solução é <strong>memoização</strong>: guardar resultados já calculados num mapa para não repetir trabalho.
      </p>
      <pre><code>{`final _cache = <int, int>{};

int fib(int n) {
  if (n < 2) return n;
  return _cache.putIfAbsent(n, () => fib(n - 1) + fib(n - 2));
}

void main() {
  print(fib(50));   // 12586269025 — instantâneo com memoização
}`}</code></pre>

      <h2>Stack overflow: o limite da pilha</h2>
      <p>
        Cada chamada recursiva consome um pedaço da <strong>pilha de chamadas</strong> (uma região de memória limitada onde o runtime — programa que executa seu código — guarda informações de funções em andamento). Quando você empilha milhares de chamadas, a pilha enche e o programa explode com <code>Stack Overflow</code>.
      </p>
      <pre><code>{`int infinito(int n) => infinito(n + 1); // Sem caso base!

void main() {
  // infinito(0); // Stack Overflow após milhares de chamadas
}`}</code></pre>

      <AlertBox type="warning" title="Dart NÃO faz tail call optimization">
        Algumas linguagens (Scala, Scheme) reaproveitam o frame da pilha quando a chamada recursiva é a última coisa que a função faz — é a TCO (<em>tail call optimization</em>). Dart <strong>não</strong> implementa essa otimização. Recursão profunda em Dart sempre estoura a pilha em algum ponto.
      </AlertBox>

      <h2>Convertendo recursão em loop</h2>
      <p>
        Para problemas que podem crescer muito (milhares de níveis), reescreva como loop iterativo. O algoritmo é o mesmo; só muda a estrutura. A versão iterativa usa memória constante — não enche a pilha.
      </p>
      <pre><code>{`int somaIterativa(int n) {
  var total = 0;
  for (var i = 1; i <= n; i++) {
    total += i;
  }
  return total;
}

int fibIterativo(int n) {
  if (n < 2) return n;
  var a = 0, b = 1;
  for (var i = 2; i <= n; i++) {
    final t = a + b;
    a = b;
    b = t;
  }
  return b;
}

void main() {
  print(somaIterativa(1000000));  // sem stack overflow
  print(fibIterativo(90));        // 2880067194370816120
}`}</code></pre>

      <h2>Quando recursão brilha</h2>
      <p>
        Existem problemas em que a versão recursiva é tão mais clara que vale o custo. Estruturas em árvore (sistema de arquivos, JSON aninhado, AST, widgets do Flutter) são naturais para recursão.
      </p>
      <pre><code>{`class No {
  No(this.valor, [this.filhos = const []]);
  final String valor;
  final List<No> filhos;
}

void imprimir(No no, [int nivel = 0]) {
  print('  ' * nivel + no.valor);
  for (final f in no.filhos) {
    imprimir(f, nivel + 1);   // recursão sobre filhos
  }
}

void main() {
  final raiz = No('raiz', [
    No('a', [No('a1'), No('a2')]),
    No('b'),
  ]);
  imprimir(raiz);
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o caso base</strong>: stack overflow garantido.</li>
        <li><strong>Caso base inalcançável</strong>: <code>if (n == 0)</code> mas você passa <code>-1</code> e segue decrementando.</li>
        <li><strong>Recursão em problemas de larga escala</strong>: prefira loop ou memoização.</li>
        <li><strong>Não memorizar Fibonacci e similares</strong>: tempo explosivo.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Recursão = caso base + chamada para uma versão menor do problema.</li>
        <li>Sem caso base, há stack overflow.</li>
        <li>Dart não otimiza tail calls; recursão profunda é arriscada.</li>
        <li>Memoização evita recalcular subproblemas.</li>
        <li>Para milhões de iterações, prefira loop iterativo.</li>
        <li>Estruturas em árvore casam naturalmente com recursão.</li>
      </ul>
    </PageContainer>
  );
}
