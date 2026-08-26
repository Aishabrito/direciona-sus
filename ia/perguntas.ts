export type TemaPergunta =
  | 'vago'
  | 'dor'
  | 'falta_de_ar'
  | 'crianca'
  | 'gestacao'
  | 'saude_mental';

export const PERGUNTAS: Record<TemaPergunta, string[]> = {
  vago: [
    'O que você está sentindo e há quanto tempo começou?',
    'Você está com falta de ar, dor no peito, desmaio ou confusão?',
  ],
  dor: [
    'A dor começou de repente ou está piorando?',
    'Há falta de ar, desmaio, febre, vômitos, confusão ou sangramento?',
  ],
  falta_de_ar: [
    'Você consegue falar frases inteiras sem parar para respirar?',
    'Há lábios arroxeados, desmaio ou confusão?',
  ],
  crianca: [
    'Qual é a idade da criança?',
    'Ela está alerta, respirando normalmente e conseguindo beber líquidos?',
  ],
  gestacao: [
    'A pessoa está grávida ou teve bebê recentemente?',
    'Há sangramento, perda de líquido, dor forte, desmaio ou redução dos movimentos do bebê?',
  ],
  saude_mental: [
    'Existe risco de a pessoa se machucar ou machucar alguém agora?',
    'Houve tentativa recente, intoxicação, desmaio ou dificuldade para respirar?',
  ],
};

export function escolherTemaPergunta(params: {
  sintomas: string[];
  idade_grupo: string;
  gestante: string;
  risco_mental: string;
  falta_de_ar: boolean | 'nao_informado';
}): TemaPergunta {
  if (params.risco_mental === 'sem_risco_imediato') return 'saude_mental';
  if (params.idade_grupo === 'bebe' || params.idade_grupo === 'crianca') return 'crianca';
  if (params.gestante === 'nao_informado' && params.sintomas.some((s) => s.includes('sangramento'))) {
    return 'gestacao';
  }
  if (params.falta_de_ar === true) return 'falta_de_ar';
  if (params.sintomas.some((s) => s.includes('dor'))) return 'dor';
  return 'vago';
}
