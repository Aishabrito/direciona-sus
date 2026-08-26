import emergencias from '../regras/emergencias.json';
import obstetricia from '../regras/obstetricia.json';
import saudeMental from '../regras/saude_mental.json';
import vulneraveis from '../regras/grupos_vulneraveis.json';
import urgencias from '../regras/urgencias.json';
import baixaGravidade from '../regras/baixa_gravidade.json';
import { contemAlgum, normalizarTexto } from './normalizar';
import {
  VERSAO_REGRAS,
  type DecisaoRegras,
  type RelatoEstruturado,
} from './tipos';

type RegraJson = { id: string; quando: string[] };

function corpus(relato: RelatoEstruturado): string {
  return normalizarTexto(
    [
      ...relato.sintomas,
      ...relato.sinais_alerta,
      relato.intensidade,
      relato.falta_de_ar === true ? 'falta de ar' : '',
      relato.dor_no_peito === true ? 'dor no peito' : '',
      relato.desmaio === true ? 'desmaio' : '',
      relato.confusao === true ? 'confusao' : '',
      relato.sangramento === true ? 'sangramento' : '',
      relato.febre === true ? 'febre' : '',
      relato.vomitos === true ? 'vomitos' : '',
      relato.trauma === true ? 'trauma' : '',
      relato.exposicao_intoxicacao === true ? 'intoxicacao' : '',
    ].join(' '),
  );
}

function casaRegra(texto: string, regras: RegraJson[]): RegraJson | undefined {
  return regras.find((regra) => contemAlgum(texto, regra.quando));
}

function flag(valor: RelatoEstruturado[keyof RelatoEstruturado]): boolean {
  return valor === true;
}

function grupoVulneravel(relato: RelatoEstruturado): boolean {
  return ['bebe', 'crianca', 'idoso'].includes(relato.idade_grupo);
}

function sinalGrave(relato: RelatoEstruturado): boolean {
  return (
    flag(relato.falta_de_ar) ||
    flag(relato.desmaio) ||
    flag(relato.confusao) ||
    flag(relato.sangramento) ||
    flag(relato.exposicao_intoxicacao) ||
    relato.sinais_alerta.length > 0
  );
}

function emergenciaClinica(relato: RelatoEstruturado, texto: string): string | null {
  if (relato.risco_mental === 'iminente' || contemAlgum(texto, ['risco_iminente_autoagressao'])) {
    return 'emergencia_risco_mental_iminente';
  }
  if (contemAlgum(texto, ['nao responde', 'inconsciente'])) return 'emergencia_inconsciencia';
  if (
    flag(relato.falta_de_ar) &&
    contemAlgum(texto, ['labios roxos', 'nao consegue falar', 'intensa', 'dificuldade intensa'])
  ) {
    return 'emergencia_respiracao';
  }
  if (
    flag(relato.dor_no_peito) &&
    (flag(relato.falta_de_ar) ||
      flag(relato.desmaio) ||
      flag(relato.confusao) ||
      contemAlgum(texto, ['suor frio', 'palidez', 'nausea']))
  ) {
    return 'emergencia_peito';
  }
  if (flag(relato.trauma) && flag(relato.confusao)) return 'emergencia_trauma_cabeca_confusao';
  if (flag(relato.confusao) && (relato.piora === 'sim' || contemAlgum(texto, ['subita', 'subito']))) {
    return 'emergencia_confusao_subita';
  }
  if (contemAlgum(texto, ['sinais_neurologicos_subitos', 'convulsao'])) return 'emergencia_neuro';
  if (flag(relato.sangramento) && contemAlgum(texto, ['intenso', 'muito sangue', 'hemorragia'])) {
    return 'emergencia_sangramento';
  }
  if (contemAlgum(texto, ['atropel', 'queda de altura', 'trauma grave'])) return 'emergencia_trauma';
  if (
    flag(relato.exposicao_intoxicacao) &&
    (flag(relato.desmaio) || flag(relato.confusao) || flag(relato.falta_de_ar))
  ) {
    return 'emergencia_intoxicacao_grave';
  }
  if (flag(relato.desmaio)) return 'emergencia_desmaio';
  const regra = casaRegra(texto, emergencias.regras as RegraJson[]);
  if (regra && regra.id !== 'emergencia_peito') return regra.id;
  return null;
}

