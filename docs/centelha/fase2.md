# Direciona.AI — Centelha RJ Fase 2: textos para o formulário

> **Prazo: 22/10/2026.** Contagem de caracteres conferida (com espaços). Os trechos entre [COLCHETES] precisam de dado de vocês.

## Decisões tomadas

- **Produto do Centelha ≠ JCC.** O JCC é o protótipo (app + bot). O Centelha é a plataforma replicável vendida a prefeituras: um código só, configurado por cidade, com app e WhatsApp com a marca de cada prefeitura e painel do gestor.
- **Equipe:** Aisha (coordenação e desenvolvimento), Pamella (negócios, 20h/semana), segundo desenvolvedor (na equipe, sem bolsa), Célia Cristina Guedes Brito, enfermeira, celetista da Prefeitura de Maricá (coordenadora de enfermagem). Bolsas CNPq (R$ 45.580) só para Aisha e Pamella. **As bolsas não entram na tabela de orçamento.**
- **Edital:** pró-labore e salário proibidos; membro da equipe não pode ser pago pela subvenção; contrapartida mínima de 3%; equipamentos até 50%.
- **Validação sem depender da prefeitura:** validação clínica, testes com cidadãos (Naves do Conhecimento e projetos sociais) com dados públicos do CNES, painel mostrado a gestores. O piloto oficial é meta, com plano B.
- **Integração com e-SUS e SINAN:** fica pronta para ligar e é oferecida depois do Centelha, conforme o interesse da prefeitura.

## Pendências

1. Universidade: o cadastro diz UNIRIO e o texto diz UFRJ. Corrigir na aba Equipe.
2. Cadastrar Célia e o segundo desenvolvedor na equipe, com carta de anuência de cada um. Célia é celetista da Prefeitura de Maricá: por segurança, peçam também a carta de anuência da instituição de vínculo (Anexo II) e declarem uma dedicação realista (ex.: 4 h/semana), já que ela tem 40 h lá.
3. **Lattes da Célia:** o mestrado aparece "em andamento" (desde 2019, sem ano de obtenção), assim como a especialização da Fiocruz, mas o currículo diz que estão concluídos. O avaliador confere o Lattes. Se estiverem concluídos, ela precisa atualizar antes de 22/10. Os textos dizem "com mestrado", que funciona nos dois casos. O vínculo com a Prefeitura do Rio também aparece como "Atual" e deve estar desatualizado.
4. **Conflito de interesse em Maricá:** como Célia é empregada da Prefeitura de Maricá, a Lei 14.133/2021 (art. 9º) restringe que agente público do órgão contratante participe de contratação com ele. Para a proposta do Centelha isso não é problema, mas, se Maricá virar cliente, ela não pode participar da negociação nem do contrato. Levem a dúvida à assessoria jurídica (item C7) e considerem outra prefeitura como primeiro cliente pago.
5. Resultados de testes do protótipo do JCC, se houver, em Mercado (c) e no PDF de evidências.
6. Apple: apps replicados por cliente costumam ter de ser publicados na conta da própria prefeitura (diretriz 4.2.6). Prever isso no contrato.
7. Nuvem, IA e Apple cobram em dólar. Na prestação de contas, prefiram fornecedores com nota fiscal no Brasil.

---

## SOLUÇÃO

### Descrição da solução
*1453/1500 caracteres*

