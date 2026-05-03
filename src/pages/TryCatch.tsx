import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TryCatch() {
  return (
    <PageContainer
      title="try / catch / finally: tratando exceções"
      subtitle="A rede de segurança que evita que uma falha esperada derrube o programa inteiro."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine que você está cozinhando e, de repente, percebe que a panela vai transbordar. Você precisa de uma forma de <em>parar tudo o que está fazendo</em>, lidar com o problema e depois decidir se continua a receita ou desliga o fogão. Em programação isso se chama <strong>tratamento de exceções</strong>, e em Dart o trio <code>try</code>, <code>catch</code> e <code>finally</code> é exatamente essa rede de segurança.
      </p>

      <h2>A estrutura básica</h2>
      <p>
        Você embrulha o código que <em>pode</em> falhar dentro de um bloco <code>try</code>. Se algo der errado, em vez de o programa explodir, o controle pula para o bloco <code>catch</code>. Por fim, o bloco <code>finally</code> roda <em>sempre</em> — deu certo ou não.
      </p>
      <pre><code>{`void main() {
  try {
    final n = int.parse('abc'); // vai lancar FormatException
    print('numero: \$n');
  } catch (e) {
    print('Falhou: \$e');
  } finally {
    print('Sempre executo, com sucesso ou erro.');
  }
}`}</code></pre>

      <h2><code>on Tipo</code>: capturando exceções específicas</h2>
      <p>
        Capturar &quot;qualquer coisa&quot; é raramente o que você quer. O ideal é tratar <strong>cada tipo de problema</strong> de forma diferente — um arquivo inexistente pede mensagem diferente de um JSON malformado. Para isso, use <code>on Tipo</code>:
      </p>
      <pre><code>{`import 'dart:async';
import 'dart:convert';

Future<void> carregar() async {
  try {
    final corpo = await buscarTexto();
    final dados = jsonDecode(corpo);
    print(dados);
  } on TimeoutException {
    print('Servidor nao respondeu a tempo.');
  } on FormatException catch (e) {
    print('JSON invalido: \${e.message}');
  } on Exception catch (e) {
    // Captura qualquer outra Exception nao tratada acima.
    print('Falha generica: \$e');
  }
}

Future<String> buscarTexto() async => '{ invalido';`}</code></pre>
      <p>
        Note a ordem: do <strong>mais específico</strong> para o <strong>mais genérico</strong>. Se você puser <code>on Exception</code> primeiro, ele &quot;come&quot; tudo e os blocos seguintes nunca executam.
      </p>

      <h2>Pegando também o stack trace</h2>
      <p>
        O <em>stack trace</em> é o &quot;rastro de migalhas&quot; que mostra por quais funções a execução passou até o erro. Para receber esse rastro junto com a exceção, declare dois parâmetros no <code>catch</code>:
      </p>
      <pre><code>{`try {
  funcaoQueExplode();
} on Exception catch (e, stack) {
  print('Excecao: \$e');
  print('Pilha de chamadas:');
  print(stack);
}`}</code></pre>

      <AlertBox type="info" title="Quando logar o stack?">
        Em produção, sempre. Sem o stack trace, descobrir <em>onde</em> o erro aconteceu é como procurar agulha em palheiro. Salve em um log estruturado.
      </AlertBox>

      <h2><code>finally</code>: a faxina obrigatória</h2>
      <p>
        Tudo dentro de <code>finally</code> roda <strong>sempre</strong>: se o <code>try</code> terminou normal, se houve <code>return</code> no meio dele, se uma exceção foi lançada e capturada, ou mesmo se a exceção <em>não</em> foi capturada e está subindo para cima. Por isso é o lugar certo para liberar recursos: fechar arquivo, devolver conexão de banco, esconder loading.
      </p>
      <pre><code>{`import 'dart:io';

Future<int> contarLinhas(String caminho) async {
  final raf = await File(caminho).open();
  try {
    var n = 0;
    // ... le linhas, incrementa n
    return n;
  } finally {
    await raf.close(); // SEMPRE fecha, mesmo se algo deu errado
  }
}`}</code></pre>

      <h2><code>rethrow</code>: capturei, mas quero que continue subindo</h2>
      <p>
        Às vezes você quer apenas <em>logar</em> uma exceção e deixar ela continuar a subir, para que o código de cima decida o que fazer. Para isso existe <code>rethrow</code> — ele preserva o stack trace original (diferente de <code>throw e</code>, que reseta).
      </p>
      <pre><code>{`Future<void> processar() async {
  try {
    await fazerAlgo();
  } catch (e, s) {
    log.severe('Erro em processar', e, s);
    rethrow; // mantem o stack original; quem chamou trata
  }
}`}</code></pre>

      <AlertBox type="warning" title="Não use <code>throw e</code> para repropagar">
        Quando você escreve <code>throw e</code> dentro de um <code>catch</code>, Dart cria um novo stack trace começando ali. Você perde a história de como o erro chegou até esse ponto. Use sempre <code>rethrow</code>.
      </AlertBox>

      <h2>Catch sem tipo: o &quot;pega-tudo&quot;</h2>
      <p>
        <code>catch (e)</code> sem <code>on</code> captura <strong>qualquer</strong> objeto lançado — Exception, Error, String, número, qualquer coisa. É equivalente a <code>on Object catch (e)</code>. Use com parcimônia: o ideal é tratar o que você sabe que pode acontecer e deixar o resto subir.
      </p>
      <pre><code>{`try {
  rodar();
} catch (e, s) {
  print('Algo deu MUITO errado: \$e\\n\$s');
  // Aqui voce esta capturando ate Errors. Cuidado.
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Ordem errada de <code>on</code>:</strong> colocar <code>on Exception</code> antes de <code>on FormatException</code> faz o segundo nunca rodar.</li>
        <li><strong>Engolir exceções com <code>catch (_) &#123;&#125;</code></strong> sem nem logar — bug some, voltam dois meses depois piores.</li>
        <li><strong>Usar <code>throw e</code> em vez de <code>rethrow</code></strong> e perder o stack trace original.</li>
        <li><strong>Esquecer <code>await</code> dentro do <code>try</code></strong> em código async — a exceção sobe fora do bloco e o catch não pega.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>try</code> envolve código que pode falhar; <code>catch</code> trata; <code>finally</code> roda sempre.</li>
        <li><code>on Tipo catch (e, stack)</code> captura por tipo e dá acesso ao rastro de chamadas.</li>
        <li>Liste blocos <code>on</code> do mais específico ao mais genérico.</li>
        <li>Use <code>finally</code> para liberar recursos (arquivos, conexões).</li>
        <li><code>rethrow</code> repropaga preservando o stack original; <code>throw e</code> não.</li>
      </ul>
    </PageContainer>
  );
}
