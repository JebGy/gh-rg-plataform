"use client";

import { useEffect, useState } from "react";
import { FileEdit, ArrowUpRight } from "lucide-react";

export default function FloatingFormButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const formElement = document.getElementById("formulario");
      if (!formElement) return;

      const rect = formElement.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // El formulario está actualmente visible en pantalla
      const isFormInView = rect.top < windowHeight * 0.75 && rect.bottom > 120;

      // Mostrar el botón flotante cuando el usuario se desplaza y el formulario no está en foco
      const isPastTop = window.scrollY > 120;

      if (isPastTop && !isFormInView) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Verificación inicial
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    const formElement = document.getElementById("formulario");
    if (formElement) {
      const yOffset = -90; // compensar la cabecera fija
      const y = formElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });

      // Enfocar suavemente el primer campo después del desplazamiento
      setTimeout(() => {
        const input = formElement.querySelector<HTMLInputElement>("input#fullName, input");
        input?.focus();
      }, 500);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <button
        type="button"
        onClick={scrollToForm}
        aria-label="Ir al formulario de inscripción"
        className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#06BCA3] via-[#05c4aa] to-[#049480] px-4 py-3 sm:px-6 sm:py-3.5 text-zinc-950 font-black text-xs sm:text-sm uppercase tracking-wide shadow-[0_10px_30px_rgba(6,188,163,0.45)] hover:shadow-[0_15px_40px_rgba(6,188,163,0.65)] hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/30 backdrop-blur-sm cursor-pointer"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-zinc-950 text-[#06BCA3] shadow-xs group-hover:rotate-12 transition-transform">
          <FileEdit size={15} className="stroke-[2.5]" />
        </span>
        <span className="font-black tracking-tight">Inscribirme</span>
        <span className="hidden md:inline-block text-[10px] bg-zinc-950/80 text-white font-bold px-2 py-0.5 rounded-full ml-0.5">
          Formulario
        </span>
        <ArrowUpRight
          size={16}
          className="stroke-[3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
        />
      </button>
    </div>
  );
}
