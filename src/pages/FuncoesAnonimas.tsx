import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FuncoesAnonimas() {
  return (
    <PageContainer
      title="Funções anônimas (lambdas) sem nome"
      subtitle="Quando você precisa de uma função descartável, defina-a no lugar — sem batismo."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine que numa festa você precisa de um voluntário para passar o microfone uma vez só. Você não vai contratar uma empresa de RH, registrar um nome e fazer um contrato — você só pede pra alguém ali do lado. Em programação, <strong>funções anônimas</strong> (também chamadas de <em>lambdas</em>) são esse "alguém ali do lado": funções pequenas, sem nome, criadas no exato lugar onde serão usadas. Elas são o pão-com-manteiga do código moderno em Dart e Flutter.
      </p>

      <h2>Sintaxe completa: parâmetros, corpo, retorno</h2>
      <p>
        A forma longa de uma função anônima é <code>(parâmetros) &#123; corpo &#125;</code>. Não tem nome — você a usa diretamente como argumento ou a guarda em uma variável.
      </p>
      <pre><code>{`void main() {
  // Função anônima guardada em variável.
  final dobrar = (int x) {
    return x * 2;
  };

  print(dobrar(5)); // 10

  // Mesma coisa passada direto como argumento.
  final nums = [1, 2, 3];
  final dobrados = nums.map((int x) {
    return x * 2;
  }).toList();
  print(dobrados); // [2, 4, 6]
}`}</code></pre>

      <h2>Forma curta com a seta <code>=&gt;</code></h2>
      <p>
        Quando o corpo é uma única expressão, troque chaves e <code>return</code> pela seta <code>=&gt;</code>. Fica enxuto e idiomático.
      </p>
      <pre><code>{`void main() {
  // Equivalentes:
  final f1 = (int x) { return x * 2; };
  final f2 = (int x) => x * 2;
  final f3 = (x) => x * 2;            // tipo inferido pelo contexto

  print(f1(3));
  print(f2(3));
  print(f3(3));
}`}</code></pre>

      <AlertBox type="info" title="Lambda, anônima, fechamento — qual é qual?">
        <strong>Anônima</strong> = sem nome. <strong>Lambda</strong> = sinônimo herdado do cálculo lambda. <strong>Closure</strong> = anônima que captura variáveis do escopo externo. Praticamente toda anônima útil acaba sendo uma closure.
      </AlertBox>

      <h2>Uso clássico: forEach, map, where</h2>
      <p>
        O lugar onde anônimas mais aparecem é dentro de operações em coleções. A função existe só ali, naquela linha — não faz sentido criar nome global para ela.
      </p>
      <pre><code>{`void main() {
  final palavras = ['banana', 'uva', 'abacaxi', 'kiwi'];

  // forEach: executa a função em cada elemento (não retorna nova lista).
  palavras.forEach((p) => print('Fruta: \$p'));

  // map: transforma cada elemento.
  final tamanhos = palavras.map((p) => p.length).toList();
  print(tamanhos); // [6, 3, 7, 4]

  // where: filtra.
  final curtas = palavras.where((p) => p.length <= 4).toList();
  print(curtas); // [uva, kiwi]

  // Combinação:
  final resumo = palavras
      .where((p) => p.startsWith('a') || p.startsWith('b'))
      .map((p) => p.toUpperCase())
      .toList();
  print(resumo); // [BANANA, ABACAXI]
}`}</code></pre>

      <h2>Anônimas com vários parâmetros</h2>
      <p>
        Funcionam exatamente como funções nomeadas: vários parâmetros, opcionais nomeados, defaults, etc.
      </p>
      <pre><code>{`void main() {
  // Dois parâmetros — usado em reduce.
  final soma = [1, 2, 3, 4].reduce((a, b) => a + b);
  print(soma); // 10

  // Comparator de sort — dois parâmetros, devolve int.
  final lista = ['banana', 'uva', 'abacaxi'];
  lista.sort((a, b) => a.length.compareTo(b.length));
  print(lista); // [uva, banana, abacaxi]
}`}</code></pre>

      <h2>IIFE: chamando a anônima na hora</h2>
      <p>
        Em algumas linguagens existe o padrão <em>IIFE</em> (Immediately Invoked Function Expression): definir uma função e já chamá-la. Em Dart isso é menos comum, mas funciona. É útil para criar um escopo isolado de uma vez só.
      </p>
      <pre><code>{`void main() {
  // Define e chama na hora — usando () no fim.
  final resultado = ((int a, int b) {
    final m = a * b;
    return m + 1;
  })(3, 4);
  print(resultado); // 13

  // Mais comum: usar isso para inicializar uma variável complexa.
  final config = (() {
    final base = {'host': 'localhost', 'porta': 8080};
    base['debug'] = 'true';
    return base;
  })();
  print(config);
}`}</code></pre>

      <AlertBox type="warning" title="IIFE: use com moderação">
        IIFEs deixam o código denso e difícil de depurar. Na maioria dos casos, prefira uma função nomeada local. Em Dart, <code>final config = configurar();</code> é muito mais legível.
      </AlertBox>

      <h2>Anônimas <code>async</code></h2>
      <p>
        Você pode marcar uma anônima como <code>async</code>, fazendo dela uma função que devolve <code>Future</code>. Isso é comum em <code>onPressed</code> de botões Flutter que precisam aguardar uma chamada de rede.
      </p>
      <pre><code>{`Future<void> exemplo() async {
  // Anônima async passada como callback.
  final resultados = await Future.wait([
    () async {
      await Future.delayed(const Duration(milliseconds: 100));
      return 'A';
    }(),
    () async {
      await Future.delayed(const Duration(milliseconds: 200));
      return 'B';
    }(),
  ]);
  print(resultados); // [A, B]
}`}</code></pre>
      <p>
        Note: o <code>()</code> no fim transforma a anônima em <code>Future&lt;String&gt;</code> que <code>Future.wait</code> espera. Sem o <code>()</code>, você passaria a função em si, não o future.
      </p>

      <h2>Em Flutter: o seu pão-com-manteiga</h2>
      <p>
        Praticamente toda interação em Flutter usa anônimas: <code>onPressed</code>, <code>onChanged</code>, <code>itemBuilder</code>, <code>validator</code>. Veja um exemplo completo:
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class FormularioLogin extends StatefulWidget {
  const FormularioLogin({super.key});
  @override
  State<FormularioLogin> createState() => _FormularioLoginState();
}

class _FormularioLoginState extends State<FormularioLogin> {
  String email = '';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(children: [
          TextField(
            decoration: const InputDecoration(labelText: 'E-mail'),
            // anônima como callback
            onChanged: (valor) => setState(() => email = valor),
          ),
          ElevatedButton(
            // anônima async
            onPressed: () async {
              await Future.delayed(const Duration(seconds: 1));
              if (!mounted) return;
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Logado: \$email')),
              );
            },
            child: const Text('Entrar'),
          ),
        ]),
      ),
    );
  }
}`}</code></pre>

      <h2>Anônima vs nomeada: quando escolher cada uma</h2>
      <ul>
        <li><strong>Anônima</strong>: usada uma vez só, lógica simples (1-3 linhas), no lugar onde o argumento é esperado.</li>
        <li><strong>Nomeada</strong>: reutilizada em vários lugares, lógica complexa, ou quando o nome ajuda a entender.</li>
        <li>Se a anônima passou de 5 linhas, considere extrair para função nomeada — facilita debug e teste.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>()</code></strong> ao chamar uma anônima guardada em variável: <code>dobrar</code> é a função; <code>dobrar(5)</code> é o resultado.</li>
        <li><strong>Tipos errados de parâmetros</strong>: o compilador infere pelo contexto; especifique se necessário.</li>
        <li><strong>Capturar variáveis sem perceber</strong>: anônimas são closures e seguram o que tocam (cuidado com leaks).</li>
        <li><strong>Anônimas gigantes</strong>: viram código ilegível. Extraia.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Função anônima = função sem nome, criada no local de uso.</li>
        <li>Sintaxe: <code>(params) &#123; corpo &#125;</code> ou, com uma expressão, <code>(params) =&gt; expr</code>.</li>
        <li>Brilha em <code>map</code>, <code>where</code>, <code>forEach</code>, <code>sort</code> e callbacks Flutter.</li>
        <li>Pode ser <code>async</code> para devolver <code>Future</code>.</li>
        <li>IIFE existe mas raramente vale a pena em Dart.</li>
      </ul>
    </PageContainer>
  );
}
