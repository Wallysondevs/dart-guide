import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ConsoleIo() {
  return (
    <PageContainer
      title="Lendo e escrevendo no console com stdin/stdout"
      subtitle="Como construir programas interativos de linha de comando: imprimir mensagens, ler entrada do usuário e validar com segurança."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Antes de existirem janelas e botões, todo programa rodava em um <strong>terminal</strong>: uma tela preta com texto. O programa imprimia perguntas, o usuário digitava respostas, e tudo seguia em prosa. Esse modo de comunicação ainda é fundamental — scripts de automação, ferramentas para programadores e até bots usam <strong>stdin</strong> (entrada padrão) e <strong>stdout</strong> (saída padrão). Em Dart, essas portas estão na biblioteca <code>dart:io</code>, e dominá-las é o primeiro passo para construir CLIs (interfaces de linha de comando) profissionais.
      </p>

      <h2><code>print</code>: o básico do básico</h2>
      <p>
        <code>print</code> é uma função embutida em Dart que envia um valor para a saída padrão e adiciona uma quebra de linha no fim. Não precisa de import.
      </p>
      <pre><code>{`void main() {
  print('Olá!');
  print(42);              // chama .toString() automaticamente
  print([1, 2, 3]);
  print('Total: \${10 + 20}'); // interpolação
}`}</code></pre>
      <p>
        Por baixo dos panos, <code>print</code> chama <code>stdout.writeln(...)</code>. É ótimo para debug rápido, mas em programas mais sofisticados queremos controle fino sobre a quebra de linha — e aí entra <code>stdout</code>.
      </p>

      <h2><code>stdout.write</code> vs <code>stdout.writeln</code></h2>
      <p>
        <code>write</code> escreve <strong>sem</strong> adicionar quebra de linha — útil para escrever na mesma linha (barras de progresso, prompts). <code>writeln</code> equivale ao <code>print</code> tradicional.
      </p>
      <pre><code>{`import 'dart:io';

void main() {
  stdout.write('Carregando');
  for (var i = 0; i < 3; i++) {
    stdout.write('.');
    sleep(Duration(milliseconds: 500));
  }
  stdout.writeln(' pronto!');
  // Saída: "Carregando... pronto!" em uma única linha
}`}</code></pre>

      <AlertBox type="info" title="Por que dart:io?">
        <code>dart:io</code> é a biblioteca padrão para entrada/saída em Dart fora do navegador. Ela só funciona em ambientes nativos (CLI, servidor, mobile). Em apps Flutter Web, <code>stdin/stdout</code> não existem.
      </AlertBox>

      <h2><code>stdin.readLineSync</code>: lendo do usuário</h2>
      <p>
        Para receber texto digitado no terminal, use <code>stdin.readLineSync()</code>. Ele bloqueia o programa até o usuário pressionar Enter, e devolve a linha como <code>String?</code> (pode ser <code>null</code> se a entrada for fechada com Ctrl+D / Ctrl+Z).
      </p>
      <pre><code>{`import 'dart:io';

void main() {
  stdout.write('Qual é o seu nome? ');
  String? nome = stdin.readLineSync();

  if (nome == null || nome.isEmpty) {
    print('Você não digitou nada!');
    return;
  }

  print('Olá, \$nome! Bem-vindo.');
}`}</code></pre>

      <h2>Validando entrada com <code>tryParse</code></h2>
      <p>
        Tudo que vem do <code>stdin</code> é texto. Se você quer um número, precisa <strong>converter</strong>. E como o usuário pode digitar qualquer coisa, sempre use <code>tryParse</code> em vez de <code>parse</code>: assim, em vez de o programa explodir, você trata o erro graciosamente.
      </p>
      <pre><code>{`import 'dart:io';

void main() {
  stdout.write('Digite sua idade: ');
  final entrada = stdin.readLineSync();
  final idade = int.tryParse(entrada ?? '');

  if (idade == null) {
    print('Idade inválida! Use apenas números inteiros.');
    return;
  }

  if (idade >= 18) {
    print('Você é maior de idade.');
  } else {
    print('Faltam \${18 - idade} anos para você ser maior.');
  }
}`}</code></pre>

      <AlertBox type="warning" title="Cuidado com null">
        <code>readLineSync</code> devolve <code>String?</code>. Sempre cheque se é null — em pipes ou redirecionamentos do shell, a entrada pode terminar antes do esperado.
      </AlertBox>

      <h2>Codificação de caracteres</h2>
      <p>
        Por padrão, <code>readLineSync</code> usa o encoding do sistema (que pode ser CP-850 no Windows, causando problemas com acentos). Para forçar UTF-8 — quase sempre o que você quer — passe <code>encoding: utf8</code>.
      </p>
      <pre><code>{`import 'dart:io';
import 'dart:convert';

void main() {
  stdout.write('Cidade: ');
  final cidade = stdin.readLineSync(encoding: utf8);
  print('Você é de: \$cidade');
}`}</code></pre>

      <h2>Programa interativo completo: calculadora</h2>
      <p>
        Vamos juntar tudo em um programa real: uma mini-calculadora que pede dois números e a operação.
      </p>
      <pre><code>{`import 'dart:io';

void main() {
  print('=== Calculadora simples ===');

  stdout.write('Primeiro número: ');
  final a = double.tryParse(stdin.readLineSync() ?? '');

  stdout.write('Segundo número: ');
  final b = double.tryParse(stdin.readLineSync() ?? '');

  stdout.write('Operação (+, -, *, /): ');
  final op = stdin.readLineSync()?.trim();

  if (a == null || b == null || op == null) {
    print('Entrada inválida.');
    return;
  }

  final resultado = switch (op) {
    '+' => a + b,
    '-' => a - b,
    '*' => a * b,
    '/' => b == 0 ? double.nan : a / b,
    _   => double.nan,
  };

  if (resultado.isNaN) {
    print('Operação inválida ou divisão por zero.');
  } else {
    print('Resultado: \$resultado');
  }
}`}</code></pre>

      <h2>Saída de erro: <code>stderr</code></h2>
      <p>
        Mensagens de erro devem ir para <code>stderr</code>, não <code>stdout</code>. Isso permite que o usuário redirecione apenas a saída &quot;normal&quot; com <code>&gt; arquivo.txt</code> sem perder os erros.
      </p>
      <pre><code>{`import 'dart:io';

void main() {
  try {
    final arq = File('config.json').readAsStringSync();
    stdout.writeln(arq);
  } catch (e) {
    stderr.writeln('Erro ao ler arquivo: \$e');
    exitCode = 1;     // sinaliza falha para o shell
  }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>import 'dart:io';</code></strong> — sem ele, <code>stdin/stdout</code> não existem.</li>
        <li><strong>Não validar null de <code>readLineSync</code></strong> — pode quebrar em redirecionamentos.</li>
        <li><strong>Usar <code>parse</code> em vez de <code>tryParse</code></strong> em entrada de usuário.</li>
        <li><strong>Acentos virando lixo</strong> no Windows — passe <code>encoding: utf8</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>print</code> escreve com quebra de linha; conveniente mas limitado.</li>
        <li><code>stdout.write</code>/<code>writeln</code> dão controle fino (precisa <code>dart:io</code>).</li>
        <li><code>stdin.readLineSync()</code> lê uma linha; devolve <code>String?</code>.</li>
        <li>Valide com <code>tryParse</code> e trate <code>null</code> sempre.</li>
        <li>Use UTF-8 explicitamente em terminais Windows.</li>
        <li><code>stderr</code> + <code>exitCode</code> para programas profissionais.</li>
      </ul>
    </PageContainer>
  );
}
