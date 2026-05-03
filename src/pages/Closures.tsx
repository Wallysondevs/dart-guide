import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Closures() {
  return (
    <PageContainer
      title="Closures: funções que carregam o ambiente"
      subtitle="Quando uma função declarada dentro de outra lembra das variáveis do lugar onde nasceu."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine um cofre dentro de uma sala: mesmo que você leve o cofre embora, ele continua guardando os papéis que estavam dentro. Em Dart, uma <strong>closure</strong> (fechamento) é uma função que, ao ser criada dentro de outra, "leva embora" as variáveis do ambiente em que nasceu. Mesmo depois que a função externa termina, a interna continua tendo acesso a essas variáveis. É um conceito sutil, mas é o que dá poder a callbacks, eventos do Flutter e padrões funcionais.
      </p>

      <h2>O exemplo clássico: contador</h2>
      <p>
        A função <code>criarContador</code> abaixo cria uma variável <code>n</code> e devolve uma função que mexe nela. Cada vez que você chama o contador, o <code>n</code> capturado se mantém vivo na memória.
      </p>
      <pre><code>{`int Function() criarContador() {
  var n = 0;                 // 'n' é capturada pela função interna
  return () {
    n++;                     // mexendo no 'n' do escopo de fora
    return n;
  };
}

void main() {
  final contar = criarContador();
  print(contar()); // 1
  print(contar()); // 2
  print(contar()); // 3

  final outro = criarContador();
  print(outro());  // 1 — cada contador tem seu próprio 'n'
}`}</code></pre>
      <p>
        Repare que cada chamada a <code>criarContador()</code> gera um <code>n</code> independente. As closures isolam o estado, como se cada uma carregasse seu próprio cofre.
      </p>

      <AlertBox type="info" title="Por que &quot;fechamento&quot;?">
        O nome vem da matemática: a função "se fecha sobre" as variáveis externas, capturando-as. É um bilhete preso na função: "lembre dessa variável aqui, mesmo que o lugar dela suma".
      </AlertBox>

      <h2>Captura é por referência</h2>
      <p>
        Em Dart, closures capturam a <strong>variável</strong>, não o valor naquele instante. Se a variável muda depois, a closure enxerga a mudança. Isso é chamado <em>late binding</em>.
      </p>
      <pre><code>{`List<int Function()> fabrica() {
  final fns = <int Function()>[];
  for (var i = 0; i < 3; i++) {
    fns.add(() => i);     // 'i' é uma nova variável a cada iteração em Dart
  }
  return fns;
}

void main() {
  final lista = fabrica();
  print(lista[0]()); // 0
  print(lista[1]()); // 1
  print(lista[2]()); // 2
}`}</code></pre>
      <p>
        Em Dart 3, cada iteração do <code>for</code> cria uma nova variável <code>i</code>, então cada closure captura a sua. (Em algumas linguagens antigas isso ficava todo mundo com o mesmo valor — não em Dart.)
      </p>

      <h2>Currying: funções que devolvem funções</h2>
      <p>
        Currying é a técnica de transformar uma função de N argumentos em uma sequência de funções de 1 argumento. É só closures empilhadas: cada nível captura o argumento e devolve a próxima função.
      </p>
      <pre><code>{`int Function(int) somarComecando(int a) {
  return (int b) => a + b;
}

void main() {
  final somar5 = somarComecando(5);
  print(somar5(3));   // 8
  print(somar5(10));  // 15

  // Direto:
  print(somarComecando(2)(7)); // 9
}`}</code></pre>

      <h2>Closures em callbacks (Flutter)</h2>
      <p>
        No Flutter, callbacks são funções passadas para widgets (peças visuais) — quase sempre são closures. O <code>onPressed</code> de um botão captura o <code>BuildContext</code> e variáveis do <code>build</code> ao redor.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class TelaSaudacao extends StatelessWidget {
  const TelaSaudacao({super.key, required this.nome});
  final String nome;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ElevatedButton(
          // closure que captura 'nome' e 'context'
          onPressed: () {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('Olá, \$nome!')),
            );
          },
          child: const Text('Saudar'),
        ),
      ),
    );
  }
}`}</code></pre>

      <h2>Vazamento de memória: o lado obscuro</h2>
      <p>
        Como a closure mantém viva tudo o que captura, ela pode segurar objetos pesados na memória mais tempo do que o necessário. Se você guarda uma closure que captura um <code>State</code> grande do Flutter num lugar global, esse <code>State</code> nunca é coletado pelo <em>garbage collector</em> (limpador automático de memória).
      </p>
      <pre><code>{`// Exemplo de captura indesejada
class Servico {
  final List<int> dadosEnormes = List.filled(1000000, 0);

  void Function() montarLog() {
    // Captura 'this' inteiro (por causa de dadosEnormes.length).
    return () => print('tam: \${dadosEnormes.length}');
  }
}

// Solução: capture só o que precisa.
void Function() montarLogLeve(Servico s) {
  final tamanho = s.dadosEnormes.length; // captura int, não o serviço
  return () => print('tam: \$tamanho');
}`}</code></pre>

      <AlertBox type="warning" title="Cancele o que precisa cancelar">
        Closures usadas em <em>listeners</em>, timers e streams seguram referências enquanto não forem removidas. Sempre faça <code>controller.dispose()</code>, <code>timer.cancel()</code>, <code>subscription.cancel()</code> em <code>dispose</code> dos widgets. Caso contrário, o app vaza memória silenciosamente.
      </AlertBox>

      <h2>Padrões úteis com closures</h2>
      <ul>
        <li><strong>Memoização</strong>: capturar um cache local que sobrevive entre chamadas.</li>
        <li><strong>Fábrica de comparadores</strong>: <code>(int Function(A,A)) byField(...)</code>.</li>
        <li><strong>Hooks de estado</strong>: criar um setter que valida antes de alterar.</li>
        <li><strong>Throttling/debouncing</strong>: capturar um <code>DateTime</code> da última chamada.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar valor congelado</strong>: closures veem mudanças posteriores na variável.</li>
        <li><strong>Capturar <code>this</code> sem querer</strong> — segura a classe inteira na memória.</li>
        <li><strong>Esquecer de cancelar listeners</strong>: leak silencioso em apps Flutter.</li>
        <li><strong>Acreditar que closure clona</strong>: ela referencia, não copia.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Closure = função + variáveis do ambiente em que nasceu.</li>
        <li>Captura é por referência (late binding).</li>
        <li>Cada chamada da função externa gera estado independente.</li>
        <li>Base de currying, callbacks e fábricas funcionais.</li>
        <li>Pode causar leak: capture só o necessário e cancele recursos.</li>
      </ul>
    </PageContainer>
  );
}
