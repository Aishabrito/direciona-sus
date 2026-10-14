# Direciona.AI — Centelha RJ Fase 2: textos para o formulário

> Contagem de caracteres conferida (com espaços). Trechos entre [COLCHETES] precisam de dado de vocês.

## ⚠️ Antes de colar: 3 ajustes importantes

1. **IA x "motor de regras".** A versão 1.6 diz que a solução "não depende de IA aberta". O código real (app + back.direciona) usa **guarda de emergência determinística → IA (LLM) → piso de validação por regras**. Os textos abaixo descrevem essa arquitetura híbrida: é a verdade, encaixa na categoria "IA e Machine Learning" do projeto e responde melhor ao Avaliador 2 ("todo hospital tem IA de fila"): a IA de vocês só interpreta a fala; quem decide o destino são regras validadas por médicos.
2. **Médica nova.** Troquei "Paloma" por "médica consultora". Atualizar a aba Equipe com a nova pessoa.
3. **Não prometa venda em 12 meses.** O edital diz que tudo no cronograma precisa ser executado. Ciclo de compra de prefeitura é lento, então a meta proposta é **piloto validado + 1 proposta em negociação**, não "2–3 contratos assinados".

---

## SOLUÇÃO

### Descrição da solução
*1366/1500 caracteres*

O Direciona.AI é uma plataforma de triagem assistiva e orientação de acesso ao SUS: o cidadão conta, por WhatsApp, aplicativo ou voz, o que está sentindo, em linguagem do dia a dia, e recebe a indicação da porta de entrada certa (UBS/Clínica da Família, UPA ou SAMU 192), com a unidade mais próxima, distância e rota.
a) Inovação: atua ANTES de o paciente sair de casa e em toda a rede municipal. Arquitetura híbrida e segura: uma guarda determinística reconhece 17 categorias de emergência (AVC, dor no peito, convulsão etc.) e aciona o 192 sem passar pela IA; a IA apenas interpreta a linguagem natural; e um piso de validação com protocolos aprovados por médicos decide o destino. Não diagnostica nem prescreve.
b) Funcionalidades: chat no WhatsApp e no app, entrada por voz, unidades próximas por geolocalização, modo offline para emergências, regras configuráveis por município e painel da prefeitura com dados agregados e anonimizados (demanda por sintoma, bairro e horário, mapa de calor).
c) Diferenciais: IAs de fila de hospitais organizam quem já chegou à unidade; teleconsultas substituem a consulta. O Direciona.AI organiza a entrada na rede pública antes do deslocamento, sem pedir CPF ou dados identificáveis (LGPD).
d) Benefícios: menos casos leves nas UPAs, orientação gratuita e acessível ao cidadão e dados para o gestor planejar equipes e insumos.

### Estágio atual
**Protótipo testado.** Só marquem *Protótipo beta* se já houve teste com grupo de usuários reais fora da equipe.

### Evidências (PDF até 5 MB): sugestão de conteúdo
1. Prints do app (abertura, boas-vindas, chat, lista de unidades com rota)
2. Prints de conversa no WhatsApp: um caso leve → UBS, um caso grave → 192
3. Diagrama da arquitetura: guarda de emergência → IA → validação → unidades próximas
4. Resultado de testes: nº de casos simulados testados e % de emergências escaladas corretamente
5. Parecer ou declaração curta da médica sobre a revisão dos protocolos
6. Trecho da política de dados (sem CPF, relato não armazenado)

### Estágio pretendido
**MVP**

### Estratégia para o desenvolvimento
*1473/1500 caracteres*

