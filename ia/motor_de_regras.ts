// ia/motor_de_regras.ts
import { registrarDecisao } from './auditoria';
import { contemAlgum, normalizarTexto } from './normalizar';
import { VERSAO_REGRAS, type DecisaoRegras, type RelatoEstruturado } from './tipos';

// Importação das regras (estrutura: { versao: string; regras: RegraJson[] })
import emergencias from '../regras/emergencias.json';
import obstetricia from '../regras/obstetricia.json';
import saudeMental from '../regras/saude_mental.json';
import vulneraveis from '../regras/grupos_vulneraveis.json';
import urgencias from '../regras/urgencias.json';
import baixaGravidade from '../regras/baixa_gravidade.json';

// Estrutura real dos JSONs de regras
type RegraJson = {
  id: string;
  quando: string[]; // palavras-chave
};

// Estrutura do arquivo JSON
type RegrasContainer = {
  versao: string;
  regras: RegraJson[];
};

// Helper para converter FlagTriState para boolean
function flagTriStateToBoolean(valor: boolean | 'nao_informado'): boolean {
  return valor === true;
}

/**
 * Busca a primeira regra que casa com o texto
 */
function casaRegra(texto: string, regras: RegraJson[]): RegraJson | null {
  for (const regra of regras) {
    if (regra.quando.some(palavra => texto.includes(normalizarTexto(palavra)))) {
      return regra;
    }
  }
  return null;
}

/**
 * Monta o corpus para comparação: texto original + campos estruturados
 */
function corpus(relato: RelatoEstruturado, textoOriginal: string = ''): string {
  const partes: string[] = [
    textoOriginal,
    ...relato.sintomas,
    ...relato.sinais_alerta,
    ...(relato.sinais_obstetricos || []),
    ...(relato.sinais_trauma || []),
  ];
  return normalizarTexto(partes.filter(Boolean).join(' '));
}

// ---- FUNÇÕES DE VERIFICAÇÃO ESPECIALIZADAS ----
function verificarEmergenciaObstetrica(relato: RelatoEstruturado, texto: string): DecisaoRegras | null {
  const sinais = relato.sinais_obstetricos || [];
  // Se é gestante ou há sinal obstétrico
  if (relato.gestante === 'sim' || relato.sinais_alerta.includes('gestante')) {
    // Pré-eclâmpsia
    if (sinais.includes('pre_eclampsia') ||
        (sinais.includes('pressao_alta') && contemAlgum(texto, ['dor de cabeça intensa', 'enxaqueca']))) {
      return {
        categoria_interna: 'emergencia',
        destino: 'SAMU_192_PRONTO_SOCORRO',
        resposta_id: 'obstetricia_pre_eclampsia',
        regra_acionada: 'obstetricia_pre_eclampsia',
        versao_regras: VERSAO_REGRAS,
      };
    }
    // Bolsa rota ou contrações
    if (sinais.includes('perda_liquido_amniotico') || sinais.includes('contracoes')) {
      return {
        categoria_interna: 'emergencia',
        destino: 'SAMU_192_PRONTO_SOCORRO',
        resposta_id: 'obstetricia_trabalho_parto',
        regra_acionada: 'obstetricia_trabalho_parto',
        versao_regras: VERSAO_REGRAS,
      };
    }
    // Sangramento obstétrico
    if (sinais.includes('sangramento_obstetrico')) {
      return {
        categoria_interna: 'emergencia',
        destino: 'SAMU_192_PRONTO_SOCORRO',
        resposta_id: 'obstetricia_hemorragia',
        regra_acionada: 'obstetricia_hemorragia',
        versao_regras: VERSAO_REGRAS,
      };
    }
  }
  return null;
}

function verificarTraumaGrave(relato: RelatoEstruturado, texto: string): DecisaoRegras | null {
  const sinais = relato.sinais_trauma || [];
  // Atropelamento, queda de altura, trauma automobilístico
  if (sinais.includes('trauma_automobilistico') || sinais.includes('queda_altura') ||
      contemAlgum(texto, ['atropelamento', 'acidente de carro', 'colisão', 'capotamento', 'queda de altura'])) {
    // Verifica sinais de gravidade
    if (relato.sinais_alerta.includes('trauma_grave') ||
        relato.sinais_alerta.includes('perda_consciencia') ||
        relato.sinais_alerta.includes('hemorragia_grave') ||
        flagTriStateToBoolean(relato.desmaio) ||
        flagTriStateToBoolean(relato.confusao)) {
      return {
        categoria_interna: 'emergencia',
        destino: 'SAMU_192_PRONTO_SOCORRO',
        resposta_id: 'trauma_grave',
        regra_acionada: 'trauma_grave_mecanismo',
        versao_regras: VERSAO_REGRAS,
      };
    }
    // Mesmo sem sinais de gravidade, trauma mecânico é emergência
    return {
      categoria_interna: 'emergencia',
      destino: 'SAMU_192_PRONTO_SOCORRO',
      resposta_id: 'trauma_mecanico',
      regra_acionada: 'trauma_mecanico',
      versao_regras: VERSAO_REGRAS,
    };
  }
  // Intoxicação grave
  if (relato.exposicao_intoxicacao === true && contemAlgum(texto, ['grave', 'intenso', 'forte', 'perigo', 'urgente'])) {
    return {
      categoria_interna: 'emergencia',
      destino: 'SAMU_192_PRONTO_SOCORRO',
      resposta_id: 'intoxicacao_grave',
      regra_acionada: 'intoxicacao_grave',
      versao_regras: VERSAO_REGRAS,
    };
  }
  // Queimadura extensa
  if (relato.sintomas.includes('queimadura') && contemAlgum(texto, ['extensa', 'grande', 'grave', '2 grau', '3 grau'])) {
    return {
      categoria_interna: 'emergencia',
      destino: 'SAMU_192_PRONTO_SOCORRO',
      resposta_id: 'queimadura_grave',
      regra_acionada: 'queimadura_grave',
      versao_regras: VERSAO_REGRAS,
    };
  }
  return null;
}
// -------------------------------------------------

