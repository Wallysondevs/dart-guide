import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartCli() {
  return (
    <PageContainer
      title="O CLI dart: comandos essenciais"
      subtitle="Tudo o que você faz no Dart no dia a dia passa pelo terminal — domine o canivete suíço da linguagem."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Quando você instala o Dart SDK, ganha de brinde um programa chamado <code>dart</code>. Ele é uma <em>caixa de ferramentas</em> — um único executável que reúne dezenas de subcomandos para criar projetos, rodar código, formatar, testar, baixar pacotes e compilar. É o equivalente do <code>git</code> no controle de versões ou do <code>npm</code> no Node.js. Vamos conhecer cada subcomando importante.
      </p>

      <h2>Estrutura geral</h2>
      <p>
        Todo comando segue o padrão <code>dart &lt;subcomando&gt; [opções]</code>. Para ver tudo o que está disponível:
      </p>
      <pre><code>{`dart --help
# Available commands:
#   analyze   Analyze the project's Dart code.
#   compile   Compile Dart to various formats.
#   create    Create a new Dart project.
#   doc       Generate API documentation.
#   fix       Apply automated fixes to Dart source code.
#   format    Idiomatically format Dart source code.
#   pub       Work with packages.
#   run       Run a Dart program.
#   test      Run tests for a project.`}</code></pre>

      <h2>Tabela dos comandos essenciais</h2>
      <table>
        <thead><tr><th>Comando</th><th>O que faz</th></tr></thead>
        <tbody>
          <tr><td><code>dart create</code></td><td>Cria um novo projeto a partir de um template.</td></tr>
          <tr><td><code>dart run</code></td><td>Executa um programa em modo JIT.</td></tr>
          <tr><td><code>dart compile</code></td><td>Gera executável (exe, js, aot-snapshot, kernel).</td></tr>
          <tr><td><code>dart analyze</code></td><td>Analisa o código procurando bugs e más práticas.</td></tr>
          <tr><td><code>dart format</code></td><td>Formata seu código no estilo padrão.</td></tr>
          <tr><td><code>dart fix</code></td><td>Aplica correções automáticas sugeridas.</td></tr>
          <tr><td><code>dart test</code></td><td>Roda os testes da pasta <code>test/</code>.</td></tr>
          <tr><td><code>dart doc</code></td><td>Gera HTML com a documentação do projeto.</td></tr>
          <tr><td><code>dart pub get</code></td><td>Baixa as dependências do <code>pubspec.yaml</code>.</td></tr>
          <tr><td><code>dart pub add</code></td><td>Adiciona um pacote ao projeto.</td></tr>
          <tr><td><code>dart pub remove</code></td><td>Remove um pacote.</td></tr>
        </tbody>
      </table>

      <h2>dart create: começando do zero</h2>
      <p>
        Cria a estrutura inicial de um projeto. Você escolhe um <em>template</em> — o tipo de projeto:
      </p>
      <pre><code>{`# Lista templates disponíveis
dart create --help

# CLI simples (default)
dart create -t console meu_app

# Pacote (biblioteca para outros usarem)
dart create -t package minha_lib

# Servidor HTTP básico
dart create -t server-shelf meu_servidor`}</code></pre>
      <p>
        O resultado é uma pasta com tudo configurado: <code>pubspec.yaml</code>, <code>analysis_options.yaml</code>, <code>bin/</code>, <code>lib/</code>, <code>test/</code> e um README. Em segundos você está pronto para codar.
      </p>

      <h2>dart run: execute na hora</h2>
      <pre><code>{`# Roda o ponto de entrada padrão (bin/<nome>.dart)
dart run

# Roda um arquivo específico
dart run bin/script.dart

# Passa argumentos para o programa
dart run bin/cli.dart --nome Ana --idade 30

# Roda um pacote instalado (ex: build_runner)
dart run build_runner build`}</code></pre>

      <AlertBox type="info" title="dart run usa JIT">
        Como vimos no capítulo de execução, <code>dart run</code> usa a Dart VM em modo JIT — ótimo para desenvolvimento. Para produção, prefira <code>dart compile exe</code>.
      </AlertBox>

      <h2>dart format: padrão único</h2>
      <p>
        O Dart tem um <strong>formatador oficial</strong>. Em vez de discussões sobre tabs vs espaços, todo mundo usa o mesmo estilo. Rode antes de qualquer commit:
      </p>
      <pre><code>{`# Formata todos os .dart do projeto, in-place
dart format .

# Apenas verifica (não modifica) — útil em CI
dart format --output=none --set-exit-if-changed .`}</code></pre>

      <h2>dart analyze e dart fix</h2>
      <p>
        O <strong>analyzer</strong> é o verificador estático: ele lê seu código sem rodar e aponta possíveis bugs, variáveis não usadas, imports desnecessários. Já o <code>dart fix</code> tenta consertar tudo automaticamente.
      </p>
      <pre><code>{`# Roda análise estática
dart analyze
# Saída: "No issues found!" ou lista de warnings/errors

# Mostra correções sugeridas (sem aplicar)
dart fix --dry-run

# Aplica todas as correções automáticas
dart fix --apply`}</code></pre>

      <h2>dart pub: o gerenciador de pacotes</h2>
      <p>
        O subcomando <code>pub</code> conversa com o <code>pub.dev</code>, o repositório oficial de pacotes Dart (equivalente ao npm/PyPI):
      </p>
      <pre><code>{`# Adicionar uma dependência (atualiza pubspec.yaml)
dart pub add http
dart pub add intl
dart pub add --dev test    # dependência só de desenvolvimento

# Baixar dependências (após clonar um projeto)
dart pub get

# Atualizar para versões compatíveis mais novas
dart pub upgrade

# Remover um pacote
dart pub remove http

# Ver dependências em árvore
dart pub deps`}</code></pre>

      <h2>dart compile: empacotando para produção</h2>
      <pre><code>{`# Executável nativo (Linux/macOS/Windows)
dart compile exe bin/app.dart -o build/app

# JavaScript otimizado para o navegador
dart compile js -O4 web/main.dart -o web/main.js

# Snapshot AOT (mais leve, precisa do dartaotruntime)
dart compile aot-snapshot bin/app.dart -o build/app.aot

# Kernel (intermediário, multiplataforma)
dart compile kernel bin/app.dart -o build/app.dill`}</code></pre>

      <h2>Workflow típico do dia a dia</h2>
      <pre><code>{`# 1. Clonar projeto e instalar deps
git clone https://github.com/usuario/app.git
cd app
dart pub get

# 2. Editar código

# 3. Antes de commitar — sempre!
dart format .
dart analyze
dart test

# 4. Compilar para produção
dart compile exe bin/app.dart -o build/app`}</code></pre>

      <AlertBox type="success" title="Dica de produtividade">
        Crie aliases no shell: <code>alias da=&quot;dart analyze&quot;</code>, <code>alias df=&quot;dart format .&quot;</code>, <code>alias dt=&quot;dart test&quot;</code>. Você economiza dezenas de toques por dia.
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Rodar <code>dart run</code> fora da pasta do projeto</strong>: ele precisa do <code>pubspec.yaml</code> próximo. Sempre <code>cd</code> antes.</li>
        <li><strong>Esquecer <code>dart pub get</code></strong> após clonar — o programa não acha as dependências.</li>
        <li><strong>Usar <code>dart pub add</code> sem ler o <code>pubspec.yaml</code></strong>: o comando edita o arquivo automaticamente, mas você deveria verificar a versão escolhida.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>dart</code> é o canivete suíço: create, run, compile, analyze, format, fix, test, doc, pub.</li>
        <li>Workflow padrão: <code>format → analyze → test → compile</code>.</li>
        <li><code>dart pub</code> gerencia dependências do pub.dev.</li>
        <li><code>dart create</code> agiliza o início de novos projetos.</li>
      </ul>
    </PageContainer>
  );
}
