# Política de dados — Direciona SUS

Protótipo experimental de orientação sobre portas de entrada da rede. Não realiza diagnóstico, prescrição nem agendamento.

## O que o app usa

- Texto de sintomas enviado na conversa, só em memória, para extrair sinais e aplicar regras.
- Identificador da regra acionada, categoria interna, destino e versão das regras (auditoria sem o relato).

## O que o app não deve pedir nem guardar

- Nome completo, CPF, cartão SUS, endereço, telefone, senha, dados de cartão.
- Detalhes de método de autoagressão.
- Histórico clínico completo.

## Armazenamento

- Relatos não são gravados em disco, nuvem nem analytics.
- Regras e mensagens aprovadas ficam no aplicativo (modo offline).
- A conversa some ao fechar a tela.

## Decisão

A interpretação só organiza o texto. O destino e a mensagem vêm do motor de regras e do banco de respostas aprovadas.
