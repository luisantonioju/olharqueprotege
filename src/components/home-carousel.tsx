import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/hero.jpg";
import sisters from "@/assets/sisters.jpg";
import phone from "@/assets/phone.jpg";

const slides = [
  { img: hero, title: "Segurança e Cuidado Digital", text: "Protegendo nossas crianças e adolescentes no ambiente virtual." },
  { img: sisters, title: "Diálogo em Família", text: "Conversar abertamente é a melhor forma de proteção." },
  { img: phone, title: "Controle Consciente", text: "Conheça os aplicativos que suas filhas usam." },
];

export function HomeCarousel() {
  const autoplay = useRef(Autoplay({ delay: 5000, playOnInit: false, stopOnInteraction: false, stopOnMouseEnter: true }));
  const [ref, api] = useEmblaCarousel({ loop: true, duration: 35 }, [autoplay.current]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const select = useCallback(() => { if (api) setIndex(api.selectedScrollSnap()); }, [api]);
  useEffect(() => {
    if (!api) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced) { autoplay.current.play(); setPlaying(true); }
    api.on("select", select);
    return () => { api.off("select", select); };
  }, [api, select]);
  const toggle = () => {
    if (playing) autoplay.current.stop(); else autoplay.current.play();
    setPlaying(!playing);
  };
  const current = slides[index];
  return (
    <section aria-roledescription="carrossel" aria-label="Segurança digital em família" className="mx-auto mt-8 max-w-3xl">
      <div ref={ref} className="overflow-hidden rounded-lg">
        <div className="flex touch-pan-y">
          {slides.map((s, i) => <div key={s.title} className="min-w-0 flex-[0_0_100%]" aria-hidden={i !== index}><img src={s.img} alt={s.title} width={1280} height={640} className="aspect-[16/10] w-full object-cover sm:aspect-[2/1]" /></div>)}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0 min-h-20 sm:min-h-14" aria-live={playing ? "off" : "polite"}><h2 className="text-base font-bold sm:text-lg">{current?.title}</h2><p className="mt-1 text-xs sm:text-sm">{current?.text}</p></div>
        <div className="flex shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Slide anterior" title="Slide anterior" onClick={() => api?.scrollPrev()} className="text-brand-ink hover:bg-brand-cream"><ChevronLeft /></Button>
          <Button variant="ghost" size="icon" aria-label="Próximo slide" title="Próximo slide" onClick={() => api?.scrollNext()} className="text-brand-ink hover:bg-brand-cream"><ChevronRight /></Button>
        </div>
      </div>
      <div className="mt-1 flex items-center justify-center gap-1">
        {slides.map((s, i) => <Button key={s.title} variant="ghost" size="icon" aria-label={`Ir para slide ${i + 1}`} aria-current={i === index ? "true" : undefined} onClick={() => api?.scrollTo(i)} className="h-8 w-8 hover:bg-brand-cream"><span className={`h-1.5 rounded-full bg-brand-ink transition-[width,opacity] motion-reduce:transition-none ${index === i ? "w-5" : "w-1.5 opacity-40"}`} /></Button>)}
        <Button variant="ghost" size="icon" aria-label={playing ? "Pausar carrossel" : "Reproduzir carrossel"} title={playing ? "Pausar carrossel" : "Reproduzir carrossel"} onClick={toggle} className="h-8 w-8 text-brand-ink hover:bg-brand-cream">{playing ? <Pause /> : <Play />}</Button>
      </div>
    </section>
  );
}