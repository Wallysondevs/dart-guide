import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function PlatformChannels() {
  return (
    <PageContainer
      title="Platform channels: chamando código nativo Android/iOS"
      subtitle="Quando o Flutter não cobre, peça ajuda direto para Kotlin ou Swift."
      difficulty="avancado"
      timeToRead="15 min"
    >
      <p>
        O Flutter cobre 95% das necessidades, mas há casos onde você precisa falar com APIs específicas do sistema — ler o nível de bateria, abrir um sensor exótico, integrar com um SDK proprietário do Android. Para esses casos, existe o conceito de <strong>platform channel</strong>: um &quot;cabo&quot; bidirecional entre seu código Dart e o código nativo (Kotlin no Android, Swift no iOS). Pense num intercomunicador entre dois andares de um prédio: você fala uma frase de um lado, do outro alguém recebe, processa e responde.
      </p>

      <h2>MethodChannel: chamada de função única</h2>
      <p>
        O canal mais comum é o <code>MethodChannel</code>. Ele é como uma chamada de função RPC: você invoca um método com um nome (string) e argumentos; o lado nativo executa e devolve um resultado (ou um erro). Os dados serializam automaticamente — passe primitivos, listas ou mapas.
      </p>
      <pre><code>{`import 'package:flutter/services.dart';

class Bateria {
  // Convenção: 'pacote.exemplo.app/categoria'
  static const _canal = MethodChannel('com.exemplo.app/bateria');

  Future<int> nivelAtual() async {
    try {
      final nivel = await _canal.invokeMethod<int>('getBatteryLevel');
      return nivel ?? -1;
    } on PlatformException catch (e) {
      throw Exception('Falha ao ler bateria: \${e.message}');
    }
  }
}`}</code></pre>

      <h2>Lado Android (Kotlin)</h2>
      <p>
        No arquivo <code>MainActivity.kt</code> do projeto Android (em <code>android/app/src/main/kotlin/...</code>), registre um handler:
      </p>
      <pre><code>{`package com.exemplo.app

import android.content.Context
import android.os.BatteryManager
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel

class MainActivity : FlutterActivity() {
    private val CHANNEL = "com.exemplo.app/bateria"

    override fun configureFlutterEngine(engine: FlutterEngine) {
        super.configureFlutterEngine(engine)
        MethodChannel(engine.dartExecutor.binaryMessenger, CHANNEL)
            .setMethodCallHandler { call, result ->
                if (call.method == "getBatteryLevel") {
                    val bm = getSystemService(Context.BATTERY_SERVICE) as BatteryManager
                    val nivel = bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
                    if (nivel != -1) result.success(nivel)
                    else result.error("INDISPONIVEL", "Não conseguiu ler", null)
                } else {
                    result.notImplemented()
                }
            }
    }
}`}</code></pre>

      <h2>Lado iOS (Swift)</h2>
      <p>
        No <code>AppDelegate.swift</code> em <code>ios/Runner/</code>:
      </p>
      <pre><code>{`import UIKit
import Flutter

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    let controller = window?.rootViewController as! FlutterViewController
    let canal = FlutterMethodChannel(
      name: "com.exemplo.app/bateria",
      binaryMessenger: controller.binaryMessenger)

    canal.setMethodCallHandler { (call, result) in
      if call.method == "getBatteryLevel" {
        let device = UIDevice.current
        device.isBatteryMonitoringEnabled = true
        if device.batteryState == .unknown {
          result(FlutterError(code: "INDISPONIVEL",
                              message: "Sem leitura", details: nil))
        } else {
          result(Int(device.batteryLevel * 100))
        }
      } else {
        result(FlutterMethodNotImplemented)
      }
    }
    GeneratedPluginRegistrant.register(with: self)
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
}`}</code></pre>

      <AlertBox type="info" title="Tipos suportados na serialização">
        Apenas <code>null</code>, <code>bool</code>, <code>int</code>, <code>double</code>, <code>String</code>, <code>Uint8List</code>, <code>List</code> e <code>Map</code>. Para objetos complexos, transforme em mapa antes.
      </AlertBox>

      <h2>EventChannel: streams contínuos</h2>
      <p>
        Quando o nativo precisa enviar <strong>vários valores ao longo do tempo</strong> (giroscópio, GPS, sensor de luz), use <code>EventChannel</code>. Do lado Dart, você obtém um <code>Stream</code>; cada novo dado emite um evento.
      </p>
      <pre><code>{`const _evento = EventChannel('com.exemplo.app/giroscopio');

Stream<List<double>> get giroscopio =>
    _evento.receiveBroadcastStream().map((e) => List<double>.from(e as List));

// Uso:
StreamBuilder<List<double>>(
  stream: giroscopio,
  builder: (_, snap) => Text('\${snap.data}'),
);`}</code></pre>
      <p>
        Do lado Android, registre um <code>EventChannel.StreamHandler</code> com <code>onListen</code> e <code>onCancel</code>; em iOS, <code>FlutterStreamHandler</code>.
      </p>

      <h2>Plugins: encapsulando o trabalho</h2>
      <p>
        Para reuso, transforme seu canal em um <strong>plugin</strong>: <code>flutter create --template=plugin meu_plugin</code>. Isso gera a estrutura padrão (Dart + Android + iOS) e permite publicar no <a href="https://pub.dev">pub.dev</a>. Antes de inventar a roda, busque lá: existem plugins prontos para câmera, geolocalização, biometria, NFC e quase tudo.
      </p>

      <h2>FFI: alternativa para C/C++</h2>
      <p>
        Se a biblioteca que você quer usar é em C ou Rust (e expõe interface C), Platform Channels é exagero — use <code>dart:ffi</code> (Foreign Function Interface). Você carrega a <code>.so</code>/<code>.dylib</code> e chama funções diretamente, sem ida e volta de mensagens. É mais rápido, mas mais delicado (você lida com ponteiros).
      </p>
      <pre><code>{`import 'dart:ffi';
import 'package:ffi/ffi.dart';

typedef SomarC = Int32 Function(Int32 a, Int32 b);
typedef SomarDart = int Function(int a, int b);

final lib = DynamicLibrary.open('libcalc.so');
final somar = lib.lookupFunction<SomarC, SomarDart>('somar');

void main() {
  print(somar(3, 4)); // 7
}`}</code></pre>

      <AlertBox type="warning" title="Custos da fronteira">
        Cada chamada via MethodChannel cruza a barreira Dart↔nativo: serializa, copia memória, deserializa. Para chamadas frequentes (60fps), pode ser gargalo. Prefira FFI ou batch (várias coisas em uma chamada só).
      </AlertBox>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Nome do canal divergente</strong> entre Dart e nativo: silêncio absoluto.</li>
        <li><strong>Esquecer <code>configureFlutterEngine</code></strong> no Android: handler não roda.</li>
        <li><strong>Bloquear thread principal nativa</strong>: app trava. Use coroutines/AsyncTask/async-await.</li>
        <li><strong>Tipos não suportados</strong>: passar um objeto Kotlin direto = exception.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>MethodChannel</code>: chamada de função pontual (request/response).</li>
        <li><code>EventChannel</code>: stream contínuo de eventos do nativo.</li>
        <li>Tipos serializáveis: primitivos, List, Map, Uint8List.</li>
        <li>Plugins encapsulam canais para distribuição no pub.dev.</li>
        <li>FFI é alternativa direta para libs C/C++ (sem mensagens).</li>
      </ul>
    </PageContainer>
  );
}
