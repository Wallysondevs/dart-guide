import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Listview() {
  return (
    <PageContainer
      title="ListView: listas roláveis e performance"
      subtitle="Como mostrar listas curtas ou enormes sem travar o app, com ListView, ListView.builder e ListTile."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Pense em uma agenda de telefones. Se você tem 10 contatos, pode imprimir todos em um cartão e olhar de uma vez. Mas se tem 10 mil, é mais inteligente carregar apenas a página que você está olhando — quando rolar para baixo, carrega a próxima. Esse é exatamente o problema que <code>ListView</code> resolve em Flutter: criar listas roláveis. E ele tem dois modos: o <strong>"carrega tudo"</strong> (bom para listas pequenas) e o <strong>"carrega sob demanda"</strong> (essencial para listas grandes).
      </p>

      <h2>ListView simples: carrega tudo</h2>
      <p>
        A versão básica do <code>ListView</code> recebe uma lista de filhos via parâmetro <code>children</code>. Use somente quando você sabe que terá poucos itens (até umas 30 linhas) — porque ele constrói TODOS de uma vez, mesmo os que estão fora da tela.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class ListaSimples extends StatelessWidget {
  const ListaSimples({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Idiomas')),
      body: ListView(
        // padding interno da lista (afasta itens das bordas)
        padding: const EdgeInsets.all(8),
        children: const [
          ListTile(leading: Icon(Icons.flag), title: Text('Português')),
          ListTile(leading: Icon(Icons.flag), title: Text('Inglês')),
          ListTile(leading: Icon(Icons.flag), title: Text('Espanhol')),
          ListTile(leading: Icon(Icons.flag), title: Text('Francês')),
        ],
      ),
    );
  }
}`}</code></pre>

      <h2>ListTile: o item de lista pronto</h2>
      <p>
        <code>ListTile</code> é um widget pré-fabricado para representar uma linha de lista no estilo Material: ícone à esquerda (<code>leading</code>), título e subtítulo no meio, ação à direita (<code>trailing</code>) e callback de toque (<code>onTap</code>).
      </p>
      <pre><code>{`ListTile(
  leading: const CircleAvatar(child: Icon(Icons.person)),
  title: const Text('Ana Souza'),
  subtitle: const Text('Designer • online'),
  trailing: const Icon(Icons.chevron_right),
  onTap: () {
    debugPrint('Tocou em Ana');
  },
)`}</code></pre>

      <h2>ListView.builder: carrega sob demanda</h2>
      <p>
        Para listas grandes (centenas, milhares de itens), use <code>ListView.builder</code>. Ele constrói cada item somente quando ele aparece na tela, num processo chamado <strong>lazy loading</strong> (carregamento preguiçoso). Resultado: o app fica leve mesmo com 100 mil itens.
      </p>
      <pre><code>{`class ListaGrande extends StatelessWidget {
  const ListaGrande({super.key});

  @override
  Widget build(BuildContext context) {
    final dados = List.generate(10000, (i) => 'Usuário #\$i');

    return Scaffold(
      appBar: AppBar(title: const Text('10 mil usuários')),
      body: ListView.builder(
        // quantos itens existem no total
        itemCount: dados.length,
        // função que constrói o item DA POSIÇÃO i sob demanda
        itemBuilder: (context, i) {
          return ListTile(
            leading: CircleAvatar(child: Text('\${i + 1}')),
            title: Text(dados[i]),
            onTap: () => debugPrint('Tocou em \${dados[i]}'),
          );
        },
      ),
    );
  }
}`}</code></pre>

      <AlertBox type="info" title="Por que builder é mais rápido?">
        Com <code>children</code>, Flutter cria todos os widgets de uma vez (mesmo os invisíveis). Com <code>builder</code>, cria sob demanda e descarta os que saem da tela. Para listas com mais de ~30 itens, sempre prefira o builder.
      </AlertBox>

      <h2>ListView.separated: divisórias entre itens</h2>
      <p>
        Quando você quer uma linha (Divider) entre cada item, <code>ListView.separated</code> faz isso elegantemente sem precisar adicionar Dividers manualmente.
      </p>
      <pre><code>{`ListView.separated(
  itemCount: 50,
  itemBuilder: (context, i) => ListTile(
    title: Text('Item \$i'),
  ),
  // chamado entre cada par de itens (49 vezes para 50 itens)
  separatorBuilder: (context, i) => const Divider(height: 1),
)`}</code></pre>

      <h2>scrollPhysics e ScrollController</h2>
      <p>
        O <strong>physics</strong> controla a "sensação" do scroll: rebote do iOS (<code>BouncingScrollPhysics</code>), brilho do Android (<code>ClampingScrollPhysics</code>), travado (<code>NeverScrollableScrollPhysics</code> — útil dentro de outro scroll). O <strong>controller</strong> permite ler/programar a posição.
      </p>
      <pre><code>{`class ListaComController extends StatefulWidget {
  const ListaComController({super.key});

  @override
  State<ListaComController> createState() => _ListaComControllerState();
}

class _ListaComControllerState extends State<ListaComController> {
  final _ctrl = ScrollController();

  @override
  void initState() {
    super.initState();
    _ctrl.addListener(() {
      // Detecta quando chegou perto do fim (infinite scroll)
      if (_ctrl.position.pixels >= _ctrl.position.maxScrollExtent - 200) {
        debugPrint('Carregar mais itens!');
      }
    });
  }

  @override
  void dispose() {
    _ctrl.dispose(); // sempre liberar!
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: _ctrl,
      physics: const BouncingScrollPhysics(),
      itemCount: 200,
      itemBuilder: (_, i) => ListTile(title: Text('Linha \$i')),
    );
  }
}`}</code></pre>

      <h2>Infinite scroll na prática</h2>
      <pre><code>{`class FeedInfinito extends StatefulWidget {
  const FeedInfinito({super.key});

  @override
  State<FeedInfinito> createState() => _FeedInfinitoState();
}

class _FeedInfinitoState extends State<FeedInfinito> {
  final _itens = <String>[];
  bool _carregando = false;

  @override
  void initState() {
    super.initState();
    _carregarMais();
  }

  Future<void> _carregarMais() async {
    if (_carregando) return;
    setState(() => _carregando = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() {
      _itens.addAll(List.generate(20, (i) => 'Post \${_itens.length + i}'));
      _carregando = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: _itens.length + 1, // +1 para o loader
      itemBuilder: (context, i) {
        if (i == _itens.length) {
          _carregarMais();
          return const Padding(
            padding: EdgeInsets.all(16),
            child: Center(child: CircularProgressIndicator()),
          );
        }
        return ListTile(title: Text(_itens[i]));
      },
    );
  }
}`}</code></pre>

      <AlertBox type="warning" title="Performance: itemExtent ajuda">
        Se todos os itens têm a mesma altura, defina <code>itemExtent: 60</code>. O Flutter pula cálculos caros de medição e a rolagem fica MUITO mais suave.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>ListView dentro de Column sem altura</strong>: erro "Vertical viewport was given unbounded height". Solução: envolva em <code>Expanded</code> ou defina <code>shrinkWrap: true</code>.</li>
        <li><strong>Esquecer dispose do ScrollController</strong>: vaza memória.</li>
        <li><strong>Usar children com listas grandes</strong>: trava o app. Sempre prefira builder a partir de ~30 itens.</li>
        <li><strong>setState dentro de itemBuilder</strong>: causa loop infinito de rebuild.</li>
        <li><strong>Listas aninhadas sem physics</strong>: gera dois scrolls disputando. Use <code>NeverScrollableScrollPhysics</code> na interna.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>ListView(children: [...])</code> serve para listas pequenas e fixas.</li>
        <li><code>ListView.builder</code> é lazy — essencial para listas grandes.</li>
        <li><code>ListView.separated</code> coloca divider automático entre itens.</li>
        <li><code>ListTile</code> dá visual padrão Material para cada linha.</li>
        <li><code>ScrollController</code> permite detectar fim para infinite scroll.</li>
        <li>Para máxima performance, use <code>itemExtent</code> quando os itens têm altura fixa.</li>
      </ul>
    </PageContainer>
  );
}
