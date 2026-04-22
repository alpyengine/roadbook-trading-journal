// ─── ROADBOOK — Utilidades de persistencia ────────────────────────────────────
// Versión: 1.0.0
//
// Usa localStorage del navegador para persistir datos entre sesiones.
// Los datos se guardan en el navegador del PC donde corres la app.
// Para migrar a base de datos real (Supabase, etc.) en v2, solo hay
// que reemplazar las funciones loadTrades() y saveTrades() aquí.

import { STORAGE_KEY } from "../constants";

/**
 * Carga todos los trades desde localStorage.
 * @returns {Promise<Array>} Array de trades
 */
export async function loadTrades() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Error cargando trades:", error);
    return [];
  }
}

/**
 * Guarda el array completo de trades en localStorage.
 * @param {Array} trades - Array de trades a guardar
 * @returns {Promise<void>}
 */
export async function saveTrades(trades) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trades));
  } catch (error) {
    console.error("Error guardando trades:", error);
  }
}

/**
 * Exporta los trades a un archivo CSV y lo descarga.
 * @param {Array} trades - Array de trades a exportar
 */
export function exportToCSV(trades) {
  const headers = [
    "id", "fechaEntrada", "horaEntrada", "activo", "direccion",
    "tipoOperativa", "sesionOperativa", "tfAnalisis", "tfControl",
    "tendenciaPrimaria", "tendenciaSecundaria", "estrategia",
    "precioEntrada", "lotes", "objetivo", "motivoObjetivo",
    "fechaSalida", "horaSalida", "precioSalida", "resultado", "motivoSalida",
    "resultadoTrade", "estado",
    "psicAntesSeguridad", "psicMomentoSeguridad", "psicDuranteControl", "psicSalidaSatisfaccion",
    "emociones", "resumenDecision",
  ];

  const rows = trades.map(t =>
    headers.map(h => {
      const v = t[h];
      if (Array.isArray(v)) return '"' + v.join(";") + '"';
      if (typeof v === "string" && (v.includes(",") || v.includes("\n"))) return '"' + v + '"';
      return v != null ? v : "";
    }).join(",")
  );

  const content = headers.join(",") + "\n" + rows.join("\n");
  downloadFile(content, "roadbook_" + today() + ".csv", "text/csv;charset=utf-8;");
}

/**
 * Exporta los trades a un archivo JSON y lo descarga.
 * @param {Array} trades - Array de trades a exportar
 */
export function exportToJSON(trades) {
  const content = JSON.stringify(trades, null, 2);
  downloadFile(content, "roadbook_" + today() + ".json", "application/json");
}

// ─── Helpers internos ─────────────────────────────────────────────────────────

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function today() {
  return new Date().toISOString().split("T")[0];
}
