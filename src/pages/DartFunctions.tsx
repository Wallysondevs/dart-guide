import { PageContainer } from "@/components/layout/PageContainer";
import { AlertBox } from "@/components/ui/AlertBox";

export default function DartFunctions() {
  return (
    <PageContainer
      title="Cloud functions com Dart Functions Framework"
      subtitle="Escreva pequenas funções serverless em Dart e implante no Google Cloud Run sem se preocupar com servidor."
      difficulty="intermediario"
      timeToRead="13 min"
    >
      <p>
        <strong>Serverless</strong> não significa que não há servidor — significa que <em>você</em> não precisa cuidar dele. Você escreve uma função, faz upload, e a plataforma se encarrega de ligar o servidor quando alguém faz uma requisição e desligar quando ninguém usa. É como um táxi: você só paga pelo trecho que andou, não pelo carro parado. O <strong>Dart Functions Framework</strong> é a forma oficial de escrever essas funções em Dart para rodar no Google Cloud.
      </p>

      <h2>O que é o functions_framework?</h2>
      <p>
        É um pacote pub.dev (mantido pela Google) que pega uma função Dart anotada e expõe como servidor HTTP completo, pronto para ser empacotado em container e implantado no Cloud Run. Ele é construído sobre o <code>shelf</code>, então você ganha tudo do shelf de graça.
      </p>
      <pre><code>{`# pubspec.yaml
dependencies:
  functions_framework: ^0.4.0
  shelf: ^1.4.1
dev_dependencies:
  build_runner: ^2.4.0
  functions_framework_builder: ^0.4.0`}</code></pre>

      <h2>A função mais simples possível</h2>
      <pre><code>{`// functions/lib/functions.dart
import 'package:functions_framework/functions_framework.dart';
import 'package:shelf/shelf.dart';

@CloudFunction()
Response function(Request request) {
  final nome = request.url.queryParameters['nome'] ?? 'mundo';
  return Response.ok('Olá, \$nome do Cloud!');
}`}</code></pre>
      <p>
        A anotação <code>@CloudFunction()</code> é uma marca: o gerador de código vai descobrir essa função e criar automaticamente um <code>bin/server.dart</code> que monta o servidor HTTP. Você não escreve <code>main</code> — a framework cuida.
      </p>
      <pre><code>{`# Gera bin/server.dart automaticamente
dart run build_runner build

# Roda localmente
dart run bin/server.dart

# Testa
curl http://localhost:8080?nome=Maria`}</code></pre>

      <AlertBox type="info" title="Por que codegen?">
        Em vez de você escrever boilerplate (mesmo código repetido em todo projeto), a framework gera. Você foca só na lógica de negócio.
      </AlertBox>

      <h2>Funções tipadas com JSON</h2>
      <p>
        Existe também o tipo <code>CloudEvent</code> para receber payloads tipados (eventos do Pub/Sub, Storage, etc.):
      </p>
      <pre><code>{`import 'dart:convert';
import 'package:functions_framework/functions_framework.dart';
import 'package:shelf/shelf.dart';

@CloudFunction()
Future<Response> processarPedido(Request req) async {
  final body = await req.readAsString();
  final dados = jsonDecode(body) as Map<String, dynamic>;

  final total = (dados['itens'] as List)
      .map((e) => (e['preco'] as num).toDouble())
      .fold<double>(0, (acc, p) => acc + p);

  return Response.ok(
    jsonEncode({'total': total, 'status': 'aprovado'}),
    headers: {'content-type': 'application/json'},
  );
}`}</code></pre>

      <h2>Empacotando em container</h2>
      <p>
        O Cloud Run roda containers Docker. Use a imagem oficial do Dart:
      </p>
      <pre><code>{`# Dockerfile
FROM dart:stable AS build
WORKDIR /app
COPY pubspec.* ./
RUN dart pub get
COPY . .
RUN dart run build_runner build --delete-conflicting-outputs
RUN dart compile exe bin/server.dart -o bin/server

FROM scratch
COPY --from=build /runtime/ /
COPY --from=build /app/bin/server /app/bin/server
EXPOSE 8080
CMD ["/app/bin/server"]`}</code></pre>

      <h2>Deploy no Cloud Run</h2>
      <pre><code>{`# Faz build e push da imagem
gcloud builds submit --tag gcr.io/MEU_PROJETO/minha-funcao

# Cria/atualiza o serviço Cloud Run
gcloud run deploy minha-funcao \\
  --image gcr.io/MEU_PROJETO/minha-funcao \\
  --platform managed \\
  --region us-central1 \\
  --allow-unauthenticated`}</code></pre>
      <p>
        Em segundos a função está no ar com URL pública e HTTPS automático. Cloud Run escala de 0 a milhares de instâncias conforme demanda. Você paga por requisição/CPU usada, não por tempo ocioso.
      </p>

      <h2>O grande trunfo: cold start</h2>
      <p>
        Toda função serverless sofre de <strong>cold start</strong>: quando ela está &quot;dormindo&quot; e chega o primeiro pedido, a plataforma precisa subir um container novo, carregar o runtime, iniciar o app. Em Node.js esse processo leva ~300ms; em Java/Spring Boot pode chegar a 5 segundos. Em <strong>Dart compilado AOT</strong>, normalmente leva entre <strong>30 e 80ms</strong>. Isso porque o binário já está em código de máquina nativo, sem JIT, sem JVM, sem npm install.
      </p>

      <AlertBox type="success" title="Comparação prática">
        Para APIs sob demanda, webhooks e tarefas raras, a vantagem do cold start AOT do Dart é enorme — usuários não esperam por &quot;warm-up&quot;.
      </AlertBox>

      <h2>Comparação com alternativas</h2>
      <ul>
        <li><strong>Node.js (Express/Cloud Functions Gen 2)</strong>: ecossistema gigante, cold start médio. Boa para JS-first teams.</li>
        <li><strong>Go</strong>: cold start excelente, sintaxe simples; mas sem null safety nem Flutter.</li>
        <li><strong>Java/Spring</strong>: cold start péssimo (use GraalVM para amenizar), bibliotecas maduras.</li>
        <li><strong>Dart</strong>: cold start AOT excelente, código compartilhado com app Flutter, ecossistema serverless ainda em crescimento.</li>
      </ul>

      <h2>Casos de uso ideais</h2>
      <ul>
        <li>Webhooks (Stripe, GitHub, Slack).</li>
        <li>API leve para um app Flutter (mesma linguagem!).</li>
        <li>Processamento sob demanda (resize de imagem, parse de PDF).</li>
        <li>Backends pequenos com tráfego irregular.</li>
      </ul>

      <h2>Erros comuns</h2>
      <ul>
        <li><strong>Esquecer de rodar <code>build_runner</code></strong>: o <code>bin/server.dart</code> não é gerado e o Docker falha.</li>
        <li><strong>Usar porta hardcoded</strong>: leia da env <code>PORT</code> (Cloud Run define).</li>
        <li><strong>Carregar coisas pesadas no construtor</strong>: o cold start engorda. Use lazy.</li>
        <li><strong>Esquecer <code>--allow-unauthenticated</code></strong> e ficar com 403 ao testar.</li>
      </ul>

      <h2>Resumo</h2>
      <ul>
        <li><code>@CloudFunction()</code> + <code>build_runner</code> gera o servidor HTTP automaticamente.</li>
        <li>Empacote em Docker e implante no Cloud Run com um comando.</li>
        <li>Cold start AOT em Dart é uma vantagem competitiva real.</li>
        <li>Ideal para webhooks, APIs pequenas e backend de apps Flutter.</li>
      </ul>
    </PageContainer>
  );
}
