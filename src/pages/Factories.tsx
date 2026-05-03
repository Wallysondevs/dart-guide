import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Factories() {
  return (
    <PageContainer
      title="Factory constructors: controle total na criação"
      subtitle="Quando o construtor não cria, mas decide qual instância devolver."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Pense em uma <strong>fábrica de carros</strong>: você liga e diz &quot;quero um sedan azul&quot;. A fábrica pode <em>montar um novo</em>, ou olhar no estoque e <em>entregar um já pronto</em> — você nem sabe a diferença. Em Dart, um <code>factory</code> constructor é exatamente isso: parece um construtor normal, mas <strong>controla</strong> qual instância retornar.
      </p>

      <h2>Construtor generativo vs. factory</h2>
      <p>
        Os construtores que vimos até agora são <strong>generativos</strong>: sempre criam um novo objeto. Um <code>factory</code> é diferente — ele <em>retorna</em> uma instância (que pode já existir) e por isso precisa de um <code>return</code> explícito.
      </p>
      <pre><code>{`class Pessoa {
  final String nome;

  // Generativo: sempre cria um objeto novo.
  Pessoa(this.nome);

  // Factory: pode devolver instância existente, subclasse, etc.
  factory Pessoa.anonima() {
    return Pessoa('Sem nome');
  }
}`}</code></pre>

      <h2>Por que existir?</h2>
      <p>
        Três motivos principais:
      </p>
      <ul>
        <li><strong>Cache</strong>: reaproveitar objetos já criados (singleton, pool).</li>
        <li><strong>Devolver subclasse</strong>: dependendo do parâmetro, instanciar um tipo diferente.</li>
        <li><strong>Validação complexa</strong>: tomar decisão antes de criar.</li>
      </ul>

      <h2>Singleton com factory</h2>
      <p>
        Singleton é o padrão em que <strong>existe uma única instância</strong> da classe na aplicação inteira. Em Dart, um <code>factory</code> faz isso de modo elegante.
      </p>
      <pre><code>{`class Configuracao {
  // A única instância (estática, vive enquanto o app rodar).
  static final Configuracao _instancia = Configuracao._interno();

  String tema = 'claro';
  String idioma = 'pt-BR';

  // Construtor privado: ninguém de fora pode chamá-lo.
  Configuracao._interno();

  // Toda chamada Configuracao() devolve a mesma instância.
  factory Configuracao() => _instancia;
}

void main() {
  final a = Configuracao();
  final b = Configuracao();
  print(identical(a, b)); // true — mesmo objeto
}`}</code></pre>

      <h2>Logger com cache por nome</h2>
      <p>
        Variação útil: uma instância <em>por chave</em>. Útil para loggers, conexões, recursos compartilhados.
      </p>
      <pre><code>{`class Logger {
  static final Map<String, Logger> _cache = {};
  final String nome;

  Logger._interno(this.nome);

  factory Logger(String nome) {
    return _cache.putIfAbsent(nome, () => Logger._interno(nome));
  }

  void info(String msg) => print('[\$nome] \$msg');
}

void main() {
  final a = Logger('rede');
  final b = Logger('rede');
  final c = Logger('disco');
  print(identical(a, b)); // true
  print(identical(a, c)); // false
}`}</code></pre>

      <AlertBox type="info" title="putIfAbsent">
        <code>Map.putIfAbsent(chave, () =&gt; valor)</code> só cria o valor se a chave ainda não existir. É um padrão clássico para cache lazy.
      </AlertBox>

      <h2>Devolver subclasse</h2>
      <p>
        Outro uso forte: o factory decide qual subclasse instanciar com base no parâmetro. O chamador nem precisa saber dos tipos concretos.
      </p>
      <pre><code>{`abstract class Forma {
  double get area;

  factory Forma.criar(String tipo, double medida) {
    return switch (tipo) {
      'quadrado' => Quadrado(medida),
      'circulo' => Circulo(medida),
      _ => throw ArgumentError('Tipo desconhecido: \$tipo'),
    };
  }
}

class Quadrado implements Forma {
  final double lado;
  Quadrado(this.lado);
  @override
  double get area => lado * lado;
}

class Circulo implements Forma {
  final double raio;
  Circulo(this.raio);
  @override
  double get area => 3.14159 * raio * raio;
}

void main() {
  final f = Forma.criar('circulo', 2);
  print(f.area); // ~12.56
}`}</code></pre>

      <h2>O factory pode ter <code>this.x</code>?</h2>
      <p>
        <strong>Não.</strong> O atalho <code>this.x</code> só vale para construtores generativos — afinal, no factory o objeto ainda não existe (você é que vai escolher qual devolver). Você precisa criar manualmente.
      </p>

      <AlertBox type="warning" title="Não pode retornar null">
        Em sound null safety (Dart 2.12+), um <code>factory</code> declarado <code>Pessoa</code> precisa retornar uma <code>Pessoa</code> não-nula. Para indicar &quot;sem instância&quot;, declare o retorno como <code>Pessoa?</code> (em métodos estáticos) ou lance uma exceção.
      </AlertBox>

      <h2>Quando usar (e quando não)</h2>
      <p>
        Use factory quando você precisa de <em>controle</em> sobre a criação. Para inicialização simples, prefira o construtor generativo — ele é mais barato e permite <code>const</code>. Factory <strong>nunca</strong> pode ser <code>const</code>, justamente porque executa lógica em tempo de execução.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>return</code></strong>: o corpo do factory <em>precisa</em> retornar uma instância.</li>
        <li><strong>Usar <code>this.x</code></strong>: erro de compilação. Construa manualmente e devolva.</li>
        <li><strong>Tentar marcar como <code>const</code></strong>: factory e const não combinam.</li>
        <li><strong>Esquecer construtor privado</strong> no singleton: sem ele, alguém pode burlar e criar várias instâncias.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>factory</code> permite escolher qual instância retornar — nova, em cache, ou de outro tipo.</li>
        <li>Útil para singletons, pools, fábricas com seleção de subclasse.</li>
        <li>Não suporta <code>this.x</code> nem <code>const</code>; precisa de <code>return</code> explícito.</li>
        <li>Combine com construtor privado (<code>_interno</code>) para impedir criação por fora.</li>
      </ul>
    </PageContainer>
  );
}
