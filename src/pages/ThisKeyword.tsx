import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ThisKeyword() {
  return (
    <PageContainer
      title="this: a referência ao objeto atual"
      subtitle="O que é, quando usar e quando omitir o this em Dart."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Quando uma pessoa diz &quot;eu&quot;, o significado depende de quem está falando. Em programação orientada a objetos, <strong><code>this</code></strong> é o equivalente: dentro de um método, ele aponta para <em>o objeto que está executando aquele método naquele instante</em>. Se três objetos chamarem o mesmo método, em cada chamada <code>this</code> aponta para um objeto diferente.
      </p>

      <h2>Para que serve?</h2>
      <p>
        Três usos principais: (1) desambiguar nomes quando parâmetro e campo se chamam igual; (2) atalho elegante no construtor (<code>this.x</code>); (3) encadear chamadas (<em>fluent API</em>) retornando o próprio objeto.
      </p>

      <h2>1. Desambiguar campo e parâmetro</h2>
      <pre><code>{`class Pessoa {
  String nome;
  Pessoa(this.nome);

  void renomear(String nome) {
    // Sem 'this', os dois 'nome' seriam o parâmetro.
    this.nome = nome;
  }
}`}</code></pre>
      <p>
        Sem o <code>this</code>, ambos os <code>nome</code> dentro do método se referem ao parâmetro local — o campo da classe é ofuscado. <code>this.nome</code> torna explícito: &quot;o nome <em>do meu objeto</em>&quot;.
      </p>

      <h2>2. Atalho <code>this.x</code> no construtor</h2>
      <p>
        O Dart tem um atalho que evita a atribuição manual:
      </p>
      <pre><code>{`class Carro {
  String marca;
  String modelo;
  int ano;

  // Equivalente a: Carro(String m, String mo, int a) { marca = m; ... }
  Carro(this.marca, this.modelo, this.ano);
}`}</code></pre>
      <p>
        Vale também para parâmetros nomeados: <code>Carro(&#123;required this.marca&#125;)</code>. Esse açúcar elimina muito boilerplate.
      </p>

      <h2>3. Encadeamento (fluent interface)</h2>
      <p>
        Quando um método modifica o objeto e devolve <code>this</code>, você pode encadear várias chamadas em sequência. Pense em uma <strong>linha de montagem</strong>: cada estação devolve o produto para a próxima.
      </p>
      <pre><code>{`class Construtor {
  String _texto = '';

  Construtor add(String s) {
    _texto += s;
    return this; // devolve o próprio objeto
  }

  Construtor maiusculo() {
    _texto = _texto.toUpperCase();
    return this;
  }

  String build() => _texto;
}

void main() {
  final r = Construtor()
      .add('olá ')
      .add('mundo')
      .maiusculo()
      .build();
  print(r); // OLÁ MUNDO
}`}</code></pre>

      <AlertBox type="info" title="Cascade ..">
        Dart tem o operador <code>..</code> (cascade) que dispensa devolver <code>this</code>: <code>obj..a()..b()..c()</code> chama três métodos no mesmo objeto. Útil quando você não quer modificar a API só para encadear.
      </AlertBox>

      <h2>4. <code>this</code> como argumento</h2>
      <p>
        Você pode passar o próprio objeto para outra função. Útil em padrões como <em>observer</em> ou para registrar a si mesmo em algum gerenciador.
      </p>
      <pre><code>{`class Botao {
  void registrarEm(GerenciadorBotoes g) {
    g.adicionar(this);
  }
}

class GerenciadorBotoes {
  final List<Botao> botoes = [];
  void adicionar(Botao b) => botoes.add(b);
}`}</code></pre>

      <h2>Override de métodos</h2>
      <p>
        Quando uma subclasse <em>sobrescreve</em> um método, <code>this</code> dentro do novo método aponta para a subclasse. Para chamar a versão da superclasse, use <code>super</code>.
      </p>
      <pre><code>{`class Animal {
  void apresentar() => print('Sou um animal');
}

class Cao extends Animal {
  @override
  void apresentar() {
    super.apresentar();      // chama o do pai
    print('e sou um cão');   // adiciona comportamento
  }
}

void main() {
  Cao().apresentar();
  // Sou um animal
  // e sou um cão
}`}</code></pre>

      <AlertBox type="warning" title="Não use this em initializing list">
        A lista de inicialização (<code>: x = ...</code>) roda <em>antes</em> do objeto estar pronto. Acessar <code>this.algumMetodo()</code> ali é proibido — o compilador reclama.
      </AlertBox>

      <h2>Quando omitir <code>this</code>?</h2>
      <p>
        Sempre que não houver ambiguidade, omita. <code>print(nome)</code> dentro de um método é mais limpo que <code>print(this.nome)</code>. O linter padrão do Dart (<em>effective_dart</em>) inclusive avisa sobre <code>this</code> redundante.
      </p>
      <pre><code>{`class Pessoa {
  String nome;
  Pessoa(this.nome);

  void cumprimentar() {
    // Limpo: 'nome' aqui só pode ser o campo.
    print('Olá, \$nome');
  }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar <code>this</code> em método estático</strong>: <code>static</code> não pertence ao objeto, e sim à classe — não há &quot;eu&quot;. Erro de compilação.</li>
        <li><strong>Esquecer <code>return this;</code></strong> em fluent API — encadeamento quebra.</li>
        <li><strong>Sombrear campo sem perceber</strong>: parâmetro com mesmo nome do campo. Sem <code>this</code>, você só altera o parâmetro local.</li>
        <li><strong>Usar <code>this.</code> sempre</strong>: além de poluir, o linter reclama. Use só quando necessário.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>this</code> é o &quot;eu&quot; do objeto, válido apenas em métodos de instância.</li>
        <li>Use para desambiguar parâmetros e como atalho <code>this.x</code> no construtor.</li>
        <li>Devolver <code>this</code> permite fluent APIs; <code>..</code> (cascade) é alternativa idiomática.</li>
        <li><code>super</code> chama a versão da superclasse de um método sobrescrito.</li>
        <li>Em métodos estáticos, <code>this</code> não existe.</li>
      </ul>
    </PageContainer>
  );
}
