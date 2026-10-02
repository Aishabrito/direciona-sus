// Modo offline do app: a mesma guarda de emergência do bot do servidor
// (copiada de back.direciona/src/ia/guarda_critica.ts) roda antes do motor local,
// para que sinais graves sempre levem ao SAMU 192 / CVV 188, mesmo sem internet.
import { detectarCriticoRegex, textoEmergencia } from './guarda_critica';
import { processarTurno } from './orquestrador';
import type { EstadoConversa } from './tipos';

export async function processarOffline(texto: string, estado: EstadoConversa) {
  const guarda = detectarCriticoRegex(texto);
  if (guarda.critico) {
    return {
      estado,
      resultado: {
        tipo: 'orientacao' as const,
        texto: textoEmergencia(guarda.categoria, guarda.terceiro),
      },
    };
  }
  return processarTurno(texto, estado);
}
