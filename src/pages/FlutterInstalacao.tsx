import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FlutterInstalacao() {
  return (
    <PageContainer
      title="Instalando o Flutter SDK"
      subtitle="Passo a passo para baixar o SDK, configurar editor e rodar seu primeiro app em Android, iOS, web e desktop."
      difficulty="iniciante"
      timeToRead="13 min"
    >
      <p>
        Instalar Flutter é um pouquinho mais trabalhoso do que instalar uma linguagem comum, porque ele precisa conversar com plataformas diferentes (Android, iOS, navegador, desktop). Pense como montar uma marcenaria: além da bancada (Flutter SDK), você precisa do conjunto de ferramentas certo para cada material — ferro (Xcode para iOS), madeira (Android Studio para Android), papelão (navegador para web). A boa notícia: o próprio Flutter tem um <strong>diagnóstico automático</strong> chamado <code>flutter doctor</code> que te diz exatamente o que falta.
      </p>

      <h2>Baixando o Flutter SDK</h2>
      <p>
        SDK significa <em>Software Development Kit</em> — um pacote com o compilador, bibliotecas, ferramentas de linha de comando e exemplos. O jeito mais fácil é baixar o ZIP oficial do site flutter.dev e descompactar em uma pasta sem espaços ou caracteres especiais (ex.: <code>C:\src\flutter</code> no Windows ou <code>~/development/flutter</code> no Mac/Linux).
      </p>
      <pre><code>{`# Linux/macOS — descompactar e adicionar ao PATH
cd ~/development
unzip ~/Downloads/flutter_linux_3.x-stable.zip
echo 'export PATH="$PATH:$HOME/development/flutter/bin"' >> ~/.bashrc
source ~/.bashrc

# Windows (PowerShell como admin)
Expand-Archive flutter_windows_3.x-stable.zip -DestinationPath C:\\src
[Environment]::SetEnvironmentVariable("Path", "$env:Path;C:\\src\\flutter\\bin", "User")`}</code></pre>
      <p>
        Depois disso, abra um terminal NOVO e digite <code>flutter --version</code>. Se aparecer a versão do Flutter (ex.: 3.24.0) e do Dart (3.5+), o SDK está visível para o sistema operacional. Caso contrário, o PATH não foi atualizado — feche e reabra o terminal.
      </p>

      <h2>O comando mágico: <code>flutter doctor</code></h2>
      <p>
        Esse comando faz uma varredura no seu sistema e lista o que está OK e o que falta. Ele é o seu melhor amigo na fase de instalação.
      </p>
      <pre><code>{`flutter doctor

# Saída típica em um sistema novo:
# [✓] Flutter (Channel stable, 3.24.0, on macOS 14.5)
# [✗] Android toolchain - develop for Android devices
#     ✗ Unable to locate Android SDK.
# [✗] Xcode - develop for iOS and macOS
#     ✗ Xcode installation is incomplete; a full installation is necessary
# [✓] Chrome - develop for the web
# [!] Android Studio (not installed)
# [✓] VS Code (version 1.92)`}</code></pre>

      <AlertBox type="info" title="Leia o doctor com calma">
        Cada linha com <code>✗</code> ou <code>!</code> traz um link com instruções. Não se assuste com vermelho: comece pelo que você realmente vai usar (Android se quer fazer app Android, etc.).
      </AlertBox>

      <h2>Android Studio + Android SDK</h2>
      <p>
        Para compilar para Android, você precisa do <strong>Android SDK</strong> (kit de desenvolvimento Android), que vem dentro do Android Studio. Baixe o Android Studio, abra-o, e na tela de boas-vindas instale os pacotes padrão. Depois rode <code>flutter doctor --android-licenses</code> e aceite todas as licenças com <code>y</code>.
      </p>
      <pre><code>{`flutter doctor --android-licenses
# Aceite tudo digitando "y" enter, várias vezes.

# Cria um emulador Android pela linha de comando:
flutter emulators --create --name pixel
flutter emulators --launch pixel`}</code></pre>

      <h2>Xcode (apenas Mac, para iOS)</h2>
      <p>
        Compilar para iPhone exige um Mac com <strong>Xcode</strong> (IDE oficial da Apple) instalado pela App Store. Depois de instalado, abra-o uma vez para aceitar os termos e rode:
      </p>
      <pre><code>{`sudo xcode-select --switch /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -runFirstLaunch
sudo gem install cocoapods   # gerenciador de dependências iOS

# Abrir o simulador:
open -a Simulator`}</code></pre>

      <AlertBox type="warning" title="Sem Mac, sem iOS">
        Não dá para compilar app iOS no Windows ou Linux — restrição da Apple. Alternativas: Codemagic/GitHub Actions com runner macOS, ou um Mac mini barato.
      </AlertBox>

      <h2>Editor: VS Code ou Android Studio</h2>
      <p>
        Os dois editores oficialmente suportados são VS Code e Android Studio (ou IntelliJ). Ambos têm extensões oficiais que dão autocompletar, depurador e botão de hot reload.
      </p>
      <ul>
        <li><strong>VS Code</strong>: instale as extensões <em>Flutter</em> e <em>Dart</em> da Marketplace. Leve e rápido.</li>
        <li><strong>Android Studio</strong>: instale o plugin Flutter em <em>Settings → Plugins</em>. Mais pesado, mas integra emulador.</li>
      </ul>

      <h2>Criando e rodando o primeiro app</h2>
      <p>
        Com tudo instalado, abra o terminal em uma pasta de trabalho e crie o projeto:
      </p>
      <pre><code>{`# Cria um projeto novo chamado "ola_flutter"
flutter create ola_flutter
cd ola_flutter

# Lista dispositivos disponíveis (emulador, browser, desktop):
flutter devices

# Roda o app no primeiro dispositivo encontrado:
flutter run

# Roda especificando plataforma:
flutter run -d chrome      # web
flutter run -d macos       # desktop macOS
flutter run -d emulator-5554  # Android emulator
flutter run -d "iPhone 15"    # simulador iOS`}</code></pre>
      <p>
        Pronto: aparece o app de contador padrão. No terminal, pressione <code>r</code> para hot reload (atualiza UI sem perder estado) ou <code>R</code> para hot restart (zera o estado).
      </p>

      <h2>Estrutura do projeto criado</h2>
      <pre><code>{`ola_flutter/
├── android/         # projeto Gradle Android
├── ios/             # projeto Xcode iOS
├── lib/
│   └── main.dart    # SEU código vai aqui
├── test/            # testes automatizados
├── pubspec.yaml     # dependências e assets
└── README.md`}</code></pre>

      <h2>Erros comuns na instalação</h2>
      <ul>
        <li><strong>"flutter: command not found"</strong>: PATH não foi adicionado, ou você não reabriu o terminal.</li>
        <li><strong>"Android licenses not accepted"</strong>: rode <code>flutter doctor --android-licenses</code> e responda <code>y</code> a tudo.</li>
        <li><strong>"CocoaPods not installed"</strong> (Mac): rode <code>sudo gem install cocoapods</code>.</li>
        <li><strong>Pasta com espaço/acento</strong>: instale o SDK em caminho simples como <code>C:\src\flutter</code>.</li>
        <li><strong>Antivírus segurando builds no Windows</strong>: adicione exceção para a pasta do SDK e do projeto.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Baixe Flutter SDK do site oficial e adicione ao PATH.</li>
        <li>Use <code>flutter doctor</code> sempre — ele guia o que falta.</li>
        <li>Android Studio instala Android SDK; Xcode é obrigatório para iOS (somente Mac).</li>
        <li>VS Code + extensão Flutter é o setup mais leve.</li>
        <li><code>flutter create</code> + <code>flutter run</code> roda seu primeiro app em segundos.</li>
      </ul>
    </PageContainer>
  );
}
