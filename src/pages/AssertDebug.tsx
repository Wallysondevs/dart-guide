import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function AssertDebug() {
  return (
    <PageContainer
      title="assert e debug-only checks"
      subtitle="Como deixar &quot;armadilhas&quot; no código que disparam só em desenvolvimento, sem custo nenhum em produção."
      difficulty="intermediario"
      timeToRead="9 min"
    >
      <p>
        Imagine um operário montando um motor: ele coloca peças magnéticas que <em>grudam</em> em qualquer parafuso fora do lugar enquanto a fábrica testa o protótipo. Quando o carro entra em produção em massa, esses ímãs são retirados — eles existiam só para flagrar erros durante a montagem. <strong><code>assert</code></strong> em Dart faz exatamente isso: insere checagens que disparam em desenvolvimento e <em>somem completamente</em> no build final.
      </p>

      <h2>O que é <code>assert</code>?</h2>
      <p>
        <code>assert(condicao)</code> avalia a condição. Se for <code>true</code>, segue em frente. Se for <code>false</code>, lança um <code>AssertionError</code>. A diferença para um <code>if + throw</code> normal é que o compilador <strong>remove</strong> a chamada inteira em modo release — zero impacto em performance, zero linha no binário.
      </p>
      <pre><code>{`int dividir(int a, int b) {
  assert(b != 0, 'b nao pode ser zero');
  return a ~/ b;
}

void main() {
  print(dividir(10, 2));   // 5
  print(dividir(10, 0));   // em debug: AssertionError; em release: pode dar
                            // resultado errado ou crashar mais embaixo
}`}</code></pre>

      <h2>Quando o assert dispara?</h2>
      <p>
        Depende do <em>modo</em> em que seu código está rodando:
      </p>
      <ul>
        <li><strong>Dart CLI:</strong> asserts só rodam se você passar <code>--enable-asserts</code> (ou <code>dart run --enable-asserts</code>). Por padrão, são ignorados.</li>
        <li><strong><code>dart test</code>:</strong> asserts são <em>habilitados automaticamente</em> — ótimo, falha rápido.</li>
        <li><strong>Flutter em debug</strong> (<code>flutter run</code>): habilitados.</li>
        <li><strong>Flutter em profile/release</strong> (<code>flutter run --release</code>, <code>flutter build apk</code>): <strong>desabilitados</strong> e removidos do binário.</li>
      </ul>
      <pre><code>{`# Roda assertions explicitamente:
dart --enable-asserts run bin/app.dart

# Sem o flag, os assert sao ignorados:
dart run bin/app.dart

# Em testes, sempre rodam:
dart test`}</code></pre>

      <AlertBox type="info" title="Por que dois modos?">
        Em desenvolvimento, queremos <em>falhar barulhento</em> ao primeiro sinal de problema. Em produção, queremos <em>velocidade máxima</em>. <code>assert</code> oferece o melhor dos dois mundos: validação agressiva enquanto se programa, código enxuto na entrega.
      </AlertBox>

      <h2>Mensagem opcional: assert com explicação</h2>
      <p>
        O segundo argumento de <code>assert</code> é uma mensagem (ou uma função que devolve um) — aparece quando a condição falha. Use sempre: <em>&quot;condição X falhou&quot;</em> dá zero pista do que estava acontecendo.
      </p>
      <pre><code>{`void aplicarDesconto(double preco, double percentual) {
  assert(preco > 0, 'preco deve ser positivo, recebido: \$preco');
  assert(
    percentual >= 0 && percentual <= 1,
    'percentual deve estar entre 0 e 1, recebido: \$percentual',
  );
  // ... logica
}`}</code></pre>

      <h2>Para invariantes, não validações de usuário</h2>
      <p>
        A regra de ouro: <strong>use <code>assert</code> para coisas que NUNCA deveriam ser falsas se o código estiver correto</strong>. Você não usa para validar input de usuário ou dados de rede — esses são casos esperados (Exception, lembra?). Use para flagrar bugs internos.
      </p>
      <pre><code>{`// CORRETO: invariante interna
class Pilha<T> {
  final _itens = <T>[];

  T pop() {
    final t = _itens.removeLast();
    assert(_itens.length >= 0, 'tamanho ficou negativo (impossivel)');
    return t;
  }
}

// ERRADO: validacao de input externo
void cadastrar(String email) {
  // NAO use assert para isso — em release some, e usuario passa email invalido!
  // assert(email.contains('@'));

  // Faca:
  if (!email.contains('@')) {
    throw FormatException('email invalido', email);
  }
}`}</code></pre>

      <AlertBox type="warning" title="Assert não substitui validação">
        Em release, <code>assert</code> é removido. Se a checagem é importante para a <em>segurança</em> ou <em>integridade dos dados</em> em produção, use <code>if (...) throw</code>, nunca <code>assert</code>.
      </AlertBox>

      <h2>Padrões úteis em Flutter</h2>
      <p>
        Em widgets, <code>assert</code> é usado o tempo todo para validar combinações de parâmetros que só fazem sentido em desenvolvimento. Por exemplo, exigir que <em>exatamente um</em> de dois parâmetros opcionais venha preenchido:
      </p>
      <pre><code>{`import 'package:flutter/widgets.dart';

class IconeOuTexto extends StatelessWidget {
  final IconData? icone;
  final String? texto;

  const IconeOuTexto({super.key, this.icone, this.texto})
      : assert(
          (icone == null) != (texto == null),
          'Forneca exatamente um: icone OU texto.',
        );

  @override
  Widget build(BuildContext context) =>
      icone != null ? Icon(icone) : Text(texto!);
}`}</code></pre>

      <h2><code>assert</code> com lógica complexa: use closure</h2>
      <p>
        Se a checagem for cara (loop, alocação), passe um <strong>fechamento</strong> (bloco em chaves) — em release, nem o cálculo é feito.
      </p>
      <pre><code>{`void verificarOrdenado(List<int> xs) {
  assert(() {
    for (var i = 1; i < xs.length; i++) {
      if (xs[i] < xs[i - 1]) return false;
    }
    return true;
  }(), 'lista deveria estar ordenada');
}`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Usar <code>assert</code> para validar entrada externa</strong> — em produção a checagem some e bugs passam.</li>
        <li><strong>Esquecer <code>--enable-asserts</code></strong> em CLI e achar que o assert &quot;não funciona&quot;.</li>
        <li><strong>Asserts com efeito colateral:</strong> nunca chame algo que <em>modifica estado</em> dentro de um <code>assert</code> — em release ele é removido e o estado nunca muda.</li>
        <li><strong>Mensagens vazias</strong> (<code>assert(x &gt; 0)</code>): quando falha, ninguém entende.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>assert(cond, msg)</code> dispara <code>AssertionError</code> em debug; some em release.</li>
        <li>Use para invariantes internas, não para validar input de usuário.</li>
        <li>CLI: ative com <code>--enable-asserts</code>; testes e Flutter debug ativam por padrão.</li>
        <li>Sempre passe mensagem útil; passe closure para checagens caras.</li>
        <li>Não coloque efeitos colaterais dentro de <code>assert</code>.</li>
      </ul>
    </PageContainer>
  );
}
