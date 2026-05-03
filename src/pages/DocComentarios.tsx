import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DocComentarios() {
  return (
    <PageContainer
      title="Comentários e documentação com /// e dartdoc"
      subtitle="Como deixar bilhetes para você mesmo no futuro — e gerar uma documentação HTML profissional sem trabalho extra."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Código sem documentação é como um livro sem capa, sumário ou contracapa: você consegue ler, mas precisa abrir cada página para descobrir o que tem dentro. O Dart leva documentação a sério: tem três tipos de comentários, uma sintaxe rica para documentação inline (Markdown) e uma ferramenta oficial — o <code>dart doc</code> — que gera um site HTML inteiro a partir dos seus comentários. Vamos dominar tudo isso.
      </p>

      <h2>Os três tipos de comentário</h2>
      <ul>
        <li><strong>Linha única</strong>: <code>// comentário até o fim da linha</code>.</li>
        <li><strong>Múltiplas linhas</strong>: <code>/* tudo entre eles é ignorado */</code>.</li>
        <li><strong>Documentação</strong>: <code>/// um para cada linha</code>, suporta Markdown, é processado pelo <code>dart doc</code>.</li>
      </ul>
      <pre><code>{`// Comentário comum: anota intenção.
/* Bloco de várias linhas:
   raramente usado, mas existe. */

/// Comentário de documentação.
/// Vira tooltip no editor e gera HTML.
void exemplo() {}`}</code></pre>

      <h2>Por que /// é especial?</h2>
      <p>
        O <code>///</code> é processado pelo <strong>dartdoc</strong>, ferramenta oficial que extrai esses comentários e gera documentação HTML navegável — igualzinha à do pub.dev. O tooltip do VS Code também usa esses comentários: quando você passa o mouse sobre uma função, aparece o texto formatado.
      </p>
      <pre><code>{`/// Soma dois números inteiros.
///
/// Retorna a soma de [a] e [b].
/// Os colchetes [a] viram links automáticos para o parâmetro.
///
/// Exemplo:
/// \`\`\`dart
/// final r = somar(2, 3);
/// print(r); // 5
/// \`\`\`
int somar(int a, int b) => a + b;`}</code></pre>

      <AlertBox type="info" title="Markdown completo">
        Dentro de <code>///</code> você pode usar <strong>negrito</strong>, <em>itálico</em>, listas, links externos, blocos de código com syntax highlight. Tudo Markdown padrão.
      </AlertBox>

      <h2>Referências cruzadas com [colchetes]</h2>
      <p>
        Dentro da doc, qualquer identificador entre colchetes vira um <em>link</em> para a documentação dele. É a forma mais limpa de conectar conceitos:
      </p>
      <pre><code>{`/// Representa um usuário do sistema.
///
/// Para criar, use [Usuario.criar]. Para serializar, veja [toJson].
/// Note que o campo [idade] aceita apenas valores não-negativos.
class Usuario {
  final String nome;
  final int idade;

  /// Construtor padrão.
  Usuario({required this.nome, required this.idade});

  /// Construtor de fábrica que valida [idade].
  factory Usuario.criar({required String nome, required int idade}) {
    if (idade < 0) throw ArgumentError('idade negativa');
    return Usuario(nome: nome, idade: idade);
  }

  /// Converte em mapa JSON-serializável.
  Map<String, Object?> toJson() => {'nome': nome, 'idade': idade};
}`}</code></pre>

      <h2>Comentário em pacotes e bibliotecas</h2>
      <p>
        Para descrever a biblioteca <em>como um todo</em>, use a diretiva <code>library</code> com doc no topo do arquivo:
      </p>
      <pre><code>{`/// Cliente para a API de pagamentos da Acme.
///
/// Forneça uma [chave de API] e crie um [AcmeClient]:
///
/// \`\`\`dart
/// final client = AcmeClient(apiKey: 'sk_...');
/// await client.charge(amount: 100);
/// \`\`\`
library acme_client;

export 'src/client.dart';
export 'src/models.dart';`}</code></pre>

      <h2>Gerando o HTML com dart doc</h2>
      <pre><code>{`# Na raiz do projeto:
dart doc

# Output:
# Documenting meu_app...
# Initialized dartdoc with 12 libraries
# Generating docs for library meu_app...
# Wrote 234 files to doc/api/

# Abra no navegador:
# Linux/macOS:  open doc/api/index.html
# Windows:      start doc/api/index.html`}</code></pre>
      <p>
        O resultado é um site HTML estático completo: índice de classes, busca, navegação por libraries, referências cruzadas funcionando. Pode ser hospedado no GitHub Pages, Netlify ou em qualquer servidor estático.
      </p>

      <h2>Boas práticas para escrever doc</h2>
      <ul>
        <li><strong>Primeira linha = resumo</strong>: uma frase completa, terminada com ponto. Aparece no índice.</li>
        <li><strong>Linha em branco</strong> entre resumo e detalhes (sintaxe Markdown padrão).</li>
        <li><strong>Use [identificador]</strong> ao mencionar parâmetros e tipos.</li>
        <li><strong>Inclua exemplos</strong> com bloco <code>```dart</code>.</li>
        <li><strong>Documente exceções</strong>: o que pode jogar e quando.</li>
      </ul>
      <pre><code>{`/// Faz uma requisição HTTP GET para [url].
///
/// Retorna o corpo da resposta como [String].
///
/// Joga [HttpException] se o status for >= 400, ou
/// [TimeoutException] se exceder [timeout] (padrão 30s).
///
/// Exemplo:
/// \`\`\`dart
/// final body = await fetch('https://api.exemplo.com/dados');
/// print(body);
/// \`\`\`
Future<String> fetch(
  String url, {
  Duration timeout = const Duration(seconds: 30),
}) async {
  // ...
  return '';
}`}</code></pre>

      <h2>Comparando com JavaDoc, JSDoc e similares</h2>
      <table>
        <thead><tr><th>Linguagem</th><th>Sintaxe</th><th>Ferramenta</th></tr></thead>
        <tbody>
          <tr><td>Java</td><td><code>/** ... */</code> com <code>@param</code></td><td>javadoc</td></tr>
          <tr><td>JavaScript</td><td><code>/** ... */</code> com <code>@param</code></td><td>JSDoc/TypeDoc</td></tr>
          <tr><td>Python</td><td>docstrings <code>&quot;&quot;&quot;...&quot;&quot;&quot;</code></td><td>Sphinx</td></tr>
          <tr><td>Dart</td><td><code>///</code> com Markdown</td><td>dart doc</td></tr>
          <tr><td>Rust</td><td><code>///</code> com Markdown</td><td>rustdoc</td></tr>
        </tbody>
      </table>
      <p>
        Dart se inspirou diretamente no Rust: comentário Markdown, ferramenta oficial, exemplos executáveis. Diferente do JavaDoc (que usa tags <code>@param</code>), no Dart você usa colchetes <code>[]</code> — mais limpo.
      </p>

      <AlertBox type="success" title="Doc é parte do score">
        No pub.dev, sua nota de pacote (<em>pub points</em>) inclui &quot;documentation&quot;. Pacotes com 100% das APIs públicas documentadas ganham mais pontos — e mais downloads.
      </AlertBox>

      <h2>Comentários TODO e FIXME</h2>
      <p>
        Convenções universais que o analyzer reconhece:
      </p>
      <pre><code>{`// TODO(fulano): refatorar para usar Riverpod.
// FIXME: bug em datas com timezone — issue #142.
// NOTE: este algoritmo é O(n²); aceitável para n < 1000.`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Doc &quot;ruidosa&quot;</strong>: <code>/// soma os dois números</code> em <code>int somar(int a, int b)</code> — não agrega nada.</li>
        <li><strong>Esquecer de regenerar</strong>: <code>dart doc</code> precisa rodar a cada release; automatize no CI.</li>
        <li><strong>Usar <code>//</code> achando que vira HTML</strong>: só <code>///</code> é processado.</li>
        <li><strong>Misturar idiomas</strong>: escolha PT-BR ou EN e mantenha consistência.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Três tipos de comentário: <code>//</code>, <code>/* */</code>, <code>///</code>.</li>
        <li><code>///</code> aceita Markdown e é extraído pelo <code>dart doc</code>.</li>
        <li>Referencie identificadores com [colchetes] para virar link.</li>
        <li>Inclua exemplos com <code>```dart</code>.</li>
        <li><code>dart doc</code> gera HTML completo em <code>doc/api/</code>.</li>
        <li>Boa documentação aumenta o score no pub.dev.</li>
      </ul>
    </PageContainer>
  );
}
