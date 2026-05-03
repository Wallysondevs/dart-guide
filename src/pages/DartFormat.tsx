import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartFormat() {
  return (
    <PageContainer
      title="dart format: formatação automática e consistente"
      subtitle="Esqueça discussões de tabs vs espaços. O Dart vem com um formatador oficial — uma única regra, zero configuração."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <p>
        Imagine uma redação onde cada autor entrega o texto numa fonte diferente, com margens diferentes, parágrafos justificados ou não, alinhados à esquerda ou centralizados. Seria impossível ler. Em código, &quot;estilo&quot; é a mesma coisa: indentação, espaços, quebras de linha. O Dart resolve isso de um jeito que poucas linguagens têm — um <strong>formatador oficial</strong> que vem com o SDK e tem uma única opinião sobre o estilo correto. Você só roda <code>dart format</code> e pronto: todo código do mundo Dart parece igual.
      </p>

      <h2>O comando básico</h2>
      <pre><code>{`# Formata todos os arquivos .dart a partir do diretório atual
dart format .

# Formata só um arquivo
dart format lib/main.dart

# Mostra o que mudaria, sem escrever (modo simulação)
dart format --output=show lib/main.dart

# Falha o build se algum arquivo precisar reformatação (CI)
dart format --set-exit-if-changed --output=none .`}</code></pre>
      <p>
        O modo <code>--set-exit-if-changed</code> é o que você usa em pipeline de CI: se alguém commitar código mal-formatado, o build quebra.
      </p>

      <h2>Antes e depois</h2>
      <p>
        O formatador transforma código bagunçado em código padrão Dart. Veja:
      </p>
      <pre><code>{`// ANTES — espaços inconsistentes, vírgulas perdidas
void main(){
final lista=[1,2,3,4,5];
  for(var n in lista){print('numero: \${n}');}
}

// DEPOIS de dart format
void main() {
  final lista = [1, 2, 3, 4, 5];
  for (var n in lista) {
    print('numero: \${n}');
  }
}`}</code></pre>

      <h2>A vírgula final mágica</h2>
      <p>
        O Dart tem um truque especial chamado <strong>trailing comma</strong> (vírgula no final). Quando você termina uma lista de argumentos com vírgula, o formatador entende como &quot;quebre cada item em uma linha&quot;. Isso é fundamental no Flutter:
      </p>
      <pre><code>{`// Sem vírgula final — fica em uma linha só
Row(children: [Text('a'), Text('b'), Text('c')]);

// Com vírgula final no último filho
Row(
  children: [
    Text('a'),
    Text('b'),
    Text('c'),
  ],
);`}</code></pre>
      <p>
        Coloque vírgula no fim de listas longas e o formatador faz a árvore Flutter ficar legível automaticamente.
      </p>

      <AlertBox type="info" title="Por que sem configuração?">
        Linguagens como JavaScript têm Prettier, ESLint, Standard, Airbnb — cada projeto reinventa o estilo. O Dart escolheu o caminho oposto: <strong>uma regra para todos</strong>. Você não perde tempo discutindo, e qualquer projeto Dart parece familiar imediatamente.
      </AlertBox>

      <h2>Mudando o comprimento da linha</h2>
      <p>
        Praticamente a única configuração que existe é o limite de coluna. O padrão é 80 caracteres. Você pode mudar via flag ou via <code>analysis_options.yaml</code>:
      </p>
      <pre><code>{`# Linha de comando — 100 colunas
dart format --line-length=100 .`}</code></pre>
      <pre><code>{`# analysis_options.yaml
formatter:
  page_width: 100`}</code></pre>

      <h2>Suprimindo formatação em casos especiais</h2>
      <p>
        Raramente, você quer manter um trecho fora do formatador (uma matriz visual, um ASCII art). Use <code>// dart format off</code> e <code>// dart format on</code>:
      </p>
      <pre><code>{`// dart format off
final matriz = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];
// dart format on`}</code></pre>

      <h2>Integração com o editor</h2>
      <p>
        Em VS Code (com a extensão Dart oficial) ou IntelliJ/Android Studio, o formatador roda automaticamente ao salvar. Configuração no VS Code (<code>settings.json</code>):
      </p>
      <pre><code>{`{
  "[dart]": {
    "editor.formatOnSave": true,
    "editor.formatOnType": true,
    "editor.rulers": [80],
    "editor.defaultFormatter": "Dart-Code.dart-code"
  }
}`}</code></pre>
      <p>
        Com isso, salvar um arquivo já reescreve a indentação e espaços. Você nunca mais pensa em estilo — só escreve.
      </p>

      <AlertBox type="warning" title="Não dá para customizar muito">
        Diferente do Prettier, você não escolhe se usa aspas simples ou duplas, vírgula final, indentação de 2 ou 4. O Dart tem opinião forte: <strong>2 espaços</strong>, <strong>aspas simples</strong>, <strong>80 colunas</strong>. Aceite — isso é a beleza.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Brigar com o formatador</strong>: tentar manter formatação manual; ele sempre vence.</li>
        <li><strong>Esquecer trailing comma</strong> em árvores Flutter: o resultado fica numa única linha gigante.</li>
        <li><strong>Não rodar em CI</strong>: PRs entram com formatação inconsistente; use <code>--set-exit-if-changed</code>.</li>
        <li><strong>Confundir <code>dart format</code> com <code>dart fix</code></strong>: o primeiro só mexe em espaços; o segundo refatora o código.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dart format .</code> formata todo o projeto.</li>
        <li>Sem configuração — uma única opinião de estilo para todo o ecossistema.</li>
        <li>Vírgula no final de listas dispara quebra de linha por item.</li>
        <li><code>--set-exit-if-changed</code> protege o CI contra commits mal-formatados.</li>
        <li>Configure <code>formatOnSave</code> no editor e esqueça do problema.</li>
      </ul>
    </PageContainer>
  );
}
