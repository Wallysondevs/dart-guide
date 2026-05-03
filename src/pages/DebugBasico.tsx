import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DebugBasico() {
  return (
    <PageContainer
      title="Depurando seu primeiro programa"
      subtitle="Aprenda a pausar o programa no meio da execução, espiar variáveis e entender bugs sem ficar enchendo o código de print."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Cedo ou tarde, todo programa quebra. Quando isso acontece, há dois caminhos: encher o código de <code>print</code> e ir adivinhando, ou usar um <strong>debugger</strong> — uma ferramenta que pausa o programa em um ponto exato, mostra o valor de cada variável e te deixa avançar passo a passo. Pense no debugger como uma <em>câmera lenta</em> com legendas: você vê o filme rodando devagar e entende cada cena. Vamos aprender a usar.
      </p>

      <h2>O que é um breakpoint</h2>
      <p>
        Um <strong>breakpoint</strong> (ponto de parada) é uma marca que você coloca em uma linha do código. Quando a execução chega lá, o programa <em>pausa</em> em vez de seguir adiante. Você pode então olhar variáveis, mudar valores ou simplesmente continuar.
      </p>
      <p>
        No VS Code, basta clicar à esquerda do número da linha — aparece uma bolinha vermelha. Em qualquer IDE oficial, F9 alterna o breakpoint na linha atual.
      </p>
      <pre><code>{`void main() {
  final lista = [10, 20, 30];
  var soma = 0;

  for (final n in lista) {
    soma = soma + n;  // <- coloque um breakpoint aqui
  }

  print('Soma: \$soma');
}`}</code></pre>

      <h2>Iniciando o debug</h2>
      <p>
        Em qualquer editor oficial:
      </p>
      <ul>
        <li><strong>F5</strong>: roda em modo debug (com breakpoints ativos).</li>
        <li><strong>Ctrl+F5</strong>: roda sem debug (mais rápido, ignora breakpoints).</li>
        <li><strong>Shift+F5</strong>: para a sessão de debug.</li>
      </ul>
      <p>
        Quando o programa chegar no breakpoint, a linha ficará destacada e o painel de Debug mostrará todas as variáveis do escopo atual.
      </p>

      <h2>Step over, step into, step out</h2>
      <p>
        Com o programa pausado, você decide como avançar. Há três comandos clássicos:
      </p>
      <table>
        <thead><tr><th>Tecla</th><th>Comando</th><th>Quando usar</th></tr></thead>
        <tbody>
          <tr><td>F10</td><td>Step Over</td><td>Executa a linha atual <em>sem entrar</em> em funções chamadas.</td></tr>
          <tr><td>F11</td><td>Step Into</td><td>Entra na função chamada na linha atual.</td></tr>
          <tr><td>Shift+F11</td><td>Step Out</td><td>Sai da função atual e volta para quem chamou.</td></tr>
          <tr><td>F5</td><td>Continue</td><td>Roda até o próximo breakpoint (ou fim).</td></tr>
        </tbody>
      </table>
      <pre><code>{`int dobrar(int x) {
  return x * 2;  // step into traz você até aqui
}

void main() {
  final a = 10;
  final b = dobrar(a);  // F11 entra; F10 pula
  print(b);
}`}</code></pre>

      <AlertBox type="info" title="Regra prática">
        Use <strong>Step Over</strong> quando confia na função chamada (ex.: <code>print</code>). Use <strong>Step Into</strong> quando suspeita que o bug está dentro dela.
      </AlertBox>

      <h2>Watch, locals e call stack</h2>
      <p>
        O painel de debug tem três quadros importantes:
      </p>
      <ul>
        <li><strong>Variables (Locals)</strong>: lista todas as variáveis visíveis no momento (escopo atual + objetos). Expanda objetos para ver seus campos.</li>
        <li><strong>Watch</strong>: você adiciona <em>expressões</em> para monitorar (ex.: <code>lista.length</code>, <code>soma * 2</code>). Cada vez que pausa, o valor é recalculado.</li>
        <li><strong>Call Stack</strong>: a pilha de chamadas — quem chamou quem até chegar aqui. Útil para entender o caminho até o bug.</li>
      </ul>
      <pre><code>{`void terceira() {
  print('aqui!');  // Call stack: terceira <- segunda <- primeira <- main
}
void segunda() => terceira();
void primeira() => segunda();
void main() => primeira();`}</code></pre>

      <h2>Conditional breakpoints</h2>
      <p>
        Em loops grandes, parar a cada iteração é insuportável. Os <strong>breakpoints condicionais</strong> só pausam quando uma expressão é verdadeira. Clique com o botão direito no breakpoint → &quot;Edit Breakpoint&quot; → digite a condição:
      </p>
      <pre><code>{`for (var i = 0; i < 10000; i++) {
  processar(i);  // breakpoint condicional: i == 7532
}`}</code></pre>
      <p>
        Outra variante é o <strong>logpoint</strong> — em vez de pausar, ele apenas imprime uma mensagem. Substitui dezenas de <code>print</code> temporários sem alterar o código.
      </p>

      <h2>dart --observe e o DevTools</h2>
      <p>
        Para debugar fora de uma IDE, o Dart oferece o <strong>Observatory</strong> via flag <code>--observe</code>:
      </p>
      <pre><code>{`dart run --observe bin/app.dart

# Output:
# The Dart VM service is listening on http://127.0.0.1:8181/...
# Connecting to VM Service at ws://127.0.0.1:8181/`}</code></pre>
      <p>
        Abra a URL no navegador para acessar o <strong>Dart DevTools</strong>: uma suite com inspetor de objetos, profiler de CPU, análise de memória, timeline e (em Flutter) inspetor de widgets. É a mesma ferramenta usada profissionalmente em produção.
      </p>

      <AlertBox type="success" title="DevTools no Flutter">
        Em apps Flutter, o DevTools mostra a árvore de widgets com inspetor visual: clique em um botão na tela e o widget é destacado no código. Indispensável para debug de UI.
      </AlertBox>

      <h2>Debug mode vs Release mode</h2>
      <p>
        Apps Flutter rodam em três modos diferentes, cada um com suas garantias:
      </p>
      <table>
        <thead><tr><th>Modo</th><th>Compilação</th><th>Hot reload</th><th>Performance</th><th>Quando usar</th></tr></thead>
        <tbody>
          <tr><td>Debug</td><td>JIT</td><td>Sim</td><td>Mais lenta</td><td>Desenvolvimento</td></tr>
          <tr><td>Profile</td><td>AOT</td><td>Não</td><td>Próxima da release</td><td>Medir performance real</td></tr>
          <tr><td>Release</td><td>AOT otimizada</td><td>Não</td><td>Máxima</td><td>Produção (App Store/Play)</td></tr>
        </tbody>
      </table>
      <pre><code>{`flutter run                    # debug (padrão)
flutter run --profile          # profile
flutter run --release          # release
flutter build apk --release    # gera APK final`}</code></pre>

      <h2>assert: o &quot;contrato&quot; do código</h2>
      <p>
        O Dart tem uma instrução <code>assert(condicao)</code> que <em>só roda em debug</em>. Em release, é totalmente ignorada. Use para validar invariantes durante desenvolvimento sem custo em produção:
      </p>
      <pre><code>{`int dividir(int a, int b) {
  assert(b != 0, 'Divisor não pode ser zero');
  return a ~/ b;
}

void main() {
  print(dividir(10, 2));   // 5
  print(dividir(10, 0));   // dispara o assert em debug
}`}</code></pre>

      <h2>Erros comuns ao debugar</h2>
      <ul>
        <li><strong>Esquecer breakpoints ativos</strong>: o programa fica &quot;estranhamente lento&quot; em produção (não, em produção não roda — mas você pode esquecer um <code>print</code>).</li>
        <li><strong>Misturar Step Into com bibliotecas</strong>: às vezes você cai em código de framework e se perde. Use Step Out para voltar.</li>
        <li><strong>Confiar em <code>print</code> em vez do debugger</strong>: para bugs simples vai; para complexos, demora muito mais.</li>
        <li><strong>Debugar em release</strong>: breakpoints não funcionam em modo AOT.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Breakpoint pausa o programa numa linha; F5 inicia o debug.</li>
        <li>F10 step over, F11 step into, Shift+F11 step out.</li>
        <li>Watch monitora expressões; Call Stack mostra o caminho.</li>
        <li>Conditional breakpoints e logpoints economizam tempo em loops.</li>
        <li><code>dart --observe</code> abre o DevTools no navegador.</li>
        <li>Debug vs Profile vs Release: cada modo serve a um propósito.</li>
      </ul>
    </PageContainer>
  );
}
