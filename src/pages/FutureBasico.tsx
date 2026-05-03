import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FutureBasico() {
  return (
    <PageContainer
      title="Future: o que é e como funciona"
      subtitle="A promessa de um valor que ainda não existe — base de toda a programação assíncrona em Dart."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine que você pediu uma pizza pelo telefone. Você desligou e <strong>continuou sua vida</strong> — assistindo TV, jogando, lendo. Em algum momento (10, 20, 40 minutos depois), o entregador toca a campainha e a pizza chega. Esse "papel" que você teria escrito antes (&quot;daqui a pouco vou ter uma pizza&quot;) é exatamente um <code>Future</code> em Dart: <strong>uma promessa de que, no futuro, um valor estará disponível</strong>.
      </p>
      <p>
        O termo "assíncrono" assusta, mas significa só isso: <em>algo que não acontece imediatamente, mas sem te bloquear enquanto espera</em>. Sem isso, sua app travaria em cada chamada de rede, em cada leitura de arquivo, em cada query ao banco. Em Dart, todo trabalho que demora — internet, disco, timers, banco de dados — devolve um <code>Future</code>.
      </p>

      <h2>O que é, tecnicamente, um Future</h2>
      <p>
        <code>Future&lt;T&gt;</code> é um objeto da biblioteca <code>dart:async</code> que representa um valor do tipo <code>T</code> que ficará pronto depois. Ele tem três estados possíveis: <strong>pendente</strong> (ainda esperando), <strong>completo com valor</strong> (sucesso) ou <strong>completo com erro</strong> (falha). Pense numa <em>caixinha lacrada</em>: você sabe que vai vir algo dentro, mas só pode abrir quando ela "estourar".
      </p>
      <pre><code>{`import 'dart:async';

void main() {
  // Uma Future que já vem pronta com o valor 42.
  Future<int> jaPronto = Future.value(42);

  // Uma Future que vai resolver depois de 2 segundos.
  Future<String> demorada = Future.delayed(
    const Duration(seconds: 2),
    () => 'cheguei tarde, mas cheguei',
  );

  // Uma Future que falha de propósito.
  Future<int> ruim = Future.error(Exception('deu ruim'));
}`}</code></pre>

      <h2>Lendo o valor com then / catchError / whenComplete</h2>
      <p>
        Como a caixa só abre depois, você <strong>registra um callback</strong> — uma função para ser executada quando o valor chegar. O método <code>then</code> faz isso para o caminho do sucesso; <code>catchError</code> trata erro; e <code>whenComplete</code> roda <em>sempre</em>, dê certo ou errado (como o <code>finally</code> do <code>try/catch</code>).
      </p>
      <pre><code>{`void main() {
  Future.delayed(const Duration(seconds: 1), () => 10)
      .then((valor) => print('Recebi: \$valor'))      // imprime: Recebi: 10
      .catchError((e, st) => print('Erro: \$e'))
      .whenComplete(() => print('Acabou (sucesso ou erro).'));

  print('Essa linha roda ANTES do then.');
}`}</code></pre>
      <p>
        A última linha (&quot;Essa linha roda ANTES do then&quot;) imprime primeiro porque o <code>main</code> não fica parado esperando — ele apenas <em>agenda</em> o callback e segue. Esse é o ponto-chave: <strong>o programa não bloqueia</strong>.
      </p>

      <AlertBox type="info" title="Future ≠ Thread">
        Um <code>Future</code> não cria uma nova thread. Dart roda numa única thread por padrão (chamada de <em>isolate principal</em>). O que muda é só <strong>quando</strong> o código executa: o callback fica numa fila e roda quando a thread está livre.
      </AlertBox>

      <h2>O event loop e a microtask queue</h2>
      <p>
        Por baixo dos panos, o runtime Dart tem um <strong>event loop</strong> — um laço infinito que pega tarefas de duas filas e executa: a <em>fila de microtasks</em> (alta prioridade, criada por <code>scheduleMicrotask</code> e callbacks de <code>Future</code> resolvidos) e a <em>fila de eventos</em> (timers, I/O, mensagens). A regra: <strong>o event loop só processa um evento de cada vez e só pega o próximo quando a microtask queue esvaziar</strong>.
      </p>
      <pre><code>{`import 'dart:async';

void main() {
  print('1');
  scheduleMicrotask(() => print('2 (microtask)'));
  Future(() => print('3 (event)'));
  Future.value('x').then((_) => print('4 (microtask via Future)'));
  print('5');
}
// Saída:
// 1
// 5
// 2 (microtask)
// 4 (microtask via Future)
// 3 (event)`}</code></pre>

      <h2>Encadeando Futures</h2>
      <p>
        O retorno de <code>then</code> é, ele próprio, outro <code>Future</code>. Isso permite encadear: cada etapa só roda quando a anterior termina, formando um pipeline.
      </p>
      <pre><code>{`Future<int> buscarId() async => 7;
Future<String> buscarNomePorId(int id) async => 'Ana #\$id';

void main() {
  buscarId()
      .then((id) => buscarNomePorId(id))   // recebe 7, devolve outro Future<String>
      .then((nome) => print('Olá, \$nome'));
}`}</code></pre>

      <AlertBox type="warning" title="Não bloqueie a thread">
        Nunca tente &quot;esperar&quot; um Future com loop ocupado (<code>while (!pronto) &#123;&#125;</code>) — isso trava o event loop e seu app congela. Use <code>await</code> (próximo capítulo) ou <code>then</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer de tratar erro:</strong> um <code>Future</code> que falha sem <code>catchError</code> vira <em>unhandled exception</em> e aparece no console.</li>
        <li><strong>Achar que <code>then</code> roda na hora:</strong> ele só roda quando o valor chega — qualquer linha logo após executa antes.</li>
        <li><strong>Confundir <code>Future.value(x)</code> com <code>Future(() =&gt; x)</code>:</strong> o primeiro entra na microtask queue (mais rápido); o segundo, na event queue.</li>
        <li><strong>Não retornar o Future em chains:</strong> esquecer o <code>return</code> dentro de <code>then</code> quebra o encadeamento.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Future&lt;T&gt;</code> = promessa de um valor <code>T</code> no futuro.</li>
        <li>Estados: pendente, completo com valor, completo com erro.</li>
        <li>Construtores rápidos: <code>Future.value</code>, <code>Future.delayed</code>, <code>Future.error</code>.</li>
        <li><code>then</code> trata sucesso, <code>catchError</code> trata erro, <code>whenComplete</code> roda sempre.</li>
        <li>Dart usa um event loop com microtask queue + event queue.</li>
        <li>Future <em>não</em> cria thread — só agenda código no event loop.</li>
      </ul>
    </PageContainer>
  );
}
