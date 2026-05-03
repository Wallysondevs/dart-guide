import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartVmAot() {
  return (
    <PageContainer
      title="Dart VM, JIT e AOT: como o Dart roda"
      subtitle="Por baixo dos panos, o Dart escolhe entre três motores diferentes — entender isso explica o hot reload e a velocidade do Flutter."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Imagine que escrever Dart é como escrever uma receita em português. O computador não fala português; fala uma linguagem chamada <em>código de máquina</em> (puro 0 e 1). Para a receita virar comida, alguém precisa <strong>traduzir</strong>. Esse alguém pode trabalhar de três jeitos diferentes — e o Dart suporta os três. Esse capítulo é o tour pelos bastidores.
      </p>

      <h2>Os três modos de execução</h2>
      <p>
        Quando você roda <code>dart run app.dart</code>, o que acontece depende do contexto:
      </p>
      <ul>
        <li><strong>Dart VM com JIT</strong>: a tradução acontece <em>enquanto o programa roda</em>. Bom para desenvolvimento — qualquer mudança no código entra em segundos.</li>
        <li><strong>AOT (Ahead-of-Time)</strong>: a tradução acontece <em>antes</em>, gerando um executável nativo. Bom para produção — inicializa rápido, sem aquecimento.</li>
        <li><strong>dart2js / dart2wasm</strong>: traduz Dart para JavaScript ou WebAssembly, para rodar no navegador.</li>
      </ul>

      <pre><code>{`# 1) JIT — desenvolvimento
dart run bin/app.dart

# 2) AOT — executável nativo único
dart compile exe bin/app.dart -o build/app
./build/app

# 3) JavaScript — rodar no navegador
dart compile js web/main.dart -o web/main.js`}</code></pre>

      <h2>O que é a Dart VM?</h2>
      <p>
        Uma <strong>VM (máquina virtual)</strong> é um programa que finge ser um computador. Em vez de gerar instruções para o seu Intel/Apple Silicon real, o Dart gera instruções para uma &quot;CPU imaginária&quot; — e a VM, escrita em C++, executa essas instruções no seu hardware. A vantagem? A mesma VM roda em Windows, Linux, macOS, Android e iOS, dando portabilidade.
      </p>
      <p>
        A Dart VM faz três coisas vitais: <strong>parsing</strong> (lê o seu <code>.dart</code> e entende o código), <strong>otimização JIT</strong> (vai aprendendo padrões e recompilando trechos quentes para nativo) e <strong>garbage collection</strong> (limpeza de memória — vamos ver já já).
      </p>

      <AlertBox type="info" title="JIT em uma frase">
        <strong>JIT</strong> = &quot;Just-In-Time&quot;, ou &quot;na hora&quot;. A VM começa rodando o código devagar (interpretado) e, conforme percebe que uma função é chamada muito (uma <em>hot function</em>), gera código nativo otimizado para ela. Aquece feito um motor de carro.
      </AlertBox>

      <h2>JIT, hot reload e o superpoder do Flutter</h2>
      <p>
        O <strong>hot reload</strong> do Flutter é o recurso que conquistou os desenvolvedores. Você muda uma cor, salva, e <em>menos de 1 segundo depois</em> o app já está com a nova cor — sem reiniciar. Isso só é possível porque o Dart está rodando em modo JIT: a VM aceita um arquivo <code>.dart</code> novo e o injeta no programa em execução, mantendo o estado.
      </p>
      <pre><code>{`// Você altera essa linha em runtime via hot reload:
return Container(color: Colors.blue); // antes
return Container(color: Colors.red);  // depois — sem reiniciar`}</code></pre>

      <h2>AOT: produção sem surpresas</h2>
      <p>
        <strong>AOT (Ahead-Of-Time)</strong> traduz <em>tudo</em> antes da execução. O resultado é um executável nativo, igual ao gerado por C++ ou Rust. Vantagens em produção:
      </p>
      <ul>
        <li><strong>Startup instantâneo</strong>: não há aquecimento do JIT.</li>
        <li><strong>Performance previsível</strong>: cada chamada já está otimizada.</li>
        <li><strong>Distribuição simples</strong>: um único arquivo binário, sem precisar instalar a Dart VM.</li>
      </ul>
      <pre><code>{`# Gera um executável nativo de ~5MB
dart compile exe bin/cli.dart -o cli

# No Linux/macOS basta rodar
./cli --ajuda

# No Android/iOS o Flutter usa AOT em modo --release`}</code></pre>

      <h2>Snapshots: a memória da VM</h2>
      <p>
        Um <strong>snapshot</strong> é um arquivo binário que contém o estado pré-processado do programa — bytecode, tabelas de tipos, classes já compiladas. Em vez de reler todos os <code>.dart</code> a cada execução, a Dart VM carrega o snapshot e começa &quot;quase pronta&quot;. Tipos:
      </p>
      <ul>
        <li><strong>Kernel snapshot</strong> (.dill): bytecode multiplataforma, usado em desenvolvimento.</li>
        <li><strong>JIT snapshot</strong>: bytecode + estado de aquecimento.</li>
        <li><strong>AOT snapshot</strong>: código nativo, usado em produção mobile/desktop.</li>
      </ul>
      <pre><code>{`# Gera AOT snapshot independente
dart compile aot-snapshot bin/app.dart -o app.aot

# Roda com o dartaotruntime (mais leve que a VM)
dartaotruntime app.aot`}</code></pre>

      <h2>Garbage collector: a faxina automática</h2>
      <p>
        Quando você cria um objeto em Dart (<code>final lista = [1, 2, 3]</code>), a memória é alocada automaticamente. Mas e quando esse objeto não é mais usado? O <strong>garbage collector (GC)</strong> é o programa que percorre a memória e libera o que ninguém referencia mais — feito uma faxineira que recolhe pratos sujos da mesa. Em Dart, o GC é <em>generacional</em>: divide objetos em &quot;jovens&quot; (criados há pouco) e &quot;velhos&quot;, e visita os jovens com mais frequência (porque a maioria morre logo).
      </p>
      <pre><code>{`void main() {
  for (var i = 0; i < 1000000; i++) {
    final temp = 'item \$i'; // cria string nova
    // 'temp' some no fim do loop -> GC limpa depois
  }
  print('Terminou — memória limpa pelo GC');
}`}</code></pre>

      <AlertBox type="warning" title="Não precisa pensar nisso (quase)">
        Você não chama o GC manualmente. Mas saber que ele existe ajuda a entender por que apps Flutter podem ter pequenos &quot;tropeços&quot; (jank) quando uma coleta grande acontece. Em alta performance, evite alocar objetos dentro de loops apertados.
      </AlertBox>

      <h2>Compilando para Web</h2>
      <p>
        Para o navegador, Dart oferece dois caminhos:
      </p>
      <ul>
        <li><code>dart compile js</code>: gera JavaScript otimizado, tree-shaken, minificado.</li>
        <li><code>dart compile wasm</code>: gera WebAssembly, mais rápido em alguns casos.</li>
      </ul>
      <pre><code>{`dart compile js -O4 web/main.dart -o web/main.js
# -O4 ativa nível máximo de otimização (tree-shaking + minificação)`}</code></pre>

      <h2>Erros comuns ao entender execução</h2>
      <ul>
        <li><strong>Achar que JIT é mais lento que AOT em tudo</strong>: em <em>steady-state</em>, JIT pode até superar AOT em casos extremos.</li>
        <li><strong>Confundir &quot;compilado&quot; com &quot;binário portátil&quot;</strong>: o executável AOT depende do SO/CPU em que foi compilado.</li>
        <li><strong>Esperar hot reload em release</strong>: apps em produção usam AOT — sem hot reload.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Dart VM roda Dart com JIT em desenvolvimento (hot reload, rápido feedback).</li>
        <li>AOT compila para código nativo em produção (startup rápido, sem VM).</li>
        <li>dart2js/dart2wasm levam Dart para o navegador.</li>
        <li>Snapshots aceleram o startup; o GC gerencia memória automaticamente.</li>
      </ul>
    </PageContainer>
  );
}
