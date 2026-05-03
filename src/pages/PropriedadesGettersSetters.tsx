import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PropriedadesGettersSetters() {
  return (
    <PageContainer
      title="Propriedades, getters e setters"
      subtitle="Como controlar o acesso aos dados de um objeto e criar propriedades calculadas."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine uma <strong>recepcionista</strong> de uma empresa: ela recebe pedidos de fora, valida e só então deixa entrar. Em programação, <strong>getters</strong> e <strong>setters</strong> são essa recepcionista — código que roda toda vez que alguém tenta <em>ler</em> ou <em>escrever</em> em uma propriedade de um objeto. Em Dart, eles parecem campos comuns para quem usa, mas escondem lógica por baixo.
      </p>

      <h2>Campos públicos e privados</h2>
      <p>
        Por padrão, <strong>tudo em Dart é público</strong>. Para marcar algo como privado, você prefixa o nome com <code>_</code> (underscore). A regra é: identificadores que começam com <code>_</code> só são visíveis dentro da <strong>mesma biblioteca</strong> (cada arquivo <code>.dart</code> é uma biblioteca, salvo se usar <code>part</code>).
      </p>
      <pre><code>{`// arquivo: pessoa.dart
class Pessoa {
  String nome = '';      // público
  int _idade = 0;        // privado a este arquivo
}`}</code></pre>
      <p>
        Não há as palavras <code>private</code> ou <code>public</code> como em Java. O underscore basta. É uma convenção <em>imposta pelo compilador</em>, não apenas estilo.
      </p>

      <h2>Getter: ler como se fosse campo</h2>
      <p>
        Um <strong>getter</strong> é uma função sem parênteses que devolve um valor. Você usa quando o valor é <em>calculado</em> a partir de outros campos — uma propriedade <em>derivada</em>.
      </p>
      <pre><code>{`class Pessoa {
  String primeiroNome;
  String sobrenome;

  Pessoa(this.primeiroNome, this.sobrenome);

  // Getter: aparenta ser um campo, mas é calculado.
  String get nomeCompleto => '\$primeiroNome \$sobrenome';

  // Getter para validar se é maior de idade.
  bool get adulto => _idade >= 18;
  int _idade = 0;
}

void main() {
  final p = Pessoa('Ana', 'Silva');
  print(p.nomeCompleto); // Ana Silva — sem ()
}`}</code></pre>
      <p>
        Note: para <strong>chamar</strong> o getter, você escreve <code>p.nomeCompleto</code> sem parênteses. Para o usuário do objeto é indistinguível de um campo.
      </p>

      <h2>Setter: escrever com validação</h2>
      <p>
        Um <strong>setter</strong> é o oposto: roda quando alguém atribui um valor. Permite validar antes de aceitar.
      </p>
      <pre><code>{`class Pessoa {
  int _idade = 0;

  int get idade => _idade;

  set idade(int valor) {
    if (valor < 0) {
      throw ArgumentError('Idade não pode ser negativa');
    }
    _idade = valor;
  }
}

void main() {
  final p = Pessoa();
  p.idade = 30;        // chama o setter
  print(p.idade);      // chama o getter -> 30
  // p.idade = -1;     // lança ArgumentError
}`}</code></pre>

      <AlertBox type="info" title="Encapsulamento na prática">
        Começar com campo público é normal. Se depois você precisar adicionar validação, basta transformar o campo em par getter/setter — o <strong>código que usa não muda</strong>. Esse é o grande ganho.
      </AlertBox>

      <h2>Propriedades calculadas (computed)</h2>
      <p>
        Getters brilham para valores derivados que não devem virar campo (porque podem ficar desatualizados). Em vez de guardar &quot;total&quot;, recalcule sempre.
      </p>
      <pre><code>{`class Carrinho {
  final List<double> precos = [];

  // Calcula sempre que pedido. Nada de cache desatualizado.
  double get total => precos.fold(0, (s, p) => s + p);
  int get quantidade => precos.length;
  bool get vazio => precos.isEmpty;
}`}</code></pre>

      <h2>Interface implícita</h2>
      <p>
        Toda classe em Dart define automaticamente uma <strong>interface implícita</strong> com os mesmos getters, setters e métodos. Isso significa que outras classes podem <code>implements Pessoa</code> e serão obrigadas a fornecer <code>nomeCompleto</code>, <code>idade</code> etc. Veremos isso em detalhe na seção de interfaces.
      </p>

      <AlertBox type="warning" title="Não exagere">
        Não transforme <em>todo</em> campo em getter/setter por hábito. Se não há validação nem cálculo, um campo público simples já cumpre o papel — e é mais legível.
      </AlertBox>

      <h2>Exemplo completo: Temperatura</h2>
      <pre><code>{`class Temperatura {
  double _celsius;
  Temperatura(this._celsius);

  double get celsius => _celsius;
  set celsius(double v) => _celsius = v;

  // Propriedades calculadas em outra unidade.
  double get fahrenheit => _celsius * 9 / 5 + 32;
  set fahrenheit(double v) => _celsius = (v - 32) * 5 / 9;

  double get kelvin => _celsius + 273.15;
}

void main() {
  final t = Temperatura(25);
  print(t.fahrenheit); // 77
  t.fahrenheit = 100;  // setter converte para Celsius
  print(t.celsius);    // ~37.78
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>get</code></strong>: sem ele, vira método e exige <code>()</code> ao chamar.</li>
        <li><strong>Loop infinito no setter</strong>: <code>set idade(int v) =&gt; idade = v;</code> chama a si mesmo. Use o campo privado: <code>_idade = v</code>.</li>
        <li><strong>Underscore só funciona entre arquivos</strong>: dentro do mesmo arquivo, <code>_idade</code> é acessível em qualquer classe.</li>
        <li><strong>Getter pesado</strong>: como parece campo, o usuário pode chamar muitas vezes. Se o cálculo for caro, considere cache.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Privacidade em Dart é por <code>_</code> e por arquivo (biblioteca).</li>
        <li><code>get</code> cria leitura calculada; <code>set</code> cria escrita validada.</li>
        <li>Para o usuário, parecem campos comuns — sem parênteses.</li>
        <li>Toda classe expõe interface implícita formada por seus getters/setters/métodos.</li>
        <li>Use propriedades calculadas para evitar dados duplicados.</li>
      </ul>
    </PageContainer>
  );
}
