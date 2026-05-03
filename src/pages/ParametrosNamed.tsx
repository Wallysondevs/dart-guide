import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function ParametrosNamed() {
  return (
    <PageContainer
      title="Parâmetros nomeados: chamadas que se autodocumentam"
      subtitle="Use chaves &#123; &#125; na assinatura para deixar a função mais legível e flexível."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine que você está pedindo um café num balcão. Se você diz "quero um café 350ml leite vegetal sem açúcar", o atendente entende. Mas se ele anotar como uma sequência fixa <em>(tamanho, leite, açúcar)</em>, na hora de outro cliente pedir só leite e tamanho ele se confunde. Em programação acontece o mesmo: passar argumentos só pela ordem fica confuso. Os <strong>parâmetros nomeados</strong> resolvem isso: você diz o nome do que está passando.
      </p>

      <h2>Sintaxe básica</h2>
      <p>
        Coloque os parâmetros nomeados dentro de <code>&#123; &#125;</code> na assinatura. Na chamada, use <code>nome:</code> antes do valor. Como podem ser omitidos por padrão, o tipo precisa ser <em>nullable</em> (<code>String?</code>) ou ter <code>required</code>/valor padrão.
      </p>
      <pre><code>{`// Definição: ambos opcionais (podem ser nulos).
void criar({String? nome, int? idade}) {
  print('Nome: \$nome, Idade: \$idade');
}

void main() {
  criar(nome: 'Ana', idade: 30);   // Nome: Ana, Idade: 30
  criar(idade: 25, nome: 'Bia');   // ordem livre
  criar(nome: 'Caio');             // idade fica null
  criar();                         // ambos null
}`}</code></pre>

      <AlertBox type="info" title="Nullable e null-safety">
        Em Dart 3, todo tipo é <em>não-nulo</em> por padrão. Para permitir <code>null</code>, adicione <code>?</code> no fim do tipo. Como argumentos nomeados podem ser omitidos, eles começam como <code>null</code> — daí a necessidade do <code>?</code>.
      </AlertBox>

      <h2>Tornando obrigatório com <code>required</code></h2>
      <p>
        Às vezes você quer a ergonomia do nome <em>e</em> a obrigação de informar. Use a palavra-chave <code>required</code> antes do tipo. Aí o parâmetro deixa de ser nullable e o compilador exige que você passe o valor.
      </p>
      <pre><code>{`class Pessoa {
  final String nome;
  final int idade;
  Pessoa({required this.nome, required this.idade});
}

void main() {
  final p = Pessoa(nome: 'Ana', idade: 30);
  // final p2 = Pessoa(nome: 'Bia'); // ERRO: idade é obrigatório
  print(p.nome);
}`}</code></pre>

      <h2>Valores padrão</h2>
      <p>
        Você pode dar um valor padrão para o parâmetro nomeado. Aí ele vira opcional <em>e</em> não-nulo. O valor padrão precisa ser uma <strong>constante de compilação</strong> (algo conhecido antes do programa rodar).
      </p>
      <pre><code>{`void enviarEmail({
  required String para,
  String assunto = '(sem assunto)',
  bool html = false,
  int prioridade = 1,
}) {
  print('Para: \$para | Assunto: \$assunto | HTML: \$html | Prio: \$prioridade');
}

void main() {
  enviarEmail(para: 'a@ex.com');
  enviarEmail(para: 'b@ex.com', assunto: 'Oi', prioridade: 5);
}`}</code></pre>

      <h2>Por que isso melhora seu código</h2>
      <p>
        Compare uma chamada posicional confusa com uma nomeada autoexplicativa. A nomeada não precisa de comentário — o próprio nome diz o que faz. É comum no Flutter: praticamente todo widget usa parâmetros nomeados.
      </p>
      <pre><code>{`// Posicional — fica difícil saber o que é cada coisa.
desenharRetangulo(50, 100, true, false, 5);

// Nomeada — autodocumentada.
desenharRetangulo(
  largura: 50,
  altura: 100,
  preenchido: true,
  borda: false,
  cantosArredondados: 5,
);`}</code></pre>

      <h2>Misturando posicional e nomeado</h2>
      <p>
        Você pode ter parâmetros posicionais <em>e</em> nomeados na mesma função. Os posicionais vêm primeiro; os nomeados vão dentro de <code>&#123; &#125;</code> no fim.
      </p>
      <pre><code>{`String formatar(String texto, {bool maiuscula = false, String prefixo = ''}) {
  final t = maiuscula ? texto.toUpperCase() : texto;
  return '\$prefixo\$t';
}

void main() {
  print(formatar('dart'));                          // dart
  print(formatar('dart', maiuscula: true));         // DART
  print(formatar('dart', prefixo: '>> '));          // >> dart
}`}</code></pre>

      <AlertBox type="warning" title="Não dá para chamar nomeado pela posição">
        Se um parâmetro está dentro de <code>&#123; &#125;</code>, ele <strong>tem</strong> que ser passado com <code>nome:</code>. Tentar passar só o valor (<code>criar('Ana', 30)</code>) gera erro de compilação.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>?</code></strong> num parâmetro nomeado sem <code>required</code> e sem default: o compilador acusa "The parameter must have a default value or be marked 'required'".</li>
        <li><strong>Default não-constante</strong>: <code>List l = []</code> em parâmetro nomeado falha; precisa ser <code>const []</code>.</li>
        <li><strong>Confundir <code>&#123; &#125;</code> da assinatura com <code>[ ]</code></strong>: chaves = nomeado; colchetes = posicional opcional.</li>
        <li><strong>Esquecer o <code>:</code></strong> na chamada: <code>criar(nome 'Ana')</code> dá erro de sintaxe.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Parâmetros nomeados ficam dentro de <code>&#123; &#125;</code> na assinatura.</li>
        <li>Por padrão são opcionais e nullable; use <code>required</code> ou um valor padrão para mudar isso.</li>
        <li>Na chamada, prefixe com <code>nome:</code>; a ordem é livre.</li>
        <li>Tornam o código autoexplicativo — padrão no Flutter.</li>
        <li>Defaults precisam ser constantes de compilação.</li>
      </ul>
    </PageContainer>
  );
}
