// Sem conexão com o servidor, o app não tenta orientar sozinho: só a guarda de
// emergência do bot (copiada de back.direciona/src/ia/guarda_critica.ts) roda aqui,
// para que sinais graves levem ao SAMU 192 / CVV 188 mesmo sem internet.
import { detectarCriticoRegex, textoEmergencia } from './guarda_critica';
import type { RespostaBot } from './remoto';

export const TEXTO_SEM_CONEXAO =
  'Estou sem conexão com o servidor agora e não consigo te orientar com segurança. ' +
  'Tente de novo em instantes. Se for urgente, procure uma UPA. Em emergência ' +
  '(falta de ar, dor no peito, desmaio, confusão ou sangramento importante), ligue *192 (SAMU)*.';

export const AUDIO_SEM_CONEXAO =
  '🎤 Estou sem conexão com o servidor e não consigo ouvir o áudio agora. Tente de novo em ' +
  'instantes ou escreva. Em emergência, ligue *192 (SAMU)*.';

/** Resposta com uma única mensagem de texto. */
export function semConexao(texto: string): RespostaBot {
  return { mensagens: [{ texto }], aguardandoLocalizacao: false };
}

/** Resposta a um texto quando não há conexão. */
export function respostaOffline(texto: string): RespostaBot {
  const guarda = detectarCriticoRegex(texto);
  if (guarda.critico) return semConexao(textoEmergencia(guarda.categoria, guarda.terceiro));
  return semConexao(TEXTO_SEM_CONEXAO);
}
