import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NamedConstructors() {
  return (
    <PageContainer
      title="Construtores nomeados: múltiplas formas de criar"
      subtitle="Como oferecer várias maneiras de instanciar uma mesma classe — sem ambiguidade."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine uma <strong>cafeteria</strong> com vários métodos de pedido: você pode pedir &quot;um café simples&quot;, &quot;um café com leite&quot;, ou &quot;um café com base no cartão fidelidade&quot;. O resultado é sempre uma xícara, mas o <em>caminho</em> é diferente. Em Dart, <strong>construtores nomeados</strong> dão à mesma classe vários jeitos de nascer, cada um com nome explicativo.
      </p>

      <h2>Sintaxe básica</h2>
      <p>
        Um construtor nomeado segue o formato <code>NomeDaClasse.identificador(...)</code>. O identificador depois do ponto é o &quot;rótulo&quot; do construtor.
      </p>
      <pre><code>{`class Pessoa {
  final String nome;
  final int idade;

  // Construtor padrão (sem nome).
  Pessoa(this.nome, this.idade);

  // Construtor nomeado para bebês.
  Pessoa.bebe(this.nome) : idade = 0;

  // Construtor nomeado para idosos.
  Pessoa.idoso(this.nome) : idade = 70;
}

void main() {
  final ana = Pessoa('Ana', 30);
  final ze  = Pessoa.bebe('Zé');
  final dona = Pessoa.idoso('Dona Maria');
}`}</code></pre>
      <p>
        A lista de inicialização (depois de <code>:</code>) é onde você define os campos que não vêm como parâmetro. Sem isso, o compilador reclama porque <code>idade</code> é <code>final</code> e precisa de valor.
      </p>

      <h2>Caso real: <code>Color.fromRGBO</code> e <code>fromHex</code></h2>
      <p>
        Em Flutter, a classe <code>Color</code> tem vários construtores nomeados — <code>Color.fromARGB</code>, <code>Color.fromRGBO</code>. Cada um aceita uma representação diferente do mesmo conceito (uma cor).
      </p>
      <pre><code>{`class Cor {
  final int r, g, b;

  Cor(this.r, this.g, this.b);

  // Construtor nomeado a partir de hex (#RRGGBB).
  Cor.fromHex(String hex)
      : r = int.parse(hex.substring(1, 3), radix: 16),
        g = int.parse(hex.substring(3, 5), radix: 16),
        b = int.parse(hex.substring(5, 7), radix: 16);
}

void main() {
  final azul = Cor.fromHex('#3366FF');
  print('\${azul.r}, \${azul.g}, \${azul.b}');
}`}</code></pre>

      <h2><code>fromMap</code> / <code>fromJson</code></h2>
      <p>
        Padrão pop em apps reais: receber dados de uma API (JSON) e transformar em objeto. Construtores nomeados como <code>fromJson</code> centralizam essa lógica.
      </p>
      <pre><code>{`class Usuario {
  final int id;
  final String nome;
  final String email;

  Usuario({required this.id, required this.nome, required this.email});

  // Constrói a partir de um Map (formato típico de JSON).
  Usuario.fromMap(Map<String, dynamic> mapa)
      : id = mapa['id'] as int,
        nome = mapa['nome'] as String,
        email = mapa['email'] as String;
}

void main() {
  final dados = {'id': 1, 'nome': 'Ana', 'email': 'a@x.com'};
  final u = Usuario.fromMap(dados);
  print(u.nome);
}`}</code></pre>

      <AlertBox type="info" title="Por que não usar funções estáticas?">
        Você poderia escrever <code>static Usuario fromMap(...)</code>. Funciona, mas perder o status de construtor faz você não conseguir usar <code>const</code>, nem aproveitar <code>this.x</code>. Construtor nomeado é o jeito idiomático.
      </AlertBox>

      <h2>Factory constructors</h2>
      <p>
        Há um caso em que o construtor não <em>cria</em> um objeto novo — ele decide qual instância devolver. Para isso existe o <code>factory</code>. Veremos em detalhe no próximo capítulo, mas é importante saber que ele pode ter nome também.
      </p>
      <pre><code>{`class Logger {
  static final Map<String, Logger> _cache = {};
  final String nome;

  Logger._interno(this.nome); // construtor privado

  // Factory: devolve do cache se já existir, senão cria.
  factory Logger(String nome) {
    return _cache.putIfAbsent(nome, () => Logger._interno(nome));
  }

  void log(String msg) => print('[\$nome] \$msg');
}`}</code></pre>

      <h2>Outros exemplos da biblioteca padrão</h2>
      <ul>
        <li><code>Stream.fromIterable([1,2,3])</code>: cria stream a partir de uma lista.</li>
        <li><code>List.filled(5, 0)</code>: lista de 5 zeros.</li>
        <li><code>DateTime.now()</code> e <code>DateTime.utc(2024, 1, 1)</code>.</li>
        <li><code>Uri.parse('https://...')</code> e <code>Uri.https(...)</code>.</li>
      </ul>

      <h2>Combinando com <code>const</code></h2>
      <p>
        Se todos os campos são <code>final</code> e os valores são conhecidos em tempo de compilação, marque o construtor como <code>const</code>. O Dart cria a instância <em>uma única vez</em> e reutiliza.
      </p>
      <pre><code>{`class Ponto {
  final double x;
  final double y;
  const Ponto(this.x, this.y);
  const Ponto.origem() : this(0, 0);
}

void main() {
  const a = Ponto.origem();
  const b = Ponto.origem();
  print(identical(a, b)); // true — mesma instância em memória
}`}</code></pre>

      <AlertBox type="warning" title="Pattern API (Dart 3)">
        Em Dart 3, podemos usar <em>patterns</em> para destruturar construções: <code>final Ponto(:x, :y) = p;</code> extrai os campos. Combine com construtores nomeados para APIs muito expressivas.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer a lista de inicialização</strong>: campos <code>final</code> que não vêm como parâmetro precisam ser inicializados após o <code>:</code>.</li>
        <li><strong>Conflito de nomes</strong>: construtor nomeado e método estático com mesmo identificador não convivem.</li>
        <li><strong>Querer retornar tipo diferente</strong>: construtor comum sempre retorna a própria classe — para retornar outro tipo (subclasse), use <code>factory</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Construtor nomeado: <code>Classe.nome(...)</code> — apenas um identificador depois do ponto.</li>
        <li>Útil para criar objetos a partir de fontes diferentes (hex, JSON, valores padrão).</li>
        <li>Combine com <code>const</code> quando os valores forem imutáveis.</li>
        <li>Para lógica de criação mais avançada (cache, subclasse), use <code>factory</code>.</li>
      </ul>
    </PageContainer>
  );
}
