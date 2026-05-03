import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PerformanceFlutter() {
  return (
    <PageContainer
      title="Performance no Flutter: dicas práticas"
      subtitle="Pequenos ajustes que separam um app fluido de um app que &quot;trava&quot; no scroll."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        Flutter renderiza a 60fps (ou 120fps em telas modernas). Isso significa que cada quadro tem cerca de 16ms (ou 8ms) para ser construído, pintado e enviado para a tela. Se você passar desse tempo, o usuário sente como &quot;jank&quot;: aquele tranco no scroll que parece que o celular está cansado. Boa notícia: na maioria dos casos, o problema não é o framework — é como você está usando. Vamos ver as receitas que separam apps suaves dos que travam.
      </p>

      <h2>1. <code>const</code> em todo lugar possível</h2>
      <p>
        Quando um widget é <code>const</code>, o Flutter sabe que ele <strong>nunca vai mudar</strong> — então pula o build, pula a comparação, reaproveita instâncias. Isso é literalmente código mais rápido com mais segurança. Use o lint <code>prefer_const_constructors</code> para o IDE te lembrar.
      </p>
      <pre><code>{`// Ruim: cria um Padding novo a cada build
Widget build(BuildContext context) {
  return Padding(
    padding: EdgeInsets.all(16),
    child: Text('Olá'),
  );
}

// Bom: tudo const, zero alocação a cada rebuild
Widget build(BuildContext context) {
  return const Padding(
    padding: EdgeInsets.all(16),
    child: Text('Olá'),
  );
}`}</code></pre>

      <h2>2. <code>ListView.builder</code> em vez de <code>ListView</code></h2>
      <p>
        <code>ListView(children: [...])</code> constrói <strong>todos</strong> os filhos de uma vez, mesmo os que estão fora da tela. Para 500 itens, é desastre. <code>ListView.builder</code> só constrói o que está visível, recriando conforme você rola — &quot;virtualização&quot;.
      </p>
      <pre><code>{`// 1.000 itens? só constrói os ~10 visíveis.
ListView.builder(
  itemCount: 1000,
  itemBuilder: (_, i) => ListTile(title: Text('Item \$i')),
);`}</code></pre>

      <h2>3. <code>RepaintBoundary</code>: isolando repinturas</h2>
      <p>
        Quando um widget pequeno se anima (um spinner, uma barra de progresso), por padrão ele invalida toda a área que o contém — Flutter precisa repintar tudo. Embrulhe no <code>RepaintBoundary</code> e o framework cria uma camada separada: só aquele bloco repinta.
      </p>
      <pre><code>{`Column(
  children: [
    const TextoEstavel(),
    RepaintBoundary(child: SpinnerAnimado()),
    const Rodape(),
  ],
);`}</code></pre>
      <p>
        Use também ao redor de <code>CustomPaint</code>, animações Lottie, vídeos. O DevTools tem um modo &quot;Highlight repaints&quot; que pisca em verde toda área que repinta — ótimo para detectar excesso.
      </p>

      <h2>4. Evite trabalho pesado em <code>build</code></h2>
      <p>
        O método <code>build</code> roda dezenas de vezes por segundo em widgets ativos. Não faça lá: parsing de JSON, query SQL, criação de listas grandes. Faça isso uma vez no <code>initState</code> e guarde no estado.
      </p>
      <pre><code>{`// Ruim: ordena uma lista grande a cada build
@override
Widget build(BuildContext context) {
  final ordenados = [...widget.itens]..sort();  // 16ms? Tchau, fps.
  return ListView(children: [for (final i in ordenados) Text(i)]);
}

// Bom: ordena uma vez
late final List<String> _ordenados = [...widget.itens]..sort();`}</code></pre>

      <AlertBox type="info" title="Constantes salvam vidas">
        <code>const</code> não é só estética — instâncias <code>const</code> são canonicalizadas, ou seja, todas as iguais compartilham a mesma referência em memória. Comparações ficam <em>O(1)</em>.
      </AlertBox>

      <h2>5. DevTools: o microscópio do Flutter</h2>
      <p>
        O DevTools é a sua ferramenta diagnóstica. Abra com <code>flutter pub global activate devtools</code> e depois <code>flutter run</code> + tecla <code>p</code> (ou pelo VSCode/Android Studio). Ele oferece:
      </p>
      <ul>
        <li><strong>Performance overlay</strong>: dois gráficos no topo (UI thread e raster thread). Vermelho = passou de 16ms.</li>
        <li><strong>Frame profiler</strong>: dissecar quais widgets demoraram em qual quadro.</li>
        <li><strong>Memory profiler</strong>: caçar vazamentos.</li>
        <li><strong>Widget inspector</strong>: ver a árvore renderizada.</li>
      </ul>
      <pre><code>{`flutter run --profile  // build otimizado, com DevTools habilitado
flutter run --release  // sem DevTools, performance final`}</code></pre>

      <h2>6. Shader compilation jank</h2>
      <p>
        Flutter compila <em>shaders</em> Skia na primeira vez que cada um é usado, o que causa um pequeno tranco em animações iniciais. Solução: pré-compile com <code>--cache-sksl</code>.
      </p>
      <pre><code>{`# Em modo profile, faça as animações principais.
flutter run --profile --cache-sksl
# Salve o cache:
flutter screenshot --type=skia --observatory-uri=...
# Use no build:
flutter build apk --bundle-sksl-path flutter_01.sksl.json`}</code></pre>
      <p>
        Em Flutter recente (3.10+), o Impeller (novo motor gráfico, padrão no iOS) elimina esse problema completamente. Verifique seu canal.
      </p>

      <h2>7. Imagens: o vilão silencioso</h2>
      <ul>
        <li>Use <code>cached_network_image</code> em vez de <code>Image.network</code> para cachear no disco.</li>
        <li>Especifique <code>cacheWidth</code>/<code>cacheHeight</code> em <code>Image.asset</code> grandes — evita decodificar uma imagem 4K para mostrar 64x64.</li>
        <li>Use formato moderno (WebP, AVIF) sempre que possível.</li>
      </ul>
      <pre><code>{`Image.asset(
  'assets/banner.png',
  cacheWidth: 600, // descomprime só nesse tamanho
  fit: BoxFit.cover,
);`}</code></pre>

      <h2>8. setState mira pequeno</h2>
      <p>
        Quanto maior o widget que chama <code>setState</code>, mais subárvore reconstrói. Quebre em widgets menores e chame <code>setState</code> só onde realmente precisa.
      </p>
      <pre><code>{`// Ruim: setState num widget gigante
class TelaPesada extends StatefulWidget {/* ... */}

// Bom: extraia o que muda
class _ContadorPequeno extends StatefulWidget {/* só este reconstroi */}`}</code></pre>

      <AlertBox type="warning" title="Mediu antes de otimizar?">
        Otimização sem profilling é chute. Sempre rode <code>flutter run --profile</code> e meça os frames antes de aplicar &quot;truques&quot;. Premature optimization vira código complicado sem ganho.
      </AlertBox>

      <h2>9. Raster timeline</h2>
      <p>
        Existem duas threads em Flutter: <strong>UI</strong> (Dart, build, layout) e <strong>Raster</strong> (Skia, GPU). Se a UI demora, é problema de Dart. Se a raster demora, é desenho complexo (sombras, blur, listas grandes sem RepaintBoundary). O DevTools mostra os dois separados.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>const</code></strong>: rebuilds desnecessários por toda parte.</li>
        <li><strong>Animar widget grande sem <code>RepaintBoundary</code></strong>: tela inteira repinta.</li>
        <li><strong><code>Opacity</code> em vídeo/imagem grande</strong>: usa offscreen layer caro. Prefira <code>FadeTransition</code> em widget pequeno.</li>
        <li><strong>Profilling em modo debug</strong>: números mentem (50% mais lento). Use <code>--profile</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Use <code>const</code> sempre que puder.</li>
        <li><code>ListView.builder</code> para listas longas.</li>
        <li><code>RepaintBoundary</code> isola repinturas locais.</li>
        <li>Trabalho pesado vai para <code>initState</code>, não para <code>build</code>.</li>
        <li>Meça com DevTools no modo <code>--profile</code> antes de otimizar.</li>
      </ul>
    </PageContainer>
  );
}
