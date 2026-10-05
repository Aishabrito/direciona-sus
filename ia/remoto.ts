// Conversa com o mesmo atendimento do WhatsApp (repositório back.direciona), por HTTP:
//   POST /api/chat         texto (inclusive "início", "apagar", "sim", bairro e cidade)
//   POST /api/audio        áudio gravado (base64) → transcrição + resposta também em áudio
//   POST /api/localizacao  localização do celular (como o 📎 → Localização do WhatsApp)
//   GET  /api/boas-vindas  apresentação mostrada ao abrir o chat
// O endereço padrão é o servidor na Suga; EXPO_PUBLIC_API_URL (no .env) pode trocá-lo.

/** Mensagem do bot; `audio` vem quando a pessoa mandou áudio (resposta falada, MP3). */
export type MensagemBot = { texto: string; audio?: { base64: string; mime: string } };

export type RespostaBot = {
  mensagens: MensagemBot[];
  /** O bot ofereceu buscar a unidade mais próxima e espera a localização. */
  aguardandoLocalizacao: boolean;
};

const URL_PADRAO = 'https://k96kvwxcjs3h-production-6vlyfvyj.us-central1.suga.run';
const API_URL = (process.env.EXPO_PUBLIC_API_URL || URL_PADRAO).replace(/\/+$/, '');
const TIMEOUT_MS = 45000; // áudio: transcrição + resposta falada podem levar alguns segundos

export function novaSessao(): string {
  return `app-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function chamar(caminho: string, corpo?: unknown): Promise<any | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resp = await fetch(`${API_URL}${caminho}`, {
      method: corpo ? 'POST' : 'GET',
      headers: corpo ? { 'Content-Type': 'application/json' } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
      signal: controller.signal,
    });
    if (!resp.ok) return null;
    return await resp.json();
  } catch {
    return null; // sem conexão ou servidor fora do ar
  } finally {
    clearTimeout(timer);
  }
}

function lerResposta(dados: any): RespostaBot | null {
  if (!Array.isArray(dados?.mensagens)) return null;
  return {
    mensagens: dados.mensagens.filter((m: any) => typeof m?.texto === 'string'),
    aguardandoLocalizacao: Boolean(dados.aguardandoLocalizacao),
  };
}

/** Devolve null quando o servidor não responde (o chat usa então o modo offline). */
export async function enviarTexto(sessionId: string, mensagem: string) {
  return lerResposta(await chamar('/api/chat', { sessionId, mensagem }));
}

export async function enviarAudio(sessionId: string, audio: string, mime: string) {
  return lerResposta(await chamar('/api/audio', { sessionId, audio, mime }));
}

export async function enviarLocalizacao(sessionId: string, lat: number, lng: number) {
  return lerResposta(await chamar('/api/localizacao', { sessionId, lat, lng }));
}

export async function buscarBoasVindas(): Promise<string | null> {
  const dados = await chamar('/api/boas-vindas');
  return typeof dados?.texto === 'string' ? dados.texto : null;
}
