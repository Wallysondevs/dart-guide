import { useEffect } from "react";
import { useLocation } from "wouter";

export function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.querySelectorAll<HTMLElement>("main, [data-scroll-container]").forEach((el) => {
      el.scrollTop = 0;
    });
  }, [location]);
  return null;
}