O Direciona.AI é uma plataforma de triagem assistiva que a prefeitura contrata para orientar o cidadão sobre onde buscar atendimento no SUS. A pessoa conta, pelo WhatsApp da prefeitura, pelo app com a marca do município ou por voz, o que está sentindo, e recebe a porta de entrada certa (UBS/Clínica da Família, UPA ou SAMU 192), com a unidade mais próxima e a rota.
a) Inovação: atua ANTES de o paciente sair de casa e em toda a rede municipal. Arquitetura híbrida e segura: uma guarda determinística reconhece 17 categorias de emergência e aciona o 192 sem passar pela IA; a IA apenas interpreta a linguagem natural; e um piso de validação com protocolos clínicos validados decide o destino. Não diagnostica nem prescreve.
b) Funcionalidades: uma única plataforma configurada por município (unidades, horários, regras locais, número de WhatsApp, marca); entrada por voz; geolocalização; modo offline para emergências; painel do gestor com perfis de acesso, dados agregados e anonimizados e mapa de calor por sintoma, bairro e horário; estrutura pronta para integrar com e-SUS e SINAN.
c) Diferenciais: IAs de fila de hospitais organizam quem já chegou; teleconsultas substituem a consulta. O Direciona.AI organiza a entrada na rede pública antes do deslocamento, sem pedir CPF (LGPD), e é replicável: nova cidade é configuração, não novo código.
d) Benefícios: menos casos leves nas UPAs, orientação gratuita ao cidadão e dados para o gestor planejar.

**Estágio atual:** Protótipo testado  
**Estágio pretendido:** MVP

**PDF de evidências (até 5 MB):** prints do app e do WhatsApp (um caso leve → UBS, um grave → 192), diagrama da arquitetura (guarda → IA → validação → unidades), resultado dos testes automáticos dos casos de emergência, trecho da política de dados e, se houver, depoimento de Célia sobre o fluxo.

### Estratégia de desenvolvimento
*1472/1500 caracteres*

Partimos do protótipo (app e bot de WhatsApp com guarda de emergência) criado no programa Jovens Cientistas Cariocas e o transformamos em plataforma replicável para prefeituras.
a) Recursos: equipe executora (Aisha e um segundo desenvolvedor no app, bot e motor de regras; Pamella em negócios, 20h/semana; Célia, enfermeira e ex-gestora de unidades da Atenção Primária, nos fluxos e protocolos), bolsas CNPq e, pela subvenção: desenvolvimento terceirizado, design, médico consultor, jurídico, nuvem, APIs e equipamentos.
b) Produção: núcleo clínico e app desenvolvidos pela equipe; painel do gestor e área administrativa multi-cidade terceirizados por entregas, com especificação e aceite pela equipe. Código único com versão do app gerada para cada prefeitura, entregas mensais, testes automáticos dos casos de emergência a cada versão e regras versionadas e auditáveis.
c) Pesquisas: validação dos critérios de encaminhamento (Protocolo de Manchester e Carteira de Serviços da APS) por Célia e por médico consultor; casos simulados para medir acerto e segurança; testes de usabilidade com idosos e pessoas de baixa escolaridade; testes com cidadãos em Naves do Conhecimento e projetos sociais, usando unidades reais (dados públicos do CNES).
d) Certificação: avaliação do enquadramento como Software como Dispositivo Médico (RDC 657/2022 da ANVISA) com assessoria jurídica, relatório de impacto à proteção de dados (LGPD), teste de segurança e registro da marca no INPI.

---

## IMPACTO

**Opção:** O objetivo principal da solução proposta é resolver um desafio socioambiental.

### Desafio socioambiental
*1400/1500 caracteres*

(a) Problema: as UPAs, criadas para urgências, viraram porta de entrada de casos leves. Em Patos de Minas (MG), 76,9% dos atendimentos de out/2025 foram de baixa complexidade; na UPA Zona Norte de Macapá, 66% dos atendimentos de jan a set/2025 foram classificados como verde ou azul no Protocolo de Manchester. O resultado são filas de horas, atraso no cuidado de casos graves, equipes sobrecarregadas e uso caro de uma estrutura de urgência para o que a UBS resolveria.
Causas: falta de informação sobre qual serviço procurar; horários e localização das unidades pouco conhecidos; hábito de buscar a UPA por estar sempre aberta; e baixa literacia em saúde e digital da população mais vulnerável. Do lado da gestão, faltam dados em tempo real da demanda para planejar.
(b) Impactos positivos: casos leves redirecionados à atenção primária, fortalecendo o vínculo com a UBS; capacidade das UPAs liberada para urgências reais; emergências reconhecidas e encaminhadas ao 192 mais rápido; acesso à orientação em saúde ampliado para idosos e pessoas de baixa renda e escolaridade (voz, WhatsApp, linguagem simples, gratuito ao cidadão); e dados agregados e anonimizados para o gestor planejar equipes, insumos e ações preventivas, como picos de síndromes gripais ou arboviroses por bairro. Meta: ≥ 90% de concordância das orientações com a avaliação de profissionais de saúde. Contribui com os ODS 3 e 10.

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
*1419/1500 caracteres*

