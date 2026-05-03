import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NullableTypes() {
  return (
    <PageContainer
      title="Tipos nullable e operadores null-aware"
      subtitle="Como conviver, com elegância, com valores que podem ou não existir."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine que você está organizando uma festa e cada convidado tem um campo &quot;apelido&quot; opcional na ficha. Algumas fichas estão preenchidas (&quot;Bia&quot;, &quot;Caco&quot;), outras não. Em programação, esse &quot;não preenchido&quot; é representado por <code>null</code>. Em Dart 3, qualquer variável que possa ser nula precisa ser declarada explicitamente com <code>?</code> no fim do tipo. Esse é o ponto de partida para operadores poderosos que evitam o famoso travamento por &quot;valor inexistente&quot;.
      </p>

      <h2>Declarando tipos nullable</h2>
      <p>
        Adicionar um <code>?</code> ao tipo é dizer: &quot;esta variável pode estar vazia&quot;. Sem o ponto de interrogação, o compilador (o tradutor que converte seu código em algo executável) garante que ela <em>nunca</em> será nula.
      </p>
      <pre><code>{`String? apelido;          // pode ser null; começa como null
int? idade = 30;          // tem valor agora, mas poderia não ter
List<String>? tags;       // lista que pode ser null

String nomeCompleto = 'Maria'; // NÃO pode ser null. Ponto.`}</code></pre>

      <h2>Type promotion com if (x != null)</h2>
      <p>
        Uma das mágicas mais úteis do Dart é a <strong>promoção de tipo</strong>: dentro de um <code>if</code> que verifica que algo não é nulo, o compilador automaticamente trata aquela variável como não-nula. Você não precisa repetir a checagem nem usar <code>!</code>.
      </p>
      <pre><code>{`String? nome;
nome = lerNomeDoUsuario();

if (nome != null) {
  // Aqui dentro, nome é tratado como String (sem ?).
  print('Olá, \${nome.toUpperCase()}!'); // toUpperCase exige não-nulo
}`}</code></pre>

      <AlertBox type="info" title="Quando o promotion falha">
        Se <code>nome</code> for um <em>getter</em> ou um <em>campo público mutável</em> de uma classe, o compilador não consegue garantir que entre o <code>if</code> e o uso ele não mudou para <code>null</code> em outra thread. A solução é copiar para uma variável local: <code>final n = obj.nome;</code> e usar <code>n</code>.
      </AlertBox>

      <h2>O operador ?? (valor padrão)</h2>
      <p>
        O <code>??</code>, chamado &quot;double question mark&quot; ou &quot;null coalescing&quot;, devolve o valor da esquerda se ele não for nulo; caso contrário, devolve o da direita. É o seu &quot;plano B&quot;.
      </p>
      <pre><code>{`String? entrada;
final exibido = entrada ?? 'sem nome';
print(exibido); // 'sem nome'

// Pode encadear:
String? a, b, c;
final escolhido = a ?? b ?? c ?? 'padrão final';`}</code></pre>

      <h2>O operador ??= (atribui se for null)</h2>
      <p>
        O <code>??=</code> atribui um valor à variável <strong>somente se ela ainda for nula</strong>. Útil para inicialização preguiçosa.
      </p>
      <pre><code>{`String? cache;
cache ??= calcularCaroCarregamento(); // só calcula na primeira vez
cache ??= 'outro';                     // ignorado: já tem valor`}</code></pre>

      <h2>O operador ?. (acesso seguro)</h2>
      <p>
        Em vez de fazer <code>if (x != null) x.metodo()</code>, escreva <code>x?.metodo()</code>. Se <code>x</code> for nulo, a expressão inteira vira <code>null</code> sem explodir.
      </p>
      <pre><code>{`class Endereco { String? cidade; }
class Pessoa { Endereco? endereco; }

Pessoa? p;

// Encadeamento seguro: se qualquer elo for null, o resultado é null.
final cidade = p?.endereco?.cidade;
print(cidade); // null, sem crash

// Equivalente verboso:
String? cidade2;
if (p != null && p.endereco != null) {
  cidade2 = p.endereco!.cidade;
}`}</code></pre>

      <AlertBox type="warning" title="Cuidado com !">
        O operador <code>!</code> (bang) afirma &quot;eu garanto que não é nulo&quot;. Se você mentir, o app trava em runtime com <em>Null check operator used on a null value</em>. Use só quando o tipo claramente não pode ser nulo naquele ponto e o compilador não consegue deduzir.
      </AlertBox>

      <h2>Cascades seguros (?..)</h2>
      <p>
        Cascade (<code>..</code>) permite chamar vários métodos no mesmo objeto. A versão <code>?..</code> só executa se o objeto não for nulo.
      </p>
      <pre><code>{`StringBuffer? sb = StringBuffer();
sb
  ?..write('Olá ')
  ..write('mundo')
  ..writeln('!');
print(sb); // 'Olá mundo!\\n'`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>?</code></strong> e tentar atribuir <code>null</code> — não compila.</li>
        <li><strong>Usar <code>!</code> em getter mutável</strong> — pode falhar entre a checagem e o uso.</li>
        <li><strong>Confundir <code>??</code> com <code>?:</code> (ternário)</strong> — <code>?:</code> testa booleanos; <code>??</code> testa nulidade.</li>
        <li><strong>Encadeamento desnecessário</strong>: se <code>x</code> nunca é nulo, escrever <code>x?.algo</code> é ruído visual.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>String?</code> permite <code>null</code>; <code>String</code> não.</li>
        <li><code>if (x != null)</code> faz promotion automática para o tipo não-nulo.</li>
        <li><code>??</code> dá valor padrão; <code>??=</code> atribui se ainda for nulo.</li>
        <li><code>?.</code> e <code>?..</code> permitem chamar métodos com segurança em alvos potencialmente nulos.</li>
        <li><code>!</code> é a saída de emergência — use com responsabilidade.</li>
      </ul>
    </PageContainer>
  );
}
