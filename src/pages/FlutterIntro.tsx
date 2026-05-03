import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function FlutterIntro() {
  return (
    <PageContainer
      title="Flutter: o framework que mudou o mobile"
      subtitle="O que é Flutter, por que ele desenha sua própria UI e como se compara ao React Native."
      difficulty="iniciante"
      timeToRead="11 min"
    >
      <p>
        Imagine que você quer abrir uma cafeteria em três cidades diferentes. Você poderia contratar um arquiteto para cada uma — um especialista em construção de SP, outro do Rio, outro de BH —, e cada loja sairia parecida, mas com diferenças sutis no balcão, nas cadeiras, na pintura. Esse é o jeito tradicional de fazer apps para celular: um time para Android (em Kotlin), outro para iOS (em Swift), outro para web (em JavaScript) e ainda outro para desktop. Muito caro, muito lento. <strong>Flutter</strong> é a proposta de "uma planta única para todas as lojas, e você mesmo constrói cada uma com as mesmas peças".
      </p>

      <h2>O que é Flutter, afinal?</h2>
      <p>
        Flutter é um <strong>framework</strong> (um conjunto pronto de ferramentas, bibliotecas e regras) criado pelo Google para construir interfaces gráficas. Com um único código-fonte escrito em <strong>Dart</strong>, você gera apps nativos para Android, iOS, Web, Windows, macOS e Linux. Não é "um app web embrulhado num app nativo" como o Cordova; também não é um <em>bridge</em> que conversa com componentes nativos como o React Native. Flutter desenha tudo do zero, pixel por pixel, na tela.
      </p>
      <pre><code>{`# Estrutura típica de um projeto Flutter
meu_app/
  lib/
    main.dart        # ponto de entrada (igual ao bin/ola.dart)
  android/           # projeto Android nativo gerado
  ios/               # projeto iOS nativo gerado
  web/               # arquivos para build web
  pubspec.yaml       # dependências (como package.json no Node)`}</code></pre>

      <h2>O motor gráfico: Skia (e agora Impeller)</h2>
      <p>
        Quando você escreve <code>Text('Olá')</code> em Flutter, esse texto não vira um <em>UILabel</em> do iOS nem um <em>TextView</em> do Android. Em vez disso, Flutter usa um motor de renderização chamado <strong>Skia</strong> (o mesmo que o Google Chrome usa para desenhar páginas web) para pintar diretamente na tela. Em apps mais novos, o Google introduziu o <strong>Impeller</strong>, um motor mais moderno baseado em Metal (iOS) e Vulkan (Android), que evita travadinhas (<em>jank</em>) na primeira renderização. O resultado: 60 ou 120 FPS suaves e UI <strong>idêntica</strong> em todas as plataformas.
      </p>

      <AlertBox type="info" title="Render engine vs widgets nativos">
        Pense no Skia como o pincel; o Flutter pinta cada botão, texto e ícone do zero. Por isso um app Flutter parece igual no iPhone e no Android — porque <em>os pixels</em> são igualzinhos, não dependem do sistema operacional.
      </AlertBox>

      <h2>Dart: a linguagem do Flutter</h2>
      <p>
        O Google escolheu Dart por dois motivos: tem <em>hot reload</em> (você salva o arquivo e a UI atualiza em meio segundo, sem perder o estado) e compila <strong>AOT</strong> (Ahead of Time) para código nativo de máquina, gerando binários rápidos como os escritos em Java/Kotlin/Swift. Em desenvolvimento, Dart roda na <strong>VM</strong> (com hot reload via JIT — Just In Time); em produção, vira código nativo puro.
      </p>
      <pre><code>{`// O "Hello, World!" mais simples de Flutter
import 'package:flutter/material.dart';

void main() => runApp(const MaterialApp(
      home: Scaffold(
        body: Center(
          child: Text('Olá, Flutter!'),
        ),
      ),
    ));`}</code></pre>

      <h2>Flutter vs React Native: qual a diferença real?</h2>
      <p>
        React Native (Facebook) também promete "um código, várias plataformas", mas usa uma estratégia diferente: o JavaScript roda numa <em>thread</em> separada e se comunica com componentes nativos do iOS/Android através de uma <strong>bridge</strong> (uma ponte que serializa mensagens). Isso pode causar engasgos quando há muita comunicação. Já o Flutter compila para código nativo e desenha tudo sozinho — sem ponte, sem JavaScript.
      </p>
      <ul>
        <li><strong>React Native</strong>: JS + bridge + componentes nativos. UI segue o look-and-feel do SO.</li>
        <li><strong>Flutter</strong>: Dart compilado AOT + render engine próprio. UI é idêntica em todo lugar.</li>
        <li><strong>Performance</strong>: Flutter geralmente leva vantagem em animações complexas e listas grandes.</li>
        <li><strong>Tamanho do app</strong>: Flutter empurra o engine junto, então o APK fica ~5MB maior.</li>
      </ul>

      <AlertBox type="warning" title="Flutter substitui o nativo?">
        Não. Para apps que usam recursos muito específicos do sistema (widget de tela inicial Android, extensões iOS, integração profunda com hardware), você ainda escreve código nativo via <em>platform channels</em>. Flutter cobre 95% dos casos; os 5% restantes envolvem ponte explícita.
      </AlertBox>

      <h2>Plataformas suportadas hoje</h2>
      <ul>
        <li><strong>Android</strong> (API 21+) e <strong>iOS</strong> (12+): suporte estável desde 2018.</li>
        <li><strong>Web</strong>: estável desde 2021. Dois renderers — HTML (compatível) e CanvasKit (fiel ao mobile).</li>
        <li><strong>Windows, macOS, Linux</strong>: estáveis. Mesmo código que mobile.</li>
        <li><strong>Embarcado</strong>: dispositivos como TVs, painéis automotivos (Toyota usa Flutter no infotainment).</li>
      </ul>

      <h2>Erros comuns de quem está começando</h2>
      <ul>
        <li><strong>Achar que Flutter é uma WebView</strong> — não é. Cada pixel é desenhado nativamente pelo Skia/Impeller.</li>
        <li><strong>Misturar conceitos do React Native</strong> — em Flutter não existe "Virtual DOM". A árvore de widgets é reconstruída inteira a cada <code>setState</code>, mas comparada por diff.</li>
        <li><strong>Confundir Dart com JavaScript</strong> — Dart tem tipagem estática estrita (null-safety) desde 2021. JS não.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li>Flutter = framework UI multiplataforma do Google em Dart.</li>
        <li>Desenha a UI do zero usando Skia/Impeller — não usa widgets nativos.</li>
        <li>Compila AOT para nativo em produção (rápido) e usa JIT em dev (hot reload).</li>
        <li>Suporta iOS, Android, Web, Windows, macOS, Linux com um único código-base.</li>
        <li>Diferente do React Native: sem bridge JS, sem componentes nativos.</li>
      </ul>
    </PageContainer>
  );
}
