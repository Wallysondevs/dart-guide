import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BenchmarkDart() {
  return (
    <PageContainer
      title="Benchmarking de código Dart"
      subtitle="Como medir a performance do seu código com confiabilidade — e não com base em &quot;parece rápido&quot;."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        &quot;Otimização prematura é a raiz de todo mal&quot;, dizia Donald Knuth. Mas otimização <em>baseada em palpite</em> é pior ainda — você gasta tempo melhorando coisa que nem era lenta. <strong>Benchmark</strong> é o ato de medir antes de mexer. Em Dart, há um pacote oficial chamado <code>benchmark_harness</code> que cuida de toda a chatice (warm-up, repetições, cálculo de média) para você só se preocupar em escrever o código que quer medir.
      </p>

      <h2>O pacote benchmark_harness</h2>
      <pre><code>{`# pubspec.yaml
dev_dependencies:
  benchmark_harness: ^2.3.1`}</code></pre>
      <p>
        Você cria uma classe que estende <code>BenchmarkBase</code> e implementa <code>run()</code>. O harness chama <code>run</code> milhares de vezes, descarta as primeiras execuções (warm-up para a VM &quot;esquentar&quot; o JIT) e devolve a média em microssegundos.
      </p>

      <h2>Primeiro benchmark</h2>
      <pre><code>{`import 'package:benchmark_harness/benchmark_harness.dart';

class SomarListaBenchmark extends BenchmarkBase {
  SomarListaBenchmark() : super('SomarLista');

  late List<int> dados;

  @override
  void setup() {
    // Roda uma vez antes de tudo
    dados = List.generate(10000, (i) => i);
  }

  @override
  void run() {
    // Esta é a parte medida; precisa ser pura e determinística
    var soma = 0;
    for (final n in dados) {
      soma += n;
    }
  }

  @override
  void teardown() {
    // Roda uma vez no fim, para liberar recursos
  }
}

void main() {
  SomarListaBenchmark().report();
}`}</code></pre>
      <p>
        Saída típica: <code>SomarLista(RunTime): 23.7 us.</code> &mdash; ou seja, em média 23,7 microssegundos por execução.
      </p>

      <AlertBox type="info" title="Anatomia do harness">
        <strong>setup()</strong>: prepara dados. <strong>run()</strong>: o trecho cronometrado, executado N vezes. <strong>teardown()</strong>: limpeza opcional. O harness <em>warm-up</em> automaticamente, então não precisa rodar manualmente uma vez antes para &quot;esquentar a VM&quot;.
      </AlertBox>

      <h2>Comparando duas implementações</h2>
      <p>
        O caso mais útil de benchmark é decidir entre duas formas. Por exemplo, soma com <code>for</code> versus <code>fold</code>:
      </p>
      <pre><code>{`class SomaForBench extends BenchmarkBase {
  SomaForBench() : super('Soma-for');
  late List<int> dados;
  @override
  void setup() => dados = List.generate(10000, (i) => i);
  @override
  void run() {
    var s = 0;
    for (final n in dados) {
      s += n;
    }
  }
}

class SomaFoldBench extends BenchmarkBase {
  SomaFoldBench() : super('Soma-fold');
  late List<int> dados;
  @override
  void setup() => dados = List.generate(10000, (i) => i);
  @override
  void run() {
    dados.fold<int>(0, (acc, n) => acc + n);
  }
}

void main() {
  SomaForBench().report();
  SomaFoldBench().report();
}`}</code></pre>
      <p>
        Tipicamente <code>for</code> ganha por uma margem pequena, porque <code>fold</code> aloca closure. Mas a diferença só importa se for hot-path — para 99% do código a legibilidade vence.
      </p>

      <h2>JIT vs AOT</h2>
      <p>
        Dart tem dois modos de execução. <strong>JIT</strong> (Just-In-Time) é usado em <code>dart run</code> e em <em>debug</em> do Flutter — a VM compila código quente em tempo de execução. <strong>AOT</strong> (Ahead Of Time) é usado em <code>dart compile exe</code> e em <em>release</em> do Flutter — o código já vem compilado para máquina nativa. Para um benchmark realista de produção, sempre meça AOT:
      </p>
      <pre><code>{`# Modo JIT (desenvolvimento)
dart run benchmark/meu_bench.dart

# Modo AOT (produção)
dart compile exe benchmark/meu_bench.dart -o bench
./bench

# Diferença típica: AOT é 1.5x a 3x mais rápido em CPU pura,
# mas JIT pode ganhar em código com loops mega-quentes (otimiza adaptativo).`}</code></pre>

      <AlertBox type="warning" title="Não compare JIT com AOT diretamente">
        Se você for tirar conclusões sobre &quot;qual algoritmo é mais rápido&quot;, rode os dois sob o <strong>mesmo modo</strong> de execução. Comparar A em JIT com B em AOT é misturar laranja com batata.
      </AlertBox>

      <h2>Micro vs macro benchmark</h2>
      <ul>
        <li><strong>Micro-benchmark</strong>: mede uma operação isolada (parsing de string, soma de lista). Útil para validar microoptimizations.</li>
        <li><strong>Macro-benchmark</strong>: mede um cenário real (request HTTP completo, abertura de tela). Mostra o que o usuário vai sentir.</li>
      </ul>
      <p>
        Cuidado: micro-benchmark é traiçoeiro porque o compilador pode <em>eliminar</em> código que considera inútil (constant folding, dead code elimination). Garanta que o resultado seja usado:
      </p>
      <pre><code>{`int total = 0;
@override
void run() {
  for (final n in dados) {
    total += n;
  }
  // Truque: usa total fora para o compilador não eliminar tudo.
  if (total == 0) print('zero?');
}`}</code></pre>

      <h2>Medindo memória, não só tempo</h2>
      <p>
        O harness mede tempo, não memória. Para alocação, rode com <code>--observe</code> e abra o <em>DevTools</em>:
      </p>
      <pre><code>{`dart run --observe benchmark/meu_bench.dart
# Acesse a URL do Observatory no navegador
# Aba "Memory" mostra alocações por classe.`}</code></pre>

      <h2>Boas práticas</h2>
      <ul>
        <li>Sempre rode em ambiente <strong>silencioso</strong>: feche outros apps, evite plug-and-play de power.</li>
        <li>Rode <strong>3+ vezes</strong> e use a mediana, não a média (uma rodada lenta isolada distorce).</li>
        <li>Compare a <strong>mesma versão de Dart</strong>; resultados mudam entre versões da SDK.</li>
        <li>Em CI, registre números ao longo do tempo para detectar regressões.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer de aquecer (mas o harness já faz)</strong>: medir só o primeiro run dá número falso.</li>
        <li><strong>Comparar debug vs release</strong> em Flutter: debug é 10x+ mais lento.</li>
        <li><strong>Medir <code>print</code></strong>: I/O domina e mascara o que você queria medir.</li>
        <li><strong>Otimizar sem profiling antes</strong>: meça primeiro, ache o gargalo real, só então otimize.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>benchmark_harness</code> cuida de warm-up, repetição e média.</li>
        <li>Estenda <code>BenchmarkBase</code> com <code>setup</code>, <code>run</code>, <code>teardown</code>.</li>
        <li>Para conclusão de produção, meça AOT, não JIT.</li>
        <li>Diferencie micro e macro benchmark.</li>
        <li>Use o resultado para evitar dead-code elimination.</li>
      </ul>
    </PageContainer>
  );
}
