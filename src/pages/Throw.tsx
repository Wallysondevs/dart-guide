import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Throw() {
  return (
    <PageContainer
      title="throw: lançando exceções"
      subtitle="Como sinalizar que algo deu errado de forma clara, tipada e útil para quem chama o seu código."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <p>
        Pense em <code>throw</code> como apertar um botão de emergência. Quando seu código encontra uma situação que <em>ele</em> não tem como resolver — um e-mail malformado, uma divisão por zero, um parâmetro fora dos limites — ele &quot;joga&quot; (em inglês, <em>throw</em>) uma exceção para cima, interrompe o fluxo atual e deixa o problema na mão de quem o chamou. A pessoa lá em cima decide: trata, mostra mensagem, segue em frente, ou deixa subir mais.
      </p>

      <h2>Sintaxe básica</h2>
      <p>
        A palavra-chave <code>throw</code> precisa de um valor à direita. Esse valor é &quot;o objeto da exceção&quot;: tudo que o <code>catch</code> vai receber. Em Dart, você pode lançar <em>qualquer Object</em> — mas, por convenção e bom gosto, lance algo que implemente <code>Exception</code> ou estenda <code>Error</code>.
      </p>
      <pre><code>{`void validarIdade(int idade) {
  if (idade < 0) {
    throw Exception('Idade nao pode ser negativa: \$idade');
  }
  if (idade > 130) {
    throw Exception('Idade improvavel: \$idade');
  }
}`}</code></pre>

      <h2><code>Exception(...)</code> versus tipos específicos</h2>
      <p>
        <code>Exception('mensagem')</code> é um atalho cômodo para criar uma exceção genérica com texto. Funciona, mas não comunica nada de tipo: quem captura precisa olhar a mensagem (string) para decidir o que fazer. O ideal é usar tipos <em>específicos</em> da biblioteca padrão sempre que houver um.
      </p>
      <pre><code>{`// Generico (use em scripts simples):
throw Exception('algo deu errado');

// Especifico (preferido):
throw FormatException('email invalido', 'fulano@@x');
throw ArgumentError.value(idade, 'idade', 'fora do intervalo');
throw StateError('chamou close() duas vezes');
throw UnsupportedError('plataforma sem suporte');
throw RangeError.range(i, 0, lista.length - 1, 'i');`}</code></pre>

      <AlertBox type="info" title="Dica">
        Se um tipo de erro já existe na biblioteca core, use-o. Quem mantiver seu código depois vai capturar com <code>on FormatException</code> e tratar de forma elegante.
      </AlertBox>

      <h2>O anti-pattern: lançar &quot;qualquer coisa&quot;</h2>
      <p>
        Sintaticamente, isso compila:
      </p>
      <pre><code>{`throw 'erro!';      // String
throw 42;            // int
throw {'cod': 500};  // Map`}</code></pre>
      <p>
        Mas é uma <strong>péssima ideia</strong>. Quem captura recebe um objeto sem hierarquia útil: não dá para usar <code>on MeuTipo</code>, não há <code>toString()</code> bem formatado, debugger se confunde, ferramentas de log não conseguem extrair contexto. Lance sempre uma classe que estende <code>Exception</code> ou <code>Error</code>.
      </p>

      <h2>Validações com <code>ArgumentError</code> e checagens utilitárias</h2>
      <p>
        A biblioteca core oferece checagens prontas para os casos mais comuns. Em vez de escrever <code>if (x == null) throw ...</code>, use os helpers — eles geram mensagens consistentes:
      </p>
      <pre><code>{`String saudar(String? nome, {required int? vezes}) {
  // Lanca ArgumentError se nulo, com mensagem padronizada:
  ArgumentError.checkNotNull(nome, 'nome');
  ArgumentError.checkNotNull(vezes, 'vezes');

  if (vezes! <= 0) {
    throw RangeError.value(vezes, 'vezes', 'precisa ser positivo');
  }
  return List.filled(vezes, 'Ola, \$nome!').join(' ');
}`}</code></pre>

      <h2><code>throw</code> em arrow functions</h2>
      <p>
        Diferente de muitas linguagens, em Dart <code>throw</code> é uma <em>expressão</em> — ele tem &quot;valor&quot; (do tipo <code>Never</code>, que significa &quot;nunca devolve&quot;). Por isso pode aparecer dentro de uma arrow function, de um operador ternário, ou no lado direito de <code>??</code>:
      </p>
      <pre><code>{`int divisao(int a, int b) =>
    b == 0 ? throw ArgumentError('b nao pode ser zero') : a ~/ b;

String pegaEnv(String chave) =>
    Platform.environment[chave] ?? (throw StateError('faltou \$chave'));

// Em null-safety, e util quando voce precisa fazer "or throw":
final config = lerConfig() ?? (throw StateError('config ausente'));`}</code></pre>

      <AlertBox type="warning" title="O tipo Never">
        <code>throw</code> tem tipo de retorno <code>Never</code>. O compilador entende que, depois de um <code>throw</code>, nada mais será executado naquele caminho — por isso ele aceita usar <code>throw</code> dentro de expressões que &quot;exigem&quot; um valor.
      </AlertBox>

      <h2>Mensagens úteis: contexto importa</h2>
      <p>
        Mensagem ruim: <code>throw Exception('erro')</code>. Mensagem útil: inclui <em>o que</em> falhou, <em>quais valores</em> estavam envolvidos e <em>o que se esperava</em>. Quem ler o log às 3 da manhã vai te agradecer.
      </p>
      <pre><code>{`// Ruim:
throw Exception('falhou');

// Bom:
throw FormatException(
  'CEP deve conter 8 digitos numericos',
  cepRecebido, // valor problematico (chamado "source")
  0,           // offset
);`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Lançar <code>String</code></strong> ou número &quot;porque é mais rápido&quot; — quebra todo o tratamento por tipo.</li>
        <li><strong>Mensagens vagas</strong> (&quot;erro&quot;, &quot;deu ruim&quot;) que não ajudam ninguém em produção.</li>
        <li><strong>Trocar <code>throw</code> por <code>print</code>:</strong> imprimir e seguir como se nada tivesse acontecido deixa o programa em estado quebrado.</li>
        <li><strong>Esquecer que <code>throw</code> é expressão</strong> e fazer <code>if</code> verboso onde caberia <code>?? throw</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>throw</code> sinaliza que o método não consegue cumprir seu contrato.</li>
        <li>Pode lançar qualquer <code>Object</code>, mas <strong>sempre</strong> prefira <code>Exception</code> ou <code>Error</code>.</li>
        <li>Use tipos específicos (<code>FormatException</code>, <code>ArgumentError</code>, <code>StateError</code>) sempre que existirem.</li>
        <li><code>ArgumentError.checkNotNull</code> e <code>RangeError.value</code> são helpers para validar argumentos.</li>
        <li><code>throw</code> é expressão — funciona em arrow functions e à direita de <code>??</code>.</li>
      </ul>
    </PageContainer>
  );
}
