import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Sets() {
  return (
    <PageContainer
      title="Sets: conjuntos sem duplicatas"
      subtitle="Quando a regra é “cada item só uma vez” — Sets resolvem o problema com performance e elegância."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Imagine uma <strong>caixa de bolinhas coloridas</strong> onde a regra é: cada cor só pode aparecer uma vez. Tentar colocar uma bolinha vermelha quando já existe uma vermelha não causa erro — é simplesmente ignorado. Essa é a essência de um <strong>Set</strong> (conjunto): uma coleção sem duplicatas. Em Dart, Sets também trazem operações matemáticas clássicas (união, interseção, diferença) e busca por presença em <em>tempo constante</em> — muito mais rápido que listas em coleções grandes.
      </p>

      <h2>Criando Sets</h2>
      <p>
        Sets podem ser criados com literal <code>&#123;...&#125;</code> contendo só valores (sem <code>:</code>, que distingue de Map), ou com o construtor.
      </p>
      <pre><code>{`var cores = {'vermelho', 'verde', 'azul'};   // Set<String>
var nums = <int>{1, 2, 3, 4};
var vazio = <int>{};                          // precisa do tipo!

// Construtor
var s = Set<String>();
s.add('a');

// Cuidado: {} sem tipo é Map vazio, não Set!
var ambiguo = {};        // Map<dynamic, dynamic>
var setVazio = <int>{};  // Set<int>`}</code></pre>

      <h2><code>add</code> devolve bool, <code>contains</code> é O(1)</h2>
      <p>
        Adicionar um item devolve <code>true</code> se foi adicionado e <code>false</code> se já existia. E como Sets são tabela hash por baixo, <code>contains</code> roda em tempo constante — você pode chamar 1 milhão de vezes sem problema.
      </p>
      <pre><code>{`final visitados = <String>{};

print(visitados.add('home'));     // true (novo)
print(visitados.add('home'));     // false (já existia)
print(visitados.add('perfil'));   // true

print(visitados.contains('home'));   // true (busca O(1))
print(visitados.length);              // 2

visitados.remove('home');
print(visitados);                     // {perfil}

// addAll para incluir vários
visitados.addAll(['config', 'sair']);`}</code></pre>

      <AlertBox type="success" title="Set vs List para deduplicar">
        Quer remover duplicatas de uma lista? Conversão direta: <code>lista.toSet().toList()</code>. Curto, claro e eficiente.
      </AlertBox>

      <h2>Operações matemáticas: união, interseção, diferença</h2>
      <p>
        Aqui Sets brilham. Você pode combinar conjuntos de forma natural, como em matemática.
      </p>
      <pre><code>{`final a = {1, 2, 3, 4};
final b = {3, 4, 5, 6};

print(a.union(b));         // {1, 2, 3, 4, 5, 6}  (todos)
print(a.intersection(b));  // {3, 4}              (em ambos)
print(a.difference(b));    // {1, 2}              (em a mas não em b)
print(b.difference(a));    // {5, 6}

// Útil em filtros de permissões
final permissoesUsuario = {'ler', 'escrever'};
final acoesNecessarias = {'ler', 'apagar'};
final faltando = acoesNecessarias.difference(permissoesUsuario);
print(faltando);    // {apagar}`}</code></pre>

      <h2>Convertendo de lista para Set e vice-versa</h2>
      <p>
        Listas e Sets convertem-se mutuamente com facilidade.
      </p>
      <pre><code>{`final comDuplicatas = [1, 2, 2, 3, 3, 3, 4];
final unicos = comDuplicatas.toSet();      // {1, 2, 3, 4}
final lista = unicos.toList();             // [1, 2, 3, 4]

// .toSet() de Iterable retorna LinkedHashSet (preserva ordem!)
final nomes = ['Ana', 'Beto', 'Ana', 'Caio'].toSet();
print(nomes);   // {Ana, Beto, Caio}`}</code></pre>

      <h2>LinkedHashSet vs HashSet</h2>
      <p>
        Por padrão, o literal <code>&#123;...&#125;</code> e <code>Set()</code> criam um <code>LinkedHashSet</code>: preserva a ordem de inserção. Se você não se importa com ordem e quer máxima performance, importe <code>HashSet</code> de <code>dart:collection</code>.
      </p>
      <pre><code>{`// Padrão: LinkedHashSet (ordem preservada)
final ordenado = <int>{};
ordenado.add(3);
ordenado.add(1);
ordenado.add(2);
print(ordenado);   // {3, 1, 2}  — ordem de inserção

// HashSet: ordem não garantida, ligeiramente mais rápido
// import 'dart:collection';
// final rapido = HashSet<int>();

// SplayTreeSet: ordenado naturalmente (do menor ao maior)
// import 'dart:collection';
// final emOrdem = SplayTreeSet<int>();`}</code></pre>

      <AlertBox type="info" title="Sempre LinkedHashSet?">
        Sim, na grande maioria dos casos. A diferença de performance só aparece em coleções gigantes (centenas de milhares). Comece com o padrão; otimize só se medir e provar que vale.
      </AlertBox>

      <h2>Iterando e transformando</h2>
      <p>
        Sets têm os mesmos métodos de qualquer <code>Iterable</code>: <code>forEach</code>, <code>map</code>, <code>where</code>, <code>any</code>, <code>every</code>, etc.
      </p>
      <pre><code>{`final tags = {'flutter', 'dart', 'mobile'};

for (final tag in tags) {
  print(tag.toUpperCase());
}

final maiusculas = tags.map((t) => t.toUpperCase()).toSet();
final curtas = tags.where((t) => t.length <= 4).toSet();

print(tags.any((t) => t.startsWith('f')));   // true
print(tags.every((t) => t.length > 2));      // true`}</code></pre>

      <h2>Objetos próprios em Sets</h2>
      <p>
        Para usar uma classe sua como item de Set, você precisa sobrescrever <code>==</code> e <code>hashCode</code>. Senão, dois objetos &quot;iguais&quot; pelo conteúdo serão considerados diferentes.
      </p>
      <pre><code>{`class Tag {
  final String nome;
  const Tag(this.nome);

  @override
  bool operator ==(Object other) =>
      other is Tag && other.nome == nome;

  @override
  int get hashCode => nome.hashCode;
}

final tags = {const Tag('a'), const Tag('a'), const Tag('b')};
print(tags.length);   // 2 (não 3, porque == diz que são iguais)`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Confundir <code>&#123;&#125;</code> com Set vazio</strong> — sem tipo, é Map vazio.</li>
        <li><strong>Esquecer de sobrescrever <code>==</code> e <code>hashCode</code></strong> em classes próprias.</li>
        <li><strong>Esperar acesso por índice</strong> — Sets não têm <code>s[0]</code>; use <code>elementAt(0)</code> ou converta para lista.</li>
        <li><strong>Modificar durante iteração</strong> — gera <code>ConcurrentModificationError</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Sets são coleções sem duplicatas, com busca em O(1).</li>
        <li>Literal: <code>&#123;1, 2, 3&#125;</code>; vazio: <code>&lt;T&gt;&#123;&#125;</code>.</li>
        <li><code>add</code> devolve bool indicando se inseriu.</li>
        <li>Operações matemáticas: <code>union</code>, <code>intersection</code>, <code>difference</code>.</li>
        <li>Padrão é <code>LinkedHashSet</code> (preserva ordem de inserção).</li>
        <li>Para classes próprias em Sets, sobrescreva <code>==</code> e <code>hashCode</code>.</li>
      </ul>
    </PageContainer>
  );
}
