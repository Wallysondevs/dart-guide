import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FlutterWeb() {
  return (
    <PageContainer
      title="Flutter Web: o mesmo código no navegador"
      subtitle="Como rodar o mesmo app Flutter que você fez para Android e iOS dentro de uma aba do navegador, com um único comando."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine que você desenhou um cartaz à mão, e amanhã alguém te diz: &quot;agora cole esse mesmo cartaz no metrô, no aeroporto e numa parede de outdoor&quot;. Você não vai redesenhar tudo três vezes — você quer o mesmo desenho em telas diferentes. É exatamente isso que o <strong>Flutter Web</strong> faz: pega o código que você escreveu para celular e renderiza no navegador, sem reescrever a lógica.
      </p>

      <h2>Habilitando e rodando no Chrome</h2>
      <p>
        Por padrão, todo projeto Flutter já vem pronto para web a partir da versão 3. Basta rodar:
      </p>
      <pre><code>{`# Lista os dispositivos disponíveis
flutter devices

# Roda o app no navegador Chrome
flutter run -d chrome

# Roda em qualquer navegador (servidor local na porta 8080)
flutter run -d web-server --web-port=8080`}</code></pre>
      <p>
        O comando inicia um servidor de desenvolvimento que faz <em>hot restart</em> (recarrega o app preservando a rota) sempre que você salva um arquivo Dart. Bem-vindo ao mesmo loop de desenvolvimento que você já conhece em mobile, agora no navegador.
      </p>

      <h2>Os dois renderers: HTML vs CanvasKit</h2>
      <p>
        O Flutter precisa transformar widgets em pixels visíveis. No navegador ele faz isso de duas formas. <strong>HTML renderer</strong>: usa elementos HTML, CSS e Canvas 2D nativos. É leve (bundle menor) e bom para sites simples. <strong>CanvasKit</strong>: baixa o motor Skia compilado para WebAssembly e desenha tudo num único <code>&lt;canvas&gt;</code>; o resultado é idêntico ao mobile, mas o download inicial é maior (~2MB).
      </p>
      <pre><code>{`# Forçar CanvasKit (padrão moderno)
flutter run -d chrome --web-renderer canvaskit

# Forçar HTML renderer (mais leve)
flutter run -d chrome --web-renderer html

# Auto: HTML em mobile, CanvasKit em desktop
flutter build web --web-renderer auto`}</code></pre>

      <AlertBox type="info" title="Qual escolher?">
        Para apps tipo dashboard, painel administrativo ou ferramenta interna: <strong>CanvasKit</strong> (qualidade máxima). Para sites públicos com SEO importante: prefira não usar Flutter Web — use Dart-web puro ou outra stack.
      </AlertBox>

      <h2>Um app Flutter Web mínimo (Material 3)</h2>
      <pre><code>{`import 'package:flutter/material.dart';

void main() => runApp(const MeuApp());

class MeuApp extends StatelessWidget {
  const MeuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Dashboard Web',
      theme: ThemeData(
        colorSchemeSeed: Colors.indigo,
        useMaterial3: true,
      ),
      home: const Painel(),
    );
  }
}

class Painel extends StatelessWidget {
  const Painel({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Métricas')),
      body: const Center(
        child: Card(
          child: Padding(
            padding: EdgeInsets.all(24),
            child: Text('Bem-vindo ao painel!'),
          ),
        ),
      ),
    );
  }
}`}</code></pre>
      <p>
        Note: nada nesse código é &quot;web-específico&quot;. O mesmo arquivo roda em Android, iOS, macOS, Windows e Linux. Esse é o superpoder do Flutter — uma única base de código.
      </p>

      <h2>Limitações reais (e quando NÃO usar Flutter Web)</h2>
      <ul>
        <li><strong>SEO ruim</strong>: como tudo é desenhado em canvas, robôs do Google veem uma tela em branco. Não use para blogs, e-commerce ou landing pages que dependem de busca orgânica.</li>
        <li><strong>Tamanho do bundle</strong>: 1.5–3MB no primeiro carregamento (CanvasKit). Em conexão 3G isso dói.</li>
        <li><strong>Acessibilidade incompleta</strong>: leitores de tela funcionam, mas com limitações.</li>
        <li><strong>Texto/scroll diferentes</strong>: copy-paste e scroll inercial não se comportam 100% como num site nativo.</li>
        <li><strong>Plugins</strong>: nem todos os pacotes pub.dev funcionam no web (camera, bluetooth nativo, etc.).</li>
      </ul>

      <AlertBox type="warning" title="Caso de uso ideal">
        Flutter Web brilha em <strong>PWAs (Progressive Web Apps)</strong>: dashboards internos, ferramentas de equipe, apps embarcados em iframe. Não tente substituir um site institucional por Flutter Web.
      </AlertBox>

      <h2>Build de produção e deploy</h2>
      <pre><code>{`# Compila o app otimizado para o diretório build/web
flutter build web --release

# Estrutura gerada:
# build/web/
#   index.html
#   main.dart.js
#   flutter_service_worker.js
#   assets/
#   icons/

# Servir localmente para teste:
cd build/web && python3 -m http.server 8000`}</code></pre>
      <p>
        Como a saída é HTML+JS estático, você pode hospedar em <strong>qualquer</strong> lugar: Firebase Hosting, Netlify, Vercel, GitHub Pages, S3+CloudFront, ou um nginx num droplet. Não precisa de Node, Python ou banco — é só servir os arquivos.
      </p>
      <pre><code>{`# Deploy no Firebase Hosting
firebase init hosting
# escolha build/web como diretório público
firebase deploy

# Deploy no GitHub Pages (com base href)
flutter build web --release --base-href "/meu-repo/"`}</code></pre>

      <h2>PWA: app instalável</h2>
      <p>
        Flutter Web já gera um <code>manifest.json</code> e um <em>service worker</em> (script que roda em background no navegador) por padrão. Isso significa que o usuário pode clicar em &quot;Instalar app&quot; no Chrome e ter um ícone no desktop como se fosse um aplicativo nativo, com cache offline.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer de habilitar o web</strong>: rode <code>flutter config --enable-web</code> em projetos antigos.</li>
        <li><strong>Usar pacotes só-mobile</strong>: verifique a aba &quot;Platforms&quot; em pub.dev antes de adicionar.</li>
        <li><strong>Esperar SEO</strong>: não funciona. Para SEO, gere uma landing estática separada.</li>
        <li><strong>Deploy sem <code>--base-href</code></strong> em subpasta — o app abre branco.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>flutter run -d chrome</code> roda o mesmo código no navegador.</li>
        <li>Dois renderers: HTML (leve) e CanvasKit (fiel ao mobile).</li>
        <li>Limitações: SEO, tamanho do bundle, alguns plugins não funcionam.</li>
        <li>Caso de uso ideal: PWAs, dashboards e ferramentas internas.</li>
        <li>O build é estático — hospede em qualquer servidor de arquivos.</li>
      </ul>
    </PageContainer>
  );
}
