import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TestAsync() {
  return (
    <PageContainer
      title="Testando código assíncrono: Future e Stream"
      subtitle="Aprenda a testar funções que retornam valores no futuro, lançam exceções tardias ou emitem múltiplos eventos ao longo do tempo."
      difficulty="intermediario"
      timeToRead="12 min"
    >
      <p>
        Quase todo código real é <strong>assíncrono</strong> — chamadas de rede, leitura de arquivo, banco de dados, timers. Em Dart, &quot;assíncrono&quot; significa que a função não devolve o resultado imediatamente; ela devolve uma <strong>promessa</strong> de que o valor chegará depois. Essa promessa é o <code>Future</code>. Quando os valores chegam <em>vários ao longo do tempo</em> (como mensagens de chat), usamos <code>Stream</code> — uma torneira que pinga eventos. Testar esse tipo de código exige matchers e técnicas específicas.
      </p>

      <h2>Recapitulando: Future em uma frase</h2>
      <p>
        Pense num <code>Future&lt;String&gt;</code> como um cupom de retirada de pedido. Você recebe o cupom na hora (rápido), mas o lanche (a <code>String</code>) só fica pronto depois. Para esperar, usamos <code>await</code>. Em testes, podemos esperar do mesmo jeito ou usar matchers que fazem isso por nós.
      </p>
      <pre><code>{`Future<String> buscarSaudacao() async {
  await Future.delayed(const Duration(milliseconds: 100));
  return 'Olá';
}`}</code></pre>

      <h2>Testando Future com async/await</h2>
      <p>
        A forma mais direta: marque o teste como <code>async</code>, use <code>await</code> e compare normalmente. O runner espera o teste terminar antes de marcar verde:
      </p>
      <pre><code>{`import 'package:test/test.dart';

void main() {
  test('buscarSaudacao retorna Olá', () async {
    final resultado = await buscarSaudacao();
    expect(resultado, equals('Olá'));
  });
}`}</code></pre>

      <h2>Matcher completion: deixar o expect esperar</h2>
      <p>
        Outra forma é entregar o <code>Future</code> direto ao <code>expect</code> com o matcher <code>completion(...)</code>. Importante: nesse caso use <code>expectLater</code> + <code>await</code>, ou volte o <code>Future</code> da função de teste para o runner saber que precisa aguardar:
      </p>
      <pre><code>{`test('completion espera o Future', () async {
  await expectLater(buscarSaudacao(), completion(equals('Olá')));
});

test('throwsA captura erro lançado depois', () async {
  Future<int> falhar() async => throw StateError('boom');
  await expectLater(falhar(), throwsA(isA<StateError>()));
});`}</code></pre>

      <AlertBox type="warning" title="Não esqueça o await">
        Se você escrever <code>expectLater(...)</code> sem <code>await</code> dentro de teste async, o teste passa antes do Future resolver — bug silencioso. Sempre <code>await</code> em <code>expectLater</code>.
      </AlertBox>

      <h2>Testando Stream</h2>
      <p>
        Um <code>Stream</code> é uma sequência de eventos no tempo. Testar exige verificar a <em>ordem</em> e o <em>conteúdo</em> dos eventos. O matcher <code>emitsInOrder</code> compara uma lista de valores esperados com o que vai saindo:
      </p>
      <pre><code>{`Stream<int> contagemRegressiva(int de) async* {
  for (var i = de; i >= 0; i--) {
    await Future.delayed(const Duration(milliseconds: 10));
    yield i;
  }
}

test('emite 3, 2, 1, 0 e fecha', () async {
  await expectLater(
    contagemRegressiva(3),
    emitsInOrder([3, 2, 1, 0, emitsDone]),
  );
});

test('captura erro no meio do stream', () async {
  Stream<int> ruim() async* {
    yield 1;
    throw 'falha';
  }
  await expectLater(ruim(), emitsInOrder([1, emitsError('falha')]));
});`}</code></pre>
      <p>
        <code>emitsDone</code> verifica que o stream terminou normalmente; <code>emitsError</code> casa com erros emitidos.
      </p>

      <h2>fakeAsync: dominando o tempo</h2>
      <p>
        Esperar <code>Future.delayed(Duration(seconds: 5))</code> num teste seria absurdo. O pacote <code>fake_async</code> congela o relógio do Dart e permite avançar segundos virtuais instantaneamente — testes voam.
      </p>
      <pre><code>{`# Adicione ao pubspec
dart pub add --dev fake_async`}</code></pre>
      <pre><code>{`import 'package:fake_async/fake_async.dart';
import 'package:test/test.dart';

test('debounce só dispara após 500ms parados', () {
  fakeAsync((async) {
    var disparou = false;
    Timer(const Duration(milliseconds: 500), () => disparou = true);

    async.elapse(const Duration(milliseconds: 200));
    expect(disparou, isFalse); // ainda não passou tempo suficiente

    async.elapse(const Duration(milliseconds: 400));
    expect(disparou, isTrue);  // total 600ms — disparou
  });
});`}</code></pre>

      <AlertBox type="info" title="Por que tempo virtual?">
        Tempo real torna o teste lento e <em>flaky</em> (falha às vezes em CI por causa de carga da máquina). Tempo virtual roda em microssegundos e é 100% determinístico.
      </AlertBox>

      <h2>Timeouts: protegendo contra travamento</h2>
      <p>
        Se um <code>Future</code> nunca resolve (bug), o teste ficaria preso. Configure timeout explícito:
      </p>
      <pre><code>{`test('busca dentro de 2 segundos', () async {
  final r = await buscarSaudacao();
  expect(r, isNotNull);
}, timeout: const Timeout(Duration(seconds: 2)));

// Para o arquivo inteiro:
// dart test --timeout=5x`}</code></pre>

      <h2>Testando funções que devolvem stream e future juntos</h2>
      <pre><code>{`Future<int> contar(Stream<int> entrada) async {
  var total = 0;
  await for (final n in entrada) {
    total += n;
  }
  return total;
}

test('soma todos os eventos do stream', () async {
  final s = Stream.fromIterable([1, 2, 3, 4]);
  await expectLater(contar(s), completion(equals(10)));
});`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>await</code></strong> num <code>expectLater</code>: o teste passa cedo demais.</li>
        <li><strong>Não retornar Future</strong> de uma função de teste sem <code>async</code>: o runner não espera.</li>
        <li><strong>Usar <code>sleep</code> ou <code>Future.delayed</code> reais</strong> para esperar eventos: troque por <code>fakeAsync</code>.</li>
        <li><strong>Esquecer <code>emitsDone</code></strong> em testes de stream finitos: você não confirma que o stream terminou.</li>
        <li><strong>Não tratar <code>throwsA</code></strong> com <code>await</code>: a exceção escapa e quebra o runner.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Testes async usam <code>async</code> + <code>await</code> normalmente.</li>
        <li><code>expectLater</code> + <code>completion</code>/<code>throwsA</code> é a forma matcher de testar Future.</li>
        <li><code>emitsInOrder([...])</code> verifica sequência de eventos de Stream.</li>
        <li><code>fakeAsync</code> elimina esperas reais — o tempo vira virtual e instantâneo.</li>
        <li>Defina <code>timeout</code> em testes que podem travar.</li>
      </ul>
    </PageContainer>
  );
}
