import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BuildRun() {
  return (
    <PageContainer
      title="Build, compile e run: o ciclo completo"
      subtitle="Do código-fonte ao executável distribuível — entenda cada artefato gerado pelo Dart."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Quando você termina de escrever um programa, o próximo passo é <em>levar ele para o mundo</em>: rodar localmente, gerar um executável que o usuário possa baixar, ou subir para um servidor. O Dart oferece várias opções para isso, e cada uma gera um tipo diferente de arquivo. Pense no Dart como uma padaria multifuncional: o mesmo trigo (código) pode virar pão, baguete, croissant ou bolo — você escolhe o produto final.
      </p>

      <h2>dart run: o jeito do dia a dia</h2>
      <p>
        <code>dart run</code> compila o código em modo JIT (rápido para começar) e executa imediatamente. Não gera arquivo final. Use durante desenvolvimento.
      </p>
      <pre><code>{`# Roda o entrypoint padrão (bin/<nome>.dart)
dart run

# Roda um arquivo específico
dart run bin/script.dart

# Passa argumentos
dart run -- --nome Ana --idade 30`}</code></pre>

      <h2>dart compile exe: executável nativo</h2>
      <p>
        Gera um arquivo binário independente, com a Dart VM embutida, que roda sem precisar do SDK. É o que você distribui para usuários finais em CLIs.
      </p>
      <pre><code>{`# Compila bin/cli.dart em um executável "cli"
dart compile exe bin/cli.dart -o build/cli

# Linux/macOS: rode direto
./build/cli --help

# Windows: gera build/cli.exe
.\\build\\cli.exe --help

# Tamanho típico: ~5-10 MB`}</code></pre>
      <p>
        Vantagens: startup instantâneo (já é AOT), distribuição simples. Limitação: o binário só roda no SO/arquitetura em que foi compilado. Para distribuir multi-plataforma, compile em cada SO (ou use CI matricial).
      </p>

      <AlertBox type="info" title="Por que tão grande?">
        ~5MB para um &quot;hello world&quot; parece muito. É porque o executável carrega a Dart VM completa: GC, runtime, bibliotecas core. Em troca, você não precisa instalar nada na máquina alvo.
      </AlertBox>

      <h2>dart compile js: para o navegador</h2>
      <p>
        Transforma seu Dart em JavaScript otimizado. Útil para dashboards, jogos web, ferramentas administrativas.
      </p>
      <pre><code>{`# -O4 ativa otimização máxima (tree-shaking + minificação)
dart compile js -O4 web/main.dart -o web/main.js

# -O0 desliga otimizações (debug, gera mais código)
dart compile js -O0 web/main.dart -o web/main.dev.js

# Saída pode ter dezenas de KB a alguns MB, dependendo do app`}</code></pre>

      <h2>dart compile aot-snapshot: snapshot otimizado</h2>
      <p>
        Gera apenas o &quot;código compilado&quot;, sem incluir a VM. Para rodar, você precisa do <code>dartaotruntime</code> (já vem no SDK). É menor que <code>exe</code> e útil em servidores onde o SDK já está disponível.
      </p>
      <pre><code>{`dart compile aot-snapshot bin/server.dart -o build/server.aot

# Rodar
dartaotruntime build/server.aot

# Tamanho típico: ~2-5 MB (vs ~8-10 MB do exe)`}</code></pre>

      <h2>dart compile kernel: bytecode multiplataforma</h2>
      <p>
        Gera um arquivo <code>.dill</code> com bytecode intermediário (formato Kernel), independente de plataforma. Ainda precisa da Dart VM para rodar, mas o parsing já está pronto. Pouco usado em produção; útil para integração com pipelines.
      </p>
      <pre><code>{`dart compile kernel bin/app.dart -o build/app.dill
dart build/app.dill`}</code></pre>

      <h2>Tabela comparativa</h2>
      <table>
        <thead><tr><th>Comando</th><th>Gera</th><th>Precisa de runtime?</th><th>Quando usar</th></tr></thead>
        <tbody>
          <tr><td><code>dart run</code></td><td>Nada (executa)</td><td>SDK</td><td>Desenvolvimento</td></tr>
          <tr><td><code>compile exe</code></td><td>Binário nativo</td><td>Não</td><td>CLIs distribuídas</td></tr>
          <tr><td><code>compile aot-snapshot</code></td><td>.aot</td><td>dartaotruntime</td><td>Servidores</td></tr>
          <tr><td><code>compile kernel</code></td><td>.dill</td><td>Dart VM</td><td>Caching, CI</td></tr>
          <tr><td><code>compile js</code></td><td>.js</td><td>Navegador</td><td>Web</td></tr>
        </tbody>
      </table>

      <h2>A pasta .dart_tool/</h2>
      <p>
        Após o primeiro <code>dart pub get</code> ou <code>dart run</code>, o Dart cria uma pasta oculta <code>.dart_tool/</code> na raiz. Ela contém:
      </p>
      <ul>
        <li><strong>package_config.json</strong>: mapeia cada <code>import 'package:foo/...'</code> para o caminho real no cache.</li>
        <li><strong>build/</strong>: artefatos intermediários (kernel, snapshots).</li>
        <li><strong>flutter_build/</strong>: caches do Flutter (em projetos Flutter).</li>
      </ul>
      <p>
        Essa pasta é gerada automaticamente — adicione ao <code>.gitignore</code>. Se algo der ruim, deletar e rodar <code>dart pub get</code> novamente costuma resolver.
      </p>
      <pre><code>{`# .gitignore típico
.dart_tool/
.packages
build/
.flutter-plugins
.flutter-plugins-dependencies
pubspec.lock      # commit em apps; ignore em pacotes`}</code></pre>

      <AlertBox type="warning" title="Problemas misteriosos?">
        Quando builds começam a falhar sem motivo aparente, a primeira tentativa é sempre: <code>dart pub get</code>; se persistir: deletar <code>.dart_tool/</code> e <code>build/</code>, depois <code>dart pub get</code> novamente. Funciona em 80% dos casos.
      </AlertBox>

      <h2>dart pub run vs dart run</h2>
      <p>
        Antes do Dart 2.10, executávamos pacotes com <code>dart pub run pacote</code>. Hoje, <code>dart run pacote</code> faz o mesmo (alias). Para scripts do próprio projeto, ambos funcionam:
      </p>
      <pre><code>{`# Ambos rodam a CLI do build_runner
dart pub run build_runner build
dart run build_runner build         # equivalente, mais novo

# Roda o entrypoint do projeto
dart run                            # bin/<nome>.dart`}</code></pre>

      <h2>Scripts e alias no pubspec</h2>
      <p>
        Para projetos com muitos comandos, você pode declarar atalhos em <code>pubspec.yaml</code>:
      </p>
      <pre><code>{`# pubspec.yaml
name: meu_app

executables:
  meu_app:               # cria comando "dart pub global run meu_app"
  servir: server         # alias "servir" -> bin/server.dart`}</code></pre>
      <p>
        Quando publicado, usuários podem instalar globalmente:
      </p>
      <pre><code>{`dart pub global activate meu_app
meu_app --help           # se o ~/.pub-cache/bin estiver no PATH`}</code></pre>

      <h2>Flutter: build apk, ipa, web</h2>
      <p>
        Em projetos Flutter, o ciclo de build se expande:
      </p>
      <pre><code>{`flutter build apk --release           # APK Android
flutter build appbundle --release     # AAB para Play Store
flutter build ios --release           # iOS (precisa Xcode)
flutter build web --release           # site estático
flutter build linux --release         # binário Linux
flutter build macos --release         # app Mac
flutter build windows --release       # exe Windows`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Distribuir <code>exe</code> entre OS diferentes</strong>: cada SO/arquitetura precisa do binário próprio.</li>
        <li><strong>Esquecer <code>.dart_tool/</code> no <code>.gitignore</code></strong>: polui o repo com megas de cache.</li>
        <li><strong>Achar que <code>dart run</code> = <code>dart compile exe</code> em performance</strong>: o JIT é mais lento no startup.</li>
        <li><strong>Não usar <code>--release</code> em apps Flutter</strong>: testes de performance em debug não refletem produção.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dart run</code> em dev; <code>dart compile exe</code> para distribuir CLI.</li>
        <li><code>compile js</code> para navegador, <code>aot-snapshot</code> para servidor.</li>
        <li><code>.dart_tool/</code> e <code>build/</code> são caches — ignore no Git.</li>
        <li>Em Flutter, <code>flutter build &lt;target&gt;</code> gera APK, IPA, web, desktop.</li>
        <li>Sempre teste em <code>--release</code> antes de medir performance.</li>
      </ul>
    </PageContainer>
  );
}
