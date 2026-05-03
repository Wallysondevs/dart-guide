import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartAnalyze() {
  return (
    <PageContainer
      title="dart analyze e analysis_options.yaml"
      subtitle="O detector de problemas estático do Dart — encontra bugs antes de você rodar o código."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Compilar é como traduzir seu código para a língua do computador. Antes da tradução, o Dart faz uma <strong>análise estática</strong>: lê o código sem executar e procura problemas — variáveis não usadas, tipos incompatíveis, possíveis nulls, padrões ruins. Quem faz isso é o <code>dart analyze</code>. Pense nele como um revisor de texto: ele não muda nada, mas aponta cada erro de português, gramática suspeita, palavras repetidas. Ignorar suas dicas custa caro depois.
      </p>

      <h2>Rodando o analisador</h2>
      <pre><code>{`# Analisa todo o projeto a partir do diretório atual
dart analyze

# Analisa um caminho específico
dart analyze lib/

# Trata avisos como erros (CI rigoroso)
dart analyze --fatal-warnings --fatal-infos`}</code></pre>
      <p>
        Em projetos Flutter, use <code>flutter analyze</code> — internamente é o mesmo motor, com regras adicionais para widgets.
      </p>

      <h2>Os três níveis de aviso</h2>
      <p>
        Cada problema cai em uma das três caixas:
      </p>
      <ul>
        <li><strong>error</strong>: bug de verdade, código nem compila. Ex.: usar variável que não existe.</li>
        <li><strong>warning</strong>: provavelmente bug, mas compila. Ex.: variável de método nunca usada.</li>
        <li><strong>info / lint</strong>: dica de estilo. Ex.: prefira <code>final</code> em vez de <code>var</code> quando não reatribui.</li>
      </ul>
      <pre><code>{`# Saída típica
info • Prefer const for constructors • lib/main.dart:12:5 • prefer_const_constructors
warning • Unused import • lib/main.dart:1:8 • unused_import
error • Undefined name 'fooo' • lib/main.dart:18:3 • undefined_identifier`}</code></pre>

      <h2>analysis_options.yaml: ligando os lints</h2>
      <p>
        Por padrão, o analisador é tímido. Para acordar centenas de regras úteis, crie um arquivo <code>analysis_options.yaml</code> na raiz do projeto incluindo um conjunto pronto. O time do Dart mantém dois pacotes de regras recomendadas:
      </p>
      <pre><code>{`# Adicione ao pubspec.yaml
dev_dependencies:
  lints: ^4.0.0
  # Para Flutter:
  # flutter_lints: ^4.0.0`}</code></pre>
      <pre><code>{`# analysis_options.yaml — projeto Dart puro
include: package:lints/recommended.yaml

# OU, para Flutter:
# include: package:flutter_lints/flutter.yaml`}</code></pre>
      <p>
        Pronto. A partir daqui, <code>dart analyze</code> aponta dezenas de melhorias — usar <code>const</code> em widgets, declarar tipos de retorno, evitar <code>print</code> em código de produção, entre outras.
      </p>

      <AlertBox type="info" title="O que são lints?">
        &quot;Lint&quot; é o nome histórico para um analisador de código (vem do Lint do Unix de 1978, que &quot;tirava penugem&quot; do código C). Hoje significa qualquer regra de estilo verificada estaticamente — &quot;use camelCase&quot;, &quot;não deixe import sobrando&quot;, &quot;feche o arquivo aberto&quot;.
      </AlertBox>

      <h2>Customizando regras</h2>
      <p>
        Você herda as regras recomendadas, mas pode ligar/desligar individualmente, mudar severidade e excluir pastas:
      </p>
      <pre><code>{`include: package:lints/recommended.yaml

analyzer:
  # Trata warnings como erros (mais rigoroso)
  errors:
    unused_import: error
    invalid_assignment: error
    todo: ignore         # silencia avisos de TODO

  # Não analisa estes caminhos
  exclude:
    - '**/*.g.dart'
    - '**/*.freezed.dart'
    - 'build/**'

  # Modo de linguagem
  language:
    strict-casts: true
    strict-inference: true
    strict-raw-types: true

linter:
  rules:
    # Liga regras adicionais não inclusas no preset
    avoid_print: true
    prefer_single_quotes: true
    require_trailing_commas: true
    # Desliga uma regra inconveniente
    constant_identifier_names: false`}</code></pre>

      <h2>Os modos &quot;strict&quot;</h2>
      <p>
        As três flags <code>strict-casts</code>, <code>strict-inference</code> e <code>strict-raw-types</code> levam o sistema de tipos do Dart ao máximo de rigor:
      </p>
      <ul>
        <li><strong>strict-casts</strong>: proíbe casts implícitos de <code>dynamic</code> para tipos concretos. Ex.: ler <code>json[&apos;nome&apos;]</code> direto numa <code>String</code> vira erro — você precisa fazer <code>as String</code>.</li>
        <li><strong>strict-inference</strong>: força você a anotar tipos onde o Dart não consegue inferir, em vez de cair em <code>dynamic</code>.</li>
        <li><strong>strict-raw-types</strong>: proíbe tipos genéricos sem parâmetros — <code>List</code> vira erro, exige <code>List&lt;String&gt;</code>.</li>
      </ul>
      <p>Recomendo ligar todos em projetos novos. Os erros que aparecem são bugs reais escondidos.</p>

      <h2>Suprimindo um aviso pontual</h2>
      <p>
        Quando você tem um motivo legítimo para violar uma regra, use o comentário <code>// ignore</code> na linha ou <code>// ignore_for_file</code> no topo do arquivo:
      </p>
      <pre><code>{`// Suprime só esta linha
print('debug'); // ignore: avoid_print

// Suprime no arquivo inteiro (use com moderação)
// ignore_for_file: avoid_print, prefer_const_constructors

void main() {
  print('logging temporário');
}`}</code></pre>

      <AlertBox type="warning" title="Não abuse do ignore">
        Cada <code>ignore</code> é uma promessa quebrada. Se você precisa silenciar a mesma regra em vários arquivos, considere desativá-la no <code>analysis_options.yaml</code>; se é situação rara, ignore pontual e <strong>comente o porquê</strong>.
      </AlertBox>

      <h2>Integração com IDE e CI</h2>
      <p>
        VS Code e IntelliJ leem o <code>analysis_options.yaml</code> e mostram os avisos sublinhados em tempo real. Em CI, falhe o pipeline em qualquer warning:
      </p>
      <pre><code>{`# .github/workflows/ci.yaml
- name: Análise estática
  run: dart analyze --fatal-warnings --fatal-infos`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Não incluir um preset de lints</strong>: você perde 80% dos benefícios do analisador.</li>
        <li><strong>Excluir <code>**/*.g.dart</code> esquecido</strong>: avisos de código gerado poluem a saída.</li>
        <li><strong>Misturar erros do analisador com erros de teste</strong>: rode os dois separadamente em CI.</li>
        <li><strong>Ignorar avisos sem ler</strong>: a maioria aponta bug ou má prática real.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dart analyze</code> faz análise estática sem executar o código.</li>
        <li>Inclua <code>package:lints/recommended.yaml</code> (ou <code>flutter_lints</code>) para regras de qualidade.</li>
        <li>Configure severidade, exclusões e regras em <code>analysis_options.yaml</code>.</li>
        <li>Ligue <code>strict-casts</code>, <code>strict-inference</code>, <code>strict-raw-types</code> para tipagem máxima.</li>
        <li>Use <code>--fatal-warnings</code> em CI para evitar regressões.</li>
      </ul>
    </PageContainer>
  );
}
