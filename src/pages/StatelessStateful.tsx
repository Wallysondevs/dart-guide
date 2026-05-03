import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StatelessStateful() {
  return (
    <PageContainer
      title="StatelessWidget vs StatefulWidget"
      subtitle="A diferença entre widgets imutáveis e widgets que guardam estado, com setState, initState e dispose."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine dois tipos de placas em uma rua: uma placa de "Pare" (sempre vermelha, octogonal, escrito "PARE" — nunca muda) e um painel eletrônico que mostra a temperatura (muda a cada minuto). Em Flutter, a placa de Pare é um <strong>StatelessWidget</strong> — desenhado uma vez e nunca se atualiza por conta própria. O painel é um <strong>StatefulWidget</strong> — guarda informação interna (o número da temperatura) e se redesenha quando essa informação muda.
      </p>

      <h2>StatelessWidget: a placa imutável</h2>
      <p>
        Um <strong>StatelessWidget</strong> só depende dos dados que recebe pelo construtor. Se esses dados não mudam, ele renderiza a mesma coisa para sempre. É leve, previsível e a primeira escolha sempre que possível.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class Saudacao extends StatelessWidget {
  // Os dados vêm de fora: nome é final (não pode ser alterado depois).
  final String nome;
  const Saudacao({super.key, required this.nome});

  @override
  Widget build(BuildContext context) {
    // build retorna a árvore de UI baseada APENAS no nome.
    return Text('Olá, \$nome!');
  }
}

// Uso:
// Saudacao(nome: 'Ana')`}</code></pre>

      <h2>StatefulWidget: o painel que muda</h2>
      <p>
        Um <strong>StatefulWidget</strong> tem duas classes: o widget em si (imutável, como o Stateless) e uma classe <code>State</code> separada que guarda os dados que mudam. A separação parece estranha, mas existe por uma razão: o widget pode ser destruído e recriado pelo Flutter a qualquer momento, mas o objeto <code>State</code> sobrevive.
      </p>
      <pre><code>{`class Contador extends StatefulWidget {
  const Contador({super.key});

  @override
  State<Contador> createState() => _ContadorState();
}

class _ContadorState extends State<Contador> {
  // Dados que mudam ficam aqui, NÃO no widget.
  int _valor = 0;

  void _incrementar() {
    // setState avisa ao Flutter: "redesenhe-me, mudei!"
    setState(() {
      _valor++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Você clicou \$_valor vezes'),
        FilledButton(
          onPressed: _incrementar,
          child: const Text('Clique aqui'),
        ),
      ],
    );
  }
}`}</code></pre>

      <AlertBox type="info" title="Por que duas classes?">
        O widget é a "planta" e pode ser jogado fora a qualquer momento (por exemplo, quando muda o tema). O <code>State</code> é a "memória" — sobrevive a essas reconstruções, então o contador não volta para zero quando o pai re-renderiza.
      </AlertBox>

      <h2>O ciclo de vida do State</h2>
      <p>
        Um objeto <code>State</code> tem fases bem definidas: nasce (<code>initState</code>), é desenhado várias vezes (<code>build</code>), atualiza quando o pai muda (<code>didUpdateWidget</code>) e é destruído (<code>dispose</code>). É como uma pessoa: nasce, vive, morre. Você usa esses ganchos para iniciar coisas (timer, escuta de stream) e <em>desfazê-las</em> antes de morrer.
      </p>
      <pre><code>{`class _ContadorState extends State<Contador> {
  late final Stopwatch _cronometro;

  @override
  void initState() {
    super.initState();
    // Chamado UMA vez quando o State é criado.
    _cronometro = Stopwatch()..start();
    debugPrint('State nasceu');
  }

  @override
  void didUpdateWidget(covariant Contador oldWidget) {
    super.didUpdateWidget(oldWidget);
    // Chamado quando o widget pai reconstrói passando novos dados.
  }

  @override
  void dispose() {
    // Chamado UMA vez antes do State morrer.
    // Cancele timers, feche streams, libere controllers AQUI.
    _cronometro.stop();
    debugPrint('State morreu');
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Text('Tempo: \${_cronometro.elapsedMilliseconds} ms');
  }
}`}</code></pre>

      <AlertBox type="warning" title="Esquecer dispose vaza memória">
        Toda <code>AnimationController</code>, <code>TextEditingController</code>, <code>StreamSubscription</code> ou <code>Timer</code> que você cria precisa ser cancelado em <code>dispose</code>. Senão eles continuam vivos depois da tela fechar e consomem memória/CPU.
      </AlertBox>

      <h2>Quando usar cada um?</h2>
      <p>
        A regra prática: <strong>comece sempre Stateless</strong>. Só vire Stateful quando o widget precisar guardar dados que mudam <em>internamente</em> (sem vir do pai). Em apps reais, mais de 80% dos widgets podem ser Stateless — o estado fica em camadas superiores (Provider, Riverpod, Bloc, etc.).
      </p>
      <ul>
        <li><strong>Stateless</strong>: cards, listas que recebem dados, ícones, textos, botões.</li>
        <li><strong>Stateful</strong>: animações locais, formulários com TextEditingController, abas com TabController, qualquer coisa com timer interno.</li>
      </ul>

      <h2>setState com cuidado</h2>
      <p>
        <code>setState</code> agenda um <strong>rebuild</strong> do widget inteiro. Não é instantâneo: o Flutter junta várias mudanças no mesmo frame. Algumas regras:
      </p>
      <pre><code>{`// CORRETO: setState recebe a função que muda o estado.
setState(() {
  _valor++;
});

// ERRADO: setState VAZIO depois de mudar fora dele dá warning,
// mas o jeito certo é colocar a mutação DENTRO do callback.
_valor++;
setState(() {});

// ERRADO: chamar setState depois de dispose lança exceção.
// Sempre cheque mounted antes em callbacks async:
await Future.delayed(const Duration(seconds: 2));
if (!mounted) return;
setState(() => _valor = 99);`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer setState</strong>: você muda a variável e a tela não atualiza — Flutter não tem reatividade automática.</li>
        <li><strong>setState dentro de build</strong>: causa loop infinito de rebuild. Nunca chame setState dentro do método build.</li>
        <li><strong>Estado em variável global</strong>: dificulta testes e cresce mal. Mantenha estado local ou use gerenciador de estado.</li>
        <li><strong>Usar Stateful onde Stateless basta</strong>: gasta memória à toa.</li>
        <li><strong>Esquecer <code>mounted</code></strong> em callbacks async — ao retornar, o State pode já ter sido destruído.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>StatelessWidget: imutável, depende só de dados externos.</li>
        <li>StatefulWidget: guarda estado em uma classe <code>State</code> separada.</li>
        <li><code>setState</code> agenda rebuild da subárvore.</li>
        <li>Lifecycle: <code>initState</code> → <code>build</code> (várias vezes) → <code>dispose</code>.</li>
        <li>Sempre limpe recursos em <code>dispose</code> e cheque <code>mounted</code> em código async.</li>
        <li>Prefira Stateless; só use Stateful quando realmente precisar.</li>
      </ul>
    </PageContainer>
  );
}
