import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IdeVscodeAndroidstudio() {
  return (
    <PageContainer
      title="Escolhendo o editor: VS Code, Android Studio e IntelliJ"
      subtitle="Três opções oficialmente suportadas — qual delas serve melhor para você."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Você pode escrever Dart no Bloco de Notas se quiser — é texto puro. Mas a vida fica muito melhor com um <strong>editor inteligente</strong>: ele autocompleta nomes, mostra erros enquanto você digita, formata o código ao salvar e te leva ao debugger com um clique. A boa notícia: a equipe Dart mantém oficialmente suporte para três editores. Vamos comparar.
      </p>

      <h2>Os três contendores</h2>
      <ul>
        <li><strong>VS Code</strong>: leve, rápido, gratuito, da Microsoft. Domina o mercado web e cresce no mobile.</li>
        <li><strong>Android Studio</strong>: IDE completa do Google para Android, baseada no IntelliJ. Pesada, mas com tudo embutido.</li>
        <li><strong>IntelliJ IDEA</strong>: IDE da JetBrains. Comunidade gratuita; Ultimate paga. Ótima para quem já vem do mundo Java/Kotlin.</li>
      </ul>

      <h2>Comparação rápida</h2>
      <table>
        <thead><tr><th>Aspecto</th><th>VS Code</th><th>Android Studio</th><th>IntelliJ</th></tr></thead>
        <tbody>
          <tr><td>Tamanho do download</td><td>~120MB</td><td>~1GB</td><td>~700MB</td></tr>
          <tr><td>Consumo de RAM</td><td>Baixo</td><td>Alto</td><td>Médio-alto</td></tr>
          <tr><td>Ideal para</td><td>Dart puro / Flutter</td><td>Flutter + Android nativo</td><td>Flutter</td></tr>
          <tr><td>Custo</td><td>Grátis</td><td>Grátis</td><td>Community grátis / Ultimate paga</td></tr>
          <tr><td>Plugins extras</td><td>Sim, marketplace enorme</td><td>Sim, plugins JetBrains</td><td>Sim, plugins JetBrains</td></tr>
        </tbody>
      </table>

      <h2>VS Code: o queridinho</h2>
      <p>
        Para a maioria dos iniciantes em Dart, recomendamos VS Code. É leve, abre rápido até em laptops modestos e tem uma experiência polida. Para começar:
      </p>
      <pre><code>{`# 1. Baixe em https://code.visualstudio.com
# 2. Abra o painel de extensões (Ctrl+Shift+X)
# 3. Instale "Dart" (publisher: Dart Code) — já vem com:
#    - Syntax highlight
#    - Autocomplete via Dart Analysis Server
#    - Debugger
#    - Formatador
# 4. Para Flutter, instale também a extensão "Flutter"
# 5. Reabra o VS Code`}</code></pre>
      <p>
        Configurações úteis para colocar no <code>settings.json</code> (Ctrl+Shift+P → &quot;Preferences: Open User Settings (JSON)&quot;):
      </p>
      <pre><code>{`{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.organizeImports": "explicit"
  },
  "dart.lineLength": 100,
  "dart.previewFlutterUiGuides": true,
  "[dart]": {
    "editor.rulers": [100],
    "editor.tabSize": 2
  }
}`}</code></pre>

      <AlertBox type="info" title="Format on save é vida">
        Com <code>editor.formatOnSave</code> ligado, toda vez que você salva o arquivo, o código fica perfeitamente formatado no estilo padrão do Dart. Você nunca mais discute estilo em PR.
      </AlertBox>

      <h2>Android Studio: a casa do Flutter mobile</h2>
      <p>
        Se você vai mexer com Flutter e precisa configurar emuladores Android, builds <code>apk</code>/<code>aab</code>, assinatura, ProGuard, gradle — Android Studio é o melhor caminho. Ele já vem com o Android SDK Manager, o AVD Manager (criação de emuladores) e debugger nativo de Java/Kotlin (útil quando você abre o módulo Android do seu app Flutter).
      </p>
      <pre><code>{`# Instalação (Linux exemplo)
sudo snap install android-studio --classic

# Após abrir:
# File → Settings → Plugins → Marketplace
# Busque "Flutter" e instale (já traz o plugin Dart)
# Reinicie`}</code></pre>

      <h2>IntelliJ IDEA</h2>
      <p>
        Mesma engine do Android Studio, sem o foco Android. Ótimo para Dart puro, backend, web. A versão Community gratuita já cobre Dart e Flutter via plugins.
      </p>

      <h2>Atalhos essenciais (todos os editores)</h2>
      <table>
        <thead><tr><th>Ação</th><th>VS Code</th><th>JetBrains</th></tr></thead>
        <tbody>
          <tr><td>Paleta de comandos</td><td>Ctrl+Shift+P</td><td>Ctrl+Shift+A</td></tr>
          <tr><td>Buscar arquivo</td><td>Ctrl+P</td><td>Ctrl+Shift+N</td></tr>
          <tr><td>Buscar símbolo</td><td>Ctrl+T</td><td>Ctrl+Alt+Shift+N</td></tr>
          <tr><td>Renomear</td><td>F2</td><td>Shift+F6</td></tr>
          <tr><td>Ir para definição</td><td>F12</td><td>Ctrl+B</td></tr>
          <tr><td>Iniciar debug</td><td>F5</td><td>Shift+F9</td></tr>
          <tr><td>Step over</td><td>F10</td><td>F8</td></tr>
          <tr><td>Step into</td><td>F11</td><td>F7</td></tr>
          <tr><td>Hot reload (Flutter)</td><td>Ctrl+F5</td><td>Ctrl+\\</td></tr>
        </tbody>
      </table>

      <h2>Hot reload e hot restart</h2>
      <p>
        Em Flutter, o ciclo de feedback é o grande diferencial. Com a app rodando em modo debug:
      </p>
      <ul>
        <li><strong>Hot reload (r no terminal)</strong>: reinjeta código sem perder o estado. Muda cor, layout, lógica simples — em 100ms você vê o efeito.</li>
        <li><strong>Hot restart (R no terminal)</strong>: reinicia o app inteiro mantendo o processo. Use quando mudar inicializações.</li>
        <li><strong>Full restart</strong>: para tudo e roda do zero. Use em mudanças nativas (Android/iOS).</li>
      </ul>
      <pre><code>{`# Rodando flutter no terminal:
flutter run
# r        Hot reload
# R        Hot restart
# h        Lista todos os comandos
# q        Encerra o app`}</code></pre>

      <AlertBox type="success" title="Recomendação por SO">
        <strong>Windows/Linux</strong> com hardware modesto: VS Code. <strong>Mac</strong> com bastante RAM e foco em Flutter mobile: Android Studio. Quem já usa <strong>JetBrains</strong> em outras linguagens: IntelliJ.
      </AlertBox>

      <h2>Code lens, snippets e refactors</h2>
      <p>
        Todos os editores oficiais oferecem refactors poderosos. Em VS Code, um clique na lâmpada amarela (Ctrl+.) sugere ações:
      </p>
      <pre><code>{`// Selecione um trecho e Ctrl+. para ver:
// - Wrap with Container, Padding, Center
// - Extract Widget
// - Extract Method
// - Convert to StatefulWidget
// - Surround with try/catch

class MeuBotao extends StatelessWidget {
  const MeuBotao({super.key});
  @override
  Widget build(BuildContext context) {
    // Selecione "Text(...)" → Wrap with Padding
    return Text('Clique');
  }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Não instalar a extensão Dart/Flutter</strong>: sem ela, o editor é só um bloco de notas colorido.</li>
        <li><strong>Misturar versões de SDK</strong>: configure o caminho explícito em <em>Settings → Dart SDK path</em>.</li>
        <li><strong>Esquecer <code>dart pub get</code></strong> após abrir um projeto novo — o autocomplete fica vazio.</li>
        <li><strong>Achar que hot reload resolve tudo</strong>: mudanças em <code>main()</code> ou inicializações exigem hot restart.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Três opções oficiais: VS Code (leve), Android Studio (completo), IntelliJ (jeitão JetBrains).</li>
        <li>Sempre instale as extensões Dart e Flutter.</li>
        <li>Atalhos comuns: F5 debug, F10/F11 step over/into, F12 ir para definição.</li>
        <li>Hot reload (r) é o superpoder do Flutter.</li>
        <li>Configure <code>formatOnSave</code> e organize imports automaticamente.</li>
      </ul>
    </PageContainer>
  );
}
