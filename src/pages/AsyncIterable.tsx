import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AsyncIterable() {
  return (
    <PageContainer
      title="async* generators: produzindo streams com yield"
      subtitle="A forma mais elegante de criar Streams: escreva como uma função normal, use yield para emitir."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Imagine que você é um vendedor numa feira que vai mostrando frutas uma a uma. Você não enche uma sacola e entrega tudo de uma vez — você <em>cede</em> uma fruta, espera o cliente olhar, depois cede a próxima. Em Dart, isso é exatamente o que <code>async*</code> + <code>yield</code> fazem com Streams: ao invés de montar uma lista inteira na memória, sua função <strong>vai produzindo eventos sob demanda</strong>.
      </p>

      <h2>Sintaxe: async* + yield</h2>
      <p>
        Marque a função com <code>async*</code> (com asterisco!) e use <code>yield</code> para emitir cada valor. O retorno declarado é <code>Stream&lt;T&gt;</code>. Cada <code>yield</code> empurra um evento para os ouvintes.
      </p>
      <pre><code>{`Stream<int> contar(int ate) async* {
  for (var i = 1; i <= ate; i++) {
    await Future.delayed(const Duration(milliseconds: 200));
    yield i; // emite um evento na Stream
  }
}

Future<void> main() async {
  await for (final n in contar(3)) {
    print('valor: \$n');
  }
  print('fim');
}`}</code></pre>

      <h2>Comparação: sync* vs async*</h2>
      <ul>
        <li><strong><code>sync*</code></strong>: gera <code>Iterable&lt;T&gt;</code> (lazy, síncrono) — bom para sequências preguiçosas em memória.</li>
        <li><strong><code>async*</code></strong>: gera <code>Stream&lt;T&gt;</code> (lazy, assíncrono) — bom para eventos ao longo do tempo.</li>
      </ul>
      <pre><code>{`Iterable<int> contagemSync(int ate) sync* {
  for (var i = 1; i <= ate; i++) {
    yield i;        // sem await possível aqui
  }
}

Stream<int> contagemAsync(int ate) async* {
  for (var i = 1; i <= ate; i++) {
    await Future.delayed(const Duration(milliseconds: 50));
    yield i;
  }
}`}</code></pre>

      <h2>yield* — encadear outra Stream/Iterable</h2>
      <p>
        Use <code>yield*</code> (com asterisco) para &quot;descarregar&quot; outra Stream dentro da sua. É o equivalente assíncrono do <code>...spread</code>:
      </p>
      <pre><code>{`Stream<int> ate(int n) async* {
  for (var i = 1; i <= n; i++) yield i;
}

Stream<int> juntas() async* {
  yield 0;
  yield* ate(3);   // emite 1, 2, 3
  yield* ate(2);   // emite 1, 2
  yield 99;
}

void main() => juntas().listen(print);
// 0, 1, 2, 3, 1, 2, 99`}</code></pre>

      <h2>Caso real: paginação de API</h2>
      <p>
        <code>async*</code> brilha em paginação: você não conhece o total, mas pode emitir cada página conforme baixa.
      </p>
      <pre><code>{`Stream<Map<String, dynamic>> baixarTodos() async* {
  var pagina = 1;
  while (true) {
    final resp = await api.get('/itens?pagina=\$pagina');
    final dados = resp['dados'] as List;
    if (dados.isEmpty) return;             // encerra a Stream
    for (final item in dados) {
      yield item as Map<String, dynamic>;
    }
    if (resp['proxima'] == null) return;
    pagina++;
  }
}

Future<void> main() async {
  await for (final item in baixarTodos()) {
    print(item['titulo']);
  }
}`}</code></pre>

      <AlertBox type="info" title="A função &quot;dorme&quot; entre yields">
        Cada <code>yield</code> entrega um evento e <em>pausa</em> a função até o ouvinte estar pronto para o próximo. Isso é &quot;back-pressure&quot; natural: produtor não corre mais que o consumidor.
      </AlertBox>

      <h2>Cancelamento: onCancel e StreamSubscription</h2>
      <p>
        Quando o consumidor cancela a assinatura ou dá <code>break</code> no <code>await for</code>, a função <code>async*</code> é abortada na próxima execução. Use <code>try/finally</code> para limpar recursos.
      </p>
      <pre><code>{`Stream<int> sensor() async* {
  print('liguei sensor');
  try {
    var i = 0;
    while (true) {
      await Future.delayed(const Duration(milliseconds: 200));
      yield i++;
    }
  } finally {
    print('desliguei sensor');
  }
}

Future<void> main() async {
  await for (final v in sensor()) {
    print(v);
    if (v >= 3) break; // dispara cancelamento
  }
}`}</code></pre>

      <h2>Erros e exceções</h2>
      <p>
        Lançar <code>throw</code> dentro de <code>async*</code> emite um <em>evento de erro</em> na Stream, indo para o <code>onError</code> ou <code>catch</code> do <code>await for</code>.
      </p>
      <pre><code>{`Stream<int> arriscar() async* {
  yield 1;
  throw StateError('boom');
}

Future<void> main() async {
  try {
    await for (final n in arriscar()) {
      print(n);
    }
  } catch (e) {
    print('Erro: \$e');
  }
}`}</code></pre>

      <AlertBox type="warning" title="async vs async* — não confunda">
        <code>async</code> retorna <code>Future</code>; <code>async*</code> retorna <code>Stream</code>. Asterisco MUDA tudo. <code>yield</code> só funciona em <code>async*</code> ou <code>sync*</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o asterisco:</strong> <code>async</code> + <code>yield</code> não compila.</li>
        <li><strong>Usar <code>return valor</code> em <code>async*</code>:</strong> proibido — o retorno é <code>void</code>; use <code>yield</code> e depois <code>return</code> sem valor para encerrar cedo.</li>
        <li><strong>Não usar <code>try/finally</code>:</strong> recursos vazam quando o consumidor cancela.</li>
        <li><strong>Confundir <code>yield*</code> e <code>await</code>:</strong> <code>yield*</code> repassa eventos; <code>await</code> espera um Future único.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>async*</code> + <code>yield</code> = Stream produzida sob demanda.</li>
        <li><code>sync*</code> faz a mesma coisa, mas para Iterable.</li>
        <li><code>yield*</code> &quot;descarrega&quot; outra Stream/Iterable.</li>
        <li>A função pausa entre yields — back-pressure natural.</li>
        <li>Use <code>try/finally</code> para fechar recursos no cancelamento.</li>
      </ul>
    </PageContainer>
  );
}
