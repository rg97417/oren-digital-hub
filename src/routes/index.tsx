import { createFileRoute } from "@tanstack/react-router";
import { Instagram, ArrowUpRight, MessageCircle, Users, Workflow } from "lucide-react";
import renanPhoto from "@/assets/renan.png";

export const Route = createFileRoute("/")(({
  component: Index,
  head: () => ({
    meta: [
      { title: "Renan Galhardo — IA, Automações & Negócios" },
      {
        name: "description",
        content:
          "Tecnologia, IA e automações aplicadas a negócios reais. Consultoria técnica estratégica, comunidade DN.AI Club e implementações pela Conecta One.",
      },
      { property: "og:title", content: "Renan Galhardo — IA & Automações" },
      {
        property: "og:description",
        content: "Tecnologia, IA e automações aplicadas a negócios reais.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
} as any));

type Link = {
  eyebrow: string;
  title: string;
  description: string;
  meta?: string;
  href: string;
  Icon: typeof MessageCircle;
  external?: boolean;
  featured?: boolean;
};

const links: Link[] = [
  {
    eyebrow: "",
    title: "Consultoria Técnica Estratégica",
    description:
      "Acompanhamento técnico estratégico para IA, automações, SaaS e microSaaS.",
    meta: "Vagas limitadas • Aplicação privada",
    href: "/aplicacao",
    Icon: MessageCircle,
    external: false,
    featured: true,
  },
  {
    eyebrow: "Comunidade",
    title: "DN.AI Club",
    description:
      "Comunidade exclusiva para empreendedores que transformam conhecimento em negócios rentáveis com IA.",
    meta: "dnaiclub.com",
    href: "https://www.dnaiclub.com/",
    Icon: Users,
    external: true,
  },
  {
    eyebrow: "Empresa",
    title: "Conecta One — Automações com IA",
    description:
      "Implementação de automações, IA e integrações sob medida para empresas.",
    meta: "conectaone.com",
    href: "https://www.conectaone.com/",
    Icon: Workflow,
    external: true,
  },
];

function Index() {
  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-[420px] flex-col px-5 pb-16 pt-12 sm:max-w-[460px] sm:px-6 sm:pt-16">

      {/* Ambient glow behind photo */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 h-[320px] w-[320px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, oklch(0.84 0.095 82 / 0.6), transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      {/* Header */}
      <header className="relative flex flex-col items-center text-center fade-up">
        {/* Photo */}
        <div className="relative scale-in" style={{ animationDelay: "0.05s" }}>
          {/* Outer decorative ring */}
          <div
            className="ring-pulse absolute -inset-[6px] rounded-full opacity-40"
            style={{
              background: "conic-gradient(from 0deg, oklch(0.90 0.10 88), oklch(0.65 0.09 68), oklch(0.90 0.10 88))",
            }}
          />
          {/* Gold border ring */}
          <div className="ring-gold relative rounded-full p-[2.5px]" style={{ boxShadow: "0 0 24px oklch(0.84 0.095 82 / 0.3)" }}>
            <img
              src={renanPhoto}
              alt="Renan Galhardo"
              className="h-[108px] w-[108px] rounded-full object-cover sm:h-[120px] sm:w-[120px]"
              loading="eager"
            />
          </div>
        </div>

        {/* Name */}
        <h1
          className="mt-7 font-display text-[36px] tracking-wide sm:text-[42px] fade-up"
          style={{ animationDelay: "0.1s", fontWeight: 400, letterSpacing: "0.04em" }}
        >
          Renan <em className="not-italic text-gold font-display" style={{ fontWeight: 300 }}>Galhardo</em>
        </h1>

        {/* Instagram handle */}
        <a
          href="https://www.instagram.com/orenangalhardo/"
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 text-[12px] tracking-[0.12em] uppercase text-muted-foreground transition-colors hover:text-foreground fade-up"
          style={{ animationDelay: "0.15s" }}
        >
          <Instagram className="h-3 w-3" strokeWidth={1.5} />
          orenangalhardo
        </a>

        {/* Divider with accent line */}
        <div className="mt-6 flex items-center gap-3 fade-up" style={{ animationDelay: "0.18s" }}>
          <span className="accent-line" />
          <p className="text-balance text-[14px] leading-relaxed tracking-wide text-muted-foreground" style={{ letterSpacing: "0.02em" }}>
            Tecnologia, IA e automações aplicadas a{" "}
            <span className="text-foreground font-normal">negócios reais</span>.
          </p>
          <span className="accent-line" />
        </div>

        {/* Location + status */}
        <div className="mt-4 flex items-center gap-4 fade-up" style={{ animationDelay: "0.22s" }}>
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground/60">
            São Paulo, Brasil
          </span>
          <span className="h-3 w-px bg-border" />
          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-muted-foreground/60">
            <span
              className="status-dot h-1.5 w-1.5 rounded-full"
              style={{ background: "oklch(0.72 0.18 145)" }}
            />
            Disponível
          </span>
        </div>
      </header>

      {/* Horizontal rule */}
      <div
        className="mx-auto my-10 h-px w-full max-w-[200px] fade-up"
        style={{
          animationDelay: "0.25s",
          background: "linear-gradient(90deg, transparent, oklch(0.84 0.095 82 / 0.3), transparent)",
        }}
      />

      {/* Cards */}
      <section className="flex flex-col gap-3 fade-up" style={{ animationDelay: "0.28s" }}>
        {links.map((l, i) => (
          <LinkCard key={l.title} {...l} delay={i * 0.07 + 0.3} />
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-16 flex flex-col items-center gap-1.5 text-center fade-up" style={{ animationDelay: "0.55s" }}>
        <span className="accent-line mx-auto mb-2" />
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/40">
          © {new Date().getFullYear()} Renan Galhardo
        </span>
      </footer>
    </main>
  );
}

function LinkCard({
  eyebrow,
  title,
  description,
  meta,
  href,
  Icon,
  external,
  featured,
  delay,
}: Link & { delay: number }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      style={{ animationDelay: `${delay}s` }}
      className="link-card grain card-shine group fade-up relative block overflow-hidden rounded-2xl hairline"
    >
      {/* Featured gold top-border accent */}
      {featured && (
        <div
          className="absolute inset-x-0 top-0 h-[1.5px]"
          style={{ background: "var(--gradient-gold)", opacity: 0.8 }}
        />
      )}

      <div
        className="relative z-10 flex items-start gap-4 px-5 py-5 sm:px-6 sm:py-6"
        style={{
          background: featured
            ? "linear-gradient(135deg, oklch(0.175 0.012 65), oklch(0.155 0.007 55))"
            : "oklch(0.155 0.007 55)",
        }}
      >
        {/* Icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
          style={{
            background: featured
              ? "linear-gradient(135deg, oklch(0.84 0.095 82 / 0.18), oklch(0.65 0.09 68 / 0.08))"
              : "oklch(0.20 0.006 55)",
            border: featured
              ? "1px solid oklch(0.84 0.095 82 / 0.3)"
              : "1px solid oklch(0.28 0.007 55 / 0.6)",
          }}
        >
          <Icon
            className="h-[17px] w-[17px] transition-colors duration-300"
            style={{ color: featured ? "oklch(0.84 0.095 82)" : "oklch(0.62 0.014 65)" }}
            strokeWidth={1.5}
          />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground mb-1">
              {eyebrow}
            </span>
          )}

          <div className="flex items-start justify-between gap-2">
            <h2
              className="font-display leading-tight text-foreground"
              style={{
                fontSize: featured ? "20px" : "18px",
                fontWeight: featured ? 400 : 300,
                letterSpacing: "0.02em",
              }}
            >
              {title}
            </h2>
            <ArrowUpRight
              className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              style={{ color: featured ? "oklch(0.84 0.095 82 / 0.5)" : undefined }}
              strokeWidth={1.5}
            />
          </div>

          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
            {description}
          </p>

          {meta && (
            <div className="mt-3 inline-flex items-center gap-1.5">
              <span
                className="h-[3px] w-[3px] rounded-full"
                style={{ background: featured ? "oklch(0.84 0.095 82)" : "oklch(0.62 0.014 65)" }}
              />
              <span
                className="text-[10.5px] uppercase tracking-[0.14em]"
                style={{ color: featured ? "oklch(0.84 0.095 82 / 0.8)" : "oklch(0.50 0.010 60)" }}
              >
                {meta}
              </span>
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
