import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function WidgetsFundamentais() {
  return (
    <PageContainer
      title="Tudo é Widget: o conceito central do Flutter"
      subtitle="Entendendo a árvore de widgets, BuildContext, MaterialApp, Scaffold e o ciclo do hot reload."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Pense em montar uma casa de Lego. Cada peça — base, parede, janela, telhado — é uma <strong>peça pré-fabricada</strong> que você combina para chegar ao resultado final. Em Flutter funciona exatamente assim: cada elemento que você vê na tela (texto, botão, espaço em branco, padding, lista, ícone) é uma <strong>peça chamada widget</strong>. E até coisas <em>invisíveis</em>, como "centralize esse filho", "deixe 16 pixels de margem", "alinhe à direita", também são widgets. A frase mais repetida no mundo Flutter é: <em>"Everything is a widget"</em>.
      </p>

      <h2>O que é um widget, tecnicamente?</h2>
      <p>
        Um <strong>widget</strong> é uma <em>descrição imutável</em> (não muda depois de criada) de uma parte da interface. Ele é como uma <strong>planta arquitetônica</strong>: a planta em si não é a parede, mas descreve como construir a parede. O Flutter lê essas plantas e gera os elementos reais (chamados <em>RenderObjects</em>) que pintam pixels na tela. Quando algo precisa mudar, o Flutter joga a planta antiga fora, gera uma nova e compara para atualizar só o necessário.
      </p>
      <pre><code>{`// Um widget mínimo: só descreve "um texto verde tamanho 24".
import 'package:flutter/material.dart';

class TituloVerde extends StatelessWidget {
  const TituloVerde({super.key});

  @override
  Widget build(BuildContext context) {
    return const Text(
      'Olá, Lego!',
      style: TextStyle(color: Colors.green, fontSize: 24),
    );
  }
}`}</code></pre>

      <h2><code>runApp</code>: a porta de entrada</h2>
      <p>
        Todo app Flutter começa com a função <code>runApp(meuWidget)</code>. Ela recebe o widget raiz e diz: "este é o topo da árvore; pinte tudo que descender daqui". Quase sempre o widget raiz é um <code>MaterialApp</code> (visual Material Design, do Google) ou <code>CupertinoApp</code> (visual iOS).
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

void main() {
  // Inicia o Flutter passando a planta raiz da árvore.
  runApp(const MeuApp());
}

class MeuApp extends StatelessWidget {
  const MeuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Primeira Casinha',
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
      ),
      home: const MinhaPagina(),
    );
  }
}`}</code></pre>

      <h2><code>Scaffold</code>: o esqueleto da tela</h2>
      <p>
        <code>Scaffold</code> (em inglês, "andaime") é o widget que dá a estrutura básica de uma tela Material: barra superior (<code>appBar</code>), corpo (<code>body</code>), botão flutuante (<code>floatingActionButton</code>), gaveta lateral (<code>drawer</code>) etc. Você raramente desenha esses elementos do zero; usa o Scaffold pronto e preenche os espaços.
      </p>
      <pre><code>{`class MinhaPagina extends StatelessWidget {
  const MinhaPagina({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Minha Página')),
      body: const Center(
        // Center alinha o filho no meio da tela.
        child: Text('Sou um widget dentro de outro widget!'),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        child: const Icon(Icons.add),
      ),
    );
  }
}`}</code></pre>

      <AlertBox type="info" title="Por que tudo vira aninhamento?">
        Cada widget só sabe fazer UMA coisa bem. <code>Center</code> centraliza, <code>Padding</code> dá espaço, <code>Text</code> mostra texto. Para combinar comportamentos, você aninha um dentro do outro — como bonecas russas.
      </AlertBox>

      <h2>A árvore de widgets</h2>
      <p>
        Toda essa aninhação forma uma <strong>árvore</strong>: o widget raiz está no topo, com filhos abaixo, netos abaixo deles e assim por diante. O Flutter percorre essa árvore em ordem para descobrir o que pintar e onde. Visualmente:
      </p>
      <pre><code>{`MaterialApp
└─ Scaffold
   ├─ AppBar
   │  └─ Text('Minha Página')
   ├─ Center
   │  └─ Text('Sou um widget...')
   └─ FloatingActionButton
      └─ Icon(Icons.add)`}</code></pre>

      <h2><code>BuildContext</code>: onde estou na árvore?</h2>
      <p>
        Você notou que toda função <code>build</code> recebe um parâmetro chamado <code>context</code>? Esse <strong>BuildContext</strong> é como um <em>endereço postal</em> do widget dentro da árvore. Com ele você consulta coisas que vêm "de cima": o tema atual, idioma, tamanho da tela, navegação, etc.
      </p>
      <pre><code>{`class MostraTema extends StatelessWidget {
  const MostraTema({super.key});

  @override
  Widget build(BuildContext context) {
    // Theme.of(context) sobe a árvore procurando o ThemeData mais próximo.
    final cor = Theme.of(context).colorScheme.primary;
    final largura = MediaQuery.of(context).size.width;
    return Container(
      color: cor,
      child: Text('Tela tem \${largura.toStringAsFixed(0)} pixels'),
    );
  }
}`}</code></pre>

      <AlertBox type="warning" title="BuildContext não é mágico">
        Use <code>context</code> apenas dentro de <code>build</code> ou em callbacks chamados enquanto o widget existe. Guardar context em variáveis estáticas e usar depois quebra o app.
      </AlertBox>

      <h2>Hot reload e debug paint</h2>
      <p>
        Salve o arquivo: a UI atualiza em meio segundo, mantendo o estado. Isso é o <strong>hot reload</strong> e é a feature que faz Flutter parecer mágico. Para ver as caixas de cada widget na tela (útil para entender layouts), pressione <code>P</code> no terminal de <code>flutter run</code> ou ative <em>Debug Paint</em> no DevTools.
      </p>
      <pre><code>{`# No terminal onde rodou flutter run:
r   # hot reload (mantém estado)
R   # hot restart (zera estado)
p   # toggle debug paint (mostra borda de cada widget)
q   # sair`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>const</code></strong>: deixar <code>const</code> antes de widgets imutáveis economiza memória e melhora performance.</li>
        <li><strong>Retornar <code>null</code> do <code>build</code></strong>: o método deve sempre devolver um Widget. Use <code>SizedBox.shrink()</code> para "nada".</li>
        <li><strong>Usar <code>Theme.of(context)</code> fora de build</strong>: causa exceção em runtime.</li>
        <li><strong>Confundir <code>Container</code> com tudo</strong>: para apenas centralizar, use <code>Center</code>; para padding, <code>Padding</code>. Cada widget faz uma coisa.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Widget = descrição imutável de UI; tudo em Flutter é widget.</li>
        <li><code>runApp(widget)</code> inicia o app passando a árvore raiz.</li>
        <li><code>MaterialApp</code> + <code>Scaffold</code> dão a estrutura padrão de uma tela.</li>
        <li>Widgets se compõem em árvore — aninhar é a regra.</li>
        <li><code>BuildContext</code> dá acesso a tema, mídia e navegação subindo a árvore.</li>
        <li>Hot reload mantém estado; hot restart zera.</li>
      </ul>
    </PageContainer>
  );
}
