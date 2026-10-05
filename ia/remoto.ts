// Conversa com o mesmo bot do WhatsApp (repositório back.direciona), por HTTP:
//   POST /api/chat      → resposta do bot (perguntas ou orientação)
//   POST /api/unidades  → unidades mais próximas (mesma busca do WhatsApp)
// O endereço padrão é o servidor na Suga; EXPO_PUBLIC_API_URL (no .env) pode trocá-lo.

export type TipoUnidade = 'UPA' | 'HOSPITAL' | 'UBS';

/** Unidade que o bot oferece buscar depois da orientação ("a UPA mais próxima"). */
export type OfertaLocal = { tipo: TipoUnidade; rotulo: string };

export type RespostaBot = {
  tipo: 'orientacao' | 'perguntas';
  texto: string;
  local?: OfertaLocal;
};

const URL_PADRAO = 'https://k96kvwxcjs3h-production-6vlyfvyj.us-central1.suga.run';
const API_URL = (process.env.EXPO_PUBLIC_API_URL || URL_PADRAO).replace(/\/+$/, '');
const TIMEOUT_MS = 20000;

export function novaSessao(): string {
  return `app-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** POST com timeout. Devolve { status, dados } ou null se não houver conexão. */
async function postar(caminho: string, corpo: unknown): Promise<{ status: number; dados: any } | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(`${API_URL}${caminho}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corpo),
      signal: controller.signal,
    });
    const dados = await resp.json().catch(() => null);
    return { status: resp.status, dados };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Envia a mensagem ao bot. Devolve null se o servidor não responder. */
export async function enviarAoBot(sessionId: string, mensagem: string): Promise<RespostaBot | null> {
  const r = await postar('/api/chat', { sessionId, mensagem });
  const dados = r?.dados;
  if (!r || r.status !== 200 || typeof dados?.texto !== 'string' || !dados.texto.trim()) return null;
  return {
    tipo: dados.tipo === 'orientacao' ? 'orientacao' : 'perguntas',
    texto: dados.texto,
    local: dados.local?.tipo ? { tipo: dados.local.tipo, rotulo: dados.local.rotulo } : undefined,
  };
}

/**
 * Busca as unidades mais próximas pela localização do celular ou pelo bairro digitado.
 * `achouEndereco` é false quando o bairro/cidade digitado não foi encontrado no mapa.
 * Devolve null se o servidor não responder.
 */
export async function buscarUnidades(
  tipo: TipoUnidade,
  onde: { lat: number; lng: number } | { endereco: string },
): Promise<{ texto: string; achouEndereco: boolean } | null> {
  const r = await postar('/api/unidades', { tipo, ...onde });
  if (!r || typeof r.dados?.texto !== 'string') return null;
  return { texto: r.dados.texto, achouEndereco: r.status !== 404 };
}
