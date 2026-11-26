const EMAIL_B64 = "Y29udGF0b0BjZmlsaXBlLmNvbS5icg==";
const WHATSAPP_B64 = "NTUxMTk5MjEzMTcwMQ==";
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

export async function copyEmail(): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(atob(EMAIL_B64));
    return true;
  } catch {
    return false;
  }
}
