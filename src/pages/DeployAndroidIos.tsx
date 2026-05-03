import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DeployAndroidIos() {
  return (
    <PageContainer
      title="Deploy de apps Flutter: Android e iOS"
      subtitle="Da máquina do dev até a Play Store e a App Store, passando pelos cuidados de assinatura e CI/CD."
      difficulty="avancado"
      timeToRead="16 min"
    >
      <p>
        Programar o app é metade do caminho. A outra metade é entregar para os usuários — e essa parte tem burocracia. É como cozinhar um bolo delicioso e depois precisar atravessar três alfândegas com selos, etiquetas e impostos antes de servir. Vamos por etapas: gerar binário, assinar, subir para as lojas, automatizar.
      </p>

      <h2>Build Android: APK vs App Bundle</h2>
      <p>
        Antigamente o Android só aceitava APK (Android Package). Hoje a Play Store exige <strong>App Bundle</strong> (<code>.aab</code>) — um formato que permite ao Google gerar APKs otimizados por dispositivo (só o ABI e as densidades necessárias). Resultado: download menor para o usuário.
      </p>
      <pre><code>{`# APK universal (para distribuição direta, debug, sites próprios)
flutter build apk --release

# APK por arquitetura (mais leve)
flutter build apk --release --split-per-abi

# App Bundle (obrigatório na Play Store)
flutter build appbundle --release`}</code></pre>
      <p>Os artefatos saem em <code>build/app/outputs/</code>.</p>

      <h2>Assinatura Android com keystore</h2>
      <p>
        Toda Play Store rejeita binários não assinados. A assinatura é uma chave criptográfica que prova &quot;este APK foi feito por mim&quot;. Você gera uma <strong>keystore</strong> (cofrinho) uma vez e usa para a vida do app.
      </p>
      <pre><code>{`# Gera a keystore (responda às perguntas, NÃO perca a senha)
keytool -genkey -v -keystore ~/upload-keystore.jks \\
  -keyalg RSA -keysize 2048 -validity 10000 \\
  -alias upload`}</code></pre>
      <p>
        Crie <code>android/key.properties</code> (NÃO commitar):
      </p>
      <pre><code>{`storePassword=MINHA_SENHA
keyPassword=MINHA_SENHA
keyAlias=upload
storeFile=/Users/eu/upload-keystore.jks`}</code></pre>
      <p>
        E em <code>android/app/build.gradle</code>:
      </p>
      <pre><code>{`def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
  signingConfigs {
    release {
      keyAlias keystoreProperties['keyAlias']
      keyPassword keystoreProperties['keyPassword']
      storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
      storePassword keystoreProperties['storePassword']
    }
  }
  buildTypes {
    release {
      signingConfig signingConfigs.release
      minifyEnabled true
      shrinkResources true
    }
  }
}`}</code></pre>

      <AlertBox type="warning" title="Perdeu a keystore? Acabou.">
        Sem a keystore original, você <strong>nunca mais</strong> consegue publicar atualizações do mesmo app — terá que criar outro pacote (e perder os usuários). Faça backup em pelo menos dois lugares offline.
      </AlertBox>

      <h2>Publicando na Play Store</h2>
      <ol>
        <li>Crie conta em <code>play.google.com/console</code> (US$25 uma única vez).</li>
        <li>Crie um app, preencha ficha (descrição, screenshots, ícone 512px, classificação etária).</li>
        <li>Suba o <code>.aab</code> em &quot;Internal testing&quot; primeiro.</li>
        <li>Depois &quot;Closed testing&quot; (beta com convidados), &quot;Open testing&quot; (link público).</li>
        <li>Por fim, &quot;Production&quot; — passa por revisão (algumas horas a dias).</li>
      </ol>

      <h2>Build iOS: archive no Xcode</h2>
      <p>
        Para iOS, você precisa de um Mac, conta de developer da Apple (US$99/ano) e Xcode instalado. O fluxo é mais &quot;manual&quot;:
      </p>
      <pre><code>{`# Gera build de produção
flutter build ios --release

# Abre o projeto no Xcode
open ios/Runner.xcworkspace`}</code></pre>
      <p>
        No Xcode: <em>Product → Archive</em>. Quando termina, abre a janela &quot;Organizer&quot; — ali você clica em &quot;Distribute App&quot; e envia para o <strong>App Store Connect</strong>.
      </p>

      <h2>Certificados, Bundle ID e Provisioning Profiles</h2>
      <p>
        Apple cobra mais cerimônia que Google. Você precisa de:
      </p>
      <ul>
        <li><strong>Bundle ID</strong>: identificador único (<code>com.empresa.app</code>) registrado no Apple Developer.</li>
        <li><strong>Distribution Certificate</strong>: prova que você é você (gerado no Mac via Xcode).</li>
        <li><strong>Provisioning Profile</strong>: amarra Bundle ID + certificado + tipo (App Store, Ad Hoc).</li>
      </ul>
      <p>
        Em &quot;Signing &amp; Capabilities&quot; do Xcode, ative &quot;Automatically manage signing&quot; — para começar, deixa o Xcode cuidar disso. Mais tarde, você aprende a gerenciar manualmente.
      </p>

      <h2>TestFlight: beta da Apple</h2>
      <p>
        Após enviar via Xcode, o build aparece no App Store Connect. Promova para <strong>TestFlight</strong> e convide testadores por e-mail (até 100 internos, 10.000 externos). Cada build expira em 90 dias.
      </p>

      <h2>App Store Connect: lançando</h2>
      <ul>
        <li>Crie o app, preencha ficha (descrição em PT/EN, palavras-chave, capturas em todos os tamanhos exigidos).</li>
        <li>Política de privacidade obrigatória.</li>
        <li>Selecione build do TestFlight, envie para revisão.</li>
        <li>Revisão da Apple costuma levar 24-48h. Rejeições comuns: ausência de login social, descrição vaga, quebra das &quot;Human Interface Guidelines&quot;.</li>
      </ul>

      <AlertBox type="info" title="Dois pontos importantes">
        <strong>Versão</strong>: incremente <code>version: 1.0.0+1</code> no <code>pubspec.yaml</code> a cada upload (o <code>+1</code> é o build number, exigido único). <strong>Política</strong>: hospede uma URL com sua política de privacidade — Apple exige.
      </AlertBox>

      <h2>CI/CD: deploy automatizado</h2>
      <p>
        Fazer tudo manualmente cansa. CI/CD (Continuous Integration/Delivery) automatiza: cada push na branch <code>main</code> dispara build, testes e upload nas lojas. Duas opções populares:
      </p>
      <ul>
        <li><strong>Codemagic</strong>: feito para Flutter, configuração via UI ou <code>codemagic.yaml</code>. Plano gratuito generoso.</li>
        <li><strong>fastlane</strong>: padrão da comunidade nativa, scripts em Ruby, integra com GitHub Actions.</li>
      </ul>
      <pre><code>{`# Exemplo simplificado de codemagic.yaml
workflows:
  android-release:
    name: Android Release
    instance_type: mac_mini_m1
    environment:
      flutter: stable
      groups:
        - keystore_credentials
    scripts:
      - flutter packages pub get
      - flutter test
      - flutter build appbundle --release
    artifacts:
      - build/**/outputs/**/*.aab
    publishing:
      google_play:
        credentials: \$GCLOUD_SERVICE_ACCOUNT_CREDENTIALS
        track: internal`}</code></pre>

      <h2>Permissões e ProGuard</h2>
      <p>
        Em modo release, o R8/ProGuard pode &quot;encolher&quot; classes e quebrar reflection. Pacotes como <code>flutter_local_notifications</code> exigem regras extras em <code>android/app/proguard-rules.pro</code>. Sempre teste o build release num dispositivo real antes de publicar.
      </p>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer de bumpar a versão</strong>: rejeitado &quot;version code already exists&quot;.</li>
        <li><strong>Build debug subindo na loja</strong>: tela com banner &quot;DEBUG&quot;, app lento — sempre <code>--release</code>.</li>
        <li><strong>Falta de ícone adaptive (Android 8+)</strong>: ícone cortado ou estranho.</li>
        <li><strong>Permissões não declaradas</strong>: app crasha ao acessar câmera/localização.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Android: <code>build appbundle</code> + keystore + Play Console.</li>
        <li>iOS: <code>build ios</code> + Xcode Archive + App Store Connect.</li>
        <li>Sempre faça beta (Internal Testing / TestFlight) antes de production.</li>
        <li>Backup da keystore em vários lugares — perda é fatal.</li>
        <li>Codemagic ou fastlane automatizam o ciclo completo.</li>
      </ul>
    </PageContainer>
  );
}
