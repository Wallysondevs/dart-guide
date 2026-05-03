import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function CollectionIfFor() {
  return (
    <PageContainer
      title="Collection if e for: literais inteligentes"
      subtitle="Construa listas, sets e maps com lógica embutida — adeus, código verboso."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Uma das características mais elegantes do Dart é poder colocar <strong>if</strong> e <strong>for</strong> <em>dentro</em> dos literais de coleção. Isso é especialmente útil quando você está montando uma lista de widgets em Flutter ou um Map de configuração: em vez de criar uma lista vazia, fazer vários <code>add</code> condicionais, e devolver, você descreve o resultado em uma única expressão limpa.
      </p>

      <h2>Spread (<code>...</code>) — &quot;desempacotar&quot; coleções</h2>
      <p>
        O operador <code>...</code> insere todos os elementos de outra coleção dentro de um literal. É como esvaziar um saco de bolinhas dentro de outro maior:
      </p>
      <pre><code>{`final base = [1, 2, 3];
final completa = [0, ...base, 4, 5];
print(completa); // [0, 1, 2, 3, 4, 5]

// Com Map também:
final defaults = {'tema': 'claro', 'idioma': 'pt'};
final config = {...defaults, 'tema': 'escuro'};
print(config); // {tema: escuro, idioma: pt}
// Repare: a chave 'tema' do segundo prevalece.`}</code></pre>

      <h2>Spread null-aware (<code>...?</code>)</h2>
      <p>
        Se a coleção a ser desempacotada pode ser <code>null</code>, use <code>...?</code> em vez de <code>...</code>. Quando a coleção é nula, ela é simplesmente ignorada — sem necessidade de <code>if</code> defensivo:
      </p>
      <pre><code>{`List<String>? extras;
final lista = ['a', 'b', ...?extras, 'c'];
print(lista); // [a, b, c]

extras = ['x', 'y'];
final lista2 = ['a', 'b', ...?extras, 'c'];
print(lista2); // [a, b, x, y, c]`}</code></pre>

      <AlertBox type="info" title="Diferença sutil">
        <code>...lista</code> exige que <code>lista</code> seja não-nula. <code>...?lista</code> aceita <code>null</code> e ignora. Use o segundo quando a fonte realmente pode faltar.
      </AlertBox>

      <h2>Collection if</h2>
      <p>
        Você pode escrever <code>if (condição) elemento</code> dentro de um literal. Se a condição for verdadeira, o elemento entra; se for falsa, ele simplesmente não aparece. Suporta também <code>else</code>:
      </p>
      <pre><code>{`final isAdmin = true;
final logado = true;

final menu = [
  'Início',
  'Perfil',
  if (logado) 'Sair' else 'Entrar',
  if (isAdmin) 'Painel admin',
];
print(menu); // [Início, Perfil, Sair, Painel admin]

// Em Map:
final headers = {
  'Content-Type': 'application/json',
  if (token != null) 'Authorization': 'Bearer \$token',
};`}</code></pre>

      <h2>Collection for</h2>
      <p>
        E você pode iterar dentro de um literal: <code>for (var x in fonte) elemento</code>. Cada iteração contribui com um (ou mais, se combinar com spread) elemento.
      </p>
      <pre><code>{`final base = [1, 2, 3];
final dobrado = [for (final x in base) x * 2];
print(dobrado); // [2, 4, 6]

// Filtrar + transformar combinando if + for:
final pares = [for (final x in base) if (x.isEven) x * 10];

// Para até virar &quot;table de multiplicação&quot;:
final tabela = [
  for (var i = 1; i <= 3; i++)
    for (var j = 1; j <= 3; j++)
      '\$i x \$j = \${i * j}'
];

// for-in produzindo MapEntry:
final precos = {
  for (final p in [('pão', 5), ('leite', 6)]) p.\$1: p.\$2,
};
print(precos); // {pão: 5, leite: 6}`}</code></pre>

      <h2>Combinando tudo: poder máximo</h2>
      <p>
        A graça é que spread, if e for são <em>composáveis</em>. Você combina como quiser dentro do mesmo literal:
      </p>
      <pre><code>{`final principais = ['Início', 'Sobre'];
final secaoAdmin = ['Usuários', 'Logs'];
final isAdmin = true;
List<String>? extras;

final menu = [
  ...principais,
  if (isAdmin) ...secaoAdmin,
  for (final s in ['Contato', 'Ajuda'])
    if (s.length > 4) s,
  ...?extras,
];
print(menu); // [Início, Sobre, Usuários, Logs, Contato]`}</code></pre>

      <h2>O caso de ouro: widgets em Flutter</h2>
      <p>
        É em Flutter que essas features brilham. Construir o <code>children:</code> de uma <code>Column</code> com botões condicionais ficaria horrível com <code>add</code> manual. Veja como fica natural:
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class TelaInicial extends StatelessWidget {
  final bool logado;
  final List<String> notificacoes;
  const TelaInicial({super.key, required this.logado, required this.notificacoes});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Bem-vindo')),
      body: Column(
        children: [
          const Text('Olá!'),
          if (logado) const Text('Você está conectado.')
          else const Text('Faça login para continuar.'),

          // Lista todas as notificações como tiles.
          for (final n in notificacoes) ListTile(title: Text(n)),

          // Spread de uma lista pré-construída de botões.
          ...[
            ElevatedButton(onPressed: () {}, child: const Text('Configurações')),
            ElevatedButton(onPressed: () {}, child: const Text('Sair')),
          ],
        ],
      ),
    );
  }
}`}</code></pre>

      <AlertBox type="warning" title="Não exagere">
        Literais com if/for/spread são fantásticos para descrever <em>estrutura</em>. Mas se a lógica fica complexa (vários ifs aninhados, múltiplos fors), considere extrair para uma função/método que devolve a lista — fica mais legível.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer o <code>?</code> no spread null-aware</strong> e tomar <code>NullPointerException</code> em coleção opcional.</li>
        <li><strong>Usar <code>else</code> separado</strong>: a sintaxe é <code>if (...) a else b</code> dentro do literal — não é um statement <code>else &#123; ... &#125;</code>.</li>
        <li><strong>Confundir collection-for com expressão</strong>: o &quot;corpo&quot; precisa ser uma <em>expressão</em>, não vários statements; encadeie ifs/fors em vez disso.</li>
        <li><strong>Misturar spread incompatível</strong>: você não pode dar spread de <code>List&lt;int&gt;</code> dentro de um <code>List&lt;String&gt;</code>.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>...</code> e <code>...?</code> desempacotam coleções dentro de literais.</li>
        <li><code>if (cond) elem</code> inclui elementos condicionalmente.</li>
        <li><code>for (var x in src) elem</code> itera dentro do literal.</li>
        <li>Tudo é composável e combinável em qualquer ordem.</li>
        <li>Em Flutter, é o jeito idiomático de montar listas de widgets dinâmicas.</li>
      </ul>
    </PageContainer>
  );
}
