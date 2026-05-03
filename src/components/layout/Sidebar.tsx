import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronDown, BookOpen, Sparkles, Code2, FunctionSquare, Boxes, Shield, List, Zap, AlertTriangle, Wrench, Smartphone, Rocket, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps { isOpen: boolean; onClose: () => void; }

const SECTIONS = [
  {
    "title": "Fundamentos",
    "icon": "Sparkles",
    "items": [
      {
        "title": "O “Olá, Mundo!” em Dart, Linha por Linha",
        "path": "/hello-explicado"
      },
      {
        "title": "A História do Dart e do Flutter",
        "path": "/historia-dart"
      },
      {
        "title": "Dart vs JavaScript, Java, Kotlin, Swift e TypeScript",
        "path": "/dart-vs-outras"
      },
      {
        "title": "Dart VM, JIT e AOT: como o Dart roda",
        "path": "/dart-vm-aot"
      },
      {
        "title": "Instalando o Dart SDK em Windows, Linux e macOS",
        "path": "/instalacao-sdk"
      },
      {
        "title": "O CLI dart: comandos essenciais",
        "path": "/dart-cli"
      },
      {
        "title": "Seu primeiro programa em Dart",
        "path": "/primeiro-programa"
      },
      {
        "title": "Entendendo o pubspec.yaml",
        "path": "/pubspec-yaml"
      },
      {
        "title": "pub.dev: o repositório de pacotes do Dart",
        "path": "/packages-pub"
      },
      {
        "title": "Escolhendo o editor: VS Code, Android Studio e IntelliJ",
        "path": "/ide-vscode-androidstudio"
      },
      {
        "title": "Depurando seu primeiro programa",
        "path": "/debug-basico"
      },
      {
        "title": "Build, compile e run: o ciclo completo",
        "path": "/build-run"
      },
      {
        "title": "Comentários e documentação com /// e dartdoc",
        "path": "/doc-comentarios"
      }
    ]
  },
  {
    "title": "Sintaxe e Tipos Básicos",
    "icon": "Code2",
    "items": [
      {
        "title": "Variáveis e o sistema de tipos do Dart",
        "path": "/variaveis-tipos"
      },
      {
        "title": "var, final e const: a tríade fundamental",
        "path": "/var-final-const"
      },
      {
        "title": "Tipos primitivos: int, double, num, bool, String",
        "path": "/tipos-primitivos"
      },
      {
        "title": "Strings em Dart: aspas, escapes e interpolação",
        "path": "/strings-fundamentos"
      },
      {
        "title": "Operadores aritméticos, lógicos e relacionais",
        "path": "/operadores"
      },
      {
        "title": "Conversões de tipos: parse, toString, as, is",
        "path": "/conversoes-parse"
      },
      {
        "title": "Condicionais: if, else, switch e if expression",
        "path": "/condicionais-if"
      },
      {
        "title": "Loops: for, for-in, while, do-while",
        "path": "/loops"
      },
      {
        "title": "Listas: a coleção mais usada de Dart",
        "path": "/listas-arrays"
      },
      {
        "title": "Maps: dicionários chave-valor",
        "path": "/maps"
      },
      {
        "title": "Sets: conjuntos sem duplicatas",
        "path": "/sets"
      },
      {
        "title": "Lendo e escrevendo no console com stdin/stdout",
        "path": "/console-io"
      }
    ]
  },
  {
    "title": "Funções",
    "icon": "FunctionSquare",
    "items": [
      {
        "title": "Funções: blocos reutilizáveis de lógica",
        "path": "/funcoes-basico"
      },
      {
        "title": "Parâmetros nomeados: chamadas que se autodocumentam",
        "path": "/parametros-named"
      },
      {
        "title": "Parâmetros opcionais posicionais com [ ]",
        "path": "/parametros-positional"
      },
      {
        "title": "Valores padrão em parâmetros",
        "path": "/default-values"
      },
      {
        "title": "Arrow functions: a sintaxe enxuta com =>",
        "path": "/arrow-functions"
      },
      {
        "title": "Closures: funções que carregam o ambiente",
        "path": "/closures"
      },
      {
        "title": "Recursão: funções que chamam a si mesmas",
        "path": "/recursao"
      },
      {
        "title": "Funções de alta ordem: funções como argumento",
        "path": "/higher-order"
      },
      {
        "title": "typedef: dando nome a tipos de função",
        "path": "/typedef"
      },
      {
        "title": "Funções genéricas: parametrizando o tipo",
        "path": "/generics-funcoes"
      },
      {
        "title": "Funções anônimas (lambdas) sem nome",
        "path": "/funcoes-anonimas"
      },
      {
        "title": "Introdução a funções async: o que muda",
        "path": "/funcoes-async-intro"
      }
    ]
  },
  {
    "title": "Programação Orientada a Objetos",
    "icon": "Boxes",
    "items": [
      {
        "title": "Classes e objetos: a base da POO em Dart",
        "path": "/classes-objetos"
      },
      {
        "title": "Propriedades, getters e setters",
        "path": "/propriedades-getters-setters"
      },
      {
        "title": "Construtores: dando vida aos objetos",
        "path": "/construtores"
      },
      {
        "title": "Construtores nomeados: múltiplas formas de criar",
        "path": "/named-constructors"
      },
      {
        "title": "this: a referência ao objeto atual",
        "path": "/this-keyword"
      },
      {
        "title": "Factory constructors: controle total na criação",
        "path": "/factories"
      },
      {
        "title": "Herança com extends: reutilizando comportamento",
        "path": "/heranca-extends"
      },
      {
        "title": "Classes abstratas: contratos parcialmente implementados",
        "path": "/abstract-classes"
      },
      {
        "title": "Interfaces: implements em vez de keyword interface",
        "path": "/interfaces-implements"
      },
      {
        "title": "Mixins: with para compor comportamentos",
        "path": "/mixins"
      },
      {
        "title": "Extension methods: adicionar métodos a tipos existentes",
        "path": "/extension-methods"
      },
      {
        "title": "Sobrecarga de operadores em Dart",
        "path": "/operator-overloading"
      }
    ]
  },
  {
    "title": "Sistema de Tipos Avançado",
    "icon": "Shield",
    "items": [
      {
        "title": "Null safety: o pilar do Dart 3",
        "path": "/null-safety"
      },
      {
        "title": "Tipos nullable e operadores null-aware",
        "path": "/nullable-types"
      },
      {
        "title": "late: inicialização tardia obrigatória",
        "path": "/late-keyword"
      },
      {
        "title": "Sound type system: o que isso significa na prática",
        "path": "/sound-types"
      },
      {
        "title": "Promoção de tipos: o compilador deduz por você",
        "path": "/type-promotion"
      },
      {
        "title": "dynamic vs Object vs Object?",
        "path": "/dynamic-vs-object"
      },
      {
        "title": "Generics em classes: tipos parametrizados",
        "path": "/generics-classes"
      },
      {
        "title": "Restrições genéricas: &lt;T extends Comparable&gt;",
        "path": "/generics-bounds"
      },
      {
        "title": "Records: tuplas tipadas em Dart 3",
        "path": "/records"
      },
      {
        "title": "Patterns: pattern matching em Dart 3",
        "path": "/patterns"
      },
      {
        "title": "Switch expressions: expressão em vez de declaração",
        "path": "/switch-expressions"
      },
      {
        "title": "Sealed classes: hierarquias fechadas e exaustivas",
        "path": "/sealed-classes"
      }
    ]
  },
  {
    "title": "Coleções e Iterables",
    "icon": "List",
    "items": [
      {
        "title": "List<T> detalhado: a workhorse das coleções",
        "path": "/list-detalhado"
      },
      {
        "title": "Map<K,V> detalhado: lookup eficiente",
        "path": "/map-detalhado"
      },
      {
        "title": "Set<T> detalhado: matemática de conjuntos",
        "path": "/set-detalhado"
      },
      {
        "title": "Iterable<T>: a interface mãe de todas as coleções",
        "path": "/iterable-base"
      },
      {
        "title": "where, map, toList: trio essencial",
        "path": "/where-map-tolist"
      },
      {
        "title": "fold e reduce: redução de coleções",
        "path": "/fold-reduce"
      },
      {
        "title": "Ordenando listas: sort e Comparator",
        "path": "/sort-comparator"
      },
      {
        "title": "Queue<T> e implementações de pilha em Dart",
        "path": "/queue-stack"
      },
      {
        "title": "LinkedHashMap, HashMap, SplayTreeMap",
        "path": "/linked-hash-map"
      },
      {
        "title": "Comparable e Comparator: ordenação customizada",
        "path": "/comparable-comparator"
      },
      {
        "title": "Collection if e for: literais inteligentes",
        "path": "/collection-if-for"
      },
      {
        "title": "Generators: sync* e async* com yield",
        "path": "/generators-sync-async"
      }
    ]
  },
  {
    "title": "Async e Streams",
    "icon": "Zap",
    "items": [
      {
        "title": "Future: o que é e como funciona",
        "path": "/future-basico"
      },
      {
        "title": "async/await: código assíncrono que parece síncrono",
        "path": "/async-await"
      },
      {
        "title": "Completer: criando Future manualmente",
        "path": "/future-completer"
      },
      {
        "title": "then, catchError e whenComplete: a API antiga (mas viva)",
        "path": "/future-then-catch-error"
      },
      {
        "title": "FutureOr<T>: aceita valor síncrono OU Future",
        "path": "/futureor"
      },
      {
        "title": "Streams: sequência assíncrona de eventos",
        "path": "/streams-intro"
      },
      {
        "title": "StreamController: criando streams manualmente",
        "path": "/stream-controller"
      },
      {
        "title": "Single-subscription vs Broadcast streams",
        "path": "/stream-broadcast"
      },
      {
        "title": "Transformando streams: map, where, transform",
        "path": "/stream-transformations"
      },
      {
        "title": "async* generators: produzindo streams com yield",
        "path": "/async-iterable"
      },
      {
        "title": "Isolates: paralelismo real (sem threads)",
        "path": "/isolates"
      },
      {
        "title": "Pool de isolates: reutilizando workers",
        "path": "/isolate-pool"
      }
    ]
  },
  {
    "title": "Erros, IO e Arquivos",
    "icon": "AlertTriangle",
    "items": [
      {
        "title": "Exception vs Error: a diferença que importa",
        "path": "/exceptions-vs-errors"
      },
      {
        "title": "try / catch / finally: tratando exceções",
        "path": "/try-catch"
      },
      {
        "title": "throw: lançando exceções",
        "path": "/throw"
      },
      {
        "title": "Criando exceções customizadas",
        "path": "/custom-exceptions"
      },
      {
        "title": "finally e fluxo de controle em exceções",
        "path": "/finally-flow"
      },
      {
        "title": "Stack traces: lendo o pavor do desenvolvedor",
        "path": "/stack-traces"
      },
      {
        "title": "assert e debug-only checks",
        "path": "/assert-debug"
      },
      {
        "title": "dart:io: arquivos, processos e mais",
        "path": "/dart-io-intro"
      },
      {
        "title": "Lendo e escrevendo arquivos com File",
        "path": "/file-read-write"
      },
      {
        "title": "Directory: navegando e criando pastas",
        "path": "/directory-fs"
      },
      {
        "title": "Fazendo HTTP requests com dart:io HttpClient",
        "path": "/http-client-dart"
      },
      {
        "title": "JSON em Dart: encode, decode e tipagem segura",
        "path": "/json-encode-decode"
      }
    ]
  },
  {
    "title": "Tools e Testing",
    "icon": "Wrench",
    "items": [
      {
        "title": "Testes unitários com o package test",
        "path": "/test-package"
      },
      {
        "title": "Mocktail: mocks sem code-gen",
        "path": "/mocktail"
      },
      {
        "title": "Testes de integração e end-to-end no Flutter",
        "path": "/integration-test"
      },
      {
        "title": "Testando código assíncrono: Future e Stream",
        "path": "/test-async"
      },
      {
        "title": "dart format: formatação automática e consistente",
        "path": "/dart-format"
      },
      {
        "title": "dart analyze e analysis_options.yaml",
        "path": "/dart-analyze"
      },
      {
        "title": "dart fix: refatoração automática",
        "path": "/dart-fix"
      },
      {
        "title": "build_runner: geradores de código em Dart",
        "path": "/build-runner"
      },
      {
        "title": "freezed: classes imutáveis com superpoderes",
        "path": "/freezed"
      },
      {
        "title": "FFI: chamando código C/C++ a partir do Dart",
        "path": "/ffi-basico"
      }
    ]
  },
  {
    "title": "Flutter — Introdução",
    "icon": "Smartphone",
    "items": [
      {
        "title": "Flutter: o framework que mudou o mobile",
        "path": "/flutter-intro"
      },
      {
        "title": "Instalando o Flutter SDK",
        "path": "/flutter-instalacao"
      },
      {
        "title": "Tudo é Widget: o conceito central do Flutter",
        "path": "/widgets-fundamentais"
      },
      {
        "title": "StatelessWidget vs StatefulWidget",
        "path": "/stateless-stateful"
      },
      {
        "title": "Layout básico: Row, Column, Expanded e Flexible",
        "path": "/layout-row-column"
      },
      {
        "title": "Container, Padding, SizedBox e BoxDecoration",
        "path": "/container-padding"
      },
      {
        "title": "ListView: listas roláveis e performance",
        "path": "/listview"
      },
      {
        "title": "Navegação entre telas: Navigator 1.0",
        "path": "/navigator-push"
      },
      {
        "title": "Theming com Material 3",
        "path": "/theme-material"
      },
      {
        "title": "Hot reload e hot restart: o superpoder do Flutter",
        "path": "/hot-reload"
      },
      {
        "title": "Imagens e assets em Flutter",
        "path": "/assets-images"
      },
      {
        "title": "Detectando gestos: GestureDetector e InkWell",
        "path": "/gestures-basico"
      }
    ]
  },
  {
    "title": "Flutter — Avançado",
    "icon": "Rocket",
    "items": [
      {
        "title": "Animações básicas: AnimatedContainer e Tweens",
        "path": "/animations-basico"
      },
      {
        "title": "InheritedWidget: passando dados pela árvore",
        "path": "/inherited-widget"
      },
      {
        "title": "Provider: state management oficial do Flutter",
        "path": "/provider"
      },
      {
        "title": "Riverpod: a evolução do Provider",
        "path": "/riverpod"
      },
      {
        "title": "BLoC: separação rigorosa de UI e lógica",
        "path": "/bloc"
      },
      {
        "title": "Consumindo APIs com http e dio",
        "path": "/http-flutter"
      },
      {
        "title": "Persistência local com sqflite",
        "path": "/sqflite"
      },
      {
        "title": "shared_preferences: armazenando configs simples",
        "path": "/shared-prefs"
      },
      {
        "title": "Slivers: scroll views customizados e poderosos",
        "path": "/slivers"
      },
      {
        "title": "Desenhando do zero com CustomPainter",
        "path": "/custom-painter"
      },
      {
        "title": "Platform channels: chamando código nativo Android/iOS",
        "path": "/platform-channels"
      },
      {
        "title": "Performance no Flutter: dicas práticas",
        "path": "/performance-flutter"
      },
      {
        "title": "Deploy de apps Flutter: Android e iOS",
        "path": "/deploy-android-ios"
      },
      {
        "title": "Projeto Final: App de Tarefas Completo em Flutter",
        "path": "/projeto-final-todo-app"
      }
    ]
  },
  {
    "title": "Web, CLI e Server",
    "icon": "Globe",
    "items": [
      {
        "title": "Dart no navegador: dart compile js",
        "path": "/dart-web"
      },
      {
        "title": "Flutter Web: o mesmo código no navegador",
        "path": "/flutter-web"
      },
      {
        "title": "Construindo CLIs robustas em Dart",
        "path": "/dart-cli-apps"
      },
      {
        "title": "Servidor HTTP em Dart: o framework shelf",
        "path": "/dart-http-server"
      },
      {
        "title": "WebSockets em Dart: cliente e servidor",
        "path": "/websockets-dart"
      },
      {
        "title": "gRPC com Dart: protobuf e codegen",
        "path": "/grpc-dart"
      },
      {
        "title": "Cloud functions com Dart Functions Framework",
        "path": "/dart-functions"
      },
      {
        "title": "Serverpod: framework backend full-stack em Dart",
        "path": "/dart-serverpod"
      },
      {
        "title": "Dart Frog: backend rápido inspirado no Next.js",
        "path": "/dart-frog"
      },
      {
        "title": "Benchmarking de código Dart",
        "path": "/benchmark-dart"
      },
      {
        "title": "Migrando código antigo para null safety",
        "path": "/null-safety-migration"
      },
      {
        "title": "Cheatsheet final de Dart: tudo em uma página",
        "path": "/dart-cheatsheet"
      }
    ]
  }
];

