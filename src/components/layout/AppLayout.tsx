import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ScrollToTop } from "./ScrollToTop";

export function AppLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-background">
      <ScrollToTop />
      <Sidebar isOpen={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={() => setOpen(true)} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
