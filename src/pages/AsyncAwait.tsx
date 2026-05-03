import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AsyncAwait() {
  return (
    <PageContainer
      title="async/await: código assíncrono que parece síncrono"
      subtitle="Dois pequenos modificadores que transformam o pesadelo de callbacks em código linear e legível."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine pedir um café numa cafeteria. Você espera o barista preparar (sem ir embora), recebe o copo e segue para a mesa. Em código síncrono, isso seria simples: uma linha após a outra. Mas em programação real, &quot;esperar&quot; sem bloquear a thread principal é difícil — daí nasceram os <em>callbacks</em>, depois <code>then</code>, e finalmente <code>async/await</code>, que devolve a sua sanidade ao deixar o código assíncrono <strong>parecer síncrono</strong>.
      </p>

      <h2>A palavra-chave async</h2>
      <p>
        Marcar uma função com <code>async</code> tem três efeitos: (1) o retorno é automaticamente embrulhado num <code>Future</code>; (2) você pode usar <code>await</code> dentro dela; (3) qualquer exceção lançada vira um Future com erro, em vez de quebrar o programa.
      </p>
      <pre><code>{`// Sem async: precisa montar Future na mão.
Future<int> dobroAntigo(int x) {
  return Future.value(x * 2);
}

// Com async: o compilador embrulha pra você.
Future<int> dobro(int x) async {
  return x * 2; // Dart converte em Future<int>.
}

void main() async {
  print(await dobro(21)); // 42
}`}</code></pre>
      <p>
        Note o tipo de retorno: mesmo que você escreva <code>return x * 2</code> (um <code>int</code> puro), a função declara <code>Future&lt;int&gt;</code>. O modificador <code>async</code> faz essa conversão automaticamente.
      </p>

      <h2>A palavra-chave await</h2>
      <p>
        <code>await</code> só pode aparecer dentro de função <code>async</code>. Ele <strong>pausa a função atual</strong> até o Future chegar, sem bloquear a thread — outras tarefas continuam rodando no event loop. Quando o valor chega, a função retoma do ponto exato onde parou.
      </p>
      <pre><code>{`Future<String> baixarHtml(String url) async {
  // Simula um fetch que demora 1s.
  await Future.delayed(const Duration(seconds: 1));
  return '<html>conteúdo de \$url</html>';
}

Future<void> mostrar() async {
  print('Iniciando download...');
  final html = await baixarHtml('https://exemplo.com');
  print('Recebi: \$html');
}

void main() async {
  await mostrar();
  print('Fim.');
}`}</code></pre>

      <AlertBox type="info" title="Pausar ≠ Bloquear">
        Quando uma função dá <code>await</code>, ela &quot;sai de cena&quot;. O event loop usa esse tempo para tratar outros eventos (animações, cliques, outras Futures). Sua função volta sozinha quando o Future resolve.
      </AlertBox>

      <h2>Tratamento de erros: try/catch normal</h2>
      <p>
        Uma das maiores vitórias do <code>async/await</code> é poder usar <code>try/catch</code> tradicional, em vez de empilhar <code>catchError</code>.
      </p>
      <pre><code>{`Future<int> dividir(int a, int b) async {
  if (b == 0) throw ArgumentError('Não dá pra dividir por zero!');
  await Future.delayed(const Duration(milliseconds: 100));
  return a ~/ b;
}

Future<void> exemplo() async {
  try {
    final r = await dividir(10, 0);
    print('Resultado: \$r');
  } on ArgumentError catch (e) {
    print('Erro de argumento: \${e.message}');
  } catch (e, st) {
    print('Erro inesperado: \$e');
    print(st);
  } finally {
    print('Sempre executa.');
  }
}`}</code></pre>

      <h2>Exemplo real: chamada HTTP</h2>
      <p>
        Suponha que você tenha o pacote <code>http</code> no <code>pubspec.yaml</code>. Veja como buscar dados da web fica trivial:
      </p>
      <pre><code>{`import 'dart:convert';
import 'package:http/http.dart' as http;

Future<Map<String, dynamic>> buscarUsuario(int id) async {
  final url = Uri.parse('https://jsonplaceholder.typicode.com/users/\$id');
  final resp = await http.get(url);
  if (resp.statusCode != 200) {
    throw Exception('Falha HTTP: \${resp.statusCode}');
  }
  return jsonDecode(resp.body) as Map<String, dynamic>;
}

void main() async {
  try {
    final user = await buscarUsuario(1);
    print('Nome: \${user['name']}');
  } catch (e) {
    print('Falhou: \$e');
  }
}`}</code></pre>

      <h2>O que async/await vira por baixo</h2>
      <p>
        O compilador transforma <code>async/await</code> em chamadas a <code>then</code>, <code>catchError</code> e máquinas de estado. Esse exemplo:
      </p>
      <pre><code>{`Future<int> soma() async {
  final a = await Future.value(1);
  final b = await Future.value(2);
  return a + b;
}`}</code></pre>
      <p>vira algo como:</p>
      <pre><code>{`Future<int> soma() {
  return Future.value(1).then((a) {
    return Future.value(2).then((b) {
      return a + b;
    });
  });
}`}</code></pre>
      <p>Você não escreve isso, mas é bom saber: <code>async/await</code> é <em>açúcar sintático</em>, não mágica.</p>

      <AlertBox type="warning" title="await em paralelo? Use Future.wait">
        Dois <code>await</code> seguidos rodam em série (um espera o outro). Para paralelizar, junte com <code>Future.wait([f1, f2])</code> e dê um <code>await</code> só no resultado.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>async</code>:</strong> usar <code>await</code> em função sem <code>async</code> é erro de compilação.</li>
        <li><strong>Esquecer <code>await</code>:</strong> sem ele você recebe o <code>Future</code>, não o valor — e o resultado vira <code>Instance of 'Future&lt;int&gt;'</code>.</li>
        <li><strong>Bloquear o main:</strong> <code>void main()</code> sem <code>async</code> não pode usar <code>await</code> direto.</li>
        <li><strong>Serializar tudo:</strong> sequência de <code>await</code> independente desperdiça tempo — use <code>Future.wait</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>async</code> marca a função: ela passa a retornar <code>Future</code>.</li>
        <li><code>await</code> pausa <em>essa função</em>, sem bloquear a thread.</li>
        <li>Erros são tratados com <code>try/catch</code> comum.</li>
        <li>Internamente vira <code>then/catchError</code> — açúcar sintático.</li>
        <li>Para paralelismo, use <code>Future.wait</code>.</li>
      </ul>
    </PageContainer>
  );
}
