import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FutureThenCatchError() {
  return (
    <PageContainer
      title="then, catchError e whenComplete: a API antiga (mas viva)"
      subtitle="A forma original de manipular Futures, ainda útil em pipelines, callbacks e código de bibliotecas."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <p>
        Antes do <code>async/await</code> chegar (em 2014, na versão 1.9), todo Dart assíncrono se escrevia com <code>then</code>, <code>catchError</code> e <code>whenComplete</code>. Hoje, na maioria do código de aplicação, usamos <code>await</code> — mas essa &quot;API antiga&quot; segue viva e <em>mais elegante em alguns cenários</em>: pipelines em fluência, callbacks pequenos passados como argumento, e código de baixo nível em pacotes.
      </p>

      <h2>then: o callback de sucesso</h2>
      <p>
        <code>future.then(callback)</code> registra uma função para rodar quando o Future resolve com sucesso. O retorno do <code>then</code> é, ele próprio, um novo <code>Future</code>, encadeável.
      </p>
      <pre><code>{`Future<int> carregar() => Future.delayed(
      const Duration(milliseconds: 200),
      () => 100,
    );

void main() {
  carregar()
      .then((n) => n + 1)              // 101
      .then((n) => 'valor=\$n')        // String
      .then(print);                    // imprime: valor=101
}`}</code></pre>
      <p>
        O <code>then</code> aceita uma função síncrona <em>ou</em> outra que devolve <code>Future</code>. No segundo caso, o pipeline &quot;se achata&quot; automaticamente — você não acaba com <code>Future&lt;Future&lt;X&gt;&gt;</code>.
      </p>

      <h2>catchError: tratando erros</h2>
      <p>
        Erros propagam pelo encadeamento até encontrar um <code>catchError</code>. Sem ele, viram <em>unhandled exception</em>.
      </p>
      <pre><code>{`Future<int> arriscar() async {
  throw FormatException('má formatação');
}

void main() {
  arriscar()
      .then((v) => print('valor: \$v'))
      .catchError((e, st) {
        print('Tratei: \$e');
      });
}`}</code></pre>
      <p>
        O parâmetro opcional <code>test:</code> filtra qual tipo de erro tratar. Útil quando você quer reagir só a uma exceção específica e deixar as outras subirem:
      </p>
      <pre><code>{`Future<void> chamar() async => throw StateError('boom');

void main() {
  chamar()
      .catchError(
        (e, st) => print('Estado inválido: \$e'),
        test: (e) => e is StateError,
      )
      .catchError(
        (e, st) => print('Outro tipo: \$e'),
      );
}`}</code></pre>

      <AlertBox type="warning" title="catchError engole erro silenciosamente">
        Se você não relançar dentro de <code>catchError</code>, o pipeline segue como se nada tivesse acontecido — com valor <code>null</code> em <code>then</code>s posteriores. Isso pode esconder bugs.
      </AlertBox>

      <h2>whenComplete: o &quot;finally&quot; do mundo Future</h2>
      <p>
        <code>whenComplete(fn)</code> agenda um callback para rodar <strong>sempre</strong>, dê certo ou errado. É o equivalente ao <code>finally</code> do <code>try</code>: ideal para limpar recursos (fechar conexões, esconder loaders).
      </p>
      <pre><code>{`Future<String> carregarPerfil() async {
  await Future.delayed(const Duration(milliseconds: 300));
  return 'Ana';
}

void main() {
  print('Mostrando spinner...');
  carregarPerfil()
      .then((nome) => print('Olá, \$nome'))
      .catchError((e) => print('Erro: \$e'))
      .whenComplete(() => print('Escondendo spinner.'));
}`}</code></pre>

      <h2>Comparação direta com async/await</h2>
      <p>
        O mesmo trecho, nas duas formas:
      </p>
      <pre><code>{`// API antiga (encadeada)
Future<void> carregarV1() {
  return buscarUsuario()
      .then((u) => buscarPedidos(u.id))
      .then((pedidos) => print('Total: \${pedidos.length}'))
      .catchError((e) => print('Erro: \$e'));
}

// Moderna (async/await)
Future<void> carregarV2() async {
  try {
    final u = await buscarUsuario();
    final pedidos = await buscarPedidos(u.id);
    print('Total: \${pedidos.length}');
  } catch (e) {
    print('Erro: \$e');
  }
}`}</code></pre>
      <p>
        A versão com <code>await</code> é mais legível para humanos e debugger (stack traces preservadas). A versão encadeada brilha em pipelines fluentes e callbacks isolados.
      </p>

      <h2>Quando ainda faz sentido usar then</h2>
      <ul>
        <li><strong>Funções minúsculas</strong> passadas como argumento: <code>btn.onPressed = () =&gt; salvar().then(print);</code></li>
        <li><strong>Pipelines de transformação</strong> sem necessidade de variáveis intermediárias.</li>
        <li><strong>Bibliotecas/SDKs</strong> que querem evitar marcar funções como <code>async</code> (e a alocação extra).</li>
        <li><strong>Encadeamento condicional preguiçoso</strong> dentro de outras estruturas reativas.</li>
      </ul>

      <AlertBox type="info" title="then aceita onError também">
        <code>future.then(ok, onError: trata)</code> existe e funciona, mas evite — fica confuso de ler. Prefira <code>catchError</code> separado.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer de retornar dentro do then:</strong> sem <code>return</code>, o encadeamento perde o valor.</li>
        <li><strong>catchError absorve tudo:</strong> sem relançar, erros somem.</li>
        <li><strong>Misturar with await + then na mesma função:</strong> deixa o código inconsistente. Escolha um estilo por bloco.</li>
        <li><strong>whenComplete não muda valor:</strong> ele só roda; o valor que segue no pipeline é o do then anterior.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>then</code> trata sucesso e devolve novo Future encadeável.</li>
        <li><code>catchError</code> trata erro; aceita <code>test:</code> para filtrar tipo.</li>
        <li><code>whenComplete</code> roda sempre — ótimo para limpeza.</li>
        <li><code>async/await</code> é geralmente mais legível, mas a API antiga continua útil em casos específicos.</li>
      </ul>
    </PageContainer>
  );
}
