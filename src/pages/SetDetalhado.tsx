import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SetDetalhado() {
  return (
    <PageContainer
      title="Set<T> detalhado: matemática de conjuntos"
      subtitle="A coleção sem duplicatas e com operações de união, interseção e diferença."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Pense em um <strong>saco de bolinhas coloridas onde nenhuma cor se repete</strong>: se você jogar uma segunda bolinha vermelha, ela é simplesmente ignorada. Essa é a essência do <code>Set&lt;T&gt;</code>: uma coleção <strong>sem duplicatas</strong> e tipicamente <em>sem ordem garantida</em>. Ele é perfeito para responder perguntas como &quot;quem são os usuários únicos que clicaram no botão?&quot; ou &quot;quais tags aparecem em pelo menos um post?&quot;. Por baixo dos panos, a verificação &quot;esse elemento já está aqui?&quot; é praticamente instantânea, graças ao mesmo hashing usado em <code>Map</code>.
      </p>

      <h2>Criando um Set</h2>
      <pre><code>{`// 1) Literal — funciona desde que tenha pelo menos um elemento.
final cores = {'azul', 'vermelho', 'verde'};
print(cores.runtimeType); // _Set<String>

// CUIDADO: {} sozinho NÃO é Set vazio — é Map vazio!
final vazio1 = {};            // Map<dynamic, dynamic>
final vazio2 = <int>{};       // AGORA sim, Set<int>
final vazio3 = Set<int>();    // outra forma

// 2) Set.of — copia outra coleção, removendo duplicatas.
final unicos = Set.of([1, 2, 2, 3, 3, 3]); // {1, 2, 3}

// 3) Set.from — versão que aceita conversão de tipo.
final convertido = Set<int>.from(<num>[1, 2, 3]);`}</code></pre>

      <AlertBox type="warning" title="A pegadinha do {} vazio">
        Como o literal de Map também usa chaves, <code>{`{}`}</code> sem nada dentro é <strong>sempre Map</strong>. Para criar Set vazio, escreva <code>&lt;int&gt;&#123;&#125;</code> ou <code>Set&lt;int&gt;()</code>.
      </AlertBox>

      <h2>Operações básicas</h2>
      <pre><code>{`final s = <int>{1, 2, 3};

s.add(4);            // {1,2,3,4}
s.add(2);            // continua {1,2,3,4} — duplicata ignorada
s.addAll([5, 6, 1]); // {1,2,3,4,5,6}
s.remove(3);         // {1,2,4,5,6}
s.removeWhere((x) => x.isEven);
print(s.contains(5)); // true — verificação em O(1)
print(s.length);      // tamanho atual`}</code></pre>

      <h2>Matemática de conjuntos</h2>
      <p>
        Aqui o Set brilha. Esses métodos retornam <strong>novos Sets</strong>, sem modificar os originais:
      </p>
      <pre><code>{`final a = {1, 2, 3, 4};
final b = {3, 4, 5, 6};

print(a.union(b));        // {1,2,3,4,5,6} — tudo de A e B
print(a.intersection(b)); // {3,4} — só o que está em AMBOS
print(a.difference(b));   // {1,2} — está em A mas não em B
print(b.difference(a));   // {5,6} — está em B mas não em A`}</code></pre>

      <h2>O método lookup: pegar o objeto &quot;canônico&quot;</h2>
      <p>
        Imagine um Set de objetos <code>Pessoa</code> onde &quot;igualdade&quot; é definida pelo CPF. Você tem em mãos um objeto novo com o mesmo CPF e quer pegar o <em>objeto original</em> que está no Set (talvez com mais campos preenchidos). É exatamente para isso que existe <code>lookup</code>:
      </p>
      <pre><code>{`class Pessoa {
  final String cpf;
  final String nome;
  Pessoa(this.cpf, this.nome);

  @override
  bool operator ==(Object o) => o is Pessoa && o.cpf == cpf;
  @override
  int get hashCode => cpf.hashCode;
}

final cadastro = {Pessoa('111', 'Ana'), Pessoa('222', 'Beto')};

// Sondamos com um objeto &quot;chave&quot; e recebemos o original do Set.
final achou = cadastro.lookup(Pessoa('111', '?'));
print(achou?.nome); // 'Ana'`}</code></pre>

      <h2>Caso de uso clássico: deduplicar</h2>
      <pre><code>{`final emails = [
  'a@x.com',
  'b@x.com',
  'a@x.com',
  'c@x.com',
  'b@x.com',
];

// Truque: passar pela Set tira repetidos; toList volta para List.
final unicos = emails.toSet().toList();
print(unicos); // [a@x.com, b@x.com, c@x.com]

// Em Dart 3.5+, dá para preservar ordem com LinkedHashSet (default do literal).`}</code></pre>

      <AlertBox type="info" title="Igualdade é tudo">
        Para Set funcionar, os elementos precisam de <code>==</code> e <code>hashCode</code> coerentes. Para <code>String</code>, <code>int</code>, <code>double</code> e records isso já vem pronto. Para classes próprias, sobrescreva os dois (ou use <code>package:freezed</code>/<code>equatable</code>).
      </AlertBox>

      <h2>Iteração e conversão</h2>
      <pre><code>{`final s = {'a', 'b', 'c'};

for (final e in s) {
  print(e);
}

// Set é um Iterable — pode usar where, map, fold, etc.
final maiusculas = s.map((x) => x.toUpperCase()).toSet();

// Voltar para lista quando precisar de ordem por índice:
final lista = s.toList();`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Confiar na ordem</strong> de iteração: o literal preserva inserção, mas <code>HashSet</code> não. Não dependa de ordem se não usou <code>LinkedHashSet</code>/literal.</li>
        <li><strong>Esquecer <code>==</code>/<code>hashCode</code></strong> em classes — duplicatas &quot;mágicas&quot; aparecem.</li>
        <li><strong>Usar <code>{`{}`}</code> achando que é Set vazio</strong> — é Map.</li>
        <li><strong>Modificar o objeto depois de adicionado</strong> e quebrar o hash — o Set perde o item.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Set é coleção sem duplicatas, com <code>contains</code> em O(1).</li>
        <li>Literal vazio precisa de tipo: <code>&lt;T&gt;&#123;&#125;</code>.</li>
        <li><code>union</code>, <code>intersection</code> e <code>difference</code> retornam novos Sets.</li>
        <li><code>lookup</code> devolve o objeto canônico armazenado.</li>
        <li>Igualdade depende de <code>==</code> e <code>hashCode</code>.</li>
      </ul>
    </PageContainer>
  );
}
