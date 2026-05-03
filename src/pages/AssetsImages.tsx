import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AssetsImages() {
  return (
    <PageContainer
      title="Imagens e assets em Flutter"
      subtitle="Como declarar arquivos no pubspec.yaml, exibir imagens locais e da rede, e otimizar com placeholder e cache."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine montar uma exposição de fotos. Você precisa primeiro <em>cadastrar</em> cada quadro no inventário do museu (senão ninguém sabe que ele existe), depois pendurá-lo na sala (escolhendo onde, em que tamanho e com qual moldura). Em Flutter, esse "inventário" é o <strong>pubspec.yaml</strong> e a "moldura" é o widget <code>Image</code>. Sem cadastrar a imagem no pubspec, ela não aparece — Flutter não &quot;encontra&quot; arquivos automaticamente para garantir que o app só leve o que realmente usa.
      </p>

      <h2>Declarando assets no <code>pubspec.yaml</code></h2>
      <p>
        <strong>Asset</strong> é qualquer arquivo estático que vai junto com o app: imagens, JSON, fontes, vídeos. Você cria uma pasta (convenção: <code>assets/images/</code>) e declara no pubspec. <strong>Atenção: a indentação de YAML é crítica</strong> — tem que ser espaço, não tab.
      </p>
      <pre><code>{`# pubspec.yaml
name: meu_app
description: App de exemplo

flutter:
  uses-material-design: true
  assets:
    - assets/images/logo.png
    - assets/images/avatar.png
    - assets/data/cidades.json
    # OU declare a pasta inteira (pega TODOS os arquivos diretos):
    - assets/images/`}</code></pre>
      <p>
        Depois de salvar, rode <code>flutter pub get</code> (ou apenas hot restart na maioria das IDEs) para o Flutter reindexar os assets.
      </p>

      <AlertBox type="info" title="Pasta vs arquivo individual">
        Declarar a pasta (<code>assets/images/</code> com a barra final) inclui só os arquivos diretos — não desce em subpastas. Se você tem subpastas, declare cada uma.
      </AlertBox>

      <h2>Image.asset: imagem local</h2>
      <p>
        <code>Image.asset('caminho')</code> exibe uma imagem que está empacotada no app. O caminho começa pela raiz do projeto.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class TelaLogo extends StatelessWidget {
  const TelaLogo({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Image.asset(
          'assets/images/logo.png',
          width: 200,
          height: 200,
          // Como redimensionar quando o tamanho não bate:
          fit: BoxFit.contain,
        ),
      ),
    );
  }
}`}</code></pre>

      <h2>Image.network: imagem da internet</h2>
      <p>
        <code>Image.network</code> baixa de uma URL e mostra. Simples para protótipo, mas <strong>não tem cache em disco</strong> por padrão — toda vez que a tela é recriada, baixa de novo. Para produção, use o pacote <code>cached_network_image</code>.
      </p>
      <pre><code>{`Image.network(
  'https://picsum.photos/300/200',
  width: 300,
  height: 200,
  fit: BoxFit.cover,
  // Loader enquanto baixa:
  loadingBuilder: (context, child, progress) {
    if (progress == null) return child;
    return const Center(child: CircularProgressIndicator());
  },
  // Tela de erro se falhar:
  errorBuilder: (context, error, stack) => const Icon(
    Icons.broken_image,
    size: 60,
  ),
)`}</code></pre>

      <h2>BoxFit: como a imagem se encaixa</h2>
      <p>
        Quando o tamanho que você define não bate com o tamanho da imagem, <code>BoxFit</code> diz como ajustar. É como escolher cortar, esticar ou centralizar uma foto que não cabe na moldura.
      </p>
      <ul>
        <li><strong>BoxFit.cover</strong>: preenche todo o espaço, cortando o que sobra. Bom para banners.</li>
        <li><strong>BoxFit.contain</strong>: mostra a imagem inteira, deixando espaço se preciso.</li>
        <li><strong>BoxFit.fill</strong>: estica para preencher (distorce!).</li>
        <li><strong>BoxFit.fitWidth</strong>/<strong>fitHeight</strong>: ajusta um eixo, deixa o outro livre.</li>
        <li><strong>BoxFit.none</strong>: tamanho original.</li>
        <li><strong>BoxFit.scaleDown</strong>: igual <code>contain</code> mas só reduz, nunca amplia.</li>
      </ul>

      <h2>FadeInImage: placeholder com transição suave</h2>
      <p>
        Mostra uma imagem leve (placeholder) enquanto carrega a imagem real, e faz fade entre as duas. Usuário não vê &quot;flash&quot; de espaço vazio.
      </p>
      <pre><code>{`FadeInImage.assetNetwork(
  placeholder: 'assets/images/placeholder.png',
  image: 'https://picsum.photos/400',
  fit: BoxFit.cover,
  fadeInDuration: const Duration(milliseconds: 300),
)`}</code></pre>

      <h2>cached_network_image: o jeito profissional</h2>
      <p>
        Adicione <code>cached_network_image</code> ao pubspec — ele guarda imagens em disco entre sessões, oferece placeholder, error widget, controle de tamanho de cache e muito mais.
      </p>
      <pre><code>{`# pubspec.yaml
dependencies:
  cached_network_image: ^3.4.1`}</code></pre>
      <pre><code>{`import 'package:cached_network_image/cached_network_image.dart';

CachedNetworkImage(
  imageUrl: 'https://picsum.photos/400',
  width: 400,
  height: 200,
  fit: BoxFit.cover,
  placeholder: (context, url) => const Center(
    child: CircularProgressIndicator(),
  ),
  errorWidget: (context, url, error) => const Icon(Icons.error),
  // Cache em disco persiste entre execuções do app.
)`}</code></pre>

      <AlertBox type="warning" title="Imagens grandes consomem RAM">
        Uma foto de 4000×3000 px ocupa ~48 MB descomprimida em memória, mesmo que o JPEG no disco tenha 2 MB. Sempre passe <code>cacheWidth</code>/<code>cacheHeight</code> para Flutter decodificar em tamanho menor:
        <pre><code>{`Image.asset('assets/images/foto.jpg', cacheWidth: 600)`}</code></pre>
      </AlertBox>

      <h2>Resoluções múltiplas (1x, 2x, 3x)</h2>
      <p>
        Como há telas com pixel densities diferentes (Hi-DPI Retina vs LDPI), você pode entregar versões da mesma imagem em diferentes resoluções. Flutter escolhe a melhor automaticamente.
      </p>
      <pre><code>{`# Estrutura de pastas:
assets/images/logo.png        # 1x (base)
assets/images/2.0x/logo.png   # 2x (Retina)
assets/images/3.0x/logo.png   # 3x (iPhone Pro)

# pubspec.yaml — declare só o caminho 1x;
# Flutter encontra os outros sozinho.
flutter:
  assets:
    - assets/images/logo.png`}</code></pre>

      <h2>AssetImage como ImageProvider</h2>
      <p>
        Em alguns lugares (CircleAvatar, BoxDecoration.image, DecorationImage), você precisa de um <strong>ImageProvider</strong> em vez do widget Image. Use <code>AssetImage</code> ou <code>NetworkImage</code>.
      </p>
      <pre><code>{`CircleAvatar(
  radius: 32,
  backgroundImage: AssetImage('assets/images/avatar.png'),
)

Container(
  width: 200,
  height: 200,
  decoration: const BoxDecoration(
    image: DecorationImage(
      image: NetworkImage('https://picsum.photos/200'),
      fit: BoxFit.cover,
    ),
    borderRadius: BorderRadius.all(Radius.circular(16)),
  ),
)`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>"Unable to load asset"</strong>: esqueceu de declarar no pubspec.yaml ou indentou errado.</li>
        <li><strong>Mudou o pubspec e nada acontece</strong>: faça hot restart, não reload.</li>
        <li><strong>Image.network sem errorBuilder</strong>: app quebra ao perder internet. Sempre trate o erro.</li>
        <li><strong>Imagem enorme em ListView</strong>: trava o scroll. Use <code>cacheWidth</code>/<code>cacheHeight</code>.</li>
        <li><strong>Esquecer <code>fit: BoxFit.cover</code></strong> em banner: imagem fica torta ou com espaços.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Assets devem ser declarados em <code>pubspec.yaml</code> com indentação YAML correta.</li>
        <li><code>Image.asset</code> para arquivos locais; <code>Image.network</code> para URLs.</li>
        <li><code>BoxFit</code> controla como a imagem se ajusta ao espaço.</li>
        <li><code>cached_network_image</code> dá cache em disco para imagens da rede.</li>
        <li>Use <code>cacheWidth</code>/<code>cacheHeight</code> para evitar gastar RAM.</li>
        <li>Subpastas <code>2.0x</code>, <code>3.0x</code> dão resoluções múltiplas automáticas.</li>
      </ul>
    </PageContainer>
  );
}
