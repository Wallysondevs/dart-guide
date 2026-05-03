import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DirectoryFs() {
  return (
    <PageContainer
      title="Directory: navegando e criando pastas"
      subtitle="Como listar, criar, apagar e &quot;vigiar&quot; pastas no sistema de arquivos com a classe Directory de dart:io."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Se <code>File</code> é a etiqueta de uma carta, <code>Directory</code> é a etiqueta de uma <em>gaveta</em>: aponta para um lugar onde várias coisas (arquivos e outras pastas) podem ser organizadas. A classe <code>Directory</code> de <code>dart:io</code> dá métodos para criar, listar, apagar e até reagir a mudanças em pastas — tudo o que você espera de um gerenciador de arquivos, agora controlado por código.
      </p>

      <h2>Criando a referência e a pasta</h2>
      <p>
        Como <code>File</code>, instanciar não cria nada no disco — só prepara o objeto. Para realmente criar a pasta, chame <code>create()</code>. O parâmetro <code>recursive: true</code> cria todas as pastas pai ausentes (como <code>mkdir -p</code> no Linux).
      </p>
      <pre><code>{`import 'dart:io';

Future<void> main() async {
  final dir = Directory('relatorios/2025/janeiro');

  // Sem recursive, falha se 'relatorios' ou '2025' nao existirem.
  await dir.create(recursive: true);

  print('criada em: \${dir.absolute.path}');
}`}</code></pre>

      <h2>Verificando existência e tipo</h2>
      <pre><code>{`import 'dart:io';

Future<void> diagnostico(String caminho) async {
  final tipo = await FileSystemEntity.type(caminho);
  switch (tipo) {
    case FileSystemEntityType.directory:
      print('eh pasta');
    case FileSystemEntityType.file:
      print('eh arquivo');
    case FileSystemEntityType.link:
      print('eh link simbolico');
    case FileSystemEntityType.notFound:
      print('nao existe');
    default:
      print('outro');
  }
}`}</code></pre>

      <h2>Listando o conteúdo: <code>list()</code> versus <code>listSync()</code></h2>
      <p>
        <code>list()</code> devolve um <strong>Stream</strong> — os itens chegam um a um, sem carregar todos na memória. Isso é importante para pastas com milhares de arquivos. <code>listSync()</code> devolve uma <code>List</code> pronta de uma vez (mais simples, mas pode estourar memória se a pasta for enorme).
      </p>
      <pre><code>{`import 'dart:io';

Future<void> listarLazy(String caminho) async {
  final dir = Directory(caminho);
  await for (final entidade in dir.list(recursive: false, followLinks: false)) {
    if (entidade is File) {
      final tam = await entidade.length();
      print('FILE  \${entidade.path}  (\$tam B)');
    } else if (entidade is Directory) {
      print('DIR   \${entidade.path}');
    } else if (entidade is Link) {
      print('LINK  \${entidade.path}');
    }
  }
}

void listarRapido(String caminho) {
  final entidades = Directory(caminho).listSync();
  for (final e in entidades) {
    print(e.path);
  }
}`}</code></pre>

      <p>
        O parâmetro <code>recursive: true</code> faz a listagem entrar em todas as subpastas (como <code>find</code>). Cuidado: em <code>/</code> ou <code>C:\\</code> isso pode levar minutos.
      </p>

      <AlertBox type="info" title="O que é um Stream?">
        Stream é uma <em>sequência assíncrona</em>: imagine uma esteira de fábrica em que os itens chegam um por vez, no tempo deles. Você processa cada um sem ter que esperar a esteira inteira terminar. <code>await for</code> é a forma de consumir essa esteira no seu código.
      </AlertBox>

      <h2>Apagando pastas</h2>
      <p>
        <code>delete()</code> só remove pasta vazia. Para apagar tudo dentro junto, use <code>delete(recursive: true)</code> — equivalente a <code>rm -rf</code>. Tome muito cuidado: <em>não tem lixeira</em>, vai direto.
      </p>
      <pre><code>{`Future<void> limparTemp() async {
  final tmp = Directory('build/tmp');
  if (await tmp.exists()) {
    await tmp.delete(recursive: true);
    print('build/tmp apagada.');
  }
  await tmp.create(); // recria vazia
}`}</code></pre>

      <AlertBox type="warning" title="Cuidado com <code>delete(recursive: true)</code>">
        Um <code>Directory('/').delete(recursive: true)</code> rodando como root apagaria seu sistema. Sempre valide o caminho antes (não comece com <code>/</code>, esteja dentro de pastas controladas, etc.).
      </AlertBox>

      <h2>Pastas especiais: <code>current</code> e <code>systemTemp</code></h2>
      <p>
        <code>Directory.current</code> aponta para o <em>diretório de trabalho</em> — o lugar de onde o programa foi executado. Caminhos relativos são resolvidos a partir dele. <code>Directory.systemTemp</code> é a pasta temporária do SO (<code>/tmp</code> em Linux, <code>%TEMP%</code> no Windows), ótima para arquivos descartáveis.
      </p>
      <pre><code>{`import 'dart:io';

Future<void> exemplos() async {
  print('estou em: \${Directory.current.path}');

  // Cria uma pasta temporaria unica (e segura contra colisao):
  final temp = await Directory.systemTemp.createTemp('meu_app_');
  print('temporaria: \${temp.path}');

  // Faca o trabalho aqui...

  // Limpe quando terminar:
  await temp.delete(recursive: true);
}`}</code></pre>

      <h2>Vigiando mudanças: <code>watch()</code></h2>
      <p>
        Quer reagir quando alguém criar, modificar ou apagar um arquivo dentro da pasta? <code>watch()</code> devolve um Stream de eventos do sistema de arquivos. Útil para hot-reload caseiro, sincronização, indexadores.
      </p>
      <pre><code>{`import 'dart:io';

void main() {
  final dir = Directory('docs');
  dir.watch(events: FileSystemEvent.all, recursive: true).listen((evento) {
    final tipo = switch (evento.type) {
      FileSystemEvent.create => 'CRIADO',
      FileSystemEvent.modify => 'MODIFICADO',
      FileSystemEvent.delete => 'APAGADO',
      FileSystemEvent.move => 'MOVIDO',
      _ => 'EVENTO',
    };
    print('\$tipo \${evento.path}');
  });
  print('vigiando docs/... (Ctrl+C para sair)');
}`}</code></pre>
      <p>
        Atenção: <code>watch</code> não é suportado em todas as plataformas/sistemas de arquivos (em particular, alguns sistemas de rede ou containers Linux antigos). Sempre teste no ambiente alvo.
      </p>

      <h2>Caminhos portáveis</h2>
      <p>
        Concatenar paths com <code>'/'</code> funciona no Linux mas quebra no Windows. Use <code>Platform.pathSeparator</code> ou, melhor ainda, o pacote <code>path</code> (oficial) para juntar caminhos de forma portável.
      </p>
      <pre><code>{`import 'dart:io';
// pubspec: dependencies: path: ^1.9.0
import 'package:path/path.dart' as p;

void main() {
  final caminho = p.join('relatorios', '2025', 'jan.txt');
  // No Linux: relatorios/2025/jan.txt
  // No Windows: relatorios\\2025\\jan.txt
  final f = File(caminho);
  print(f.path);
  print('extensao: \${p.extension(caminho)}'); // .txt
  print('nome: \${p.basenameWithoutExtension(caminho)}'); // jan
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>recursive: true</code></strong> em <code>create()</code> e tomar erro porque a pasta pai não existe.</li>
        <li><strong>Usar <code>listSync()</code> em pastas enormes</strong> — bloqueia e estoura memória.</li>
        <li><strong>Apagar com <code>recursive: true</code> sem validar caminho</strong> — risco real de zerar pastas importantes.</li>
        <li><strong>Concatenar paths com <code>'/'</code> manualmente</strong> e quebrar no Windows.</li>
        <li><strong>Esperar que <code>watch()</code> funcione em todo lugar</strong> — alguns FS não suportam.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Directory('p').create(recursive: true)</code> cria pasta e ancestrais.</li>
        <li><code>list()</code> é stream lazy; <code>listSync()</code> é síncrono e materializa tudo.</li>
        <li><code>delete(recursive: true)</code> apaga conteúdo todo — sem lixeira.</li>
        <li><code>Directory.current</code> = diretório de trabalho; <code>Directory.systemTemp</code> = pasta temporária do SO.</li>
        <li><code>watch()</code> emite eventos de mudanças no FS (com limitações por plataforma).</li>
        <li>Use o pacote <code>path</code> para concatenar caminhos de forma portável.</li>
      </ul>
    </PageContainer>
  );
}
