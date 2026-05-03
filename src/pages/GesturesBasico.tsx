import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GesturesBasico() {
  return (
    <PageContainer
      title="Detectando gestos: GestureDetector e InkWell"
      subtitle="Como capturar toques, arrastes, longos pressionamentos e dar feedback visual ao usuário."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine um vendedor numa loja: quando você toca no produto, ele responde &quot;quer ver de perto?&quot;; quando você segura por mais tempo, ele oferece &quot;quer mais detalhes?&quot;; quando você arrasta para a esteira, ele finaliza a venda. Em Flutter, esse vendedor é o <strong>GestureDetector</strong> — um widget invisível que envolve qualquer outro e <em>escuta</em> o que o dedo do usuário faz: toques, duplo-toque, arrastes, &quot;pinças&quot; (zoom), pressões longas. Junto dele temos o <strong>InkWell</strong>, que faz quase a mesma coisa <em>mas</em> mostra o efeito de tinta espalhando (ripple) típico do Material Design.
      </p>

      <h2>GestureDetector: o ouvinte universal</h2>
      <p>
        <code>GestureDetector</code> não desenha nada — ele só detecta gestos no espaço ocupado pelo seu filho. Você passa callbacks como <code>onTap</code>, <code>onDoubleTap</code>, <code>onLongPress</code>, e o widget chama eles quando o usuário fizer o gesto correspondente.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class CartaoTocavel extends StatelessWidget {
  const CartaoTocavel({super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      // Toque rápido único
      onTap: () => debugPrint('Toque simples'),
      // Dois toques rápidos
      onDoubleTap: () => debugPrint('Toque duplo'),
      // Pressionar e segurar (~500ms)
      onLongPress: () => debugPrint('Pressão longa'),
      child: Container(
        padding: const EdgeInsets.all(24),
        color: Colors.indigo.shade50,
        child: const Text('Toque, toque duplo ou segure aqui'),
      ),
    );
  }
}`}</code></pre>

      <h2>Detectando arrastes: pan, drag e scale</h2>
      <p>
        Para ações contínuas (mover um objeto, desenhar, dar zoom), use as variantes <code>onPan*</code> e <code>onScale*</code>. Cada callback recebe um objeto com a posição atual e o quanto o dedo se moveu.
      </p>
      <pre><code>{`class QuadradoArrastavel extends StatefulWidget {
  const QuadradoArrastavel({super.key});

  @override
  State<QuadradoArrastavel> createState() => _QuadradoArrastavelState();
}

class _QuadradoArrastavelState extends State<QuadradoArrastavel> {
  Offset _pos = const Offset(50, 50);

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Positioned(
          left: _pos.dx,
          top: _pos.dy,
          child: GestureDetector(
            onPanUpdate: (details) {
              // delta = quanto o dedo se moveu desde o último frame.
              setState(() => _pos += details.delta);
            },
            child: Container(
              width: 80,
              height: 80,
              color: Colors.deepOrange,
            ),
          ),
        ),
      ],
    );
  }
}`}</code></pre>

      <AlertBox type="info" title="Pan, drag e scale">
        <strong>Pan</strong> = arrastar com 1 dedo em qualquer direção. <strong>Drag</strong> (horizontal/vertical) = arrastar em um eixo só. <strong>Scale</strong> = pinça com 2 dedos (zoom). Não combine os dois primeiros para o mesmo gesto, ou Flutter joga &quot;Incorrect GestureDetector arguments&quot;.
      </AlertBox>

      <h2>InkWell: o gesto com ripple Material</h2>
      <p>
        <code>InkWell</code> é praticamente o irmão visual do GestureDetector. A diferença é que ele <strong>desenha o efeito de tinta</strong> (ripple) que se espalha do ponto de toque — o feedback visual que usuários Android estão acostumados. Use sempre que estiver dentro de uma área Material.
      </p>
      <pre><code>{`Material(
  color: Colors.transparent,
  child: InkWell(
    onTap: () => debugPrint('Tap com ripple'),
    onLongPress: () => debugPrint('Long press'),
    borderRadius: BorderRadius.circular(12),
    child: Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: const [
          Icon(Icons.favorite, color: Colors.red),
          SizedBox(width: 12),
          Text('Curtir'),
        ],
      ),
    ),
  ),
)`}</code></pre>

      <AlertBox type="warning" title="InkWell precisa de Material acima">
        O ripple só aparece se houver um <code>Material</code> ancestral. Dentro de Scaffold/Card/AppBar isso já existe; se você criou um Container colorido, envolva-o em <code>Material(color: Colors.transparent, child: InkWell(...))</code>.
      </AlertBox>

      <h2>IgnorePointer e AbsorbPointer: bloqueando toques</h2>
      <p>
        Às vezes você quer <em>desativar</em> uma área para que o usuário não interaja. Há dois widgets para isso, com diferenças sutis mas importantes:
      </p>
      <ul>
        <li><strong>IgnorePointer</strong>: o filho fica &quot;invisível&quot; para o sistema de toques. Toque atravessa para o widget abaixo na pilha.</li>
        <li><strong>AbsorbPointer</strong>: o filho recebe o toque mas não responde — o evento &quot;morre&quot; ali. Nada abaixo recebe.</li>
      </ul>
      <pre><code>{`// Botão temporariamente desabilitado:
