import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FfiBasico() {
  return (
    <PageContainer
      title="FFI: chamando código C/C++ a partir do Dart"
      subtitle="Saiba como o Dart conversa diretamente com bibliotecas nativas usando dart:ffi — performance bare-metal e acesso a APIs do sistema."
      difficulty="avancado"
      timeToRead="14 min"
    >
      <p>
        Imagine que você fala português, mas precisa trocar mensagens rápidas com um colega que só fala C — uma linguagem mais antiga, mais rápida, capaz de mexer diretamente com a memória do computador. Você precisa de um <strong>tradutor</strong>. Em Dart, esse tradutor é o <code>dart:ffi</code>: a Foreign Function Interface (interface para funções estrangeiras). Com ela, você carrega uma biblioteca compilada (<code>.so</code> no Linux, <code>.dll</code> no Windows, <code>.dylib</code> no macOS) e chama suas funções como se fossem Dart puro. Sem servidor intermediário, sem JSON, sem rede — chamada direta.
      </p>

      <h2>Por que usar FFI?</h2>
      <ul>
        <li><strong>Performance</strong>: cálculos pesados (criptografia, processamento de imagem, ML) já existem em C otimizado.</li>
        <li><strong>Reuso</strong>: usar bibliotecas maduras (SQLite, libcurl, OpenCV) sem reescrever em Dart.</li>
        <li><strong>APIs de sistema</strong>: chamar funções do SO que não têm wrapper Dart pronto.</li>
        <li><strong>Plugins Flutter</strong>: muitos plugins (sqflite, sound, GPU) usam FFI por baixo.</li>
      </ul>

      <h2>Anatomia geral</h2>
      <pre><code>{`Você (Dart)
   ↓
dart:ffi
   ↓
DynamicLibrary.open('libsoma.so')
   ↓
lookupFunction<C_signature, Dart_signature>('soma')
   ↓
Função C compilada — soma(int, int) -> int`}</code></pre>
      <p>
        São três passos: abrir a lib, buscar o símbolo da função, chamá-la. Vamos colocar em prática.
      </p>

      <h2>Exemplo: somando dois inteiros em C</h2>
      <p>
        Primeiro, escreva e compile a parte C. Salve como <code>soma.c</code>:
      </p>
      <pre><code>{`// soma.c
#include <stdint.h>

int32_t soma(int32_t a, int32_t b) {
    return a + b;
}`}</code></pre>
      <p>Compile como biblioteca compartilhada:</p>
      <pre><code>{`# Linux
gcc -shared -fPIC -o libsoma.so soma.c

# macOS
gcc -shared -fPIC -o libsoma.dylib soma.c

# Windows (com mingw)
gcc -shared -o soma.dll soma.c`}</code></pre>

      <h2>Chamando do Dart</h2>
      <pre><code>{`// bin/main.dart
import 'dart:ffi';
import 'dart:io' show Platform;
import 'package:ffi/ffi.dart'; // utilitários (malloc, Utf8)

// 1. Definir os tipos da função em C e em Dart
typedef SomaC = Int32 Function(Int32 a, Int32 b);
typedef SomaDart = int Function(int a, int b);

void main() {
  // 2. Abrir a biblioteca correta para o SO
  final libPath = Platform.isMacOS
      ? 'libsoma.dylib'
      : Platform.isWindows
          ? 'soma.dll'
          : 'libsoma.so';
  final lib = DynamicLibrary.open(libPath);

  // 3. Buscar o símbolo 'soma' e mapear pra função Dart
  final soma = lib.lookupFunction<SomaC, SomaDart>('soma');

  // 4. Usar normalmente
  print(soma(10, 32)); // 42
}`}</code></pre>

      <AlertBox type="info" title="Por que dois typedefs?">
        Em FFI você descreve a função duas vezes: a assinatura <em>como ela existe em C</em> (com tipos como <code>Int32</code>) e <em>como será exposta no Dart</em> (com <code>int</code>). O ponto é: C distingue tamanhos (Int8, Int16, Int32, Int64), Dart usa só <code>int</code>. O par diz pro runtime como traduzir.
      </AlertBox>

      <h2>Trabalhando com strings (Pointer&lt;Utf8&gt;)</h2>
      <p>
        Strings são o ponto mais delicado. Em C, string é um ponteiro para bytes terminado em <code>\0</code>. O pacote <code>package:ffi</code> traz utilitários:
      </p>
      <pre><code>{`// hello.c
#include <string.h>
const char* saudacao(const char* nome) {
    static char buffer[256];
    snprintf(buffer, sizeof(buffer), "Olá, %s!", nome);
    return buffer;
}`}</code></pre>
      <pre><code>{`import 'dart:ffi';
import 'package:ffi/ffi.dart';

typedef SaudacaoC = Pointer<Utf8> Function(Pointer<Utf8>);
typedef SaudacaoDart = Pointer<Utf8> Function(Pointer<Utf8>);

void main() {
  final lib = DynamicLibrary.open('libhello.so');
  final saudacao = lib.lookupFunction<SaudacaoC, SaudacaoDart>('saudacao');

  // Aloca string C a partir de String Dart
  final nomePtr = 'Ada'.toNativeUtf8();
  final resultado = saudacao(nomePtr);

  // Converte ponteiro de volta para String Dart
  print(resultado.toDartString()); // Olá, Ada!

  // SEMPRE liberar memória alocada manualmente
  malloc.free(nomePtr);
}`}</code></pre>

      <AlertBox type="warning" title="Gerenciamento de memória manual">
        Em Dart puro o garbage collector cuida de tudo. Em FFI, você está num território sem GC: tudo que <code>malloc</code> alocou precisa de <code>free</code>. Esquecer = vazamento. Liberar duas vezes = crash. Use <code>try/finally</code> sempre que possível.
      </AlertBox>

      <h2>Padrão seguro com try/finally</h2>
      <pre><code>{`String gerarSaudacao(String nome) {
  final ptr = nome.toNativeUtf8();
  try {
    final resultado = saudacao(ptr);
    return resultado.toDartString();
  } finally {
    malloc.free(ptr);
  }
}`}</code></pre>

      <h2>Tipos primitivos disponíveis</h2>
      <pre><code>{`// Inteiros com sinal
Int8, Int16, Int32, Int64
// Inteiros sem sinal
Uint8, Uint16, Uint32, Uint64
// Pontos flutuantes
Float (32 bits), Double (64 bits)
// Tipos de tamanho dependente da plataforma
IntPtr, UintPtr, Size
// Sem retorno
Void
// Ponteiros
Pointer<T>`}</code></pre>

      <h2>Quando NÃO usar FFI</h2>
      <ul>
        <li><strong>Lógica simples</strong>: o overhead de manter C + Dart raramente compensa.</li>
        <li><strong>Existe pacote pure-Dart</strong>: prefira ele — multiplataforma sem dor.</li>
        <li><strong>Web</strong>: <code>dart:ffi</code> não funciona em Flutter Web. Use <code>js_interop</code>.</li>
        <li><strong>Hot reload</strong>: muito código FFI quebra hot reload no Flutter; prefira hot restart.</li>
      </ul>

      <h2>Empacotando uma lib nativa em plugin Flutter</h2>
      <p>
        No Flutter, você gera o esqueleto com <code>flutter create --template=plugin_ffi nome</code>. O comando cria o esqueleto C + glue Dart + configuração de build (CMake para Android, Pods para iOS) — o jeito profissional de distribuir uma lib FFI multiplataforma.
      </p>
      <pre><code>{`flutter create --template=plugin_ffi --platforms=android,ios,linux,macos,windows minha_lib`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Lib não encontrada</strong>: o nome ou caminho está errado, ou ela não está no <code>LD_LIBRARY_PATH</code>.</li>
        <li><strong>Tipos C/Dart desalinhados</strong>: <code>Int32</code> em vez de <code>Int64</code> = corrupção silenciosa.</li>
        <li><strong>Esquecer <code>free</code></strong>: vazamento progressivo.</li>
        <li><strong>Liberar string que veio do C</strong>: se a função retornou ponteiro estático, você não deve liberar.</li>
        <li><strong>Bloquear isolate</strong>: chamadas FFI longas travam o thread; use isolates ou async helpers.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dart:ffi</code> + <code>package:ffi</code> permitem chamar C/C++ direto do Dart.</li>
        <li>Fluxo: <code>DynamicLibrary.open</code> → <code>lookupFunction</code> → invocar.</li>
        <li>Tipos C explícitos (<code>Int32</code>, <code>Pointer&lt;Utf8&gt;</code>) traduzem para tipos Dart.</li>
        <li>Use <code>malloc</code>/<code>free</code> com <code>try/finally</code> — sem GC nessa zona.</li>
        <li>Para distribuir, use <code>flutter create --template=plugin_ffi</code>.</li>
      </ul>
    </PageContainer>
  );
}
