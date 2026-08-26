import { registrarDecisao } from './auditoria';
import { interpretarRelato } from './extrator_de_informacoes';
import { sanitizarResposta, mensagemPorId } from './mensagens';
import { aplicarMotor } from './motor_de_regras';
import { escolherTemaPergunta, PERGUNTAS } from './perguntas';
import {
  RELATO_VAZIO,
  type EstadoConversa,
  type RelatoEstruturado,
  type TurnoResultado,
} from './tipos';
import { mesclarRelatos } from './validador_de_saida';

export const ESTADO_INICIAL: EstadoConversa = {
  relatos: [],
  rodadasPerguntas: 0,
};

function consolidar(estado: EstadoConversa): RelatoEstruturado {
  return estado.relatos.reduce((acc, item) => mesclarRelatos(acc, item), { ...RELATO_VAZIO });
}

function precisaPerguntar(relato: RelatoEstruturado): boolean {
  if (relato.sintomas.includes('sintomas leves ou rotina')) return false;
  if (relato.informacao_insuficiente && relato.sintomas.length === 0) return true;
  const alertaPendente =
    relato.falta_de_ar === 'nao_informado' &&
    relato.dor_no_peito === 'nao_informado' &&
    relato.desmaio === 'nao_informado' &&
    relato.confusao === 'nao_informado' &&
    relato.sintomas.length <= 1;
  return alertaPendente;
}

export async function processarTurno(
  textoUsuario: string,
  estado: EstadoConversa,
): Promise<{ resultado: TurnoResultado; estado: EstadoConversa }> {
  const extraido = await interpretarRelato(textoUsuario);
  const relatos = [...estado.relatos, extraido];
  const atual = consolidar({ ...estado, relatos });

  const emergenciaImediata =
    atual.risco_mental === 'iminente' ||
    (atual.trauma === true && atual.confusao === true) ||
    (atual.dor_no_peito === true &&
      (atual.falta_de_ar === true || atual.desmaio === true || atual.confusao === true)) ||
    atual.desmaio === true;

  if (!emergenciaImediata && estado.rodadasPerguntas < 1 && precisaPerguntar(atual)) {
    const tema = escolherTemaPergunta({
      sintomas: atual.sintomas,
      idade_grupo: atual.idade_grupo,
      gestante: atual.gestante,
      risco_mental: atual.risco_mental,
      falta_de_ar: atual.falta_de_ar,
    });
    const perguntas = PERGUNTAS[tema];
    return {
      estado: { relatos, rodadasPerguntas: estado.rodadasPerguntas + 1, temaPergunta: tema },
      resultado: {
        tipo: 'perguntas',
        tema,
        perguntas,
        texto: perguntas.join('\n'),
      },
    };
  }

  const decisao = aplicarMotor(atual);
  if (decisao.categoria_interna === 'informacao_insuficiente' && estado.rodadasPerguntas < 1) {
    const perguntas = PERGUNTAS.vago;
    return {
      estado: { relatos, rodadasPerguntas: estado.rodadasPerguntas + 1, temaPergunta: 'vago' },
      resultado: {
        tipo: 'perguntas',
        tema: 'vago',
        perguntas,
        texto: perguntas.join('\n'),
      },
    };
  }

  const mensagem = sanitizarResposta(mensagemPorId(decisao.resposta_id).texto);
  registrarDecisao(decisao);

  return {
    estado: { relatos, rodadasPerguntas: 0, temaPergunta: undefined },
    resultado: {
      tipo: 'orientacao',
      texto: mensagem,
      decisao,
    },
  };
}
