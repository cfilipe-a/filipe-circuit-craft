// Edite este arquivo para documentar seus projetos.
// Para criar um novo projeto: copie o objeto de exemplo, troque o "slug" e o conteúdo.
// A página fica disponível em /projetos/<slug>.
import imgEsp32 from "@/assets/proj-esp32.jpg";
import imgBench from "@/assets/proj-bench.jpg";
import imgStm32 from "@/assets/proj-stm32.jpg";
import imgIot from "@/assets/proj-iot.jpg";

export type ProjectDoc = {
  slug: string;
  category: string;
  title: string;
  subtitle: string;
  cover: string;
  meta: { label: string; value: string }[];
  stack: string[];
  overview: { heading: string; text: string }[];
  gallery: { src: string; caption: string }[];
  code?: { language: string; filename: string; content: string };
  youtubeId?: string;
  results: string[];
};

export const projectDocs: ProjectDoc[] = [
  {
    slug: "exemplo",
    category: "Hardware & Firmware",
    title: "Módulo de aquisição com ESP32",
    subtitle: "Leitura de sensores analógicos, filtragem em firmware e envio de telemetria via MQTT.",
    cover: imgEsp32,
    meta: [
      { label: "Data", value: "2026" },
      { label: "MCU", value: "ESP32-WROOM" },
      { label: "Ferramentas", value: "KiCad · PlatformIO" },
      { label: "Status", value: "Em validação" },
    ],
    stack: ["C/C++", "FreeRTOS", "MQTT", "KiCad", "Osciloscópio"],
    overview: [
      { heading: "Contexto & problema", text: "Descreva aqui o problema real encontrado em bancada ou em campo, o impacto e as restrições do projeto." },
      { heading: "Solução adotada", text: "Explique a arquitetura escolhida: hardware, firmware, comunicação e como cada parte resolve o problema." },
      { heading: "Arquitetura", text: "Detalhe os blocos do sistema (alimentação, condicionamento de sinal, MCU, comunicação) e decisões de projeto." },
    ],
    gallery: [
      { src: imgBench, caption: "Montagem em bancada e medições iniciais" },
      { src: imgStm32, caption: "Placa de controle — vista superior" },
      { src: imgIot, caption: "Dashboard de telemetria" },
    ],
    code: {
      language: "C++",
      filename: "main.cpp — Firmware principal",
      content: `#include <Arduino.h>

constexpr int SENSOR_PIN = 34;
float filtro = 0.0f;

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
}

void loop() {
  int leitura = analogRead(SENSOR_PIN);
  filtro = 0.9f * filtro + 0.1f * leitura; // filtro passa-baixa
  Serial.printf("raw=%d filtrado=%.1f\\n", leitura, filtro);
  delay(100);
}`,
    },
    youtubeId: "dQw4w9WgXcQ",
    results: [
      "Resultado mensurável 1 (ex.: redução de ruído em 40%)",
      "Resultado mensurável 2 (ex.: tempo de diagnóstico reduzido)",
      "Aprendizado ou próximo passo do projeto",
    ],
  },
];

export const getProjectDoc = (slug: string) => projectDocs.find((p) => p.slug === slug);
