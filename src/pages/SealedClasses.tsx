import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function SealedClasses() {
  return (
    <PageContainer
      title="Sealed classes: hierarquias fechadas e exaustivas"
      subtitle="Quando você quer dizer ao compilador: &quot;essas são TODAS as opções possíveis, não invente outras&quot;."
      difficulty="avancado"
      timeToRead="13 min"
    >
      <p>
        Imagine um cardápio de uma cafeteria com apenas três opções: <em>expresso</em>, <em>cappuccino</em> e <em>latte</em>. Não há &quot;outros&quot;. Se um cliente perguntar por chá, a resposta é &quot;não servimos&quot;. Em programação, hierarquias assim — onde existe um conjunto <em>fixo e fechado</em> de variantes — são chamadas de <strong>tipos algébricos de dados</strong> (ADTs, do inglês <em>Algebraic Data Types</em>). O Dart 3 trouxe a palavra-chave <code>sealed</code> exatamente para isso: declarar classes cuja hierarquia está &quot;selada&quot; — ninguém de fora pode criar um novo subtipo.
      </p>

      <h2>O que sealed faz por debaixo</h2>
      <p>
        Uma classe <code>sealed</code> tem três propriedades fundamentais:
      </p>
      <ul>
        <li>É <strong>abstrata</strong>: você não consegue instanciá-la diretamente.</li>
        <li>Só pode ser <strong>estendida ou implementada no mesmo arquivo</strong>. Outro arquivo não consegue criar subclasses.</li>
        <li>O compilador (programa que valida e traduz seu código) sabe <em>todos</em> os subtipos e usa essa informação para fazer <strong>checagem exaustiva</strong> em <code>switch</code>.</li>
      </ul>
      <pre><code>{`// arquivo: resultado.dart
sealed class Resultado<T> {}

class Sucesso<T> extends Resultado<T> {
  final T valor;
  Sucesso(this.valor);
}

class Erro<T> extends Resultado<T> {
  final String mensagem;
  Erro(this.mensagem);
}

// Em outro arquivo, isso seria proibido:
// class Carregando<T> extends Resultado<T> {} // ERRO`}</code></pre>

      <h2>Switch exaustivo: a grande vantagem</h2>
      <p>
        Como o compilador conhece todas as variantes, ele exige que você trate cada uma. Se um dia você adicionar um novo subtipo, todos os <code>switch</code> existentes ficam com erro de compilação — forçando você a atualizar todas as chamadas. Refatoração segura.
      </p>
      <pre><code>{`String descrever<T>(Resultado<T> r) => switch (r) {
  Sucesso(:final valor) => 'OK: \$valor',
  Erro(:final mensagem) => 'Falha: \$mensagem',
};

void main() {
  print(descrever(Sucesso(42)));            // OK: 42
  print(descrever(Erro<int>('timeout')));   // Falha: timeout
}`}</code></pre>

      <AlertBox type="info" title="Sem default necessário">
        Como sealed garante que <code>Sucesso</code> e <code>Erro</code> são as únicas opções, o switch fica sem <code>default</code>. Se você adicionar <code>Carregando</code>, o compilador grita: &quot;ei, você esqueceu de tratar o novo caso&quot;. Isso é segurança que enum não dá quando precisa carregar dados.
      </AlertBox>

      <h2>Sealed vs enum: quando escolher</h2>
      <p>
        <code>enum</code> é ótimo para um conjunto fixo de <em>valores</em> simples (cores, dias da semana). Mas se cada variante precisa carregar <em>dados diferentes</em>, sealed classes são a escolha certa.
      </p>
      <pre><code>{`// Enum: valores simples sem dados extras
enum Status { pendente, aprovado, rejeitado }

// Sealed: cada variante carrega informação distinta
sealed class Evento {}
class Clique extends Evento { final int x, y; Clique(this.x, this.y); }
class Tecla extends Evento { final String letra; Tecla(this.letra); }
class Scroll extends Evento { final double delta; Scroll(this.delta); }

void tratar(Evento e) {
  switch (e) {
    case Clique(:final x, :final y): print('clique \$x,\$y');
    case Tecla(:final letra):        print('tecla \$letra');
    case Scroll(:final delta):       print('scroll \$delta');
  }
}`}</code></pre>

      <h2>Result&lt;T, E&gt;: o padrão clássico</h2>
      <p>
        Um dos usos mais populares é representar &quot;sucesso ou falha&quot; sem recorrer a exceções. Vem das linguagens funcionais (Rust, Swift, Haskell) e é uma das melhores formas de tornar erros <strong>visíveis no tipo de retorno</strong>.
      </p>
      <pre><code>{`sealed class Resultado<S, F> {
  const Resultado();
}

class Ok<S, F> extends Resultado<S, F> {
  final S valor;
  const Ok(this.valor);
}

class Falha<S, F> extends Resultado<S, F> {
  final F erro;
  const Falha(this.erro);
}

// Função que comunica explicitamente que pode falhar:
Resultado<int, String> dividir(int a, int b) {
  if (b == 0) return const Falha('divisão por zero');
  return Ok(a ~/ b);
}

void main() {
  final r = dividir(10, 0);
  final mensagem = switch (r) {
    Ok(:final valor) => 'resultado: \$valor',
    Falha(:final erro) => 'erro: \$erro',
  };
  print(mensagem);
}`}</code></pre>

      <h2>Estados de UI em Flutter</h2>
      <p>
        Um padrão excelente em Flutter (o framework gráfico do Dart, onde tudo é um <strong>widget</strong> — um componente visual) é modelar o estado de uma tela como sealed classes. Cada estado é uma variante e o switch garante que você desenhe todas elas:
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

sealed class EstadoTela<T> {}
class Carregando<T> extends EstadoTela<T> {}
class Pronto<T> extends EstadoTela<T> { final T dados; Pronto(this.dados); }
class Falhou<T> extends EstadoTela<T> { final String msg; Falhou(this.msg); }

class TelaUsuario extends StatelessWidget {
  final EstadoTela<String> estado;
  const TelaUsuario({super.key, required this.estado});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Usuário')),
      body: Center(child: switch (estado) {
        Carregando() => const CircularProgressIndicator(),
        Pronto(:final dados) => Text('Olá, \$dados',
            style: Theme.of(context).textTheme.headlineMedium),
        Falhou(:final msg) => Text('Erro: \$msg',
            style: const TextStyle(color: Colors.red)),
      }),
    );
  }
}`}</code></pre>

      <AlertBox type="warning" title="Mesmo arquivo, sempre">
        Sealed classes só permitem subtipos no mesmo arquivo (.dart). Se você tentar herdar em outro arquivo, o compilador rejeita — essa restrição é o que garante a exaustividade. Se quiser hierarquias abertas, use <code>abstract class</code> normal.
      </AlertBox>

      <h2>Combinação com generics</h2>
      <p>
        Sealed funciona naturalmente com generics, e o compilador continua sabendo todos os subtipos. Padrão muito usado em bibliotecas como <code>fpdart</code>, <code>result_dart</code>, etc.
      </p>
      <pre><code>{`sealed class Opcao<T> {
  const Opcao();
}

