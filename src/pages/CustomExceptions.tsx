import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CustomExceptions() {
  return (
    <PageContainer
      title="Criando exceções customizadas"
      subtitle="Quando os tipos prontos da biblioteca não bastam, criar a sua própria exceção deixa o código mais expressivo e fácil de tratar."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <p>
        Pense numa loja online. Quando uma compra falha, dizer apenas &quot;deu erro&quot; é inútil — o caixa precisa saber se o cartão foi recusado, se o produto está sem estoque ou se o CEP é inválido. Cada um desses problemas exige uma reação diferente. Em código, é a mesma coisa: criar <strong>exceções customizadas</strong> permite que quem captura distinga, com um simples <code>on EstoqueInsuficienteException</code>, exatamente o que aconteceu — sem ler strings.
      </p>

      <h2>O esqueleto mínimo</h2>
      <p>
        Para criar uma exceção, basta criar uma classe que <em>implemente</em> a interface <code>Exception</code>. <code>Exception</code> não exige nenhum método — é mais uma marca para indicar &quot;sou um throwable de propósito recuperável&quot;.
      </p>
      <pre><code>{`class EstoqueInsuficienteException implements Exception {
  final String produto;
  final int pedido;
  final int disponivel;

  const EstoqueInsuficienteException({
    required this.produto,
    required this.pedido,
    required this.disponivel,
  });

  @override
  String toString() =>
      'EstoqueInsuficienteException: \$produto pediu \$pedido, '
      'mas so ha \$disponivel em estoque.';
}`}</code></pre>
      <p>
        Os pontos importantes:
      </p>
      <ul>
        <li><strong>Implementa <code>Exception</code></strong> (interface vazia, mas semanticamente importante).</li>
        <li><strong>Sufixo <code>-Exception</code></strong> no nome — convenção universal em Dart/Flutter.</li>
        <li><strong>Campos <code>final</code></strong> com contexto (produto, quantidade pedida, disponível).</li>
        <li><strong><code>toString()</code> sobrescrito</strong> — sem isso, o log mostra apenas <em>&quot;Instance of 'EstoqueInsuficienteException'&quot;</em>, inútil.</li>
      </ul>

      <h2>Capturando por tipo</h2>
      <p>
        Com a exceção customizada, o código que chama fica limpo e expressivo:
      </p>
      <pre><code>{`Future<void> finalizarPedido(Pedido p) async {
  try {
    await loja.cobrar(p);
  } on EstoqueInsuficienteException catch (e) {
    mostrarSnack('Faltou estoque de \${e.produto}. Restam \${e.disponivel}.');
  } on CartaoRecusadoException catch (e) {
    mostrarSnack('Cartao recusado: \${e.motivo}.');
  } on Exception {
    mostrarSnack('Algo deu errado, tente novamente.');
  }
}`}</code></pre>

      <AlertBox type="info" title="Por que não simplesmente uma string?">
        Se você lança <code>Exception('estoque insuficiente')</code> e em outro lugar lança <code>Exception('cartao recusado')</code>, o <code>catch</code> precisa fazer <code>if (e.toString().contains('estoque'))</code>. Frágil, lento e quebra com tradução. Tipos resolvem isso.
      </AlertBox>

      <h2>Adicionando código de erro e causa</h2>
      <p>
        Em sistemas maiores, é comum incluir um <strong>code</strong> (string ou enum) para identificar o erro de forma estável (útil para logs e i18n) e uma <strong>cause</strong> (a exceção original que provocou esta, se houver). Isso forma uma &quot;cadeia&quot; de exceções.
      </p>
      <pre><code>{`enum FalhaPagamentoCodigo { cartaoRecusado, saldoInsuficiente, timeout, desconhecido }

class FalhaPagamentoException implements Exception {
  final FalhaPagamentoCodigo codigo;
  final String mensagem;
  final Object? causa;       // excecao original (se houver)
  final StackTrace? stack;   // stack original

  const FalhaPagamentoException({
    required this.codigo,
    required this.mensagem,
    this.causa,
    this.stack,
  });

  @override
  String toString() =>
      'FalhaPagamentoException(\${codigo.name}): \$mensagem'
      '\${causa != null ? "\\n  causada por: \$causa" : ""}';
}

// Uso:
try {
  await api.cobrar();
} on TimeoutException catch (e, s) {
  throw FalhaPagamentoException(
    codigo: FalhaPagamentoCodigo.timeout,
    mensagem: 'Gateway demorou demais',
    causa: e,
    stack: s,
  );
}`}</code></pre>

      <h2>Sealed classes: um conjunto fechado de erros</h2>
      <p>
        Em Dart 3, uma <code>sealed class</code> permite enumerar <em>todos</em> os subtipos possíveis em um arquivo. O compilador então força você a tratar cada um no <code>switch</code>. Excelente para domínios bem definidos:
      </p>
      <pre><code>{`sealed class LoginException implements Exception {
  const LoginException();
}

class CredenciaisInvalidasException extends LoginException {
  const CredenciaisInvalidasException();
}

class ContaBloqueadaException extends LoginException {
  final DateTime ate;
  const ContaBloqueadaException(this.ate);
}

class TwoFactorObrigatorioException extends LoginException {
  final String desafioId;
  const TwoFactorObrigatorioException(this.desafioId);
}

String mensagem(LoginException e) => switch (e) {
      CredenciaisInvalidasException() => 'Usuario ou senha incorretos.',
      ContaBloqueadaException(:final ate) => 'Conta bloqueada ate \$ate.',
      TwoFactorObrigatorioException() => 'Informe o codigo 2FA.',
    };`}</code></pre>

      <AlertBox type="warning" title="Não exagere">
        Criar 30 exceções para um app pequeno é overengineering. Comece com tipos da biblioteca (<code>FormatException</code>, <code>StateError</code>) e só promova para customizada quando houver <strong>tratamento diferente</strong> em algum <code>catch</code>.
      </AlertBox>

      <h2>Quando criar uma exceção customizada justifica?</h2>
      <ul>
        <li>Quando há código que precisa <strong>distinguir</strong> esse erro de outros para tomar decisão diferente.</li>
        <li>Quando o erro carrega <strong>contexto estruturado</strong> (campos, IDs, valores) que não cabem em uma string.</li>
        <li>Quando faz parte de uma <strong>API pública</strong> (uma biblioteca, por exemplo) e você quer permitir que consumidores capturem por tipo.</li>
        <li>Quando o erro pertence a um <strong>domínio de negócio</strong> bem definido (pagamentos, autenticação, etc.).</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer de sobrescrever <code>toString()</code>:</strong> seus logs viram <em>&quot;Instance of 'X'&quot;</em>.</li>
        <li><strong>Estender <code>Exception</code> em vez de <em>implementar</em>:</strong> tecnicamente funciona, mas <code>Exception</code> é uma <em>interface</em> — use <code>implements</code>.</li>
        <li><strong>Nomes sem o sufixo <code>Exception</code>:</strong> dificulta a leitura. <code>EstoqueRuim</code> &lt; <code>EstoqueInsuficienteException</code>.</li>
        <li><strong>Campos mutáveis:</strong> exceções devem ser imutáveis. Use <code>final</code> em tudo.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Implemente <code>Exception</code> (não <code>extends</code>) e use o sufixo <code>Exception</code> no nome.</li>
        <li>Sobrescreva sempre <code>toString()</code> com mensagem útil.</li>
        <li>Inclua contexto (campos <code>final</code>, código de erro, causa original).</li>
        <li>Use <code>sealed class</code> quando o conjunto de erros for fechado e exaustivo.</li>
        <li>Só crie tipo novo se houver tratamento distinto — caso contrário, reutilize tipos da biblioteca.</li>
      </ul>
    </PageContainer>
  );
}
