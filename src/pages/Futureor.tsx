import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Futureor() {
  return (
    <PageContainer
      title="FutureOr<T>: aceita valor síncrono OU Future"
      subtitle="O tipo curinga que permite APIs aceitarem valores prontos ou ainda em construção, sem alocar Future à toa."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <p>
        Imagine uma cafeteria com balcão expresso e fila de pedidos. Se o café-do-dia já está pronto, o atendente entrega na hora. Se você pediu um cappuccino especial, ele te dá uma <em>senha</em> e avisa depois. Em ambos os casos, você sai do balcão com &quot;algo&quot; — ou o produto pronto, ou a promessa dele. O tipo <code>FutureOr&lt;T&gt;</code> em Dart é exatamente isso: <strong>um valor que pode ser <code>T</code> imediato OU <code>Future&lt;T&gt;</code></strong>.
      </p>

      <h2>Definição e motivação</h2>
      <p>
        <code>FutureOr&lt;T&gt;</code> está em <code>dart:async</code> e é, conceitualmente, a união <code>T | Future&lt;T&gt;</code>. Ele existe para permitir APIs flexíveis que <em>não obrigam</em> alocação de Future quando o valor já está disponível.
      </p>
      <pre><code>{`import 'dart:async';

// Aceita int ou Future<int>.
FutureOr<int> obterIdade() {
  return 30;                     // ok: valor síncrono
  // return Future.value(30);    // também ok
  // return Future.delayed(...); // também ok
}`}</code></pre>

      <h2>Por que isso importa? Performance e simplicidade</h2>
      <p>
        Cada <code>Future</code> aloca um objeto, agenda um microtask, custa tempo. Em código quente (callbacks chamados milhões de vezes), evitar isso quando o valor já é conhecido faz diferença real. <code>FutureOr</code> deixa a função de fora escolher.
      </p>
      <pre><code>{`// Cache rápido: devolve direto se houver, senão busca.
final Map<int, String> cache = {};

FutureOr<String> buscarNome(int id) {
  final cached = cache[id];
  if (cached != null) return cached;             // sync, sem Future
  return Future.delayed(                         // async se preciso
    const Duration(milliseconds: 200),
    () {
      final nome = 'Usuario \$id';
      cache[id] = nome;
      return nome;
    },
  );
}`}</code></pre>

      <h2>Consumindo um FutureOr</h2>
      <p>
        Para usar o valor, basta dar <code>await</code>. Se for síncrono, <code>await</code> simplesmente devolve na hora; se for Future, ele espera. Isso é seguro nos dois casos.
      </p>
      <pre><code>{`Future<void> imprimirNome(int id) async {
  final nome = await buscarNome(id);
  print('Nome: \$nome');
}`}</code></pre>

      <AlertBox type="info" title="async wrap automático">
        Toda função marcada <code>async</code> que retorna <code>T</code> aceita devolver <code>FutureOr&lt;T&gt;</code> internamente — o compilador embrulha. Assim, você raramente precisa pensar nisso.
      </AlertBox>

      <h2>Tipo de retorno em APIs públicas</h2>
      <p>
        Em SDKs (HTTP clients, ORMs, build systems), é comum encontrar parâmetros do tipo <code>FutureOr</code>. Isso permite que o usuário passe valor pronto OU um cálculo assíncrono:
      </p>
      <pre><code>{`class Cache<T> {
  T? _valor;

  Future<T> obter(FutureOr<T> Function() carregar) async {
    return _valor ??= await carregar();
  }
}

void main() async {
  final c = Cache<int>();
  // Carregador síncrono — sem alocar Future.
  print(await c.obter(() => 42));
  // Carregador assíncrono — funciona igual.
  print(await c.obter(() async {
    await Future.delayed(const Duration(milliseconds: 50));
    return 7;
  }));
}`}</code></pre>

      <h2>Comparação com Future&lt;T&gt; puro</h2>
      <pre><code>{`// Tipos diferentes:
int x = 1;
Future<int> y = Future.value(2);
FutureOr<int> z = 3;          // ok
FutureOr<int> w = Future.value(3); // também ok

// Você NÃO pode atribuir FutureOr direto a int, mesmo que seja int "naquele momento".
// int errado = z; // ERRO de compilação`}</code></pre>
      <p>
        Por isso, ao consumir, sempre <code>await</code>. Para verificar tipo manualmente:
      </p>
      <pre><code>{`FutureOr<int> v = obterIdade();
if (v is Future<int>) {
  v.then(print);
} else {
  print(v);
}`}</code></pre>

      <AlertBox type="warning" title="Não exponha FutureOr sem motivo">
        Em APIs internas, <code>FutureOr</code> ajuda performance. Em APIs públicas de aplicação, ele costuma confundir. Use <code>Future&lt;T&gt;</code> simples a menos que o ganho seja real e justificado.
      </AlertBox>

      <h2>Caso real: hooks/callbacks de framework</h2>
      <p>
        Frameworks como <code>shelf</code>, <code>build_runner</code> e bibliotecas de testes usam <code>FutureOr</code> em handlers para que você possa escrever middlewares síncronos <em>ou</em> assíncronos:
      </p>
      <pre><code>{`typedef Handler = FutureOr<String> Function(String request);

Future<void> servir(Handler h, String req) async {
  final resp = await h(req);
  print('Resposta: \$resp');
}

void main() async {
  await servir((r) => 'eco: \$r', 'oi');                  // sync
  await servir((r) async => 'async eco: \$r', 'tudo bem'); // async
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>await</code>:</strong> imprimir um <code>FutureOr</code> direto pode mostrar &quot;Instance of Future&quot;.</li>
        <li><strong>Atribuir a <code>T</code> direto:</strong> erro de tipo, mesmo que o valor &quot;na hora&quot; seja síncrono.</li>
        <li><strong>Abusar em API pública:</strong> confunde quem consome — prefira <code>Future&lt;T&gt;</code>.</li>
        <li><strong>Usar para fingir paralelismo:</strong> não é. <code>FutureOr</code> é só sobre evitar alocação, não sobre concorrência.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>FutureOr&lt;T&gt;</code> = <code>T | Future&lt;T&gt;</code>.</li>
        <li>Permite APIs aceitarem valor pronto sem alocar Future à toa.</li>
        <li>Consumido com <code>await</code>, que funciona nos dois casos.</li>
        <li>Comum em frameworks (handlers, middlewares, builders).</li>
        <li>Em código de aplicação, prefira <code>Future&lt;T&gt;</code> a menos que tenha motivo claro.</li>
      </ul>
    </PageContainer>
  );
}