O núcleo tecnológico é desenvolvido pela própria equipe, sem terceirização: Aisha (full-stack) conduz app (React Native/Expo), backend (Node.js) e integrações; Pamella conduz modelo de negócio, indicadores e prospecção; a médica consultora valida os protocolos clínicos.
a) Recursos: pró-labore da equipe, consultoria médica remunerada, nuvem, WhatsApp Business API, APIs de IA, voz e mapas, celulares de teste, assessoria jurídica (LGPD/regulatório) e apoio de UX/acessibilidade.
b) Produção: software em nuvem (SaaS), entregas mensais com método ágil, testes automatizados dos casos de emergência a cada versão e versionamento das regras clínicas, registrando qual regra gerou cada orientação (auditoria sem guardar o relato).
c) Pesquisas: (1) validação clínica dos critérios de encaminhamento, com base no Protocolo de Manchester e na Carteira de Serviços da APS; (2) bateria de casos simulados revisada por médicos para medir acerto e segurança; (3) testes de usabilidade com idosos e pessoas de baixa escolaridade em Naves do Conhecimento e UBS; (4) piloto em município parceiro medindo redirecionamentos e satisfação.
d) Certificação: avaliação do enquadramento como Software como Dispositivo Médico (RDC 657/2022 da ANVISA) com assessoria especializada, relatório de impacto à proteção de dados (LGPD) e boas práticas de segurança da informação. No piloto, a ferramenta atua como apoio à orientação, sem diagnóstico, e com o fluxo validado pela secretaria de saúde.

---

## IMPACTO

**Opção:** "O objetivo principal da solução proposta é resolver um desafio socioambiental."

### Descrição do desafio socioambiental
*1367/1500 caracteres*

(a) Problema: as UPAs, criadas para urgências, viraram porta de entrada de casos leves. Em Patos de Minas (MG), 76,9% dos atendimentos de out/2025 foram de baixa complexidade; na UPA Zona Norte de Macapá, 66% dos atendimentos de jan a set/2025 foram classificados como verde ou azul no Protocolo de Manchester. O resultado são filas de horas, atraso no cuidado de casos graves, equipes sobrecarregadas e uso caro de uma estrutura de urgência para o que a UBS resolveria.
Causas: falta de informação sobre qual serviço procurar; horários e localização das unidades pouco conhecidos; hábito de buscar a UPA por estar sempre aberta; e baixa literacia em saúde e digital da população mais vulnerável. Do lado da gestão, faltam dados em tempo real da demanda para planejar.
(b) Impactos positivos: casos leves redirecionados à atenção primária, fortalecendo o vínculo com a UBS; capacidade das UPAs liberada para urgências reais; emergências reconhecidas e encaminhadas ao 192 mais rápido; acesso à orientação em saúde ampliado para idosos e pessoas de baixa renda e escolaridade (voz, WhatsApp, linguagem simples, gratuito ao cidadão); e dados agregados e anonimizados para o gestor planejar equipes, insumos e ações preventivas, como picos de síndromes gripais ou arboviroses por bairro. Meta do piloto: 30% dos casos leves orientados à UBS. Contribui com os ODS 3 e 10.

### Impactos negativos e mitigação
*1417/1500 caracteres*

1) Orientação incorreta (caso grave enviado à UBS). Mitigação: guarda de emergência determinística que roda antes da IA; piso de segurança que, na dúvida, escala para o nível mais urgente; protocolos validados por médica; testes automáticos com casos críticos a cada versão; e aviso permanente "em emergência, ligue 192".
2) Uso como diagnóstico ou automedicação. Mitigação: o sistema não diagnostica nem indica remédio e responde com mensagens previamente aprovadas.
3) Privacidade (dados de saúde são sensíveis). Mitigação: não pedimos nome, CPF ou cartão SUS; o relato não é armazenado; o gestor vê apenas dados agregados e anonimizados; relatório de impacto à proteção de dados (LGPD).
4) Exclusão digital. Mitigação: WhatsApp, que roda em aparelhos simples; entrada por voz; modo offline para emergências; divulgação presencial com agentes comunitários e Naves do Conhecimento. O atendimento presencial segue garantido: a ferramenta orienta, não barra ninguém.
5) Sobrecarga das UBS. Mitigação: regras configuradas com a secretaria conforme horário e capacidade de cada unidade, com monitoramento mensal.
6) Viés da IA. Mitigação: auditoria periódica dos encaminhamentos por região e perfil e revisão clínica das regras.
7) Ambiental: consumo de energia em nuvem, mitigado com provedores com metas de energia renovável. A redução de deslocamentos desnecessários e de papel tende a gerar saldo ambiental positivo.

