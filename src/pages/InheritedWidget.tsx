import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function InheritedWidget() {
  return (
    <PageContainer
      title="InheritedWidget: passando dados pela árvore"
      subtitle="A engrenagem secreta por trás de Theme, MediaQuery e de todo gerenciador de estado moderno do Flutter."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine um prédio com cinquenta andares. Você quer avisar a todos os moradores que a água será cortada amanhã. Sair de porta em porta (passando o aviso de pai para filho) é o que chamamos de <strong>prop drilling</strong>: tedioso, repetitivo e fácil de esquecer um andar. Seria muito melhor colocar um <em>cartaz no elevador</em> — quem precisa, lê. É exatamente isso que <code>InheritedWidget</code> faz na árvore de widgets do Flutter: ele &quot;sobe&quot; um dado para um lugar alto e qualquer descendente pode &quot;descer&quot; e ler.
      </p>

      <h2>O problema: prop drilling</h2>
      <p>
        Sem InheritedWidget, você precisaria passar parâmetros mãos-em-mão por cada construtor. Veja como isso fica feio:
      </p>
      <pre><code>{`// Tela passa "usuario" para Header, que passa para Avatar, que passa para Badge.
class Tela extends StatelessWidget {
  final Usuario u;
  const Tela(this.u, {super.key});
  @override
  Widget build(BuildContext context) => Header(usuario: u);
}
class Header extends StatelessWidget {
  final Usuario usuario;
  const Header({required this.usuario, super.key});
  @override
  Widget build(BuildContext c) => Avatar(usuario: usuario);
}
// ... e assim por diante. Quatro níveis só transportando o mesmo dado.`}</code></pre>

      <h2>A solução: InheritedWidget</h2>
      <p>
        Um <code>InheritedWidget</code> é um widget que &quot;guarda&quot; dados e expõe um método estático <code>of(context)</code>. Qualquer widget abaixo dele na árvore pode chamar <code>UsuarioInherited.of(context)</code> e receber o valor. Quando o dado muda, o Flutter rebuilda automaticamente <strong>só</strong> os widgets que leram o valor.
      </p>
      <pre><code>{`class UsuarioInherited extends InheritedWidget {
  const UsuarioInherited({
    super.key,
    required this.usuario,
    required super.child,
  });

  final Usuario usuario;

  // Método de acesso. dependOnInheritedWidgetOfExactType
  // registra o widget que chamou para receber rebuilds.
  static UsuarioInherited of(BuildContext context) {
    final w = context.dependOnInheritedWidgetOfExactType<UsuarioInherited>();
    assert(w != null, 'Nenhum UsuarioInherited acima na árvore');
    return w!;
  }

  // Decide se descendentes que leram precisam reconstruir.
  @override
  bool updateShouldNotify(UsuarioInherited old) =>
      old.usuario != usuario;
}`}</code></pre>
      <p>
        Os dois métodos importantes são: <code>of</code> (como descendentes acessam) e <code>updateShouldNotify</code> (compara o valor antigo com o novo e devolve <code>true</code> se valeu a pena notificar). Se você devolver <code>false</code>, ninguém reconstrói — útil para evitar rebuilds inúteis.
      </p>

      <h2>Usando: zero prop drilling</h2>
      <pre><code>{`class App extends StatelessWidget {
  const App({super.key});
  @override
  Widget build(BuildContext context) {
    return UsuarioInherited(
      usuario: Usuario(nome: 'Ana', idade: 28),
      child: const MaterialApp(home: Home()),
    );
  }
}

class Avatar extends StatelessWidget {
  const Avatar({super.key});
  @override
  Widget build(BuildContext context) {
    // Pega o usuário direto, sem precisar de construtor!
    final u = UsuarioInherited.of(context).usuario;
    return CircleAvatar(child: Text(u.nome[0]));
  }
}`}</code></pre>

      <AlertBox type="info" title="Você já usa InheritedWidget todo dia">
        <code>Theme.of(context)</code>, <code>MediaQuery.of(context)</code>, <code>Navigator.of(context)</code> e <code>Localizations.of(...)</code> são todos InheritedWidgets. Toda vez que você lê o tema do Material, está usando essa máquina por baixo.
      </AlertBox>

      <h2>watch vs read: o cuidado de performance</h2>
      <p>
        Quando você chama <code>dependOnInheritedWidgetOfExactType</code> (no <code>of</code>), o widget &quot;assina&quot; mudanças e será reconstruído. Se você só quer ler uma vez (por exemplo, dentro de um <code>onPressed</code>), use <code>getInheritedWidgetOfExactType</code>, que <strong>não assina</strong>:
      </p>
      <pre><code>{`// Dentro do build: assina (rebuild quando mudar).
final tema = Theme.of(context);

// Dentro de um callback: não precisa rebuild — leitura única.
ElevatedButton(
  onPressed: () {
    final nav = context.findAncestorStateOfType<NavigatorState>();
    nav?.pushNamed('/detalhe');
  },
  child: const Text('Ir'),
);`}</code></pre>

      <h2>Limitação: imutabilidade</h2>
      <p>
        Um <code>InheritedWidget</code> sozinho é <strong>imutável</strong>. Para valores que mudam ao longo do tempo, você combina com um <code>StatefulWidget</code> pai que reconstrói o InheritedWidget com o novo valor. Esse padrão (<em>InheritedNotifier</em> ou <em>InheritedModel</em>) é a base de pacotes como <code>provider</code> e <code>scoped_model</code>.
      </p>
      <pre><code>{`class ContadorScope extends StatefulWidget {
  const ContadorScope({super.key, required this.child});
  final Widget child;
  @override
  State<ContadorScope> createState() => ContadorScopeState();

  static ContadorScopeState of(BuildContext c) =>
      c.dependOnInheritedWidgetOfExactType<_Inh>()!.state;
}
class ContadorScopeState extends State<ContadorScope> {
  int valor = 0;
  void incrementar() => setState(() => valor++);
  @override
  Widget build(BuildContext c) => _Inh(state: this, child: widget.child);
}
class _Inh extends InheritedWidget {
  const _Inh({required this.state, required super.child});
  final ContadorScopeState state;
  @override
  bool updateShouldNotify(_Inh old) => old.state.valor != state.valor;
}`}</code></pre>

      <AlertBox type="tip" title="Não reinvente a roda">
        Para projetos reais, use <code>provider</code> ou <code>riverpod</code>. Eles encapsulam todo esse boilerplate. Estude InheritedWidget para <em>entender</em> como funciona.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>updateShouldNotify</code></strong>: descendentes nunca atualizam.</li>
        <li><strong>Chamar <code>of(context)</code> fora da árvore</strong>: <code>null</code> e exception.</li>
        <li><strong>Comparar com <code>==</code> em objetos sem <code>operator ==</code></strong>: notify dispara sempre.</li>
        <li><strong>Usar para dados que mudam muito rápido</strong>: prefira <code>InheritedNotifier</code> ou Provider.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>InheritedWidget</code> evita prop drilling expondo dados via <code>of(context)</code>.</li>
        <li><code>updateShouldNotify</code> decide quando rebuildar descendentes.</li>
        <li>Theme, MediaQuery e Navigator são InheritedWidgets.</li>
        <li>É a base que Provider e Riverpod usam internamente.</li>
        <li>Para mutabilidade, combine com StatefulWidget pai.</li>
      </ul>
    </PageContainer>
  );
}