a) Tamanho: o Brasil tem 5.570 municípios; a atenção primária está em todos e as UPAs nas cidades acima de 50 mil habitantes. Mercado inicial: os 92 municípios do RJ, começando pela Região Metropolitana; depois, nacional. A saúde digital no Brasil movimentou US$ 12,4 bi em 2025, com projeção de US$ 44 bi até 2034 (15,3% a.a.).
b) Tendências: mercado em expansão, impulsionado pela Estratégia de Saúde Digital do SUS, pelo Marco Legal das Startups (CPSI) e pela pressão por eficiência nos gastos municipais.
c) Estudos: protótipo funcional (app e WhatsApp) avaliado internamente e com profissionais da Atenção Primária. [COMPLETAR: entrevistas/testes feitos, nº de pessoas e principal achado]
d) Concorrentes: TopMed (teletriagem com profissional, foco em teleconsulta); Mar Saúde (triagem por IA, foco em planos de saúde); Soul.Gov (plataforma hospitalar ampla); IAs de fila de hospitais (organizam quem já chegou a uma unidade); totens de pré-triagem (exigem ir à UPA); mapas de calor e vigilância participativa (Guardiões da Saúde, Painéis CONASEMS), que observam a demanda mas não orientam o cidadão. Nenhum une orientação antes do deslocamento, redirecionamento na rede pública, WhatsApp/voz e painel para o gestor.
e) Canais: venda direta a secretarias municipais de saúde, consórcios intermunicipais, eventos do COSEMS-RJ e CONASEMS, parceiros que já fornecem sistemas a prefeituras e chamadas de inovação/CPSI.

### Segmento de clientes
*1334/1500 caracteres*

a) Nicho: organização da porta de entrada da rede municipal de saúde (Atenção Primária, UPA e SAMU). Criamos valor para quem paga (prefeitura) e para quem usa (cidadão).
b) Necessidades: secretarias de saúde precisam reduzir a superlotação das UPAs sem novos investimentos, aproveitar melhor a capacidade das UBS, cumprir metas da Atenção Primária e ter dados confiáveis da demanda para planejar. O cidadão quer saber, rápido e de graça, onde será atendido, sem passar horas na fila errada.
c) Clientes: secretarias municipais de saúde de cidades com UPA e rede de UBS (prioridade: 50 a 500 mil habitantes) e consórcios intermunicipais; no futuro, clínicas populares e operadoras (B2B). Decisores: secretário de saúde e coordenações de Atenção Primária e de Urgência.
Público que recebe a intervenção: usuários do SUS (cerca de 7 em cada 10 brasileiros dependem só dele), com foco em quem mais sofre com filas e falta de informação: idosos, pessoas de baixa renda e baixa escolaridade, cuidadores e mães de crianças pequenas. Por isso o canal principal é o WhatsApp, com voz e linguagem simples.
Beneficiados indiretos: profissionais das UPAs (menos sobrecarga), equipes de Saúde da Família (mais vínculo com o território), pacientes graves (atendidos mais rápido) e a vigilância epidemiológica (sinais precoces de surtos por bairro).

**Modelo de negócio:** B2G

### Monetização
*1384/1500 caracteres*

