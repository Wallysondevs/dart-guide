import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Mocktail() {
  return (
    <PageContainer
      title="Mocktail: mocks sem code-gen"
      subtitle="Crie objetos de mentirinha (mocks) para testar suas classes em isolamento — sem precisar rodar gerador de código."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Imagine testar um piloto de avião sem usar um avião de verdade — você usa um <strong>simulador</strong>. Em testes, queremos a mesma coisa: testar uma classe sem depender de banco de dados real, API real ou rede. Substituímos as dependências por <strong>mocks</strong>: objetos falsos que fingem ser o original e respondem como queremos. O <code>mocktail</code> é o pacote mais popular para isso em Dart, e a sua grande vantagem é não precisar de geração de código (nenhum <code>dart run build_runner</code>).
      </p>

      <h2>Instalação</h2>
      <pre><code>{`dart pub add --dev mocktail
dart pub add --dev test`}</code></pre>
      <p>
        Pronto. Você não precisa de anotações, nem de comando extra para gerar arquivo nenhum. Compare com <code>mockito</code>, o concorrente clássico, que exige <code>@GenerateMocks</code> + rodar <code>dart run build_runner build</code> toda vez que o contrato muda.
      </p>

      <h2>Criando seu primeiro mock</h2>
      <p>
        Suponha que você tem um serviço que busca usuários numa API. Em produção ele faz HTTP; no teste, você quer um substituto controlável:
      </p>
      <pre><code>{`// lib/services/api_client.dart
abstract class ApiClient {
  Future<Map<String, dynamic>> getUser(int id);
}

// lib/services/usuario_service.dart
class UsuarioService {
  final ApiClient api;
  UsuarioService(this.api);

  Future<String> nomeDoUsuario(int id) async {
    final dados = await api.getUser(id);
    return dados['nome'] as String;
  }
}`}</code></pre>
      <p>
        Agora o teste. Criamos <code>MockApiClient</code> estendendo <code>Mock</code> e implementando o contrato <code>ApiClient</code>. O <code>Mock</code> intercepta todas as chamadas e responde com o que mandarmos via <code>when().thenReturn(...)</code>:
      </p>
      <pre><code>{`// test/usuario_service_test.dart
import 'package:mocktail/mocktail.dart';
import 'package:test/test.dart';

class MockApiClient extends Mock implements ApiClient {}

void main() {
  late MockApiClient api;
  late UsuarioService service;

  setUp(() {
    api = MockApiClient();
    service = UsuarioService(api);
  });

  test('nomeDoUsuario devolve o nome retornado pela API', () async {
    // Arrange: programamos o mock
    when(() => api.getUser(42))
        .thenAnswer((_) async => {'nome': 'Ada Lovelace'});

    // Act
    final nome = await service.nomeDoUsuario(42);

    // Assert: valor + verificação de chamada
    expect(nome, equals('Ada Lovelace'));
    verify(() => api.getUser(42)).called(1);
  });
}`}</code></pre>

      <AlertBox type="info" title="thenReturn vs thenAnswer">
        Use <code>thenReturn(valor)</code> para valores síncronos. Para <code>Future</code>, prefira <code>thenAnswer((_) async =&gt; valor)</code> — assim o mock devolve um <code>Future</code> de verdade e o <code>await</code> funciona naturalmente.
      </AlertBox>

      <h2>Verificando interações</h2>
      <p>
        Mocks não servem só para devolver valores — eles também <strong>gravam todas as chamadas</strong>. Use <code>verify</code> para confirmar que algo foi chamado, e <code>verifyNever</code> para garantir que não foi:
      </p>
      <pre><code>{`test('não chama a API quando o id é negativo', () async {
  // Arrange
  // (nenhum stub — qualquer chamada não programada lançará erro)

  // Act
  await service.nomeDoUsuario(-1).catchError((_) => '');

  // Assert
  verifyNever(() => api.getUser(any()));
});

test('captura argumentos passados', () async {
  when(() => api.getUser(any()))
      .thenAnswer((_) async => {'nome': 'X'});

  await service.nomeDoUsuario(7);
  await service.nomeDoUsuario(8);

  // Captura os ids passados em todas as chamadas
  final capturados = verify(() => api.getUser(captureAny())).captured;
  expect(capturados, equals([7, 8]));
});`}</code></pre>

      <h2>registerFallbackValue: para tipos complexos</h2>
      <p>
        Quando você usa matchers como <code>any()</code> com tipos não-primitivos (uma classe sua), o mocktail não sabe como criar um valor &quot;qualquer&quot; — você precisa registrar um <em>fallback</em> uma vez antes dos testes:
      </p>
      <pre><code>{`class Pedido {
  final int id;
  Pedido(this.id);
}

abstract class PedidoRepo {
  Future<void> salvar(Pedido p);
}

class MockPedidoRepo extends Mock implements PedidoRepo {}

void main() {
  setUpAll(() {
    // Registre uma vez para todos os testes
    registerFallbackValue(Pedido(0));
  });

  test('salva qualquer pedido', () async {
    final repo = MockPedidoRepo();
    when(() => repo.salvar(any())).thenAnswer((_) async {});

    await repo.salvar(Pedido(99));

    verify(() => repo.salvar(any())).called(1);
  });
}`}</code></pre>

      <AlertBox type="warning" title="Mocktail vs Mockito">
        O <code>mockito</code> precisa de geração de código com <code>build_runner</code> (anotações <code>@GenerateMocks</code>, arquivos <code>.mocks.dart</code>). O <code>mocktail</code> não precisa de nada disso — sintaxe mais limpa, ciclo de feedback rápido. Para projetos novos, prefira mocktail.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>registerFallbackValue</code></strong> ao usar <code>any()</code> com tipo customizado: dá erro em runtime.</li>
        <li><strong>Usar <code>thenReturn</code> com Future</strong>: o mock devolve o Future em si, não o valor; troque por <code>thenAnswer</code>.</li>
        <li><strong>Mockar classes concretas</strong>: prefira sempre programar para uma <code>abstract class</code> ou <code>interface</code>.</li>
        <li><strong>Verificar tudo</strong>: foque em interações importantes — testes cheios de <code>verify</code> ficam frágeis.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>mocktail</code> não precisa de geração de código — instale e use.</li>
        <li><code>class MockX extends Mock implements X &#123;&#125;</code> cria o mock.</li>
        <li><code>when(() =&gt; ...).thenAnswer(...)</code> programa o retorno.</li>
        <li><code>verify(() =&gt; ...).called(n)</code> confere chamadas; <code>verifyNever</code> garante ausência.</li>
        <li>Use <code>registerFallbackValue</code> quando matchers como <code>any()</code> recebem tipos complexos.</li>
      </ul>
    </PageContainer>
  );
}