export function aplicarMotor(relato: RelatoEstruturado): DecisaoRegras {
  const texto = corpus(relato);

  const emergenciaId = emergenciaClinica(relato, texto);
  if (emergenciaId) {
    return {
      categoria_interna: 'emergencia',
      destino: 'SAMU_192_PRONTO_SOCORRO',
      resposta_id: relato.risco_mental === 'iminente' ? 'mental_emergencia_001' : 'emergencia_001',
      regra_acionada: emergenciaId,
      versao_regras: VERSAO_REGRAS,
    };
  }

  const obstetrica =
    (relato.gestante === 'sim' || relato.pos_parto === 'sim') &&
    casaRegra(texto, obstetricia.regras as RegraJson[]);
  if (obstetrica) {
    return {
      categoria_interna: 'situacao_obstetrica',
      destino: 'MATERNIDADE_PRONTO_SOCORRO_OBSTETRICO',
      resposta_id: 'obstetricia_001',
      regra_acionada: obstetrica.id,
      versao_regras: VERSAO_REGRAS,
    };
  }

  if (relato.risco_mental === 'iminente') {
    return {
      categoria_interna: 'emergencia',
      destino: 'SAMU_192_PRONTO_SOCORRO',
      resposta_id: 'mental_emergencia_001',
      regra_acionada: 'mental_iminente',
      versao_regras: VERSAO_REGRAS,
    };
  }

  if (grupoVulneravel(relato) && sinalGrave(relato)) {
    return {
      categoria_interna: 'emergencia',
      destino: 'SAMU_192_PRONTO_SOCORRO',
      resposta_id: 'emergencia_001',
      regra_acionada: (vulneraveis.regras[0] as RegraJson).id,
      versao_regras: VERSAO_REGRAS,
    };
  }

  if (relato.risco_mental === 'sem_risco_imediato' && casaRegra(texto, saudeMental.regras as RegraJson[])) {
    return {
      categoria_interna: 'saude_mental_sem_risco_imediato',
      destino: 'CAPS_OU_SERVICO_DE_SAUDE_MENTAL',
      resposta_id: 'mental_caps_001',
      regra_acionada: 'mental_sem_risco_imediato',
      versao_regras: VERSAO_REGRAS,
    };
  }

  if (
    flag(relato.febre) &&
    (contemAlgum(texto, ['fraqueza', 'prostracao', 'liquidos']) ||
      /[3-9]|tres|quatro|cinco/.test(normalizarTexto(relato.duracao)))
  ) {
    return {
      categoria_interna: 'urgencia',
      destino: 'UPA_24H',
      resposta_id: 'upa_001',
      regra_acionada: 'urgencia_febre_prostracao',
      versao_regras: VERSAO_REGRAS,
    };
  }

  const urgencia = casaRegra(texto, urgencias.regras as RegraJson[]);
  if (urgencia) {
    return {
      categoria_interna: 'urgencia',
      destino: 'UPA_24H',
      resposta_id: 'upa_001',
      regra_acionada: urgencia.id,
      versao_regras: VERSAO_REGRAS,
    };
  }

  const baixa = casaRegra(texto, baixaGravidade.regras as RegraJson[]);
  if (baixa || (!relato.informacao_insuficiente && relato.sintomas.length > 0)) {
    return {
      categoria_interna: 'baixa_gravidade',
      destino: 'UBS_CLINICA_DA_FAMILIA',
      resposta_id: 'ubs_001',
      regra_acionada: baixa?.id ?? 'baixa_padrao',
      versao_regras: VERSAO_REGRAS,
    };
  }

  return {
    categoria_interna: 'informacao_insuficiente',
    destino: 'FALLBACK',
    resposta_id: 'fallback_001',
    regra_acionada: 'informacao_insuficiente',
    versao_regras: VERSAO_REGRAS,
  };
}