export function aplicarMotor(relato: RelatoEstruturado, textoOriginal?: string): DecisaoRegras {
  const texto = corpus(relato, textoOriginal || '');

  // 1. PRIORIDADE MÁXIMA: Emergências obstétricas
  const obst = verificarEmergenciaObstetrica(relato, texto);
  if (obst) return obst;

  // 2. Trauma grave
  const trauma = verificarTraumaGrave(relato, texto);
  if (trauma) return trauma;

  // 3. Regras de emergência (SAMU) – acessa .regras dos JSONs
  const regrasEmergencia = (emergencias as RegrasContainer).regras;
  const emerg = casaRegra(texto, regrasEmergencia);
  if (emerg) {
    return {
      categoria_interna: 'emergencia',
      destino: 'SAMU_192_PRONTO_SOCORRO',
      resposta_id: emerg.id,
      regra_acionada: emerg.id,
      versao_regras: VERSAO_REGRAS,
    };
  }

  // 4. Saúde mental com risco iminente
  if (relato.risco_mental === 'iminente') {
    return {
      categoria_interna: 'emergencia',
      destino: 'SAMU_192_PRONTO_SOCORRO',
      resposta_id: 'mental_grave',
      regra_acionada: 'mental_risco_iminente',
      versao_regras: VERSAO_REGRAS,
    };
  }

  // 5. Saúde mental sem risco imediato
  const regrasSaudeMental = (saudeMental as RegrasContainer).regras;
  if (relato.risco_mental === 'sem_risco_imediato' && casaRegra(texto, regrasSaudeMental)) {
    return {
      categoria_interna: 'saude_mental_sem_risco_imediato',
      destino: 'CAPS_OU_SERVICO_DE_SAUDE_MENTAL',
      resposta_id: 'mental_caps_001',
      regra_acionada: 'mental_sem_risco_imediato',
      versao_regras: VERSAO_REGRAS,
    };
  }

  // 6. Febre com sinais de gravidade (UPA)
  if (flagTriStateToBoolean(relato.febre) &&
      (contemAlgum(texto, ['fraqueza', 'prostracao', 'liquidos']) ||
       /[3-9]|tres|quatro|cinco/.test(normalizarTexto(relato.duracao)))) {
    return {
      categoria_interna: 'urgencia',
      destino: 'UPA_24H',
      resposta_id: 'upa_001',
      regra_acionada: 'urgencia_febre_prostracao',
      versao_regras: VERSAO_REGRAS,
    };
  }

  // 7. Urgências (UPA)
  const regrasUrgencias = (urgencias as RegrasContainer).regras;
  const urgencia = casaRegra(texto, regrasUrgencias);
  if (urgencia) {
    return {
      categoria_interna: 'urgencia',
      destino: 'UPA_24H',
      resposta_id: urgencia.id,
      regra_acionada: urgencia.id,
      versao_regras: VERSAO_REGRAS,
    };
  }

  // 8. Grupos vulneráveis (UBS especializada)
  const regrasVulneraveis = (vulneraveis as RegrasContainer).regras;
  const vulneravel = casaRegra(texto, regrasVulneraveis);
  if (vulneravel) {
    return {
      categoria_interna: 'baixa_gravidade',
      destino: 'UBS_CLINICA_DA_FAMILIA',
      resposta_id: 'vulneravel_001',
      regra_acionada: vulneravel.id,
      versao_regras: VERSAO_REGRAS,
    };
  }

  // 9. Baixa gravidade (UBS)
  const regrasBaixa = (baixaGravidade as RegrasContainer).regras;
  const baixa = casaRegra(texto, regrasBaixa);
  if (baixa || (!relato.informacao_insuficiente && relato.sintomas.length > 0)) {
    return {
      categoria_interna: 'baixa_gravidade',
      destino: 'UBS_CLINICA_DA_FAMILIA',
      resposta_id: 'ubs_001',
      regra_acionada: baixa?.id ?? 'baixa_padrao',
      versao_regras: VERSAO_REGRAS,
    };
  }

  // 10. Fallback
  return {
    categoria_interna: 'informacao_insuficiente',
    destino: 'FALLBACK',
    resposta_id: 'fallback_001',
    regra_acionada: 'informacao_insuficiente',
    versao_regras: VERSAO_REGRAS,
  };
}