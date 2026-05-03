import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Typedef() {
  return (
    <PageContainer
      title="typedef: dando nome a tipos de função"
      subtitle="Apelide assinaturas longas para deixar o código mais limpo e refatorável."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <p>
        Imagine que num manual técnico aparece toda hora a frase "máquina de torque hidráulico de 200 newtons-metro". É correto, mas cansa. Aí o autor define no glossário: "MTH = máquina de torque hidráulico de 200 N·m". Daqui em diante usa só "MTH". Em Dart, <strong>typedef</strong> faz exatamente isso: cria um <em>apelido</em> para um tipo. Especialmente útil quando você tem assinaturas de função longas que aparecem em vários lugares.
      </p>

      <h2>Para que serve</h2>
      <p>
        Sem typedef, declarar um callback complexo várias vezes é tedioso — e trocar a assinatura depois exige caçar todas as ocorrências. Com typedef, você muda em <strong>um lugar</strong> e o resto do código se ajusta automaticamente.
      </p>
      <pre><code>{`// Sem typedef: a assinatura aparece toda vez.
void registrar(int Function(String, String) comparador) { }
void ordenar(List<String> lista, int Function(String, String) comparador) { }

// Com typedef: uma palavra resume tudo.
typedef Comparador<T> = int Function(T a, T b);

void registrar2(Comparador<String> c) { }
void ordenar2(List<String> lista, Comparador<String> c) { }`}</code></pre>

      <h2>Sintaxe básica</h2>
      <p>
        A forma moderna usa <code>=</code>: <code>typedef Nome = Tipo;</code>. O lado direito pode ser qualquer tipo válido — função, mapa, lista, classe genérica.
      </p>
      <pre><code>{`// Apelido para tipo de função.
typedef IntPredicado = bool Function(int);

bool ehPar(int n) => n.isEven;

void filtrar(List<int> nums, IntPredicado teste) {
  for (final n in nums) {
    if (teste(n)) print(n);
  }
}

void main() {
  filtrar([1, 2, 3, 4], ehPar);          // 2, 4
  filtrar([1, 2, 3, 4], (n) => n > 2);   // 3, 4
}`}</code></pre>

      <AlertBox type="info" title="Forma antiga ainda funciona">
        Existe uma sintaxe legada <code>typedef bool IntPredicado(int n);</code> herdada do Dart 1. Funciona, mas é menos flexível (só serve para tipos de função). Sempre prefira a forma com <code>=</code>.
      </AlertBox>

      <h2>Apelido para tipos não-função (Dart 2.13+)</h2>
      <p>
        Desde o Dart 2.13, typedef também aceita tipos que não são funções: mapas, listas, classes genéricas. Isso é ótimo para nomear estruturas que aparecem com frequência.
      </p>
      <pre><code>{`typedef IdMap = Map<int, String>;
typedef Coordenada = (double lat, double lon);   // record (Dart 3)
typedef Json = Map<String, dynamic>;

void main() {
  final usuarios = <int, String>{1: 'Ana', 2: 'Bia'};
  final IdMap mapa = usuarios; // mesma coisa
  print(mapa);

  final Coordenada casa = (-23.5, -46.6);
  print(casa);

  final Json payload = {'nome': 'Ana', 'idade': 30};
  print(payload);
}`}</code></pre>

      <h2>Genéricos: Comparador&lt;T&gt;</h2>
      <p>
        typedef pode ter parâmetros de tipo (genéricos). Isso o torna reutilizável para múltiplos tipos.
      </p>
      <pre><code>{`typedef Comparador<T> = int Function(T a, T b);
typedef Mapeador<E, R> = R Function(E entrada);
typedef Predicado<T> = bool Function(T valor);

int porIdade(Pessoa a, Pessoa b) => a.idade.compareTo(b.idade);

class Pessoa {
  Pessoa(this.nome, this.idade);
  final String nome;
  final int idade;
}

void ordenar<T>(List<T> lista, Comparador<T> c) {
  lista.sort(c);
}

void main() {
  final lista = [Pessoa('Ana', 30), Pessoa('Bia', 25)];
  ordenar<Pessoa>(lista, porIdade);
  print(lista.map((p) => p.nome).toList()); // [Bia, Ana]
}`}</code></pre>

      <h2>Refatoração centralizada</h2>
      <p>
        O grande poder do typedef é mudar uma assinatura em um só lugar. Imagine que seu callback de validação evolui para retornar uma mensagem de erro em vez de só <code>bool</code>:
      </p>
      <pre><code>{`// Antes:
typedef Validador = bool Function(String valor);

// Depois (mensagem de erro nullable):
typedef Validador = String? Function(String valor);

// Todas as funções que recebem 'Validador' continuam compilando se ajustarem o uso.
String? naoVazio(String v) => v.isEmpty ? 'Campo obrigatório' : null;

void aplicar(String input, Validador v) {
  final erro = v(input);
  print(erro ?? 'OK');
}

void main() {
  aplicar('', naoVazio);     // Campo obrigatório
  aplicar('Ana', naoVazio);  // OK
}`}</code></pre>

      <AlertBox type="warning" title="typedef não cria tipo novo">
        typedef é <strong>apelido</strong>, não classe nova. <code>IdMap</code> e <code>Map&lt;int, String&gt;</code> são intercambiáveis para o compilador. Se você quer um tipo realmente distinto que impeça misturas, crie uma classe <code>extension type</code> ou um wrapper.
      </AlertBox>

      <h2>Onde brilha em Flutter</h2>
      <p>
        Apps Flutter têm muitas assinaturas longas: <code>void Function(BuildContext, int)</code>, <code>Widget Function(BuildContext, int)</code>, etc. Apelidá-las melhora a legibilidade.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

typedef ItemBuilder<T> = Widget Function(BuildContext context, T item);
typedef AoTocar<T> = void Function(T item);

class Lista<T> extends StatelessWidget {
  const Lista({
    super.key,
    required this.itens,
    required this.builder,
    this.aoTocar,
  });

  final List<T> itens;
  final ItemBuilder<T> builder;
  final AoTocar<T>? aoTocar;

  @override
  Widget build(BuildContext context) => ListView.builder(
    itemCount: itens.length,
    itemBuilder: (ctx, i) => GestureDetector(
      onTap: aoTocar == null ? null : () => aoTocar!(itens[i]),
      child: builder(ctx, itens[i]),
    ),
  );
}`}</code></pre>

      <h2>Boas práticas</h2>
      <ul>
        <li>Use typedef quando a assinatura aparece <strong>3+ vezes</strong> no projeto.</li>
        <li>Nomeie pelo <em>papel</em> (<code>Comparador</code>, <code>Validador</code>) e não pela forma técnica.</li>
        <li>Coloque os typedefs perto do código que os usa, ou num arquivo <code>types.dart</code> compartilhado.</li>
        <li>Documente com <code>///</code> para a IDE mostrar tooltips.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar checagem de tipo distinta</strong>: typedef não isola tipos, só apelida.</li>
        <li><strong>Apelidar coisas óbvias</strong>: <code>typedef Inteiro = int;</code> não ajuda ninguém.</li>
        <li><strong>Sintaxe antiga em código novo</strong>: prefira sempre a forma <code>=</code>.</li>
        <li><strong>Não tornar genérico</strong> quando o tipo varia — perde reutilização.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>typedef Nome = Tipo;</code> cria um apelido para um tipo.</li>
        <li>Funciona com tipos de função e (Dart 2.13+) tipos quaisquer.</li>
        <li>Aceita genéricos: <code>typedef Comparador&lt;T&gt; = int Function(T, T);</code>.</li>
        <li>Centraliza refatoração — muda em um lugar só.</li>
        <li>Não cria tipo novo: é só um apelido, sem isolamento.</li>
      </ul>
    </PageContainer>
  );
}
