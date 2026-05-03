import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SharedPrefs() {
  return (
    <PageContainer
      title="shared_preferences: armazenando configs simples"
      subtitle="A gaveta do seu app: lugar perfeito para tokens, flags e preferências de tema."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Imagine que seu app é uma casa nova. Para móveis grandes (banco de dados de usuários, fotos), você usa um armário inteiro (sqflite, Hive). Mas para coisinhas — chaves do carro, recibos, lista de compras — você quer uma <strong>gaveta perto da porta</strong>: pequena, rápida, sem cerimônia. Essa gaveta no Flutter chama-se <code>shared_preferences</code>. Ela é um mapa chave-valor persistente, internamente apoiado em <em>SharedPreferences</em> no Android e <em>NSUserDefaults</em> no iOS.
      </p>

      <h2>Instalação</h2>
      <pre><code>{`# pubspec.yaml
dependencies:
  shared_preferences: ^2.3.2`}</code></pre>
      <p>Depois rode <code>flutter pub get</code>. Não precisa configuração nativa.</p>

      <h2>Conceitos básicos</h2>
      <p>
        Você obtém uma instância via <code>SharedPreferences.getInstance()</code> (assíncrono, retorna um <strong>Future</strong> — uma promessa de valor). A partir dela, lê e escreve com métodos <code>getString</code>, <code>setString</code>, <code>getBool</code>, etc. Tudo é persistido automaticamente no disco.
      </p>
      <pre><code>{`import 'package:shared_preferences/shared_preferences.dart';

Future<void> exemplo() async {
  final prefs = await SharedPreferences.getInstance();

  // ESCREVER
  await prefs.setString('token', 'abc123');
  await prefs.setBool('temaEscuro', true);
  await prefs.setInt('contadorAberturas', 5);
  await prefs.setDouble('volume', 0.7);
  await prefs.setStringList('favoritos', ['flutter', 'dart']);

  // LER (retorna null se não existir)
  final token = prefs.getString('token');
  final escuro = prefs.getBool('temaEscuro') ?? false;
  final n = prefs.getInt('contadorAberturas') ?? 0;

  // REMOVER
  await prefs.remove('token');

  // LIMPAR TUDO (cuidado!)
  // await prefs.clear();
}`}</code></pre>

      <AlertBox type="info" title="Tipos suportados">
        Apenas <code>String</code>, <code>bool</code>, <code>int</code>, <code>double</code> e <code>List&lt;String&gt;</code>. Para qualquer coisa mais complexa (objeto, lista de objetos), serialize para JSON e salve como <code>String</code>.
      </AlertBox>

      <h2>Salvando objetos via JSON</h2>
      <p>
        Para guardar um objeto, transforme-o em texto JSON antes:
      </p>
      <pre><code>{`import 'dart:convert';

class Configuracoes {
  final String idioma;
  final bool notificacoes;
  Configuracoes({required this.idioma, required this.notificacoes});

  Map<String, dynamic> toJson() => {
        'idioma': idioma,
        'notificacoes': notificacoes,
      };
  factory Configuracoes.fromJson(Map<String, dynamic> j) =>
      Configuracoes(
        idioma: j['idioma'] as String,
        notificacoes: j['notificacoes'] as bool,
      );
}

Future<void> salvar(Configuracoes c) async {
  final prefs = await SharedPreferences.getInstance();
  await prefs.setString('config', jsonEncode(c.toJson()));
}

Future<Configuracoes?> carregar() async {
  final prefs = await SharedPreferences.getInstance();
  final raw = prefs.getString('config');
  if (raw == null) return null;
  return Configuracoes.fromJson(
    jsonDecode(raw) as Map<String, dynamic>,
  );
}`}</code></pre>

      <h2>Caso de uso clássico: tema escuro/claro</h2>
      <pre><code>{`class TemaService {
  static const _chave = 'temaEscuro';

  Future<bool> estaEscuro() async {
    final p = await SharedPreferences.getInstance();
    return p.getBool(_chave) ?? false;
  }

  Future<void> alternar(bool valor) async {
    final p = await SharedPreferences.getInstance();
    await p.setBool(_chave, valor);
  }
}

// No main():
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final escuro = await TemaService().estaEscuro();
  runApp(MeuApp(temaEscuro: escuro));
}`}</code></pre>

      <AlertBox type="warning" title="Não é cofre">
        <code>shared_preferences</code> guarda em <strong>texto puro</strong>. Tokens de autenticação importantes devem ir para <code>flutter_secure_storage</code> (que usa Keychain no iOS e Keystore no Android, criptografados).
      </AlertBox>

      <h2>Pegadinhas com initState</h2>
      <p>
        <code>getInstance()</code> é assíncrono. Não dá para chamar direto no <code>build</code>. Use <code>FutureBuilder</code> ou carregue uma vez no <code>initState</code>:
      </p>
      <pre><code>{`class TelaConfig extends StatefulWidget {
  const TelaConfig({super.key});
  @override
  State<TelaConfig> createState() => _TelaConfigState();
}

class _TelaConfigState extends State<TelaConfig> {
  bool _escuro = false;

  @override
  void initState() {
    super.initState();
    _carregar();
  }

  Future<void> _carregar() async {
    final p = await SharedPreferences.getInstance();
    setState(() => _escuro = p.getBool('temaEscuro') ?? false);
  }

  Future<void> _alternar(bool v) async {
    final p = await SharedPreferences.getInstance();
    await p.setBool('temaEscuro', v);
    setState(() => _escuro = v);
  }

  @override
  Widget build(BuildContext context) {
    return SwitchListTile(
      title: const Text('Tema escuro'),
      value: _escuro,
      onChanged: _alternar,
    );
  }
}`}</code></pre>

      <h2>Limitações claras</h2>
      <ul>
        <li><strong>Não é banco de dados</strong>: nada de queries, joins, índices.</li>
        <li><strong>Não é seguro</strong>: tokens críticos vão para flutter_secure_storage.</li>
        <li><strong>Não é grande</strong>: para guardar listas com milhares de itens, use Hive/Isar.</li>
        <li><strong>Síncrono no leitura é mentira</strong>: a primeira <code>getInstance()</code> abre o arquivo; depois o cache em memória responde rápido.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Chamar <code>getInstance()</code> antes de <code>WidgetsFlutterBinding.ensureInitialized()</code></strong> no main.</li>
        <li><strong>Esperar tipo errado</strong>: <code>getString</code> em chave que era <code>int</code> retorna <code>null</code>.</li>
        <li><strong>Salvar objetos sem serializar</strong>: <code>setString</code> com toString() vira lixo.</li>
        <li><strong>Esquecer <code>await</code></strong>: a operação dispara, mas você lê valor antigo.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>shared_preferences é a &quot;gaveta&quot; do app: chave-valor persistente.</li>
        <li>Suporta tipos primitivos + <code>List&lt;String&gt;</code>; objetos via JSON.</li>
        <li>Use para configs, flags, último estado da UI.</li>
        <li>Para dados sensíveis use <code>flutter_secure_storage</code>.</li>
        <li>Para volumes grandes use sqflite, Hive ou Isar.</li>
      </ul>
    </PageContainer>
  );
}
