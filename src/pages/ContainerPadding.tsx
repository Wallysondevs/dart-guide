import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ContainerPadding() {
  return (
    <PageContainer
      title="Container, Padding, SizedBox e BoxDecoration"
      subtitle="Os widgets básicos de espaço, fundo e decoração — o canivete suíço do Flutter."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine uma moldura de quadro: ela tem espaço por dentro (entre o vidro e a foto), espaço por fora (entre a moldura e a parede), pode ter cor, borda, sombra. Em Flutter, esses papéis são separados em widgets pequenos: <code>Padding</code> dá espaço interno, <code>SizedBox</code> reserva espaço fixo entre elementos, <code>Container</code> agrupa decoração + tamanho + filho num só pacote, e <code>BoxDecoration</code> descreve aparência (cor, borda, gradiente, sombra). Aprender esses quatro torna você capaz de construir qualquer card, badge ou botão personalizado.
      </p>

      <h2>Padding: respiro interno</h2>
      <p>
        <code>Padding</code> adiciona espaço entre as bordas do widget e seu filho. É o equivalente ao <code>padding</code> do CSS. O parâmetro obrigatório é <code>padding</code>, do tipo <code>EdgeInsets</code>.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

const exemplo = Padding(
  // 16 pixels em todos os lados.
  padding: EdgeInsets.all(16),
  child: Text('Texto com respiro'),
);

// Padding diferente em cada eixo:
const ex2 = Padding(
  padding: EdgeInsets.symmetric(vertical: 8, horizontal: 24),
  child: Text('Mais largo que alto'),
);

// Padding seletivo:
const ex3 = Padding(
  padding: EdgeInsets.only(left: 32, top: 4),
  child: Text('Só esquerda e topo'),
);`}</code></pre>

      <h2>SizedBox: caixa de tamanho fixo</h2>
      <p>
        <code>SizedBox</code> é uma caixa invisível com tamanho definido. Os dois usos mais comuns: criar <strong>espaço entre widgets</strong> em uma Column/Row e <strong>forçar tamanho</strong> de um filho.
      </p>
      <pre><code>{`Column(
  children: const [
    Text('Título'),
    SizedBox(height: 12), // gap vertical de 12px
    Text('Subtítulo'),
    SizedBox(height: 24),
    Text('Conteúdo'),
  ],
)

// Forçar tamanho exato:
SizedBox(
  width: 200,
  height: 50,
  child: ElevatedButton(
    onPressed: () {},
    child: const Text('Botão de 200x50'),
  ),
)

// SizedBox.shrink() = caixa de zero por zero (substitui null no UI).
// SizedBox.expand() = ocupa tudo que conseguir.`}</code></pre>

      <AlertBox type="info" title="SizedBox vs Container">
        Use <code>SizedBox</code> quando só precisa de tamanho ou espaço. Use <code>Container</code> quando precisa de cor, borda ou decoração. SizedBox é mais leve e expressa intenção.
      </AlertBox>

      <h2>Container: o canivete suíço</h2>
      <p>
        <code>Container</code> é um widget de conveniência que combina <em>vários</em> outros: pintura, posicionamento, padding, margem, transformação e tamanho. Você pode passar nada, um, ou todos os parâmetros — o que precisar.
      </p>
      <pre><code>{`Container(
  // Tamanho explícito (opcional)
  width: 200,
  height: 80,
  // Espaço externo (entre Container e vizinhos)
  margin: const EdgeInsets.all(8),
  // Espaço interno (entre borda e filho)
  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
  // Aparência (cor, borda, sombra…)
  decoration: BoxDecoration(
    color: Colors.indigo.shade50,
    borderRadius: BorderRadius.circular(12),
    border: Border.all(color: Colors.indigo, width: 2),
  ),
  alignment: Alignment.center,
  child: const Text('Eu sou um cartão'),
)`}</code></pre>

      <AlertBox type="warning" title="Container só com cor: erro comum">
        Você não pode passar <code>color</code> e <code>decoration</code> ao mesmo tempo (a cor já vai dentro do BoxDecoration). Se aparecer o erro &quot;Cannot provide both a color and a decoration&quot;, mova a cor para dentro do BoxDecoration.
      </AlertBox>

      <h2>BoxDecoration: pintura, borda, sombra</h2>
      <p>
        <code>BoxDecoration</code> é uma <em>descrição visual</em> que vai dentro do parâmetro <code>decoration</code> de Container (e também de DecoratedBox). Ela permite combinar:
      </p>
      <ul>
        <li><strong>color</strong> ou <strong>gradient</strong> de fundo;</li>
        <li><strong>borderRadius</strong> para cantos arredondados;</li>
        <li><strong>border</strong> para contorno;</li>
        <li><strong>boxShadow</strong> para sombras (lista, dá para empilhar);</li>
        <li><strong>image</strong> para imagem de fundo.</li>
      </ul>
      <pre><code>{`Container(
  height: 120,
  decoration: BoxDecoration(
    gradient: const LinearGradient(
      colors: [Colors.indigo, Colors.purple],
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
    ),
    borderRadius: BorderRadius.circular(20),
    boxShadow: [
      BoxShadow(
        color: Colors.black.withOpacity(0.2),
        blurRadius: 12,
        offset: const Offset(0, 4),
      ),
    ],
  ),
  alignment: Alignment.center,
  child: const Text(
    'Card com gradiente e sombra',
    style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
  ),
)`}</code></pre>

      <h2>EdgeInsets: cinco maneiras de medir</h2>
      <pre><code>{`EdgeInsets.all(16)
// 16px em todos os 4 lados.

EdgeInsets.symmetric(horizontal: 24, vertical: 8)
// 24 esquerda+direita, 8 topo+baixo.

EdgeInsets.only(left: 12, top: 8)
// só lados especificados; resto é zero.

EdgeInsets.fromLTRB(8, 16, 8, 24)
// left, top, right, bottom — em ordem.

EdgeInsetsDirectional.only(start: 16)
// "start" e "end" respeitam idiomas RTL (árabe, hebraico).`}</code></pre>

      <h2>Combinando tudo: um card de produto</h2>
      <pre><code>{`class CardProduto extends StatelessWidget {
  final String nome;
  final double preco;
  const CardProduto({super.key, required this.nome, required this.preco});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        children: [
          const Icon(Icons.shopping_bag, size: 40),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(nome, style: const TextStyle(fontSize: 16)),
                const SizedBox(height: 4),
                Text('R\\\$ \${preco.toStringAsFixed(2)}'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Container sem child para "espaço"</strong>: use <code>SizedBox</code>; é mais leve e claro.</li>
        <li><strong>Color + decoration juntos</strong>: erro de runtime. Coloque <code>color</code> dentro do BoxDecoration.</li>
        <li><strong>Borda sem clip</strong>: imagens ficam vazando do borderRadius. Envolva em <code>ClipRRect</code> ou use <code>Container.image</code> com <code>borderRadius</code>.</li>
        <li><strong>Padding x margin trocados</strong>: padding é interno (empurra filho); margin é externo (empurra Container dos vizinhos).</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Padding</code> dá espaço interno; <code>SizedBox</code> reserva tamanho fixo / gap.</li>
        <li><code>Container</code> agrupa tamanho, padding, margin e decoração.</li>
        <li><code>BoxDecoration</code> descreve cor, borda, sombra, gradiente, imagem.</li>
        <li><code>EdgeInsets</code> tem 5 construtores: all, symmetric, only, fromLTRB, directional.</li>
        <li>Cor não vai junto de decoration — fica dentro do BoxDecoration.</li>
      </ul>
    </PageContainer>
  );
}
