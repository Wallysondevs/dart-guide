import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function NullSafetyMigration() {
  return (
    <PageContainer
      title="Migrando código antigo para null safety"
      subtitle="Como atualizar projetos Dart pré-2.12 com a ferramenta dart migrate, e o que pode dar errado no caminho."
      difficulty="avancado"
      timeToRead="13 min"
    >
      <p>
        Antes do Dart 2.12 (lançado em março de 2021), <strong>qualquer variável podia receber <code>null</code></strong>. Isso era cômodo, mas causava o famoso <em>NullPointerException</em> em runtime — bug que custou bilhões à indústria. A partir do Dart 3, <strong>null safety</strong> é obrigatória: você precisa marcar explicitamente o que pode ser nulo. Migrar projetos antigos para esse modelo é um ritual conhecido — e a equipe Dart criou ferramenta para ajudar.
      </p>

      <h2>O que muda exatamente?</h2>
      <p>
        Em Dart antigo, <code>String nome</code> aceitava <code>null</code>. Em Dart moderno, não. Para permitir nulo, escreva <code>String? nome</code> (com interrogação). O compilador checa <em>antes</em> de rodar e recusa código que possa esbarrar em null. Pense numa fechadura nova: a antiga aceitava qualquer chave; a nova só aceita a chave certa, e te avisa na hora se você tentou a errada.
      </p>
      <pre><code>{`// Pré-null-safety (legado)
String saudar(String nome) {
  return 'Olá, \$nome!';
}
saudar(null); // compila, explode em runtime

// Null safety
String saudar(String nome) {       // não aceita null
  return 'Olá, \$nome!';
}
String saudarOpcional(String? nome) { // aceita null
  return 'Olá, \${nome ?? "anônimo"}!';
}`}</code></pre>

      <h2>A ferramenta dart migrate</h2>
      <p>
        Para projetos pré-2.12, existe um comando interativo que abre um servidor web onde você revisa, em uma interface bonita, todas as anotações que a ferramenta sugere para tornar seu código null-safe.
      </p>
      <pre><code>{`# Atualize o SDK constraint primeiro:
# pubspec.yaml
environment:
  sdk: '>=2.12.0 <4.0.0'

# Atualize as dependências para versões null-safe
dart pub upgrade --null-safety
dart pub outdated --mode=null-safety

# Roda o assistente interativo
dart migrate

# Abre http://127.0.0.1:porta no navegador`}</code></pre>

      <AlertBox type="info" title="O que a ferramenta faz?">
        Ela faz uma análise estática de cada uso de variável e <strong>infere</strong> se pode ou não ser nula. Sugere <code>?</code>, <code>!</code>, <code>late</code> e adicionar guardas. Você revisa cada decisão e aceita ou ajusta antes de aplicar.
      </AlertBox>

      <h2>Os três operadores essenciais</h2>
      <ul>
        <li><strong><code>?</code></strong> (opcional): permite null. <code>String? nome</code>.</li>
        <li><strong><code>!</code></strong> (bang): força tratar como não-nulo. Se for null, explode em runtime — use só quando tiver <em>certeza</em>.</li>
        <li><strong><code>late</code></strong>: promete que vai inicializar depois, antes do primeiro uso. Sem <code>?</code>, mas inicialização adiada.</li>
      </ul>
      <pre><code>{`String? talvez = obterValor();

// ?? = valor padrão se for null
final nome = talvez ?? 'desconhecido';

// ?. = chama método só se não-nulo
final tam = talvez?.length;

// ! = afirma "não é null, confia em mim"
final certo = talvez!.toUpperCase(); // explode se for null

// late = será atribuído antes do primeiro uso
late final String token;
void inicializar() {
  token = obterToken(); // só pode atribuir uma vez (final)
}`}</code></pre>

      <AlertBox type="warning" title="Quando NÃO usar !">
        O operador <code>!</code> é uma escapatória. Quase sempre que você o usa, existe uma alternativa mais segura (<code>??</code>, <code>if (x != null)</code>, <code>guard clause</code>). Trate cada <code>!</code> no código como dívida técnica.
      </AlertBox>

      <h2>late vs ?: qual escolher?</h2>
      <p>
        Use <code>?</code> quando <em>realmente</em> faz sentido a variável estar vazia (ex.: campo opcional num formulário). Use <code>late</code> quando o valor sempre existirá, só não no momento da declaração — campos inicializados em <code>initState</code> de Flutter, dependências injetadas, configs lidas de arquivo.
      </p>
      <pre><code>{`class TelaPerfil extends StatefulWidget {
  const TelaPerfil({super.key});
  @override
  State<TelaPerfil> createState() => _TelaPerfilState();
}

class _TelaPerfilState extends State<TelaPerfil> {
  late final TextEditingController _nome; // garantido em initState
  String? _avatarUrl;                      // realmente opcional

  @override
  void initState() {
    super.initState();
    _nome = TextEditingController();
  }

  @override
  void dispose() {
    _nome.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => const SizedBox();
}`}</code></pre>

      <h2>Comentários que viram diretivas</h2>
      <p>
        Se a ferramenta migrate insiste em algo que você sabe estar errado, use comentários especiais para guiá-la:
      </p>
      <pre><code>{`// Diga ao migrate que esta variável NUNCA deve ser anulável
String nome = obterNome(); // dart migrate manterá sem ?

// Para ignorar warnings persistentes:
// ignore: avoid_print
print('debug');

// Ou ignorar regra inteira no arquivo:
// ignore_for_file: prefer_const_constructors`}</code></pre>

      <h2>Pacotes que precisam migrar</h2>
      <p>
        Sua dependência num pacote pré-NS bloqueia toda a migração. Antes de rodar <code>dart migrate</code>:
      </p>
      <pre><code>{`# Lista quais dependências ainda não migraram
dart pub outdated --mode=null-safety

# Saída exemplo:
# Package      Current  Upgradable  Resolvable  Latest
# meupack      1.0.2    1.0.2       null-safe   2.0.1`}</code></pre>
      <p>
        Se um pacote ficou abandonado, suas opções são: contribuir um PR, forkar e migrar você mesmo, ou substituir por outra biblioteca. Felizmente, em 2024 quase tudo no pub.dev já migrou.
      </p>

      <h2>Lições aprendidas (de equipes reais)</h2>
      <ul>
        <li><strong>Migre no menor pacote primeiro</strong>: o efeito cascata é grande. Comece pelos utilities, depois sobe para a app.</li>
        <li><strong>Não confie cegamente no migrate</strong>: revise cada arquivo. A ferramenta tende a colocar <code>?</code> demais por segurança.</li>
        <li><strong>Aproveite para refatorar</strong>: muitos <code>!</code> denunciam código que poderia ser mais simples com early-return.</li>
        <li><strong>Rode os testes a cada 5-10 arquivos</strong> migrados, não tudo de uma vez.</li>
        <li><strong>Comunique a quebra</strong>: bumpe major version do seu pacote (semver).</li>
      </ul>

      <h2>Após a migração</h2>
      <p>
        Habilite no <code>analysis_options.yaml</code> regras que mantêm o código limpo:
      </p>
      <pre><code>{`include: package:lints/recommended.yaml

linter:
  rules:
    - avoid_dynamic_calls
    - prefer_null_aware_method_calls
    - unnecessary_null_checks
    - unnecessary_null_in_if_null_operators`}</code></pre>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Espalhar <code>!</code> só pra calar o compilador</strong>: você está reintroduzindo o bug que null safety previne.</li>
        <li><strong>Marcar tudo como <code>?</code></strong>: vira ruído. Use só onde faz sentido.</li>
        <li><strong>Ler <code>late</code> antes de inicializar</strong>: dispara <code>LateInitializationError</code> em runtime.</li>
        <li><strong>Migrar a app sem migrar dependências</strong> primeiro: trava no meio.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Null safety move erros de runtime para compile-time.</li>
        <li><code>dart migrate</code> dá interface visual para revisar e aplicar.</li>
        <li><code>?</code>, <code>!</code> e <code>late</code> são as três ferramentas centrais.</li>
        <li>Migre dependências antes; depois pacote por pacote.</li>
        <li>Trate cada <code>!</code> como dívida técnica.</li>
      </ul>
    </PageContainer>
  );
}
