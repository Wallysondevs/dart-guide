import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IsolatePool() {
  return (
    <PageContainer
      title="Pool de isolates: reutilizando workers"
      subtitle="Quando criar isolate por tarefa cobra caro, monte uma equipe fixa que aceita pedidos."
      difficulty="avancado"
      timeToRead="11 min"
    >
      <p>
        Criar um <code>Isolate</code> custa memória e tempo (alocação de heap, inicialização da VM). Para uma única tarefa pesada, esse custo se dilui. Mas se você precisa processar <strong>centenas de tarefas curtas</strong> (parse de mensagens, redimensionar miniaturas em lote), criar e destruir isolate em cada uma vira um gargalo. A solução clássica é o <strong>pool de workers</strong>: um conjunto fixo de isolates já vivos, esperando jobs. Pense em uma <em>cozinha de restaurante</em>: você não contrata um chef novo a cada pedido — tem 4 chefs, cada um pega o próximo pedido da fila.
      </p>

      <h2>compute() do Flutter — o caso simples</h2>
      <p>
        Para tarefa <em>one-shot</em>, o Flutter já oferece <code>compute(fn, arg)</code>. Ele cria um isolate, roda <code>fn(arg)</code>, devolve o Future e mata o isolate.
      </p>
      <pre><code>{`import 'package:flutter/foundation.dart';

List<int> ordenarPesado(List<int> entrada) {
  final copia = List.of(entrada)..sort();
  return copia;
}

Future<void> main() async {
  final result = await compute(ordenarPesado, List.generate(1000000, (i) => i));
  print('primeiro: \${result.first}');
}`}</code></pre>
      <p>
        Mesma coisa que <code>Isolate.run</code>, com integração ao framework. Excelente para <em>uma</em> tarefa, ruim para <em>mil</em>.
      </p>

      <h2>Quando vale ter um pool</h2>
      <ul>
        <li>Você processa <strong>fluxo contínuo</strong> de pequenos jobs (mensagens chegando, eventos do servidor).</li>
        <li>Cada job é <strong>CPU-bound</strong> e dura entre 5ms e alguns segundos.</li>
        <li>O número de jobs simultâneos pode passar de 4–8.</li>
      </ul>
      <p>
        Para jobs &lt; 1 ms, mantenha no isolate principal. Para jobs únicos, use <code>Isolate.run</code>.
      </p>

      <h2>Esqueleto de um pool simples</h2>
      <p>
        Você pode escrever um pool básico em poucas dezenas de linhas. A ideia: N isolates vivos, uma fila de jobs, cada worker pega o próximo da fila.
      </p>
      <pre><code>{`import 'dart:async';
import 'dart:isolate';

typedef Job<I, O> = ({int id, I entrada, SendPort resposta});

void worker<I, O>(O Function(I) fn) {
  final port = ReceivePort();
  port.listen((msg) {
    final job = msg as Job<I, O>;
    try {
      final r = fn(job.entrada);
      job.resposta.send((id: job.id, ok: r, erro: null));
    } catch (e) {
      job.resposta.send((id: job.id, ok: null, erro: '\$e'));
    }
  });
}`}</code></pre>

      <h2>Usando o package isolate_pool</h2>
      <p>
        Para produção, prefira pacotes maduros como <code>worker_manager</code>, <code>isolate_pool_2</code> ou <code>squadron</code>. Eles cuidam de balanceamento, cancelamento, timeouts e backpressure.
      </p>
      <pre><code>{`// pubspec.yaml -> dependencies: worker_manager: ^7.0.1
import 'package:worker_manager/worker_manager.dart';

Future<void> main() async {
  await workerManager.init();

  final futures = List.generate(100, (i) {
    return workerManager.execute<int>(() {
      // CPU-bound qualquer
      var s = 0;
      for (var k = 0; k < 1 << 20; k++) s += k;
      return s + i;
    });
  });

  final results = await Future.wait(futures);
  print('total: \${results.length}');
}`}</code></pre>

      <AlertBox type="info" title="Quantos workers?">
        Um bom chute é <code>Platform.numberOfProcessors - 1</code> (deixe um núcleo para a UI). Mais workers que núcleos reais raramente ajuda em CPU-bound — só aumenta troca de contexto.
      </AlertBox>

      <h2>Caso real: parsing de JSON em lote</h2>
      <pre><code>{`import 'dart:convert';
import 'package:worker_manager/worker_manager.dart';

Future<List<Map<String, dynamic>>> processarLote(List<String> jsons) async {
  final tasks = jsons.map((s) {
    return workerManager.execute<Map<String, dynamic>>(
      () => jsonDecode(s) as Map<String, dynamic>,
    );
  });
  return Future.wait(tasks);
}`}</code></pre>

      <h2>Cuidados de overhead</h2>
      <ul>
        <li><strong>Cópia de mensagens</strong>: cada job copia a entrada para o isolate (e a saída de volta). Se forem MBs, considere <code>TransferableTypedData</code>.</li>
        <li><strong>Spawn do pool é caro</strong>: inicialize uma vez no startup, não em cada tela.</li>
        <li><strong>Falhas em workers</strong>: trate <code>onError</code> — um worker que crasha precisa ser substituído.</li>
        <li><strong>Cancelamento</strong>: muitos pacotes oferecem <code>cancel</code>. Use para evitar processar trabalho descartado.</li>
      </ul>

      <h2>Quando NÃO usar pool</h2>
      <ul>
        <li>Tarefa única ou rara → <code>Isolate.run</code>/<code>compute</code> bastam.</li>
        <li>Trabalho I/O (rede, disco) → <code>async/await</code> sozinho já é suficiente.</li>
        <li>Apps pequenos sem gargalo medido → não otimize antes da hora; meça com DevTools.</li>
      </ul>

      <AlertBox type="warning" title="Sempre meça antes">
        &quot;Mais isolates&quot; nem sempre é &quot;mais rápido&quot;. Use o <strong>Performance overlay</strong> e o <strong>CPU profiler</strong> do Flutter DevTools para confirmar que existe gargalo de CPU antes de complicar.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Pool eternamente vivo:</strong> esqueceu de chamar <code>dispose</code>/<code>destroy</code> no shutdown — vaza memória.</li>
        <li><strong>Mandar objetos não-sendíveis:</strong> closures que capturam <code>BuildContext</code>, Streams, etc.</li>
        <li><strong>Tarefa muito curta:</strong> custo de mensagem &gt; trabalho. Mantenha no main.</li>
        <li><strong>Não controlar concorrência:</strong> 1000 jobs simultâneos sufocam tudo. Use <em>limit</em>/<em>queue</em>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Pool de isolates = vários workers reutilizáveis para fluxos contínuos de CPU.</li>
        <li>Para tarefa única: <code>Isolate.run</code> (ou <code>compute</code> no Flutter).</li>
        <li>Pacotes prontos (<code>worker_manager</code>, <code>squadron</code>) cobrem produção.</li>
        <li>Bom número inicial: <em>num. de cores − 1</em>.</li>
        <li>Meça com DevTools antes de criar pool — pode não ser necessário.</li>
      </ul>
    </PageContainer>
  );
}
