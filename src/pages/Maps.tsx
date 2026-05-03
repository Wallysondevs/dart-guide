import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Maps() {
  return (
    <PageContainer
      title="Maps: dicionários chave-valor"
      subtitle="Quando você precisa associar uma chave a um valor — como um dicionário onde palavra leva à definição."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine um <strong>dicionário de papel</strong>: você procura uma palavra (a <em>chave</em>) e recebe a definição (o <em>valor</em>). É exatamente assim que funciona um <code>Map</code> em Dart. Listas usam <em>números</em> (índices) para localizar itens; Maps usam <em>qualquer coisa</em> — strings, inteiros, até objetos. Maps são essenciais para configurações, contagens, cache e parsing de JSON.
      </p>

      <h2>Criando um Map</h2>
      <p>
        A forma mais natural é usar o literal com chaves <code>&#123;...&#125;</code> e o separador <code>:</code> entre chave e valor.
      </p>
      <pre><code>{`// Inferido como Map<String, int>
var idades = {
  'Ana': 30,
  'Beto': 25,
  'Caio': 40,
};

// Tipo explícito
Map<String, double> precos = {
  'pão': 0.50,
  'leite': 5.20,
};

// Map vazio precisa do tipo!
var vazio = <String, int>{};
Map<String, int> vazio2 = {};

// Construtor explícito
var m = Map<String, int>();
m['x'] = 1;`}</code></pre>

      <AlertBox type="info" title="Cuidado: chaves vazias parecem Set">
        <code>&#123;&#125;</code> sem nada dentro é um <strong>Map</strong> por padrão (não Set). Para forçar ser um Set vazio, use <code>&lt;int&gt;&#123;&#125;</code>.
      </AlertBox>

      <h2>Lendo e escrevendo</h2>
      <p>
        O acesso é por <em>indexação</em>, igual a uma lista, mas usando a chave. Se a chave não existir, devolve <code>null</code> — por isso o tipo de retorno é <code>V?</code> (nullable).
      </p>
      <pre><code>{`var idades = {'Ana': 30, 'Beto': 25};

print(idades['Ana']);       // 30
print(idades['Zico']);      // null (chave não existe)

// Atribuir/atualizar
idades['Caio'] = 40;        // adiciona
idades['Ana'] = 31;         // atualiza
idades['Beto'] = idades['Beto']! + 1;   // ! força não-null`}</code></pre>

      <h2><code>putIfAbsent</code>: o atalho elegante</h2>
      <p>
        Padrão muito comum: &quot;se a chave não existe, crie&quot;. Em vez de checar manualmente, use <code>putIfAbsent</code>, que recebe uma função para construir o valor só se necessário.
      </p>
      <pre><code>{`final cache = <String, List<int>>{};

cache.putIfAbsent('primos', () => [2, 3, 5, 7]);
cache.putIfAbsent('primos', () => [99, 99]);  // ignorado

print(cache); // {primos: [2, 3, 5, 7]}

// Cenário clássico: agrupar
final palavras = ['casa', 'cachorro', 'arroz', 'avião'];
final porLetra = <String, List<String>>{};
for (final p in palavras) {
  porLetra.putIfAbsent(p[0], () => []).add(p);
}
print(porLetra);   // {c: [casa, cachorro], a: [arroz, avião]}`}</code></pre>

      <h2>Verificando, removendo e iterando</h2>
      <pre><code>{`var m = {'a': 1, 'b': 2, 'c': 3};

print(m.containsKey('a'));    // true
print(m.containsValue(2));    // true
print(m.length);              // 3
print(m.isEmpty);             // false

m.remove('b');                // remove e devolve o valor
m.removeWhere((k, v) => v > 2);

// Iterar
m.forEach((chave, valor) {
  print('\$chave -> \$valor');
});

// Listar chaves, valores ou entradas
print(m.keys.toList());       // [a, c]  (Iterable)
print(m.values.toList());     // [1, 3]
for (final entrada in m.entries) {
  print('\${entrada.key}=\${entrada.value}');
}`}</code></pre>

      <h2>Atualizando com <code>update</code></h2>
      <p>
        <code>update</code> aplica uma função ao valor atual. Se a chave não existe, você pode passar <code>ifAbsent</code> para criá-la.
      </p>
      <pre><code>{`final contagem = <String, int>{};
final letras = ['a', 'b', 'a', 'c', 'b', 'a'];

for (final l in letras) {
  contagem.update(l, (v) => v + 1, ifAbsent: () => 1);
}
print(contagem);   // {a: 3, b: 2, c: 1}`}</code></pre>

      <h2>Maps imutáveis e ordem das chaves</h2>
      <p>
        Por padrão, o literal <code>&#123;&#125;</code> cria um <code>LinkedHashMap</code>: as chaves preservam a <strong>ordem de inserção</strong>. Se você precisar de ordem alfabética, use <code>SplayTreeMap</code> (de <code>dart:collection</code>, mas isso é mais avançado). Para imutabilidade, use <code>const</code> ou <code>Map.unmodifiable</code>.
      </p>
      <pre><code>{`const config = {'tema': 'dark', 'idioma': 'pt'};
// config['tema'] = 'light';  // ERRO: const

final base = {'a': 1, 'b': 2};
final fixo = Map<String, int>.unmodifiable(base);
// fixo['c'] = 3;             // ERRO em runtime`}</code></pre>

      <AlertBox type="success" title="Map é a base do JSON">
        Quando você decodifica um JSON com <code>jsonDecode</code>, recebe um <code>Map&lt;String, dynamic&gt;</code>. Por isso dominar Maps é pré-requisito para qualquer integração com APIs.
      </AlertBox>

      <h2>Spread, collection-if/for em Maps</h2>
      <p>
        Maps suportam os mesmos açúcares sintáticos das listas:
      </p>
      <pre><code>{`final base = {'a': 1, 'b': 2};
final extras = {'c': 3};

final juntos = {...base, ...extras, 'd': 4};
print(juntos);   // {a:1, b:2, c:3, d:4}

final mostrarDebug = true;
final config = {
  'tema': 'dark',
  if (mostrarDebug) 'debug': true,
  for (var i = 0; i < 3; i++) 'item\$i': i * 10,
};
print(config);`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar não-null em <code>m[k]</code></strong> — sempre é <code>V?</code>; use <code>!</code> com cuidado ou <code>?? padrao</code>.</li>
        <li><strong>Usar <code>&#123;&#125;</code> achando que é Set vazio</strong> — é Map vazio.</li>
        <li><strong>Modificar map durante iteração</strong> — gera <code>ConcurrentModificationError</code>.</li>
        <li><strong>Esquecer que chaves precisam ter <code>==</code> e <code>hashCode</code> coerentes</strong> ao usar objetos próprios como chaves.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Map&lt;K, V&gt;</code> associa chaves a valores.</li>
        <li>Literal: <code>&#123;'a': 1, 'b': 2&#125;</code>; vazio: <code>&lt;K, V&gt;&#123;&#125;</code>.</li>
        <li>Acesso <code>m[k]</code> devolve <code>V?</code>.</li>
        <li><code>putIfAbsent</code> e <code>update</code> são padrões idiomáticos.</li>
        <li>Iteração: <code>forEach</code>, <code>keys</code>, <code>values</code>, <code>entries</code>.</li>
        <li>Spread <code>...</code> e collection-if/for funcionam em Maps.</li>
      </ul>
    </PageContainer>
  );
}
