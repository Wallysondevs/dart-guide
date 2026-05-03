import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DefaultValues() {
  return (
    <PageContainer
      title="Valores padrão em parâmetros"
      subtitle="Defina o que acontece quando o usuário da função não passa um argumento opcional."
      difficulty="iniciante"
      timeToRead="10 min"
    >
      <p>
        Pense num formulário de cadastro: se o usuário não escolher uma cor de tema, ele entra no app no tema "claro". Esse "claro" é o <strong>valor padrão</strong>. Em Dart, qualquer parâmetro opcional — nomeado (<code>&#123; &#125;</code>) ou posicional (<code>[ ]</code>) — pode ter um valor padrão. Quando o chamador omite o argumento, o padrão entra em ação. Resultado: a função vira nullable-free, mais segura e com chamadas mais limpas.
      </p>

      <h2>Sintaxe básica</h2>
      <p>
        Use <code>=</code> depois do nome do parâmetro para definir o padrão. O valor precisa ser uma <strong>constante de compilação</strong> — algo que o compilador (programa que valida o código) consegue calcular antes do programa rodar.
      </p>
      <pre><code>{`// Nomeado com defaults.
void configurar({
  bool darkMode = false,
  int volume = 50,
  String idioma = 'pt-BR',
}) {
  print('dark=\$darkMode vol=\$volume idioma=\$idioma');
}

// Posicional com defaults.
void repetir(String texto, [int vezes = 3]) {
  for (var i = 0; i < vezes; i++) {
    print(texto);
  }
}

void main() {
  configurar();                     // dark=false vol=50 idioma=pt-BR
  configurar(darkMode: true);       // dark=true  vol=50 idioma=pt-BR
  repetir('oi');                    // imprime 3 vezes
  repetir('oi', 5);                 // imprime 5 vezes
}`}</code></pre>

      <h2>O que conta como "constante de compilação"</h2>
      <p>
        Constantes de compilação são valores cujo resultado é conhecido antes do programa começar a rodar — números, strings literais, <code>true</code>/<code>false</code>, <code>null</code>, listas/maps/sets prefixados com <code>const</code> e construtores marcados como <code>const</code>.
      </p>
      <pre><code>{`const corPadrao = 0xFF2196F3;

class Config {
  const Config({this.tema = 'claro', this.fonte = 'Roboto'});
  final String tema;
  final String fonte;
}

void exemplo({
  int n = 10,                        // OK
  String s = 'oi',                   // OK
  List<int> nums = const [1, 2, 3],  // OK (const)
  Config c = const Config(),         // OK (construtor const)
  // List<int> ruim = [1, 2, 3],     // ERRO: não é const
  // int x = DateTime.now().hour,    // ERRO: roda em runtime
}) {}
`}</code></pre>

      <AlertBox type="info" title="Por que essa restrição?">
        Defaults precisam existir antes do programa rodar para o compilador inserir o mesmo valor em todas as chamadas. Algo como <code>DateTime.now()</code> só sabe seu valor depois que o programa começa, então não cabe ali.
      </AlertBox>

      <h2>A armadilha do mutável compartilhado</h2>
      <p>
        Cuidado: como o default é uma constante, todas as chamadas que omitem o parâmetro recebem <strong>a mesma instância</strong>. Isso é fonte clássica de bugs em listas e mapas.
      </p>
      <pre><code>{`void adicionar(int valor, [List<int> lista = const []]) {
  // ERRO em runtime: const list é imutável, .add() lança exceção.
  lista.add(valor);
}

void main() {
  // adicionar(1); // Unsupported operation: Cannot add to an unmodifiable list
}`}</code></pre>
      <p>
        A forma correta é aceitar <code>null</code> como sinal de "use uma lista nova" e criar a lista dentro do corpo da função. Esse padrão é tão comum que tem nome: <em>defensive default</em>.
      </p>
      <pre><code>{`void adicionar(int valor, [List<int>? lista]) {
  final l = lista ?? <int>[];
  l.add(valor);
  print(l);
}

void main() {
  adicionar(1);          // [1] — lista nova
  adicionar(2);          // [2] — outra lista nova, não compartilha
}`}</code></pre>

      <AlertBox type="warning" title="Nunca mute um default mutável">
        Se você precisa mutar a coleção/objeto recebido, NÃO o use como default. Aceite <code>null</code> e crie uma instância fresca dentro da função. Isso evita o bug de "todas as chamadas alterando a mesma lista".
      </AlertBox>

      <h2>Defaults e null-safety</h2>
      <p>
        Quando você dá um default, o tipo deixa de precisar do <code>?</code>. O compilador sabe que o parâmetro nunca será nulo dentro da função, então você não precisa fazer checagem.
      </p>
      <pre><code>{`String saudar({String nome = 'visitante'}) {
  // 'nome' é String (não String?). Pode ser usado direto.
  return 'Olá, \${nome.toUpperCase()}!';
}

void main() {
  print(saudar());                    // Olá, VISITANTE!
  print(saudar(nome: 'Ana'));         // Olá, ANA!
}`}</code></pre>

      <h2>Boas práticas com defaults</h2>
      <ul>
        <li>Use defaults para representar o caminho mais comum de uso.</li>
        <li>Para flags booleanas, prefira <code>false</code> como default — evita "magia escondida".</li>
        <li>Documente <em>por que</em> aquele é o default; meses depois você se agradece.</li>
        <li>Evite defaults que mudam o comportamento de forma surpreendente (ex.: <code>silent: true</code>).</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Default não-const</strong>: usar <code>[1, 2]</code> em vez de <code>const [1, 2]</code> dá erro de compilação.</li>
        <li><strong>Mutar default const</strong>: lança <code>Unsupported operation</code> em runtime.</li>
        <li><strong>Esperar valor dinâmico</strong>: <code>DateTime.now()</code> não pode ser default.</li>
        <li><strong>Confundir <code>=</code> com <code>:</code></strong>: o separador no default é <code>=</code>; o <code>:</code> é só na chamada de nomeado.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Defaults usam <code>=</code> e tornam o parâmetro opcional não-nulo.</li>
        <li>Só constantes de compilação são aceitas.</li>
        <li>Cuidado com defaults mutáveis: instância única compartilhada.</li>
        <li>Para mutáveis, use <code>null</code> como sentinela e crie a instância dentro da função.</li>
        <li>Bons defaults representam o caminho mais comum de uso.</li>
      </ul>
    </PageContainer>
  );
}