---

## MERCADO

### Descrição do mercado
*1412/1500 caracteres*

a) Tamanho: o Brasil tem 5.570 municípios; a atenção primária está em todos e as UPAs nas cidades acima de 50 mil habitantes. Mercado inicial: os 92 municípios do RJ, começando pela Região Metropolitana; depois, nacional. A saúde digital no Brasil movimentou US$ 12,4 bi em 2025, com projeção de US$ 44 bi até 2034 (15,3% a.a.).
b) Tendências: mercado em expansão, impulsionado pela Estratégia de Saúde Digital do SUS, pelo Marco Legal das Startups (CPSI) e pela pressão por eficiência nos gastos municipais.
c) Estudos: protótipo funcional (app e WhatsApp) avaliado internamente e com médica da Atenção Primária. [COMPLETAR: entrevistas/testes feitos, nº de pessoas e principal achado]
d) Concorrentes: TopMed (teletriagem com profissional, foco em teleconsulta); Mar Saúde (triagem por IA, foco em planos de saúde); Soul.Gov (plataforma hospitalar ampla); IAs de fila de hospitais (organizam quem já chegou a uma unidade); totens de pré-triagem (exigem ir à UPA); mapas de calor e vigilância participativa (Guardiões da Saúde, Painéis CONASEMS), que observam a demanda mas não orientam o cidadão. Nenhum une orientação antes do deslocamento, redirecionamento na rede pública, WhatsApp/voz e painel para o gestor.
e) Canais: venda direta a secretarias municipais de saúde, consórcios intermunicipais, eventos do COSEMS-RJ e CONASEMS, parceiros que já fornecem sistemas a prefeituras e chamadas de inovação/CPSI.

### Segmento de clientes
*1334/1500 caracteres*

a) Nicho: organização da porta de entrada da rede municipal de saúde (Atenção Primária, UPA e SAMU). Criamos valor para quem paga (prefeitura) e para quem usa (cidadão).
b) Necessidades: secretarias de saúde precisam reduzir a superlotação das UPAs sem novos investimentos, aproveitar melhor a capacidade das UBS, cumprir metas da Atenção Primária e ter dados confiáveis da demanda para planejar. O cidadão quer saber, rápido e de graça, onde será atendido, sem passar horas na fila errada.
c) Clientes: secretarias municipais de saúde de cidades com UPA e rede de UBS (prioridade: 50 a 500 mil habitantes) e consórcios intermunicipais; no futuro, clínicas populares e operadoras (B2B). Decisores: secretário de saúde e coordenações de Atenção Primária e de Urgência.
Público que recebe a intervenção: usuários do SUS (cerca de 7 em cada 10 brasileiros dependem só dele), com foco em quem mais sofre com filas e falta de informação: idosos, pessoas de baixa renda e baixa escolaridade, cuidadores e mães de crianças pequenas. Por isso o canal principal é o WhatsApp, com voz e linguagem simples.
Beneficiados indiretos: profissionais das UPAs (menos sobrecarga), equipes de Saúde da Família (mais vínculo com o território), pacientes graves (atendidos mais rápido) e a vigilância epidemiológica (sinais precoces de surtos por bairro).

### Modelo de negócio
**B2G.** O B2B (clínicas/operadoras) entra no texto como receita futura. Marcar B2G2B dilui o foco e deixa de mostrar quem paga.

### Monetização
*1343/1500 caracteres*

