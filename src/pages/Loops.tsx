import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Loops() {
  return (
    <PageContainer
      title="Loops: for, for-in, while, do-while"
      subtitle="Repetir tarefas é o pão e a manteiga da programação. Vamos aprender as quatro formas de loops em Dart e quando usar cada uma."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Computadores são incrivelmente rápidos em fazer a <strong>mesma coisa milhares de vezes</strong>. Loops (laços) são a estrutura que permite isso: &quot;enquanto tal condição for verdadeira, repita este bloco&quot;. Pense num loop como uma esteira de fábrica: cada item passa pela mesma operação até a esteira parar. Em Dart, há quatro formas principais de loops, cada uma com um propósito diferente — e escolher a certa deixa o código muito mais legível.
      </p>

      <h2>O <code>for</code> clássico</h2>
      <p>
        O <code>for</code> tradicional tem três partes separadas por <code>;</code>: a inicialização, a condição de continuação e o passo a cada iteração.
      </p>
      <pre><code>{`// Inicializa i=0; continua enquanto i<5; soma 1 a cada volta
for (var i = 0; i < 5; i++) {
  print('Iteração \$i');
}
// Saída: 0, 1, 2, 3, 4

// De trás para frente
for (var i = 10; i > 0; i--) {
  print(i);
}

// Múltiplas variáveis
for (var i = 0, j = 10; i < j; i++, j--) {
  print('\$i \$j');
}`}</code></pre>

      <h2><code>for-in</code>: percorrendo coleções</h2>
      <p>
        Quando você só quer visitar cada item de uma lista, set ou qualquer <code>Iterable</code>, o <code>for-in</code> é mais limpo e menos propenso a erros (não tem índice para errar).
      </p>
      <pre><code>{`final frutas = ['maçã', 'banana', 'uva'];

for (final fruta in frutas) {
  print(fruta);
}

// Se precisar do índice junto, use indexed (Dart 3)
for (final (i, fruta) in frutas.indexed) {
  print('\$i: \$fruta');
}`}</code></pre>

      <AlertBox type="info" title="final dentro de for-in">
        Use <code>final</code> em vez de <code>var</code> na variável do <code>for-in</code>: o item não muda dentro de uma iteração, então marcá-lo como final é boa prática.
      </AlertBox>

      <h2><code>forEach</code> como método</h2>
      <p>
        Toda <code>Iterable</code> tem um método <code>forEach</code> que aceita uma função e a executa para cada item. É funcionalmente equivalente ao <code>for-in</code>, mas com sintaxe de função.
      </p>
      <pre><code>{`final numeros = [1, 2, 3, 4];

numeros.forEach((n) => print(n * 2));
// 2, 4, 6, 8

// Ou com função nomeada
void imprimir(int n) => print('-> \$n');
numeros.forEach(imprimir);`}</code></pre>
      <p>
        Vale lembrar: o <code>for-in</code> é geralmente preferido pelo linter oficial em Dart porque permite usar <code>break</code>, <code>continue</code> e <code>await</code>, coisas que <code>forEach</code> não suporta diretamente.
      </p>

      <h2><code>while</code>: enquanto a condição valer</h2>
      <p>
        Use <code>while</code> quando você não sabe quantas vezes vai repetir, mas sabe a condição de parada.
      </p>
      <pre><code>{`var contador = 0;
while (contador < 3) {
  print('contador = \$contador');
  contador++;
}

// Loop &quot;infinito&quot; controlado por break
while (true) {
  final entrada = lerEntrada();   // função fictícia
  if (entrada == 'sair') break;
  processar(entrada);
}`}</code></pre>

      <h2><code>do-while</code>: rode pelo menos uma vez</h2>
      <p>
        A diferença chave do <code>while</code>: o bloco é <strong>sempre executado ao menos uma vez</strong>, porque a condição é avaliada no fim. Útil em menus interativos.
      </p>
      <pre><code>{`String? opcao;
do {
  print('1) Novo  2) Listar  3) Sair');
  opcao = leOpcao();
  // Sempre roda pelo menos uma vez
} while (opcao != '3');`}</code></pre>

      <h2><code>break</code>, <code>continue</code> e labels</h2>
      <p>
        <code>break</code> sai do loop imediatamente. <code>continue</code> pula para a próxima iteração. <strong>Labels</strong> permitem direcionar o break/continue para um loop específico em loops aninhados.
      </p>
      <pre><code>{`for (var i = 0; i < 10; i++) {
  if (i == 3) continue;   // pula o 3
  if (i == 7) break;      // para no 7
  print(i);
}
// Saída: 0,1,2,4,5,6

// Labels para loops aninhados
externo:
for (var i = 0; i < 5; i++) {
  for (var j = 0; j < 5; j++) {
    if (i == 2 && j == 2) {
      break externo;   // sai dos dois loops
    }
    print('\$i,\$j');
  }
}`}</code></pre>

      <AlertBox type="warning" title="Cuidado com loops infinitos">
        Esquecer de incrementar uma variável de controle gera um loop infinito que congela o programa. Em apps Flutter, isso trava a UI e o app vira &quot;não respondendo&quot;.
      </AlertBox>

      <h2>Qual loop escolher?</h2>
      <ul>
        <li><strong>Sabe quantas vezes repetir?</strong> → <code>for</code> clássico ou <code>for-in</code>.</li>
        <li><strong>Vai percorrer uma coleção?</strong> → <code>for-in</code>.</li>
        <li><strong>Quer expressar de forma funcional/encadeada?</strong> → <code>map</code>/<code>where</code>/<code>fold</code> em vez de loop.</li>
        <li><strong>Precisa repetir até alguma condição mudar?</strong> → <code>while</code>.</li>
        <li><strong>Tem que rodar ao menos uma vez?</strong> → <code>do-while</code>.</li>
      </ul>
      <pre><code>{`// Funcional: muitas vezes substitui loops
final pares = [1, 2, 3, 4, 5, 6]
  .where((n) => n.isEven)
  .map((n) => n * 10)
  .toList();
print(pares); // [20, 40, 60]`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Modificar a coleção dentro do <code>for-in</code></strong> — gera <code>ConcurrentModificationError</code>.</li>
        <li><strong>Esquecer de incrementar o contador</strong> em <code>while</code> — loop infinito.</li>
        <li><strong>Usar <code>forEach</code> querendo <code>break</code></strong> — não funciona; volte para <code>for-in</code>.</li>
        <li><strong>Off-by-one</strong>: <code>&lt;=</code> em vez de <code>&lt;</code> faz uma volta extra; cuidado com índices.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>for</code> clássico para quando precisa de índice e controle fino.</li>
        <li><code>for-in</code> para percorrer iteráveis (mais limpo).</li>
        <li><code>forEach</code> existe, mas não suporta break/continue/await.</li>
        <li><code>while</code> e <code>do-while</code> para condições baseadas em estado.</li>
        <li><code>break</code>/<code>continue</code> + labels controlam o fluxo.</li>
        <li>Operações funcionais (<code>map</code>, <code>where</code>) muitas vezes superam loops.</li>
      </ul>
    </PageContainer>
  );
}
