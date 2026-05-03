import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ThemeMaterial() {
  return (
    <PageContainer
      title="Theming com Material 3"
      subtitle="Como definir cores, fontes e modo claro/escuro de forma centralizada usando ThemeData e ColorScheme.fromSeed."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine um restaurante com cardápio único: a cor da capa, o tipo de letra, o tom dos pratos — tudo combinando. Se você quiser mudar a identidade visual, troca o cardápio e <em>tudo</em> muda automaticamente, sem precisar reimprimir cada placa do salão. Em Flutter esse "cardápio" é o <strong>tema</strong> (<code>ThemeData</code>), e o sistema mais moderno para defini-lo é o <strong>Material 3</strong> (também chamado Material You) — a linguagem de design que o Google introduziu em 2021 e que se tornou padrão a partir do Flutter 3.16.
      </p>

      <h2>Material 3 e useMaterial3</h2>
      <p>
        Para ativar o Material 3, basta passar <code>useMaterial3: true</code> ao <code>ThemeData</code>. A partir do Flutter 3.16 isso já é o padrão, mas é bom deixar explícito. Material 3 traz cantos arredondados, novos botões (FilledButton, FilledButton.tonal), tipografia atualizada e sistema de cor baseado em uma <strong>cor-semente</strong>.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

void main() => runApp(const MeuApp());

class MeuApp extends StatelessWidget {
  const MeuApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Meu App',
      // Tema claro (padrão)
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
      ),
      home: const Scaffold(
        body: Center(child: Text('Olá Material 3')),
      ),
    );
  }
}`}</code></pre>

      <h2><code>ColorScheme.fromSeed</code>: a paleta a partir de uma cor</h2>
      <p>
        Em vez de você definir manualmente 30 cores (primary, secondary, surface, onPrimary, onError…), basta passar UMA cor-semente e o Flutter <strong>gera toda a paleta harmônica</strong> usando o algoritmo do Material 3. É fenomenal para protótipos.
      </p>
      <pre><code>{`final scheme = ColorScheme.fromSeed(
  seedColor: Colors.deepPurple,
  // brightness: Brightness.light  // claro (padrão)
);

