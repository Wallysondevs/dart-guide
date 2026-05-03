import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Riverpod() {
  return (
    <PageContainer
      title="Riverpod: a evolução do Provider"
      subtitle="O mesmo autor, sem as armadilhas de BuildContext, com segurança em tempo de compilação."
      difficulty="avancado"
      timeToRead="16 min"
    >
      <p>
        Se Provider é o quadro de avisos da empresa, Riverpod é o sistema de mensagens corporativo: tipado, com histórico, sem precisar saber em que andar você está. Foi criado pelo mesmo autor (Remi Rousselet) para corrigir três dores reais de Provider: erros &quot;ProviderNotFoundException&quot; em runtime, dependência de <code>BuildContext</code> e dificuldade de compor providers. Hoje é, sem exagero, o padrão moderno para apps Flutter sérios.
      </p>

      <h2>Instalação e ProviderScope</h2>
      <pre><code>{`# pubspec.yaml
dependencies:
  flutter_riverpod: ^2.5.1`}</code></pre>
      <p>
        No <code>main</code>, embrulhe o app com <code>ProviderScope</code> — é onde Riverpod guarda todos os providers. Sem isso, nada funciona.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() => runApp(const ProviderScope(child: MeuApp()));

class MeuApp extends StatelessWidget {
  const MeuApp({super.key});
  @override
  Widget build(BuildContext context) =>
      const MaterialApp(home: TelaHome());
}`}</code></pre>

      <h2>Providers globais</h2>
      <p>
        Diferente de Provider, em Riverpod os providers são <strong>variáveis globais</strong>. Isso assusta no início (&quot;global é ruim!&quot;), mas como cada provider é imutável e o estado fica dentro do <code>ProviderScope</code>, na prática você ganha autocomplete em todo lugar e zero risco de erros em runtime.
      </p>
      <pre><code>{`// Provider mais simples: valor imutável.
final saudacaoProvider = Provider<String>((ref) => 'Olá, mundo');

// StateProvider: valor que muda (contador, switch).
final contadorProvider = StateProvider<int>((ref) => 0);

// FutureProvider: dado vindo de operação assíncrona.
final usuarioProvider = FutureProvider<Usuario>((ref) async {
  final api = ref.read(apiProvider);
  return api.buscarUsuarioLogado();
});

final apiProvider = Provider<ApiService>((ref) => ApiService());`}</code></pre>

      <h2>ConsumerWidget e ref</h2>
      <p>
        Para ler providers, troque <code>StatelessWidget</code> por <code>ConsumerWidget</code>. O método <code>build</code> recebe um <code>WidgetRef ref</code> — o objeto que conversa com Riverpod.
      </p>
      <pre><code>{`class TelaHome extends ConsumerWidget {
  const TelaHome({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // ref.watch: assina e reconstrói quando mudar.
    final contador = ref.watch(contadorProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Riverpod')),
      body: Center(child: Text('\${contador}')),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // ref.read: leitura única, sem rebuild.
          ref.read(contadorProvider.notifier).state++;
        },
        child: const Icon(Icons.add),
      ),
    );
  }
}`}</code></pre>

      <AlertBox type="info" title="Sem BuildContext nos métodos">
        Em Provider, você fazia <code>context.read&lt;T&gt;()</code>. Em Riverpod, é <code>ref.read(provider)</code>. Como <code>ref</code> é injetado, você não depende do <code>context</code> — pode chamá-lo dentro de async, futuros, qualquer lugar.
      </AlertBox>

      <h2>Notifier e AsyncNotifier (Riverpod 2.x)</h2>
      <p>
        Para lógica complexa, use <code>Notifier</code> (estado síncrono) ou <code>AsyncNotifier</code> (assíncrono). Substituem <code>StateNotifier</code> da v1.
      </p>
      <pre><code>{`class ContadorNotifier extends Notifier<int> {
  @override
  int build() => 0; // valor inicial

  void incrementar() => state++;
  void zerar() => state = 0;
}

final contadorNotifierProvider =
    NotifierProvider<ContadorNotifier, int>(ContadorNotifier.new);

// AsyncNotifier para dados que carregam.
class TarefasNotifier extends AsyncNotifier<List<Tarefa>> {
  @override
  Future<List<Tarefa>> build() async {
    final api = ref.read(apiProvider);
    return api.listarTarefas();
  }

  Future<void> adicionar(Tarefa t) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() async {
      final api = ref.read(apiProvider);
      await api.criar(t);
      return api.listarTarefas();
    });
  }
}`}</code></pre>

      <h2>Lendo AsyncValue na UI</h2>
      <pre><code>{`class TelaTarefas extends ConsumerWidget {
  const TelaTarefas({super.key});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final asyncTarefas = ref.watch(tarefasProvider);

    return asyncTarefas.when(
      loading: () => const CircularProgressIndicator(),
      error: (e, _) => Text('Erro: \$e'),
      data: (lista) => ListView(
        children: [for (final t in lista) ListTile(title: Text(t.titulo))],
      ),
    );
  }
}`}</code></pre>

      <h2>ref.listen: reagindo a mudanças</h2>
      <p>
        Às vezes você quer <em>reagir</em> a uma mudança sem reconstruir nada — por exemplo, mostrar um SnackBar quando a autenticação falhar. Use <code>ref.listen</code>:
      </p>
      <pre><code>{`@override
Widget build(BuildContext context, WidgetRef ref) {
  ref.listen<AsyncValue<Usuario>>(usuarioProvider, (anterior, atual) {
    atual.whenOrNull(
      error: (e, _) => ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('\$e'))),
    );
  });
  // ...
}`}</code></pre>

      <h2>Codegen com riverpod_generator</h2>
      <p>
        Em Dart 3, o pacote <code>riverpod_generator</code> permite escrever providers como funções anotadas, mais legível ainda:
      </p>
      <pre><code>{`@riverpod
class Contador extends _\$Contador {
  @override
  int build() => 0;
  void incrementar() => state++;
}

@riverpod
Future<Usuario> usuario(UsuarioRef ref) async {
  final api = ref.read(apiProvider);
  return api.buscarLogado();
}`}</code></pre>
      <p>
        O build gera os providers automaticamente. Roda com <code>dart run build_runner watch</code>. Se você gosta de annotations e codegen, esse é o caminho oficial moderno.
      </p>

      <AlertBox type="tip" title="Provider vs Riverpod">
        Aprenda Provider para entender o conceito; adote Riverpod no próximo projeto. Migrar não é trivial, mas os ganhos em segurança e ergonomia compensam.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>ProviderScope</code></strong>: <em>&quot;No ProviderScope found&quot;</em>.</li>
        <li><strong>Misturar <code>provider</code> e <code>flutter_riverpod</code></strong>: confusão de tipos. Escolha um.</li>
        <li><strong>Usar <code>ref.watch</code> em callback</strong>: warning. Use <code>read</code>.</li>
        <li><strong>Modificar <code>state</code> dentro do <code>build()</code></strong>: loop infinito.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Riverpod corrige erros runtime do Provider — tudo em compile time.</li>
        <li>Providers são variáveis globais imutáveis dentro de <code>ProviderScope</code>.</li>
        <li><code>ref.watch</code> em build, <code>ref.read</code> em callbacks, <code>ref.listen</code> para efeitos.</li>
        <li><code>AsyncNotifier</code> + <code>AsyncValue.when</code> tratam loading/error/data elegantemente.</li>
        <li><code>riverpod_generator</code> moderniza com annotations.</li>
      </ul>
    </PageContainer>
  );
}
