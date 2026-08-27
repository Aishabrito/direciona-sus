// ia/orquestrador.ts
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
  texto_original_acumulado: '',
};

function consolidar(estado: EstadoConversa): RelatoEstruturado {
  // Mescla os relatos e adiciona o texto original acumulado
  const base = estado.relatos.reduce((acc, item) => mesclarRelatos(acc, item), { ...RELATO_VAZIO });
  // Inclui o texto original acumulado no relato consolidado
  return {
    ...base,
    texto_original_acumulado: estado.texto_original_acumulado || '',
  };
}

function precisaPerguntar(relato: RelatoEstruturado): boolean {
  // Se já temos sinais claros de emergência, não perguntamos
  if (relato.sinais_alerta.length > 0) return false;
  if (relato.sintomas.length > 0 && relato.sintomas[0] !== 'sintomas leves ou rotina') return false;
  if (relato.sinais_obstetricos && relato.sinais_obstetricos.length > 0) return false;
  if (relato.sinais_trauma && relato.sinais_trauma.length > 0) return false;
  if (relato.risco_mental !== 'nao_mencionado') return false;
  if (relato.gestante === 'sim') return false;
  if (relato.febre === true) return false;
  // Caso contrário, se informações são insuficientes, perguntamos
  return relato.informacao_insuficiente;
}

export async function processarTurno(
  textoUsuario: string,
  estado: EstadoConversa,
): Promise<{ resultado: TurnoResultado; estado: EstadoConversa }> {
  // Acumula o texto original
  const textoAcumulado = estado.texto_original_acumulado
    ? `${estado.texto_original_acumulado} ${textoUsuario}`
    : textoUsuario;

  // Extrai informação do novo texto (a função interpretarRelato é determinística)
  const extraido = await interpretarRelato(textoUsuario);
  // O relato extraído já contém os campos novos (sinais_obstetricos, sinais_trauma)
  const relatos = [...estado.relatos, extraido];
  const atual = consolidar({ ...estado, relatos, texto_original_acumulado: textoAcumulado });

  // Verifica emergência imediata (usando os sinais já extraídos)
  const emergenciaImediata =
    atual.risco_mental === 'iminente' ||
    (atual.trauma === true && (atual.confusao === true || atual.desmaio === true)) ||
    (atual.dor_no_peito === true &&
      (atual.falta_de_ar === true || atual.desmaio === true || atual.confusao === true)) ||
    atual.desmaio === true ||
    (atual.sinais_obstetricos && atual.sinais_obstetricos.length > 0) ||
    (atual.sinais_trauma && atual.sinais_trauma.length > 0);

  // Se não for emergência imediata e ainda precisamos de mais info, perguntamos
  if (!emergenciaImediata && estado.rodadasPerguntas < 1 && precisaPerguntar(atual)) {
    const tema = escolherTemaPergunta({
      sintomas: atual.sintomas,
      idade_grupo: atual.idade_grupo,
      gestante: atual.gestante,
      risco_mental: atual.risco_mental,
      falta_de_ar: atual.falta_de_ar,
    });
    const perguntas = PERGUNTAS[tema] || PERGUNTAS.vago;
    return {
      estado: {
        relatos,
        rodadasPerguntas: estado.rodadasPerguntas + 1,
        temaPergunta: tema,
        texto_original_acumulado: textoAcumulado,
      },
      resultado: {
        tipo: 'perguntas',
        tema,
        perguntas,
        texto: perguntas.join('\n'),
      },
    };
  }

  // Aplica o motor passando o texto original acumulado
  const decisao = aplicarMotor(atual, textoAcumulado);

  // Se ainda for insuficiente e não perguntamos ainda, tenta uma pergunta
  if (decisao.categoria_interna === 'informacao_insuficiente' && estado.rodadasPerguntas < 1) {
    const perguntas = PERGUNTAS.vago;
    return {
      estado: {
        relatos,
        rodadasPerguntas: estado.rodadasPerguntas + 1,
        temaPergunta: 'vago',
        texto_original_acumulado: textoAcumulado,
      },
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
    estado: {
      relatos,
      rodadasPerguntas: 0,
      temaPergunta: undefined,
      texto_original_acumulado: textoAcumulado,
    },
    resultado: {
      tipo: 'orientacao',
      texto: mensagem,
      decisao,
    },
  };
}