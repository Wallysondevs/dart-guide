import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function Records() {
  return (
    <PageContainer
      title="Records: tuplas tipadas em Dart 3"
      subtitle="Como agrupar valores rapidamente, sem precisar criar uma classe inteira."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Imagine que você precisa anotar rapidamente um endereço temporário num post-it: número da casa e nome da rua. Você não vai abrir um cartório e registrar uma &quot;classe Endereço&quot; só para isso. É só uma anotação rápida, com dois pedaços de informação. Em Dart 3, os <strong>records</strong> são exatamente esse post-it: uma forma rápida e segura de agrupar dois ou mais valores sem precisar declarar uma classe completa. Eles nasceram para resolver casos onde antes a gente usava <code>List</code>, <code>Map</code> ou inventava classes minúsculas só para devolver várias coisas de uma função.
      </p>

      <h2>Sintaxe básica: parênteses</h2>
      <p>
        Records são escritos com parênteses, separando os valores por vírgula. O tipo é uma assinatura paralela com os tipos dos campos.
      </p>
      <pre><code>{`// Record posicional: dois inteiros e uma string
final ponto = (10, 20, 'origem');

// Tipo declarado:
(int, int, String) p = (5, 8, 'A');

print(p.\$1); // 5  — acesso por posição (\$1, \$2, \$3...)
print(p.\$2); // 8
print(p.\$3); // A`}</code></pre>

      <h2>Records nomeados</h2>
      <p>
        Para deixar o código mais legível, você pode dar nomes aos campos. A sintaxe troca a vírgula por chaves dentro do tipo:
      </p>
      <pre><code>{`// Record com campos nomeados
final pessoa = (nome: 'Ana', idade: 30);

// Tipo:
({String nome, int idade}) p2 = (nome: 'Bia', idade: 25);

print(p2.nome);  // Bia  — acesso por nome
print(p2.idade); // 25

// Misto: posicional + nomeado
(int, int, {String rotulo}) coord = (3, 4, rotulo: 'pico');
print(coord.\$1);     // 3
print(coord.rotulo);  // pico`}</code></pre>

      <AlertBox type="info" title="Quando usar nomeado vs posicional">
        Use <strong>nomeado</strong> quando os campos têm significado claro (nome, idade). Use <strong>posicional</strong> para coisas inerentemente ordenadas (coordenadas x/y) ou efêmeras.
      </AlertBox>

      <h2>Retornar múltiplos valores</h2>
      <p>
        Esse é o caso de uso mais comum. Antes do Dart 3, para devolver, digamos, &quot;mínimo e máximo&quot; de uma lista, você precisava criar uma classe ou usar uma <code>List</code> sem tipos claros. Agora basta um record:
      </p>
      <pre><code>{`(int min, int max) extremos(List<int> nums) {
  var min = nums.first, max = nums.first;
  for (final n in nums) {
    if (n < min) min = n;
    if (n > max) max = n;
  }
  return (min: min, max: max);
}

void main() {
  final r = extremos([3, 7, 1, 9, 4]);
  print('mín=\${r.min}, máx=\${r.max}'); // mín=1, máx=9
}`}</code></pre>

      <h2>Destructuring: extraindo na hora</h2>
      <p>
        Records combinam com <strong>patterns</strong> (padrões de correspondência), permitindo extrair os valores em variáveis separadas em uma linha — chamamos isso de <em>destructuring</em>.
      </p>
      <pre><code>{`final ponto = (10, 20);
final (x, y) = ponto;     // destructuring posicional
print('\$x, \$y');          // 10, 20

final pessoa = (nome: 'Caco', idade: 40);
final (:nome, :idade) = pessoa; // destructuring nomeado
print('\$nome tem \$idade');     // Caco tem 40

// Direto no retorno da função:
final (:min, :max) = extremos([5, 1, 9]);
print('\$min..\$max');     // 1..9`}</code></pre>

      <h2>Comparação por valor</h2>
      <p>
        Diferente de objetos comuns (cuja igualdade compara identidade — &quot;são a mesma instância?&quot;), records comparam <strong>por valor</strong>: dois records com os mesmos campos e valores são iguais.
      </p>
      <pre><code>{`final a = (1, 2);
final b = (1, 2);
print(a == b);          // true: mesmos valores
print(a.hashCode == b.hashCode); // true: igual hashCode

class Par { final int x, y; Par(this.x, this.y); }
final p1 = Par(1, 2);
final p2 = Par(1, 2);
print(p1 == p2);        // false: instâncias diferentes`}</code></pre>

      <AlertBox type="warning" title="Records são imutáveis">
        Não é possível alterar um campo de um record após criação. Se precisar &quot;mudar&quot;, crie um novo record. Para mutação, use uma classe.
      </AlertBox>

      <h2>Records vs classes: quando escolher cada um</h2>
      <p>
        Records são ótimos para dados <em>efêmeros</em>, sem comportamento. Quando o conjunto de campos vai aparecer em vários lugares do código, ou tem métodos associados, prefira uma classe.
      </p>
      <pre><code>{`// Record: rápido, descartável
(double, double) calcularCentro(List<(double, double)> pts) {
  var sx = 0.0, sy = 0.0;
  for (final (x, y) in pts) { sx += x; sy += y; }
  return (sx / pts.length, sy / pts.length);
}

// Classe: quando o conceito merece nome próprio
class Coordenada {
  final double lat, lng;
  const Coordenada(this.lat, this.lng);
  double distancia(Coordenada outra) =>
      ((lat - outra.lat) * (lat - outra.lat) +
       (lng - outra.lng) * (lng - outra.lng));
}`}</code></pre>

      <h2>Records em coleções</h2>
      <p>
        Como records têm igualdade por valor, eles funcionam perfeitamente como chaves de mapas e elementos de sets:
      </p>
      <pre><code>{`final cache = <(String, int), String>{};
cache[('user', 1)] = 'Ana';
cache[('user', 2)] = 'Bia';
print(cache[('user', 1)]); // Ana

final visitados = <(int, int)>{};
visitados.add((0, 0));
visitados.add((0, 0)); // não duplica: igual ao anterior
print(visitados.length); // 1`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar mutar um campo</strong>: records são imutáveis — crie um novo.</li>
        <li><strong>Acessar campo posicional inexistente</strong>: <code>r.$3</code> falha em compilação se o tipo só tem 2 campos.</li>
        <li><strong>Esquecer da vírgula em record de 1 elemento</strong>: <code>(5)</code> é só agrupamento; <code>(5,)</code> é um record.</li>
        <li><strong>Usar record onde uma classe seria mais clara</strong> — se o conceito tem nome, dê o nome.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Records agrupam valores: <code>(int, String)</code> ou <code>(&#123;String nome, int idade&#125;)</code>.</li>
        <li>Acesso por posição: <code>r.$1</code>; por nome: <code>r.nome</code>.</li>
        <li>Destructuring: <code>final (a, b) = par;</code> e <code>final (:nome) = obj;</code>.</li>
        <li>Comparados por valor; perfeitos como chaves de Map e elementos de Set.</li>
        <li>Use para dados efêmeros; classes para conceitos com nome próprio.</li>
      </ul>
    </PageContainer>
  );
}
