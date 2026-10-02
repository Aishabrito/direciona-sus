// Conversa com o mesmo bot do WhatsApp (back.direciona), pela API POST /api/chat.
// O endereço vem de EXPO_PUBLIC_API_URL (ex.: https://seu-servidor.com). Sem ele,
// ou se o servidor não responder, quem chama usa o motor local do app (modo offline).

export type RespostaBot = { tipo: 'orientacao' | 'perguntas'; texto: string };

const API_URL = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
const TIMEOUT_MS = 20000;

export const botRemotoConfigurado = API_URL.length > 0;

export function novaSessao(): string {
  return `app-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Envia a mensagem ao bot. Devolve null se não houver servidor ou ele não responder. */
export async function enviarAoBot(sessionId: string, mensagem: string): Promise<RespostaBot | null> {
  if (!botRemotoConfigurado) return null;

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