SaaS por assinatura anual paga pela prefeitura; o cidadão usa de graça. O preço inclui implantação, configuração das unidades e regras locais, treinamento, suporte e atualizações, e varia pelo porte: até 50 mil hab., R$ 36-60 mil/ano; 50 a 200 mil, R$ 60-120 mil/ano; acima de 200 mil, R$ 120-250 mil/ano. Receitas complementares: módulo analítico avançado (R$ 18-48 mil/ano, com séries históricas e integração com e-SUS/SINAN), relatórios epidemiológicos sob demanda e, a partir do 2º ano, licença B2B para clínicas populares e operadoras (R$ 400-1.800/mês).
Contratação: municípios menores por dispensa de licitação por valor (Lei 14.133/2021, art. 75, II); maiores pelo Contrato Público para Solução Inovadora (CPSI, LC 182/2021), que permite piloto remunerado e posterior fornecimento sem nova licitação.
Como os clientes conhecerão: testes com cidadãos e proposta de piloto gratuito a municípios como caso de referência; apresentações ao COSEMS-RJ, consórcios e eventos do CONASEMS; parcerias com empresas que já vendem sistemas a prefeituras. Para o cidadão, a prefeitura divulga: cartazes com QR Code e número do WhatsApp nas UBS e UPAs, agentes comunitários, redes sociais e Naves do Conhecimento.
Escalabilidade: o mesmo software atende novos municípios apenas com configuração (unidades, horários, regras locais), com custo marginal baixo; meta de 3 a 5 contratos no 2º ano.

---

## GESTÃO

### Gestão do negócio
*853/1000 caracteres*

Papéis: Aisha (coordenação, produto e tecnologia); segundo desenvolvedor (app, bot e integrações); Pamella (negócios, finanças e relação com prefeituras); Célia (fluxos, protocolos e implantação nas prefeituras). Ritos: planejamento mensal por metas (OKRs), reunião semanal e revisão clínica mensal das regras.
Métricas de produto: conversas/mês, % de casos leves orientados à UBS, % de emergências encaminhadas ao 192, conclusão da triagem, satisfação e disponibilidade.
Métricas de negócio: prefeituras no funil, reuniões, propostas, contratos, receita recorrente, custo por município e caixa.
Qualidade: casos críticos testados a cada versão, registro de incidentes, controles LGPD e aceite formal das entregas terceirizadas.
Ferramentas: GitHub (código e tarefas), Trello/Notion, CRM gratuito (HubSpot), planilha financeira e painéis de indicadores.

**Maturidade atual:** Identificação dos requisitos do cliente  
**Maturidade pretendida:** Negociação da primeira venda

---

## CRONOGRAMA (M1 = 1º mês após o Termo de Outorga)

