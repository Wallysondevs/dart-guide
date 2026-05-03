import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HigherOrder() {
  return (
    <PageContainer
      title="Funções de alta ordem: funções como argumento"
      subtitle="Quando uma função recebe ou devolve outra função, abrindo um mundo de abstrações."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Pense numa cafeteria onde você diz ao barista <em>como</em> fazer seu café — "primeiro mexe, depois coa, depois adoça". Você não está só pedindo um café pronto: está passando <strong>instruções</strong> para o barista executar. Em programação, instruções são funções; e em Dart você pode passar uma função como argumento para outra. A função que recebe outras funções é chamada <strong>função de alta ordem</strong> (do inglês <em>higher-order function</em>).
      </p>

      <h2>O tipo de uma função</h2>
      <p>
        Em Dart, funções têm tipos como qualquer outro valor. A sintaxe é <code>RetornoFunction(ParamTipos)</code>. Por exemplo, uma função que recebe <code>int</code> e devolve <code>int</code> é do tipo <code>int Function(int)</code>.
      </p>
      <pre><code>{`int dobrar(int x) => x * 2;
int triplicar(int x) => x * 3;

void main() {
  // Variável que aponta para uma função.
  int Function(int) f = dobrar;
  print(f(10)); // 20
  f = triplicar;
  print(f(10)); // 30
}`}</code></pre>

      <h2>Recebendo função como parâmetro</h2>
      <p>
        Agora vem a parte poderosa: criar uma função que recebe outra função e a usa.
      </p>
      <pre><code>{`int aplicar(int valor, int Function(int) operacao) {
  return operacao(valor);
}

void main() {
  print(aplicar(5, (x) => x * 2));   // 10
  print(aplicar(5, (x) => x + 100)); // 105
  print(aplicar(5, dobrar));         // 10
}`}</code></pre>

      <AlertBox type="info" title="Lambda? Closure? Callback?">
        <strong>Lambda</strong> e <strong>função anônima</strong> são sinônimos: <code>(x) =&gt; x*2</code> não tem nome. <strong>Callback</strong> é o papel: uma função passada para ser chamada depois. <strong>Closure</strong> é uma função que captura variáveis do entorno. Os três conceitos se misturam o tempo todo.
      </AlertBox>

      <h2>map, where, reduce: pão-com-manteiga</h2>
      <p>
        As coleções de Dart oferecem vários métodos de alta ordem para transformar dados sem loops manuais.
      </p>
      <pre><code>{`void main() {
  final nums = [1, 2, 3, 4, 5, 6];

  // map: transforma cada elemento.
  final dobrados = nums.map((n) => n * 2).toList();
  print(dobrados); // [2, 4, 6, 8, 10, 12]

  // where: filtra os que satisfazem a condição.
  final pares = nums.where((n) => n.isEven).toList();
  print(pares); // [2, 4, 6]

  // reduce: combina todos em um valor único.
  final soma = nums.reduce((acc, n) => acc + n);
  print(soma); // 21

  // any / every: testes booleanos.
  print(nums.any((n) => n > 5));   // true
  print(nums.every((n) => n > 0)); // true
}`}</code></pre>

      <h2>sort com comparador customizado</h2>
      <p>
        O método <code>sort</code> de listas aceita uma função de comparação. Ela recebe dois elementos e devolve um <code>int</code>: negativo se <code>a</code> vem antes, zero se são iguais, positivo se <code>b</code> vem antes.
      </p>
      <pre><code>{`class Pessoa {
  Pessoa(this.nome, this.idade);
  final String nome;
  final int idade;
  @override
  String toString() => '\$nome(\$idade)';
}

void main() {
  final lista = [
    Pessoa('Ana', 30),
    Pessoa('Bia', 25),
    Pessoa('Caio', 40),
  ];

  // Ordena por idade crescente.
  lista.sort((a, b) => a.idade.compareTo(b.idade));
  print(lista); // [Bia(25), Ana(30), Caio(40)]

  // Ordena por nome decrescente.
  lista.sort((a, b) => b.nome.compareTo(a.nome));
  print(lista); // [Caio(40), Bia(25), Ana(30)]
}`}</code></pre>

      <h2>Devolvendo funções (fábricas)</h2>
      <p>
        Uma função pode <strong>devolver</strong> outra. Isso permite criar "fábricas" de funções configuradas.
      </p>
      <pre><code>{`/// Cria um validador de comprimento mínimo.
bool Function(String) minimo(int n) {
  return (texto) => texto.length >= n;
}

void main() {
  final senhaForte = minimo(8);
  print(senhaForte('123'));      // false
  print(senhaForte('12345678')); // true

  // Útil em filtros:
  final palavras = ['oi', 'tudo', 'bem', 'amigo'];
  final longas = palavras.where(minimo(4)).toList();
  print(longas); // [tudo, amigo]
}`}</code></pre>

      <h2>Abstrações reutilizáveis</h2>
      <p>
        Funções de alta ordem deixam você isolar a parte que muda da parte que repete. Veja um <em>retry</em> genérico que reexecuta qualquer operação até N vezes:
      </p>
      <pre><code>{`Future<T> retry<T>(
  Future<T> Function() acao, {
  int tentativas = 3,
  Duration espera = const Duration(seconds: 1),
}) async {
  Object? ultimoErro;
  for (var i = 0; i < tentativas; i++) {
    try {
      return await acao();
    } catch (e) {
      ultimoErro = e;
      await Future.delayed(espera);
    }
  }
  throw ultimoErro!;
}

Future<String> baixarPagina() async {
  // Imagine uma chamada HTTP aqui.
  return 'OK';
}

void main() async {
  final r = await retry(baixarPagina, tentativas: 5);
  print(r);
}`}</code></pre>

      <AlertBox type="warning" title="Function vs tipo concreto">
        Você pode declarar parâmetros como <code>Function</code> (sem aridade), mas perde a checagem de tipo. Prefira <code>void Function(int)</code> ou <code>int Function(String, String)</code> para o compilador validar a assinatura.
      </AlertBox>

      <h2>Onde isso aparece em Flutter</h2>
      <p>
        Praticamente todo widget do Flutter recebe callbacks: <code>onPressed</code>, <code>onChanged</code>, <code>itemBuilder</code>, <code>validator</code>. Tudo isso é função passada como argumento. Se você dominou alta ordem em Dart, dominou metade da API do Flutter.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class Lista extends StatelessWidget {
  const Lista({super.key, required this.itens, required this.aoTocar});
  final List<String> itens;
  final void Function(String) aoTocar; // callback

  @override
  Widget build(BuildContext context) => ListView.builder(
    itemCount: itens.length,
    itemBuilder: (context, i) => ListTile(
      title: Text(itens[i]),
      onTap: () => aoTocar(itens[i]),
    ),
  );
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Passar função sem assinatura</strong>: <code>Function</code> aceita qualquer coisa e compila, mas explode em runtime.</li>
        <li><strong>Confundir <code>nome</code> com <code>nome()</code></strong>: o primeiro é a função; o segundo, o resultado da chamada.</li>
        <li><strong>Ignorar o tipo de retorno do comparador</strong>: <code>compare</code> deve devolver <code>int</code>, não <code>bool</code>.</li>
        <li><strong>Reescrever loops em vez de usar <code>map/where</code></strong>: perde clareza e expressividade.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Funções de alta ordem recebem ou devolvem outras funções.</li>
        <li>O tipo de uma função em Dart é <code>Retorno Function(Params)</code>.</li>
        <li><code>map</code>, <code>where</code>, <code>reduce</code>, <code>sort</code> são exemplos clássicos.</li>
        <li>Permitem criar abstrações reutilizáveis como <code>retry</code>.</li>
        <li>São a base da API declarativa do Flutter.</li>
      </ul>
    </PageContainer>
  );
}
