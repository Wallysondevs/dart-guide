import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartFix() {
  return (
    <PageContainer
      title="dart fix: refatoração automática"
      subtitle="Aplique correções sugeridas pelo analisador em massa — migrações de deprecation, modernização e cleanups num único comando."
      difficulty="iniciante"
      timeToRead="9 min"
    >
      <p>
        Imagine que você é um editor de livros e recebeu um manuscrito com 500 ocorrências de uma palavra agora considerada errada. Você poderia abrir página por página e corrigir manualmente — ou usar &quot;substituir tudo&quot;. O <code>dart fix</code> é o &quot;substituir tudo&quot; do Dart, mas <strong>inteligente</strong>: ele entende o contexto, conhece as regras do analisador, e aplica milhares de pequenas correções automaticamente. Atualizou o Flutter e tem 200 avisos de deprecation? Roda <code>dart fix --apply</code> e a maioria some.
      </p>

      <h2>Como funciona</h2>
      <p>
        O <code>dart fix</code> lê os mesmos avisos que o <code>dart analyze</code> produz e tenta aplicar uma correção segura para cada um. Cada lint pode (ou não) ter um &quot;quick fix&quot; associado. Se tiver, o <code>dart fix</code> aplica.
      </p>
      <pre><code>{`# Mostra o que ele MUDARIA, sem alterar nada (recomendado primeiro)
dart fix --dry-run

# Aplica as correções de fato
dart fix --apply

# Aplica só num caminho específico
dart fix --apply lib/screens`}</code></pre>

      <h2>Exemplo prático: prefer_const_constructors</h2>
      <p>
        Em Flutter, widgets imutáveis devem ser construídos com <code>const</code> sempre que possível — economiza memória e melhora performance. O lint <code>prefer_const_constructors</code> aponta cada lugar que poderia. Em vez de adicionar <code>const</code> em 400 widgets manualmente:
      </p>
      <pre><code>{`// ANTES — sem const, lint reclama
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: Text('Olá')),
    body: Center(
      child: Column(
        children: [
          Text('Linha 1'),
          SizedBox(height: 10),
          Text('Linha 2'),
        ],
      ),
    ),
  );
}

// DEPOIS de dart fix --apply
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(title: const Text('Olá')),
    body: const Center(
      child: Column(
        children: [
          Text('Linha 1'),
          SizedBox(height: 10),
          Text('Linha 2'),
        ],
      ),
    ),
  );
}`}</code></pre>

      <h2>Migração de APIs deprecadas</h2>
      <p>
        Quando o Flutter renomeia ou aposenta uma API, o time geralmente deixa um &quot;data:&quot; com o caminho de migração — e o <code>dart fix</code> sabe seguir. Por exemplo, ao migrar do Material 2 para Material 3, várias propriedades de <code>ThemeData</code> mudaram. Em vez de procurar manualmente:
      </p>
      <pre><code>{`# Antes:
# theme: ThemeData(primaryColor: Colors.blue)  <- deprecado

dart fix --dry-run
# Saída:
# 12 proposed fixes in 4 files.
# lib/main.dart
#   8:25 • Replace 'primaryColor' with 'colorScheme.primary'
#   ...`}</code></pre>

      <AlertBox type="info" title="Sempre rode dry-run primeiro">
        O <code>--dry-run</code> mostra o diff sem mexer em nada. Revise, e só então aplique. Em projetos grandes, <code>--apply</code> sem revisão pode mudar centenas de arquivos de uma vez — você quer ver antes.
      </AlertBox>

      <h2>Quais lints têm fix automático?</h2>
      <p>
        Nem toda regra é auto-corrigível. Lints como <code>prefer_const_constructors</code>, <code>unnecessary_const</code>, <code>prefer_final_locals</code>, <code>unnecessary_new</code>, <code>avoid_init_to_null</code>, <code>unnecessary_this</code> têm fix. Já regras semânticas (como <code>avoid_dynamic_calls</code>) não têm — exigem decisão humana.
      </p>
      <pre><code>{`# Para listar todos os fixes disponíveis
dart fix --help

# Aplica fixes apenas para certas regras (filtro)
dart fix --apply --code=prefer_const_constructors`}</code></pre>

      <h2>Migração de null-safety (histórica, mas ilustrativa)</h2>
      <p>
        Quando Dart 2.12 introduziu null-safety (2021), milhões de linhas precisavam virar <code>String?</code> ou <code>String</code>. O time criou uma ferramenta de migração interativa — herdeira do <code>dart fix</code> — que percorria o projeto, sugeria onde adicionar <code>?</code>, e mostrava o diff. Hoje, projetos novos já nascem null-safe, mas o exemplo mostra a filosofia: <strong>migrações em massa devem ser automatizadas</strong>.
      </p>
      <pre><code>{`// Pré 2.12 (sem null-safety)
String nome;
int idade;

// Pós migração automática
String? nome;     // sinal de que pode ser nulo
late int idade;   // ou late, se você garante atribuição depois`}</code></pre>

      <h2>Combinando com format e analyze</h2>
      <p>
        O combo de manutenção saudável é executar os três em sequência — fix corrige, format ajusta espaços, analyze confere o que sobrou:
      </p>
      <pre><code>{`# Script de manutenção (Makefile, justfile, package.json)
dart fix --apply
dart format .
dart analyze --fatal-warnings`}</code></pre>

      <AlertBox type="warning" title="Use git antes de aplicar">
        Antes de <code>dart fix --apply</code>, certifique-se de que o repositório está limpo (commit pendente). Assim, se algo der errado, <code>git diff</code> mostra exatamente o que mudou e você pode reverter com <code>git restore</code>.
      </AlertBox>

      <h2>Personalizando: existe um equivalente custom?</h2>
      <p>
        Por padrão, <code>dart fix</code> só aplica os fixes que vêm com o SDK e com pacotes de lints oficiais. Para regras customizadas com fix associado, use <code>custom_lint</code> + <code>analyzer_plugin</code> — assunto avançado, mas saiba que existe.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Aplicar sem revisar</strong>: <code>--dry-run</code> sempre primeiro.</li>
        <li><strong>Esperar que tudo seja corrigido</strong>: muitos avisos exigem decisão manual.</li>
        <li><strong>Misturar com mudanças manuais</strong>: faça commits separados — &quot;dart fix run&quot; em um, lógica em outro.</li>
        <li><strong>Esquecer de rodar <code>format</code></strong> depois: alguns fixes deixam espaços estranhos.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dart fix --dry-run</code> mostra o que mudaria; <code>--apply</code> aplica.</li>
        <li>Resolve em massa lints como <code>prefer_const_constructors</code>, <code>unnecessary_new</code>, deprecations.</li>
        <li>Combine com <code>dart format</code> e <code>dart analyze</code> para um ciclo de manutenção limpo.</li>
        <li>Sempre commite antes — facilita reverter.</li>
        <li>Nem todo aviso tem fix automático; alguns exigem decisão humana.</li>
      </ul>
    </PageContainer>
  );
}
