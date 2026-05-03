import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function VariaveisTipos() {
  return (
    <PageContainer
      title="Variáveis e o sistema de tipos do Dart"
      subtitle="Aprenda a guardar valores na memória e por que Dart é tão exigente com tipos — e por que isso é uma vantagem, não um peso."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine que a memória do computador é uma estante gigante de gavetinhas. Cada gavetinha guarda um valor (um número, um texto, um booleano) e tem uma <strong>etiqueta</strong> com um nome. Em programação, essa gavetinha com nome é o que chamamos de <strong>variável</strong>. Em Dart, além do nome, cada gavetinha também tem um <strong>tipo</strong> escrito na etiqueta — isto é, uma promessa de que <em>só</em> caberão valores daquele formato. Essa promessa é verificada pelo <strong>compilador</strong> (o programa que traduz o seu código antes dele rodar), e graças a isso muitos bugs são pegos antes mesmo do app iniciar.
      </p>

      <h2>Declarando uma variável com tipo explícito</h2>
      <p>
        A forma mais clara de declarar uma variável é dizer o tipo dela e o nome:
      </p>
      <pre><code>{`// Declaração explícita: tipo + nome + valor
String nome = 'Maria';     // texto (sequência de caracteres)
int idade = 30;            // número inteiro
double altura = 1.72;      // número com casas decimais
bool ativo = true;         // booleano: true ou false

print(nome);   // Maria
print(idade);  // 30`}</code></pre>
      <p>
        O tipo aparece <em>antes</em> do nome (diferente de Python ou JavaScript). Isso é semelhante a Java, C# ou Kotlin. A vantagem de declarar o tipo é que, se você tentar guardar um número numa gavetinha rotulada como <code>String</code>, o compilador grita imediatamente.
      </p>

      <h2>Inferência de tipos com <code>var</code></h2>
      <p>
        Escrever o tipo toda vez é cansativo. Por isso, Dart oferece a palavra <code>var</code>, que diz: &quot;descubra o tipo a partir do valor que estou atribuindo&quot;. Isso é <strong>inferência</strong> — não é &quot;sem tipo&quot;, é &quot;tipo automático&quot;.
      </p>
      <pre><code>{`var cidade = 'Recife';   // Dart infere String
var contador = 0;        // Dart infere int
var preco = 19.90;       // Dart infere double

// Depois de inferido, o tipo é fixo!
contador = 5;        // OK: int
// contador = 'oi'; // ERRO: 'oi' não é int`}</code></pre>

      <AlertBox type="info" title="var não é dynamic">
        <code>var</code> apenas economiza digitação — o tipo continua sendo verificado pelo compilador. Quem realmente desliga as travas é <code>dynamic</code>, e ele deve ser evitado em código moderno.
      </AlertBox>

      <h2>Sound type system: a promessa que Dart cumpre</h2>
      <p>
        Dart tem um <strong>sound type system</strong> (sistema de tipos &quot;sólido&quot;). Isso significa que se uma variável diz ser <code>String</code>, em tempo de execução ela <em>realmente</em> será uma <code>String</code> ou <code>null</code>. Linguagens menos rigorosas permitem que essa promessa seja quebrada em runtime — Dart não. Isso reduz drasticamente bugs do tipo &quot;esperava texto, veio número&quot;.
      </p>
      <pre><code>{`Object x = 'olá';
// int y = x;    // ERRO em compilação: Object não é int
// Dart não confia: você precisa provar com 'as' ou 'is'
if (x is String) {
  print(x.length); // Aqui x é tratado como String (promotion)
}`}</code></pre>

      <h2>Escopo: onde a variável existe</h2>
      <p>
        <strong>Escopo</strong> é a região do código onde a variável é &quot;visível&quot;. Em Dart, o escopo é delimitado pelas chaves <code>&#123;</code> e <code>&#125;</code>. Uma variável declarada dentro de um bloco morre quando o bloco termina.
      </p>
      <pre><code>{`void main() {
  var fora = 'visível em todo o main';
  if (true) {
    var dentro = 'só vivo aqui';
    print(fora);    // OK
    print(dentro);  // OK
  }
  // print(dentro); // ERRO: dentro não existe mais
}`}</code></pre>

      <h2>Convenções de nomes: camelCase</h2>
      <p>
        Dart adota convenções claras: variáveis e funções em <strong>camelCase</strong> (primeira letra minúscula, palavras seguintes começam em maiúscula). Tipos (classes, enums) em <strong>PascalCase</strong>. Constantes também em camelCase (não SCREAMING_SNAKE).
      </p>
      <pre><code>{`var nomeCompleto = 'Ana Silva';      // camelCase
var quantidadeDeItens = 10;          // camelCase
const valorMaximo = 100;             // camelCase, não MAX_VALUE
class PerfilUsuario {}                // PascalCase`}</code></pre>

      <h2>Sem hoisting e a inicialização preguiçosa com <code>late</code></h2>
      <p>
        Diferente de JavaScript, Dart <strong>não tem hoisting</strong>: você não pode usar uma variável antes de declará-la. Por outro lado, às vezes você quer prometer que vai inicializar a variável depois, sem deixar ela <code>null</code>. Para isso existe <code>late</code>: a variável só é avaliada na primeira leitura.
      </p>
      <pre><code>{`late String descricao;
// descrição ainda não tem valor — mas Dart confia em você

void inicializar() {
  descricao = 'Calculada depois';
}

void main() {
  inicializar();
  print(descricao); // OK
}

// late também serve para inicialização preguiçosa (lazy):
late final String _resultadoCaro = _calcularPesado();
String _calcularPesado() {
  print('Calculando...');
  return '42';
}`}</code></pre>

      <AlertBox type="warning" title="Cuidado com late">
        Se você ler uma variável <code>late</code> antes de atribuir, recebe um <code>LateInitializationError</code> em runtime. Use só quando tiver certeza de que vai atribuir antes de ler.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar <code>var</code> achando que vira <code>dynamic</code>:</strong> não vira. O tipo é fixado na inferência.</li>
        <li><strong>Reatribuir mudando o tipo:</strong> uma vez <code>int</code>, sempre <code>int</code>.</li>
        <li><strong>Nomear classe em camelCase:</strong> o linter vai reclamar — use PascalCase.</li>
        <li><strong>Esquecer de inicializar uma variável não-nullable:</strong> Dart exige um valor (ou <code>late</code>, ou tipo nullable <code>String?</code>).</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Variável é gavetinha de memória com nome e tipo.</li>
        <li><code>String nome = 'x';</code> é declaração explícita; <code>var</code> infere o tipo.</li>
        <li>Dart é <em>sound</em>: o tipo declarado é respeitado em runtime.</li>
        <li>Escopo é delimitado por <code>&#123;...&#125;</code>; sem hoisting.</li>
        <li>Convenção: <code>camelCase</code> para variáveis, <code>PascalCase</code> para tipos.</li>
        <li><code>late</code> permite inicializar depois ou de forma preguiçosa.</li>
      </ul>
    </PageContainer>
  );
}