| Etapa | Atividade | Descrição | Indicadores | Início | Fim |
|---|---|---|---|---|---|
| **1. Estruturação** | 1.1 Estruturação da empresa e do projeto | Conta do projeto, contabilidade, ferramentas de gestão e cotação de preços dos fornecedores | Fornecedores contratados com cotação registrada | M1 | M2 |
| | 1.2 Especificação da plataforma | Requisitos do painel e da área multi-cidade, validados com Célia | Documento de requisitos aprovado | M1 | M2 |
| **2. Validação clínica e segurança** | 2.1 Protocolos de encaminhamento | Célia e o médico consultor revisam critérios UBS/UPA/192 (Manchester e Carteira de Serviços da APS) | Relatório de validação assinado | M1 | M3 |
| | 2.2 Bateria de casos simulados | Casos clínicos simulados comparando a orientação do sistema com a dos profissionais | 300 casos; 100% das emergências críticas escaladas; ≥ 90% de concordância | M2 | M4 |
| | 2.3 LGPD e regulatório | RIPD, termos, termo de consentimento e parecer ANVISA | Documentos e parecer concluídos | M1 | M3 |
| **3. Plataforma multi-cidade** | 3.1 Área administrativa | Cadastro de unidades, horários e regras por município, com dados do CNES | Nova cidade configurada em ≤ 2 dias | M2 | M5 |
| | 3.2 App e WhatsApp por prefeitura | Versão do app e do WhatsApp com nome, logo e cores de cada município, gerada a partir do mesmo código | 2 municípios configurados (Rio de Janeiro e Maricá, para demonstração) | M3 | M6 |
| | 3.3 Voz | Entrada por áudio e resposta falada no app e no WhatsApp | Voz publicada nos dois canais | M2 | M4 |
| | 3.4 Teste de segurança | Pentest e correções | Relatório sem falhas críticas abertas | M6 | M7 |
| **4. Painel do gestor** | 4.1 Coleta anonimizada | Eventos sem dado pessoal: sintoma categorizado, bairro, horário, destino | Base anonimizada em produção | M3 | M4 |
| | 4.2 Painel e mapa de calor | Indicadores de demanda, mapa de calor e perfis de acesso | Painel publicado | M4 | M7 |
| | 4.3 Validação com gestores | Demonstração do painel, com dados dos testes, a gestores e coordenadores de saúde | ≥ 5 gestores ouvidos; relatório de ajustes | M7 | M9 |
| **5. Testes com cidadãos** | 5.1 Usabilidade | Testes em Naves do Conhecimento e projetos sociais com idosos e pessoas de baixa escolaridade | ≥ 60 participantes (≥ 20 idosos); nota SUS ≥ 70 | M5 | M7 |
| | 5.2 Teste comunitário ampliado | Uso livre do app e do WhatsApp configurados com unidades reais, com auditoria clínica de amostra | ≥ 300 usuários; ≥ 85% de satisfação; ≥ 90% de concordância na amostra auditada | M7 | M10 |
| | 5.3 Ajustes | Melhorias de linguagem, fluxo e regras a partir dos testes | Versão MVP publicada | M8 | M10 |
| **6. Prefeituras e vendas** | 6.1 Kit comercial | Proposta, preços, modelos de contrato (dispensa e CPSI), site, vídeo e manual de implantação e treinamento das equipes municipais (Célia) | Kit e manual prontos | M6 | M8 |
| | 6.2 Prospecção | Apresentações a secretarias da Região Metropolitana (ex.: Maricá), COSEMS-RJ e eventos | ≥ 10 secretarias contatadas; ≥ 5 apresentações; 1 evento nacional | M6 | M12 |
| | 6.3 Piloto assistido *(meta)* | Termo de cooperação, sem custo, para uso oficial numa unidade ou região. **Plano B:** ampliar o teste comunitário | 1 termo firmado **ou** teste comunitário com ≥ 500 usuários | M8 | M12 |
| | 6.4 Primeira negociação | Proposta comercial formal a um município interessado | 1 proposta formal em negociação | M10 | M12 |
| **7. Encerramento** | 7.1 Relatório final | Resultados, prestação de contas e plano do 2º ano | Relatório entregue | M12 | M12 |

---

## ORÇAMENTO

