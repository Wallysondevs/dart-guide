import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DynamicVsObject() {
  return (
    <PageContainer
      title="dynamic vs Object vs Object?"
      subtitle="Três jeitos de dizer &quot;qualquer coisa&quot; — e por que escolher errado pode quebrar seu app."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Em algum momento você vai querer guardar &quot;qualquer coisa&quot; em uma variável: um número, um texto, um objeto desconhecido. O Dart oferece três opções que parecem similares, mas têm comportamentos bem diferentes: <code>dynamic</code>, <code>Object</code> e <code>Object?</code>. Pense neles como três tipos de envelope: <em>dynamic</em> é um envelope sem etiqueta (você nunca sabe o que tem dentro até abrir e nem o sistema te ajuda); <em>Object</em> é um envelope que &quot;tem alguma coisa garantida&quot;; e <em>Object?</em> é um envelope que &quot;pode até estar vazio&quot;.
      </p>

      <h2>dynamic — o &quot;eu sei o que estou fazendo&quot;</h2>
      <p>
        <code>dynamic</code> desliga as checagens estáticas. O compilador (programa que valida e traduz seu código) deixa você chamar qualquer método, e só na hora de rodar é que vai dar errado se o método não existir.
      </p>
      <pre><code>{`dynamic x = 'olá';
print(x.length);          // ok: String tem length
x = 42;
print(x.length);          // EXPLODE em runtime: int não tem length

x.qualquerMetodoMaluco(); // o compilador deixa passar — e quebra na execução`}</code></pre>

      <AlertBox type="warning" title="dynamic é uma porta dos fundos">
        Cada vez que você usa <code>dynamic</code>, está renunciando à proteção do sistema de tipos. Isso vale para casos legítimos (dados vindos de JSON, FFI), mas evite por preguiça.
      </AlertBox>

      <h2>Object — qualquer coisa, exceto null</h2>
      <p>
        Em Dart, todo valor não-nulo herda de <code>Object</code>. Declarar uma variável como <code>Object</code> é dizer: &quot;aceito qualquer valor concreto, mas não aceito <code>null</code>&quot;. As checagens estáticas continuam ativas: você só pode chamar métodos que <em>todo</em> objeto tem (como <code>toString()</code> ou <code>hashCode</code>).
      </p>
      <pre><code>{`Object o = 'texto';
print(o.toString()); // ok: todo objeto tem toString
// print(o.length); // ERRO de compilação: Object não tem length

o = 42;     // ok
o = [1, 2]; // ok
// o = null; // ERRO: 'Null' não é 'Object'`}</code></pre>

      <h2>Object? — qualquer coisa, incluindo null</h2>
      <p>
        <code>Object?</code> é o tipo mais permissivo do Dart sem perder soundness. Aceita qualquer valor — inclusive <code>null</code> — mas obriga você a verificar antes de usar.
      </p>
      <pre><code>{`Object? qualquer = null;
qualquer = 'agora sou texto';
qualquer = 3.14;
qualquer = [1, 2, 3];

// Antes de usar, precisa testar:
if (qualquer is List) {
  print(qualquer.length); // promotion: agora é List, tem length
}`}</code></pre>

      <h2>Comparação direta</h2>
      <p>Veja a diferença prática em uma função que aceita qualquer entrada:</p>
      <pre><code>{`// Versão dynamic — perigosa, sem ajuda do compilador
void imprimirA(dynamic v) {
  print(v.toUpperCase()); // compila, mas só funciona se for String
}

// Versão Object — força você a checar tipos
void imprimirB(Object v) {
  if (v is String) print(v.toUpperCase());
  else print(v.toString());
}

// Versão Object? — também aceita null
void imprimirC(Object? v) {
  if (v == null) {
    print('vazio');
  } else if (v is String) {
    print(v.toUpperCase());
  } else {
    print(v.toString());
  }
}`}</code></pre>

      <AlertBox type="info" title="Regra prática">
        Prefira <code>Object?</code> a <code>dynamic</code> sempre que possível. <code>Object?</code> mantém as checagens; <code>dynamic</code> desliga.
      </AlertBox>

      <h2>Quando dynamic é legítimo</h2>
      <p>
        Existem casos em que <code>dynamic</code> é a escolha certa — mas são raros. Os mais comuns:
      </p>
      <ul>
        <li><strong>Dados externos sem schema</strong>: JSON arbitrário, mensagens de socket, valores vindos de plugin nativo.</li>
        <li><strong>Interop com JS</strong>: quando o tipo só existe do lado JavaScript.</li>
        <li><strong>Reflection/Mirrors</strong>: APIs que retornam objetos cujo tipo só é conhecido em runtime.</li>
        <li><strong>FFI</strong> (Foreign Function Interface): chamadas a bibliotecas C onde o tipo é descoberto dinamicamente.</li>
      </ul>
      <pre><code>{`import 'dart:convert';

void main() {
  final json = '{"nome":"Ana","idade":30}';
  // jsonDecode devolve dynamic — é o caso clássico.
  final dynamic dados = jsonDecode(json);
  if (dados is Map<String, dynamic>) {
    final nome = dados['nome'] as String?;
    final idade = dados['idade'] as int?;
    print('\${nome ?? "?"} - \${idade ?? 0}');
  }
}`}</code></pre>

      <h2>Runtime checks: confirmando o tipo</h2>
      <p>
        Use <code>is</code> para verificar e promover, ou <code>as</code> para forçar uma conversão (lança erro se não bater).
      </p>
      <pre><code>{`Object? valor = 'olá';

// is — checagem segura, com promotion
if (valor is String) {
  print(valor.length);
}

// as — conversão direta, falha em runtime se errado
final s = valor as String;     // ok aqui
print(s.toUpperCase());

// as? não existe; use 'is' antes
final n = valor is num ? valor as num : 0;`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar <code>dynamic</code> achando que é &quot;qualquer tipo&quot;</strong> — perde proteção e autocomplete.</li>
        <li><strong>Não checar antes de usar <code>Object?</code></strong> — não compila para métodos específicos.</li>
        <li><strong>Confundir <code>Object</code> com <code>Object?</code></strong> — o primeiro recusa <code>null</code>.</li>
        <li><strong>Cast desnecessário</strong>: <code>as</code> em algo que já é do tipo certo é ruído visual.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dynamic</code>: sem checagem estática. Use só em casos legítimos (JSON, FFI).</li>
        <li><code>Object</code>: qualquer coisa não-nula. Métodos comuns disponíveis.</li>
        <li><code>Object?</code>: qualquer coisa, inclusive <code>null</code>. O mais seguro para &quot;genérico&quot;.</li>
        <li>Use <code>is</code> para checar e promover; <code>as</code> para forçar conversão.</li>
      </ul>
    </PageContainer>
  );
}
