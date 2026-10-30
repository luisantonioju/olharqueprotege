import { createFileRoute } from "@tanstack/react-router";
import { Users } from "lucide-react";
import { HomeCarousel } from "@/components/home-carousel";
import { SiteLayout } from "@/components/site";
import hero from "@/assets/hero.jpg";
import sisters from "@/assets/sisters.jpg";
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

function Home() {
  return (
    <SiteLayout>
      <h1 className="mx-auto flex w-fit max-w-full items-center gap-2 border-b-4 border-brand-accent px-2 pb-4 text-lg font-bold text-brand-ink sm:px-8 sm:text-3xl">
        <Users className="h-7 w-7 shrink-0 sm:h-9 sm:w-9" /> MONITORAR = CUIDAR.
      </h1>

      <HomeCarousel />

      <p className="mx-auto mt-10 max-w-xl text-center text-sm">
        Muitas meninas estão expostas a riscos na internet. É de extrema importância que os responsáveis estejam
        atentos ao comportamento online, orientando e oferecendo diálogo aberto para garantir a segurança digital delas.
      </p>

      <section className="care-collage relative mx-auto mt-10 h-[600px] max-w-4xl overflow-hidden rounded-2xl bg-brand-panel shadow-lg">
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
