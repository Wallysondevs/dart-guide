import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NullSafety() {
  return (
    <PageContainer
      title="Null safety: o pilar do Dart 3"
      subtitle="Como o Dart matou o erro mais comum da história da programação — o famoso NullPointerException."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Em 2009, Tony Hoare — o cientista que inventou a referência <code>null</code> em 1965 — pediu desculpas publicamente, chamando sua criação de <em>&quot;o erro de um bilhão de dólares&quot;</em>. Ele tinha razão: durante décadas, programas em Java, C#, JavaScript e Python travaram porque alguém tentou ler uma propriedade de algo que &quot;não existia&quot; (era <code>null</code>). Imagine pedir o telefone de um amigo, mas em vez de uma resposta você recebe um envelope vazio — e o programa, sem saber o que fazer, simplesmente quebra. Isso é o famoso <strong>NullPointerException (NPE)</strong>.
      </p>
      <p>
        O Dart 3 resolveu esse problema de raiz com <strong>sound null safety</strong>. &quot;Sound&quot; (sólido) significa que o sistema de tipos é matematicamente honesto: se o compilador (o programa que traduz seu código para algo executável) diz que uma variável nunca é nula, então ela <em>realmente</em> nunca será nula em tempo de execução. Sem surpresas.
      </p>

      <h2>O problema que motivou null safety</h2>
      <p>
        Em linguagens antigas, qualquer variável podia ser <code>null</code>. Você escrevia código achando que tudo estava bem, e só descobria o problema quando o usuário recebia uma tela branca:
      </p>
      <pre><code>{`// Pseudocódigo no estilo Java/JS antigo
String nome = buscarNome();   // pode devolver null
print(nome.length);            // BOOM: NullPointerException`}</code></pre>
      <p>
        Em Dart 3, esse código <em>nem compila</em>. O compilador exige que você decida, na hora de declarar a variável, se ela pode ou não ser nula.
      </p>

      <h2>String vs String?</h2>
      <p>
        A regra de ouro: por padrão, <strong>nada é nulo</strong>. Se você quiser permitir <code>null</code>, precisa marcar o tipo com uma interrogação no final. É como dizer ao compilador: &quot;ei, este aqui pode estar vazio, fica esperto&quot;.
      </p>
      <pre><code>{`// String NÃO-nulo: o compilador garante que sempre há um valor.
String nome = 'Ana';
// nome = null; // ERRO: 'Null' não pode ser atribuído a 'String'.

// String? (com '?') é nulo-permitido.
String? apelido;          // começa como null
apelido = 'Aninha';        // ok
apelido = null;            // também ok

print(nome.length);        // ok: nome nunca é null
// print(apelido.length); // ERRO: apelido pode ser null!`}</code></pre>

      <AlertBox type="info" title="Analogia da caixa">
        Pense em <code>String</code> como uma caixa que <em>sempre</em> contém algo. Já <code>String?</code> é uma caixa que pode estar vazia. O compilador te obriga a abrir a caixa com cuidado quando ela tem o &quot;?&quot;.
      </AlertBox>

      <h2>Os operadores null-aware</h2>
      <p>
        Para trabalhar com tipos nulo-permitidos sem dor de cabeça, o Dart oferece três operadores essenciais:
      </p>
      <pre><code>{`String? nome;

// 1) ?? — devolve o valor da direita SE a esquerda for null.
final nomeExibido = nome ?? 'Anônimo';
print(nomeExibido); // 'Anônimo'

// 2) ?. — chama o método/getter SÓ se não for null; senão devolve null.
final tamanho = nome?.length;       // tamanho é int?
print(tamanho);                      // null

// 3) ! — afirmação de que NÃO é null. Use só quando tem certeza absoluta.
nome = 'Bia';
final certeza = nome!.length;        // 3 (mas explode se nome fosse null)`}</code></pre>
      <p>
        O <code>!</code> é o &quot;confia em mim&quot; do Dart. Se você usar e estiver errado, recebe um <code>Null check operator used on a null value</code> em runtime. Use com parcimônia.
      </p>

      <AlertBox type="warning" title="Não abuse do !">
        O operador <code>!</code> é a única &quot;porta dos fundos&quot; para furar a null safety. Cada vez que você o usa, está dizendo &quot;eu sei mais que o compilador&quot;. Em 9 de cada 10 casos, é melhor refatorar com <code>??</code> ou <code>if (x != null)</code>.
      </AlertBox>

      <h2>Comparação com outras linguagens</h2>
      <p>
        Se você vem do <strong>Kotlin</strong>, vai se sentir em casa: <code>String?</code> e <code>String</code>, <code>?.</code>, <code>?:</code> (Elvis equivalente ao <code>??</code>), <code>!!</code> (equivalente ao <code>!</code>). É praticamente a mesma sintaxe. Se você vem do <strong>TypeScript com strictNullChecks</strong>, a ideia também é familiar — mas o TypeScript é &quot;unsound&quot;: ele acredita em você, mas no runtime o JavaScript ainda permite tudo. Já o Dart aplica as regras de verdade até o último byte.
      </p>
      <pre><code>{`// Kotlin
val nome: String? = null
val tam = nome?.length ?: 0

// Dart 3 — quase idêntico
final String? nome = null;
final tam = nome?.length ?? 0;`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o ?</strong> e tentar atribuir <code>null</code> — o compilador rejeita imediatamente.</li>
        <li><strong>Usar <code>!</code> por preguiça</strong> — funciona até o dia em que não funciona, e seu app crasha no celular do cliente.</li>
        <li><strong>Confundir <code>??</code> com <code>?.</code></strong> — o primeiro dá um valor padrão, o segundo encadeia chamadas seguras.</li>
        <li><strong>Achar que <code>String?</code> é igual a <code>String</code></strong> — não é. Você precisa &quot;destravar&quot; antes de usar.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Dart 3 tem <strong>sound null safety</strong>: tipos não-nulos são garantidos em tempo de execução.</li>
        <li><code>String</code> nunca é nulo; <code>String?</code> pode ser nulo.</li>
        <li><code>??</code> dá valor padrão, <code>?.</code> faz chamada segura, <code>!</code> afirma &quot;não é nulo&quot;.</li>
        <li>Acabou o NullPointerException — desde que você não abuse do <code>!</code>.</li>
      </ul>
    </PageContainer>
  );
}
