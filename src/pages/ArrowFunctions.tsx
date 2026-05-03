import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ArrowFunctions() {
  return (
    <PageContainer
      title="Arrow functions: a sintaxe enxuta com =>"
      subtitle="Quando o corpo da função é uma única expressão, troque chaves por uma seta."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <p>
        Imagine que toda receita de bolo cabe em uma frase: "misturar farinha, leite e ovo". Se cabe numa frase, por que escrever um livro? Em Dart, quando o corpo de uma função tem uma única expressão (uma instrução que produz um valor), você pode trocar as chaves <code>&#123; return ...; &#125;</code> por uma <strong>seta</strong> <code>=&gt;</code>. O resultado é o mesmo, mas o código fica mais curto e mais fácil de ler.
      </p>

      <h2>A equivalência exata</h2>
      <p>
        A regra é simples: <code>=&gt; expressão;</code> é o mesmo que <code>&#123; return expressão; &#125;</code>. Note que o <code>return</code> é <strong>implícito</strong> — você não escreve. E só pode ser <strong>uma expressão</strong>, não uma sequência de instruções.
      </p>
      <pre><code>{`// Forma longa
int dobrarLongo(int x) {
  return x * 2;
}

// Forma curta — exatamente equivalente
int dobrar(int x) => x * 2;

void main() {
  print(dobrar(5));      // 10
  print(dobrarLongo(5)); // 10
}`}</code></pre>

      <AlertBox type="info" title="Quando NÃO dá para usar =>">
        Se você precisa de mais de uma instrução (loop, if, várias atribuições), volte para chaves. A seta só serve para casos de "uma expressão e devolve". Tentar <code>=&gt; if (x) ...</code> ou <code>=&gt; for (...)</code> não compila.
      </AlertBox>

      <h2>Brilha em coleções: map, where, reduce</h2>
      <p>
        O lugar onde <code>=&gt;</code> realmente brilha é em operações sobre listas. Você passa uma função pequena como argumento — uma <em>função anônima</em> (sem nome) — e a seta deixa tudo numa linha só.
      </p>
      <pre><code>{`void main() {
  final numeros = [1, 2, 3, 4, 5];

  // Dobra cada elemento.
  final dobrados = numeros.map((n) => n * 2).toList();
  print(dobrados); // [2, 4, 6, 8, 10]

  // Filtra os pares.
  final pares = numeros.where((n) => n.isEven).toList();
  print(pares); // [2, 4]

  // Soma todos.
  final soma = numeros.reduce((a, b) => a + b);
  print(soma); // 15
}`}</code></pre>
      <p>
        Compare com a forma longa — funciona, mas inflada de cerimônia:
      </p>
      <pre><code>{`final dobrados = numeros.map((n) {
  return n * 2;
}).toList();`}</code></pre>

      <h2>Membros de classe expression-bodied</h2>
      <p>
        Em classes, métodos curtos também ganham com a seta. Isso é especialmente bom para <em>getters</em> (propriedades calculadas) e métodos de uma linha. Em widgets Flutter, métodos como <code>build</code> frequentemente usam essa forma quando devolvem uma única expressão.
      </p>
      <pre><code>{`class Retangulo {
  Retangulo(this.largura, this.altura);
  final double largura;
  final double altura;

  // Getter expression-bodied
  double get area => largura * altura;
  double get perimetro => 2 * (largura + altura);

  // Método expression-bodied
  Retangulo escalar(double f) => Retangulo(largura * f, altura * f);

  @override
  String toString() => 'Retangulo(\${largura}x\${altura})';
}

void main() {
  final r = Retangulo(3, 4);
  print(r.area);          // 12.0
  print(r.escalar(2));    // Retangulo(6.0x8.0)
}`}</code></pre>

      <h2>Em Flutter: build, callbacks, factories</h2>
      <p>
        No Flutter (framework para apps com Dart), <em>widgets</em> (peças visuais como botões e textos) costumam receber funções como argumento. A seta deixa o código declarativo enxuto.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class Contador extends StatefulWidget {
  const Contador({super.key});
  @override
  State<Contador> createState() => _ContadorState();
}

class _ContadorState extends State<Contador> {
  int n = 0;

  void incrementar() => setState(() => n++);

  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(title: const Text('Arrow demo')),
    body: Center(child: Text('Cliques: \$n')),
    floatingActionButton: FloatingActionButton(
      onPressed: incrementar,
      child: const Icon(Icons.add),
    ),
  );
}`}</code></pre>

      <AlertBox type="warning" title="Cuidado com legibilidade">
        Setas aninhadas demais viram um carrossel ilegível. Se uma <code>=&gt;</code> tem outra <code>=&gt;</code> dentro de outra, considere voltar para chaves ou extrair em uma função nomeada. Código curto deve ser claro, não compactado.
      </AlertBox>

      <h2>Setores e armadilhas</h2>
      <p>
        Algumas combinações são técnicas, mas vale conhecer:
      </p>
      <ul>
        <li><strong>Função void com seta</strong>: <code>void log(String s) =&gt; print(s);</code> funciona porque <code>print</code> retorna <code>void</code> e tudo bate.</li>
        <li><strong>Async com seta</strong>: <code>Future&lt;int&gt; carregar() async =&gt; await api.get();</code> também é válido.</li>
        <li><strong>Sem ponto-e-vírgula no fim?</strong> Não — a seta encerra com <code>;</code> normalmente.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Escrever <code>return</code> depois da seta</strong>: <code>=&gt; return x;</code> dá erro — o return é implícito.</li>
        <li><strong>Várias instruções com seta</strong>: <code>=&gt; print(a); print(b);</code> não compila; use chaves.</li>
        <li><strong>Confundir <code>=&gt;</code> com <code>-&gt;</code></strong>: Dart usa fat arrow (<code>=&gt;</code>); a thin arrow não existe na linguagem.</li>
        <li><strong>Esquecer <code>;</code></strong>: a expressão precisa terminar em ponto-e-vírgula como qualquer instrução.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>=&gt; expr;</code> equivale a <code>&#123; return expr; &#125;</code>.</li>
        <li>Só serve para uma expressão; várias instruções exigem chaves.</li>
        <li>Excelente em <code>map</code>, <code>where</code>, <code>reduce</code> e callbacks.</li>
        <li>Métodos e getters de classe ficam mais limpos como expression-bodied.</li>
        <li>Use com moderação para manter clareza.</li>
      </ul>
    </PageContainer>
  );
}
