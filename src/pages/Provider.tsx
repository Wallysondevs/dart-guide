import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Provider() {
  return (
    <PageContainer
      title="Provider: state management oficial do Flutter"
      subtitle="Encapsulando InheritedWidget num pacote ergonômico que escala bem para apps reais."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Lembra do <code>InheritedWidget</code>? Ele resolve o problema de passar dados pela árvore, mas escrever um para cada estado é trabalhoso. O pacote <strong>provider</strong> nasceu para encapsular esse padrão. Pense nele como um &quot;quadro de avisos&quot; em uma empresa: alguém pendura um aviso (o estado), e qualquer departamento (widget) que se inscreveu para aquele tópico recebe a atualização. Foi recomendado pela equipe oficial do Flutter por anos e ainda é a porta de entrada para quem está aprendendo gerenciamento de estado.
      </p>

      <h2>Instalação</h2>
      <p>No <code>pubspec.yaml</code>:</p>
      <pre><code>{`dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2`}</code></pre>
      <p>Depois rode <code>flutter pub get</code>. Pronto, já temos as ferramentas.</p>

      <h2>ChangeNotifier: o objeto que avisa</h2>
      <p>
        Um <code>ChangeNotifier</code> é uma classe que você herda. Quando algo muda dentro dela, você chama <code>notifyListeners()</code> e qualquer widget inscrito reconstrói. É a peça de lógica pura — sem nenhuma referência a widgets, fácil de testar.
      </p>
      <pre><code>{`import 'package:flutter/foundation.dart';

class Contador extends ChangeNotifier {
  int _valor = 0;
  int get valor => _valor;

  void incrementar() {
    _valor++;
    notifyListeners(); // dispara rebuild de quem escuta
  }

  void zerar() {
    if (_valor == 0) return;
    _valor = 0;
    notifyListeners();
  }
}`}</code></pre>

      <h2>ChangeNotifierProvider: pendurando o quadro</h2>
      <p>
        Para que descendentes possam ler o <code>Contador</code>, embrulhe a parte da árvore que precisa dele com um <code>ChangeNotifierProvider</code>. Coloque-o no nível mais alto possível para que todas as telas filhas tenham acesso.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (_) => Contador(),
      child: const MeuApp(),
    ),
  );
}

class MeuApp extends StatelessWidget {
  const MeuApp({super.key});
  @override
  Widget build(BuildContext context) =>
      const MaterialApp(home: TelaContador());
}`}</code></pre>

      <h2>context.watch, context.read e Consumer</h2>
      <p>
        Existem três formas de ler o estado, cada uma para um caso:
      </p>
      <ul>
        <li><code>context.watch&lt;T&gt;()</code>: lê <strong>e</strong> assina mudanças. Use no <code>build</code>.</li>
        <li><code>context.read&lt;T&gt;()</code>: lê <strong>sem</strong> assinar. Use em callbacks (<code>onPressed</code>, <code>onTap</code>) — não queremos rebuild aqui.</li>
        <li><code>Consumer&lt;T&gt;</code>: igual ao watch, mas isola o rebuild a uma sub-árvore (mais performático).</li>
      </ul>
      <pre><code>{`class TelaContador extends StatelessWidget {
  const TelaContador({super.key});
  @override
  Widget build(BuildContext context) {
    // watch: rebuild quando o valor mudar.
    final contador = context.watch<Contador>();

    return Scaffold(
      appBar: AppBar(title: const Text('Provider')),
      body: Center(
        child: Text(
          'Cliques: \${contador.valor}',
          style: Theme.of(context).textTheme.headlineLarge,
        ),
      ),
      floatingActionButton: FloatingActionButton(
        // read: estamos num callback, não precisa rebuild.
        onPressed: () => context.read<Contador>().incrementar(),
        child: const Icon(Icons.add),
      ),
    );
  }
}`}</code></pre>

      <AlertBox type="tip" title="Regra simples">
        No <code>build</code>: <code>watch</code>. Em callbacks: <code>read</code>. Para isolar rebuilds: <code>Consumer</code>.
      </AlertBox>

      <h2>Consumer com granularidade</h2>
      <p>
        Imagine uma tela com 200 widgets onde só o número precisa mudar. Usar <code>watch</code> no topo reconstrói tudo. Com <code>Consumer</code>, só o que está dentro dele se reconstrói:
      </p>
      <pre><code>{`Column(
  children: [
    const Text('Cabeçalho pesado, não muda nunca'),
    Consumer<Contador>(
      builder: (context, c, child) => Text('\${c.valor}'),
    ),
    const ImagemEnorme(), // child estável — não reconstrói
  ],
);`}</code></pre>

      <h2>MultiProvider: vários estados juntos</h2>
      <p>
        Em apps reais, há dezenas de estados. Em vez de aninhar providers, use <code>MultiProvider</code>:
      </p>
      <pre><code>{`MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (_) => Contador()),
    ChangeNotifierProvider(create: (_) => Auth()),
    Provider<ApiService>(create: (_) => ApiService()),
  ],
  child: const MeuApp(),
);`}</code></pre>

      <h2>Comparação com setState puro</h2>
      <p>
        <code>setState</code> é perfeito para estado <strong>local</strong> (um checkbox, o texto de um campo). Mas quando o mesmo dado precisa aparecer em telas diferentes — carrinho de compras, usuário logado, tema — passar por construtores é doloroso. Provider resolve isso com pouco código e mantém o widget burro (só renderiza), o que é ótimo para testar.
      </p>

      <AlertBox type="warning" title="Não esqueça notifyListeners()">
        Mudou um campo e não chamou <code>notifyListeners()</code>? Os widgets não atualizam e você fica olhando para a tela tentando entender por que &quot;não funciona&quot;. Erro #1 de quem começa.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar <code>watch</code> em callback</strong>: erro de runtime &quot;cannot listen outside of build&quot;.</li>
        <li><strong>Esquecer <code>notifyListeners()</code></strong>: estado muda, UI não.</li>
        <li><strong>Provider abaixo do widget que lê</strong>: <code>ProviderNotFoundException</code>. Coloque-o acima na árvore.</li>
        <li><strong>Criar instância nova a cada build</strong>: use <code>create:</code>, não <code>value:</code>, a menos que saiba o que faz.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Provider encapsula <code>InheritedWidget</code> de forma ergonômica.</li>
        <li><code>ChangeNotifier</code> + <code>notifyListeners()</code> = lógica pura testável.</li>
        <li><code>watch</code> em build, <code>read</code> em callbacks, <code>Consumer</code> para isolar rebuild.</li>
        <li><code>MultiProvider</code> agrupa vários estados.</li>
        <li>É a porta de entrada e ainda atende projetos médios sem dor.</li>
      </ul>
    </PageContainer>
  );
}
