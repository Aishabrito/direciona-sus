// Conversa com o mesmo bot do WhatsApp (back.direciona), pela API POST /api/chat.
// O endereço padrão é o servidor na Suga; EXPO_PUBLIC_API_URL (no .env) pode trocá-lo.
// Se o servidor não responder, o chat usa só a guarda de emergência local (ia/offline.ts).

export type RespostaBot = { tipo: 'orientacao' | 'perguntas'; texto: string };

const URL_PADRAO = 'https://k96kvwxcjs3h-production-6vlyfvyj.us-central1.suga.run';
const API_URL = (process.env.EXPO_PUBLIC_API_URL || URL_PADRAO).replace(/\/+$/, '');
const TIMEOUT_MS = 20000;

export function novaSessao(): string {
  return `app-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Envia a mensagem ao bot. Devolve null se não houver servidor ou ele não responder. */
export async function enviarAoBot(sessionId: string, mensagem: string): Promise<RespostaBot | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, mensagem }),
      signal: controller.signal,
    });
    if (!resp.ok) return null;
    const dados = await resp.json();
    if (typeof dados?.texto !== 'string' || !dados.texto.trim()) return null;
    return { tipo: dados.tipo === 'orientacao' ? 'orientacao' : 'perguntas', texto: dados.texto };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
