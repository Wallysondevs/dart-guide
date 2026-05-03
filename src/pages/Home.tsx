import { Link } from "wouter";
import { ArrowRight, Sparkles, Code2, Smartphone, Zap, Boxes, Globe } from "lucide-react";

export default function Home() {
  const trilhas = [
    { icon: Sparkles, title: "Fundamentos", desc: "Instalação, Dart VM/AOT, primeiro programa, pubspec, IDE." },
    { icon: Code2, title: "Sintaxe e Tipos", desc: "Variáveis, var/final/const, tipos, strings, operadores, loops." },
    { icon: Boxes, title: "POO e Tipos Avançados", desc: "Classes, mixins, generics, null-safety, records, patterns, sealed." },
    { icon: Zap, title: "Async e Streams", desc: "Future, async/await, Stream, isolates, paralelismo real." },
    { icon: Smartphone, title: "Flutter Mobile", desc: "Widgets, layouts, navegação, Material 3, animações, state mgmt." },
    { icon: Globe, title: "Web, CLI e Server", desc: "Flutter Web, dart compile, shelf, gRPC, Serverpod, Dart Frog." },
  ];
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          145 capítulos profundos &middot; Dart 3.5 + Flutter 3.24
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-5">
          Dart &amp; Flutter
          <span className="block text-primary mt-2">do Zero ao Avançado</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Um livro online em <strong>português brasileiro</strong>, escrito para quem nunca programou.
          Cada conceito é explicado com analogias do mundo real, código comentado e exemplos práticos.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link href="/historia-dart" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition">
            Começar a ler <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/hello-explicado" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border hover:bg-muted transition font-semibold">
            Ver capítulo exemplo
          </Link>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {trilhas.map((t) => {
          const Icon = t.icon;
          return (
            <div key={t.title} className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition">
              <Icon className="w-7 h-7 text-primary mb-3" />
              <h3 className="font-bold mb-1">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-16 p-6 rounded-xl bg-muted/40 border border-border text-center">
        <p className="text-sm text-muted-foreground">
          Open-source no GitHub. Ideal para autodidatas, faculdades e quem quer migrar para Flutter.
        </p>
      </div>
    </div>
  );
}
