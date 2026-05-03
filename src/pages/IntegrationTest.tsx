import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function IntegrationTest() {
  return (
    <PageContainer
      title="Testes de integração e end-to-end no Flutter"
      subtitle="Suba o app inteiro num emulador e simule um usuário tocando, digitando e navegando — tudo automatizado."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Existem três níveis de teste num app Flutter, e entender a diferença é essencial. <strong>Testes unitários</strong> verificam uma função pura — rápidos, isolados, mas não tocam UI. <strong>Testes de widget</strong> renderizam um único widget em memória e disparam eventos sintéticos — bons para checar comportamento visual sem o app inteiro. Já os <strong>testes de integração</strong> (ou <em>end-to-end</em>, &quot;ponta a ponta&quot;) sobem o app real num emulador ou dispositivo físico e simulam um usuário usando-o de verdade. É a maior garantia que tudo está conectado: rotas, banco, API, UI.
      </p>

      <h2>Pirâmide de testes — onde cada um se encaixa</h2>
      <p>
        A regra prática é: muitos unitários (rápidos), alguns de widget (médios) e poucos de integração (lentos, mas críticos). Integration tests rodam num emulador real, então custam segundos a minutos cada — use-os para fluxos críticos de negócio (login, checkout, cadastro), não para validar pixels.
      </p>
      <pre><code>{`# Unitário (rápido, sem UI)
flutter test test/calculadora_test.dart

# Widget (renderiza em memória, sem device)
flutter test test/meu_widget_test.dart

# Integração (sobe app no emulador/celular)
flutter test integration_test/app_test.dart`}</code></pre>

      <h2>Configurando o pacote integration_test</h2>
      <p>
        O Flutter já traz o <code>integration_test</code> no SDK. Adicione-o como dependência de desenvolvimento e crie a pasta <code>integration_test/</code> na raiz do projeto:
      </p>
      <pre><code>{`# pubspec.yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter`}</code></pre>
      <p>
        Estrutura recomendada:
      </p>
      <pre><code>{`meu_app/
  lib/
    main.dart
  integration_test/
    app_test.dart      <- testes vão aqui
  test/
    widget_test.dart`}</code></pre>

      <h2>Escrevendo o primeiro teste de integração</h2>
      <p>
        Suponha um app simples com um contador (Material 3) cujo botão tem uma <code>Key</code> identificadora — Keys servem como &quot;etiquetas&quot; para o teste localizar o widget mesmo se o texto mudar.
      </p>
      <pre><code>{`// lib/main.dart
import 'package:flutter/material.dart';

void main() => runApp(const MeuApp());

class MeuApp extends StatelessWidget {
  const MeuApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: Colors.blue),
      home: const TelaContador(),
    );
  }
}

class TelaContador extends StatefulWidget {
  const TelaContador({super.key});
  @override
  State<TelaContador> createState() => _TelaContadorState();
}

class _TelaContadorState extends State<TelaContador> {
  int _count = 0;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Contador')),
      body: Center(
        child: Text('\${_count}', key: const Key('texto-contador')),
      ),
      floatingActionButton: FloatingActionButton(
        key: const Key('botao-mais'),
        onPressed: () => setState(() => _count++),
        child: const Icon(Icons.add),
      ),
    );
  }
}`}</code></pre>

      <p>O teste de integração:</p>
      <pre><code>{`// integration_test/app_test.dart
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:meu_app/main.dart';

void main() {
  // Inicializa o binding nativo (obrigatório)
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  group('Contador end-to-end', () {
    testWidgets('clicar 3 vezes incrementa para 3', (tester) async {
      // Sobe o app de verdade
      await tester.pumpWidget(const MeuApp());
      // Aguarda animações iniciais
      await tester.pumpAndSettle();

      // Localiza widgets pelas chaves
      final botao = find.byKey(const Key('botao-mais'));
      final texto = find.byKey(const Key('texto-contador'));

      expect(texto, findsOneWidget);
      expect((tester.widget<Text>(texto)).data, '0');

      // Simula 3 toques
      for (var i = 0; i < 3; i++) {
        await tester.tap(botao);
        await tester.pumpAndSettle();
      }

      expect((tester.widget<Text>(texto)).data, '3');
    });
  });
}`}</code></pre>

      <AlertBox type="info" title="O que é pumpAndSettle?">
        O Flutter desenha quadros (frames) sob demanda. <code>tester.pump()</code> avança um frame; <code>pumpAndSettle()</code> avança frames até nada mais estar animando. Use depois de <code>tap</code> ou <code>enterText</code> para esperar a UI se estabilizar.
      </AlertBox>

      <h2>Encontrando widgets — finders</h2>
      <pre><code>{`// Por chave (mais robusto)
find.byKey(const Key('botao-mais'));

// Por texto visível
find.text('Salvar');

// Por tipo de widget
find.byType(ElevatedButton);

// Por ícone
find.byIcon(Icons.add);

// Combinando
find.descendant(of: find.byType(AppBar), matching: find.text('Home'));`}</code></pre>

      <h2>Simulando ações do usuário</h2>
      <pre><code>{`await tester.tap(find.byKey(const Key('login')));
await tester.enterText(find.byType(TextField).first, 'ada@email.com');
await tester.drag(find.byType(ListView), const Offset(0, -300));
await tester.longPress(find.byIcon(Icons.menu));
await tester.pumpAndSettle();`}</code></pre>

      <h2>Rodando em dispositivo</h2>
      <pre><code>{`# Lista dispositivos disponíveis (emuladores, celulares)
flutter devices

# Roda num device específico
flutter test integration_test/app_test.dart -d emulator-5554

# Roda em web (precisa do chromedriver)
flutter drive --driver=test_driver/integration_test.dart \\
  --target=integration_test/app_test.dart -d chrome`}</code></pre>

      <AlertBox type="warning" title="Use Keys, não texto">
        Localizar por texto (<code>find.text(&apos;Salvar&apos;)</code>) quebra quando o copy muda ou quando o app é traduzido. Sempre que possível, marque widgets críticos com <code>Key</code> — o teste fica resistente a mudanças de UI.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>ensureInitialized()</code></strong>: o teste não roda no device.</li>
        <li><strong>Não chamar <code>pumpAndSettle</code></strong> depois de uma ação: o teste verifica o estado antes do rebuild.</li>
        <li><strong>Confiar em delays fixos</strong> (<code>Future.delayed</code>): use <code>pumpAndSettle</code>; é determinístico.</li>
        <li><strong>Testar tudo no nível de integração</strong>: lento e frágil. Cubra o caminho feliz e deixe edge cases nos unitários.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Unit &lt; Widget &lt; Integration: pirâmide com base larga em unitários.</li>
        <li>Pacote <code>integration_test</code> sobe o app real num device.</li>
        <li>Use <code>Key</code> para localizar widgets de forma estável.</li>
        <li><code>tester.tap/enterText/drag</code> simulam o usuário.</li>
        <li><code>pumpAndSettle</code> espera as animações terminarem antes do <code>expect</code>.</li>
      </ul>
    </PageContainer>
  );
}
