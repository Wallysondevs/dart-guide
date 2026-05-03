import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Link } from "wouter";
interface HeaderProps { onMenuClick: () => void; }
export function Header({ onMenuClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="sticky top-0 z-30 w-full bg-card/80 backdrop-blur-xl border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2 lg:hidden">
          <span className="w-7 h-7 rounded bg-primary text-primary-foreground font-extrabold text-[10px] flex items-center justify-center">Dart</span>
          <span className="font-bold text-sm">Dart Guia</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Dart 3.5 / Flutter 3.24
        </span>
        <button onClick={toggleTheme} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted" title="Alternar tema">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
