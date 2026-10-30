import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { SiteLayout } from "@/components/site";
import hero from "@/assets/hero.jpg";
import sisters from "@/assets/sisters.jpg";
import phone from "@/assets/phone.jpg";
import family from "@/assets/family.jpg";

export const Route = createFileRoute("/home")({
  head: () => ({
    meta: [
      { title: "Home — Olhar Que Protege" },
      { name: "description", content: "Monitorar é cuidar: segurança digital para suas filhas." },
      { property: "og:title", content: "Home — Olhar Que Protege" },
      { property: "og:description", content: "Monitorar é cuidar: segurança digital para suas filhas." },
    ],
  }),
  component: Home,
});

const slides = [
  { img: hero, title: "Segurança e Cuidado Digital", text: "Protegendo nossas crianças e adolescentes no ambiente virtual." },
  { img: sisters, title: "Diálogo em Família", text: "Conversar abertamente é a melhor forma de proteção." },
  { img: phone, title: "Controle Consciente", text: "Conheça os aplicativos que suas filhas usam." },
];

function Home() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);
  const s = slides[i];
  return (
    <SiteLayout>
      <h1 className="mx-auto flex w-fit items-center gap-2 border-b-4 border-brand-accent px-12 pb-4 text-3xl font-bold text-brand-accent">
        <Users className="h-9 w-9" /> MONITORAR = CUIDAR.
      </h1>

      <div className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border-4 border-brand-white shadow-xl">
        <img src={s.img} alt={s.title} width={1280} height={640} className="aspect-[2/1] w-full object-cover" />
        <button aria-label="Anterior" onClick={() => setI((i + slides.length - 1) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-brand-white/90 p-2"><ChevronLeft /></button>
        <button aria-label="Próximo" onClick={() => setI((i + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-brand-white/90 p-2"><ChevronRight /></button>
        <div className="absolute inset-x-6 bottom-8 rounded-xl bg-brand-white/90 px-6 py-3">
          <p className="font-bold">{s.title}</p>
          <p className="text-xs">{s.text}</p>
        </div>
        <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
          {slides.map((_, k) => (
            <span key={k} className={`h-1.5 rounded-full bg-brand-ink ${k === i ? "w-6" : "w-1.5 opacity-40"}`} />
          ))}
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-xl text-center text-sm">
        Muitas meninas estão expostas a riscos na internet. É de extrema importância que os responsáveis estejam
        atentos ao comportamento online, orientando e oferecendo diálogo aberto para garantir a segurança digital delas.
      </p>

      <section className="relative mx-auto mt-10 h-[600px] max-w-4xl overflow-hidden rounded-2xl bg-brand-panel shadow-lg">
        <img src={hero} alt="" loading="lazy" className="absolute left-[5%] top-[6%] h-72 w-72 rounded-full object-cover" />
        <Bubble className="left-[45%] top-[15%] h-52 w-52 bg-brand-bg text-brand-plum">CUIDAR</Bubble>
        <Bubble className="left-[30%] top-[33%] h-52 w-52 bg-brand-cream text-brand-plum">AMAR</Bubble>
        <Bubble className="right-[3%] top-[34%] h-48 w-48 bg-brand-panel-strong text-brand-white">EVITE</Bubble>
        <img src={family} alt="" loading="lazy" className="absolute right-[15%] top-[47%] h-52 w-52 rounded-full object-cover" />
        <Bubble className="left-[50%] top-[64%] h-48 w-48 bg-brand-blue text-brand-white">ZELAR</Bubble>
      </section>

      <section className="mx-auto mt-10 grid max-w-4xl items-center gap-8 rounded-2xl bg-brand-panel-strong p-8 shadow-lg md:grid-cols-2">
        <img src={sisters} alt="Irmãs usando notebook" loading="lazy" width={1024} height={704} className="rounded-2xl border-4 border-brand-white" />
        <p className="text-2xl font-extrabold text-brand-white">CUIDAR E AMAR, PODE SALVAR E POUPAR.</p>
      </section>
    </SiteLayout>
  );
}

function Bubble({ className, children }: { className: string; children: string }) {
  return (
    <div className={`absolute flex items-center justify-center rounded-full text-4xl font-black shadow-md ${className}`}>
      <span className="border-b-2 border-current">{children}</span>
    </div>
  );
}
