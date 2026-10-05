# Direciona.Ai — app mobile

App (React Native + Expo) do **Direciona.Ai**: a pessoa conta o que está sentindo e
descobre onde buscar atendimento no SUS (UBS/Clínica da Família, UPA, SAMU 192...).

O app **não tem bot próprio**: o chat usa o mesmo atendimento do bot do WhatsApp, que fica
no repositório [back.direciona](https://github.com/Aishabrito/back.direciona)
(`src/atendimento/atendimento.ts`). Por isso as funcionalidades são as mesmas:

| No WhatsApp | No app |
|---|---|
| Texto | Campo de mensagem → `POST /api/chat` |
| Áudio 🎤 (e resposta em áudio) | Microfone no campo → `POST /api/audio`; botão **Ouvir resposta** |
| 📎 → Localização | Botão 📍 → `POST /api/localizacao` |
| "sim"/"não", bairro e cidade, "onde tem uma UPA?" | Igual (e atalhos **Enviar minha localização** / **Agora não**) |
| `início` e `apagar` | Igual (e atalho **Novo atendimento**) |
| Apresentação da 1ª mensagem | Mostrada ao abrir o chat (`GET /api/boas-vindas`) |

**Sem internet:** o app só reconhece emergências (guarda local, cópia da do back) e manda
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
  audio.ts            ler a gravação e tocar a resposta falada
  offline.ts          resposta sem internet (só emergências)
  guarda_critica.ts   cópia da guarda do back (atualize junto quando mudar lá)
```
