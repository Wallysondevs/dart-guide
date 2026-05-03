import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CustomPainter() {
  return (
    <PageContainer
      title="Desenhando do zero com CustomPainter"
      subtitle="Quando os widgets prontos não bastam: pegue pincel e canvas e desenhe o que quiser."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        Imagine que você tem um caderno em branco e dois pincéis: um vermelho fino, um azul grosso. <code>CustomPainter</code> é exatamente isso para Flutter — uma folha de papel (<em>canvas</em>) e um pincel (<em>Paint</em>) que você usa para desenhar pixels diretamente, sem depender de widgets prontos. É a porta para gráficos personalizados: gráficos de barras, formas geométricas, assinaturas, jogos 2D simples.
      </p>

      <h2>CustomPaint: a moldura</h2>
      <p>
        O widget <code>CustomPaint</code> é a moldura. Ele recebe um <code>painter</code> (quem desenha) e um <code>size</code> (o tamanho da tela). O painter é uma classe que herda <code>CustomPainter</code> e implementa dois métodos: <code>paint</code> (desenhe!) e <code>shouldRepaint</code> (preciso redesenhar?).
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class TelaDesenho extends StatelessWidget {
  const TelaDesenho({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: CustomPaint(
          size: const Size(300, 300),
          painter: _RostoPainter(),
        ),
      ),
    );
  }
}`}</code></pre>

      <h2>O painter: paint() e shouldRepaint()</h2>
      <pre><code>{`class _RostoPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // Pincel para o rosto.
    final pincelRosto = Paint()
      ..color = Colors.amber
      ..style = PaintingStyle.fill;

    // Pincel para os olhos (preto, traço grosso).
    final pincelOlhos = Paint()
      ..color = Colors.black
      ..style = PaintingStyle.fill;

    // Pincel para o sorriso (linha curva).
    final pincelBoca = Paint()
      ..color = Colors.black
      ..style = PaintingStyle.stroke
      ..strokeWidth = 4
      ..strokeCap = StrokeCap.round;

    final centro = Offset(size.width / 2, size.height / 2);
    canvas.drawCircle(centro, size.width / 2, pincelRosto);

    // Olhos
    canvas.drawCircle(centro + const Offset(-40, -30), 10, pincelOlhos);
    canvas.drawCircle(centro + const Offset(40, -30), 10, pincelOlhos);

    // Sorriso
    final caminho = Path()
      ..moveTo(centro.dx - 50, centro.dy + 20)
      ..quadraticBezierTo(centro.dx, centro.dy + 80, centro.dx + 50, centro.dy + 20);
    canvas.drawPath(caminho, pincelBoca);
  }

  @override
  bool shouldRepaint(covariant _RostoPainter old) => false;
}`}</code></pre>

      <h2>Paint: configurando o pincel</h2>
      <p>
        O objeto <code>Paint</code> é o seu &quot;pincel digital&quot;. As propriedades mais usadas:
      </p>
      <ul>
        <li><code>color</code>: a cor.</li>
        <li><code>style</code>: <code>fill</code> (preenche) ou <code>stroke</code> (só contorna).</li>
        <li><code>strokeWidth</code>: a espessura do traço (em modo stroke).</li>
        <li><code>strokeCap</code>: a forma da ponta do traço (<code>butt</code>, <code>round</code>, <code>square</code>).</li>
        <li><code>shader</code>: gradientes, texturas.</li>
        <li><code>blendMode</code>: como combinar com pixels já desenhados.</li>
      </ul>

      <h2>Path: desenhando formas complexas</h2>
      <p>
        Para qualquer coisa além de retângulos e círculos, use <code>Path</code>. Ele é como um stylus: <code>moveTo</code> levanta a caneta, <code>lineTo</code> desce, <code>quadraticBezierTo</code> desenha curvas suaves.
      </p>
      <pre><code>{`final estrela = Path();
