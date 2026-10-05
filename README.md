# Direciona.Ai — app mobile

App (React Native + Expo) do **Direciona.Ai**: a pessoa conta o que está sentindo e
descobre onde buscar atendimento no SUS (UBS/Clínica da Família, UPA, SAMU 192...).

O app **não tem bot próprio**: o chat conversa com o mesmo bot do WhatsApp, que fica no
repositório [back.direciona](https://github.com/Aishabrito/back.direciona).

```
App  ──POST /api/chat──────►  back.direciona  (guarda de emergência → IA → validação)
     ──POST /api/unidades──►  (mesma busca de unidades próximas do WhatsApp)
```

## Como funciona o chat

- A orientação aparece na conversa, como no WhatsApp.
- Quando faz sentido, o bot oferece **"Quer saber a UPA mais próxima?"**. A pessoa toca em
  **Enviar minha localização** (ou no botão 📍) ou escreve o **bairro e cidade**, e a lista
  de unidades, com distância e rota no mapa, chega como mensagem.
- **Sem internet:** o app só reconhece emergências (guarda local, cópia do back) e manda
  ligar 192; nos outros casos, pede para tentar de novo.

> ⚠️ O Direciona.Ai não faz diagnóstico nem indica remédio. Em emergência, ligue **192**.

## Rodando

```bash
npm install
npx expo start -c
```

Por padrão o app usa o servidor do back hospedado na Suga (`ia/remoto.ts`). Para apontar
para outro servidor, crie um `.env` a partir do `.env.example`.

## Estrutura

```
app/
  index.tsx           abertura
  login.tsx           login/cadastro (ainda só visual, sem servidor de contas)
  boas-vindas.tsx     apresentação em 3 passos
  chat.tsx            conversa com o bot + localização + unidades
components/           Logo, FundoBinario (fundo dos posts), ilustrações
constants/tema.ts     cores e fontes da identidade visual
ia/
  remoto.ts           chamadas à API do back.direciona
  offline.ts          resposta sem internet (só emergências)
  guarda_critica.ts   cópia da guarda do back (atualize junto quando mudar lá)
```
