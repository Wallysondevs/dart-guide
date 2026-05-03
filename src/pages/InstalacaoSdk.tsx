import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function InstalacaoSdk() {
  return (
    <PageContainer
      title="Instalando o Dart SDK em Windows, Linux e macOS"
      subtitle="Duas estratégias possíveis (Flutter SDK ou Dart standalone) e como confirmar que tudo deu certo."
      difficulty="iniciante"
      timeToRead="12 min"
    >
      <p>
        Antes de escrever qualquer código, você precisa instalar o <strong>Dart SDK</strong>. SDK significa <em>Software Development Kit</em> — um pacote com tudo que você precisa: o compilador, a VM, as bibliotecas padrão e ferramentas de linha de comando. É como comprar uma marcenaria portátil: vem com martelo, serra, prego e a madeira-base.
      </p>

      <h2>Duas estratégias: Flutter SDK ou Dart standalone</h2>
      <p>
        Você pode instalar o Dart de dois jeitos:
      </p>
      <ul>
        <li><strong>Opção 1 — Flutter SDK</strong>: o Flutter já <em>traz o Dart embutido</em>. Se você pretende fazer apps mobile/desktop com Flutter, instale apenas o Flutter SDK e ganhe o Dart de brinde.</li>
        <li><strong>Opção 2 — Dart standalone</strong>: se você só quer Dart puro (CLIs, scripts, backend, estudos), instale só o Dart. É mais leve (~200MB) versus Flutter (~2GB).</li>
      </ul>

      <AlertBox type="info" title="Qual escolher?">
        Iniciantes em Flutter: instale o Flutter SDK direto. Iniciantes em Dart puro: instale o Dart standalone — depois pode adicionar Flutter quando quiser.
      </AlertBox>

      <h2>Windows: instalação</h2>
      <p>
        O jeito moderno é usar o <strong>winget</strong> (gerenciador de pacotes oficial do Windows 10+). Abra o PowerShell como administrador:
      </p>
      <pre><code>{`# Opção A — Dart standalone via winget
winget install --id=Google.DartSDK -e

# Opção B — Flutter (já traz Dart) via Git
git clone https://github.com/flutter/flutter.git -b stable C:\\src\\flutter

# Adicione ao PATH (Variáveis de Ambiente):
# C:\\src\\flutter\\bin
# C:\\Program Files\\Dart\\dart-sdk\\bin (se instalou standalone)`}</code></pre>
      <p>
        Após instalar, <strong>feche e reabra o terminal</strong> (essencial — variáveis de ambiente só carregam em terminais novos) e teste:
      </p>
      <pre><code>{`dart --version
# Saída esperada: Dart SDK version: 3.5.0 (stable) on "windows_x64"`}</code></pre>

      <h2>macOS: instalação</h2>
      <p>
        Use o <strong>Homebrew</strong> (gerenciador de pacotes do macOS — se ainda não tem, instale em <code>brew.sh</code>):
      </p>
      <pre><code>{`# Opção A — Dart standalone
brew tap dart-lang/dart
brew install dart

# Opção B — Flutter completo
brew install --cask flutter

# Verificar
dart --version
flutter --version`}</code></pre>
      <p>
        O Homebrew cuida do PATH automaticamente. Se mesmo assim <code>dart</code> não for encontrado, adicione no seu <code>~/.zshrc</code>:
      </p>
      <pre><code>{`echo 'export PATH="$PATH:/opt/homebrew/bin"' >> ~/.zshrc
source ~/.zshrc`}</code></pre>

      <h2>Linux (Ubuntu/Debian)</h2>
      <p>
        No mundo Linux, o jeito oficial é via repositório APT. São quatro comandos:
      </p>
      <pre><code>{`sudo apt-get update
sudo apt-get install apt-transport-https
wget -qO- https://dl-ssl.google.com/linux/linux_signing_key.pub \\
  | sudo gpg --dearmor -o /usr/share/keyrings/dart.gpg
echo 'deb [signed-by=/usr/share/keyrings/dart.gpg arch=amd64] \\
  https://storage.googleapis.com/download.dartlang.org/linux/debian stable main' \\
  | sudo tee /etc/apt/sources.list.d/dart_stable.list
sudo apt-get update && sudo apt-get install dart`}</code></pre>
      <p>
        Em distros Arch-based (Manjaro, EndeavourOS), use o AUR:
      </p>
      <pre><code>{`yay -S dart   # ou paru -S dart`}</code></pre>
      <p>
        Em Fedora:
      </p>
      <pre><code>{`sudo dnf install -y https://storage.googleapis.com/download.dartlang.org/linux/rpm/google-dart.repo
sudo dnf install dart`}</code></pre>

      <h2>Configurando o PATH manualmente</h2>
      <p>
        <strong>PATH</strong> é a variável de ambiente que diz ao sistema operacional onde procurar executáveis. Quando você digita <code>dart</code> no terminal, o sistema percorre cada pasta listada no PATH até encontrar um arquivo com esse nome.
      </p>
      <pre><code>{`# Linux/macOS — adicione ao ~/.bashrc, ~/.zshrc ou ~/.profile
export PATH="$PATH:/usr/lib/dart/bin"
export PATH="$PATH:$HOME/flutter/bin"

# Recarregue o shell
source ~/.bashrc

# Verifique
which dart
which flutter`}</code></pre>

      <AlertBox type="warning" title="&quot;dart: command not found&quot;">
        99% das vezes esse erro significa que o PATH não inclui a pasta <code>bin</code> do Dart, ou que você não reabriu o terminal depois de configurar. Confirme com <code>echo $PATH</code> (Linux/macOS) ou <code>echo $env:Path</code> (PowerShell).
      </AlertBox>

      <h2>Verificando a instalação</h2>
      <p>
        Após instalar, rode estes comandos de smoke test:
      </p>
      <pre><code>{`dart --version
# Dart SDK version: 3.5.0 (stable) on "linux_x64"

dart --help
# Lista todos os subcomandos: create, run, compile, analyze, etc.

# Crie e rode um hello-world em 10 segundos
dart create --template=console hello_dart
cd hello_dart
dart run`}</code></pre>
      <p>
        Se a saída final for <code>Hello world: 42!</code>, parabéns — sua instalação está perfeita.
      </p>

      <h2>Atualizando o SDK</h2>
      <pre><code>{`# Windows
winget upgrade Google.DartSDK

# macOS
brew upgrade dart

# Linux (apt)
sudo apt-get update && sudo apt-get upgrade dart

# Flutter (que carrega o Dart junto)
flutter upgrade`}</code></pre>

      <h2>Troubleshooting comum</h2>
      <ul>
        <li><strong>Versão antiga sendo usada</strong>: rode <code>which -a dart</code> para ver se há duas instalações conflitando.</li>
        <li><strong>SSL/TLS errors no Windows</strong>: atualize os certificados do sistema; reinstale o SDK.</li>
        <li><strong>Permissão negada no Linux</strong>: use <code>sudo</code> apenas para a instalação, nunca para rodar <code>dart run</code>.</li>
        <li><strong>Mac M1/M2 com binário Intel</strong>: use a versão <em>arm64</em> do Homebrew (instalada em <code>/opt/homebrew</code>).</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Você pode instalar Dart standalone ou via Flutter SDK.</li>
        <li>Windows: winget; macOS: brew; Linux: apt/dnf/AUR.</li>
        <li>Confirme com <code>dart --version</code> em terminal novo.</li>
        <li>PATH é a variável que faz o terminal achar o <code>dart</code>.</li>
        <li>Atualize regularmente para acompanhar Dart 3.x.</li>
      </ul>
    </PageContainer>
  );
}
