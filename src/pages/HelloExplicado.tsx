import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HelloExplicado() {
  return (
    <PageContainer
      title="O “Olá, Mundo!” em Dart, Linha por Linha"
      subtitle="Antes de avançar, vamos dissecar o programa mais simples possível em Dart para entender o que cada palavra faz — sem mistérios."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Quando você instala o Dart e roda <code>dart create meu_app</code>, o template gera um arquivo pronto. Isso é ótimo para começar a programar, mas é péssimo para <em>aprender</em> — porque várias coisas importantes acontecem nos bastidores. Neste capítulo, vamos olhar a versão mais explícita do clássico "Olá, Mundo!" e explicar o significado de cada símbolo. Pense nisso como abrir o capô de um carro antes de aprender a dirigir.
      </p>

      <h2>O programa completo</h2>
      <p>Esse arquivo, salvo como <code>bin/ola.dart</code>, é o seu primeiro programa Dart:</p>
      <pre><code>{`// O ponto de entrada do programa.
void main() {
  print('Olá, mundo!');
}`}</code></pre>
      <p>
        São apenas 4 linhas, mas dentro delas estão <strong>cinco conceitos fundamentais</strong> de Dart: <em>comentário</em>, <em>tipo de retorno</em>, <em>função main</em>, <em>chamada de função</em> e <em>literal de string</em>. Vamos por partes.
      </p>

      <h2>Linha 1: o comentário</h2>
      <p>
        Tudo o que vem depois de <code>//</code> em uma linha é ignorado pelo compilador (o programa que transforma seu código em algo executável). Comentários servem para deixar bilhetes para outras pessoas — ou para o seu eu do futuro. Dart também aceita comentários de várias linhas com <code>/* ... */</code> e comentários de documentação com <code>///</code> (que aparecem no IntelliSense da IDE).
      </p>
      <pre><code>{`// Comentário de uma linha
/* Comentário de
   múltiplas linhas */
/// Comentário de documentação (vira tooltip na IDE).
void exemplo() {}`}</code></pre>

      <AlertBox type="info" title="Por que comentar?">
        Código sem comentários funciona, mas seis meses depois <strong>você</strong> vai ler aquele bloco e pensar "quem escreveu essa loucura?". Comentário é uma carta para o futuro.
      </AlertBox>

      <h2>Linha 2: <code>void main()</code></h2>
      <p>
        Esta é a <strong>linha mais importante</strong> de todo programa Dart. Vamos quebrar palavra por palavra:
      </p>
      <ul>
        <li><code>void</code>: é o <strong>tipo de retorno</strong> da função. <code>void</code> significa "esta função não devolve nada". Se ela devolvesse um número inteiro, escreveríamos <code>int</code>; se devolvesse um texto, <code>String</code>.</li>
        <li><code>main</code>: é um <strong>nome especial</strong>. Quando você roda um programa Dart, o runtime procura por uma função chamada exatamente <code>main</code> e começa a execução por ela. Se você chamar de <code>Main</code> (M maiúsculo) ou <code>iniciar</code>, o programa não roda — Dart é case-sensitive.</li>
        <li><code>()</code>: são os <strong>parênteses de parâmetros</strong>. Estão vazios porque <code>main</code> não está recebendo nada. Em programas que aceitam argumentos da linha de comando, escrevemos <code>void main(List&lt;String&gt; args)</code>.</li>
        <li><code>&#123;</code> e <code>&#125;</code> (chaves): delimitam o <strong>corpo da função</strong> — tudo o que está entre elas será executado quando <code>main</code> for chamada.</li>
      </ul>

      <h2>Linha 3: <code>print('Olá, mundo!');</code></h2>
      <p>
        Finalmente, a linha que <em>faz</em> alguma coisa. Aqui chamamos a <strong>função embutida</strong> <code>print</code>, que recebe um valor e o imprime no terminal, adicionando uma quebra de linha no final. <code>'Olá, mundo!'</code> é uma <strong>string literal</strong> — texto puro entre aspas simples (você também pode usar aspas duplas, é equivalente).
      </p>
      <pre><code>{`print('Aspas simples');
print("Aspas duplas");
print('Pode ter "aspas duplas" dentro.');
print("Pode ter 'aspas simples' dentro.");`}</code></pre>
      <p>
        Note o <code>;</code> no final. Em Dart, quase toda instrução termina com ponto-e-vírgula. É o equivalente ao ponto final de uma frase: ele diz "acabou aqui". Esquecer o <code>;</code> é o erro #1 de quem está começando.
      </p>

      <AlertBox type="warning" title="Sensível a maiúsculas">
        Dart é <strong>case-sensitive</strong>. <code>print</code> com p minúsculo funciona; <code>Print</code> com P maiúsculo dá erro. O mesmo vale para <code>main</code>, <code>void</code>, <code>String</code> e qualquer outro identificador.
      </AlertBox>

      <h2>Como compilar e rodar</h2>
      <p>Com o arquivo salvo, no terminal:</p>
      <pre><code>{`# Roda direto (compila e executa em um passo)
dart run bin/ola.dart

# Compila para um executável nativo (rápido, distribuível)
dart compile exe bin/ola.dart -o ola
./ola

# Compila para JavaScript (para rodar no navegador)
dart compile js bin/ola.dart -o ola.js`}</code></pre>
      <p>
        Por baixo dos panos, o Dart pode rodar de três jeitos: na <strong>Dart VM</strong> (modo desenvolvimento, com <em>hot reload</em>), em <strong>código nativo AOT</strong> (compilado antes da execução, ótimo para apps Flutter em produção) ou compilado para <strong>JavaScript</strong> (Dart no navegador). Você não precisa entender isso agora, mas é bom saber que Dart é flexível.
      </p>

      <h2>Erros comuns de quem está começando</h2>
      <ul>
        <li><strong>Esquecer <code>;</code></strong> no fim de uma instrução — o compilador reclamará com <em>"Expected ';' after this."</em>.</li>
        <li><strong>Trocar maiúsculas/minúsculas</strong> em <code>main</code> — o programa compila mas não roda, porque o runtime não acha o ponto de entrada.</li>
        <li><strong>Esquecer de fechar uma chave</strong> <code>&#125;</code> — gera uma cascata de erros confusos. Use a indentação para se orientar.</li>
        <li><strong>Salvar o arquivo com extensão errada</strong> (<code>.txt</code> em vez de <code>.dart</code>) — o compilador ignora arquivos sem <code>.dart</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Comentários começam com <code>//</code>, <code>/* */</code> ou <code>///</code> (doc).</li>
        <li><code>void main()</code> é o ponto de entrada obrigatório de todo programa Dart.</li>
        <li><code>print(...)</code> imprime no terminal.</li>
        <li>Strings podem usar aspas simples ou duplas.</li>
        <li>Dart é case-sensitive e instruções terminam com <code>;</code>.</li>
        <li>Dart pode rodar na VM, compilar para nativo (AOT) ou para JavaScript.</li>
      </ul>
    </PageContainer>
  );
}