SaaS por assinatura anual paga pela prefeitura; o cidadão usa de graça. O preço inclui implantação, configuração das unidades e regras locais, treinamento, suporte e atualizações, e varia pelo porte: até 50 mil hab., R$ 36-60 mil/ano; 50 a 200 mil, R$ 60-120 mil/ano; acima de 200 mil, R$ 120-250 mil/ano. Receitas complementares: módulo analítico avançado (R$ 18-48 mil/ano, com séries históricas e integração com e-SUS/SINAN), relatórios epidemiológicos sob demanda e, a partir do 2º ano, licença B2B para clínicas populares e operadoras (R$ 400-1.800/mês).
Contratação: municípios menores por dispensa de licitação por valor (Lei 14.133/2021, art. 75, II); maiores pelo Contrato Público para Solução Inovadora (CPSI, LC 182/2021), que permite piloto remunerado e posterior fornecimento sem nova licitação.
Como os clientes conhecerão: piloto em 1 município como caso de referência; apresentações ao COSEMS-RJ, consórcios e eventos do CONASEMS; parcerias com empresas que já vendem sistemas a prefeituras. Para o cidadão, a prefeitura divulga: cartazes com QR Code e número do WhatsApp nas UBS e UPAs, agentes comunitários, redes sociais e Naves do Conhecimento.
Escalabilidade: o mesmo software atende novos municípios apenas com configuração (unidades, horários, regras locais), com custo marginal baixo; meta de 3 a 5 contratos no 2º ano.

---

## GESTÃO

### Gestão do negócio
*802/1000 caracteres*

Papéis: Aisha - produto e tecnologia; Pamella - negócios, finanças e relação com prefeituras; médica consultora - qualidade clínica. Ritos: planejamento mensal por metas (OKRs), reunião semanal de acompanhamento e revisão clínica mensal das regras.
Métricas de produto: conversas/mês, % de casos leves orientados à UBS, % de emergências encaminhadas ao 192, taxa de conclusão da triagem, satisfação e disponibilidade do sistema.
Métricas de negócio: prefeituras no funil, reuniões, propostas, contratos, receita recorrente, custo por município e caixa.
Qualidade e conformidade: casos críticos testados a cada versão, registro de incidentes e controles da LGPD.
Ferramentas: GitHub (código e tarefas), Trello/Notion, CRM gratuito (HubSpot), planilha financeira e painéis de indicadores (Looker Studio).

- **Maturidade atual:** *Identificação dos requisitos do cliente* (se já conversaram com profissionais, gestores ou usuários). Se não conversaram, marquem *Identificação do nicho de mercado*.
- **Maturidade pretendida:** *Aplicação/Validação no cliente*, coerente com o piloto.

---

## CRONOGRAMA (7 etapas, M1 = 1º mês do projeto)

