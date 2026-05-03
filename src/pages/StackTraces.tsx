import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StackTraces() {
  return (
    <PageContainer
      title="Stack traces: lendo o pavor do desenvolvedor"
      subtitle="Aquela parede de texto que aparece quando algo crasha é, na verdade, o melhor amigo do programador. Vamos aprender a lê-la."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Quando um programa quebra, o terminal cospe um monte de linhas começando com <code>#0</code>, <code>#1</code>, etc. Para iniciantes, parece um borrão assustador. Na realidade, é uma <strong>lista de chamadas</strong> — uma trilha de migalhas que mostra exatamente o caminho que o programa percorreu até bater. Saber lê-la transforma debugging de adivinhação em investigação metódica.
      </p>

      <h2>O que é a &quot;pilha de chamadas&quot; (call stack)?</h2>
      <p>
        Toda vez que sua função A chama a função B, que chama C, o runtime empilha essas chamadas como pratos numa mesa. Quando C termina, o prato dela sai do topo e o controle volta a B. Se algo lança uma exceção em C antes de retornar, o runtime tira uma <em>foto da pilha</em> naquele instante e te entrega — é o <strong>stack trace</strong>.
      </p>
      <pre><code>{`void main() {
  a();
}

void a() => b();
void b() => c();
void c() => throw Exception('estourou aqui');

// Saida (resumida):
// Unhandled exception: Exception: estourou aqui
// #0      c           (file:///app/bin/x.dart:6:18)
// #1      b           (file:///app/bin/x.dart:5:14)
// #2      a           (file:///app/bin/x.dart:4:14)
// #3      main        (file:///app/bin/x.dart:2:3)`}</code></pre>
      <p>
        Leia <strong>de cima para baixo</strong>: o frame <code>#0</code> é onde o erro <em>aconteceu</em>; os frames seguintes mostram <em>quem chamou quem</em> até chegar ali. O número entre parênteses (<code>:6:18</code>) é linha:coluna do arquivo.
      </p>

      <h2>Capturando o stack atual com <code>StackTrace.current</code></h2>
      <p>
        Você não precisa de exceção para tirar foto da pilha. <code>StackTrace.current</code> devolve o stack <em>do exato ponto</em> onde foi chamado — útil para logar &quot;como cheguei aqui&quot; em debug.
      </p>
      <pre><code>{`void registrar(String evento) {
  print('[\$evento]');
  print(StackTrace.current);
}

void main() {
  alfa();
}

void alfa() => beta();
void beta() => registrar('beta foi chamado');`}</code></pre>

      <h2>Closures anônimas e &quot;&lt;anonymous closure&gt;&quot;</h2>
      <p>
        Quando o stack passa por uma função sem nome (uma arrow function, um callback de <code>map</code>, um <code>then</code>), o frame aparece como <code>&lt;anonymous closure&gt;</code> ou <code>&lt;fn&gt;</code>. Isso confunde no começo. A dica é: olhe o <em>arquivo e linha</em> ao lado, não o nome — o link te leva direto ao código.
      </p>
      <pre><code>{`void main() {
  [1, 2, 3].forEach((n) {
    if (n == 2) throw StateError('opa');
  });
}

// #0   main.<anonymous closure>  (file:///x.dart:3:18)
// #1   List.forEach              (dart:core)
// #2   main                      (file:///x.dart:2:14)`}</code></pre>

      <h2>Async stack traces: as &quot;portas&quot; entre futuros</h2>
      <p>
        Em código <code>async</code>, cada <code>await</code> é uma &quot;porta&quot; entre dois mundos: o que aconteceu antes da pausa e o que veio depois. O Dart usa um mecanismo chamado <strong>async stack traces</strong> para costurar essas duas metades, separando-as com a linha mágica <code>&lt;asynchronous suspension&gt;</code>.
      </p>
      <pre><code>{`Future<void> baixar() async {
  await Future.delayed(const Duration(milliseconds: 10));
  throw Exception('falhou apos await');
}

Future<void> main() async {
  await baixar();
}

// #0   baixar          (x.dart:3:3)
// <asynchronous suspension>
// #1   main            (x.dart:7:3)
// <asynchronous suspension>`}</code></pre>

      <AlertBox type="info" title="Por que &quot;suspension&quot;?">
        Cada <code>await</code> &quot;suspende&quot; a função. Quando ela retoma, o Dart precisa lembrar de onde ela parou — daí o nome. A linha entre frames mostra exatamente esses pontos de retomada.
      </AlertBox>

      <h2>Pacote <code>stack_trace</code>: limpando o ruído</h2>
      <p>
        Em apps grandes, o stack vem cheio de frames de bibliotecas internas (<code>dart:async</code>, <code>package:flutter</code>) que são puro ruído. O pacote oficial <a href="https://pub.dev/packages/stack_trace"><code>stack_trace</code></a> ajuda a normalizar e &quot;dobrar&quot; (fold) esses frames.
      </p>
      <pre><code>{`// pubspec.yaml: dependencies: stack_trace: ^1.11.0
import 'package:stack_trace/stack_trace.dart';

void main() {
  Chain.capture(() {
    coisaQueQuebra();
  }, onError: (erro, Chain cadeia) {
    final limpo = cadeia.terse; // remove frames de framework
    print('Erro: \$erro');
    print(limpo);
  });
}`}</code></pre>
      <p>
        <code>Chain.capture</code> entende async stacks e <code>terse</code> esconde frames de runtime, deixando só o seu código. Em produção, é quase obrigatório.
      </p>

      <h2>Source maps: lendo stack do Dart compilado para JS</h2>
      <p>
        Quando você compila Dart para JavaScript (<code>dart compile js</code>), o código fica minificado. Um stack trace direto mostra nomes ininteligíveis como <code>a.B.c</code>. A solução é o <strong>source map</strong>: um arquivo extra (<code>.js.map</code>) que mapeia cada posição do JS de volta ao Dart original. Navegadores modernos e ferramentas como Sentry usam o source map automaticamente para te mostrar o stack em Dart, com nomes e linhas corretos.
      </p>
      <pre><code>{`# Gera o JS + o source map ao lado:
dart compile js bin/app.dart -o build/app.js
# Saida:
#   build/app.js
#   build/app.js.map   <- precisa subir junto para o servidor`}</code></pre>

      <AlertBox type="warning" title="Não publique source map sem cuidado">
        Source maps revelam seu código-fonte original. Em produção, restrinja o acesso ao <code>.js.map</code> (autenticação, IPs internos) ou use serviços de monitoramento que fazem o de-mangling no servidor.
      </AlertBox>

      <h2>Erros comuns ao ler stack traces</h2>
      <ul>
        <li><strong>Ler de baixo para cima</strong> — em Dart, o frame zero (no topo) é onde aconteceu o erro.</li>
        <li><strong>Ignorar <code>&lt;asynchronous suspension&gt;</code></strong> — essa linha é fundamental para entender chamadas <code>await</code>.</li>
        <li><strong>Achar que <code>&lt;anonymous closure&gt;</code> é bug do Dart</strong> — é só uma função sem nome.</li>
        <li><strong>Não logar o stack ao capturar exceção</strong> — sem ele, o catch é cego.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Stack trace é a foto da pilha de chamadas no momento do erro.</li>
        <li>Frame <code>#0</code> = onde o erro aconteceu; frames seguintes = quem chamou.</li>
        <li><code>StackTrace.current</code> captura o stack sem precisar de exceção.</li>
        <li>Async stacks usam <code>&lt;asynchronous suspension&gt;</code> para ligar &quot;antes&quot; e &quot;depois&quot; do <code>await</code>.</li>
        <li>Pacote <code>stack_trace</code> deixa o output legível removendo frames de framework.</li>
        <li>Source maps reconstroem stack de Dart compilado para JavaScript.</li>
      </ul>
    </PageContainer>
  );
}
