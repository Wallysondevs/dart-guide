import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ProjetoFinalTodoApp() {
  return (
    <PageContainer
      title="Projeto Final: App de Tarefas Completo em Flutter"
      subtitle="Um To-Do app de verdade — com persistência local, state management e Material 3 — passo a passo."
      difficulty="avancado"
      timeToRead="35 min"
    >
      <p>
        Chegou a hora de juntar tudo. Vamos construir um aplicativo de tarefas (to-do) <strong>do zero ao funcional</strong>, com banco de dados local (SQLite via <code>sqflite</code>), gerenciamento de estado com <code>Provider</code>, datas formatadas com <code>intl</code> e visual Material 3. Você vai sair desse capítulo entendendo como pedaços que estudou separadamente se encaixam num app real.
      </p>

      <h2>Setup: pubspec.yaml</h2>
      <p>Crie o app com <code>flutter create todo_app &amp;&amp; cd todo_app</code> e edite o <code>pubspec.yaml</code> adicionando as dependências:</p>
      <pre><code>{`name: todo_app
description: Lista de tarefas com persistência local.
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.5.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2     # state management
  sqflite: ^2.3.3      # SQLite local
  path: ^1.9.0         # juntar caminhos do FS
  path_provider: ^2.1.4 # achar pasta de docs do app
  intl: ^0.19.0        # formatar datas em pt_BR

flutter:
  uses-material-design: true`}</code></pre>
      <p>Rode <code>flutter pub get</code>. Pronto, o esqueleto está armado.</p>

      <h2>Modelo: a classe Task</h2>
      <p>O modelo representa uma tarefa. Como vai entrar e sair do banco, precisamos de <code>toMap</code>/<code>fromMap</code>:</p>
      <pre><code>{`// lib/models/task.dart
class Task {
  final int? id;
  final String titulo;
  final bool feita;
  final DateTime criadaEm;

  Task({this.id, required this.titulo, this.feita = false, required this.criadaEm});

  Map<String, dynamic> toMap() => {
        'id': id,
        'titulo': titulo,
        'feita': feita ? 1 : 0,
        'criada_em': criadaEm.toIso8601String(),
      };

  factory Task.fromMap(Map<String, dynamic> m) => Task(
        id: m['id'] as int?,
        titulo: m['titulo'] as String,
        feita: (m['feita'] as int) == 1,
        criadaEm: DateTime.parse(m['criada_em'] as String),
      );

  Task copyWith({String? titulo, bool? feita}) => Task(
        id: id,
        titulo: titulo ?? this.titulo,
        feita: feita ?? this.feita,
        criadaEm: criadaEm,
      );
}`}</code></pre>

      <h2>Persistência: TaskDb com sqflite</h2>
      <p>Toda lógica de banco fica isolada nesta classe — seguir o princípio da responsabilidade única evita virar espaguete:</p>
      <pre><code>{`// lib/data/task_db.dart
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';
import 'package:sqflite/sqflite.dart';
import '../models/task.dart';

class TaskDb {
  static Database? _db;

  Future<Database> get database async {
    if (_db != null) return _db!;
    final dir = await getApplicationDocumentsDirectory();
    final path = p.join(dir.path, 'tasks.db');
    _db = await openDatabase(path, version: 1, onCreate: (db, v) {
      return db.execute('''
        CREATE TABLE tasks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          titulo TEXT NOT NULL,
          feita INTEGER NOT NULL DEFAULT 0,
          criada_em TEXT NOT NULL
        )
      ''');
    });
    return _db!;
  }

  Future<List<Task>> listar() async {
    final db = await database;
    final rows = await db.query('tasks', orderBy: 'feita ASC, criada_em DESC');
    return rows.map(Task.fromMap).toList();
  }

  Future<int> inserir(Task t) async {
    final db = await database;
    return db.insert('tasks', t.toMap()..remove('id'));
  }

  Future<int> atualizar(Task t) async {
    final db = await database;
    return db.update('tasks', t.toMap(), where: 'id = ?', whereArgs: [t.id]);
  }

  Future<int> remover(int id) async {
    final db = await database;
    return db.delete('tasks', where: 'id = ?', whereArgs: [id]);
  }
}`}</code></pre>

      <AlertBox type="info" title="Por que isolar o DB?">
        Se amanhã trocarmos <code>sqflite</code> por <code>drift</code> ou um backend HTTP, só esta classe muda. O resto do app não percebe — é o poder de programar contra uma <em>interface</em>, não contra uma implementação.
      </AlertBox>

      <h2>Estado: TaskRepo com ChangeNotifier</h2>
      <p>O <code>TaskRepo</code> mantém a lista em memória e avisa a UI quando muda, via <code>notifyListeners()</code>:</p>
      <pre><code>{`// lib/state/task_repo.dart
import 'package:flutter/foundation.dart';
import '../data/task_db.dart';
import '../models/task.dart';

class TaskRepo extends ChangeNotifier {
  final TaskDb _db;
  TaskRepo(this._db) { carregar(); }

  List<Task> _tasks = [];
  List<Task> get tasks => List.unmodifiable(_tasks);

  bool _carregando = false;
  bool get carregando => _carregando;

  Future<void> carregar() async {
    _carregando = true;
    notifyListeners();
    _tasks = await _db.listar();
    _carregando = false;
    notifyListeners();
  }

  Future<void> adicionar(String titulo) async {
    if (titulo.trim().isEmpty) return;
    await _db.inserir(Task(titulo: titulo.trim(), criadaEm: DateTime.now()));
    await carregar();
  }

  Future<void> alternar(Task t) async {
    await _db.atualizar(t.copyWith(feita: !t.feita));
    await carregar();
  }

  Future<void> remover(Task t) async {
    if (t.id != null) await _db.remover(t.id!);
    await carregar();
  }
}`}</code></pre>

      <h2>UI: main, tela de lista e dialog de criação</h2>
      <p>Tudo amarrado. <code>MultiProvider</code> injeta o repo na árvore; <code>Consumer</code> reconstrói só o que precisa:</p>
      <pre><code>{`// lib/main.dart
import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';
import 'data/task_db.dart';
import 'state/task_repo.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('pt_BR');
  runApp(MultiProvider(
    providers: [
      ChangeNotifierProvider(create: (_) => TaskRepo(TaskDb())),
    ],
    child: const TodoApp(),
  ));
}

class TodoApp extends StatelessWidget {
  const TodoApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'To-Do',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const TasksPage(),
    );
  }
}

class TasksPage extends StatelessWidget {
  const TasksPage({super.key});
  @override
  Widget build(BuildContext context) {
    final fmt = DateFormat('dd/MM HH:mm', 'pt_BR');
    return Scaffold(
      appBar: AppBar(title: const Text('Minhas tarefas')),
      body: Consumer<TaskRepo>(builder: (ctx, repo, _) {
        if (repo.carregando) return const Center(child: CircularProgressIndicator());
        if (repo.tasks.isEmpty) return const Center(child: Text('Nenhuma tarefa ainda.'));
        return ListView.separated(
          itemCount: repo.tasks.length,
          separatorBuilder: (_, __) => const Divider(height: 1),
          itemBuilder: (_, i) {
            final t = repo.tasks[i];
            return ListTile(
              leading: Checkbox(value: t.feita, onChanged: (_) => repo.alternar(t)),
              title: Text(t.titulo,
                style: TextStyle(decoration: t.feita ? TextDecoration.lineThrough : null)),
              subtitle: Text(fmt.format(t.criadaEm)),
              trailing: IconButton(
                icon: const Icon(Icons.delete_outline),
                onPressed: () => repo.remover(t),
              ),
            );
          },
        );
      }),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _abrirDialogo(context),
        child: const Icon(Icons.add),
      ),
    );
  }

  Future<void> _abrirDialogo(BuildContext context) async {
    final ctrl = TextEditingController();
    final repo = context.read<TaskRepo>();
    await showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Nova tarefa'),
        content: TextField(controller: ctrl, autofocus: true,
          decoration: const InputDecoration(hintText: 'Ex: comprar leite')),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancelar')),
          FilledButton(
            onPressed: () { repo.adicionar(ctrl.text); Navigator.pop(ctx); },
            child: const Text('Adicionar'),
          ),
        ],
      ),
    );
  }
}`}</code></pre>

      <AlertBox type="success" title="Funciona offline">
        Como tudo está em SQLite no aparelho, o app funciona <strong>sem internet</strong>. Para sincronizar com a nuvem depois, basta criar um <code>RemoteTaskDb</code> que implemente a mesma interface e juntar os dois numa estratégia de cache.
      </AlertBox>

      <h2>Rodando e empacotando</h2>
      <pre><code>{`# Rodar em emulador / dispositivo
flutter run

# Build release Android (APK universal)
flutter build apk --release

# Build release Android (app bundle pra Play Store)
flutter build appbundle --release

# Build release iOS (precisa de Mac + Xcode)
flutter build ios --release`}</code></pre>

      <h2>Próximos passos sugeridos</h2>
      <ul>
        <li><strong>Edição inline</strong>: tap em uma tarefa abre dialog para editar título.</li>
        <li><strong>Filtros</strong>: tabs "Todas / Pendentes / Concluídas".</li>
        <li><strong>Notificações</strong>: pacote <code>flutter_local_notifications</code> para lembretes por data.</li>
        <li><strong>Sincronização</strong>: usar Firebase ou Supabase como backend.</li>
        <li><strong>Testes</strong>: <code>flutter test</code> para o repo, <code>integration_test</code> para a UI.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Camadas: <strong>Model</strong> (Task) → <strong>Data</strong> (TaskDb sqflite) → <strong>State</strong> (TaskRepo ChangeNotifier) → <strong>UI</strong> (Widgets).</li>
        <li><code>Provider</code> + <code>ChangeNotifier</code> + <code>Consumer</code> dão reatividade simples sem boilerplate.</li>
        <li><code>sqflite</code> + <code>path_provider</code> + <code>path</code> = persistência local sólida.</li>
        <li><code>intl</code> formata datas em pt_BR sem dor de cabeça.</li>
        <li>Material 3 com <code>ColorScheme.fromSeed</code> garante visual moderno automaticamente.</li>
        <li>Você acabou de construir um app real do zero. Parabéns 🎉</li>
      </ul>
    </PageContainer>
  );
}
