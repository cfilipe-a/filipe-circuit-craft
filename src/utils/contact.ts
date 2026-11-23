// Dados de contato centralizados. Valores sensíveis ficam em Base64 e
// só são decodificados no momento do clique (nunca aparecem no HTML).
//
// Para atualizar qualquer valor: no console do navegador rode
//   btoa("novo-valor")
// e cole o resultado na constante correspondente.

// E-mail de contato (Base64).
const EMAIL_B64 = "Y29udGF0b0BjZmlsaXBlLmNvbS5icg==";

// WhatsApp no formato DDI+DDD+número, em Base64.
const WHATSAPP_B64 = "NTUxMTk5MjEzMTcwMQ==";

// Caminho do currículo (Base64).
// COMO ATUALIZAR O PDF:
//  1. Coloque o PDF higienizado em: public/docs/cv-<hash-aleatorio>.pdf
//  2. Gere um hash novo (ex.: no console: crypto.randomUUID().slice(0, 16))
//  3. Rode btoa("/docs/cv-<hash>.pdf") e cole o resultado abaixo.
//  4. Apague o PDF antigo da pasta public/docs/.
const RESUME_PATH_B64 = "L2RvY3MvY3YtN2YzYTljMmU0MWI4ZDYwNS5wZGY=";
const RESUME_FILENAME = "Curriculo-Filipe-Cavalcante.pdf";

const WHATSAPP_MESSAGE = "Olá Filipe, vim pelo seu portfólio e gostaria de conversar.";
const EMAIL_SUBJECT = "Contato via Portfólio";

export const SOCIAL_LINKS = {
  github: "https://github.com/cfilipe-a",
  linkedin: "https://www.linkedin.com/in/filipe-cavalcante-51338b2aa/",
} as const;

export function openEmail() {
  const email = atob(EMAIL_B64);
  window.location.href = `mailto:${email}?subject=${encodeURIComponent(EMAIL_SUBJECT)}`;
}

export function openWhatsApp() {
  const numero = atob(WHATSAPP_B64);
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function downloadResume() {
  const a = document.createElement("a");
  a.href = atob(RESUME_PATH_B64);
  a.download = RESUME_FILENAME;
  a.rel = "noopener noreferrer";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}
