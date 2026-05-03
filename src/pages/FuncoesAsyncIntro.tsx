import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FuncoesAsyncIntro() {
  return (
    <PageContainer
      title="Introdução a funções async: o que muda"
      subtitle="Quando o resultado não chega na hora — entendendo Future, async e await sem dor."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Imagine pedir uma pizza pelo telefone. Você não fica parado segurando o fone até a pizza chegar — você desliga, vai fazer outra coisa, e quando a pizza toca a campainha, você atende. Em programação, muitas operações funcionam assim: pedir um arquivo do disco, baixar dados da internet, esperar o usuário tocar num botão. Tudo isso leva tempo. Se a sua função ficasse "segurando o fone", o programa <em>congelaria</em>. A solução em Dart se chama <strong>função assíncrona</strong>, marcada com <code>async</code> e <code>await</code>.
      </p>

      <h2>O conceito de Future</h2>
      <p>
        Um <strong>Future</strong> é um "vale": uma promessa de que algum valor vai chegar mais tarde. <code>Future&lt;int&gt;</code> significa "no futuro vou te entregar um <code>int</code>". O Future pode estar em três estados: <em>pendente</em> (esperando), <em>concluído com valor</em> ou <em>concluído com erro</em>.
      </p>
      <pre><code>{`// Future criado manualmente para ilustrar.
Future<String> buscarSaudacao() {
  return Future.delayed(
    const Duration(seconds: 2),
    () => 'Olá, mundo!',
  );
}

void main() {
  print('Antes da chamada');
  buscarSaudacao().then((s) => print(s));
  print('Depois da chamada');
}
// Saída:
//   Antes da chamada
//   Depois da chamada
//   (após 2 s) Olá, mundo!`}</code></pre>
      <p>
        Note que "Depois da chamada" aparece <em>antes</em> da saudação. O programa não esperou — seguiu rodando. Quando o Future ficou pronto, o callback do <code>.then</code> disparou.
      </p>

      <AlertBox type="info" title="Future vs Promise (JS)">
        Se você vem de JavaScript, <code>Future</code> em Dart é praticamente o mesmo que <code>Promise</code>. Ambos representam um valor que ainda vai chegar, com APIs equivalentes (<code>.then</code>, <code>.catchError</code>, <code>async/await</code>).
      </AlertBox>

      <h2>async + await: código assíncrono que parece síncrono</h2>
      <p>
        Trabalhar com <code>.then(...)</code> aninhado vira um inferno rapidamente. <code>async</code> e <code>await</code> resolvem isso: você marca a função com <code>async</code> e usa <code>await</code> antes de cada Future. O código fica linear, lendo de cima para baixo, mas continua não-bloqueante.
      </p>
      <pre><code>{`Future<String> buscarNome() async {
  await Future.delayed(const Duration(seconds: 1));
  return 'Ana';
}

Future<int> buscarIdade() async {
  await Future.delayed(const Duration(seconds: 1));
  return 30;
}

Future<void> main() async {
  print('Buscando...');
  final nome = await buscarNome();   // pausa aqui, sem travar
  final idade = await buscarIdade(); // pausa aqui, sem travar
  print('\$nome tem \$idade anos');
}`}</code></pre>
      <p>
        <strong>Importantíssimo</strong>: <code>await</code> <em>pausa</em> a função atual sem <em>bloquear</em> o programa inteiro. Outras tarefas (animações, eventos de toque, timers) continuam rodando enquanto o Future não termina.
      </p>

      <h2>Tipo de retorno de funções async</h2>
      <p>
        Toda função marcada com <code>async</code> devolve um <code>Future</code>. Se você escreve <code>return 42;</code> dentro de uma função async, o tipo real é <code>Future&lt;int&gt;</code>. Para "não devolve nada", use <code>Future&lt;void&gt;</code>.
      </p>
      <pre><code>{`Future<int> calcularLento() async {
  await Future.delayed(const Duration(milliseconds: 500));
  return 42;
}

Future<void> registrarEvento() async {
  await Future.delayed(const Duration(milliseconds: 100));
  print('Evento gravado');
}

void main() async {
  final n = await calcularLento();
  print(n); // 42
  await registrarEvento();
}`}</code></pre>

      <h2>Tratando erros: try/catch funciona</h2>
      <p>
        Com <code>async/await</code>, erros viram exceções normais. Use <code>try/catch</code> como faria em código síncrono.
      </p>
      <pre><code>{`Future<int> dividir(int a, int b) async {
  await Future.delayed(const Duration(milliseconds: 100));
  if (b == 0) throw ArgumentError('Divisão por zero');
  return a ~/ b;
}

Future<void> main() async {
  try {
    final r = await dividir(10, 0);
    print(r);
  } catch (e) {
    print('Erro: \$e'); // Erro: Invalid argument(s): Divisão por zero
  }
}`}</code></pre>

      <h2>Exemplo prático: requisição HTTP</h2>
      <p>
        O caso mais comum de async é chamada de rede. Veja um exemplo com o pacote <code>http</code> (precisa estar no <code>pubspec.yaml</code>).
      </p>
      <pre><code>{`import 'dart:convert';
import 'package:http/http.dart' as http;

Future<String> buscarUsuario(int id) async {
  final url = Uri.parse('https://api.exemplo.com/usuarios/\$id');
  final resposta = await http.get(url);

  if (resposta.statusCode == 200) {
    final dados = jsonDecode(resposta.body) as Map<String, dynamic>;
    return dados['nome'] as String;
  } else {
    throw Exception('Falha HTTP: \${resposta.statusCode}');
  }
}

Future<void> main() async {
  try {
    final nome = await buscarUsuario(1);
    print('Usuário: \$nome');
  } catch (e) {
    print('Não conseguiu carregar: \$e');
  }
}`}</code></pre>

      <h2>Paralelismo com Future.wait</h2>
      <p>
        Se você precisa esperar <em>vários</em> Futures, não os <code>await</code> um após o outro — execute em paralelo com <code>Future.wait</code>.
      </p>
      <pre><code>{`Future<String> baixar(String url) async {
  await Future.delayed(const Duration(seconds: 1));
  return 'conteúdo de \$url';
}

Future<void> main() async {
  // Sequencial: 3 segundos no total.
  // final a = await baixar('a'); final b = await baixar('b'); final c = await baixar('c');

  // Paralelo: 1 segundo no total.
  final resultados = await Future.wait([
    baixar('a'),
    baixar('b'),
    baixar('c'),
  ]);
  print(resultados);
}`}</code></pre>

      <AlertBox type="warning" title="Esquecer o await é perigoso">
        Se você chama <code>buscarUsuario(1);</code> sem <code>await</code>, o Future começa mas você não espera o resultado nem pega exceções. Em modo strict, o linter avisa com <em>"unawaited_futures"</em>. Para Futures intencionalmente "fire-and-forget", use <code>unawaited(buscarUsuario(1));</code>.
      </AlertBox>

      <h2>Em Flutter: async no botão</h2>
      <pre><code>{`import 'package:flutter/material.dart';

class TelaCarregar extends StatefulWidget {
  const TelaCarregar({super.key});
  @override
  State<TelaCarregar> createState() => _TelaCarregarState();
}

class _TelaCarregarState extends State<TelaCarregar> {
  String _resultado = 'Toque para carregar';
  bool _carregando = false;

  Future<String> _buscar() async {
    await Future.delayed(const Duration(seconds: 2));
    return 'Dados prontos!';
  }

  Future<void> _aoTocar() async {
    setState(() => _carregando = true);
    try {
      final r = await _buscar();
      if (!mounted) return;
      setState(() => _resultado = r);
    } finally {
      if (mounted) setState(() => _carregando = false);
    }
  }

  @override
  Widget build(BuildContext context) => Scaffold(
    body: Center(
      child: _carregando
          ? const CircularProgressIndicator()
          : ElevatedButton(onPressed: _aoTocar, child: Text(_resultado)),
    ),
  );
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>async</code></strong>: usar <code>await</code> sem marcar a função dá erro de compilação.</li>
        <li><strong>Esquecer <code>await</code></strong>: o Future fica solto, sem ser esperado nem tratado.</li>
        <li><strong>Bloquear com loop</strong>: substituir <code>await</code> por <code>while (!future.done)</code> trava a UI inteira.</li>
        <li><strong>Tipo errado</strong>: escrever <code>int</code> como retorno de função async; o correto é <code>Future&lt;int&gt;</code>.</li>
        <li><strong>Acessar context após await em Flutter</strong> sem checar <code>mounted</code> — causa erros se a tela já foi fechada.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Future&lt;T&gt;</code> é uma promessa de um valor futuro.</li>
        <li><code>async</code> marca a função; <code>await</code> pausa-a sem travar o programa.</li>
        <li>Função async sempre retorna <code>Future</code>; use <code>Future&lt;void&gt;</code> para "nada".</li>
        <li><code>try/catch</code> trata erros como em código síncrono.</li>
        <li><code>Future.wait</code> roda múltiplos Futures em paralelo.</li>
        <li>Em Flutter, sempre cheque <code>mounted</code> antes de mexer no estado após um <code>await</code>.</li>
      </ul>
    </PageContainer>
  );
}
