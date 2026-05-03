import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ParametrosPositional() {
  return (
    <PageContainer
      title="Parâmetros opcionais posicionais com [ ]"
      subtitle="Quando você quer parâmetros opcionais sem precisar nomeá-los na chamada."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Pense num formulário simples em papel: nome obrigatório, e-mail opcional. Você não precisa escrever "e-mail:" — basta deixar o segundo campo em branco. Em Dart, os <strong>parâmetros opcionais posicionais</strong> funcionam assim. Eles ficam dentro de <code>[ ]</code> na assinatura da função e podem ser omitidos na chamada, sem necessidade de prefixo de nome.
      </p>

      <h2>Sintaxe básica</h2>
      <p>
        Coloque os opcionais entre colchetes <code>[ ]</code> depois dos obrigatórios. Como podem ficar sem valor, o tipo precisa ser <em>nullable</em> (com <code>?</code>) ou ter um valor padrão.
      </p>
      <pre><code>{`enum Level { debug, info, warn, error }

void log(String mensagem, [Level? nivel]) {
  final n = nivel ?? Level.info; // ?? usa info se nivel for null
  print('[\${n.name.toUpperCase()}] \$mensagem');
}

void main() {
  log('Servidor iniciado');                 // [INFO] Servidor iniciado
  log('Falhou ao conectar', Level.error);   // [ERROR] Falhou ao conectar
}`}</code></pre>

      <AlertBox type="info" title="O operador ??">
        <code>a ?? b</code> devolve <code>a</code> se ele não for <code>null</code>; caso contrário, devolve <code>b</code>. É chamado de "coalescência nula" e é o pão-com-manteiga do tratamento de opcionais em Dart.
      </AlertBox>

      <h2>Valores padrão posicionais</h2>
      <p>
        Em vez de aceitar <code>null</code> e tratar depois, você pode dar um valor padrão direto na assinatura. Aí o tipo deixa de precisar de <code>?</code> e o código fica mais limpo.
      </p>
      <pre><code>{`void log(String mensagem, [Level nivel = Level.info]) {
  print('[\${nivel.name.toUpperCase()}] \$mensagem');
}

void main() {
  log('App pronto');                  // [INFO] App pronto
  log('CPU alta', Level.warn);        // [WARN] CPU alta
}`}</code></pre>
      <p>
        Você pode ter <strong>vários</strong> opcionais posicionais. A regra de ouro: a ordem importa. Se quiser passar o terceiro, é obrigatório passar o segundo também (mesmo que com o valor padrão).
      </p>
      <pre><code>{`String separar(String texto, [String separador = ',', int max = 0]) {
  final partes = texto.split(separador);
  return max == 0 ? partes.join('|') : partes.take(max).join('|');
}

void main() {
  print(separar('a,b,c'));            // a|b|c
  print(separar('a-b-c', '-'));       // a|b|c
  print(separar('a-b-c-d', '-', 2));  // a|b
  // Para passar 'max', você é obrigado a passar o separador também.
}`}</code></pre>

      <h2>Posicional vs nomeado</h2>
      <p>
        Posicional opcional (<code>[ ]</code>) é bom para funções com 1 ou 2 argumentos extras óbvios. Nomeado (<code>&#123; &#125;</code>) é melhor quando há vários opcionais ou quando a leitura precisa ficar autoexplicativa. Compare:
      </p>
      <pre><code>{`// Posicional — curto e direto.
void cortar(String texto, [int max = 80]) { /* ... */ }
cortar('Olá mundo', 5);

// Nomeado — verboso, mas autodocumentado.
void cortarN(String texto, {int max = 80, String sufixo = '...'}) { /* ... */ }
cortarN('Olá mundo', max: 5, sufixo: '…');`}</code></pre>

      <AlertBox type="warning" title="Não dá para misturar [ ] e &#123; &#125;">
        Numa mesma função você usa <strong>ou</strong> opcionais posicionais <strong>ou</strong> nomeados — nunca os dois. Se precisar de ambos, escolha nomeado, que é mais flexível.
      </AlertBox>

      <h2>Quando preferir posicional</h2>
      <p>
        Use posicional opcional quando:
      </p>
      <ul>
        <li>O parâmetro extra é <strong>óbvio pelo contexto</strong> (ex.: <code>log(msg, nivel)</code>).</li>
        <li>Há <strong>poucos opcionais</strong> (1 ou 2 no máximo).</li>
        <li>A ordem natural é estável e não vai mudar.</li>
      </ul>
      <p>
        Para tudo o mais — especialmente APIs públicas, classes Flutter, configurações com muitas opções — prefira <strong>nomeado</strong>.
      </p>

      <h2>Exemplo completo: cálculo de juros</h2>
      <pre><code>{`/// Calcula juros simples. Taxa default 1% ao mês, prazo default 12 meses.
double juros(double capital, [double taxa = 0.01, int meses = 12]) {
  return capital * taxa * meses;
}

void main() {
  print(juros(1000));              // 120.0  (1% * 12)
  print(juros(1000, 0.02));        // 240.0  (2% * 12)
  print(juros(1000, 0.02, 6));     // 120.0  (2% * 6)
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>?</code></strong> em opcional sem default: o compilador exige nullable ou default.</li>
        <li><strong>Querer pular um intermediário</strong>: como a ordem importa, não dá para passar o terceiro sem o segundo.</li>
        <li><strong>Misturar <code>[ ]</code> e <code>&#123; &#125;</code></strong> na mesma função: erro de compilação.</li>
        <li><strong>Default não-constante</strong>: <code>[List l = []]</code> falha; use <code>[List l = const []]</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Opcionais posicionais ficam dentro de <code>[ ]</code> depois dos obrigatórios.</li>
        <li>Sem default precisam ser nullable; com default deixam de precisar.</li>
        <li>Mantêm a ordem; para pular um, é preciso passar todos os anteriores.</li>
        <li>Bons para 1-2 extras óbvios; para muitos opcionais, prefira nomeados.</li>
        <li>Não podem coexistir com <code>&#123; &#125;</code> na mesma função.</li>
      </ul>
    </PageContainer>
  );
}
