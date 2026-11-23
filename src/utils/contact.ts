// Dados de contato centralizados. E-mail e WhatsApp ficam em Base64 e
// só são decodificados no momento do clique (nunca aparecem no HTML).

// contato@cfilipe.com.br
const EMAIL_B64 = "Y29udGF0b0BjZmlsaXBlLmNvbS5icg==";

// WhatsApp em Base64 no formato DDI+DDD+número (ex.: 5511999999999).
// Para trocar: btoa("55DDDNUMERO") no console do navegador e cole aqui.
const WHATSAPP_B64 = "NTUxMTk5MjEzMTcwMQ==";

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
