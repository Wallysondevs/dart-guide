import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NavigatorPush() {
  return (
    <PageContainer
      title="Navegação entre telas: Navigator 1.0"
      subtitle="Como empilhar e desempilhar telas com push, pop, named routes e argumentos."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Pense em uma pilha de pratos numa cantina: você empurra um prato no topo (<em>push</em>) e tira o de cima quando precisa (<em>pop</em>). Isso é exatamente como o <strong>Navigator</strong> do Flutter funciona: cada tela é um prato; quando você abre uma nova, ela é empilhada por cima da atual; quando o usuário aperta o botão de voltar, o prato do topo é tirado e a tela anterior reaparece. Esse modelo é chamado de <strong>Navigator 1.0</strong>, é simples e resolve a maior parte dos casos.
      </p>

      <h2>O básico: push e pop</h2>
      <p>
        Para empurrar uma tela nova, você chama <code>Navigator.push</code> passando um <strong>route</strong> (uma "instrução de como construir a próxima tela"). O mais comum é <code>MaterialPageRoute</code>, que dá animação de slide nativa de cada plataforma.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class TelaA extends StatelessWidget {
  const TelaA({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tela A')),
      body: Center(
        child: FilledButton(
          onPressed: () {
            // Empilha a TelaB por cima da TelaA.
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const TelaB()),
            );
          },
          child: const Text('Abrir Tela B'),
        ),
      ),
    );
  }
}

class TelaB extends StatelessWidget {
  const TelaB({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Tela B')),
      body: Center(
        child: OutlinedButton(
          onPressed: () {
            // Tira esta tela da pilha e volta para A.
            Navigator.pop(context);
          },
          child: const Text('Voltar'),
        ),
      ),
    );
  }
}`}</code></pre>

      <AlertBox type="info" title="O botão de voltar é automático">
        A AppBar mostra automaticamente uma seta de voltar quando há uma tela na pilha embaixo. No Android o botão físico/gesture também faz pop sem você precisar codar nada.
      </AlertBox>

      <h2>Devolvendo dados ao voltar</h2>
      <p>
        Você pode <em>retornar um valor</em> da tela empurrada. <code>push</code> devolve um <code>Future</code> que completa quando a próxima tela faz <code>pop</code>. O valor passado para o pop chega como resultado.
      </p>
      <pre><code>{`// Tela A: aguarda o resultado.
final resultado = await Navigator.push<String>(
  context,
  MaterialPageRoute(builder: (_) => const TelaEscolha()),
);
debugPrint('Usuário escolheu: \$resultado');

// Tela B: devolve um valor.
Navigator.pop(context, 'pizza de queijo');`}</code></pre>

      <h2>pushReplacement e pushAndRemoveUntil</h2>
      <p>
        Nem sempre você quer empilhar — às vezes quer <em>substituir</em>. Por exemplo, depois do login, não faz sentido o usuário voltar para a tela de login com o botão de voltar.
      </p>
      <pre><code>{`// Substitui a tela atual (descarta a antiga).
Navigator.pushReplacement(
  context,
  MaterialPageRoute(builder: (_) => const TelaPrincipal()),
);

// Empilha nova tela e REMOVE TODAS as anteriores.
Navigator.pushAndRemoveUntil(
  context,
  MaterialPageRoute(builder: (_) => const TelaPrincipal()),
  (route) => false, // false = nunca pare, remova tudo
);`}</code></pre>

      <h2>Named routes: roteamento por string</h2>
      <p>
        Em vez de criar a tela inline em cada push, você pode registrar todas as telas no <code>MaterialApp</code> e referenciá-las por nome. Bom para apps com muitas rotas, ruim para passar argumentos tipados.
      </p>
      <pre><code>{`MaterialApp(
  initialRoute: '/',
  routes: {
    '/': (context) => const TelaInicial(),
    '/perfil': (context) => const TelaPerfil(),
    '/configuracoes': (context) => const TelaConfig(),
  },
)

// Em qualquer lugar do app:
Navigator.pushNamed(context, '/perfil');

