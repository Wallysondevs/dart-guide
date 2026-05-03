import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LayoutRowColumn() {
  return (
    <PageContainer
      title="Layout básico: Row, Column, Expanded e Flexible"
      subtitle="Como organizar widgets em linhas e colunas, alinhar conteúdo e dividir o espaço disponível."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Pense em arrumar livros em uma estante. Você pode empilhar verticalmente (uns sobre os outros) ou enfileirar horizontalmente (lado a lado). Em Flutter, esses dois movimentos são feitos por dois widgets primários: <code>Column</code> empilha de cima para baixo, <code>Row</code> coloca da esquerda para a direita. Tudo o que envolve "vários widgets juntos" começa por aqui — e dominar esses dois (mais seus ajudantes <code>Expanded</code> e <code>Flexible</code>) resolve 70% dos layouts do dia a dia.
      </p>

      <h2>Column: empilhar verticalmente</h2>
      <p>
        <code>Column</code> recebe uma lista de filhos (<code>children</code>) e os organiza um abaixo do outro. Por padrão, ela tenta ocupar a altura inteira disponível e cada filho fica do tamanho que precisa.
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class TelaPerfil extends StatelessWidget {
  const TelaPerfil({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Perfil')),
      body: const Column(
        children: [
          Text('Nome: Ana Souza'),
          Text('Idade: 28'),
          Text('Cidade: Belo Horizonte'),
        ],
      ),
    );
  }
}`}</code></pre>

      <h2>Row: enfileirar horizontalmente</h2>
      <p>
        <code>Row</code> faz a mesma coisa, mas no eixo horizontal. Atenção: se o conteúdo total for maior que a tela, ele <strong>não quebra linha</strong> sozinho como em CSS — gera o famoso aviso amarelo-listrado de overflow. Para conteúdo dinâmico considere <code>Wrap</code>.
      </p>
      <pre><code>{`Row(
  children: const [
    Icon(Icons.star, color: Colors.amber),
    Icon(Icons.star, color: Colors.amber),
    Icon(Icons.star_border),
    Text('  3 de 5'),
  ],
)`}</code></pre>

      <h2>Alinhamento: <code>mainAxisAlignment</code> e <code>crossAxisAlignment</code></h2>
      <p>
        Cada layout tem dois eixos: o <strong>principal</strong> (vertical na Column, horizontal na Row) e o <strong>cruzado</strong> (perpendicular). Você controla onde os filhos ficam em cada um:
      </p>
      <ul>
        <li><code>mainAxisAlignment</code>: <code>start</code>, <code>center</code>, <code>end</code>, <code>spaceBetween</code> (sobra dividida entre filhos), <code>spaceAround</code>, <code>spaceEvenly</code>.</li>
        <li><code>crossAxisAlignment</code>: <code>start</code>, <code>center</code>, <code>end</code>, <code>stretch</code> (estica até as bordas).</li>
      </ul>
      <pre><code>{`Column(
  // Distribui igualmente o espaço sobrando.
  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
  // Alinha cada filho à esquerda da Column.
  crossAxisAlignment: CrossAxisAlignment.start,
  children: const [
    Text('Topo'),
    Text('Meio'),
    Text('Fim'),
  ],
)`}</code></pre>

      <AlertBox type="info" title="Confusão comum dos eixos">
        Lembre-se: na Column o eixo PRINCIPAL é vertical, então <code>mainAxisAlignment.center</code> centraliza VERTICALMENTE. Na Row é o contrário. Sempre se pergunte &quot;qual é o eixo principal aqui?&quot; antes de escolher.
      </AlertBox>

      <h2>Expanded: ocupe o resto que sobrar</h2>
      <p>
        Quando você tem três filhos numa Row e quer que UM deles ocupe todo o espaço restante (como o título ao lado de dois ícones na AppBar), envolva-o em <code>Expanded</code>. Ele "explode" para preencher o que ficou.
      </p>
      <pre><code>{`Row(
  children: [
    const Icon(Icons.menu),
    Expanded(
      // Esse Container vai esticar e preencher o meio.
      child: Container(
        height: 40,
        color: Colors.indigo.shade100,
        alignment: Alignment.center,
        child: const Text('Título centralizado'),
      ),
    ),
    const Icon(Icons.search),
  ],
)`}</code></pre>

      <h2>Flexible com flex: dividir proporcionalmente</h2>
      <p>
        <code>Flexible</code> é primo do <code>Expanded</code>, mas o filho pode ser menor que o espaço (Expanded força a ocupar tudo). O parâmetro <code>flex</code> define a <em>proporção</em>: se você tem três filhos com flex 1, 2 e 1, eles dividem o espaço em 1/4, 2/4 e 1/4.
      </p>
      <pre><code>{`Row(
  children: [
    Flexible(
      flex: 1,
      child: Container(color: Colors.red, height: 50),
    ),
    Flexible(
      flex: 2,
      child: Container(color: Colors.green, height: 50),
    ),
    Flexible(
      flex: 1,
      child: Container(color: Colors.blue, height: 50),
    ),
  ],
)
// Resultado: vermelho 25% | verde 50% | azul 25% da largura.`}</code></pre>

      <AlertBox type="warning" title="Expanded só funciona dentro de Row/Column/Flex">
        Colocar <code>Expanded</code> diretamente dentro de um <code>Container</code> ou <code>SingleChildScrollView</code> lança erro em runtime: &quot;Incorrect use of ParentDataWidget&quot;. Esses widgets precisam de um pai com restrição de tamanho conhecida.
      </AlertBox>

      <h2>Exemplo prático: formulário de login</h2>
      <pre><code>{`class TelaLogin extends StatelessWidget {
  const TelaLogin({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('Entrar', style: TextStyle(fontSize: 28)),
            const SizedBox(height: 24),
            const TextField(
              decoration: InputDecoration(labelText: 'E-mail'),
            ),
            const SizedBox(height: 12),
            const TextField(
              obscureText: true,
              decoration: InputDecoration(labelText: 'Senha'),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {},
                    child: const Text('Cancelar'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  flex: 2,
                  child: FilledButton(
                    onPressed: () {},
                    child: const Text('Entrar'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Overflow amarelo-preto</strong>: conteúdo da Row/Column maior que a tela. Use <code>Expanded</code>, <code>Flexible</code>, <code>Wrap</code> ou envolva em <code>SingleChildScrollView</code>.</li>
        <li><strong>Trocar os eixos</strong>: usar <code>mainAxisAlignment</code> achando que é horizontal quando está numa Column.</li>
        <li><strong>Expanded fora de Flex</strong>: precisa estar direto dentro de Row/Column/Flex.</li>
        <li><strong>Esquecer <code>SizedBox</code> entre itens</strong>: gera UI grudada. Use <code>SizedBox(height: 8)</code> ou <code>spacing</code> em Column/Row do Flutter 3.27+.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>Column</code> empilha vertical; <code>Row</code> enfileira horizontal.</li>
        <li><code>mainAxisAlignment</code> = eixo principal; <code>crossAxisAlignment</code> = perpendicular.</li>
        <li><code>Expanded</code> força filho a ocupar todo o espaço restante.</li>
        <li><code>Flexible</code> + <code>flex</code> divide o espaço proporcionalmente.</li>
        <li>Para evitar overflow horizontal use <code>Wrap</code>; vertical use <code>SingleChildScrollView</code>.</li>
      </ul>
    </PageContainer>
  );
}
