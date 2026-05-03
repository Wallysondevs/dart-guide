import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TestPackage() {
  return (
    <PageContainer
      title="Testes unitários com o package test"
      subtitle="Aprenda a escrever testes automatizados em Dart usando o pacote oficial test — a base de toda suíte de testes profissional."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Imagine que você é um chef e cada receita do seu restaurante precisa sair igual todo dia. Você não vai provar cada prato sozinho — você cria <strong>provadores automáticos</strong> que conferem temperatura, sal, ponto. Em programação, esses provadores são <strong>testes unitários</strong>: pequenos programas que executam o seu código com entradas conhecidas e verificam se a saída bate com o esperado. O <code>package:test</code> é a ferramenta oficial do Dart para escrevê-los.
      </p>

      <h2>Instalando o pacote</h2>
      <p>
        Em Dart, dependências ficam declaradas em <code>pubspec.yaml</code>. Pacotes que só servem para desenvolvimento (como ferramentas de teste) vão na seção <code>dev_dependencies</code> — assim eles não viajam para produção. Use o CLI:
      </p>
      <pre><code>{`# Adiciona test como dependência de desenvolvimento
dart pub add --dev test

# Confirma que está instalado
dart pub get`}</code></pre>
      <p>
        Por convenção, todos os arquivos de teste ficam na pasta <code>test/</code> e terminam em <code>_test.dart</code>. O runner do Dart procura exatamente esse padrão.
      </p>

      <h2>Anatomia de um teste</h2>
      <p>
        Um teste tem três partes — <em>Arrange</em> (prepare os dados), <em>Act</em> (execute o código) e <em>Assert</em> (verifique o resultado). É o ciclo "AAA". O <code>test()</code> recebe uma descrição em texto e uma função que faz tudo isso:
      </p>
      <pre><code>{`// Arquivo: test/calculadora_test.dart
import 'package:test/test.dart';

int somar(int a, int b) => a + b;

void main() {
  test('somar deve retornar a soma de dois inteiros', () {
    // Arrange: preparamos as entradas
    const a = 2;
    const b = 3;
    // Act: chamamos a função
    final resultado = somar(a, b);
    // Assert: comparamos com o esperado
    expect(resultado, equals(5));
  });
}`}</code></pre>
      <p>
        Para rodar, no terminal: <code>dart test</code>. Você verá <code>+1: All tests passed!</code> em verde. Se algo falhar, aparece em vermelho com a diferença exata entre o que veio e o que era esperado.
      </p>

      <h2>Matchers: o vocabulário das verificações</h2>
      <p>
        <code>equals(5)</code> é um <strong>matcher</strong> — uma frase que descreve "como" o valor deve ser. O pacote vem com dezenas deles:
      </p>
      <pre><code>{`import 'package:test/test.dart';

void main() {
  test('matchers comuns', () {
    expect(2 + 2, equals(4));               // igualdade
    expect('flutter', isA<String>());        // tipo
    expect([1, 2, 3], contains(2));          // contém elemento
    expect([], isEmpty);                     // lista vazia
    expect(null, isNull);                    // é nulo
    expect('algo', isNotNull);               // não é nulo
    expect(3.14, closeTo(3.14, 0.01));       // ponto flutuante com tolerância
    expect(() => int.parse('xyz'),           // lança exceção
        throwsA(isA<FormatException>()));
  });
}`}</code></pre>

      <AlertBox type="info" title="Por que usar matchers em vez de if?">
        Você poderia escrever <code>if (resultado != 5) throw 'erro'</code>. Funciona, mas a mensagem de falha seria horrível. Matchers geram mensagens claras como <em>&quot;Expected: &lt;5&gt; Actual: &lt;6&gt;&quot;</em>, mostrando exatamente o que deu errado.
      </AlertBox>

      <h2>group, setUp e tearDown</h2>
      <p>
        Quando você tem vários testes parecidos, agrupe-os com <code>group()</code>. E se todos precisam preparar a mesma coisa (abrir um banco fake, criar um objeto), use <code>setUp()</code> — ele roda <strong>antes de cada</strong> teste do grupo. <code>tearDown()</code> roda <strong>depois</strong>, ideal para fechar conexões ou limpar arquivos:
      </p>
      <pre><code>{`import 'package:test/test.dart';

class Carrinho {
  final List<String> itens = [];
  void adicionar(String item) => itens.add(item);
  int get total => itens.length;
}

void main() {
  group('Carrinho', () {
    late Carrinho carrinho;

    setUp(() {
      // Roda antes de cada teste — começa sempre limpo
      carrinho = Carrinho();
    });

    tearDown(() {
      // Roda depois de cada teste — limpa recursos
      carrinho.itens.clear();
    });

    test('começa vazio', () {
      expect(carrinho.total, equals(0));
    });

    test('adicionar incrementa o total', () {
      carrinho.adicionar('café');
      carrinho.adicionar('pão');
      expect(carrinho.total, equals(2));
    });
  });
}`}</code></pre>

      <h2>Rodando os testes</h2>
      <pre><code>{`# Roda todos os testes da pasta test/
dart test

# Roda um arquivo específico
dart test test/carrinho_test.dart

# Roda só testes que casam com o nome
dart test --name 'adicionar'

# Mostra saída detalhada (verbose)
dart test -r expanded

# Em projetos Flutter, troque por:
flutter test`}</code></pre>

      <AlertBox type="warning" title="late significa &quot;preencho depois&quot;">
        A palavra <code>late</code> diz ao Dart: &quot;esta variável vai receber valor antes de ser usada&quot;. Sem isso, o compilador reclamaria que <code>carrinho</code> não foi inicializada na declaração. Usar <code>late</code> + <code>setUp</code> é o padrão idiomático.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o sufixo <code>_test.dart</code></strong>: o runner ignora o arquivo silenciosamente.</li>
        <li><strong>Compartilhar estado entre testes</strong>: variáveis globais sem reset deixam um teste influenciar o outro. Use <code>setUp</code>.</li>
        <li><strong>Testar implementação em vez de comportamento</strong>: bom teste descreve <em>o que</em> a função faz, não <em>como</em>.</li>
        <li><strong>Ignorar testes que falham &quot;de vez em quando&quot;</strong>: testes flaky escondem bugs reais. Investigue.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dart pub add --dev test</code> instala o pacote.</li>
        <li>Arquivos terminam em <code>_test.dart</code> e ficam em <code>test/</code>.</li>
        <li><code>test()</code> declara um caso; <code>group()</code> agrupa; <code>setUp/tearDown</code> preparam/limpam.</li>
        <li><code>expect(valor, matcher)</code> é o coração da verificação.</li>
        <li>Rode com <code>dart test</code> (ou <code>flutter test</code> em apps Flutter).</li>
      </ul>
    </PageContainer>
  );
}
