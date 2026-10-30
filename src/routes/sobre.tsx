import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site";
import family from "@/assets/family.jpg";
import sisters from "@/assets/sisters.jpg";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre — Olhar Que Protege" },
      { name: "description", content: "Conheça o projeto Olhar Que Protege e a ODS 5.2." },
      { property: "og:title", content: "Sobre — Olhar Que Protege" },
      { property: "og:description", content: "Conheça o projeto Olhar Que Protege e a ODS 5.2." },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <SiteLayout>
      <section className="grid items-center gap-8 rounded-2xl bg-brand-panel p-8 text-brand-white shadow-lg md:grid-cols-[2fr_3fr]">
        <img src={sisters} alt="Meninas no notebook" loading="lazy" className="rounded-2xl border-4 border-brand-white" />
        <div className="space-y-3 text-sm">
          <h2 className="text-2xl font-bold">Monitoramento Digital: Proteção Essencial para Suas Filhas</h2>
          <p>A internet representa hoje uma dimensão essencial da vida. Para crianças e adolescentes, porém, ela traz riscos que exigem uma atuação protetora e ativa dos pais. Monitorar não é invasão, mas uma medida de segurança, carinho e orientação.</p>
          <p>O principal motivo para a vigilância é a proteção contra predadores e assédio online. O acompanhamento regular permite identificar e bloquear contatos ou comportamentos inadequados, além de prevenir o cyberbullying.</p>
          <p>Outra preocupação é a exposição a conteúdo inapropriado, a saúde mental, o tempo de tela e o risco de fraudes e roubo de dados.</p>
          <p>A maneira mais eficaz de monitorar é através de uma combinação de tecnologia e diálogo aberto: regras claras, controle parental e dispositivos em áreas comuns da casa.</p>
        </div>
      </section>

      <section className="mt-8 grid items-center gap-8 rounded-2xl bg-brand-panel p-8 text-brand-white shadow-lg md:grid-cols-[3fr_2fr]">
        <div className="space-y-3 text-sm">
          <h2 className="text-2xl font-bold">Olhar Que Protege: O Conhecimento que Transforma Preocupação em Segurança Real.</h2>
          <p className="font-extrabold italic">A sua filha merece crescer protegida, e você merece a tranquilidade de saber como defendê-la.</p>
          <p>O "Olhar Que Protege" é uma plataforma de vídeos projetada para ser o seu guia definitivo na missão de monitorar e proteger sua filha menor de idade.</p>
          <p>Oferecemos um treinamento prático e acessível que capacita pais e mães a entenderem e agirem sobre os riscos contemporâneos.</p>
          <p>É a ponte entre o seu amor incondicional e a ação protetiva eficaz.</p>
        </div>
        <img src={family} alt="Família abraçada" loading="lazy" className="aspect-square rounded-2xl border-4 border-brand-white object-cover" />
      </section>

      <section className="mt-12 space-y-4 text-justify text-sm">
        <h2 className="text-center text-2xl font-bold">Como surgiu o "Olhar Que Protege"</h2>
        <p>O "Olhar Que Protege" é um projeto desenvolvido por nossa equipe de alunos do curso técnico em Tecnologia da Informação: Alessandro, Ana, Felipe e Alexandre. A iniciativa está alinhada à Agenda 2030 da ONU e responde à meta 5.2 dos Objetivos de Desenvolvimento Sustentável, que visa eliminar todas as formas de violência contra mulheres e meninas.</p>
        <p>Nosso conteúdo ensina a identificar e prevenir situações de risco online, como cyberbullying e contato com predadores, e a fortalecer o diálogo em casa.</p>
        <p>O projeto é a prova de que a Tecnologia da Informação é sobre soluções que salvam, protegem e transformam vidas.</p>
      </section>

      <section className="mx-auto mt-12 grid max-w-2xl gap-4 rounded-2xl border-4 border-brand-white bg-brand-panel-strong p-6 text-xs sm:grid-cols-3">
        {[
          ["Objetivo", "Conscientizar crianças e adultos sobre os abusos online."],
          ["Proposta/Tecnologia", "Plataforma de vídeos curtos em HTML, CSS e JavaScript."],
          ["ODS 5.2", "Eliminar todas as formas de violência contra mulheres e meninas."],
          ["Funcionalidade", "Plataforma educacional, informativa e de fácil entendimento."],
          ["Usuários", "Pais, responsáveis e crianças."],
          ["Interface", "Logo, sobre e vídeos com abordagem acolhedora."],
        ].map(([t, d]: string[]) => [t ?? "", d ?? ""] as const).map(([t, d]) => (
          <div key={t} className="bg-brand-cream p-3">
            <p className="border-b border-brand-ink pb-1 font-bold uppercase">{t}</p>
            <p className="pt-1">{d}</p>
          </div>
        ))}
      </section>
    </SiteLayout>
  );
}
