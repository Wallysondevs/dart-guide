import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function LateKeyword() {
  return (
    <PageContainer
      title="late: inicialização tardia obrigatória"
      subtitle="Quando você precisa garantir que algo será preenchido — só que mais tarde."
      difficulty="intermediario"
      timeToRead="11 min"
    >
      <p>
        Imagine que você está montando um móvel com um manual rigoroso: a etapa 5 exige que o parafuso esteja no lugar antes de continuar, mas você sabe que só vai conseguir colocá-lo na etapa 3 (logo após receber outra peça pelo correio). Você não quer marcar o parafuso como &quot;opcional&quot; (porque ele não é!), mas também não consegue colocá-lo no momento da declaração. É exatamente para isso que serve a palavra-chave <code>late</code> em Dart: ela permite declarar uma variável <strong>não-nula</strong> que será inicializada depois, prometendo que estará pronta antes do primeiro uso.
      </p>

      <h2>O problema que late resolve</h2>
      <p>
        Em null safety, qualquer variável não-nula precisa ter um valor desde o início. Mas em muitos cenários, esse valor depende de algo que só está disponível em tempo de execução — por exemplo, um <code>BuildContext</code> em Flutter, ou o resultado de uma chamada de configuração. Sem <code>late</code>, você seria obrigado a usar <code>String?</code> e ficar checando nulidade em todo lugar.
      </p>
      <pre><code>{`// Sem late: somos obrigados a usar nullable
class Tela {
  String? titulo;             // chato: precisa de ! ou ?? em todo uso
}

// Com late: prometemos preencher antes de usar
class Tela2 {
  late String titulo;         // não-nulo, mas inicializado depois
}`}</code></pre>

      <h2>A regra: atribuir antes de ler</h2>
      <p>
        O <code>late</code> é uma promessa: &quot;quando alguém ler esta variável, ela já terá valor&quot;. Se você quebrar a promessa, o runtime (o ambiente que executa seu programa) lança um <strong>LateInitializationError</strong>.
      </p>
      <pre><code>{`late String nome;

void principal() {
  // print(nome); // ERRO em runtime: campo lido antes de inicializar
  nome = 'Ana';
  print(nome);    // ok
}`}</code></pre>

      <AlertBox type="warning" title="Erro silencioso até a hora H">
        Diferente do null check, o <code>late</code> só explode em <em>tempo de execução</em>. Se um caminho do seu código esquecer de atribuir, o app pode rodar perfeitamente em testes e quebrar só na produção. Use com cautela.
      </AlertBox>

      <h2>late final: inicialização preguiçosa</h2>
      <p>
        Combinando <code>late</code> com <code>final</code> e uma <strong>expressão de inicialização</strong>, você obtém <em>lazy initialization</em>: o valor é calculado apenas na primeira leitura, e nunca mais. Útil para coisas caras de calcular.
      </p>
      <pre><code>{`class Configuracao {
  // Só lê o arquivo de disco quando alguém pedir 'caminho'.
  late final String caminho = _lerDoDisco();

  String _lerDoDisco() {
    print('lendo do disco...');
    return '/etc/app/config.yaml';
  }
}

void main() {
  final c = Configuracao();
  print('antes');
  print(c.caminho); // imprime 'lendo do disco...' depois '/etc/...'
  print(c.caminho); // só '/etc/...': não lê de novo
}`}</code></pre>

      <h2>Quando faz sentido em Flutter</h2>
      <p>
        Em Flutter (o framework gráfico do Dart, que constrói telas com componentes chamados <strong>widgets</strong>), é comum precisar inicializar controladores, animações ou listeners no método <code>initState</code>, depois da construção do widget. <code>late final</code> ali é o padrão idiomático:
      </p>
      <pre><code>{`import 'package:flutter/material.dart';

class TelaContador extends StatefulWidget {
  const TelaContador({super.key});
  @override
  State<TelaContador> createState() => _TelaContadorState();
}

class _TelaContadorState extends State<TelaContador> {
  // Inicializado em initState, depois imutável.
  late final TextEditingController _controlador;

  @override
  void initState() {
    super.initState();
    _controlador = TextEditingController(text: 'Olá');
  }

  @override
  void dispose() {
    _controlador.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Contador')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: TextField(controller: _controlador),
      ),
    );
  }
}`}</code></pre>

      <AlertBox type="info" title="late vs nullable em Flutter">
        Use <code>late final</code> quando o campo é inicializado uma única vez no <code>initState</code> e usado em todo o resto. Se houver chance real de o valor ainda não existir, prefira <code>?</code> e checagem.
      </AlertBox>

      <h2>Quando NÃO usar late</h2>
      <p>
        O <code>late</code> é uma ferramenta poderosa, mas vira uma armadilha se mal usada. Evite quando:
      </p>
      <ul>
        <li>Você não tem certeza absoluta de quem inicializa antes de quem lê — prefira <code>?</code> (nullable).</li>
        <li>O valor pode legitimamente nunca existir — isso é o que <code>?</code> existe para representar.</li>
        <li>A variável é local e curta — geralmente dá para inicializar direto.</li>
      </ul>
      <pre><code>{`// Mau uso: late sem necessidade
late int x;
x = 10;
print(x);

// Melhor: simplesmente declare com valor
int x2 = 10;
print(x2);`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>LateInitializationError</strong>: leitura antes da escrita. Reorganize a ordem das atribuições.</li>
        <li><strong>Reatribuir <code>late final</code></strong>: só pode ser atribuído uma vez. Segunda atribuição vira erro.</li>
        <li><strong>Esquecer de inicializar em todos os caminhos</strong> de um <code>switch</code> ou <code>if/else</code>.</li>
        <li><strong>Usar <code>late</code> em vez de <code>final</code></strong> quando o valor já é conhecido — desnecessário e perigoso.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>late</code> declara um campo não-nulo inicializado depois.</li>
        <li><code>late final var = expr;</code> faz inicialização preguiçosa (lazy).</li>
        <li>Em Flutter, é o padrão para campos preenchidos em <code>initState</code>.</li>
        <li>Erro é em runtime (<code>LateInitializationError</code>) — use só quando tiver certeza.</li>
      </ul>
    </PageContainer>
  );
}
