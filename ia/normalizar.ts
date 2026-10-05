// Usado pela guarda de emergência (cópia de back.direciona/src/ia/normalizar.ts):
// tira acentos e pontuação para as regras compararem o texto do jeito que a pessoa escreve.
export function normalizarTexto(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
