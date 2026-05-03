import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Sqflite() {
  return (
    <PageContainer
      title="Persistência local com sqflite"
      subtitle="Guardando dados estruturados no celular usando o velho e confiável SQLite."
      difficulty="intermediario"
      timeToRead="14 min"
    >
      <p>
        Imagine seu app como uma loja: o servidor remoto é o estoque central, mas seu cliente quer ver os produtos mesmo offline, no avião. Para isso, você precisa de uma <strong>despensa</strong> dentro do celular. SQLite é a despensa mais usada do mundo (Android, iOS, Firefox e até aviões da Boeing usam). O pacote <code>sqflite</code> traz SQLite para Flutter de forma idiomática.
      </p>

      <h2>Instalação</h2>
      <pre><code>{`# pubspec.yaml
dependencies:
  sqflite: ^2.3.3
  path: ^1.9.0   # cuida de caminhos cross-platform`}</code></pre>

      <h2>Abrindo o banco</h2>
      <p>
        O banco fica num arquivo dentro do diretório de documentos do app. Você abre uma vez e reusa. O parâmetro <code>onCreate</code> roda só na primeira vez (quando o arquivo não existe), criando as tabelas.
      </p>
      <pre><code>{`import 'package:path/path.dart';
import 'package:sqflite/sqflite.dart';

class DB {
  static Database? _db;

  static Future<Database> instancia() async {
    if (_db != null) return _db!;
    final caminho = join(await getDatabasesPath(), 'app.db');

    _db = await openDatabase(
      caminho,
      version: 1,
      onCreate: (db, versao) async {
        await db.execute('''
          CREATE TABLE tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            feita INTEGER NOT NULL DEFAULT 0,
            criada_em INTEGER NOT NULL
          )
        ''');
      },
    );
    return _db!;
  }
}`}</code></pre>

      <h2>CRUD: Create, Read, Update, Delete</h2>
      <p>
        sqflite expõe métodos tipados (<code>insert</code>, <code>query</code>, <code>update</code>, <code>delete</code>) que evitam SQL injection. Para queries complexas, dá para usar <code>rawQuery</code>.
      </p>
      <pre><code>{`// CREATE
Future<int> inserirTarefa(String titulo) async {
  final db = await DB.instancia();
  return db.insert('tarefas', {
    'titulo': titulo,
    'feita': 0,
    'criada_em': DateTime.now().millisecondsSinceEpoch,
  });
}

// READ
Future<List<Map<String, dynamic>>> listarTarefas() async {
  final db = await DB.instancia();
  return db.query(
    'tarefas',
    orderBy: 'criada_em DESC',
  );
}

// UPDATE
Future<int> marcarFeita(int id, bool feita) async {
  final db = await DB.instancia();
  return db.update(
    'tarefas',
    {'feita': feita ? 1 : 0},
    where: 'id = ?',
    whereArgs: [id], // ? evita SQL injection
  );
}

// DELETE
Future<int> excluir(int id) async {
  final db = await DB.instancia();
  return db.delete('tarefas', where: 'id = ?', whereArgs: [id]);
}`}</code></pre>

      <AlertBox type="warning" title="Sempre use parâmetros ?">
        Concatenar strings em SQL (<code>WHERE id = \$id</code>) é uma <strong>vulnerabilidade</strong> de SQL injection. Use <code>?</code> e <code>whereArgs</code> — sqflite escapa automaticamente.
      </AlertBox>

      <h2>Mapeando para classes Dart</h2>
      <p>
        Trabalhar com <code>Map&lt;String, dynamic&gt;</code> direto é frágil. Crie uma classe modelo com <code>fromMap</code>/<code>toMap</code>:
      </p>
      <pre><code>{`class Tarefa {
  final int? id;
  final String titulo;
  final bool feita;
  final DateTime criadaEm;

  Tarefa({
    this.id,
    required this.titulo,
    required this.feita,
    required this.criadaEm,
  });

  factory Tarefa.fromMap(Map<String, dynamic> m) => Tarefa(
        id: m['id'] as int?,
        titulo: m['titulo'] as String,
        feita: (m['feita'] as int) == 1,
        criadaEm: DateTime.fromMillisecondsSinceEpoch(m['criada_em'] as int),
      );

  Map<String, dynamic> toMap() => {
        if (id != null) 'id': id,
        'titulo': titulo,
        'feita': feita ? 1 : 0,
        'criada_em': criadaEm.millisecondsSinceEpoch,
      };
}`}</code></pre>

      <h2>Transactions: tudo ou nada</h2>
      <p>
        Se você precisa fazer várias mudanças que devem &quot;dar certo juntas&quot; (ou nenhuma), use uma transação. Se algo falhar, o sqflite reverte tudo automaticamente — comportamento &quot;atômico&quot;.
      </p>
      <pre><code>{`Future<void> moverParaCategoria(int tarefaId, int categoriaId) async {
  final db = await DB.instancia();
  await db.transaction((txn) async {
    await txn.update('tarefas', {'categoria_id': categoriaId},
        where: 'id = ?', whereArgs: [tarefaId]);
    await txn.insert('historico', {
      'acao': 'mover',
      'tarefa_id': tarefaId,
      'em': DateTime.now().millisecondsSinceEpoch,
    });
    // Se qualquer linha lançar, ambas são desfeitas.
  });
}`}</code></pre>

      <h2>Migrations: evoluindo o schema</h2>
      <p>
        Quando você lança a v2 do app com uma coluna nova, os usuários antigos têm bancos com schema v1. <code>onUpgrade</code> roda quando a versão aumenta:
      </p>
      <pre><code>{`_db = await openDatabase(
  caminho,
  version: 2,
  onCreate: (db, versao) async {
    await db.execute(/* ... CREATE original ... */);
    await db.execute('ALTER TABLE tarefas ADD COLUMN prioridade INTEGER DEFAULT 0');
  },
  onUpgrade: (db, antiga, nova) async {
    if (antiga < 2) {
      await db.execute(
        'ALTER TABLE tarefas ADD COLUMN prioridade INTEGER DEFAULT 0',
      );
    }
  },
);`}</code></pre>

      <AlertBox type="info" title="Alternativas modernas">
        <strong>Hive</strong> é mais rápido para chave-valor e objetos simples (sem SQL). <strong>Isar</strong> é orientado a documentos, super rápido, com queries reativas. Use sqflite quando precisar de SQL real (joins, GROUP BY) ou já vem de outro stack.
      </AlertBox>

      <h2>Exemplo completo: lista reativa</h2>
      <pre><code>{`class TelaTarefas extends StatefulWidget {
  const TelaTarefas({super.key});
  @override
  State<TelaTarefas> createState() => _TelaTarefasState();
}

class _TelaTarefasState extends State<TelaTarefas> {
  late Future<List<Tarefa>> _futuro;

  @override
  void initState() {
    super.initState();
    _carregar();
  }

  void _carregar() {
    _futuro = listarTarefas().then(
      (lista) => lista.map(Tarefa.fromMap).toList(),
    );
  }

  Future<void> _adicionar(String titulo) async {
    await inserirTarefa(titulo);
    setState(_carregar);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Minhas tarefas')),
      body: FutureBuilder<List<Tarefa>>(
        future: _futuro,
        builder: (_, snap) {
          if (!snap.hasData) return const Center(child: CircularProgressIndicator());
          return ListView(
            children: [
              for (final t in snap.data!)
                CheckboxListTile(
                  title: Text(t.titulo),
                  value: t.feita,
                  onChanged: (v) async {
                    await marcarFeita(t.id!, v ?? false);
                    setState(_carregar);
                  },
                ),
            ],
          );
        },
      ),
    );
  }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Concatenar SQL</strong> em vez de usar <code>?</code> — risco de injection.</li>
        <li><strong>Esquecer de incrementar <code>version</code></strong> — <code>onUpgrade</code> nunca roda.</li>
        <li><strong>Abrir várias conexões</strong> — use singleton.</li>
        <li><strong>Bool e DateTime no SQLite</strong>: ele só tem INTEGER/TEXT. Converta.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>sqflite traz SQLite para Flutter — banco confiável e portátil.</li>
        <li>Use métodos tipados; sempre <code>?</code> + <code>whereArgs</code>.</li>
        <li>Transactions garantem atomicidade.</li>
        <li><code>onUpgrade</code> aplica migrations entre versões.</li>
        <li>Para chave-valor ou docs, considere Hive ou Isar.</li>
      </ul>
    </PageContainer>
  );
}
