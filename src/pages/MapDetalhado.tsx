import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function MapDetalhado() {
  return (
    <PageContainer
      title="Map<K,V> detalhado: lookup eficiente"
      subtitle="Pares chave-valor: a estrutura ideal para buscas instantâneas."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Imagine um <strong>dicionário físico</strong>: você procura uma palavra (a <em>chave</em>) e encontra a definição (o <em>valor</em>). O <code>Map&lt;K,V&gt;</code> do Dart funciona igual — só que ele acha a definição em <strong>tempo praticamente constante</strong>, sem precisar folhear página por página. <code>K</code> é o tipo da chave (geralmente <code>String</code> ou <code>int</code>) e <code>V</code> é o tipo do valor. Use Map sempre que precisar de <em>busca rápida por identificador</em>: id de usuário → objeto Usuário, código do produto → preço, e por aí vai.
      </p>

      <h2>Criando um Map</h2>
      <pre><code>{`// 1) Literal — o caminho mais comum.
final idades = <String, int>{
  'Ana': 30,
  'Beto': 25,
  'Carla': 41,
};

// 2) Map.of — copia outro Map preservando o tipo.
final copia = Map.of(idades);

// 3) Map.from — converte de um Map<dynamic, dynamic>.
final convertido = Map<String, int>.from({'X': 1, 'Y': 2});

// 4) Map.fromEntries — a partir de uma lista de pares.
final mapa = Map.fromEntries([
  MapEntry('a', 1),
  MapEntry('b', 2),
]);

// 5) Map.fromIterable — gera chaves e valores a partir de uma lista.
final quadrados = Map.fromIterable(
  [1, 2, 3],
  key: (n) => 'n_\$n',
  value: (n) => n * n,
); // {n_1: 1, n_2: 4, n_3: 9}

// 6) Map.fromIterables — duas listas paralelas.
final precos = Map.fromIterables(
  ['pão', 'leite', 'café'],
  [5.0, 6.5, 18.0],
);`}</code></pre>

      <AlertBox type="info" title="Por que Map é &quot;rápido&quot;?">
        Por baixo, o Map usa <strong>hashing</strong>: ele transforma a chave em um número e usa esse número para saber direto em qual &quot;gaveta interna&quot; o valor está. Por isso <code>mapa['Ana']</code> é quase instantâneo, mesmo com milhões de entradas.
      </AlertBox>

      <h2>Lendo, escrevendo e checando</h2>
      <pre><code>{`final estoque = <String, int>{'maçã': 10, 'pera': 0};

// Leitura: retorna V? (pode ser null se a chave não existir).
final qtdMaca = estoque['maçã'];   // 10
final qtdUva  = estoque['uva'];    // null

// Escrita / atualização: simplesmente atribua.
estoque['banana'] = 5;

// Checar existência:
print(estoque.containsKey('uva'));   // false
print(estoque.containsValue(0));     // true
print(estoque.length);               // 3

// Listas de chaves, valores, entradas (são Iterables — lazy).
print(estoque.keys.toList());        // [maçã, pera, banana]
print(estoque.values.toList());      // [10, 0, 5]
for (final entry in estoque.entries) {
  print('\${entry.key} = \${entry.value}');
}`}</code></pre>

      <h2>putIfAbsent, update e updateAll</h2>
      <p>
        Esses métodos resolvem padrões clássicos sem precisar de <code>if</code> verboso:
      </p>
      <pre><code>{`final contagem = <String, int>{};

// putIfAbsent: insere SÓ SE a chave não existir; retorna o valor atual.
contagem.putIfAbsent('a', () => 0);
contagem.putIfAbsent('a', () => 999); // não muda; já existe.

// update: atualiza valor existente; opcionalmente insere se faltar.
final palavras = ['oi', 'oi', 'tchau', 'oi'];
for (final p in palavras) {
  contagem.update(p, (v) => v + 1, ifAbsent: () => 1);
}
print(contagem); // {a: 0, oi: 3, tchau: 1}

// updateAll: aplica uma transformação a TODOS os valores.
final precos = {'a': 10.0, 'b': 20.0};
precos.updateAll((k, v) => v * 1.1); // aumenta 10%`}</code></pre>

      <h2>Removendo</h2>
      <pre><code>{`final m = {'a': 1, 'b': 2, 'c': 3, 'd': 4};

m.remove('a');                        // remove e devolve o valor antigo.
m.removeWhere((k, v) => v.isEven);    // remove pares que casam.
m.clear();                            // esvazia tudo.`}</code></pre>

      <h2>LinkedHashMap: o padrão silencioso</h2>
      <p>
        Quando você escreve <code>{`{}`}</code> ou <code>Map()</code>, o Dart cria por baixo um <strong>LinkedHashMap</strong>. Isso significa que a <em>ordem de inserção das chaves é preservada</em> — quando você itera, os pares vêm na ordem em que foram adicionados. Isso é útil para gerar JSON, exibir na UI e debug. As outras implementações (<code>HashMap</code>, sem ordem garantida; <code>SplayTreeMap</code>, ordenado por chave) são acessadas via <code>import 'dart:collection'</code> quando você precisa de comportamento específico.
      </p>
      <pre><code>{`import 'dart:collection';

final lhm = LinkedHashMap<String, int>(); // ordem de inserção
final hm  = HashMap<String, int>();       // sem ordem (mais rápido)
final stm = SplayTreeMap<String, int>();  // sempre ordenado por chave`}</code></pre>

      <AlertBox type="warning" title="Map literal sempre LinkedHash">
        Você não &quot;ganha&quot; HashMap escrevendo <code>{`{}`}</code>; sempre vai vir o <code>LinkedHashMap</code>. Se a perda de microssegundos por preservar ordem for crítica (raro!), construa explicitamente com <code>HashMap()</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer que leitura retorna nulo:</strong> <code>mapa[chave]</code> é <code>V?</code>, não <code>V</code>. Trate o <code>null</code>.</li>
        <li><strong>Usar objeto mutável como chave:</strong> se você modificar o objeto depois, o Map &quot;perde&quot; a referência. Prefira chaves imutáveis (String, int, records, classes com <code>==</code>/<code>hashCode</code> bem definidos).</li>
        <li><strong>Iterar e modificar:</strong> não faça <code>add</code>/<code>remove</code> em um <code>for (final k in mapa.keys)</code>. Use <code>removeWhere</code> ou copie as chaves antes.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Map associa chaves a valores com lookup praticamente instantâneo.</li>
        <li>Crie com literal, <code>Map.of</code>, <code>Map.from</code>, <code>fromEntries</code>, <code>fromIterable</code>, <code>fromIterables</code>.</li>
        <li><code>putIfAbsent</code>, <code>update</code> e <code>updateAll</code> evitam if-then-else manual.</li>
        <li>Map literal é <code>LinkedHashMap</code>: preserva ordem de inserção.</li>
        <li>Para outras implementações, importe <code>dart:collection</code>.</li>
      </ul>
    </PageContainer>
  );
}
