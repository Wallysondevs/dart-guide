import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function GenericsFuncoes() {
  return (
    <PageContainer
      title="Funções genéricas: parametrizando o tipo"
      subtitle="Escreva uma função uma vez e use com qualquer tipo, sem perder a checagem do compilador."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Imagine uma fôrma de bolo que serve para qualquer massa: você coloca chocolate, sai bolo de chocolate; coloca cenoura, sai de cenoura. A fôrma é a mesma — só muda o que entra. Em Dart, <strong>funções genéricas</strong> são fôrmas: você escreve a lógica uma única vez, e o compilador (programa que valida tipos antes de rodar) ajusta o tipo de acordo com o que você passa. O resultado é código reutilizável <em>e</em> seguro, sem cair no vale-tudo do <code>dynamic</code>.
      </p>

      <h2>Sintaxe básica: o &lt;T&gt;</h2>
      <p>
        Você declara um <strong>parâmetro de tipo</strong> entre <code>&lt; &gt;</code> logo depois do nome da função. <code>T</code> é só uma letra-padrão (de <em>Type</em>) — pode ser <code>E</code>, <code>K</code>, <code>V</code>, <code>Item</code>, qualquer coisa. Dentro da função, você usa <code>T</code> como se fosse um tipo de verdade.
      </p>
      <pre><code>{`// Devolve o primeiro elemento de qualquer lista.
T primeiro<T>(List<T> lista) => lista[0];

void main() {
  final n = primeiro<int>([10, 20, 30]);     // n é int = 10
  final s = primeiro<String>(['a', 'b']);    // s é String = 'a'

  // Inferência: o compilador descobre o T sozinho.
  final n2 = primeiro([1, 2, 3]);            // T inferido como int
  print(n2);
}`}</code></pre>

      <AlertBox type="info" title="Inferência de tipo">
        Você raramente precisa escrever <code>&lt;int&gt;</code> explícito. O compilador <em>infere</em> o tipo a partir dos argumentos. Só especifique se a inferência ficar ambígua ou se quiser deixar a intenção clara.
      </AlertBox>

      <h2>Vários parâmetros de tipo</h2>
      <p>
        Você pode declarar mais de um, separados por vírgula: <code>&lt;K, V&gt;</code>, <code>&lt;A, B, R&gt;</code>. Comuns em transformações de coleções.
      </p>
      <pre><code>{`// Inverte um Map: chave vira valor e vice-versa.
Map<V, K> inverter<K, V>(Map<K, V> entrada) {
  return {for (final e in entrada.entries) e.value: e.key};
}

void main() {
  final notas = {'Ana': 9, 'Bia': 7};
  final inv = inverter(notas);  // Map<int, String>
  print(inv); // {9: Ana, 7: Bia}
}`}</code></pre>

      <h2>Restrições com <code>extends</code></h2>
      <p>
        Sem restrições, <code>T</code> aceita qualquer coisa — você pode chamar pouquíssimos métodos (só os de <code>Object?</code>). Para usar operações específicas (comparar, somar, etc.), restrinja <code>T</code> com <code>extends</code>.
      </p>
      <pre><code>{`// T precisa ser comparável (ter compareTo).
T maior<T extends Comparable<T>>(T a, T b) {
  return a.compareTo(b) >= 0 ? a : b;
}

void main() {
  print(maior(10, 20));            // 20
  print(maior('banana', 'abacaxi')); // banana
  print(maior(3.5, 2.7));          // 3.5
  // print(maior(true, false));    // ERRO: bool não é Comparable
}`}</code></pre>
      <p>
        Sem o <code>extends Comparable&lt;T&gt;</code>, o compilador não saberia que <code>T</code> tem o método <code>compareTo</code>. A restrição informa "todo <code>T</code> daqui em diante é, no mínimo, um <code>Comparable</code>".
      </p>

      <h2>Genéricos em transformações</h2>
      <p>
        Ótimo para utilitários que recebem uma função para mudar o tipo. <code>map</code> da biblioteca padrão é exatamente isso: <code>Iterable&lt;R&gt; map&lt;R&gt;(R Function(E e) f)</code>.
      </p>
      <pre><code>{`/// Aplica uma função a cada item, devolvendo nova lista.
List<R> mapear<E, R>(List<E> lista, R Function(E) f) {
  final saida = <R>[];
  for (final e in lista) {
    saida.add(f(e));
  }
  return saida;
}

void main() {
  final nums = [1, 2, 3];
  final textos = mapear(nums, (n) => 'item-\$n'); // List<String>
  print(textos); // [item-1, item-2, item-3]

  final tamanhos = mapear(['oi', 'tudo'], (s) => s.length); // List<int>
  print(tamanhos); // [2, 4]
}`}</code></pre>

      <h2>Genéricos com null-safety</h2>
      <p>
        Se você quer que o genérico aceite <code>null</code>, declare como <code>T?</code> nas posições adequadas. A restrição padrão é <code>extends Object?</code> (o famoso "qualquer coisa, inclusive null").
      </p>
      <pre><code>{`/// Devolve o primeiro elemento ou null se a lista estiver vazia.
T? primeiroOuNulo<T>(List<T> lista) {
  return lista.isEmpty ? null : lista.first;
}

void main() {
  print(primeiroOuNulo<int>([]));        // null
  print(primeiroOuNulo([10, 20]));       // 10
}`}</code></pre>

      <AlertBox type="warning" title="Não use dynamic como atalho">
        É tentador escrever <code>dynamic primeiro(List lista) =&gt; lista[0];</code>. Funciona, mas desliga toda a checagem do compilador — bugs aparecem só em runtime. Genéricos custam pouco para escrever e te protegem muito.
      </AlertBox>

      <h2>Exemplo prático: cache genérico</h2>
      <p>
        Cache que guarda qualquer tipo de chave e valor, com tempo de expiração. Note como <code>K</code> e <code>V</code> tornam a classe utilizável para qualquer combinação.
      </p>
      <pre><code>{`class Cache<K, V> {
  final Map<K, ({V valor, DateTime expira})> _store = {};
  final Duration ttl;

  Cache({this.ttl = const Duration(minutes: 5)});

  void salvar(K chave, V valor) {
    _store[chave] = (valor: valor, expira: DateTime.now().add(ttl));
  }

  V? obter(K chave) {
    final r = _store[chave];
    if (r == null) return null;
    if (DateTime.now().isAfter(r.expira)) {
      _store.remove(chave);
      return null;
    }
    return r.valor;
  }
}

void main() {
  final cache = Cache<String, int>();
  cache.salvar('idade', 30);
  print(cache.obter('idade')); // 30
}`}</code></pre>

      <h2>Genéricos em métodos vs em classes</h2>
      <p>
        Você pode declarar genéricos no nível da <strong>classe</strong> (todos os métodos compartilham o mesmo <code>T</code>) ou no nível do <strong>método</strong> (cada chamada decide o seu).
      </p>
      <pre><code>{`class Pilha<T> {                  // T é da classe
  final _itens = <T>[];
  void empilhar(T x) => _itens.add(x);
  T desempilhar() => _itens.removeLast();

  R Function() agrupar<R>(R Function(List<T>) f) {  // R é só do método
    final copia = List<T>.of(_itens);
    return () => f(copia);
  }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>&lt;T&gt;</code></strong> na assinatura — vira função com tipo concreto.</li>
        <li><strong>Usar <code>T</code> como classe</strong>: <code>new T()</code> não compila — Dart não permite instanciar genéricos diretamente.</li>
        <li><strong>Restringir demais</strong> com <code>extends</code>: limita reuso. Use só o necessário.</li>
        <li><strong>Forçar tipo errado</strong>: <code>primeiro&lt;String&gt;([1, 2])</code> — o compilador acusa.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Função genérica usa <code>&lt;T&gt;</code> entre nome e parênteses.</li>
        <li>Inferência detecta o tipo automaticamente na maioria dos casos.</li>
        <li>Múltiplos tipos: <code>&lt;K, V&gt;</code>, <code>&lt;A, B, R&gt;</code>.</li>
        <li>Restrições com <code>extends</code> liberam métodos do supertipo.</li>
        <li>Mais seguro e expressivo do que <code>dynamic</code>.</li>
      </ul>
    </PageContainer>
  );
}