// Voltar para a raiz removendo tudo:
Navigator.pushNamedAndRemoveUntil(context, '/', (r) => false);`}</code></pre>

      <h2>Passando argumentos</h2>
      <p>
        Se você precisa enviar dados (id de produto, objeto, etc.), há duas formas: passar pelo construtor (mais tipado, recomendado) ou via parâmetro <code>arguments</code> (mais flexível, mas precisa fazer cast).
      </p>
      <pre><code>{`// FORMA 1: pelo construtor (recomendada)
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (_) => DetalheProduto(idProduto: 42),
  ),
);

class DetalheProduto extends StatelessWidget {
  final int idProduto;
  const DetalheProduto({super.key, required this.idProduto});

  @override
  Widget build(BuildContext context) {
    return Scaffold(body: Center(child: Text('Produto \$idProduto')));
  }
}

// FORMA 2: via arguments (named route)
Navigator.pushNamed(
  context,
  '/detalhe',
  arguments: {'id': 42, 'nome': 'Notebook'},
);

// Recuperar dentro da tela:
final args = ModalRoute.of(context)!.settings.arguments
    as Map<String, dynamic>;
final id = args['id'] as int;`}</code></pre>

      <AlertBox type="warning" title="Cast de arguments é inseguro">
        Como <code>arguments</code> é tipado como <code>Object?</code>, você precisa fazer cast manual e isso pode quebrar em runtime. Para apps grandes, prefira <code>onGenerateRoute</code> com tipagem ou pacotes como <code>go_router</code>.
      </AlertBox>

      <h2>Diálogos e bottom sheets também são "telas"</h2>
      <p>
        <code>showDialog</code> e <code>showModalBottomSheet</code> também usam o Navigator por baixo dos panos. Eles devolvem um Future com o resultado, igualzinho ao push.
      </p>
      <pre><code>{`final confirmou = await showDialog<bool>(
  context: context,
  builder: (ctx) => AlertDialog(
    title: const Text('Excluir item?'),
    actions: [
      TextButton(
        onPressed: () => Navigator.pop(ctx, false),
        child: const Text('Cancelar'),
      ),
      FilledButton(
        onPressed: () => Navigator.pop(ctx, true),
        child: const Text('Excluir'),
      ),
    ],
  ),
);
if (confirmou == true) {
  debugPrint('Confirmou exclusão');
}`}</code></pre>

      <h2>Prévia: Navigator 2.0 e go_router</h2>
      <p>
        Para apps complexos com URLs (web), deep links e fluxos avançados, surgiu o <strong>Navigator 2.0</strong> — uma API declarativa em que você descreve toda a pilha em função do estado. É poderosa mas <em>verbosa</em>. Por isso a comunidade adotou o pacote <strong>go_router</strong> (oficial da Flutter Team), que esconde a complexidade.
      </p>
      <pre><code>{`// pubspec.yaml
// dependencies:
//   go_router: ^14.0.0

import 'package:go_router/go_router.dart';

final router = GoRouter(
  routes: [
    GoRoute(path: '/', builder: (_, __) => const TelaInicial()),
    GoRoute(path: '/produto/:id', builder: (ctx, st) {
      final id = st.pathParameters['id']!;
      return DetalheProduto(idProduto: int.parse(id));
    }),
  ],
);

MaterialApp.router(
  routerConfig: router,
)`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Navigator.pop sem nada na pilha</strong>: fecha o app no Android. Cheque <code>Navigator.canPop(context)</code> antes.</li>
        <li><strong>Push em StatelessWidget pelo context errado</strong>: use o context da função <code>build</code>, não um capturado fora.</li>
        <li><strong>Esquecer <code>await</code></strong> ao esperar resultado do push.</li>
        <li><strong>Cast de arguments errado</strong>: lança <code>TypeError</code> em runtime — prefira passar pelo construtor.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Navigator.push</code> empilha tela; <code>Navigator.pop</code> retira.</li>
        <li><code>MaterialPageRoute</code> dá animação nativa por plataforma.</li>
        <li><code>pop(context, valor)</code> devolve um resultado para quem chamou push.</li>
        <li><code>pushReplacement</code> e <code>pushAndRemoveUntil</code> trocam a pilha.</li>
        <li>Named routes simplificam apps grandes mas perdem tipagem em arguments.</li>
        <li>Para apps complexos/web, considere <code>go_router</code>.</li>
      </ul>
    </PageContainer>
  );
}
