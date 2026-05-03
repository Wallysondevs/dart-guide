import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function JsonEncodeDecode() {
  return (
    <PageContainer
      title="JSON em Dart: encode, decode e tipagem segura"
      subtitle="Como transformar objetos Dart em JSON e vice-versa — e como sair do território perigoso de <code>dynamic</code> com classes tipadas."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        JSON (<em>JavaScript Object Notation</em>) é o formato &quot;universal&quot; para trocar dados estruturados pela rede. Quando seu app conversa com uma API REST, é JSON indo e vindo. Pense nele como a língua franca do mundo dos servidores: meio chato, mas todos falam. Em Dart, a biblioteca <code>dart:convert</code> traz duas funções centrais para essa tradução: <code>jsonEncode</code> (Dart → JSON) e <code>jsonDecode</code> (JSON → Dart). Saber usar bem — sem cair no inferno do <code>dynamic</code> — é um divisor de águas.
      </p>

      <h2>Encode: do objeto Dart para texto JSON</h2>
      <p>
        <code>jsonEncode</code> recebe um valor Dart (Map, List, String, num, bool ou null) e devolve uma <code>String</code> com a representação JSON. Ele <em>não</em> serializa classes customizadas automaticamente — você precisa transformá-las em Map antes (ou implementar <code>toJson</code>).
      </p>
      <pre><code>{`import 'dart:convert';

void main() {
  final dados = {
    'nome': 'Ana',
    'idade': 30,
    'ativo': true,
    'tags': ['admin', 'beta'],
    'endereco': {'cidade': 'Recife', 'uf': 'PE'},
  };

  final texto = jsonEncode(dados);
  print(texto);
  // {"nome":"Ana","idade":30,"ativo":true,"tags":["admin","beta"],...}
}`}</code></pre>
      <p>
        Para uma saída legível (com indentação), use o codificador explicitamente:
      </p>
      <pre><code>{`final encoder = JsonEncoder.withIndent('  ');
print(encoder.convert(dados));`}</code></pre>

      <h2>Decode: do texto JSON de volta para Dart</h2>
      <p>
        <code>jsonDecode</code> faz o caminho inverso. O retorno é declarado como <code>dynamic</code> — porque o parser não tem como saber, em tempo de compilação, qual o &quot;formato&quot; do JSON. Na prática, vai ser um <code>Map&lt;String, dynamic&gt;</code> ou um <code>List&lt;dynamic&gt;</code>.
      </p>
      <pre><code>{`import 'dart:convert';

void main() {
  const texto = '{"nome":"Ana","idade":30,"tags":["admin","beta"]}';
  final decoded = jsonDecode(texto); // dynamic

  // Cast explicito eh quase sempre necessario:
  final mapa = decoded as Map<String, dynamic>;
  print(mapa['nome']);          // Ana
  print(mapa['idade']);         // 30
  print(mapa['tags'] is List);  // true
}`}</code></pre>

      <AlertBox type="warning" title="O perigo de <code>dynamic</code>">
        <code>dynamic</code> desliga toda a checagem de tipos do compilador. Você pode escrever <code>mapa[&apos;naoExiste&apos;].length</code> e o erro só aparece em runtime, com o cliente em produção. Sempre encapsule a leitura de JSON em classes tipadas.
      </AlertBox>

      <h2>Casts cuidadosos</h2>
      <p>
        Listas e maps aninhados precisam de cuidado especial. <code>jsonDecode</code> devolve <code>List&lt;dynamic&gt;</code>, não <code>List&lt;Map&gt;</code>. Cada elemento ainda precisa ser convertido individualmente.
      </p>
      <pre><code>{`const json = '[{"id":1,"nome":"a"},{"id":2,"nome":"b"}]';
final raw = jsonDecode(json) as List<dynamic>;

// Forma idiomatica de tipar uma lista de objetos:
final itens = raw.cast<Map<String, dynamic>>();
for (final item in itens) {
  print('\${item["id"]}: \${item["nome"]}');
}

// Ou, melhor, mapeando para uma classe:
final usuarios = raw.map((j) => Usuario.fromJson(j as Map<String, dynamic>)).toList();`}</code></pre>

      <h2>Padrão <code>fromJson</code> / <code>toJson</code> manual</h2>
      <p>
        A forma idiomática (e recomendada para projetos pequenos/médios) é cada classe ter um construtor <code>fromJson</code> e um método <code>toJson</code>. Isso isola toda a desserialização em <em>um lugar</em>, e o resto do app trabalha com tipos seguros.
      </p>
      <pre><code>{`class Usuario {
  final int id;
  final String nome;
  final String email;
  final DateTime criadoEm;
  final List<String> papeis;

  const Usuario({
    required this.id,
    required this.nome,
    required this.email,
    required this.criadoEm,
    required this.papeis,
  });

  factory Usuario.fromJson(Map<String, dynamic> j) => Usuario(
        id: j['id'] as int,
        nome: j['nome'] as String,
        email: j['email'] as String,
        criadoEm: DateTime.parse(j['criadoEm'] as String),
        papeis: (j['papeis'] as List<dynamic>).cast<String>(),
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'nome': nome,
        'email': email,
        'criadoEm': criadoEm.toIso8601String(),
        'papeis': papeis,
      };
}

void exemplo() {
  final u = Usuario.fromJson(
    jsonDecode('{"id":1,"nome":"Ana","email":"a@x","criadoEm":"2025-01-01T10:00:00Z","papeis":["admin"]}')
        as Map<String, dynamic>,
  );
  print(u.email); // a@x
  print(jsonEncode(u)); // jsonEncode chama u.toJson() automaticamente!
}`}</code></pre>

      <AlertBox type="info" title="Truque: <code>jsonEncode</code> chama <code>toJson()</code>">
        Se o objeto tiver um método <code>toJson()</code>, <code>jsonEncode</code> o invoca automaticamente. Por isso você passa o objeto direto, sem precisar fazer <code>jsonEncode(u.toJson())</code>.
      </AlertBox>

      <h2>Lidando com null e campos opcionais</h2>
      <p>
        APIs reais frequentemente omitem campos. Use null-safety a seu favor:
      </p>
      <pre><code>{`class Produto {
  final int id;
  final String nome;
  final double? desconto; // pode nao vir
  final List<String> imagens;

  Produto({
    required this.id,
    required this.nome,
    this.desconto,
    this.imagens = const [],
  });

  factory Produto.fromJson(Map<String, dynamic> j) => Produto(
        id: j['id'] as int,
        nome: j['nome'] as String? ?? 'sem nome',     // default seguro
        desconto: (j['desconto'] as num?)?.toDouble(),  // null se ausente
        imagens: (j['imagens'] as List<dynamic>? ?? const [])
            .cast<String>(),
      );
}`}</code></pre>

      <h2>Tratando JSON inválido</h2>
      <p>
        Se a string não for JSON válido, <code>jsonDecode</code> lança <code>FormatException</code>. Sempre embrulhe em <code>try/catch</code> quando o JSON vem de fonte externa:
      </p>
      <pre><code>{`Map<String, dynamic>? parseSeguro(String texto) {
  try {
    return jsonDecode(texto) as Map<String, dynamic>;
  } on FormatException catch (e) {
    print('JSON invalido: \${e.message}');
    return null;
  } on TypeError {
    print('JSON valido, mas nao eh um objeto.');
    return null;
  }
}`}</code></pre>

      <h2>Automatizando: <code>json_serializable</code> + <code>build_runner</code></h2>
      <p>
        Escrever <code>fromJson</code>/<code>toJson</code> à mão para 50 classes é tedioso e propenso a erro. Para projetos maiores, use o pacote oficial <code>json_serializable</code>: você anota a classe, roda um gerador de código e ele cria os métodos por você.
      </p>
      <pre><code>{`// pubspec.yaml
// dependencies:
//   json_annotation: ^4.9.0
// dev_dependencies:
//   build_runner: ^2.4.0
//   json_serializable: ^6.8.0

import 'package:json_annotation/json_annotation.dart';

part 'usuario.g.dart'; // arquivo gerado automaticamente

@JsonSerializable()
class Usuario {
  final int id;
  final String nome;
  @JsonKey(name: 'created_at')
  final DateTime criadoEm;

  Usuario({required this.id, required this.nome, required this.criadoEm});

  factory Usuario.fromJson(Map<String, dynamic> json) =>
      _\$UsuarioFromJson(json);
  Map<String, dynamic> toJson() => _\$UsuarioToJson(this);
}

// Rode no terminal:
//   dart run build_runner build --delete-conflicting-outputs`}</code></pre>
      <p>
        O <code>build_runner</code> é uma ferramenta que executa &quot;geradores&quot;: ele lê suas anotações e cria o arquivo <code>.g.dart</code> com todo o boilerplate. Você ganha tipagem total <em>e</em> evita escrever centenas de linhas manuais.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Trabalhar direto com o <code>Map</code> dinâmico</strong> pelo app inteiro — typos em chaves só aparecem em produção.</li>
        <li><strong>Esquecer o cast em <code>List</code></strong> e tomar <code>type 'List&lt;dynamic&gt;' is not a subtype of...</code> em runtime.</li>
        <li><strong>Não tratar campos null</strong> e ver crash quando o servidor omite uma chave.</li>
        <li><strong>Confundir <code>num</code> com <code>int</code>/<code>double</code></strong>: <code>1</code> em JSON pode vir como <code>int</code>; <code>1.0</code> como <code>double</code>. Use <code>(j['x'] as num).toDouble()</code> para normalizar.</li>
        <li><strong>Esquecer de rodar <code>build_runner</code></strong> após alterar classe anotada — código gerado fica desatualizado.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>jsonEncode</code>: Dart (Map/List/primitivos) → String JSON.</li>
        <li><code>jsonDecode</code>: String JSON → <code>dynamic</code> (cast para <code>Map&lt;String, dynamic&gt;</code> ou <code>List&lt;dynamic&gt;</code>).</li>
        <li>Sempre encapsule a leitura em classes com <code>fromJson</code>/<code>toJson</code>; <code>dynamic</code> espalhado é veneno.</li>
        <li><code>jsonEncode(obj)</code> chama <code>obj.toJson()</code> automaticamente.</li>
        <li>Trate <code>FormatException</code> ao decodificar dados externos.</li>
        <li>Para projetos grandes, use <code>json_serializable</code> + <code>build_runner</code>.</li>
      </ul>
    </PageContainer>
  );
}
