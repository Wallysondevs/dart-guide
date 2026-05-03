import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FinallyFlow() {
  return (
    <PageContainer
      title="finally e fluxo de controle em exceções"
      subtitle="O bloco que sempre executa — e as armadilhas sutis quando ele se mistura com return e throw."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <p>
        Imagine que você abriu uma torneira para encher um balde. Não importa se a água acabou, se o balde furou ou se você esqueceu o motivo — antes de sair da cozinha, você <em>tem</em> que fechar a torneira. Em código, esse &quot;fechar a torneira no final&quot; é o trabalho do bloco <code>finally</code>: ele garante que o passo de limpeza aconteça, dê certo ou dê errado.
      </p>

      <h2>O contrato do <code>finally</code></h2>
      <p>
        O <code>finally</code> sempre executa. Sempre mesmo. Os caminhos possíveis para o controle sair de um <code>try</code> são:
      </p>
      <ul>
        <li>O bloco terminou normalmente (caiu pra fora pelo &quot;fim natural&quot;).</li>
        <li>Houve <code>return</code> dentro do <code>try</code>.</li>
        <li>Foi lançada uma exceção que <em>foi</em> capturada por um <code>catch</code>.</li>
        <li>Foi lançada uma exceção que <em>não</em> foi capturada e está subindo a pilha.</li>
        <li>Houve <code>break</code> ou <code>continue</code> em um loop ao redor.</li>
      </ul>
      <p>
        Em todos esses casos, o <code>finally</code> roda <strong>antes</strong> do controle realmente sair.
      </p>
      <pre><code>{`int testar() {
  try {
    print('1: dentro do try');
    return 10; // o valor 10 fica "guardado" enquanto o finally roda
  } finally {
    print('2: dentro do finally');
  }
}

void main() {
  final r = testar();
  print('3: retornou \$r');
}

// Saida:
// 1: dentro do try
// 2: dentro do finally
// 3: retornou 10`}</code></pre>

      <h2>Liberando recursos: o caso de uso clássico</h2>
      <p>
        Recursos como arquivos abertos, conexões de banco e sockets precisam ser <strong>fechados explicitamente</strong>. Se você esquecer, o sistema operacional segura aquele recurso até o processo morrer (vazamento). <code>finally</code> garante o fechamento mesmo quando o &quot;caminho feliz&quot; foi interrompido por exceção.
      </p>
      <pre><code>{`import 'dart:io';

Future<int> contarBytes(String caminho) async {
  final raf = await File(caminho).open();
  try {
    var total = 0;
    final tamanho = await raf.length();
    total = tamanho;
    return total;
  } finally {
    // Roda mesmo se length() lancar IOException.
    await raf.close();
  }
}`}</code></pre>

      <AlertBox type="info" title="E o try-with-resources?">
        Diferente de Java/Python, Dart não tem <code>try</code>-com-recursos automático. A responsabilidade de fechar é sua — daí a importância de sempre embrulhar em <code>try/finally</code>.
      </AlertBox>

      <h2>A armadilha 1: <code>return</code> dentro do <code>finally</code></h2>
      <p>
        Se você fizer <code>return</code> dentro do <code>finally</code>, ele <strong>sobrescreve</strong> qualquer return que estava pendente no <code>try</code>. E pior: ele também <strong>engole</strong> qualquer exceção não capturada que estaria subindo. É um dos bugs mais traiçoeiros que existe.
      </p>
      <pre><code>{`int armadilha() {
  try {
    return 10;
  } finally {
    return 99; // sobrescreve! a funcao devolve 99
  }
}

int explosao() {
  try {
    throw StateError('bug grave');
  } finally {
    return 0; // engole o StateError; quem chama nem sabe que deu erro
  }
}`}</code></pre>

      <AlertBox type="warning" title="Regra dura">
        <strong>Nunca</strong> use <code>return</code>, <code>throw</code>, <code>break</code> ou <code>continue</code> dentro de um <code>finally</code>. O <code>finally</code> deve fazer apenas <em>limpeza</em>.
      </AlertBox>

      <h2>A armadilha 2: lançar dentro do <code>finally</code></h2>
      <p>
        Se o <code>finally</code> lança uma nova exceção, ela <strong>substitui</strong> a exceção original que estava subindo. Toda informação do erro inicial se perde. Por isso, código de limpeza deve ser <em>extremamente defensivo</em>.
      </p>
      <pre><code>{`Future<void> ruim() async {
  try {
    throw FormatException('JSON invalido');
  } finally {
    await fechar(); // se isso lancar, perdemos o FormatException original
  }
}

Future<void> bom() async {
  try {
    throw FormatException('JSON invalido');
  } finally {
    try {
      await fechar();
    } catch (e, s) {
      // Loga, mas nao deixa subir; preserva a excecao original do try.
      print('falha ao fechar (ignorada): \$e');
    }
  }
}`}</code></pre>

      <h2><code>try/finally</code> sem <code>catch</code></h2>
      <p>
        Não é obrigatório ter <code>catch</code> para usar <code>finally</code>. Quando você só quer garantir limpeza e <em>deixar a exceção subir</em>, use só <code>try/finally</code>. Esse é o padrão preferido para liberar recursos.
      </p>
      <pre><code>{`Future<void> processar(Conexao c) async {
  await c.abrir();
  try {
    await c.executar();
    // se algo lancar, vai subir; o finally fecha antes.
  } finally {
    await c.fechar();
  }
}`}</code></pre>

      <h2>Padrão de empacotamento: helper <code>using</code></h2>
      <p>
        Como esse padrão é repetitivo, é comum criar um helper genérico:
      </p>
      <pre><code>{`Future<R> using<R, T extends Object>(
  Future<T> Function() abrir,
  Future<void> Function(T) fechar,
  Future<R> Function(T) acao,
) async {
  final recurso = await abrir();
  try {
    return await acao(recurso);
  } finally {
    try {
      await fechar(recurso);
    } catch (_) {/* nao mascarar excecao do bloco */}
  }
}

// Uso:
final tamanho = await using(
  () => File('a.txt').open(),
  (f) => f.close(),
  (f) => f.length(),
);`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar <code>return</code> no <code>finally</code></strong> e mascarar o valor real ou exceções.</li>
        <li><strong>Lançar dentro do <code>finally</code></strong> sem proteger — apaga o erro original.</li>
        <li><strong>Não fechar recursos</strong> no fluxo de exceção, gerando vazamento.</li>
        <li><strong>Pôr lógica de negócio</strong> no <code>finally</code> (que precisaria rodar só em certos casos).</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>finally</code> sempre roda — sucesso, return, exceção tratada ou propagada.</li>
        <li>Use para liberar recursos: <code>close()</code>, <code>dispose()</code>, devolver conexão.</li>
        <li>Nunca use <code>return</code>/<code>throw</code> dentro do <code>finally</code> (mascara fluxo).</li>
        <li>Se for chamar algo que pode falhar dentro do <code>finally</code>, embrulhe em <code>try/catch</code> interno.</li>
        <li><code>try/finally</code> sem <code>catch</code> é perfeitamente válido e muito útil.</li>
      </ul>
    </PageContainer>
  );
}
