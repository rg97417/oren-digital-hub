import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { sendApplicationEvent } from "@/lib/application.functions";

export const Route = createFileRoute("/aplicacao")({
  component: ApplicationPage,
  head: () => ({
    meta: [
      { title: "Aplicação — Acompanhamento Técnico IA & MicroSaaS | Renan Galhardo" },
      {
        name: "description",
        content:
          "Aplicação para acompanhamento técnico em IA, automações, n8n, WhatsApp, SaaS e microSaaS com Renan Galhardo. Vagas limitadas.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type FormState = {
  // 2 — dados básicos
  nome: string;
  whatsapp: string;
  email: string;
  instagram: string;
  // 3 — perfil
  perfil: string;
  // 4 — objetivo
  objetivo: string;
  // 5 — momento
  momento: string;
  // 6 — gargalo
  gargalo: string;
  // 7 — disponibilidade
  horasSemana: string;
  inicio: string;
  // 8 — investimento
  formato: string;
  faixa: string;
  // 9 — final
  porque: string;
};

const initialState: FormState = {
  nome: "",
  whatsapp: "",
  email: "",
  instagram: "",
  perfil: "",
  objetivo: "",
  momento: "",
  gargalo: "",
  horasSemana: "",
  inicio: "",
  formato: "",
  faixa: "",
  porque: "",
};

const STEP_NAMES = [
  "abertura",
  "dados_basicos",
  "perfil",
  "objetivo",
  "momento_atual",
  "gargalo",
  "disponibilidade",
  "investimento",
  "pergunta_final",
  "final",
];

function genId() {
  return (
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 10)
  );
}

function ApplicationPage() {
  const send = useServerFn(sendApplicationEvent);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const sessionRef = useRef<string>("");
  const startedAtRef = useRef<string>("");

  // Initialize / restore session
  useEffect(() => {
    if (typeof window === "undefined") return;
    const existing = window.localStorage.getItem("application_session");
    if (existing) {
      sessionRef.current = existing;
      const startedAt = window.localStorage.getItem("application_started_at");
      startedAtRef.current = startedAt || new Date().toISOString();
      const draft = window.localStorage.getItem("application_draft");
      if (draft) {
        try {
          setForm({ ...initialState, ...JSON.parse(draft) });
        } catch {
          /* ignore */
        }
      }
    } else {
      const id = genId();
      sessionRef.current = id;
      startedAtRef.current = new Date().toISOString();
      window.localStorage.setItem("application_session", id);
      window.localStorage.setItem("application_started_at", startedAtRef.current);
    }
  }, []);

  // Persist draft locally
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("application_draft", JSON.stringify(form));
  }, [form]);

  const totalSteps = 9; // 0..9 with 0 being abertura, 9 final = 10 telas
  const progress = useMemo(() => Math.round((step / totalSteps) * 100), [step]);

  async function track(event: "started" | "step" | "completed", currentStep: number) {
    if (!sessionRef.current) return;
    try {
      await send({
        data: {
          sessionId: sessionRef.current,
          event,
          step: currentStep,
          stepName: STEP_NAMES[currentStep] ?? String(currentStep),
          data: form,
          startedAt: startedAtRef.current,
          updatedAt: new Date().toISOString(),
        },
      });
    } catch (e) {
      console.error("track error", e);
    }
  }

  async function next() {
    const current = step;
    if (current === 0) {
      await track("started", 0);
    } else {
      // fire-and-forget partial save
      track("step", current);
    }
    setStep((s) => Math.min(s + 1, totalSteps));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit() {
    setSubmitting(true);
    await track("completed", 9);
    setSubmitting(false);
    setDone(true);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("application_draft");
      window.localStorage.removeItem("application_session");
      window.localStorage.removeItem("application_started_at");
    }
  }

  // Validation per step
  const canAdvance = useMemo(() => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return (
          form.nome.trim().length >= 2 &&
          form.whatsapp.trim().length >= 8 &&
          /\S+@\S+\.\S+/.test(form.email) &&
          form.instagram.trim().length >= 2
        );
      case 2:
        return form.perfil !== "";
      case 3:
        return form.objetivo !== "";
      case 4:
        return form.momento !== "";
      case 5:
        return form.gargalo.trim().length >= 5;
      case 6:
        return form.horasSemana !== "" && form.inicio !== "";
      case 7:
        return form.formato !== "" && form.faixa !== "";
      case 8:
        return form.porque.trim().length >= 10;
      default:
        return true;
    }
  }, [step, form]);

  return (
    <main className="relative mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 pb-16 pt-8 sm:px-6 sm:pt-12">
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          voltar
        </Link>
        {!done && step > 0 && (
          <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            etapa {step} / {totalSteps - 1}
          </span>
        )}
      </div>

      {/* Progress */}
      {!done && step > 0 && (
        <div className="mb-8 h-[2px] w-full overflow-hidden rounded-full bg-border">
          <div
            className="h-full bg-gradient-to-r from-[oklch(0.82_0.10_85)] to-[oklch(0.92_0.06_85)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {done ? (
        <FinalScreen />
      ) : (
        <div key={step} className="fade-up">
          {step === 0 && <Opening onNext={next} />}
          {step === 1 && <BasicData form={form} setForm={setForm} />}
          {step === 2 && (
            <ChoiceStep
              eyebrow="Perfil"
              title="Qual opção melhor descreve você hoje?"
              value={form.perfil}
              onChange={(v) => setForm({ ...form, perfil: v })}
              options={[
                "Já trabalho com IA/automações e quero evoluir",
                "Tenho um SaaS/projeto em andamento",
                "Presto serviços e quero estruturar melhor",
                "Estou começando agora nesse mercado",
                "Tenho uma ideia e quero tirar do papel",
              ]}
            />
          )}
          {step === 3 && (
            <ChoiceStep
              eyebrow="Objetivo"
              title="Qual é o principal objetivo que você quer atingir agora?"
              value={form.objetivo}
              onChange={(v) => setForm({ ...form, objetivo: v })}
              options={[
                "Criar ou melhorar automações",
                "Estruturar um microSaaS",
                "Melhorar arquitetura / performance",
                "Integrar IA ao meu produto",
                "Destravar um problema técnico específico",
                "Validar ou estruturar uma ideia",
                "Escalar um projeto já existente",
              ]}
            />
          )}
          {step === 4 && (
            <ChoiceStep
              eyebrow="Momento atual"
              title="Você já tem algo rodando hoje?"
              value={form.momento}
              onChange={(v) => setForm({ ...form, momento: v })}
              options={[
                "Sim — já tenho projeto/cliente/produto funcionando",
                "Tenho algo em desenvolvimento",
                "Ainda estou validando a ideia",
                "Ainda não comecei",
              ]}
            />
          )}
          {step === 5 && (
            <TextStep
              eyebrow="Gargalo principal"
              title="Qual é o principal gargalo que está te impedindo de avançar hoje?"
              value={form.gargalo}
              onChange={(v) => setForm({ ...form, gargalo: v })}
              placeholder="Exemplos: arquitetura ruim, automação quebrando, dificuldade de escalar, integrações, IA, WhatsApp API, onboarding, monetização, estrutura técnica, falta de clareza no produto..."
              maxLength={1500}
            />
          )}
          {step === 6 && (
            <DoubleChoiceStep
              eyebrow="Disponibilidade e compromisso"
              title1="Quanto tempo você consegue dedicar por semana para evoluir esse projeto?"
              value1={form.horasSemana}
              onChange1={(v) => setForm({ ...form, horasSemana: v })}
              options1={["Menos de 5 horas", "5–10 horas", "10–20 horas", "Tempo integral"]}
              title2="Se aprovado, em quanto tempo você gostaria de começar?"
              value2={form.inicio}
              onChange2={(v) => setForm({ ...form, inicio: v })}
              options2={[
                "Imediatamente",
                "Nos próximos 7 dias",
                "Nos próximos 30 dias",
                "Ainda estou avaliando",
              ]}
            />
          )}
          {step === 7 && (
            <DoubleChoiceStep
              eyebrow="Investimento"
              title1="Qual tipo de acompanhamento faz mais sentido pra você hoje?"
              value1={form.formato}
              onChange1={(v) => setForm({ ...form, formato: v })}
              options1={[
                "Sessão pontual para resolver um problema específico",
                "Acompanhamento técnico por 30 dias",
                "Consultoria personalizada / projeto maior",
                "Ainda não sei qual faz mais sentido",
              ]}
              title2="Hoje, qual faixa de investimento faz sentido para você?"
              value2={form.faixa}
              onChange2={(v) => setForm({ ...form, faixa: v })}
              options2={[
                "R$497–697",
                "R$1.500–2.500",
                "R$5.000+",
                "Quero entender primeiro o melhor formato",
              ]}
            />
          )}
          {step === 8 && (
            <TextStep
              eyebrow="Pergunta final"
              title="Por que você acredita que esse acompanhamento pode acelerar seu momento atual?"
              value={form.porque}
              onChange={(v) => setForm({ ...form, porque: v })}
              placeholder="Fale um pouco sobre: onde você está hoje, o que está tentando construir, o que já tentou, por que acredita que precisa de acompanhamento agora..."
              maxLength={2000}
            />
          )}

          {/* Nav buttons */}
          {step > 0 && (
            <div className="mt-10 flex items-center justify-between gap-3">
              <button
                onClick={back}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-muted-foreground transition hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Voltar
              </button>

              {step < 8 ? (
                <button
                  onClick={next}
                  disabled={!canAdvance}
                  className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-foreground/90"
                >
                  Continuar
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={!canAdvance || submitting}
                  className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.82_0.10_85)] to-[oklch(0.92_0.06_85)] px-6 py-3 text-sm font-medium text-[oklch(0.18_0.01_60)] transition disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-95"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      Enviar aplicação
                      <Check className="h-4 w-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  );
}

function Opening({ onNext }: { onNext: () => void }) {
  return (
    <div className="fade-up">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        <Sparkles className="h-3 w-3 text-gold" />
        Aplicação privada
      </div>

      <h1 className="mt-5 font-display text-[30px] leading-tight sm:text-[40px]">
        Acompanhamento Técnico <em className="not-italic text-gold">IA & MicroSaaS</em>
      </h1>

      <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
        Esse acompanhamento é destinado para pessoas que desejam destravar, estruturar ou acelerar
        projetos envolvendo IA, automações, agentes, n8n, WhatsApp, SaaS, microSaaS, integrações e
        arquitetura de produto.
      </p>

      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        O foco não é teoria genérica. A proposta é acompanhar projetos reais com direcionamento
        técnico, revisão estratégica e suporte prático durante a execução.
      </p>

      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        Como acompanho poucos projetos simultaneamente, todas as aplicações passam por análise
        antes da aprovação. Os acompanhamentos variam entre sessões pontuais, acompanhamento
        mensal e projetos personalizados.
      </p>

      <div className="mt-6 rounded-2xl bg-card hairline p-5 text-[14px] text-muted-foreground">
        Investimentos começam em <span className="text-foreground">R$497</span> e variam conforme
        o nível de suporte e a complexidade do projeto.
      </div>

      <button
        onClick={onNext}
        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[oklch(0.82_0.10_85)] to-[oklch(0.92_0.06_85)] px-6 py-3 text-sm font-medium text-[oklch(0.18_0.01_60)] transition hover:opacity-95"
      >
        Iniciar aplicação
        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

function StepHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6">
      <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {eyebrow}
      </div>
      <h2 className="mt-2 font-display text-[24px] leading-snug sm:text-[28px]">{title}</h2>
    </div>
  );
}

function BasicData({
  form,
  setForm,
}: {
  form: FormState;
  setForm: (f: FormState) => void;
}) {
  return (
    <div>
      <StepHeader eyebrow="Dados básicos" title="Conta um pouco sobre você." />
      <div className="space-y-4">
        <Field
          label="Nome completo"
          value={form.nome}
          onChange={(v) => setForm({ ...form, nome: v })}
          placeholder="Seu nome"
          maxLength={120}
        />
        <Field
          label="WhatsApp (com DDD)"
          value={form.whatsapp}
          onChange={(v) => setForm({ ...form, whatsapp: v })}
          placeholder="(11) 99999-9999"
          maxLength={30}
          inputMode="tel"
        />
        <Field
          label="E-mail"
          value={form.email}
          onChange={(v) => setForm({ ...form, email: v })}
          placeholder="voce@email.com"
          maxLength={150}
          type="email"
        />
        <Field
          label="Instagram (@)"
          value={form.instagram}
          onChange={(v) => setForm({ ...form, instagram: v.replace(/^@/, "") })}
          placeholder="seuuser"
          maxLength={60}
          prefix="@"
        />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  type = "text",
  inputMode,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "url";
  prefix?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </span>
      <div
        className={`flex items-center rounded-xl bg-card hairline transition focus-within:border-[oklch(0.82_0.10_85)]/50`}
      >
        {prefix && (
          <span className="pl-4 text-sm text-muted-foreground">{prefix}</span>
        )}
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full bg-transparent px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
        />
      </div>
    </label>
  );
}

function ChoiceStep({
  eyebrow,
  title,
  options,
  value,
  onChange,
}: {
  eyebrow: string;
  title: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <StepHeader eyebrow={eyebrow} title={title} />
      <Choices options={options} value={value} onChange={onChange} />
    </div>
  );
}

function DoubleChoiceStep({
  eyebrow,
  title1,
  options1,
  value1,
  onChange1,
  title2,
  options2,
  value2,
  onChange2,
}: {
  eyebrow: string;
  title1: string;
  options1: string[];
  value1: string;
  onChange1: (v: string) => void;
  title2: string;
  options2: string[];
  value2: string;
  onChange2: (v: string) => void;
}) {
  return (
    <div>
      <StepHeader eyebrow={eyebrow} title={title1} />
      <Choices options={options1} value={value1} onChange={onChange1} />

      <div className="mt-10">
        <h2 className="font-display text-[22px] leading-snug sm:text-[26px]">{title2}</h2>
        <div className="mt-5">
          <Choices options={options2} value={value2} onChange={onChange2} />
        </div>
      </div>
    </div>
  );
}

function Choices({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt, i) => {
        const selected = value === opt;
        const letter = String.fromCharCode(65 + i);
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`group flex items-start gap-3 rounded-xl px-4 py-3.5 text-left text-[14.5px] leading-snug transition ${
              selected
                ? "bg-[oklch(0.235_0.01_60)] ring-1 ring-[oklch(0.82_0.10_85)]/60 text-foreground"
                : "bg-card hairline text-foreground/90 hover:bg-[oklch(0.225_0.01_60)]"
            }`}
          >
            <span
              className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] font-medium transition ${
                selected
                  ? "bg-gradient-to-br from-[oklch(0.82_0.10_85)] to-[oklch(0.92_0.06_85)] text-[oklch(0.18_0.01_60)]"
                  : "border border-border text-muted-foreground"
              }`}
            >
              {letter}
            </span>
            <span>{opt}</span>
          </button>
        );
      })}
    </div>
  );
}

function TextStep({
  eyebrow,
  title,
  value,
  onChange,
  placeholder,
  maxLength = 1500,
}: {
  eyebrow: string;
  title: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <StepHeader eyebrow={eyebrow} title={title} />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={7}
        className="w-full resize-y rounded-xl bg-card hairline px-4 py-3.5 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/60 transition focus:border-[oklch(0.82_0.10_85)]/50 focus:outline-none"
      />
      <div className="mt-2 text-right text-[11px] text-muted-foreground/70">
        {value.length}/{maxLength}
      </div>
    </div>
  );
}

function FinalScreen() {
  return (
    <div className="fade-up flex flex-col items-center text-center">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.82_0.10_85)] to-[oklch(0.92_0.06_85)] text-[oklch(0.18_0.01_60)] soft-shadow">
        <Check className="h-7 w-7" strokeWidth={2.2} />
      </div>

      <h1 className="mt-6 font-display text-[28px] leading-tight sm:text-[34px]">
        Aplicação <em className="not-italic text-gold">enviada</em>
      </h1>

      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        Sua aplicação foi recebida com sucesso. Vou analisar pessoalmente as respostas para
        entender o momento do projeto, o nível de suporte necessário e se faz sentido avançarmos
        juntos.
      </p>

      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted-foreground">
        Como acompanho poucos projetos simultaneamente, nem todas as aplicações são aprovadas. Se
        o seu perfil fizer sentido, entro em contato pelo WhatsApp informado para alinhar formato
        ideal, próximos passos, agenda e investimento recomendado.
      </p>

      <p className="mt-6 text-sm text-foreground">Enquanto isso, continue evoluindo seu projeto. 🚀</p>

      <Link
        to="/"
        className="mt-10 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        voltar para o início
      </Link>
    </div>
  );
}
