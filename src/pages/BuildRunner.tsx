import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function BuildRunner() {
  return (
    <PageContainer
      title="build_runner: geradores de código em Dart"
      subtitle="A engrenagem por trás de freezed, json_serializable e mockito — entenda como Dart escreve código pra você."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Imagine que você escreveria 200 linhas de código repetitivo (converter JSON em classe, comparar objetos, criar mocks) toda vez que precisasse. Em Dart, há uma solução elegante: você escreve uma <em>anotação</em> indicando o que quer (<code>@JsonSerializable()</code>, <code>@freezed</code>) e um programa lê seu código, aplica regras e <strong>gera o resto automaticamente</strong>. Esse programa é o <code>build_runner</code> — o motor universal de geração de código do ecossistema Dart.
      </p>

      <h2>O modelo: anotações + geradores</h2>
      <p>
        Você escreve a parte interessante do código. Geradores leem suas classes, encontram anotações conhecidas e produzem arquivos <code>.g.dart</code> ou <code>.freezed.dart</code> contendo código pronto. O <code>build_runner</code> é o orquestrador que descobre quais geradores rodar, em que ordem, e em quais arquivos.
      </p>
      <pre><code>{`# Adicione build_runner como dev dependency
dart pub add --dev build_runner

# Mais o gerador específico que você quer (ex.: json_serializable)
dart pub add json_annotation
dart pub add --dev json_serializable`}</code></pre>

      <h2>Exemplo 1: json_serializable</h2>
      <p>
        Converter manualmente JSON para classe é tedioso e propenso a erros. Com <code>json_serializable</code>, você descreve a classe e ele gera <code>fromJson</code>/<code>toJson</code>:
      </p>
      <pre><code>{`// lib/usuario.dart
import 'package:json_annotation/json_annotation.dart';

// O 'part' anuncia que o código gerado vive ao lado
part 'usuario.g.dart';

@JsonSerializable()
class Usuario {
  final int id;
  final String nome;
  @JsonKey(name: 'created_at')
  final DateTime criadoEm;

  Usuario({required this.id, required this.nome, required this.criadoEm});

  // O método delega ao código gerado
  factory Usuario.fromJson(Map<String, dynamic> json) =>
      _\$UsuarioFromJson(json);
  Map<String, dynamic> toJson() => _\$UsuarioToJson(this);
}`}</code></pre>
      <p>
        Note os símbolos <code>_$UsuarioFromJson</code> e <code>_$UsuarioToJson</code> — eles ainda <em>não existem</em>. Eles serão criados quando você rodar o build:
      </p>
      <pre><code>{`# Gera todos os arquivos .g.dart uma vez
dart run build_runner build

# Em projetos Flutter:
flutter pub run build_runner build`}</code></pre>
      <p>
        Após rodar, aparece o arquivo <code>lib/usuario.g.dart</code> com o código gerado. Não edite esse arquivo — ele será sobrescrito.
      </p>

      <h2>Modo watch: geração contínua</h2>
      <p>
        Em desenvolvimento, ficar rodando o build manualmente é chato. Use o modo <code>watch</code> para regerar automaticamente sempre que um arquivo fonte muda:
      </p>
      <pre><code>{`dart run build_runner watch

# Saída:
# [INFO] Generating build script completed, took 350ms
# [INFO] Reading cached asset graph completed, took 80ms
# [INFO] watch: Now watching for changes...`}</code></pre>

      <AlertBox type="info" title="O que é uma anotação?">
        Anotações começam com <code>@</code> e são metadados — informações sobre o código que outros programas (como o build_runner) leem. Não fazem nada por si sós; são como adesivos colados na classe dizendo &quot;trate-me especialmente&quot;.
      </AlertBox>

      <h2>Exemplo 2: freezed (resumo)</h2>
      <p>
        O <code>freezed</code> gera classes imutáveis com <code>copyWith</code>, <code>==</code>, <code>hashCode</code>, e suporte a uniões seladas. Sintaxe rápida:
      </p>
      <pre><code>{`import 'package:freezed_annotation/freezed_annotation.dart';

part 'pessoa.freezed.dart';
part 'pessoa.g.dart';

@freezed
class Pessoa with _\$Pessoa {
  const factory Pessoa({
    required String nome,
    required int idade,
  }) = _Pessoa;

  factory Pessoa.fromJson(Map<String, Object?> json) =>
      _\$PessoaFromJson(json);
}`}</code></pre>
      <p>
        Após <code>build_runner build</code>, você ganha de graça: construtor, getters, <code>copyWith</code>, igualdade estrutural, <code>toString</code> bonito e serialização JSON.
      </p>

      <h2>Exemplo 3: mockito com geração de mocks</h2>
      <pre><code>{`// test/exemplo_test.dart
import 'package:mockito/annotations.dart';
import 'package:mockito/mockito.dart';
import 'exemplo_test.mocks.dart';

abstract class Repo { Future<int> count(); }

@GenerateMocks([Repo])
void main() {
  test('mock gerado', () async {
    final mock = MockRepo();           // <- classe gerada
    when(mock.count()).thenAnswer((_) async => 42);
    expect(await mock.count(), 42);
  });
}`}</code></pre>

      <h2>Lidando com conflitos</h2>
      <p>
        Quando geradores divergem (versão mudou, arquivo gerado obsoleto), o build pode falhar com mensagens de &quot;conflicting outputs&quot;. Use a flag <code>--delete-conflicting-outputs</code> para apagar e regerar:
      </p>
      <pre><code>{`dart run build_runner build --delete-conflicting-outputs`}</code></pre>

      <AlertBox type="warning" title="Não commitar arquivos gerados?">
        Há duas escolas. Algumas equipes commitam <code>*.g.dart</code> e <code>*.freezed.dart</code> (assim CI não precisa rodar gerador). Outras adicionam ao <code>.gitignore</code> e rodam build no CI. Prefira commitar — diffs ficam visíveis e PRs mais transparentes.
      </AlertBox>

      <h2>Configurando o build (build.yaml)</h2>
      <p>
        Em projetos grandes você pode controlar quais geradores rodam, em quais pastas, com quais opções:
      </p>
      <pre><code>{`# build.yaml na raiz
targets:
  $default:
    builders:
      json_serializable:
        options:
          field_rename: snake
          explicit_to_json: true
          create_factory: true`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>part &apos;arquivo.g.dart&apos;;</code></strong>: o gerador roda mas o arquivo não é referenciado.</li>
        <li><strong>Editar arquivo gerado</strong>: a próxima execução apaga sua mudança.</li>
        <li><strong>Versões incompatíveis entre annotation e generator</strong>: leia o changelog e alinhe.</li>
        <li><strong>Não rodar <code>build</code> antes de testar</strong>: erros &quot;_$Foo undefined&quot; são sintoma típico.</li>
        <li><strong>Não usar <code>watch</code> em desenvolvimento</strong>: você esquece de gerar e perde tempo.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>build_runner</code> orquestra geradores que escrevem código a partir de anotações.</li>
        <li><code>dart run build_runner build</code> gera uma vez; <code>watch</code> regenera continuamente.</li>
        <li>Use <code>part &apos;...g.dart&apos;</code> para referenciar arquivos gerados.</li>
        <li>Geradores populares: <code>json_serializable</code>, <code>freezed</code>, <code>mockito</code>, <code>retrofit</code>, <code>auto_route</code>.</li>
        <li><code>--delete-conflicting-outputs</code> resolve conflitos de geração.</li>
      </ul>
    </PageContainer>
  );
}
