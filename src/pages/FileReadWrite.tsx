import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FileReadWrite() {
  return (
    <PageContainer
      title="Lendo e escrevendo arquivos com File"
      subtitle="Texto, bytes, linha por linha ou em streaming — todos os jeitos de manipular arquivos com a classe File de dart:io."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Pense em <code>File</code> como uma <em>etiqueta apontando para um arquivo no disco</em>. Criar a etiqueta não cria o arquivo, e perdê-la não apaga nada — é só uma referência. Para realmente <em>fazer alguma coisa</em>, você chama métodos sobre essa etiqueta: ler, escrever, verificar se existe, apagar. A classe <code>File</code> de <code>dart:io</code> é a sua interface universal para essas operações.
      </p>

      <h2>Criando a referência</h2>
      <p>
        Você passa o caminho (relativo ou absoluto) e pronto. <strong>Não há I/O nesse momento</strong> — apenas alocação de uma instância em memória.
      </p>
      <pre><code>{`import 'dart:io';

void main() async {
  // Caminho relativo (a partir do diretorio atual):
  final config = File('config.json');

  // Caminho absoluto:
  final log = File('/var/log/app.log');

  // Verifique antes de ler:
  if (await config.exists()) {
    print('config existe!');
  }
}`}</code></pre>

      <h2>Lendo texto inteiro</h2>
      <p>
        O método <code>readAsString</code> traz <em>todo</em> o conteúdo como uma única <code>String</code>. Simples, mas cuidado: para arquivos enormes (centenas de MB) isso carrega tudo na memória.
      </p>
      <pre><code>{`import 'dart:io';
import 'dart:convert';

Future<void> main() async {
  final f = File('config.json');
  final texto = await f.readAsString(encoding: utf8);
  print(texto);
}`}</code></pre>

      <h2>Lendo linha por linha</h2>
      <p>
        Para arquivos de texto formatados em linhas (CSV, log, .txt comum), <code>readAsLines</code> devolve uma <code>List&lt;String&gt;</code>. Cada elemento é uma linha, sem o caractere de quebra no fim.
      </p>
      <pre><code>{`Future<int> contarLinhas(String caminho) async {
  final linhas = await File(caminho).readAsLines();
  print('total: \${linhas.length} linhas');
  for (final l in linhas.take(3)) {
    print('  > \$l');
  }
  return linhas.length;
}`}</code></pre>

      <h2>Lendo bytes brutos</h2>
      <p>
        Para arquivos binários (imagens, PDFs, áudio), use <code>readAsBytes</code>. Devolve um <code>Uint8List</code> — uma lista compacta de inteiros de 0 a 255, perfeita para representar bytes.
      </p>
      <pre><code>{`Future<void> verificarPng(String caminho) async {
  final bytes = await File(caminho).readAsBytes();
  // PNG sempre comeca com a "assinatura magica" 89 50 4E 47
  final assinatura = bytes.take(4).toList();
  if (assinatura.toString() == '[137, 80, 78, 71]') {
    print('Eh um PNG valido (\${bytes.length} bytes).');
  } else {
    print('Nao parece PNG.');
  }
}`}</code></pre>

      <h2>Escrevendo: <code>writeAsString</code> e modos</h2>
      <p>
        Por padrão, <code>writeAsString</code> <strong>sobrescreve</strong> o arquivo do zero. Se você quer <em>adicionar</em> ao final (append), passe <code>FileMode.append</code>.
      </p>
      <pre><code>{`import 'dart:io';

Future<void> main() async {
  final log = File('app.log');

  // Sobrescreve (zera o arquivo e escreve novo conteudo):
  await log.writeAsString('Iniciando aplicacao\\n');

  // Adiciona ao final:
  await log.writeAsString(
    'Evento: usuario logou\\n',
    mode: FileMode.append,
    flush: true, // forca o SO a gravar imediatamente
  );

  // Escrevendo bytes:
  await File('saida.bin').writeAsBytes([0x48, 0x69, 0x21]);
}`}</code></pre>

      <AlertBox type="info" title="O parâmetro <code>flush</code>">
        Quando você escreve no disco, o sistema operacional pode <em>bufferizar</em> o conteúdo (guardar na RAM e gravar depois). Em logs críticos, <code>flush: true</code> garante que o byte chegue ao disco antes de a função retornar — útil se o programa pode crashar logo em seguida.
      </AlertBox>

      <h2>Streaming: para arquivos enormes</h2>
      <p>
        Quando o arquivo não cabe confortavelmente na memória (vídeos, dumps de banco), use <code>openRead()</code>: ele devolve um <strong>Stream</strong> de pedaços (<code>chunks</code>). Você processa pedaço por pedaço sem nunca segurar o todo. Pense num cano: a água passa em fluxo, não em uma única lata gigante.
      </p>
      <pre><code>{`import 'dart:io';
import 'dart:convert';

Future<int> contarLinhasGrande(String caminho) async {
  var total = 0;
  final stream = File(caminho)
      .openRead()                  // Stream<List<int>> em chunks
      .transform(utf8.decoder)     // bytes -> texto UTF-8
      .transform(const LineSplitter()); // texto -> linhas

  await for (final linha in stream) {
    total++;
    if (linha.contains('ERROR')) print(linha);
  }
  return total;
}`}</code></pre>

      <p>
        Aqui aparecem três conceitos novos: <strong>Stream</strong> (fluxo assíncrono de dados), <strong>transform</strong> (aplica uma transformação preguiçosa em cada pedaço) e <strong>await for</strong> (loop que consome um stream). É como uma esteira de fábrica: cada pedaço passa por estações que limpam, decodificam e cortam.
      </p>

      <h2>Verificações úteis</h2>
      <pre><code>{`Future<void> diagnostico(String caminho) async {
  final f = File(caminho);
  final existe = await f.exists();
  if (!existe) {
    print('Nao existe.');
    return;
  }

  final stat = await f.stat();
  print('Tamanho: \${stat.size} bytes');
  print('Modificado: \${stat.modified}');
  print('Tipo: \${stat.type}');     // file, directory, link
  print('Modo (permissoes): \${stat.modeString()}');
}

Future<void> apagar(String caminho) async {
  final f = File(caminho);
  if (await f.exists()) {
    await f.delete();
    print('apagado.');
  }
}`}</code></pre>

      <h2>Async vs Sync</h2>
      <p>
        Quase toda API tem versão síncrona (sufixo <code>Sync</code>): <code>readAsStringSync</code>, <code>writeAsStringSync</code>, <code>existsSync</code>. A versão sync trava o programa enquanto o disco responde — em servidores e Flutter, isso congela a UI ou bloqueia outras requisições. Use <strong>sempre o async</strong>, exceto em scripts de uma vez só.
      </p>
      <pre><code>{`// Em um script CLI rapido, sync eh ok:
final txt = File('config.json').readAsStringSync();

// Em servidor ou Flutter, sempre async:
final txt = await File('config.json').readAsString();`}</code></pre>

      <AlertBox type="warning" title="Encoding por padrão é UTF-8">
        <code>readAsString</code> assume UTF-8. Se o arquivo for Latin-1 ou Windows-1252 (comum em arquivos antigos), passe <code>encoding: latin1</code> de <code>dart:convert</code>. Caracteres &quot;esquisitos&quot; geralmente são sintoma de encoding errado.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Não verificar <code>exists()</code></strong> e tomar <code>PathNotFoundException</code> em produção.</li>
        <li><strong>Carregar arquivo gigante com <code>readAsString</code></strong> em servidor — estoura memória.</li>
        <li><strong>Usar versões <code>Sync</code> em Flutter</strong> e travar a UI por segundos.</li>
        <li><strong>Esquecer <code>FileMode.append</code></strong> e sobrescrever o log inteiro a cada gravação.</li>
        <li><strong>Caminho relativo errado</strong> — depende do <em>diretório atual</em>; use <code>Directory.current.path</code> para depurar.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>File('caminho')</code> só cria a referência — nada acontece no disco até você chamar um método.</li>
        <li>Texto inteiro: <code>readAsString</code>; linha a linha: <code>readAsLines</code>; bytes: <code>readAsBytes</code>.</li>
        <li>Para arquivos grandes, use <code>openRead()</code> e processe via Stream.</li>
        <li>Escrita: <code>writeAsString</code> (sobrescreve) ou com <code>FileMode.append</code> (adiciona).</li>
        <li>Prefira sempre as versões <code>async</code>; reserve <code>Sync</code> para scripts.</li>
      </ul>
    </PageContainer>
  );
}