// O que você ganha de graça:
// scheme.primary, primaryContainer, onPrimary
// scheme.secondary, secondaryContainer, onSecondary
// scheme.tertiary, tertiaryContainer
// scheme.surface, surfaceContainerHighest, onSurface
// scheme.error, errorContainer, onError
// scheme.outline, shadow, inverseSurface, ...`}</code></pre>

      <h2>Modo claro e escuro</h2>
      <p>
        Você define dois temas (claro e escuro) e o <code>MaterialApp</code> escolhe automaticamente conforme a configuração do sistema operacional. Pode forçar um modo específico com <code>themeMode</code>.
      </p>
      <pre><code>{`MaterialApp(
  themeMode: ThemeMode.system, // ou .light, .dark
  theme: ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
  ),
  darkTheme: ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: Colors.teal,
      brightness: Brightness.dark,
    ),
  ),
  home: const TelaInicial(),
)`}</code></pre>

      <AlertBox type="info" title="Use a MESMA seed nos dois">
        Quando você usa a mesma <code>seedColor</code> para tema claro e escuro, o algoritmo gera variações harmônicas que se reconhecem como &quot;a mesma marca&quot;. Não tente pintar manualmente cor por cor.
      </AlertBox>

      <h2>Tipografia personalizada com <code>textTheme</code></h2>
      <p>
        Material 3 vem com uma escala tipográfica chamada <strong>Display, Headline, Title, Body, Label</strong> — cada uma em três tamanhos (Large, Medium, Small). Você pode mudar fonte ou tamanhos individuais.
      </p>
      <pre><code>{`ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
  textTheme: const TextTheme(
    headlineLarge: TextStyle(
      fontSize: 32,
      fontWeight: FontWeight.bold,
      letterSpacing: -0.5,
    ),
    bodyMedium: TextStyle(fontSize: 15, height: 1.5),
    labelLarge: TextStyle(fontWeight: FontWeight.w600),
  ),
  fontFamily: 'Inter', // exige declarar em pubspec.yaml
)`}</code></pre>

      <h2>Acessando o tema com <code>Theme.of(context)</code></h2>
      <p>
        Dentro de qualquer widget, você pega o tema atual com <code>Theme.of(context)</code>. Isso permite escrever componentes que se adaptam automaticamente ao tema (sem hard-code de cores).
      </p>
      <pre><code>{`class CartaoDestaque extends StatelessWidget {
  final String texto;
  const CartaoDestaque({super.key, required this.texto});

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final textos = Theme.of(context).textTheme;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: scheme.primaryContainer,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Text(
        texto,
        style: textos.titleMedium?.copyWith(
          color: scheme.onPrimaryContainer,
        ),
      ),
    );
  }
}`}</code></pre>

      <AlertBox type="warning" title="Nunca hard-code Colors.white em texto">
        Em modo escuro, branco em fundo branco vira invisível. Sempre use <code>colorScheme.onPrimary</code>, <code>onSurface</code>, etc. — eles ajustam automaticamente.
      </AlertBox>

      <h2>Sub-temas: AppBar, Botões, Cards</h2>
      <p>
        Para personalizar o visual de um tipo de widget no app inteiro (ex.: todos os botões com cantos retos), use os sub-temas dentro de <code>ThemeData</code>.
      </p>
      <pre><code>{`ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepOrange),
  appBarTheme: const AppBarTheme(
    centerTitle: true,
    elevation: 0,
  ),
  filledButtonTheme: FilledButtonThemeData(
    style: FilledButton.styleFrom(
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    ),
  ),
  cardTheme: CardTheme(
    elevation: 1,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.circular(12),
    ),
  ),
  inputDecorationTheme: const InputDecorationTheme(
    border: OutlineInputBorder(),
    filled: true,
  ),
)`}</code></pre>

      <h2>Toggle dinâmico claro/escuro</h2>
      <pre><code>{`class MeuApp extends StatefulWidget {
  const MeuApp({super.key});
  @override
  State<MeuApp> createState() => _MeuAppState();
}

class _MeuAppState extends State<MeuApp> {
  ThemeMode _modo = ThemeMode.system;

  void _alternar() {
    setState(() {
      _modo = _modo == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      themeMode: _modo,
      theme: ThemeData(useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.green)),
      darkTheme: ThemeData(useMaterial3: true,
          colorScheme: ColorScheme.fromSeed(
              seedColor: Colors.green, brightness: Brightness.dark)),
      home: Scaffold(
        appBar: AppBar(title: const Text('Tema dinâmico')),
        floatingActionButton: FloatingActionButton(
          onPressed: _alternar,
          child: const Icon(Icons.brightness_6),
        ),
      ),
    );
  }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>useMaterial3: true</code></strong> em projetos antigos — a UI fica com visual M2 (mais retangular).</li>
        <li><strong>Hard-code de Colors</strong>: dificulta dark mode e troca de marca.</li>
        <li><strong>Definir cores no widget</strong> em vez de no tema — repetição cansa e quebra consistência.</li>
        <li><strong>Não passar <code>brightness: Brightness.dark</code></strong> ao gerar dark scheme — fica claro mesmo em dark mode.</li>
        <li><strong>Misturar TextStyle solto com textTheme</strong>: prefira <code>textTheme.bodyMedium</code> e ajuste com <code>copyWith</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>useMaterial3: true</code> ativa o Material 3 (padrão no Flutter atual).</li>
        <li><code>ColorScheme.fromSeed</code> gera paleta inteira a partir de uma cor.</li>
        <li><code>themeMode</code> + <code>theme</code>/<code>darkTheme</code> dão claro e escuro automático.</li>
        <li><code>Theme.of(context)</code> acessa o tema dentro de widgets.</li>
        <li>Sub-temas (appBarTheme, filledButtonTheme, cardTheme) padronizam componentes.</li>
        <li>Use sempre <code>colorScheme.onX</code> para textos sobre cor X.</li>
      </ul>
    </PageContainer>
  );
}