IgnorePointer(
  ignoring: _carregando, // true bloqueia toques
  child: Opacity(
    opacity: _carregando ? 0.4 : 1.0,
    child: FilledButton(
      onPressed: _enviar,
      child: const Text('Enviar'),
    ),
  ),
)

// Bloquear toques numa imagem mas permitir scroll do pai:
AbsorbPointer(
  child: Image.asset('assets/images/preview.png'),
)`}</code></pre>

      <h2>Hit-test: como Flutter decide quem recebeu o toque</h2>
      <p>
        Quando você encosta no telão, Flutter percorre a árvore de widgets perguntando: &quot;esse aqui está abaixo do dedo? aceita toques?&quot;. O primeiro widget mais próximo da raiz visual que disser sim recebe o evento. Por isso a ORDEM em <code>Stack</code> importa — quem está em cima ganha.
      </p>
      <pre><code>{`Stack(
  children: [
    GestureDetector(
      onTap: () => debugPrint('FUNDO'),
      child: Container(width: 200, height: 200, color: Colors.blue),
    ),
    GestureDetector(
      onTap: () => debugPrint('TOPO'), // este vence!
      child: Container(width: 100, height: 100, color: Colors.red),
    ),
  ],
)`}</code></pre>

      <h2>Multi-touch e gestos compostos</h2>
      <p>
        Para gestos com mais de um dedo (zoom, rotação), use <code>onScaleStart</code>/<code>onScaleUpdate</code>. O <code>ScaleUpdateDetails</code> traz <code>scale</code> (fator de zoom), <code>rotation</code> (radianos) e <code>focalPoint</code>.
      </p>
      <pre><code>{`class ImagemComZoom extends StatefulWidget {
  const ImagemComZoom({super.key});

  @override
  State<ImagemComZoom> createState() => _ImagemComZoomState();
}

class _ImagemComZoomState extends State<ImagemComZoom> {
  double _escala = 1.0;
  double _escalaAnterior = 1.0;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onScaleStart: (_) => _escalaAnterior = _escala,
      onScaleUpdate: (details) {
        setState(() {
          _escala = (_escalaAnterior * details.scale).clamp(0.5, 4.0);
        });
      },
      child: Center(
        child: Transform.scale(
          scale: _escala,
          child: const FlutterLogo(size: 200),
        ),
      ),
    );
  }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>InkWell sem ripple</strong>: faltou Material como ancestral.</li>
        <li><strong>onTap em Container vazio sem cor</strong>: a área transparente não é &quot;hit-testável&quot; por padrão. Use <code>behavior: HitTestBehavior.opaque</code> no GestureDetector.</li>
        <li><strong>Combinar onPan e onHorizontalDrag</strong>: Flutter reclama com &quot;GestureDetector with conflicting recognizers&quot;.</li>
        <li><strong>Esquecer setState em onPanUpdate</strong>: posição muda na variável mas não na tela.</li>
        <li><strong>IgnorePointer x AbsorbPointer trocados</strong>: ignore deixa o toque passar adiante; absorb engole.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>GestureDetector</code> escuta toques sem desenhar nada.</li>
        <li><code>InkWell</code> adiciona o ripple Material — exige um <code>Material</code> ancestral.</li>
        <li>Use <code>onPanUpdate</code> para arrastes; <code>onScaleUpdate</code> para zoom de 2 dedos.</li>
        <li><code>IgnorePointer</code> deixa toques atravessarem; <code>AbsorbPointer</code> os engole.</li>
        <li>No <code>Stack</code>, quem está visualmente em cima recebe o toque.</li>
        <li>Para áreas vazias responderem a toque, use <code>behavior: HitTestBehavior.opaque</code>.</li>
      </ul>
    </PageContainer>
  );
}
