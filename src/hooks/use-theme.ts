import { useEffect, useState } from "react";
export function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    const initial = stored ?? "dark";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);
  const toggleTheme = () => {
    setTheme(t => {
      const n = t === "dark" ? "light" : "dark";
      localStorage.setItem("theme", n);
      document.documentElement.classList.toggle("dark", n === "dark");
      return n;
    });
  };
  return { theme, toggleTheme };
}
