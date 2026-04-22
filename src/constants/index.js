// ─── ROADBOOK — Constantes globales ───────────────────────────────────────────
// Versión: 1.0.0

export const TIMEFRAMES = [
  "TRIMESTRAL", "MENSUAL", "SEMANAL", "DIARIO",
  "H4", "H1", "M15", "M12", "M3", "S144",
];

export const TENDENCIAS = ["ALCISTA", "BAJISTA"];

export const ESTRATEGIAS = [
  "VALIDACIÓN ESTRUCTURAL",
  "QUIEBRE + PULLBACK",
  "QUIEBRE + CONFIRMACIÓN",
  "REBOTE ZC + VALIDACIÓN",
  "REENGANCHE TENDENCIA",
  "OTRA...",
];

export const MOTIVOS_OBJETIVO = [
  "PROYECCIÓN",
  "COTA HISTÓRICA",
  "MURO TEMP MAYOR",
  "ZONA S/R",
  "OTRO...",
];

export const MOTIVOS_SALIDA = [
  "TP ALCANZADO",
  "STOP LOSS",
  "MANUAL (OBJETIVO)",
  "MANUAL (PATRÓN)",
  "SISTEMA",
  "PROYECCIÓN FIBO",
  "OTRO...",
];

export const EMOCIONES = [
  "FOMO", "AVARICIA", "ANSIEDAD", "MIEDO", "ENFADO", "BLOQUEO", "CANSANCIO",
];

export const TIPOS_OPERATIVA = [
  "SCALPING",
  "INTRADÍA",
  "ACCIONES CON DERIVADOS",
  "ACCIONES CONTADO",
  "LARGO PLAZO",
];

export const SESIONES = [
  "SIN ESPECIFICAR",
  "ASIÁTICA",
  "EUROPEA",
  "AMERICANA",
];

export const STORAGE_KEY = "roadbook_v1";
