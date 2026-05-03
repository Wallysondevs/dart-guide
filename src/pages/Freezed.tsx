import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Freezed() {
  return (
    <PageContainer
      title="freezed: classes imutáveis com superpoderes"
      subtitle="Pare de escrever copyWith, equals e hashCode na mão. O freezed gera tudo a partir de uma única declaração — e ainda dá uniões seladas para modelar estados."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        Em Dart, modelar um objeto de domínio — um <code>Usuario</code>, um <code>Pedido</code>, um <code>Estado</code> de tela — costuma significar escrever 60 linhas de código repetitivo: campos, construtor, <code>copyWith</code>, <code>==</code>, <code>hashCode</code>, <code>toString</code>, <code>fromJson</code>. É mecânico e cheio de bugs sutis (esqueceu um campo no <code>copyWith</code>? Adeus). O <strong>freezed</strong> gera tudo isso a partir de uma declaração curta. Pense nele como uma máquina de costura: você desenha o molde, ela costura cada peça igualzinha, sem furar o dedo.
      </p>

      <h2>O que é &quot;imutável&quot;?</h2>
      <p>
        Uma classe é <strong>imutável</strong> quando seus campos não podem ser alterados depois de criados. Em vez de mudar um objeto, você cria uma cópia nova com a mudança. Isso evita bugs de estado compartilhado (alguém alterar seu objeto sem você saber) e funciona maravilhosamente com Flutter, que prefere reconstruir a mutar.
      </p>

      <h2>Instalando</h2>
      <pre><code>{`dart pub add freezed_annotation
dart pub add json_annotation
dart pub add --dev build_runner
dart pub add --dev freezed
dart pub add --dev json_serializable`}</code></pre>

      <h2>Primeira classe freezed</h2>
      <pre><code>{`// lib/usuario.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'usuario.freezed.dart';
part 'usuario.g.dart';

@freezed
class Usuario with _\$Usuario {
  const factory Usuario({
    required int id,
    required String nome,
    String? avatar,
    @Default(false) bool ativo,
  }) = _Usuario;

  factory Usuario.fromJson(Map<String, dynamic> json) =>
      _\$UsuarioFromJson(json);
}`}</code></pre>
      <p>
        Em troca dessas 12 linhas, depois de rodar <code>dart run build_runner build</code> você ganha:
      </p>
      <ul>
        <li>Construtor com parâmetros nomeados e <code>required</code>.</li>
        <li><code>copyWith</code> que aceita só os campos a mudar.</li>
        <li><code>==</code> e <code>hashCode</code> que comparam campo a campo.</li>
        <li><code>toString</code> com saída legível tipo <code>Usuario(id: 1, nome: ada, ...)</code>.</li>
        <li><code>fromJson</code> e <code>toJson</code> serializando para mapas.</li>
      </ul>

      <h2>Usando no dia a dia</h2>
      <pre><code>{`void main() {
  // Construção
  const ada = Usuario(id: 1, nome: 'Ada');

  // copyWith — cria nova instância com mudanças
  final adaPro = ada.copyWith(ativo: true, avatar: 'a.png');

  // Igualdade estrutural
  print(ada == const Usuario(id: 1, nome: 'Ada')); // true

  // toString legível
  print(adaPro);
  // Usuario(id: 1, nome: Ada, avatar: a.png, ativo: true)

  // Serialização
  final json = adaPro.toJson();
  final volta = Usuario.fromJson(json);
  print(volta == adaPro); // true
}`}</code></pre>

      <AlertBox type="info" title="@Default vs required">
        Use <code>required</code> quando o campo é obrigatório (sem padrão sensato). Use <code>@Default(valor)</code> quando faz sentido um valor inicial — assim o chamador pode omitir.
      </AlertBox>

      <h2>Uniões seladas (sealed unions)</h2>
      <p>
        Aqui o freezed brilha. Imagine modelar o estado de uma chamada de API: pode estar <em>carregando</em>, <em>com sucesso</em> (e tem dado), ou <em>com erro</em> (e tem mensagem). Com freezed, isso vira:
      </p>
      <pre><code>{`// lib/result.dart
import 'package:freezed_annotation/freezed_annotation.dart';

part 'result.freezed.dart';

@freezed
sealed class Result<T> with _\$Result<T> {
  const factory Result.loading() = Loading<T>;
  const factory Result.success(T data) = Success<T>;
  const factory Result.error(String message) = Failure<T>;
}`}</code></pre>
      <p>
        Agora qualquer função pode devolver <code>Result&lt;Usuario&gt;</code>. O Dart 3 com <code>sealed</code> + <code>switch</code> exige que você trate todos os casos — o compilador avisa se esquecer um:
      </p>
      <pre><code>{`Widget build(Result<Usuario> r) {
  return switch (r) {
    Loading()      => const CircularProgressIndicator(),
    Success(:final data)    => Text('Olá, \${data.nome}!'),
    Failure(:final message) => Text('Erro: \${message}'),
  };
}`}</code></pre>
      <p>
        Isso é &quot;exhaustiveness check&quot;: o compilador <strong>garante</strong> que você não esquece um caso. Se amanhã você adicionar <code>Result.empty()</code>, todo <code>switch</code> sem o caso passa a quebrar — segurança imensa.
      </p>

      <AlertBox type="info" title="O que é sealed class?">
        Uma classe <code>sealed</code> só pode ser herdada dentro do mesmo arquivo. Isso fecha o conjunto de subtipos possíveis, permitindo ao compilador conferir que seu <code>switch</code> cobre todos. Pense numa caixa lacrada: ninguém vai meter uma variante surpresa de fora.
      </AlertBox>

      <h2>Métodos extras: when e map</h2>
      <p>
        Antes do <code>switch</code> exaustivo do Dart 3, o freezed oferecia <code>when</code> e <code>map</code> — ainda úteis em alguns casos:
      </p>
      <pre><code>{`final r = Result<int>.success(42);

// when: trata cada caso passando os dados
final texto = r.when(
  loading: () => 'carregando...',
  success: (data) => 'valor: \${data}',
  error: (msg) => 'falhou: \${msg}',
);

// maybeWhen: você só lida com alguns
final ehSucesso = r.maybeWhen(
  success: (_) => true,
  orElse: () => false,
);`}</code></pre>

      <h2>Customizando: methods, getters e validações</h2>
      <p>
        Para adicionar lógica, use o <strong>truque do construtor privado</strong>: declare um <code>const Usuario._();</code> e adicione getters/métodos como uma classe normal:
      </p>
      <pre><code>{`@freezed
class Usuario with _\$Usuario {
  const Usuario._();      // <- libera adicionar membros customizados

  const factory Usuario({
    required int id,
    required String nome,
    required String email,
  }) = _Usuario;

  // Getter calculado
  bool get emailValido => email.contains('@');

  // Método de domínio
  String saudar() => 'Olá, \${nome}!';
}`}</code></pre>

      <h2>Gerando o código</h2>
      <pre><code>{`# Geração única
dart run build_runner build --delete-conflicting-outputs

# Modo watch (regenera ao salvar)
dart run build_runner watch`}</code></pre>

      <AlertBox type="warning" title="Sempre rode build_runner">
        Erros tipo &quot;_$Usuario undefined&quot; ou &quot;Usuario.fromJson is not a function&quot; quase sempre significam: o build não rodou. Resposta: <code>dart run build_runner build</code>.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer <code>part &apos;arquivo.freezed.dart&apos;;</code></strong>: o gerador roda mas o Dart não vê o código.</li>
        <li><strong>Tentar adicionar campo no <code>_();</code> sem <code>part</code></strong>: erro de compilação.</li>
        <li><strong>Usar <code>final</code> dentro do factory</strong>: não precisa, freezed já torna tudo final.</li>
        <li><strong>Editar <code>.freezed.dart</code></strong>: é regenerado e suas mudanças somem.</li>
        <li><strong>Esquecer <code>sealed</code></strong> ao querer switch exaustivo: o Dart não vai obrigar a cobrir os casos.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>@freezed</code> gera construtor, <code>copyWith</code>, <code>==</code>, <code>hashCode</code>, <code>toString</code> e JSON.</li>
        <li>Use <code>sealed</code> para uniões com switch exaustivo do Dart 3.</li>
        <li>Adicione lógica via construtor privado <code>const Foo._();</code>.</li>
        <li>Combine com <code>json_serializable</code> via <code>part &apos;...g.dart&apos;</code>.</li>
        <li>Sempre rode <code>build_runner build</code> (ou <code>watch</code>) após alterar a classe.</li>
      </ul>
    </PageContainer>
  );
}