| Etapa | Atividade | Descrição | Indicadores | Início | Fim |
|---|---|---|---|---|---|
| **1. Validação clínica e segurança** | 1.1 Revisão dos protocolos de encaminhamento | Médica revisa critérios UBS/UPA/192 com base no Protocolo de Manchester e na Carteira de Serviços da APS | Documento de protocolos validado e assinado pela médica | M1 | M2 |
| | 1.2 Bateria de casos simulados | Montar e rodar casos clínicos simulados, comparando a orientação do sistema com a da médica | 300 casos testados; 100% das emergências críticas escaladas; ≥ 90% de concordância | M2 | M3 |
| | 1.3 Conformidade LGPD e regulatória | RIPD, termos de uso, política de privacidade e parecer sobre enquadramento ANVISA (SaMD) | RIPD concluído; parecer regulatório emitido | M1 | M3 |
| **2. MVP do cidadão** | 2.1 Voz e acessibilidade | Entrada e saída por voz no app e no WhatsApp; ajustes para leitor de tela e linguagem simples | Voz publicada; app aprovado em checklist de acessibilidade | M2 | M4 |
| | 2.2 Configuração por município | Cadastro de unidades, horários e regras locais sem mexer no código | Município configurado em ≤ 2 dias | M3 | M5 |
| | 2.3 Publicação | Publicar o app nas lojas e verificar o número oficial do WhatsApp Business | App na Play Store e App Store; WhatsApp verificado | M4 | M5 |
| **3. Painel do gestor** | 3.1 Coleta anonimizada | Registro de eventos sem dados pessoais (sintoma categorizado, bairro, horário, destino) | Base de dados anonimizada em produção | M4 | M5 |
| | 3.2 Painel v1 | Demanda por sintoma, região, horário e destino, com mapa de calor | Painel v1 publicado | M5 | M7 |
| | 3.3 Validação com gestores | Apresentar o painel a gestores e coletar requisitos | ≥ 3 gestores entrevistados; relatório de ajustes | M6 | M7 |
| **4. Usabilidade com o público-alvo** | 4.1 Testes presenciais | Testes em Naves do Conhecimento e UBS com idosos e pessoas de baixa escolaridade | ≥ 40 participantes (≥ 15 idosos); nota SUS ≥ 70 | M4 | M6 |
| | 4.2 Ajustes de UX e linguagem | Corrigir pontos de dificuldade encontrados | Nova versão com ajustes; taxa de conclusão ≥ 80% | M6 | M7 |
| **5. Piloto municipal** | 5.1 Parceria com município | Prospectar secretarias e formalizar piloto (termo de cooperação ou CPSI) | ≥ 10 secretarias contatadas; 1 termo assinado | M3 | M6 |
| | 5.2 Implantação | Configurar unidades, treinar equipes e preparar a divulgação (QR Code nas unidades) | Equipes treinadas; material de divulgação nas unidades | M6 | M7 |
| | 5.3 Operação do piloto | Uso real com acompanhamento semanal e auditoria clínica de amostra de casos | ≥ 1.000 conversas; ≥ 30% dos casos leves orientados à UBS; ≥ 85% de satisfação; 0 emergência subtriada na amostra auditada | M7 | M10 |
| | 5.4 Relatório de impacto | Consolidar resultados para a secretaria e para a venda | Relatório publicado | M10 | M11 |
| **6. Comercialização** | 6.1 Proposta comercial | Precificação final, proposta padrão e modelos de contratação (dispensa e CPSI) | Kit comercial pronto | M8 | M9 |
| | 6.2 Prospecção | Demonstrações a municípios, COSEMS-RJ e consórcios; eventos do setor | 15 municípios contatados; 5 demonstrações; 2 eventos | M9 | M12 |
| | 6.3 Primeira negociação | Converter o piloto ou outro município em contrato | 1 proposta formal em negociação | M11 | M12 |
| **7. Gestão do projeto** | 7.1 Estruturação | CNPJ, contabilidade, conta do projeto e ferramentas de gestão | Empresa e ferramentas operando | M1 | M1 |
| | 7.2 Relatório final | Prestação de contas e relatório final ao Centelha | Relatório entregue | M12 | M12 |

---

## ORÇAMENTO (subvenção R$ 128.000 + contrapartida R$ 6.400 = 5%)

> Conferir no edital FAPERJ 12/2026 o teto, os limites de pró-labore e quais itens são financiáveis. Tirei a "contingência 10%" do plano antigo porque reserva genérica costuma ser glosada.

