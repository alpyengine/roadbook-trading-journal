// ─── ROADBOOK — Modelo de datos de un Trade ───────────────────────────────────
// Versión: 1.0.0

/**
 * Genera un objeto Trade vacío con valores por defecto.
 * @returns {Object} Trade vacío
 */
export function emptyTrade() {
  return {
    // Metadatos
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),

    // Información básica
    activo: "",
    direccion: "",           // COMPRA | VENTA
    tipoOperativa: "",       // SCALPING | INTRADÍA | ACCIONES CON DERIVADOS | ACCIONES CONTADO | LARGO PLAZO
    sesionOperativa: "SIN ESPECIFICAR", // ASIÁTICA | EUROPEA | AMERICANA

    // Análisis técnico
    tfAnalisis: "",          // Temporalidad de análisis
    tfControl: "",           // Temporalidad de control
    tendenciaPrimaria: "",   // ALCISTA | BAJISTA
    tendenciaSecundaria: "", // ALCISTA | BAJISTA
    estrategia: "",          // Ver ESTRATEGIAS en constants

    // Entrada
    fechaEntrada: new Date().toISOString().split("T")[0],
    horaEntrada: new Date().toTimeString().slice(0, 5),
    precioEntrada: "",
    lotes: "",
    objetivo: "",            // Objetivo en pips/puntos
    motivoObjetivo: "",      // Ver MOTIVOS_OBJETIVO en constants

    // Salida
    fechaSalida: "",
    horaSalida: "",
    precioSalida: "",
    resultado: "",           // Resultado en pips/puntos (positivo o negativo)
    motivoSalida: "",        // Ver MOTIVOS_SALIDA en constants

    // Resultado final
    resultadoTrade: "",      // GANADORA | NEUTRAL | PERDEDORA

    // Psicología (escala 1-10)
    psicAntesSeguridad: 5,
    psicMomentoSeguridad: 5,
    psicDuranteControl: 5,
    psicSalidaSatisfaccion: 5,
    emociones: [],           // Array de strings: FOMO, AVARICIA, etc.
    resumenDecision: "",

    // Estado de la operación
    estado: "ABIERTA",       // ABIERTA | CERRADA
  };
}