const cx = 100.0, cy = 100.0, r = 80.0;
for (int i = 0; i < 5; i++) {
  final angulo = -3.14159 / 2 + i * (2 * 3.14159 / 5);
  final x = cx + r * 2 * 0.4 * (i.isEven ? 1 : 0.5);
  // ... cálculo dos pontos da estrela
}
estrela.close(); // fecha de volta ao primeiro ponto
canvas.drawPath(estrela, Paint()..color = Colors.amber);`}</code></pre>

      <h2>Exemplo: gráfico de barras simples</h2>
      <pre><code>{`class GraficoBarras extends CustomPainter {
  final List<double> valores; // 0..1

  GraficoBarras(this.valores);

  @override
  void paint(Canvas canvas, Size size) {
    final larguraBarra = size.width / valores.length;
    final pincel = Paint()..color = Colors.indigo;

    for (int i = 0; i < valores.length; i++) {
      final altura = valores[i] * size.height;
      final retangulo = Rect.fromLTWH(
        i * larguraBarra + 4,
        size.height - altura,
        larguraBarra - 8,
        altura,
      );
      canvas.drawRRect(
        RRect.fromRectAndRadius(retangulo, const Radius.circular(6)),
        pincel,
      );
    }
  }

  @override
  bool shouldRepaint(covariant GraficoBarras old) =>
      !_listasIguais(old.valores, valores);
}

bool _listasIguais(List<double> a, List<double> b) {
  if (a.length != b.length) return false;
  for (int i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}`}</code></pre>

      <AlertBox type="info" title="shouldRepaint é crucial">
        Devolver <code>true</code> sempre faz o painter rodar a cada quadro — desperdício. Devolver <code>false</code> congela o desenho. Compare os dados: se mudaram, retorne <code>true</code>.
      </AlertBox>

      <h2>Performance: dicas importantes</h2>
      <ul>
        <li><strong>Embrulhe num <code>RepaintBoundary</code></strong>: isola o painter para não invalidar o resto da tela.</li>
        <li><strong>Não calcule listas dentro de <code>paint</code></strong>: pré-calcule no construtor.</li>
        <li><strong>Reuse <code>Paint</code></strong>: criar um novo a cada quadro pressiona o GC.</li>
        <li><strong>Use <code>save()</code>/<code>restore()</code></strong> ao aplicar transformações temporárias (rotate, scale).</li>
      </ul>
      <pre><code>{`canvas.save();
canvas.translate(size.width / 2, size.height / 2);
canvas.rotate(0.5);
canvas.drawRect(Rect.fromCenter(center: Offset.zero, width: 80, height: 80), pincel);
canvas.restore(); // volta ao estado anterior`}</code></pre>

      <h2>Combinando com animações</h2>
      <p>
        Passe um <code>Listenable</code> (geralmente um <code>AnimationController</code>) para o <code>CustomPaint</code> e ele se redesenha a cada frame, sem você chamar <code>setState</code>:
      </p>
      <pre><code>{`AnimatedBuilder(
  animation: _ctrl,
  builder: (_, __) => CustomPaint(
    size: const Size(200, 200),
    painter: _PulsoPainter(_ctrl.value), // 0..1
  ),
);`}</code></pre>

      <AlertBox type="warning" title="Pode parecer mágica, mas é CPU">
        Cada <code>paint()</code> roda na CPU, depois sobe para o raster (GPU). Se você desenhar centenas de paths complexos a 60fps, vai sentir queda de performance. Profile com DevTools.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong><code>shouldRepaint</code> sempre <code>true</code></strong>: queima CPU.</li>
        <li><strong>Sem <code>RepaintBoundary</code></strong>: invalida widgets vizinhos junto.</li>
        <li><strong>Esquecer <code>restore()</code></strong>: as transformações vazam.</li>
        <li><strong>Pintar <em>fora</em> do <code>size</code></strong>: pixels somem ou aparecem em lugares estranhos.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>CustomPaint</code> + <code>CustomPainter</code> dão acesso direto ao canvas.</li>
        <li><code>Paint</code> é o pincel; <code>Path</code>, a forma livre.</li>
        <li><code>shouldRepaint</code> evita redesenhos inúteis.</li>
        <li>Use <code>RepaintBoundary</code> para isolar performance.</li>
        <li>Combine com <code>AnimationController</code> para gráficos animados.</li>
      </ul>
    </PageContainer>
  );
}
