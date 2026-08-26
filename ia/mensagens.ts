import mensagens from '../respostas/mensagens_aprovadas.json';
import type { MensagemAprovada } from './tipos';

const TERMOS_PROIBIDOS = [
  'infarto',
  'avc',
  'derrame',
  'manchester',
  'vermelho',
  'laranja',
  'amarelo',
  'classificação',
  'tempo de espera',
  'diagnóstico',
  'remédio',
  'medicamento',
  'comprimido',
  'antibiótico',
  'tratamento com',
  'vaga',
];

export function mensagemPorId(id: string): MensagemAprovada {
  const encontrada = mensagens.mensagens.find((item) => item.id === id);
  const fallback = mensagens.mensagens.find((item) => item.id === 'fallback_001');
  if (!encontrada) return fallback as MensagemAprovada;
  return encontrada as MensagemAprovada;
}

export function sanitizarResposta(texto: string): string {
  const n = texto.toLowerCase();
  if (TERMOS_PROIBIDOS.some((termo) => n.includes(termo))) {
    return mensagemPorId('fallback_001').texto;
  }
  return texto;
}
