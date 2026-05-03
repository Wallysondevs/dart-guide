import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Isolates() {
  return (
    <PageContainer
      title="Isolates: paralelismo real (sem threads)"
      subtitle="Como Dart escapa do single-thread sem cair nos pesadelos clássicos de concorrência."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        Em quase toda linguagem moderna, &quot;paralelismo&quot; significa <em>threads</em>: vários fluxos de execução compartilhando memória, com <em>locks</em>, <em>race conditions</em>, <em>deadlocks</em> e dores de cabeça correlatas. Dart escolheu um caminho diferente: cada fluxo paralelo é um <strong>isolate</strong> — uma máquina virtual independente, com <em>heap próprio</em>, que NÃO compartilha memória com nenhum outro. Eles só conversam por <strong>mensagens</strong>, como se fossem &quot;mini-processos&quot; dentro do seu app.
      </p>

      <h2>Por que isolates e não threads?</h2>
      <p>
        Sem memória compartilhada, não existe <em>data race</em>. Você nunca terá dois pedaços de código modificando a mesma variável ao mesmo tempo. O preço: para enviar um dado de um isolate para outro, ele é <em>copiado</em> (ou transferido, em casos especiais).
      </p>
      <ul>
        <li><strong>Isolate principal</strong>: onde seu <code>main()</code> roda. Praticamente todo código de UI Flutter vive aqui.</li>
        <li><strong>Isolates auxiliares</strong>: criados sob demanda para trabalho pesado.</li>
      </ul>

      <h2>Quando usar</h2>
      <ul>
        <li>Tarefas <strong>CPU-bound</strong>: parsing de JSON gigante, processamento de imagem, compressão, criptografia, cálculo de hashes.</li>
        <li><strong>Não use</strong> para I/O comum (rede, arquivo) — para isso já basta <code>async/await</code>, que não bloqueia a UI.</li>
      </ul>

      <h2>Forma moderna: Isolate.run (Dart 2.19+)</h2>
      <p>
        O jeito mais simples e recomendado hoje é <code>Isolate.run(fn)</code>: roda <code>fn</code> num isolate temporário, devolve o resultado como Future, e mata o isolate ao fim.
      </p>
      <pre><code>{`import 'dart:isolate';

int fib(int n) => n < 2 ? n : fib(n - 1) + fib(n - 2);

Future<void> main() async {
  print('antes');
  final r = await Isolate.run(() => fib(40));
  print('fib(40) = \$r');
}`}</code></pre>
      <p>
        Sem ports, sem boilerplate. O isolate herda só o necessário e morre ao terminar. Ideal para 90% dos casos.
      </p>

      <AlertBox type="info" title="No Flutter use compute()">
        O Flutter expõe <code>compute(fn, arg)</code> de <code>package:flutter/foundation.dart</code> — um wrapper em torno de <code>Isolate.run</code> projetado para apps. Mantém UI suave durante trabalho pesado.
      </AlertBox>

      <h2>Forma clássica: Isolate.spawn + ports</h2>
      <p>
        Para isolates de longa duração ou que recebem várias mensagens, use <code>Isolate.spawn(entryPoint, arg)</code>. Comunicação via <code>SendPort</code>/<code>ReceivePort</code> — a primeira mensagem clássica é o &quot;handshake&quot; onde o isolate manda seu próprio SendPort de volta.
      </p>
      <pre><code>{`import 'dart:isolate';

void worker(SendPort principal) {
  final meu = ReceivePort();
  principal.send(meu.sendPort);

  meu.listen((msg) {
    if (msg is int) {
      principal.send('processado: \${msg * 2}');
    } else if (msg == 'stop') {
      meu.close();
    }
  });
}

Future<void> main() async {
  final daUI = ReceivePort();
  await Isolate.spawn(worker, daUI.sendPort);

  late SendPort paraWorker;
  daUI.listen((msg) {
    if (msg is SendPort) {
      paraWorker = msg;
      paraWorker.send(10);
      paraWorker.send(20);
      paraWorker.send('stop');
    } else {
      print('UI recebeu: \$msg');
    }
  });
}`}</code></pre>

      <h2>O que pode trafegar entre isolates?</h2>
      <p>
        Tipos primitivos (números, bool, String), <code>List</code>/<code>Map</code>/<code>Set</code> de tipos suportados, e objetos &quot;sendíveis&quot; em geral. Funções normais, <code>Stream</code>, <code>Future</code> — em geral <strong>não</strong>. Para grandes blobs use <code>TransferableTypedData</code> (transfere sem copiar).
      </p>
      <pre><code>{`final dados = Uint8List(1024 * 1024); // 1 MB
final transferivel = TransferableTypedData.fromList([dados]);
sendPort.send(transferivel);
// Do outro lado:
// final lista = transferivel.materialize().asUint8List();`}</code></pre>

      <AlertBox type="warning" title="Custo de spawn">
        Criar um isolate <strong>não é grátis</strong>: aloca heap próprio (alguns MB), roda inicialização. Para cargas muito curtas (microssegundos), o overhead supera o ganho. Use só quando o trabalho dura ao menos dezenas de ms.
      </AlertBox>

      <h2>Erros e cancelamento</h2>
      <p>
        <code>Isolate.spawn</code> aceita parâmetros para receber notificações: <code>onError</code>, <code>onExit</code>. Para matar um isolate de fora: guarde a referência retornada por <code>spawn</code> e chame <code>kill(priority: Isolate.immediate)</code>.
      </p>
      <pre><code>{`final errors = ReceivePort();
final exits = ReceivePort();
final iso = await Isolate.spawn(
  worker, daUI.sendPort,
  onError: errors.sendPort,
  onExit: exits.sendPort,
);
errors.listen((e) => print('Iso erro: \$e'));
exits.listen((_) => print('Iso saiu'));
// iso.kill(priority: Isolate.immediate);`}</code></pre>

      <h2>Caso real: parsing de JSON gigante</h2>
      <pre><code>{`import 'dart:convert';
import 'dart:isolate';

Future<List<dynamic>> parseGrande(String json) {
  return Isolate.run(() => jsonDecode(json) as List<dynamic>);
}

Future<void> main() async {
  final str = await File('dump.json').readAsString();
  final lista = await parseGrande(str); // UI suave durante o parse
  print('total: \${lista.length}');
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar isolate para I/O:</strong> desperdício — <code>async/await</code> resolve sem custo extra.</li>
        <li><strong>Esperar memória compartilhada:</strong> não existe; tudo é mensagem/cópia.</li>
        <li><strong>Tentar mandar coisa não-sendível</strong> (closure complexa, Stream): exception.</li>
        <li><strong>Esquecer <code>.kill()</code>/<code>.close()</code>:</strong> isolates de longa duração vazam.</li>
        <li><strong>Achar que <code>compute</code> resolve tudo no Flutter:</strong> ele só serve para tarefas one-shot puras.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Dart é single-threaded por isolate. Paralelismo real exige outro isolate.</li>
        <li>Isolates não compartilham memória; comunicam por mensagens.</li>
        <li><code>Isolate.run(fn)</code> é o caminho moderno e simples.</li>
        <li><code>Isolate.spawn</code> + ports cobre cenários longos.</li>
        <li>Use para CPU-bound; para I/O, basta <code>async/await</code>.</li>
        <li>No Flutter, <code>compute()</code> é o atalho prático.</li>
      </ul>
    </PageContainer>
  );
}
