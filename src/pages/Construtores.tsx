import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Construtores() {
  return (
    <PageContainer
      title="Construtores: dando vida aos objetos"
      subtitle="Como inicializar campos, usar parâmetros nomeados e a sintaxe enxuta de Dart para construtores."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Voltemos à analogia da planta de casa. Quando os pedreiros vão erguer a casa, eles seguem uma <strong>cerimônia de fundação</strong>: marcam o terreno, lançam o concreto, levantam paredes. Em Dart, o <strong>construtor</strong> é essa cerimônia: o método especial que prepara o objeto recém-criado, atribuindo valores iniciais aos campos antes que qualquer outro código possa usá-lo.
      </p>

      <h2>Construtor padrão (gerado automaticamente)</h2>
      <p>
        Se você não escreve nenhum construtor, Dart gera um sem parâmetros para você. Ele simplesmente aceita os valores iniciais de cada campo (ou exige que você os forneça via null-safety).
      </p>
      <pre><code>{`class Ponto {
  double x = 0;
  double y = 0;
  // Construtor implícito Ponto() — sem parâmetros.
}

void main() {
  final p = Ponto();
  p.x = 3;
  p.y = 4;
}`}</code></pre>

      <h2>Construtor com parâmetros</h2>
      <p>
        Para receber valores na hora da criação, escreva uma função com o <strong>mesmo nome da classe</strong>, sem tipo de retorno.
      </p>
      <pre><code>{`class Ponto {
  double x;
  double y;

  // Construtor explícito.
  Ponto(double valorX, double valorY) {
    x = valorX;
    y = valorY;
  }
}`}</code></pre>
      <p>
        Esse jeito funciona, mas é verboso. Dart oferece atalhos elegantes para evitar essa repetição.
      </p>

      <h2>Atalho <code>this.x</code></h2>
      <p>
        Quando o parâmetro tem o mesmo nome de um campo, você pode escrever <code>this.x</code> diretamente na lista de parâmetros — Dart atribui o valor automaticamente.
      </p>
      <pre><code>{`class Ponto {
  double x;
  double y;

  Ponto(this.x, this.y); // Sem corpo. Atribuição automática.
}

void main() {
  final p = Ponto(3, 4);
  print('\${p.x}, \${p.y}'); // 3, 4
}`}</code></pre>

      <h2>Parâmetros nomeados com <code>required</code></h2>
      <p>
        Para classes com vários campos, parâmetros posicionais ficam confusos: <code>Pessoa('Ana', 30, true, 1.65)</code>. Parâmetros <strong>nomeados</strong> deixam o uso autoexplicativo.
      </p>
      <pre><code>{`class Pessoa {
  final String nome;
  final int idade;
  final double altura;

  // Chaves criam parâmetros nomeados; 'required' os torna obrigatórios.
  Pessoa({required this.nome, required this.idade, this.altura = 1.70});
}

void main() {
  final ana = Pessoa(nome: 'Ana', idade: 30, altura: 1.62);
  final bruno = Pessoa(nome: 'Bruno', idade: 25); // altura usa default
}`}</code></pre>
      <p>
        Sem <code>required</code> e sem valor padrão, Dart não compila — porque o campo não-nulo poderia ficar sem valor.
      </p>

      <AlertBox type="info" title="Por que final?">
        <code>final</code> diz que o campo só pode ser atribuído <strong>uma vez</strong> — no construtor. Combinado com classes imutáveis, evita bugs em que algo muda &quot;sozinho&quot; depois.
      </AlertBox>

      <h2>Initializing list (lista de inicialização)</h2>
      <p>
        Os <strong>dois pontos</strong> depois da assinatura do construtor abrem a lista de inicialização. Ela roda <em>antes</em> do corpo e serve para inicializar campos <code>final</code>, validar com <code>assert</code>, ou chamar o construtor da superclasse.
      </p>
      <pre><code>{`class Retangulo {
  final double largura;
  final double altura;
  final double area;

  Retangulo(this.largura, this.altura)
      : area = largura * altura,
        assert(largura > 0, 'largura deve ser positiva');
}`}</code></pre>

      <h2>Construtores redirecionados</h2>
      <p>
        Quando um construtor é só um caso particular de outro, redirecione com <code>: this(...)</code> em vez de duplicar lógica.
      </p>
      <pre><code>{`class Ponto {
  final double x;
  final double y;

  Ponto(this.x, this.y);
  // Redireciona para o construtor principal com x = y = 0.
  Ponto.origem() : this(0, 0);
}`}</code></pre>

      <h2><code>super.x</code> (Dart 2.17+)</h2>
      <p>
        Ao herdar de outra classe, antigamente era preciso repetir parâmetros para a superclasse. Hoje há um atalho idêntico ao <code>this.x</code>:
      </p>
      <pre><code>{`class Animal {
  final String nome;
  Animal({required this.nome});
}

class Cao extends Animal {
  final String raca;
  // 'super.nome' encaminha direto para o construtor da superclasse.
  Cao({required super.nome, required this.raca});
}

void main() {
  final rex = Cao(nome: 'Rex', raca: 'Labrador');
}`}</code></pre>

      <AlertBox type="warning" title="Ordem importa">
        Initializing list roda <em>antes</em> do construtor da superclasse rodar; corpo do construtor roda <em>depois</em>. Não tente acessar <code>this</code> na lista de inicialização — o objeto ainda não está pronto.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>required</code></strong> em parâmetro nomeado não-nulo: erro de compilação.</li>
        <li><strong>Atribuir <code>final</code> no corpo</strong>: campos final só podem ser atribuídos no <code>this.x</code> ou na lista de inicialização.</li>
        <li><strong>Construtor com tipo de retorno</strong>: não escreva <code>void Pessoa(...)</code>. Construtores não têm tipo.</li>
        <li><strong>Confundir posicionais com nomeados</strong>: <code>Pessoa(nome, idade)</code> é diferente de <code>Pessoa(nome: x, idade: y)</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Construtor inicializa o objeto; tem o mesmo nome da classe e nenhum tipo de retorno.</li>
        <li>Atalho <code>this.x</code> elimina a repetição de atribuições.</li>
        <li>Parâmetros nomeados (<code>&#123;...&#125;</code>) deixam o código legível; combine com <code>required</code>.</li>
        <li>Initializing list (após <code>:</code>) inicializa <code>final</code> e roda asserções.</li>
        <li><code>super.x</code> repassa parâmetros à superclasse sem boilerplate.</li>
      </ul>
    </PageContainer>
  );
}
