import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HotReload() {
  return (
    <PageContainer
      title="Hot reload e hot restart: o superpoder do Flutter"
      subtitle="Como Flutter atualiza sua UI em meio segundo sem perder o estado — e quando isso não funciona."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <p>
        Imagine pintar uma parede de uma sala onde já estão os móveis, as pessoas, a televisão ligada — e <em>sem precisar tirar nada do lugar</em>. Você muda a cor, e em meio segundo a parede está repintada com tudo exatamente como estava antes. Esse é o <strong>hot reload</strong> do Flutter: você salva o arquivo, e em ~500ms a UI atualiza com seu código novo, mantendo o estado (campo de texto digitado pela metade, scroll na posição certa, contador no número certo). Para quem vem do desenvolvimento mobile tradicional (compilação Gradle de 1-2 minutos por mudança), parece milagre.
      </p>

      <h2>Hot reload (r) vs hot restart (R)</h2>
      <p>
        São dois mecanismos diferentes. Saber a diferença economiza muito tempo de debug.
      </p>
      <ul>
        <li><strong>Hot reload</strong> (<code>r</code> minúsculo no terminal): injeta o código novo na VM Dart em execução, chama <code>build</code> de novo em todos os widgets afetados, e <strong>preserva o estado</strong>. Tempo típico: 200–700 ms.</li>
        <li><strong>Hot restart</strong> (<code>R</code> maiúsculo): reinicia toda a VM Dart, refazendo <code>main()</code> do zero. <strong>Perde o estado</strong>, volta para a tela inicial. Tempo típico: 1–3 segundos.</li>
        <li><strong>Restart total</strong>: pare com <code>q</code> e rode <code>flutter run</code> de novo. Recompila parte nativa também. Tempo: 30s+.</li>
      </ul>
      <pre><code>{`# No terminal onde rodou flutter run:
r       # hot reload (mantém estado)
R       # hot restart (zera estado, refaz main)
p       # toggle debug paint (mostra borda dos widgets)
o       # alterna iOS/Android para visual em modo debug
q       # sai do app

# A maioria das IDEs também tem botões na barra de ferramentas:
# raio = hot reload, círculo com seta = hot restart`}</code></pre>

      <h2>Como o hot reload funciona por baixo</h2>
      <p>
        Em modo debug, Flutter roda numa <strong>VM Dart</strong> com compilação JIT (Just-In-Time): o código é compilado conforme executa. Quando você salva, o tooling detecta os arquivos alterados, compila só esses pedaços e injeta as novas classes na VM. Em seguida, dispara um rebuild da árvore de widgets — e como cada widget é apenas uma "planta" recém-construída a partir do estado, a UI atualiza naturalmente.
      </p>
      <pre><code>{`// Exemplo: contador de carrinho.
class TelaCarrinho extends StatefulWidget {
  const TelaCarrinho({super.key});
  @override
  State<TelaCarrinho> createState() => _TelaCarrinhoState();
}

class _TelaCarrinhoState extends State<TelaCarrinho> {
  int _itens = 3; // valor preservado em hot reload

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        '\$_itens itens no carrinho',
        // Mude essa cor e salve: muda na hora, _itens segue 3.
        style: const TextStyle(fontSize: 24, color: Colors.indigo),
      ),
    );
  }
}`}</code></pre>

      <AlertBox type="info" title="Salvar = hot reload">
        Por padrão, VS Code e Android Studio fazem hot reload automaticamente ao salvar (Ctrl/Cmd+S). Não precisa apertar &quot;r&quot; no terminal.
      </AlertBox>

      <h2>Quando o hot reload NÃO funciona</h2>
      <p>
        O reload pula código que já rodou. Se você muda algo que só executa <em>uma vez</em> ou que mexe na estrutura mais profunda do app, precisa de hot restart.
      </p>
      <ul>
        <li><strong>Mudou <code>initState</code></strong>: já rodou, reload não chama de novo. Use restart.</li>
        <li><strong>Mudou <code>main()</code></strong>: a árvore raiz já foi montada. Restart.</li>
        <li><strong>Adicionou/removeu campos em uma classe</strong>: a instância antiga não tem o campo novo. Restart.</li>
        <li><strong>Mudou de <code>StatelessWidget</code> para <code>StatefulWidget</code></strong> (ou vice-versa). Restart.</li>
        <li><strong>Alterou <code>enum</code>, herança ou tipo genérico</strong>: muda layout de memória. Restart.</li>
        <li><strong>Alterou variável global ou estática inicializada</strong>: o valor antigo permanece. Restart.</li>
        <li><strong>Mexeu no código nativo</strong> (Kotlin/Swift/Gradle/pubspec.yaml): precisa <code>flutter run</code> completo.</li>
      </ul>

      <pre><code>{`// Cenário típico: ajustar saudação inicial.
class _TelaState extends State<Tela> {
  String saudacao = '';

  @override
  void initState() {
    super.initState();
    // Se você mudar essa string e fizer hot reload,
    // a tela continua com a saudação antiga.
    saudacao = 'Bom dia, mundo!';
  }

  @override
  Widget build(BuildContext context) => Text(saudacao);
}`}</code></pre>

      <AlertBox type="warning" title="Truque: force initState com restart">
        Se você precisa testar mudanças de <code>initState</code> com frequência (rede, autenticação), aperte <code>R</code> em vez de salvar. Ou use o atalho do editor: VS Code &quot;Hot Restart&quot; (Ctrl+Shift+F5).
      </AlertBox>

      <h2>Hot reload em produção? Não.</h2>
      <p>
        Hot reload <strong>só existe em modo debug</strong>. Em build de produção (<code>flutter build apk --release</code>), o código é compilado AOT para nativo: rápido como Java/Kotlin, mas sem VM, sem JIT, sem reload. É um trade-off consciente: dev rápido, prod rápido — modos diferentes.
      </p>
      <pre><code>{`flutter run                  # debug (com reload)
flutter run --profile        # mais próximo de prod, ainda observável
flutter run --release        # AOT, sem reload, sem debugger`}</code></pre>

      <h2>Dicas para tirar máximo proveito</h2>
      <ul>
        <li>Use <code>const</code> sempre que possível: widgets <code>const</code> são pulados no rebuild, reload fica ainda mais rápido.</li>
        <li>Quebre telas em widgets pequenos: rebuild atinge somente os ramos que mudaram.</li>
        <li>Ao trocar dependências (pubspec.yaml), pare o app e rode <code>flutter pub get</code> + <code>flutter run</code>.</li>
        <li>Se o reload começar a falhar de forma estranha, faça hot restart antes de culpar o código.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Salvar e &quot;não muda nada&quot;</strong>: você editou <code>initState</code> ou <code>main()</code>. Faça hot restart.</li>
        <li><strong>Erro <code>Reloaded n of n libraries…</code> mas UI velha</strong>: estado em variável global cacheou — restart.</li>
        <li><strong>Mudou pubspec.yaml e nada acontece</strong>: pare e rode <code>flutter pub get</code> + <code>flutter run</code>.</li>
        <li><strong>Teclas r/R não funcionam</strong>: o terminal perdeu foco. Clique nele de novo.</li>
        <li><strong>Achar que dá para usar hot reload em release</strong>: não. Modo release é AOT puro.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>r</code> = hot reload: rápido, preserva estado.</li>
        <li><code>R</code> = hot restart: refaz <code>main()</code>, zera estado.</li>
        <li>Reload só funciona em modo debug (JIT). Release é AOT.</li>
        <li>Mudanças em <code>initState</code>, herança, tipos e <code>main</code> exigem restart.</li>
        <li>Use <code>const</code> e widgets pequenos para reload mais ágil.</li>
        <li>Mudanças em pubspec.yaml ou código nativo pedem <code>flutter run</code> completo.</li>
      </ul>
    </PageContainer>
  );
}
