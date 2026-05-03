import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Slivers() {
  return (
    <PageContainer
      title="Slivers: scroll views customizados e poderosos"
      subtitle="Quando ListView e GridView não bastam, slivers entram em cena para coreografar a rolagem."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        Pense num teatro: o palco é a tela, e a cortina é o conteúdo que rola. Se você quer só uma cortina única que sobe e desce, <code>ListView</code> resolve. Mas e se quiser uma cortina que <em>encolhe e revela</em> uma faixa em cima, depois uma grade, depois uma lista, tudo numa rolagem só? Aí entra o conceito de <strong>sliver</strong>: uma &quot;fatia rolável&quot; que conhece sua geometria e coopera com vizinhas dentro de um <code>CustomScrollView</code>.
      </p>

      <h2>CustomScrollView: o palco</h2>
      <p>
        <code>CustomScrollView</code> recebe uma lista de slivers e os empilha verticalmente (ou horizontalmente). Cada sliver gerencia sua própria área e participa de uma rolagem unificada.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class TelaSliver extends StatelessWidget {
  const TelaSliver({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // 1. AppBar que colapsa
          const SliverAppBar(
            expandedHeight: 220,
            pinned: true, // fica no topo após colapsar
            flexibleSpace: FlexibleSpaceBar(
              title: Text('Galeria'),
              background: FlutterLogo(),
            ),
          ),

          // 2. Bloco fixo no meio
          const SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.all(16),
              child: Text('Destaques da semana',
                  style: TextStyle(fontSize: 20)),
            ),
          ),

          // 3. Grade com 6 itens
          SliverGrid(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
              mainAxisSpacing: 8,
              crossAxisSpacing: 8,
            ),
            delegate: SliverChildBuilderDelegate(
              (_, i) => Container(color: Colors.primaries[i % 18]),
              childCount: 6,
            ),
          ),

          // 4. Lista longa
          SliverList(
            delegate: SliverChildBuilderDelegate(
              (_, i) => ListTile(
                leading: CircleAvatar(child: Text('\${i + 1}')),
                title: Text('Item nº \${i + 1}'),
              ),
              childCount: 50,
            ),
          ),
        ],
      ),
    );
  }
}`}</code></pre>

      <h2>SliverAppBar: o cabeçalho que dança</h2>
      <p>
        É a estrela do show. Tem três modos:
      </p>
      <ul>
        <li><code>pinned: true</code>: a barra encolhida fica fixa no topo.</li>
        <li><code>floating: true</code>: ao rolar pra cima, a barra reaparece imediatamente.</li>
        <li><code>snap: true</code>: combinada com <code>floating</code>, a barra &quot;encaixa&quot; aberta ou fechada.</li>
      </ul>
      <pre><code>{`SliverAppBar(
  expandedHeight: 280,
  pinned: true,
  floating: false,
  snap: false,
  stretch: true, // estica quando overscroll
  flexibleSpace: FlexibleSpaceBar(
    title: const Text('Praia'),
    background: Image.network(
      'https://picsum.photos/seed/praia/600/400',
      fit: BoxFit.cover,
    ),
    stretchModes: const [StretchMode.zoomBackground],
  ),
);`}</code></pre>

      <AlertBox type="info" title="FlexibleSpaceBar é seu amigo">
        Ele cuida da animação de fade do título e do crossfade do background sem você escrever nada de animação manualmente.
      </AlertBox>

      <h2>SliverList vs SliverGrid</h2>
      <p>
        <code>SliverList</code> e <code>SliverGrid</code> são as versões &quot;sliverificadas&quot; de <code>ListView</code> e <code>GridView</code>. Recebem um <code>SliverChildBuilderDelegate</code>, que constrói itens sob demanda — só quem está visível ocupa memória, igual ao <code>ListView.builder</code>.
      </p>
      <pre><code>{`SliverList.builder(   // atalho do Flutter 3.7+
  itemCount: 100,
  itemBuilder: (context, i) => ListTile(title: Text('\${i}')),
);

SliverGrid.count(
  crossAxisCount: 4,
  children: [for (int i = 0; i < 16; i++) Container(color: Colors.amber)],
);`}</code></pre>

      <h2>SliverToBoxAdapter: encaixando widgets normais</h2>
      <p>
        Slivers só conversam com slivers. Para colocar um widget &quot;comum&quot; (uma <code>Card</code>, um <code>Padding</code>) no meio, embrulhe com <code>SliverToBoxAdapter</code>:
      </p>
      <pre><code>{`SliverToBoxAdapter(
  child: Container(
    height: 80,
    color: Colors.teal.shade100,
    alignment: Alignment.center,
    child: const Text('Banner promocional'),
  ),
);`}</code></pre>

      <h2>SliverPersistentHeader: cabeçalhos que ficam</h2>
      <p>
        Quer um título de seção que &quot;pega cola&quot; quando rola para o topo (igual contatos do iPhone)? Use <code>SliverPersistentHeader</code> com <code>pinned: true</code>. Você precisa fornecer um delegate dizendo a altura mínima/máxima e o widget.
      </p>
      <pre><code>{`class _CabecalhoSticky extends SliverPersistentHeaderDelegate {
  final String texto;
  _CabecalhoSticky(this.texto);

  @override
  double get minExtent => 48;
  @override
  double get maxExtent => 48;

  @override
  Widget build(BuildContext c, double offset, bool overlap) {
    return Container(
      color: Colors.indigo,
      alignment: Alignment.centerLeft,
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Text(texto, style: const TextStyle(color: Colors.white)),
    );
  }

  @override
  bool shouldRebuild(_CabecalhoSticky old) => old.texto != texto;
}

// Uso:
SliverPersistentHeader(
  pinned: true,
  delegate: _CabecalhoSticky('Categoria A'),
);`}</code></pre>

      <h2>SliverFillRemaining e SliverFillViewport</h2>
      <p>
        <code>SliverFillRemaining</code> ocupa todo espaço restante (útil para tela vazia &quot;sem itens&quot; abaixo de uma lista pequena). <code>SliverFillViewport</code> faz cada filho ocupar a viewport inteira (efeito tipo PageView vertical).
      </p>

      <AlertBox type="warning" title="Não aninhe ListViews dentro de Slivers">
        ListView é um sliver internamente. Aninhar gera dois <em>scrollables</em> brigando. Use <code>SliverList</code> dentro de <code>CustomScrollView</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>SliverToBoxAdapter</code></strong>: erro &quot;A RenderFlex was given an unbounded height&quot;.</li>
        <li><strong>Misturar <code>Column</code> com slivers</strong>: <code>Column</code> não rola, slivers sim — não combina.</li>
        <li><strong>Header pinned com altura zero</strong>: ele &quot;some&quot;. Ajuste minExtent.</li>
        <li><strong>Slivers fora de <code>CustomScrollView</code></strong>: não renderizam.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Slivers são fatias roláveis que cooperam dentro de <code>CustomScrollView</code>.</li>
        <li><code>SliverAppBar</code> faz o efeito &quot;collapsing toolbar&quot;.</li>
        <li><code>SliverList</code>/<code>SliverGrid</code> são as versões eficientes para listas/grids.</li>
        <li><code>SliverToBoxAdapter</code> insere widgets comuns no meio.</li>
        <li><code>SliverPersistentHeader</code> faz cabeçalhos pegajosos por seção.</li>
      </ul>
    </PageContainer>
  );
}
