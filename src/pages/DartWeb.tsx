import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartWeb() {
  return (
    <PageContainer
      title="Dart no navegador: dart compile js"
      subtitle="Como o mesmo Dart que roda no servidor pode virar JavaScript otimizado para rodar dentro do Chrome, Firefox ou Safari."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        O navegador só entende um idioma: <strong>JavaScript</strong>. Então como podemos rodar Dart numa página HTML? A resposta é simples: temos um <em>compilador</em> (programa que traduz código de uma linguagem para outra) chamado <code>dart compile js</code> que pega seu arquivo <code>.dart</code> e cospe um <code>.js</code> equivalente. É como um tradutor simultâneo numa conferência: você fala em português, o público escuta em inglês — só que aqui a tradução acontece <em>antes</em> do navegador receber o arquivo.
      </p>

      <h2>O entrypoint web e o HTML hospedeiro</h2>
      <p>
        Todo app Dart-web tem um arquivo de entrada (chamado <em>entrypoint</em>) que normalmente vive em <code>web/main.dart</code>. Esse arquivo precisa ter a função <code>main()</code> de praxe. O HTML carrega o JS gerado com uma tag <code>&lt;script&gt;</code>:
      </p>
      <pre><code>{`<!-- web/index.html -->
<!DOCTYPE html>
<html>
  <head><title>Meu app Dart</title></head>
  <body>
    <h1 id="alvo">...</h1>
    <script defer src="main.dart.js"></script>
  </body>
</html>`}</code></pre>

      <h2>dart:html — a biblioteca legada para o DOM</h2>
      <p>
        O <strong>DOM</strong> (Document Object Model) é a árvore de elementos que o navegador monta a partir do HTML — cada <code>&lt;div&gt;</code>, <code>&lt;p&gt;</code> ou <code>&lt;button&gt;</code> vira um nó dessa árvore. A biblioteca histórica para mexer no DOM via Dart era <code>dart:html</code>:
      </p>
      <pre><code>{`// web/main.dart
import 'dart:html';

void main() {
  // Procura o elemento com id "alvo" e troca o texto.
  final titulo = querySelector('#alvo');
  titulo?.text = 'Olá do Dart!';

  // Cria um botão e reage ao clique.
  final botao = ButtonElement()..text = 'Clique';
  botao.onClick.listen((event) => print('Cliquei!'));
  document.body?.append(botao);
}`}</code></pre>

      <h2>package:web — a API moderna baseada em interop</h2>
      <p>
        Desde 2024, a equipe do Dart desencoraja <code>dart:html</code> e recomenda o <strong>package:web</strong>, que é um espelho fino e tipado das APIs reais do navegador (geradas a partir do WebIDL, a especificação oficial). A vantagem: funciona tanto compilado para JS quanto para <strong>WebAssembly</strong> (formato binário rápido que navegadores também rodam).
      </p>
      <pre><code>{`import 'package:web/web.dart' as web;

void main() {
  final h1 = web.document.querySelector('#alvo') as web.HTMLElement?;
  h1?.textContent = 'Olá com package:web';

  final botao = web.HTMLButtonElement();
  botao.textContent = 'Clique';
  botao.onClick.listen((web.Event e) {
    web.window.alert('Cliquei!');
  });
  web.document.body?.appendChild(botao);
}`}</code></pre>

      <AlertBox type="info" title="Quando usar cada um?">
        Para projetos novos, prefira <code>package:web</code>. <code>dart:html</code> ainda funciona, mas é considerada legado e não suporta WebAssembly.
      </AlertBox>

      <h2>Compilando para JavaScript</h2>
      <p>
        Para gerar o bundle final, use:
      </p>
      <pre><code>{`# Servidor de desenvolvimento com hot reload
dart pub global activate webdev
webdev serve

# Build de produção (minificado, com tree-shaking)
webdev build --release
# resultado vai em build/`}</code></pre>
      <p>
        O <strong>tree shaking</strong> é uma otimização: o compilador remove qualquer função, classe ou variável que ninguém usa. Pense num jardineiro podando galhos secos — só fica o que está vivo. Por isso um app Dart compilado pode ficar surpreendentemente pequeno.
      </p>

      <h2>Deferred imports — carregamento sob demanda</h2>
      <p>
        Se seu app é grande, você pode dividir o JS em pedaços que só baixam quando o usuário precisa. Isso se chama <em>deferred loading</em>:
      </p>
      <pre><code>{`import 'package:meu_app/admin.dart' deferred as admin;

Future<void> abrirPainelAdmin() async {
  // O navegador só baixa o JS de admin.dart agora.
  await admin.loadLibrary();
  admin.abrirPainel();
}`}</code></pre>

      <AlertBox type="success" title="Resultado prático">
        O <em>bundle</em> inicial fica menor, a página carrega mais rápido, e o usuário só paga o custo do download de funcionalidades pesadas se realmente acessá-las.
      </AlertBox>

      <h2>Dart-web puro vs Flutter Web</h2>
      <p>
        Existem dois caminhos para rodar Dart no navegador. <strong>Dart puro</strong> (com <code>package:web</code>) gera um app que vive dentro do HTML — ele convive com CSS, frameworks JS e SEO normal. Já o <strong>Flutter Web</strong> desenha tudo num <code>&lt;canvas&gt;</code> usando o motor Skia/CanvasKit; o resultado é pixel-perfeito como um app mobile, mas perde acessibilidade e SEO. Use Dart puro para sites/widgets, e Flutter Web para aplicações tipo dashboard.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Misturar dart:html e package:web</strong> — escolha uma só.</li>
        <li><strong>Esquecer o <code>defer</code></strong> na tag script — o JS pode tentar mexer no DOM antes do HTML estar pronto.</li>
        <li><strong>Importar dart:io no entrypoint web</strong> — <code>dart:io</code> só existe no servidor, não no navegador.</li>
        <li><strong>Usar <code>print</code> e esperar ver no terminal</strong> — no web, <code>print</code> aparece no <em>console</em> do DevTools (F12).</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dart compile js</code> traduz Dart para JavaScript executável no navegador.</li>
        <li><code>package:web</code> é a API moderna, recomendada; <code>dart:html</code> é legado.</li>
        <li>Tree shaking remove código não usado; deferred imports adiam downloads.</li>
        <li>Dart-web puro é ideal para sites; Flutter Web para apps tipo dashboard.</li>
      </ul>
    </PageContainer>
  );
}
