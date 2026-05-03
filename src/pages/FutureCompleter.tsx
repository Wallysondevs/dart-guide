import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FutureCompleter() {
  return (
    <PageContainer
      title="Completer: criando Future manualmente"
      subtitle="Uma ferramenta de baixo nível para construir Futures cuja resolução depende de um evento externo."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <p>
        Imagine que você é o garçom e precisa entregar uma <strong>nota fiscal</strong> ao cliente. Mas a impressora ainda está imprimindo. Você vai até o cliente, dá uma <em>promessa em papel</em> &quot;sua nota chegará em alguns segundos&quot; e, quando a impressora termina, você completa a entrega. O cliente nunca soube quem disparou — apenas recebeu o que esperava. Esse &quot;disparador&quot; é o <code>Completer</code>: <strong>quem cria o Future de um lado e o resolve do outro</strong>.
      </p>

      <h2>Anatomia do Completer</h2>
      <p>
        <code>Completer&lt;T&gt;</code> é uma classe de <code>dart:async</code>. Você cria a instância, pega o <code>future</code> dela (a parte pública que terceiros escutam) e, mais tarde, chama <code>complete(valor)</code> ou <code>completeError(erro)</code> para resolver.
      </p>
      <pre><code>{`import 'dart:async';

void main() {
  final completer = Completer<String>();

  // Quem espera, escuta o future.
  completer.future.then((v) => print('Recebido: \$v'));

  // Quem produz, completa.
  Timer(const Duration(seconds: 1), () {
    completer.complete('valor pronto após 1s');
  });
}`}</code></pre>
      <p>
        Note a separação: o <strong>consumidor</strong> só conhece <code>completer.future</code>; o <strong>produtor</strong> guarda a referência ao <code>completer</code> e dispara quando quiser. Essa divisão é o ponto-chave.
      </p>

      <h2>Quando faz sentido usar (e quando não)</h2>
      <p>
        Em 95% dos casos, prefira <code>async/await</code> ou <code>Future.delayed/value</code>. <code>Completer</code> existe para situações específicas:
      </p>
      <ul>
        <li><strong>Adaptar APIs antigas baseadas em callback</strong> (JS interop, plugins nativos, sockets de baixo nível).</li>
        <li><strong>Sinalizar conclusão entre componentes</strong> (ex.: um widget que completa quando o usuário aperta &quot;OK&quot;).</li>
        <li><strong>Eventos one-shot</strong> que não cabem num Stream.</li>
      </ul>

      <AlertBox type="warning" title="Não use sem motivo">
        Se você só quer um valor após um trabalho, escreva uma função <code>async</code> e use <code>return</code>. <code>Completer</code> em código novo costuma ser <em>code smell</em> — geralmente existe forma mais simples.
      </AlertBox>

      <h2>Adaptando uma API de callback</h2>
      <p>
        Suponha que você tenha uma função antiga que recebe um callback ao terminar. Para integrá-la ao mundo dos Futures:
      </p>
      <pre><code>{`// API antiga: avisa por callback.
void carregarAntigo(String arquivo, void Function(String? erro, String? conteudo) cb) {
  Timer(const Duration(milliseconds: 500), () {
    if (arquivo.isEmpty) {
      cb('arquivo vazio', null);
    } else {
      cb(null, 'conteúdo de \$arquivo');
    }
  });
}

// Wrapper moderno: devolve um Future.
Future<String> carregar(String arquivo) {
  final c = Completer<String>();
  carregarAntigo(arquivo, (erro, conteudo) {
    if (erro != null) {
      c.completeError(Exception(erro));
    } else {
      c.complete(conteudo!);
    }
  });
  return c.future;
}

void main() async {
  try {
    final txt = await carregar('relatorio.txt');
    print(txt);
  } catch (e) {
    print('Falhou: \$e');
  }
}`}</code></pre>

      <h2>completeError: propagando falhas</h2>
      <p>
        Para sinalizar erro, use <code>completeError(erro, [stackTrace])</code>. A excepção surge no <code>then</code>/<code>catchError</code> ou no <code>try/catch</code> do consumidor.
      </p>
      <pre><code>{`final c = Completer<int>();
c.future.catchError((e, st) {
  print('Erro: \$e');
});
c.completeError(StateError('algo deu errado'));`}</code></pre>

      <h2>Estado e regras importantes</h2>
      <ul>
        <li><code>isCompleted</code> indica se já foi resolvido — útil para evitar completar duas vezes.</li>
        <li>Chamar <code>complete</code> ou <code>completeError</code> <strong>duas vezes lança erro</strong>. Sempre proteja com <code>if (!c.isCompleted)</code> em código que pode rodar mais de uma vez.</li>
        <li>O <code>future</code> só pode ser obtido <em>uma vez por completer</em>, mas pode ser escutado por vários listeners via <code>then</code>.</li>
      </ul>
      <pre><code>{`final c = Completer<int>();
if (!c.isCompleted) c.complete(1);
if (!c.isCompleted) c.complete(2); // protegido — não dispara`}</code></pre>

      <AlertBox type="info" title="Completer.sync — cuidado">
        Existe <code>Completer.sync()</code>, que dispara os callbacks <strong>imediatamente</strong> em vez de no event loop. Isso pode causar bugs sutis (reentrada de código). Use só se souber muito bem o que está fazendo.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Completar duas vezes:</strong> exception fatal. Sempre cheque <code>isCompleted</code>.</li>
        <li><strong>Vazar o <code>completer</code> sem nunca completar:</strong> o consumidor fica esperando para sempre.</li>
        <li><strong>Confundir <code>completer.future</code> e <code>complete()</code>:</strong> o <em>future</em> é para quem espera, o <em>complete</em> é para quem produz.</li>
        <li><strong>Usar <code>Completer.sync()</code> sem necessidade:</strong> abre brecha para bugs de reentrada.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Completer&lt;T&gt;</code> separa &quot;quem produz&quot; de &quot;quem consome&quot; um Future.</li>
        <li>Use <code>complete(valor)</code> ou <code>completeError(e)</code> para resolver.</li>
        <li>Caso clássico: encapsular APIs antigas baseadas em callback.</li>
        <li>Em 95% do código moderno, <code>async/await</code> resolve melhor.</li>
        <li>Cuidado com <em>completar duas vezes</em> e <em>nunca completar</em>.</li>
      </ul>
    </PageContainer>
  );
}
