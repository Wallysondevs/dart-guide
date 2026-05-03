import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Bloc() {
  return (
    <PageContainer
      title="BLoC: separação rigorosa de UI e lógica"
      subtitle="Quando a disciplina arquitetural compensa: eventos entram, estados saem, nada de meio-termo."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <p>
        BLoC (Business Logic Component) é uma arquitetura inspirada no Redux do mundo React. A ideia é radical: a UI <strong>nunca</strong> chama métodos da lógica diretamente. Em vez disso, ela despacha <em>eventos</em> (&quot;o usuário clicou&quot;, &quot;a tela carregou&quot;), e a lógica responde com <em>estados</em> (&quot;carregando&quot;, &quot;dados prontos&quot;, &quot;erro&quot;). Pense num restaurante: o cliente (UI) entrega o pedido (evento) ao garçom; a cozinha (BLoC) prepara e devolve o prato (estado). Ninguém entra na cozinha.
      </p>

      <h2>Instalação</h2>
      <pre><code>{`# pubspec.yaml
dependencies:
  flutter_bloc: ^8.1.6
  equatable: ^2.0.5  # facilita comparar estados`}</code></pre>

      <h2>Definindo Eventos e Estados</h2>
      <p>
        Em Dart 3, use <code>sealed class</code> para Eventos e Estados — isso garante que o compilador exija tratar todos os casos no <code>switch</code>.
      </p>
      <pre><code>{`// Eventos: o que pode acontecer.
sealed class ContadorEvento {}
final class Incrementou extends ContadorEvento {}
final class Decrementou extends ContadorEvento {}
final class Zerou extends ContadorEvento {}

// Estado: tudo que a UI precisa para renderizar.
final class ContadorEstado {
  final int valor;
  const ContadorEstado(this.valor);
}`}</code></pre>

      <h2>Bloc&lt;Event, State&gt;</h2>
      <p>
        A classe <code>Bloc</code> recebe dois parâmetros de tipo: o tipo do evento e o do estado. O construtor define o estado inicial; dentro dele, você registra handlers para cada evento via <code>on&lt;Tipo&gt;</code>. A API antiga era <code>mapEventToState</code> (gerador async*); foi aposentada em favor de <code>on&lt;E&gt;</code>, mais simples e rápida.
      </p>
      <pre><code>{`import 'package:flutter_bloc/flutter_bloc.dart';

class ContadorBloc extends Bloc<ContadorEvento, ContadorEstado> {
  ContadorBloc() : super(const ContadorEstado(0)) {
    on<Incrementou>((event, emit) {
      emit(ContadorEstado(state.valor + 1));
    });
    on<Decrementou>((event, emit) {
      emit(ContadorEstado(state.valor - 1));
    });
    on<Zerou>((event, emit) {
      emit(const ContadorEstado(0));
    });
  }
}`}</code></pre>
      <p>
        A função recebe o <code>event</code> (o evento despachado) e um <code>emit</code> (que publica um novo estado). Note que estados são <strong>imutáveis</strong>: você não muda o valor; cria um estado novo e emite. Isso facilita testes, undo/redo e debug em viagem no tempo.
      </p>

      <h2>BlocProvider e BlocBuilder na UI</h2>
      <pre><code>{`import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

void main() => runApp(const App());

class App extends StatelessWidget {
  const App({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: BlocProvider(
        create: (_) => ContadorBloc(),
        child: const TelaContador(),
      ),
    );
  }
}

class TelaContador extends StatelessWidget {
  const TelaContador({super.key});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bloc')),
      body: Center(
        child: BlocBuilder<ContadorBloc, ContadorEstado>(
          builder: (context, estado) =>
              Text('\${estado.valor}', style: const TextStyle(fontSize: 48)),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () =>
            context.read<ContadorBloc>().add(Incrementou()),
        child: const Icon(Icons.add),
      ),
    );
  }
}`}</code></pre>

      <AlertBox type="info" title="A regra de ouro do BLoC">
        UI <strong>não chama método</strong>; UI <strong>despacha evento</strong> com <code>add()</code>. UI <strong>não muda estado</strong>; ela <strong>reage</strong> ao estado atual via <code>BlocBuilder</code>. Essa disciplina compensa em apps grandes.
      </AlertBox>

      <h2>BlocListener e BlocConsumer</h2>
      <p>
        <code>BlocBuilder</code> reconstrói widgets a cada novo estado. <code>BlocListener</code> escuta sem reconstruir — perfeito para SnackBars, navegação, diálogos. <code>BlocConsumer</code> combina os dois.
      </p>
      <pre><code>{`BlocListener<AuthBloc, AuthState>(
  listener: (context, state) {
    if (state is AuthErrorState) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(state.mensagem)),
      );
    }
  },
  child: const FormularioLogin(),
);`}</code></pre>

      <h2>Cubit: o BLoC simplificado</h2>
      <p>
        Para casos simples, o boilerplate de eventos é exagero. Um <code>Cubit</code> dispensa o tipo Evento — você expõe métodos públicos que internamente chamam <code>emit</code>. Mais leve, mantém a API <code>BlocProvider</code>/<code>BlocBuilder</code> compatível.
      </p>
      <pre><code>{`class ContadorCubit extends Cubit<int> {
  ContadorCubit() : super(0);

  void incrementar() => emit(state + 1);
  void decrementar() => emit(state - 1);
  void zerar() => emit(0);
}

// Na UI:
context.read<ContadorCubit>().incrementar();
BlocBuilder<ContadorCubit, int>(
  builder: (context, valor) => Text('\${valor}'),
);`}</code></pre>

      <AlertBox type="tip" title="Quando usar Cubit?">
        Comece com Cubit. Migre para Bloc quando: (1) precisar registrar histórico de eventos para auditoria; (2) tiver eventos que se sobrepõem (debounce, transformações de stream); (3) quiser separar gatilho de ação.
      </AlertBox>

      <h2>Estados como sealed class (Dart 3)</h2>
      <p>
        Para representar carregando/erro/sucesso, use <code>sealed class</code> + pattern matching. O compilador garante exaustividade.
      </p>
      <pre><code>{`sealed class ProdutoState {}
final class Carregando extends ProdutoState {}
final class Sucesso extends ProdutoState {
  final List<Produto> itens;
  Sucesso(this.itens);
}
final class Falhou extends ProdutoState {
  final String erro;
  Falhou(this.erro);
}

// Na UI:
BlocBuilder<ProdutoBloc, ProdutoState>(
  builder: (context, s) => switch (s) {
    Carregando() => const CircularProgressIndicator(),
    Sucesso(:final itens) => ListaProdutos(itens),
    Falhou(:final erro) => Text('Erro: \$erro'),
  },
);`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Mutar o estado em vez de emitir novo</strong>: BlocBuilder não rebuilda.</li>
        <li><strong>Esquecer <code>BlocProvider</code> acima</strong>: <em>BlocProviderNotFound</em>.</li>
        <li><strong>Misturar lógica de UI no Bloc</strong>: nada de <code>BuildContext</code> ali dentro.</li>
        <li><strong>Eventos com lógica gigante</strong>: quebre em mais eventos pequenos.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Bloc: UI envia eventos, recebe estados — separação rigorosa.</li>
        <li><code>on&lt;Evento&gt;</code> registra handlers; <code>emit</code> publica estado.</li>
        <li><code>BlocProvider</code> injeta; <code>BlocBuilder</code>/<code>BlocListener</code>/<code>BlocConsumer</code> consomem.</li>
        <li>Cubit é a versão sem evento — comece por ele.</li>
        <li><code>sealed class</code> + <code>switch</code> tornam estados exaustivos.</li>
      </ul>
    </PageContainer>
  );
}
