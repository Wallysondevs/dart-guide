import { Link } from "wouter";
export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-7xl font-extrabold text-primary mb-2">404</div>
      <h1 className="text-2xl font-bold mb-2">Página não encontrada</h1>
      <p className="text-muted-foreground mb-6">Esse capítulo ainda não foi escrito — ou o link está errado.</p>
      <Link href="/" className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold">Voltar ao início</Link>
    </div>
  );
}