class Algum<T> extends Opcao<T> {
  final T valor;
  const Algum(this.valor);
}

class Nada<T> extends Opcao<T> {
  const Nada();
}

T ouPadrao<T>(Opcao<T> o, T padrao) => switch (o) {
  Algum(:final valor) => valor,
  Nada() => padrao,
};

void main() {
  print(ouPadrao(const Algum(10), 0));   // 10
  print(ouPadrao(const Nada<int>(), 0)); // 0
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Tentar criar subtipo em outro arquivo</strong>: violação direta do contrato sealed.</li>
        <li><strong>Esquecer de tratar um caso novo</strong>: o compilador avisa — agradeça e atualize.</li>
        <li><strong>Usar enum quando precisava de dados por variante</strong>: enum não carrega dados ricos; sealed sim.</li>
        <li><strong>Misturar sealed com hierarquias profundas</strong>: prefira árvores rasas; senão fica difícil exaurir.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>sealed class</code> declara hierarquia fechada — subtipos só no mesmo arquivo.</li>
        <li>Switch exaustivo: o compilador exige tratar todos os subtipos.</li>
        <li>Substitui o padrão Result/Either de linguagens funcionais.</li>
        <li>Excelente para modelar estados de UI em Flutter.</li>
        <li>Use enum para valores simples; sealed quando cada variante carrega dados próprios.</li>
      </ul>
    </PageContainer>
  );
}
