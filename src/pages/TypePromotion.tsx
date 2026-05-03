import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function TypePromotion() {
  return (
    <PageContainer
      title="Promoção de tipos: o compilador deduz por você"
      subtitle="Como o Dart &quot;reduz&quot; tipos automaticamente para você não precisar escrever cast em todo lugar."
      difficulty="intermediario"
      timeToRead="10 min"
    >
      <p>
        Imagine que você está num restaurante e o garçom anota seu pedido como &quot;uma bebida&quot;. Mais tarde, ao confirmar, ele descobre que é uma água com gás. A partir daí, ele para de tratar como uma &quot;bebida genérica&quot; e usa a informação mais específica — &quot;água com gás&quot; — para tudo que vier a seguir. Esse é o conceito de <strong>type promotion</strong> em Dart: quando o compilador (o tradutor que converte seu código em algo executável) deduz, com base em uma checagem, que uma variável é de um tipo mais específico, ele passa a tratá-la assim no resto do bloco — sem você precisar escrever <code>as</code>.
      </p>

      <h2>Promotion com <code>is</code></h2>
      <p>
        O operador <code>is</code> verifica se um valor pertence a um determinado tipo. Após um <code>if (x is Tipo)</code>, dentro do bloco, <code>x</code> é tratado <em>como</em> aquele tipo automaticamente.
      </p>
      <pre><code>{`Object dado = 'Olá';

if (dado is String) {
  // Aqui dentro, 'dado' é promovido a String.
  print(dado.length);          // ok: String tem .length
  print(dado.toUpperCase());   // ok
}
// Aqui fora, volta a ser Object.`}</code></pre>

      <h2>Promotion com <code>!= null</code></h2>
      <p>
        A mesma lógica se aplica a tipos nullable. Após verificar <code>x != null</code>, o compilador trata <code>x</code> como o tipo não-nulo equivalente.
      </p>
      <pre><code>{`String? nome;
nome = 'Bia';

if (nome != null) {
  print(nome.toUpperCase()); // promovido para String
}

// Outra forma idiomática:
final n = nome;
if (n != null) {
  print(n.length);
}`}</code></pre>

      <AlertBox type="info" title="Promotion não persiste fora do bloco">
        Após o <code>if</code>, a variável volta ao tipo original. Promotion vale apenas no <em>escopo</em> em que a evidência foi obtida — porque depois disso o valor poderia, em tese, ter mudado.
      </AlertBox>

      <h2>Quando o promotion falha: getters e campos mutáveis</h2>
      <p>
        Promotion só funciona com variáveis <strong>locais</strong>, parâmetros e campos finais privados. Se você acessa algo via getter ou campo público mutável, o compilador não tem como provar que entre a checagem e o uso o valor não mudou (em outra thread, em outro código, etc.). Nesses casos, ele se recusa a promover.
      </p>
      <pre><code>{`class Pessoa {
  String? apelido;            // campo público mutável
  String? get cargo => null;  // getter
}

void exemplo(Pessoa p) {
  if (p.apelido != null) {
    // print(p.apelido.length); // ERRO: não pode promover (campo mutável)
  }

  if (p.cargo != null) {
    // print(p.cargo.length); // ERRO: getter pode mudar entre chamadas
  }
}`}</code></pre>

      <h2>A solução: cópia local</h2>
      <p>
        O truque clássico é copiar o valor para uma variável local e operar nela:
      </p>
      <pre><code>{`void exemplo2(Pessoa p) {
  final apelido = p.apelido; // local: o compilador controla
  if (apelido != null) {
    print(apelido.length);   // promotion funciona perfeitamente
  }

  final cargo = p.cargo;
  if (cargo != null) {
    print(cargo.toUpperCase());
  }
}`}</code></pre>

      <AlertBox type="warning" title="Não confunda com o cast">
        Você poderia escrever <code>(p.apelido as String).length</code>, mas isso é arriscado: se for nulo, falha em runtime. A cópia local é mais segura e legível.
      </AlertBox>

      <h2>Promotion com sealed classes e patterns (Dart 3)</h2>
      <p>
        Em Dart 3, o sistema ficou ainda mais inteligente quando combinado com <strong>sealed classes</strong> (hierarquias fechadas) e <strong>patterns</strong> (padrões de correspondência). O compilador promove dentro de cada <code>case</code> automaticamente.
      </p>
      <pre><code>{`sealed class Forma {}
class Circulo extends Forma { final double raio; Circulo(this.raio); }
class Quadrado extends Forma { final double lado; Quadrado(this.lado); }

double area(Forma f) => switch (f) {
  Circulo(:final raio) => 3.14 * raio * raio,
  Quadrado(:final lado) => lado * lado,
};`}</code></pre>

      <h2>Promotion em laços e loops</h2>
      <p>
        O Dart consegue rastrear promotions através de fluxos: se você faz <code>return</code>, <code>throw</code> ou <code>continue</code> nos casos &quot;ruins&quot;, o resto do método herda a promoção.
      </p>
      <pre><code>{`String saudacao(String? nome) {
  if (nome == null) return 'Olá, anônimo!';
  // A partir daqui, nome é tratado como String não-nulo.
  return 'Olá, \${nome.toUpperCase()}!';
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esperar promotion em campos públicos mutáveis</strong> — não acontece. Use cópia local.</li>
        <li><strong>Misturar promotion com closures</strong>: dentro de um callback, a variável pode ter mudado. Promotion é &quot;perdida&quot;.</li>
        <li><strong>Usar <code>as</code> desnecessário</strong> quando promotion já resolveria — ruído visual.</li>
        <li><strong>Promotion após <code>else</code></strong>: depois de <code>if (x is String) ... else &#123; /* aqui x NÃO é String */ &#125;</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Promotion automática após <code>is</code> e <code>!= null</code>.</li>
        <li>Funciona em locais, parâmetros e campos finais privados.</li>
        <li>Em getters/campos mutáveis: copie para uma variável local antes.</li>
        <li>Combina lindamente com sealed classes e patterns no Dart 3.</li>
      </ul>
    </PageContainer>
  );
}