### Custeio
| # | Rubrica | Origem | Descrição e justificativa | Qtd | Unit. (R$) | Total (R$) |
|---|---|---|---|---|---|---|
| C1 | Serviços de Terceiros PJ | Subvenção | Desenvolvimento do painel web do gestor (indicadores de demanda. mapa de calor. perfis de acesso). contratado por entregas com aceite da equipe. Estimativa: 375 h × R$ 80/h (referência de desenvolvedor pleno PJ). | 1 | 30.000 | 30.000 |
| C2 | Serviços de Terceiros PJ | Subvenção | Desenvolvimento da área administrativa multi-cidade (cadastro de unidades. horários e regras; configuração do app e do WhatsApp de cada prefeitura). por entregas. Estimativa: 206 h × R$ 80/h. | 1 | 16.500 | 16.500 |
| C3 | Serviços de Terceiros PF | Subvenção | Design de interface do painel do gestor e do modelo visual do app adaptável à marca de cada prefeitura. com foco em acessibilidade. Estimativa: 100 h × R$ 80/h. | 1 | 8.000 | 8.000 |
| C4 | Serviços de Terceiros PF | Subvenção | Médico(a) consultor(a): revisão e validação dos protocolos de encaminhamento (UBS/UPA/192) e da bateria de casos simulados. com relatório técnico assinado. Estimativa: 40 h × R$ 200/h. | 1 | 8.000 | 8.000 |
| C5 | Serviços de Terceiros PF | Subvenção | Médico(a) consultor(a): auditoria clínica de amostra das orientações dadas nos testes com usuários reais. com relatório. Estimativa: 20 h × R$ 200/h. | 1 | 4.000 | 4.000 |
| C6 | Serviços de Terceiros PJ | Subvenção | Assessoria jurídica em proteção de dados: relatório de impacto (RIPD). termos de uso. política de privacidade e termo de consentimento dos testes (LGPD). | 1 | 5.000 | 5.000 |
| C7 | Serviços de Terceiros PJ | Subvenção | Assessoria jurídica: modelo de contrato e de termo de cooperação com prefeituras (dispensa e CPSI) e parecer sobre enquadramento na RDC 657/2022 da ANVISA. | 1 | 5.000 | 5.000 |
| C8 | Serviços de Terceiros PJ | Subvenção | Teste de segurança (pentest) da plataforma e do painel antes da apresentação a prefeituras. exigência comum de áreas de TI municipais. | 1 | 6.000 | 6.000 |
| C9 | Serviços de Terceiros PJ | Subvenção | Hospedagem em nuvem (servidor da aplicação e banco de dados) durante os 12 meses. | 12 | 600 | 7.200 |
| C10 | Serviços de Terceiros PJ | Subvenção | WhatsApp Business API (mensagens e números dos ambientes de teste e demonstração). | 12 | 350 | 4.200 |
| C11 | Serviços de Terceiros PJ | Subvenção | APIs de IA para interpretação de texto e de voz (transcrição de áudio e fala). usadas pelo assistente. | 12 | 400 | 4.800 |
| C12 | Serviços de Terceiros PJ | Subvenção | API de mapas e geolocalização para cálculo de distância e rota até as unidades. | 12 | 150 | 1.800 |
| C13 | Material de consumo | Subvenção | Licenças de software de desenvolvimento e testes (build e publicação de apps. monitoramento de erros). | 12 | 150 | 1.800 |
| C14 | Serviços de Terceiros PJ | Subvenção | Contas de desenvolvedor Google Play e Apple para publicação das versões do app. | 1 | 800 | 800 |
| C15 | Diárias ou despesas de hospedagem. alimentação e locomoção | Subvenção | Locomoção (combustível e pedágio) da equipe para testes comunitários e reuniões com secretarias municipais de saúde da Região Metropolitana. | 24 | 150 | 3.600 |
| C16 | Serviços de Terceiros PJ | Subvenção | Site institucional e vídeo de demonstração da plataforma para apresentação a prefeituras. | 1 | 5.000 | 5.000 |
| C17 | Material de consumo | Subvenção | Impressão de cartazes. folhetos e termos de consentimento com QR Code para os testes comunitários. | 1 | 1.500 | 1.500 |
| C18 | Passagens áreas e/ou terrestres nacionais | Subvenção | Passagens para participação em evento nacional de gestão em saúde (ex.: Congresso CONASEMS) para prospecção de municípios. | 2 | 1.000 | 2.000 |
| C19 | Serviços de Terceiros PJ | Subvenção | Registro da marca Direciona.AI no INPI (taxas e assessoria). item de propriedade intelectual previsto no edital. | 1 | 1.500 | 1.500 |
| C20 | Serviços de Terceiros PJ | Contrapartida | Serviços de contabilidade da empresa durante a execução do projeto (despesa administrativa coberta com recursos próprios). | 12 | 320 | 3.840 |

### Capital
| # | Rubrica | Origem | Descrição e justificativa | Qtd | Unit. (R$) | Total (R$) |
|---|---|---|---|---|---|---|
| K1 | Equipamentos e material permanente | Subvenção | Notebook para desenvolvimento. compilação e testes da plataforma. | 1 | 6.500 | 6.500 |
| K2 | Equipamentos e material permanente | Subvenção | Celular Android de entrada para testar o app em aparelho igual ao do público-alvo. | 1 | 1.300 | 1.300 |
| K3 | Equipamentos e material permanente | Subvenção | iPhone para testes das versões iOS do app. | 1 | 3.500 | 3.500 |