const ICONS: Record<string, any> = { Sparkles, Code2, FunctionSquare, Boxes, Shield, List, Zap, AlertTriangle, Wrench, Smartphone, Rocket, Globe };

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s, i) => [s.title, i < 2]))
  );
  const toggle = (t: string) => setOpenSections(p => ({ ...p, [t]: !p[t] }));
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-card border-r border-border flex flex-col transition-transform duration-200",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <Link href="/" onClick={onClose} className="flex items-center gap-2.5 px-5 py-4 border-b border-border hover:bg-muted/50">
          <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground font-extrabold text-xs flex items-center justify-center shadow">Dart</div>
          <div>
            <div className="font-bold text-sm leading-tight">Dart &amp; Flutter</div>
            <div className="text-xs text-muted-foreground">Guia Completo PT-BR</div>
          </div>
        </Link>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <Link href="/" onClick={onClose} className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            location === "/" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}>
            <BookOpen className="w-4 h-4" />Início
          </Link>
          {SECTIONS.map((s) => {
            const Icon = ICONS[s.icon];
            const isOpenS = openSections[s.title];
            return (
              <div key={s.title} className="pt-2">
                <button onClick={() => toggle(s.title)} className="w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground">
                  <span className="flex items-center gap-2"><Icon className="w-3.5 h-3.5" />{s.title}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isOpenS && "rotate-180")} />
                </button>
                {isOpenS && (
                  <div className="mt-1 space-y-0.5">
                    {s.items.map((item) => (
                      <Link key={item.path} href={item.path} onClick={onClose} className={cn(
                        "block px-3 py-1.5 ml-4 text-sm rounded-md transition-colors border-l-2",
                        location === item.path ? "bg-primary/10 text-primary border-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-transparent"
                      )}>{item.title}</Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
          {145} capítulos &middot; PT-BR
        </div>
      </aside>
    </>
  );
}
