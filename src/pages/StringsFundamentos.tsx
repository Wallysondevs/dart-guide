import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function StringsFundamentos() {
  return (
    <PageContainer
      title="Strings em Dart: aspas, escapes e interpolação"
      subtitle="Tudo o que você precisa saber para manipular texto com elegância e sem se perder em escapes."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Texto está em todo lugar: nomes, mensagens, JSON, e-mails, URLs. Por isso, dominar <strong>strings</strong> é tão essencial quanto saber somar dois números. Em Dart, strings são objetos imutáveis (cada &quot;modificação&quot; cria uma nova) e têm várias formas de serem escritas — cada uma com seu propósito. Pense em escolher entre aspas como escolher o tipo certo de envelope para uma carta: o conteúdo é o mesmo, mas a embalagem muda o jeito de manusear.
      </p>

      <h2>Aspas simples vs aspas duplas</h2>
      <p>
        Em Dart, <code>'texto'</code> e <code>&quot;texto&quot;</code> são <strong>equivalentes</strong>. A escolha é estilística — o linter oficial recomenda aspas simples por padrão, e duplas só quando o texto contém uma aspa simples.
      </p>
      <pre><code>{`var a = 'aspas simples';
var b = "aspas duplas";
var c = "Texto com aspas 'simples' dentro";
var d = 'Texto com aspas "duplas" dentro';

// Sem precisar escapar nada acima.`}</code></pre>

      <h2>Caracteres de escape</h2>
      <p>
        Alguns caracteres são especiais e precisam ser &quot;escapados&quot; com a contrabarra <code>\\</code>. Os mais comuns são quebra de linha (<code>\\n</code>), tabulação (<code>\\t</code>) e a própria contrabarra (<code>\\\\</code>).
      </p>
      <pre><code>{`print('linha 1\\nlinha 2');   // imprime em duas linhas
print('Nome:\\tAna');           // tab entre Nome: e Ana
print('Caminho: C:\\\\Users');  // imprime: C:\\Users
print('Aspa simples: \\'');     // escape de aspa
print('Unicode: \\u2764');     // ❤ (heart)
print('Hex byte: \\x41');       // A`}</code></pre>

      <h2>Strings raw com <code>r'...'</code></h2>
      <p>
        Quando você quer que a contrabarra seja tratada literalmente (útil para <strong>regex</strong> e caminhos do Windows), prefixe a string com <code>r</code>. Isso desliga todo o processamento de escapes.
      </p>
      <pre><code>{`var caminho = r'C:\\Users\\ana\\Documentos';
print(caminho);   // C:\\Users\\ana\\Documentos (literal)

var regex = RegExp(r'\\d+');   // \\d sem precisar duplicar
// Sem o r seria: RegExp('\\\\d+')`}</code></pre>

      <h2>Strings de múltiplas linhas com triplo</h2>
      <p>
        Para textos longos com várias linhas (HTML embutido, mensagens grandes), use três aspas. A indentação dentro do bloco vira parte da string.
      </p>
      <pre><code>{`var poema = '''
Roses are red,
Violets are blue,
Dart is awesome,
And so are you.
''';

var html = """
<html>
  <body>
    <h1>Olá</h1>
  </body>
</html>
""";`}</code></pre>

      <h2>Interpolação: a melhor amiga do programador</h2>
      <p>
        Em vez de concatenar com <code>+</code>, Dart oferece <strong>interpolação</strong>: você embute valores diretamente na string usando <code>\$&#123;'$'&#125;variavel</code> ou <code>\$&#123;'$'&#125;&#123;expressao&#125;</code>. É mais legível, mais rápido e menos propenso a bugs.
      </p>
      <pre><code>{`var nome = 'Maria';
var idade = 30;

// Forma simples: \$nome (sem chaves) para variáveis simples
print('Olá, \$nome!');                       // Olá, Maria!

// Forma com chaves para expressões mais complexas
print('Idade: \${idade + 1} ano que vem');    // Idade: 31 ano que vem
print('Nome em maiúsculas: \${nome.toUpperCase()}');

// Para um \$ literal, escape com \\\$
print('Preço: \\\$10');                      // Preço: \$10`}</code></pre>

      <AlertBox type="info" title="Interpolação chama toString()">
        Quando você interpola um objeto, Dart automaticamente chama <code>toString()</code> nele. Sobrescreva <code>toString()</code> nas suas classes para mensagens de log mais úteis.
      </AlertBox>

      <h2>Concatenação e adjacência</h2>
      <p>
        Você pode juntar strings com o operador <code>+</code>. Mas há um truque elegante: <strong>strings literais adjacentes</strong> (separadas só por espaço ou quebra de linha) são automaticamente unidas pelo compilador.
      </p>
      <pre><code>{`var s1 = 'Olá, ' + 'mundo!';   // concatenação tradicional

// Adjacência: o compilador junta sem o +
var s2 = 'Esta é uma frase '
         'muito longa que quebrei '
         'em várias linhas para legibilidade.';

// Cuidado: adjacência só funciona com literais!
var nome = 'Ana';
// var erro = 'Olá ' nome;     // ERRO
var ok = 'Olá ' + nome;        // ok
var melhor = 'Olá \$nome';      // melhor ainda`}</code></pre>

      <h2>Métodos básicos de String</h2>
      <p>
        Como toda <code>String</code> é um objeto, ela traz dezenas de métodos prontos. Os essenciais para o dia a dia:
      </p>
      <pre><code>{`var s = '  Olá, Dart!  ';

print(s.length);              // 15
print(s.trim());              // 'Olá, Dart!'
print(s.toUpperCase());       // '  OLÁ, DART!  '
print(s.toLowerCase());       // '  olá, dart!  '
print(s.contains('Dart'));    // true
print(s.startsWith('  '));    // true
print(s.endsWith('!  '));     // true
print(s.replaceAll('Dart', 'Mundo')); // '  Olá, Mundo!  '
print(s.split(','));          // ['  Olá', ' Dart!  ']
print('---'.padLeft(6, '*')); // '***---'
print('abc'.codeUnits);       // [97, 98, 99]
print('Ana, Bia, Caio'.split(', ')); // ['Ana', 'Bia', 'Caio']`}</code></pre>

      <AlertBox type="warning" title="String é imutável">
        Nenhum método <em>modifica</em> a string original — todos retornam uma <strong>nova</strong> string. Se você quer guardar o resultado, atribua: <code>s = s.trim();</code>
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer chaves na interpolação de expressão:</strong> <code>'\$&#123;'$'&#125;lista.length'</code> imprime o objeto e a string &quot;.length&quot;. Use <code>'\$&#123;'$'&#125;&#123;lista.length&#125;'</code>.</li>
        <li><strong>Concatenar dentro de loop com <code>+</code>:</strong> use <code>StringBuffer</code> para performance.</li>
        <li><strong>Usar <code>==</code> esperando comparação por referência:</strong> em Dart, <code>==</code> em strings compara conteúdo, não identidade.</li>
        <li><strong>Confundir <code>length</code> com número de letras visíveis</strong> — emojis ocupam 2 code units.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Aspas simples e duplas são equivalentes; prefira simples.</li>
        <li><code>\\n</code>, <code>\\t</code>, <code>\\\\</code>, <code>\\\u...</code> são escapes comuns.</li>
        <li><code>r'...'</code> desliga escapes (ótimo para regex).</li>
        <li>Triplo (<code>'''</code>) cria multi-linha.</li>
        <li>Interpolação: <code>\$&#123;'$'&#125;var</code> e <code>\$&#123;'$'&#125;&#123;expr&#125;</code>.</li>
        <li>Strings adjacentes literais se concatenam automaticamente.</li>
        <li>Strings são imutáveis; métodos retornam novas instâncias.</li>
      </ul>
    </PageContainer>
  );
}
