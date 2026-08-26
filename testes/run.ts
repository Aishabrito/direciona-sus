import assert from 'node:assert/strict';
import { extrairInformacoes, validarRelato, aplicarMotor, processarTurno, ESTADO_INICIAL } from '../ia';
import { mensagemPorId, sanitizarResposta } from '../ia/mensagens';
import cenarios from './cenarios_simulados.json';
import esperados from './resultados_esperados.json';

async function main() {
  const extraido = extrairInformacoes(
    'Minha mãe caiu, bateu a cabeça e agora está meio confusa.',
  );
  assert.equal(extraido.relato_sobre_terceiro, true);
  assert.equal(extraido.pessoa, 'mãe');
  assert.ok(extraido.trauma === true);
  assert.ok(extraido.confusao === true);
  assert.ok(!extraido.sintomas.some((s) => /infarto|avc/i.test(s)));

  const validacao = validarRelato({ sintomas: 'febre', gestante: 'talvez' });
  assert.equal(validacao.ok, false);
  assert.equal(validacao.relato.gestante, 'nao_informado');
  assert.ok(Array.isArray(validacao.relato.sintomas));

  for (const cenario of cenarios) {
    const relato = extrairInformacoes(cenario.entrada);
    const decisao = aplicarMotor(relato);
    const esperado = esperados[cenario.id as keyof typeof esperados];
    assert.equal(decisao.resposta_id, esperado.resposta_id, cenario.id);
    assert.equal(decisao.destino, esperado.destino, cenario.id);
    assert.equal(decisao.categoria_interna, cenario.categoria, cenario.id);
    assert.ok(decisao.regra_acionada);
    assert.equal(decisao.versao_regras, '1.0.0');
  }

  const diagnostico = sanitizarResposta('Isso é um infarto. Tome AAS.');
  assert.equal(diagnostico, mensagemPorId('fallback_001').texto);

  const vago = await processarTurno('oi', ESTADO_INICIAL);
  assert.equal(vago.resultado.tipo, 'perguntas');

  const emergencia = await processarTurno(
    'Estou com dor no peito, falta de ar e suor frio.',
    ESTADO_INICIAL,
  );
  assert.equal(emergencia.resultado.tipo, 'orientacao');
  if (emergencia.resultado.tipo === 'orientacao') {
    assert.equal(emergencia.resultado.decisao.resposta_id, 'emergencia_001');
  }

  const aposPergunta = await processarTurno('só uma coriza', vago.estado);
  assert.equal(aposPergunta.resultado.tipo, 'orientacao');

  console.log('testes da IA: ok');
}

main().catch((erro) => {
  console.error(erro);
  process.exit(1);
});
