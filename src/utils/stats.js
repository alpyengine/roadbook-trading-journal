// ─── ROADBOOK — Cálculo de estadísticas ───────────────────────────────────────
// Versión: 1.0.0

/**
 * Calcula todas las estadísticas del diario a partir del array de trades.
 * @param {Array} trades - Array completo de trades
 * @returns {Object} Objeto con todas las métricas calculadas
 */
export function calcStats(trades) {
  const closed  = trades.filter(t => t.estado === "CERRADA");
  const open    = trades.filter(t => t.estado === "ABIERTA");
  const winners = closed.filter(t => t.resultadoTrade === "GANADORA");
  const losers  = closed.filter(t => t.resultadoTrade === "PERDEDORA");

  const totalPips  = closed.reduce((s, t) => s + (parseFloat(t.resultado) || 0), 0);
  const avgWinPips = winners.length
    ? winners.reduce((s, t) => s + (parseFloat(t.resultado) || 0), 0) / winners.length
    : 0;
  const avgLossPips = losers.length
    ? losers.reduce((s, t) => s + (parseFloat(t.resultado) || 0), 0) / losers.length
    : 0;

  const winRate = closed.length ? (winners.length / closed.length) * 100 : 0;

  // Equity curve (acumulado de pips por operación cerrada)
  let eq = 0;
  const equityCurve = closed.map(t => {
    eq += parseFloat(t.resultado) || 0;
    return eq;
  });

  // Agrupación por estrategia
  const byStrategy = {};
  closed.forEach(t => {
    if (!t.estrategia) return;
    if (!byStrategy[t.estrategia]) byStrategy[t.estrategia] = { total: 0, wins: 0, pips: 0 };
    byStrategy[t.estrategia].total++;
    if (t.resultadoTrade === "GANADORA") byStrategy[t.estrategia].wins++;
    byStrategy[t.estrategia].pips += parseFloat(t.resultado) || 0;
  });

  // Agrupación por sesión
  const bySession = {};
  closed.forEach(t => {
    const s = t.sesionOperativa || "SIN ESPECIFICAR";
    if (!bySession[s]) bySession[s] = { total: 0, wins: 0, pips: 0 };
    bySession[s].total++;
    if (t.resultadoTrade === "GANADORA") bySession[s].wins++;
    bySession[s].pips += parseFloat(t.resultado) || 0;
  });

  return {
    total:       trades.length,
    totalClosed: closed.length,
    totalOpen:   open.length,
    winners:     winners.length,
    losers:      losers.length,
    winRate:     Math.round(winRate),
    totalPips,
    avgWinPips,
    avgLossPips,
    profitFactor: avgLossPips !== 0 ? Math.abs(avgWinPips / avgLossPips) : 0,
    equityCurve,
    byStrategy,
    bySession,
  };
}
