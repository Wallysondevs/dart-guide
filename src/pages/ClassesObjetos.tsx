import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ClassesObjetos() {
  return (
    <PageContainer
      title="Classes e objetos: a base da POO em Dart"
      subtitle="Aprenda o que é uma classe, o que é um objeto e como instanciá-los — usando analogias do mundo real."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Pense em uma <strong>planta de casa</strong> desenhada por um arquiteto. A planta não é a casa: é o <em>molde</em> que descreve quantos quartos a casa terá, onde fica a porta, qual a cor da parede. Com <strong>uma única planta</strong> você pode construir várias casas iguais — cada uma com seu próprio endereço, seus próprios moradores. Em programação orientada a objetos (POO), a <strong>classe</strong> é a planta e cada <strong>objeto</strong> é uma casa construída a partir dela.
      </p>

      <h2>Definindo uma classe</h2>
      <p>
        Em Dart, uma classe é declarada com a palavra-chave <code>class</code>, seguida do nome (sempre em <em>PascalCase</em> — primeira letra maiúscula). Dentro das chaves <code>&#123; &#125;</code> ficam os <strong>campos</strong> (dados que cada objeto guarda) e os <strong>métodos</strong> (ações que o objeto sabe fazer).
      </p>
      <pre><code>{`class Pessoa {
  // Campos: cada objeto Pessoa terá os seus próprios.
  String nome = '';
  int idade = 0;

  // Método: ação que toda Pessoa sabe executar.
  void apresentar() {
    print('Oi, eu sou \$nome e tenho \$idade anos.');
  }
}`}</code></pre>
      <p>
        A <code>String</code> antes de <code>nome</code> diz: "este campo guarda texto". O <code>int</code> antes de <code>idade</code> diz: "este campo guarda número inteiro". Isso é o <strong>tipo estático</strong> — o compilador verifica antes de rodar e impede atribuir um número a um campo de texto.
      </p>

      <h2>Criando objetos (instanciando)</h2>
      <p>
        Para construir uma casa a partir da planta, chamamos a classe como se fosse uma função. Em Dart, <strong>não existe a palavra <code>new</code></strong> (existia até a versão 2 e foi removida porque era ruído visual).
      </p>
      <pre><code>{`void main() {
  // Cria dois objetos independentes da classe Pessoa.
  final ana = Pessoa();
  ana.nome = 'Ana';
  ana.idade = 30;

  final bruno = Pessoa();
  bruno.nome = 'Bruno';
  bruno.idade = 25;

  ana.apresentar();   // Oi, eu sou Ana e tenho 30 anos.
  bruno.apresentar(); // Oi, eu sou Bruno e tenho 25 anos.
}`}</code></pre>
      <p>
        Cada chamada <code>Pessoa()</code> aloca <strong>memória nova</strong> e devolve uma referência ao objeto. Mudar <code>ana.nome</code> não mexe em <code>bruno.nome</code> — são casas diferentes.
      </p>

      <AlertBox type="info" title="Por que sem new?">
        O time do Dart percebeu que <code>new</code> era opcional na prática e poluía o código. Hoje basta escrever <code>Pessoa()</code>. Você ainda pode escrever <code>new Pessoa()</code>, mas o linter pede para remover.
      </AlertBox>

      <h2>O <code>this</code>: o &quot;eu&quot; do objeto</h2>
      <p>
        Dentro de um método, <code>this</code> é uma referência ao próprio objeto que está rodando aquele método. É como uma pessoa dizendo &quot;eu&quot; — depende de quem está falando. Você usa <code>this</code> sobretudo para <strong>desambiguar</strong> quando o nome de um parâmetro coincide com o de um campo.
      </p>
      <pre><code>{`class Carro {
  String modelo = '';
  int velocidade = 0;

  void acelerar(int incremento) {
    // 'this.velocidade' é o campo; 'incremento' é o parâmetro.
    this.velocidade = this.velocidade + incremento;
    print('\${this.modelo} agora a \${this.velocidade} km/h');
  }
}`}</code></pre>
      <p>
        Na prática, quando não há ambiguidade, escrevemos só <code>velocidade</code> e <code>modelo</code> — Dart entende que se refere ao campo do objeto atual.
      </p>

      <h2>Objeto vs. classe: a diferença real</h2>
      <ul>
        <li><strong>Classe</strong>: o molde, escrito uma vez. Não consome memória de dados — só descreve.</li>
        <li><strong>Objeto (instância)</strong>: a casa construída. Cada um tem seus próprios valores nos campos.</li>
        <li><strong>Identidade</strong>: dois objetos podem ter os mesmos valores e ainda assim serem diferentes (como duas casas idênticas em endereços diferentes).</li>
      </ul>

      <h2>Exemplo completo: Carro</h2>
      <pre><code>{`class Carro {
  String marca;
  String modelo;
  int ano;
  int _quilometragem = 0; // O underscore indica campo privado (veremos depois).

  Carro(this.marca, this.modelo, this.ano);

  void rodar(int km) {
    _quilometragem += km;
    print('\$marca \$modelo rodou \$km km. Total: \$_quilometragem');
  }
}

void main() {
  final fusca = Carro('Volkswagen', 'Fusca', 1972);
  fusca.rodar(150);
  fusca.rodar(80);
}`}</code></pre>

      <AlertBox type="warning" title="Cuidado com referência">
        Variáveis de objeto guardam <strong>referências</strong>, não cópias. Se você fizer <code>final outro = fusca;</code> e mudar <code>outro.ano</code>, o <code>fusca.ano</code> também muda — é o mesmo objeto com dois apelidos.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer de inicializar campos</strong>: em sound null-safety, todo campo não-nulo precisa de valor inicial ou ser definido no construtor.</li>
        <li><strong>Usar <code>new</code></strong>: não dá erro, mas o linter avisa. Apague.</li>
        <li><strong>Confundir classe com objeto</strong>: <code>Pessoa.nome</code> não existe; <code>ana.nome</code> sim.</li>
        <li><strong>Esquecer parênteses</strong> ao instanciar: <code>final p = Pessoa;</code> guarda a <em>classe</em>, não cria objeto.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Classe é a planta; objeto é a casa construída.</li>
        <li>Defina com <code>class Nome &#123; ... &#125;</code> e instancie com <code>Nome()</code> — sem <code>new</code>.</li>
        <li>Campos guardam dados; métodos definem comportamento.</li>
        <li><code>this</code> é o &quot;eu&quot; do objeto, usado para desambiguar nomes.</li>
        <li>Variáveis de objeto guardam referências — cuidado ao copiar.</li>
      </ul>
    </PageContainer>
  );
}
