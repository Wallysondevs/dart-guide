import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function VarFinalConst() {
  return (
    <PageContainer
      title="var, final e const: a tríade fundamental"
      subtitle="Três palavrinhas que parecem fazer a mesma coisa, mas que mudam profundamente como o programa se comporta na memória e em performance."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Pense em uma variável como uma caixa. <code>var</code> é uma caixa em que você pode trocar o conteúdo quantas vezes quiser. <code>final</code> é uma caixa que aceita um conteúdo só — depois é selada com fita adesiva. Já <code>const</code> é uma caixa <em>de cristal de fábrica</em>: o conteúdo é decidido <strong>antes</strong> mesmo do programa começar a rodar e nunca muda. Essa diferença sutil entre &quot;não muda em runtime&quot; e &quot;já era valor antes do runtime&quot; é o coração deste capítulo.
      </p>

      <h2><code>var</code>: variável mutável</h2>
      <p>
        Use <code>var</code> quando o valor pode mudar ao longo do programa. O tipo é inferido a partir do primeiro valor atribuído.
      </p>
      <pre><code>{`var contador = 0;
contador = contador + 1;   // OK
contador = 99;             // OK

var nome = 'Ana';
nome = 'Beatriz';          // OK: continua sendo String`}</code></pre>
      <p>
        Embora seja útil, abusar de <code>var</code> torna o código menos previsível. Em projetos sérios, usamos <code>final</code> sempre que possível, e só caímos para <code>var</code> quando realmente precisamos mudar o valor.
      </p>

      <h2><code>final</code>: atribuição única, decidida em runtime</h2>
      <p>
        <code>final</code> diz: &quot;esta caixa receberá um valor uma única vez, e esse valor pode ser calculado enquanto o programa roda&quot;. É perfeito para guardar resultados que você descobre na hora — como a data atual, uma resposta vinda da rede ou um valor digitado pelo usuário.
      </p>
      <pre><code>{`final agora = DateTime.now();    // Calculado em runtime
// agora = DateTime.now();        // ERRO: já foi atribuído

final String saudacao = 'Olá';   // Tipo opcional explícito
final List<int> numeros = [1, 2, 3];
numeros.add(4);                  // OK! A lista interna é mutável,
                                 // só a referência é final.`}</code></pre>

      <AlertBox type="info" title="final é sobre a referência">
        <code>final</code> trava a <strong>etiqueta da caixa</strong>, não o conteúdo da caixa. Se o valor for uma lista mutável, você ainda pode adicionar/remover itens dela. Para travar o conteúdo também, combine com <code>const</code> ou use coleções imutáveis.
      </AlertBox>

      <h2><code>const</code>: constante de tempo de compilação</h2>
      <p>
        <code>const</code> exige que o valor seja <strong>conhecido pelo compilador</strong>. O compilador precisa conseguir calcular esse valor sem rodar o programa. Por isso você não pode usar <code>const</code> com <code>DateTime.now()</code> — a hora atual só existe no momento da execução.
      </p>
      <pre><code>{`const pi = 3.14159;
const mensagem = 'Bem-vindo';
const tamanho = 10 * 60;    // 600, calculado pelo compilador

// const agora = DateTime.now();  // ERRO: depende do runtime
final agora = DateTime.now();    // Aqui sim, com final`}</code></pre>

      <h2>Objetos const e canonicalização</h2>
      <p>
        Quando você cria um <strong>objeto</strong> <code>const</code> (uma instância de uma classe), Dart faz algo especial: se duas chamadas <code>const</code> produzem objetos com os mesmos campos, o compilador devolve <em>a mesma instância</em> na memória. Isso se chama <strong>canonicalização</strong> e economiza memória — útil em apps Flutter, onde widgets são criados aos milhares.
      </p>
      <pre><code>{`class Ponto {
  final int x;
  final int y;
  const Ponto(this.x, this.y);   // Construtor const exige campos final
}

void main() {
  const a = Ponto(1, 2);
  const b = Ponto(1, 2);
  print(identical(a, b));        // true: mesmo objeto na memória!

  final c = Ponto(1, 2);          // sem const
  final d = Ponto(1, 2);
  print(identical(c, d));        // false: dois objetos diferentes
}`}</code></pre>

      <AlertBox type="success" title="const em Flutter">
        Em widgets, marcar construtores como <code>const</code> permite ao Flutter reutilizar o widget entre rebuilds, economizando trabalho. Sempre que possível, escreva <code>const Text('Olá')</code> em vez de <code>Text('Olá')</code>.
      </AlertBox>

      <h2>Quando usar cada um?</h2>
      <p>Regra prática para escrever Dart idiomático:</p>
      <ol>
        <li><strong>Tente <code>const</code> primeiro.</strong> Se o valor é conhecido na compilação, use <code>const</code> — é o mais eficiente.</li>
        <li><strong>Se não der, use <code>final</code>.</strong> Atribuição única em runtime cobre 80% dos casos.</li>
        <li><strong>Só caia em <code>var</code> se realmente precisar reatribuir</strong> — contadores, acumuladores, estados que mudam.</li>
      </ol>
      <pre><code>{`const taxaJuros = 0.05;                     // const: literal fixo
final usuarioLogado = buscarUsuario();      // final: vem em runtime
var tentativas = 0;                          // var: vai mudar
tentativas++;`}</code></pre>

      <h2>Const dentro de coleções</h2>
      <p>
        Você pode marcar listas, sets e maps inteiros como <code>const</code> — isso os torna profundamente imutáveis (não dá nem para adicionar item).
      </p>
      <pre><code>{`const cores = ['vermelho', 'verde', 'azul'];
// cores.add('amarelo');  // ERRO: lista const é imutável

const config = {'tema': 'escuro', 'idioma': 'pt'};
// config['tema'] = 'claro'; // ERRO`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar <code>const x = DateTime.now();</code></strong> — a hora atual só existe em runtime.</li>
        <li><strong>Esquecer que <code>final</code> não imuta o conteúdo de listas/maps</strong> — só a referência.</li>
        <li><strong>Não marcar widgets Flutter como <code>const</code></strong> — perde otimizações importantes.</li>
        <li><strong>Reatribuir uma <code>final</code></strong> — o compilador rejeita imediatamente.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>var</code>: pode reatribuir; tipo inferido.</li>
        <li><code>final</code>: atribuição única, valor pode ser calculado em runtime.</li>
        <li><code>const</code>: valor decidido em compilação; objetos <code>const</code> são canonicalizados.</li>
        <li>Prefira <code>const</code> &gt; <code>final</code> &gt; <code>var</code>, nessa ordem.</li>
        <li>Em Flutter, <code>const</code> em widgets é boa prática de performance.</li>
      </ul>
    </PageContainer>
  );
}
