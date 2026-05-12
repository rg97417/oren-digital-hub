import { createServerFn } from "@tanstack/react-start";

type Payload = {
  sessionId: string;
  event: "started" | "step" | "completed";
  step: number;
  stepName: string;
  data: Record<string, unknown>;
  startedAt: string;
  updatedAt: string;
};

export const sendApplicationEvent = createServerFn({ method: "POST" })
  .inputValidator((input: Payload) => {
    if (
      !input ||
      typeof input.sessionId !== "string" ||
      input.sessionId.length < 6 ||
      input.sessionId.length > 100
    ) {
      throw new Error("Invalid sessionId");
    }
    if (!["started", "step", "completed"].includes(input.event)) {
      throw new Error("Invalid event");
    }
    if (typeof input.step !== "number" || input.step < 0 || input.step > 20) {
      throw new Error("Invalid step");
    }
    return input;
  })
  .handler(async ({ data }) => {
    const url = process.env.N8N_FORM_WEBHOOK_URL;
    if (!url) {
      console.error("N8N_FORM_WEBHOOK_URL is not configured");
      return { ok: false, error: "webhook_not_configured" };
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "linkbio-application",
          ...data,
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error(`n8n webhook failed [${res.status}]: ${text}`);
        return { ok: false, error: `status_${res.status}` };
      }
      return { ok: true };
    } catch (err) {
      console.error("n8n webhook request failed:", err);
      return { ok: false, error: "network_error" };
    }
  });
