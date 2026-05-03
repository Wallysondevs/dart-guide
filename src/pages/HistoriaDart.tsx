import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function HistoriaDart() {
  return (
    <PageContainer
      title="A História do Dart e do Flutter"
      subtitle="De rival do JavaScript em 2011 a motor do framework mobile mais querido de 2024 — entenda como o Dart chegou aqui."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Toda linguagem de programação tem uma história — e a do Dart é particularmente interessante porque ela <em>quase morreu</em> antes de renascer como uma das linguagens mais relevantes do desenvolvimento mobile. Pense no Dart como um ator que fez um filme em 2011 que ninguém assistiu, sumiu por seis anos, voltou em 2017 com um papel coadjuvante em um filme chamado <strong>Flutter</strong> e, em 2023, virou estrela. Vamos entender essa cronologia.
      </p>

      <h2>2011: o nascimento na GOTO Conference</h2>
      <p>
        Dart foi anunciado oficialmente em 10 de outubro de 2011 na conferência GOTO em Aarhus, Dinamarca. Os criadores foram <strong>Lars Bak</strong> e <strong>Kasper Lund</strong>, dois engenheiros do Google que já haviam construído o <em>V8</em> — a engine de JavaScript do Chrome que tornou o navegador rápido. Lars já tinha experiência com VMs (<em>máquinas virtuais</em> — programas que rodam outros programas) desde os anos 90, com Smalltalk e Java HotSpot.
      </p>
      <p>
        O objetivo declarado era ousado: <strong>substituir o JavaScript</strong> dentro do Chrome. A ideia era enviar uma "Dart VM" embutida no navegador para rodar código Dart diretamente, com mais performance e tipagem opcional. O Google chegou a manter um fork do Chromium chamado <em>Dartium</em>.
      </p>
      <pre><code>{`// Como era o Dart 1 (2013) — tipos eram opcionais
main() {
  var nome = 'Mundo';
  print('Olá, \$nome!');
}`}</code></pre>

      <AlertBox type="info" title="Por que &quot;Dart&quot;?">
        O nome vem de <em>dardo</em> em inglês — algo rápido, certeiro, que vai direto ao ponto. Combina com a proposta de uma linguagem para web rápida.
      </AlertBox>

      <h2>2015: a virada — Dart sai do Chrome</h2>
      <p>
        A indústria não comprou a ideia. Mozilla, Apple e Microsoft jamais incluiriam outra VM nos seus navegadores, e o Google desistiu: em março de 2015, anunciou que a Dart VM <strong>não</strong> seria embutida no Chrome. Para muitos, foi o golpe fatal. Para a equipe Dart, virou oportunidade: a linguagem se reposicionou como ferramenta para <em>compilar para JavaScript</em> via <code>dart2js</code>, e começou a buscar novos casos de uso. Internamente no Google, o Dart já rodava sistemas críticos como o <em>AdWords</em>.
      </p>

      <h2>2017–2018: Flutter e Dart 2 — o renascimento</h2>
      <p>
        Em maio de 2017, o Google anunciou o <strong>Flutter Alpha</strong>, um framework para construir apps Android e iOS com uma única base de código — usando Dart. Por que Dart? Porque ele oferecia <em>JIT</em> (compilação rápida em desenvolvimento, permitindo o famoso <em>hot reload</em>) e <em>AOT</em> (compilação para código nativo em produção). Nenhuma outra linguagem oferecia esse combo tão bem.
      </p>
      <p>
        Em agosto de 2018, saiu o <strong>Dart 2</strong>, uma reescrita massiva: tipagem se tornou <strong>obrigatória</strong> e <em>sound</em> (à prova de furos), o <code>new</code> virou opcional, e a sintaxe ficou mais limpa. A primeira versão estável do Flutter (1.0) chegou em dezembro de 2018.
      </p>
      <pre><code>{`// Dart 2 (2018) — tipos sound, new opcional
void main() {
  final lista = <int>[1, 2, 3];
  for (final n in lista) {
    print(n * 2);
  }
}`}</code></pre>

      <h2>2021: null safety</h2>
      <p>
        Em março de 2021, com o Dart 2.12, chegou a <strong>null safety sound</strong> — um sistema de tipos que distingue valores que podem ser <code>null</code> dos que não podem, eliminando uma classe inteira de bugs (o famoso <em>NullPointerException</em>). Foi a maior mudança da linguagem desde o Dart 2.
      </p>
      <pre><code>{`// Sem null safety (antes): qualquer variável podia ser null
String nome = null; // compilava

// Com null safety (depois): você precisa avisar
String nome = 'Ana';      // nunca null
String? talvezNome = null; // pode ser null — observe o '?'`}</code></pre>

      <h2>2023: Dart 3 — records, patterns e sealed classes</h2>
      <p>
        Em maio de 2023, o <strong>Dart 3</strong> trouxe três grandes recursos inspirados em linguagens funcionais como Kotlin, Swift e Scala:
      </p>
      <ul>
        <li><strong>Records</strong>: tuplas tipadas, ótimas para devolver múltiplos valores.</li>
        <li><strong>Patterns</strong>: combinação estrutural com <code>switch</code> exaustivo.</li>
        <li><strong>Sealed classes</strong>: hierarquias fechadas verificáveis em tempo de compilação.</li>
      </ul>
      <pre><code>{`// Dart 3 — records + patterns
(String, int) buscarUsuario() => ('Ana', 30);

void main() {
  final (nome, idade) = buscarUsuario();
  print('\$nome tem \$idade anos');
}`}</code></pre>

      <AlertBox type="success" title="Hoje (2024+)">
        Dart está na versão 3.5+ e Flutter na 3.x. Juntos rodam apps em iOS, Android, Web, Windows, macOS, Linux e até em embarcados. Empresas como BMW, Toyota, Alibaba, eBay e Nubank usam Flutter em produção.
      </AlertBox>

      <h2>Linha do tempo resumida</h2>
      <table>
        <thead>
          <tr><th>Ano</th><th>Marco</th></tr>
        </thead>
        <tbody>
          <tr><td>2011</td><td>Dart anunciado na GOTO Aarhus</td></tr>
          <tr><td>2013</td><td>Dart 1.0 estável</td></tr>
          <tr><td>2015</td><td>Google desiste de embutir Dart no Chrome</td></tr>
          <tr><td>2017</td><td>Flutter Alpha apresentado no Google I/O</td></tr>
          <tr><td>2018</td><td>Dart 2 (sound types) e Flutter 1.0</td></tr>
          <tr><td>2021</td><td>Null safety (Dart 2.12)</td></tr>
          <tr><td>2023</td><td>Dart 3 (records, patterns, sealed)</td></tr>
          <tr><td>2024+</td><td>WebAssembly, melhorias de performance, Flutter 3.x</td></tr>
        </tbody>
      </table>

      <h2>Erros comuns ao estudar a história</h2>
      <ul>
        <li><strong>Achar que Dart é &quot;só para Flutter&quot;</strong>: Dart roda servidores HTTP, scripts CLI, compila para JS e WASM.</li>
        <li><strong>Confundir Dart 1 com Dart moderno</strong>: tutoriais antigos sem null safety estão desatualizados.</li>
        <li><strong>Achar que JIT/AOT são exclusividade do Dart</strong>: outras linguagens fazem, mas poucas combinam tão bem.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Dart nasceu em 2011 no Google, criado por Lars Bak e Kasper Lund.</li>
        <li>Em 2015 perdeu a guerra contra o JavaScript no navegador.</li>
        <li>Em 2017 ressurgiu como linguagem do Flutter.</li>
        <li>Dart 2 (2018) trouxe tipagem sound; 2.12 (2021), null safety; 3.0 (2023), records e patterns.</li>
        <li>Hoje é uma das linguagens mais relevantes para mobile multiplataforma.</li>
      </ul>
    </PageContainer>
  );
}
