import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AnimationsBasico() {
  return (
    <PageContainer
      title="Animações básicas: AnimatedContainer e Tweens"
      subtitle="Como dar vida à sua interface sem virar maluco com matrizes de transformação."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Imagine que você está montando um teatro de marionetes. A marionete (o widget) precisa se mover suavemente do canto esquerdo para o direito — não pode &quot;teleportar&quot;. Animação é exatamente isso: interpolar valores (posição, cor, tamanho) entre dois estados ao longo do tempo. Flutter oferece dois caminhos: as animações <strong>implícitas</strong> (você muda a propriedade e o framework cuida do resto) e as <strong>explícitas</strong> (você controla o &quot;dimmer&quot; manualmente com um <code>AnimationController</code>).
      </p>

      <h2>O caminho fácil: AnimatedContainer</h2>
      <p>
        Um <code>AnimatedContainer</code> é um <code>Container</code> que &quot;sabe&quot; animar. Quando você muda qualquer propriedade dele dentro de um <code>setState</code>, ele desliza suavemente do valor antigo para o novo, durante a <code>duration</code> que você definiu. Não há controlador, não há ticker — é a forma mais barata de impressionar.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class CaixaAnimada extends StatefulWidget {
  const CaixaAnimada({super.key});
  @override
  State<CaixaAnimada> createState() => _CaixaAnimadaState();
}

class _CaixaAnimadaState extends State<CaixaAnimada> {
  bool _grande = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      // Toque para alternar entre dois tamanhos.
      onTap: () => setState(() => _grande = !_grande),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 400),
        curve: Curves.easeInOut, // suaviza o início e o fim
        width: _grande ? 240 : 100,
        height: _grande ? 240 : 100,
        decoration: BoxDecoration(
          color: _grande ? Colors.indigo : Colors.amber,
          borderRadius: BorderRadius.circular(_grande ? 120 : 12),
        ),
      ),
    );
  }
}`}</code></pre>
      <p>
        Note as três peças mágicas: <code>duration</code> (quanto tempo a animação dura), <code>curve</code> (a &quot;forma&quot; da aceleração — linear, ease, bounce) e a propriedade que muda. Existem irmãos do <code>AnimatedContainer</code>: <code>AnimatedOpacity</code>, <code>AnimatedAlign</code>, <code>AnimatedPositioned</code>, <code>AnimatedDefaultTextStyle</code>. Todos seguem a mesma receita.
      </p>

      <AlertBox type="tip" title="Quando usar implícito?">
        Sempre que possível! É menos código, sem risco de esquecer de chamar <code>dispose()</code>. Use explícito só quando precisar de controle fino (sincronizar várias animações, repetir, reverter no meio).
      </AlertBox>

      <h2>O caminho explícito: AnimationController</h2>
      <p>
        Um <code>AnimationController</code> é tipo um cronômetro que vai de <code>0.0</code> até <code>1.0</code> (por padrão), emitindo um valor novo a cada quadro (60 a 120 vezes por segundo). Para que ele bata em sincronia com a tela, ele precisa de um <strong>ticker</strong> — um relógio do Flutter. É por isso que o <code>State</code> deve usar o <code>SingleTickerProviderStateMixin</code>, que serve como &quot;marcapasso&quot;.
      </p>
      <pre><code>{`class FadeIn extends StatefulWidget {
  const FadeIn({super.key, required this.child});
  final Widget child;
  @override
  State<FadeIn> createState() => _FadeInState();
}

class _FadeInState extends State<FadeIn>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl = AnimationController(
    vsync: this, // usa este State como ticker
    duration: const Duration(milliseconds: 600),
  )..forward(); // dispara assim que criado

  // Tween mapeia 0.0..1.0 do controller para o intervalo desejado.
  late final Animation<double> _opacidade =
      CurvedAnimation(parent: _ctrl, curve: Curves.easeOut);

  @override
  void dispose() {
    _ctrl.dispose(); // OBRIGATÓRIO: libera o ticker
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(opacity: _opacidade, child: widget.child);
  }
}`}</code></pre>

      <h2>Tween: traduzindo 0..1 em valores reais</h2>
      <p>
        Um <code>Tween</code> (de &quot;between&quot;) é uma régua de conversão. O controller só fala em <code>0.0..1.0</code>; se você quer animar uma cor de azul para vermelho, ou um <code>Offset</code> de <code>(-1, 0)</code> até <code>(0, 0)</code>, é o Tween que traduz.
      </p>
      <pre><code>{`final desliza = Tween<Offset>(
  begin: const Offset(-1, 0), // fora da tela à esquerda
  end: Offset.zero,
).animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOut));

// Uso:
SlideTransition(position: desliza, child: const Text('Olá!'));`}</code></pre>

      <h2>AnimatedBuilder: para casos sob medida</h2>
      <p>
        Quando nenhum widget pronto serve, use <code>AnimatedBuilder</code>. Ele reconstrói só a parte animada a cada quadro — o resto da árvore fica intacto, o que é ótimo para performance.
      </p>
      <pre><code>{`AnimatedBuilder(
  animation: _ctrl,
  builder: (context, child) {
    return Transform.rotate(
      angle: _ctrl.value * 6.28, // 0 a 2π = uma volta
      child: child,
    );
  },
  child: const FlutterLogo(size: 120), // não reconstrói
);`}</code></pre>

      <AlertBox type="warning" title="Sempre dispose!">
        Esquecer <code>_ctrl.dispose()</code> vaza memória e mantém o ticker rodando para sempre. O analyzer do Flutter avisa, mas é fácil ignorar.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Sem <code>vsync</code></strong>: esqueceu o mixin e o controller não compila.</li>
        <li><strong>Animar sem <code>setState</code> no implícito</strong>: a propriedade muda mas o build não roda, então nada acontece.</li>
        <li><strong>Curve errada</strong>: usar <code>Curves.bounceIn</code> em fade fica esquisito; <code>easeInOut</code> é o &quot;feijão com arroz&quot;.</li>
        <li><strong>AnimationController em <code>StatelessWidget</code></strong>: impossível, precisa de State para o dispose.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Implícitas (<code>AnimatedContainer</code>, <code>AnimatedOpacity</code>) cobrem 80% dos casos.</li>
        <li>Explícitas usam <code>AnimationController</code> + <code>Tween</code> + <code>vsync</code>.</li>
        <li><code>CurvedAnimation</code> aplica curvas (ease, bounce) em qualquer Animation.</li>
        <li><code>AnimatedBuilder</code> reconstrói só o necessário — bom para performance.</li>
        <li>Sempre chame <code>dispose()</code> no controller.</li>
      </ul>
    </PageContainer>
  );
}