### Totais
| | Subvenção | Contrapartida | Total |
|---|---|---|---|
| Custeio | 116.700 | 3.840 | 120.540 |
| Capital | 11.300 | 0 | 11.300 |
| **Total geral** | **128.000** | **3.840** (3%) | **131.840** |

**Como o dinheiro se distribui:** construir o produto (C1–C3, C8) 47% · segurança clínica e jurídica (C4–C7) 17% · manter funcionando (C9–C14) 16% · equipamentos 9% · testes e vendas (C15–C19) 11%.

**Fora do orçamento, de propósito:** pró-labore e salários (proibidos), pagamento a membros da equipe (proibido), contingência genérica, gastos anteriores ao Termo de Outorga, eventos próprios e coffee break, anúncios para o cidadão.

---

## EQUIPE: Célia

**Vínculo com o projeto:** Consultor(a) voluntário (ou Sócio, se ela entrar na sociedade)  
**Formação:** Pós-graduação: Mestrado profissional em Saúde da Família, Universidade Estácio de Sá (marcar "concluído" só se o Lattes for atualizado; senão, "cursando")  
**Lattes:** https://lattes.cnpq.br/3422425759379860

### Experiência e competência
*1037/1500 caracteres*

Enfermeira com mais de 18 anos de experiência em assistência, gestão e educação em saúde no SUS, com mestrado profissional em Saúde da Família (UNESA) e especializações em Gestão Pública em Saúde (UNICAMP) e Saúde Pública (Fiocruz). Foi gerente técnica de Clínica da Família no Rio de Janeiro e gestora de unidade básica em Maricá, respondendo por equipes, indicadores, acesso e organização dos processos de trabalho. Hoje coordena a enfermagem do Serviço de Atenção Domiciliar e do Centro de Diagnóstico e Tratamento em Maricá, onde elaborou e implantou protocolos, POPs, fluxos assistenciais e linhas de cuidado. Ministrou capacitações em atenção básica para profissionais de diferentes municípios (Programa Ciclo Saúde), é docente em especialização em Saúde da Família e consultora do CEDAPS. No Direciona.AI, responde pelos fluxos de encaminhamento entre Atenção Primária, UPA e SAMU, pela validação dos protocolos com o médico consultor, pelo desenho dos testes com usuários e pelo treinamento das equipes municipais na implantação.

### Essa equipe é ideal porque
*808/1500 caracteres*

A equipe une quem constrói, quem vende e quem conhece o SUS por dentro. Aisha, desenvolvedora full-stack, criou o protótipo atual (app e bot de WhatsApp com guarda de emergência) e lidera a tecnologia com um segundo desenvolvedor, mantendo o núcleo do produto dentro da empresa. Pamella, economista com experiência em estratégia, dados e processos, conduz o modelo de negócio, os indicadores e a relação com prefeituras. Célia, enfermeira com mais de 18 anos no SUS, foi gerente de Clínica da Família no Rio e de unidade básica em Maricá, implantou protocolos e linhas de cuidado e já capacitou equipes de vários municípios: conhece a rotina das unidades e fala a língua do gestor que compra a solução. Juntas, cobrimos tecnologia, negócio e prática assistencial, com validação médica externa dos protocolos.

---

## RESUMO

### Resumo do negócio
*441/500 caracteres*

O Direciona.AI é uma plataforma que a prefeitura contrata para orientar o cidadão, pelo WhatsApp, app com a marca do município ou voz, sobre onde buscar atendimento no SUS (UBS, UPA ou SAMU 192), reduzindo casos leves nas UPAs. Guarda de emergência e protocolos validados garantem a segurança. A prefeitura assina (SaaS B2G) e recebe painel com dados anonimizados. Com o Centelha, faremos a plataforma replicável, testada com usuários reais.