| # | Rubrica | Origem | Descrição e justificativa | Qtd | Unit. (R$) | Total (R$) |
|---|---|---|---|---|---|---|
| C1 | Pró-labore dos sócios | Subvenção | Aisha: desenvolvimento do app, backend, IA e painel | 12 | 2.800 | 33.600 |
| C2 | Pró-labore dos sócios | Subvenção | Pamella: modelo de negócio, indicadores, prospecção e gestão | 12 | 1.600 | 19.200 |
| C3 | Serviços de Terceiros PF | Subvenção | Consultoria médica: validação dos protocolos, casos simulados e auditoria do piloto (~10 h/mês) | 12 | 1.800 | 21.600 |
| C4 | Serviços de Terceiros PF | Subvenção | Designer UX/acessibilidade: telas do painel e ajustes para público de baixa escolaridade | 1 | 6.000 | 6.000 |
| C5 | Serviços de Terceiros PJ | Subvenção | Hospedagem em nuvem (servidor e banco de dados) | 12 | 700 | 8.400 |
| C6 | Serviços de Terceiros PJ | Subvenção | WhatsApp Business API (mensagens) | 12 | 450 | 5.400 |
| C7 | Serviços de Terceiros PJ | Subvenção | APIs de IA (interpretação de texto) e de voz (fala para texto e texto para fala) | 12 | 550 | 6.600 |
| C8 | Serviços de Terceiros PJ | Subvenção | API de mapas e geolocalização das unidades | 12 | 250 | 3.000 |
| C9 | Serviços de Terceiros PJ | Subvenção | Assessoria jurídica: LGPD (RIPD, termos) e parecer regulatório ANVISA | 1 | 8.700 | 8.700 |
| C10 | Serviços de Terceiros PJ | Subvenção | Site, vídeo demonstrativo e material comercial | 1 | 5.000 | 5.000 |
| C11 | Serviços de Terceiros PJ | Subvenção | Contas de desenvolvedor Apple e Google para publicar o app | 1 | 800 | 800 |
| C12 | Passagens nacionais | Subvenção | Participação em eventos de gestão de saúde (ex.: Congresso CONASEMS) | 3 | 900 | 2.700 |
| C13 | Material de consumo | Subvenção | Cartazes e adesivos com QR Code para divulgação nas unidades do piloto | 1 | 1.500 | 1.500 |
| C14 | Serviços de Terceiros PJ | Contrapartida | Contabilidade da empresa | 12 | 300 | 3.600 |
| C15 | Diárias/locomoção | Contrapartida | Deslocamentos ao município piloto, UBS e Naves do Conhecimento | 14 | 200 | 2.800 |
| K1 | Equipamentos | Subvenção | Celular Android de entrada, para testar em aparelho igual ao do público-alvo | 1 | 1.300 | 1.300 |
| K2 | Equipamentos | Subvenção | iPhone para testes e publicação na App Store | 1 | 4.200 | 4.200 |

| | Subvenção | Contrapartida | Total |
|---|---|---|---|
| Custeio | 122.500 | 6.400 | 128.900 |
| Capital | 5.500 | 0 | 5.500 |
| **Total geral** | **128.000** | **6.400** | **134.400** |

*As bolsas do CNPq (até R$ 45.580) são à parte: podem financiar dedicação extra da equipe ou de um bolsista, sem pagar duas vezes a mesma pessoa pela mesma atividade.*

---

## RESUMO DO NEGÓCIO

### Resumo
*454/500 caracteres*

O Direciona.AI orienta o cidadão, por WhatsApp, app ou voz, sobre onde buscar atendimento no SUS (UBS, UPA ou SAMU 192) antes de sair de casa, reduzindo casos leves nas UPAs. Uma guarda de emergência e protocolos validados por médicos garantem a segurança; a IA só interpreta a fala. A prefeitura assina a plataforma (SaaS B2G) e recebe painel com dados anonimizados da demanda. Com o Centelha, vamos concluir o MVP e validá-lo em piloto municipal no RJ.

---

## Como os textos respondem aos avaliadores da Fase 1

| Crítica | Onde foi respondida |
|---|---|
| Como atrair cidadãos e gestores | Monetização (divulgação via prefeitura, QR Code, ACS, COSEMS) e Mercado (canais) |
| Interface para baixa renda e escolaridade | Descrição, Segmento, Negativos (WhatsApp, voz, linguagem simples, offline) e Etapa 4 do cronograma |
| Análise comparativa com concorrentes | Mercado (d) e Descrição (c) |
| Resultados do teste do protótipo | **[FALTA DADO]** Mercado (c) e PDF de evidências |
| "Hospitais já têm IA de fila" | Descrição (a, c): a IA deles atua dentro do hospital, depois da chegada; a de vocês atua antes, na rede toda |
