// ─── ROADBOOK — Vista: Historial y Resultados ─────────────────────────────────
// Versión: 2.0.0
// Cambios v2: panel expandible inline, columna sesión con bandera,
//             estadística "Mayor Estrategia Ganadora", botón VER/CERRAR

import React, { useState } from "react";
import { Badge } from "./UI";
import { calcStats } from "../utils/stats";
import { SESIONES } from "../constants";

// ─── Emoji de bandera por sesión ──────────────────────────────────────────────
const SESSION_FLAG = {
  "ASIÁTICA":        "🌏",
  "EUROPEA":         "🇪🇺",
  "AMERICANA":       "🇺🇸",
  "SIN ESPECIFICAR": "",
};

// ─── Panel expandible de detalle de un trade ──────────────────────────────────
function TradeDetailPanel({ trade, onEdit }) {
  const pip = parseFloat(trade.resultado);

  const resultStyle = {
    GANADORA:  { bg: "#f0fdf4", border: "#86efac", text: "#15803d" },
    NEUTRAL:   { bg: "#fffbeb", border: "#fde68a", text: "#b45309" },
    PERDEDORA: { bg: "#fef2f2", border: "#fca5a5", text: "#b91c1c" },
  }[trade.resultadoTrade] || { bg: "#f9fafb", border: "#e5e7eb", text: "#6b7280" };

  const resultIcon = { GANADORA: "✅", NEUTRAL: "⚠️", PERDEDORA: "❌" }[trade.resultadoTrade] || "—";

  return (
    <tr>
      <td colSpan={7} style={{ padding: 0, borderBottom: "2px solid #e5e7eb" }}>
        <div className="detail-panel">

          {/* Cabecera resultado */}
          <div className="detail-header" style={{ background: resultStyle.bg, borderBottom: "1px solid " + resultStyle.border }}>
            <span style={{ fontSize: 22 }}>{resultIcon}</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: resultStyle.text, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Operación {trade.resultadoTrade || "Sin Resultado"}
            </span>
          </div>

          {/* Resumen básico */}
          <div className="detail-summary-row">
            {[
              ["Activo",         trade.activo || "—"],
              ["Dirección",      trade.direccion || "—"],
              ["Tipo Operativa", trade.tipoOperativa || "—"],
              ["Sesión",         (SESSION_FLAG[trade.sesionOperativa] || "") + " " + (trade.sesionOperativa || "—")],
              ["Lotes",          trade.lotes || "—"],
            ].map(([label, value]) => (
              <div className="detail-summary-item" key={label}>
                <span className="detail-summary-label">{label}</span>
                <span className="detail-summary-value">{value}</span>
              </div>
            ))}
          </div>

          {/* Bloques Entrada / Salida */}
          <div className="detail-blocks">
            <div className="detail-block detail-block-entry">
              <div className="detail-block-header">🟢 ENTRADA</div>
              <div className="detail-block-body">
                <div className="detail-row"><span>Fecha</span><span>{trade.fechaEntrada || "—"}</span></div>
                <div className="detail-row"><span>Hora</span><span>{trade.horaEntrada || "—"}</span></div>
                <div className="detail-row"><span style={{ color: "#1d4ed8" }}>Precio</span><span style={{ color: "#1d4ed8", fontWeight: 700 }}>{trade.precioEntrada || "—"}</span></div>
              </div>
            </div>

            <div className="detail-block detail-block-exit">
              <div className="detail-block-header">🔴 SALIDA</div>
              <div className="detail-block-body">
                <div className="detail-row"><span>Fecha</span><span>{trade.fechaSalida || "—"}</span></div>
                <div className="detail-row"><span>Hora</span><span>{trade.horaSalida || "—"}</span></div>
                <div className="detail-row"><span style={{ color: "#dc2626" }}>Precio</span><span style={{ color: "#dc2626", fontWeight: 700 }}>{trade.precioSalida || "—"}</span></div>
                <div className="detail-row"><span>Motivo</span><span>{trade.motivoSalida || "—"}</span></div>
              </div>
            </div>
          </div>

          {/* Resultado pips */}
          {trade.resultado && (
            <div className="detail-pips">
              <span className="detail-pips-label">Resultado de la Operación</span>
              <span className="detail-pips-value" style={{ color: pip >= 0 ? "#16a34a" : "#dc2626" }}>
                {pip >= 0 ? "+" : ""}{pip.toFixed(1)}
                <span style={{ fontSize: 13, fontWeight: 500, marginLeft: 6, color: "#6b7280" }}>pips/puntos</span>
              </span>
            </div>
          )}

          {/* Análisis Técnico */}
          <div className="detail-section">
            <div className="detail-section-title">📈 Análisis Técnico</div>
            <div className="detail-tech-grid">
              {[
                ["Temporalidad Análisis", trade.tfAnalisis],
                ["Temporalidad Control",  trade.tfControl],
                ["Tendencia Principal",   trade.tendenciaPrimaria],
                ["Tendencia Secundaria",  trade.tendenciaSecundaria],
                ["Estrategia Utilizada",  trade.estrategia],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div className="detail-tech-item" key={label}>
                  <span className="detail-tech-label">{label}</span>
                  <span className="detail-tech-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Psicología */}
          <div className="detail-section">
            <div className="detail-section-title">🧠 Psicología — Sensaciones</div>
            <div className="detail-psic-grid">
              {[
                ["Antes de entrar", trade.psicAntesSeguridad],
                ["Al entrar",       trade.psicMomentoSeguridad],
                ["Durante",         trade.psicDuranteControl],
                ["Al salir",        trade.psicSalidaSatisfaccion],
              ].map(([label, value]) => (
                <div className="detail-psic-item" key={label}>
                  <span className="detail-psic-label">{label}</span>
                  <span className="detail-psic-value">
                    {value}
                    <span style={{ fontSize: 11, color: "#9ca3af" }}>/10</span>
                  </span>
                </div>
              ))}
            </div>
            {trade.emociones && trade.emociones.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#f59e0b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Emociones experimentadas:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                  {trade.emociones.map(e => (
                    <span key={e} className="detail-emo-tag">{e}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resumen decisión */}
          {trade.resumenDecision && (
            <div className="detail-section">
              <div className="detail-section-title">💡 Resumen de Decisión / Causa del Resultado</div>
              <div className="detail-decision-box">{trade.resumenDecision}</div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="detail-actions">
            <button className="btn btn-primary btn-sm" onClick={() => onEdit(trade)}>✏️ Editar Trade</button>
          </div>

        </div>
      </td>
    </tr>
  );
}

// ─── HISTORY COMPONENT ────────────────────────────────────────────────────────
export function History({ trades, onEdit, onDelete, onNew }) {
  const [search,     setSearch]     = useState("");
  const [fDir,       setFDir]       = useState("");
  const [fRes,       setFRes]       = useState("");
  const [fSes,       setFSes]       = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const stats = calcStats(trades);

  // Mayor estrategia ganadora (por win rate, mínimo 1 trade)
  const topStrategy = Object.entries(stats.byStrategy)
    .filter(([, v]) => v.total > 0)
    .sort((a, b) => (b[1].wins / b[1].total) - (a[1].wins / a[1].total))[0];

  const filtered = [...trades].reverse().filter(t => {
    if (search && !t.activo.toLowerCase().includes(search.toLowerCase())) return false;
    if (fDir && t.direccion !== fDir) return false;
    if (fRes && t.resultadoTrade !== fRes) return false;
    if (fSes && t.sesionOperativa !== fSes) return false;
    return true;
  });

  function toggleExpand(id) {
    setExpandedId(prev => prev === id ? null : id);
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📈 Resultados de Trading</div>
          <div className="page-sub">Análisis completo de tus operaciones</div>
        </div>
      </div>

      {/* Mini KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon icon-blue" style={{ width: 44, height: 44, fontSize: 18 }}>📋</div>
          <div>
            <div className="stat-label">Total Operaciones</div>
            <div className="stat-value" style={{ fontSize: 22 }}>{stats.total}</div>
            <div className="stat-sub">{stats.totalOpen} abiertas · {stats.totalClosed} cerradas</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-amber" style={{ width: 44, height: 44, fontSize: 18 }}>⏳</div>
          <div>
            <div className="stat-label">Operaciones Abiertas</div>
            <div className="stat-value amber" style={{ fontSize: 22 }}>{stats.totalOpen}</div>
            <div className="stat-sub">En seguimiento activo</div>
          </div>
        </div>

        {/* Estadísticas mejoradas */}
        <div className="stat-card">
          <div className="stat-icon icon-purple" style={{ width: 44, height: 44, fontSize: 18 }}>📊</div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="stat-label">Estadísticas</div>
            {!topStrategy ? (
              <div className="stat-sub">Sin datos disponibles</div>
            ) : (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                  Mayor Estrategia Ganadora
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#111827", marginBottom: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {topStrategy[0]}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: "#16a34a" }}>
                    {Math.round((topStrategy[1].wins / topStrategy[1].total) * 100)}%
                  </span>
                  <span style={{ fontSize: 11, color: "#9ca3af" }}>
                    {topStrategy[1].total} trade{topStrategy[1].total !== 1 ? "s" : ""}
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <span className="card-title">🔽 Buscar y Filtrar Operaciones Cerradas</span>
        </div>
        <div className="card-body">
          <div className="filter-row">
            <input type="text" placeholder="EUR/USD, BTC, AAPL..." value={search} onChange={e => setSearch(e.target.value)} />
            <select value={fDir} onChange={e => setFDir(e.target.value)}>
              <option value="">TODAS LAS DIRECCIONES</option>
              <option>COMPRA</option><option>VENTA</option>
            </select>
            <select value={fRes} onChange={e => setFRes(e.target.value)}>
              <option value="">TODOS LOS RESULTADOS</option>
              <option>GANADORA</option><option>NEUTRAL</option><option>PERDEDORA</option>
            </select>
            <select value={fSes} onChange={e => setFSes(e.target.value)}>
              <option value="">TODAS LAS SESIONES</option>
              {SESIONES.filter(s => s !== "SIN ESPECIFICAR").map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="btn btn-primary">🔍 Buscar</button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Historial de Operaciones Cerradas</span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{filtered.length} entradas</span>
        </div>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📋</div>
            <div className="empty-text">No hay operaciones{search || fDir || fRes || fSes ? " que coincidan" : ""}</div>
            <div className="empty-sub">Aún no has registrado ninguna operación.</div>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onNew}>+ Nueva Entrada</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Activo</th>
                  <th>Sesión</th>
                  <th>Dirección</th>
                  <th>Resultado</th>
                  <th>Puntos/Pips</th>
                  <th>Acción</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const pip = parseFloat(t.resultado);
                  const isOpen = expandedId === t.id;
                  return (
                    <React.Fragment key={t.id}>
                      <tr style={{ background: isOpen ? "#eff6ff" : "white" }}>

                        <td style={{ fontSize: 12 }}>
                          {t.fechaEntrada || "—"}
                          {t.horaEntrada && <div style={{ color: "#9ca3af", fontSize: 11 }}>{t.horaEntrada}</div>}
                        </td>

                        <td style={{ fontWeight: 700 }}>{t.activo || "—"}</td>

                        <td style={{ fontSize: 13 }}>
                          {SESSION_FLAG[t.sesionOperativa] || ""}{" "}
                          {t.sesionOperativa && t.sesionOperativa !== "SIN ESPECIFICAR" ? t.sesionOperativa : "—"}
                        </td>

                        <td>
                          {t.direccion === "COMPRA" && (
                            <span style={{ color: "#16a34a", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 3 }}>
                              <span>↑</span> Compra
                            </span>
                          )}
                          {t.direccion === "VENTA" && (
                            <span style={{ color: "#dc2626", fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", gap: 3 }}>
                              <span>↓</span> Venta
                            </span>
                          )}
                          {!t.direccion && "—"}
                        </td>

                        <td>
                          {t.resultadoTrade ? (
                            <span className={"badge " + (
                              t.resultadoTrade === "GANADORA"  ? "badge-green" :
                              t.resultadoTrade === "PERDEDORA" ? "badge-red"   : "badge-amber"
                            )}>
                              {t.resultadoTrade === "GANADORA"  ? "✓ " : ""}
                              {t.resultadoTrade === "PERDEDORA" ? "✗ " : ""}
                              {t.resultadoTrade}
                            </span>
                          ) : <Badge value={t.estado} />}
                        </td>

                        <td style={{ fontWeight: 700, fontFamily: "monospace", color: pip >= 0 ? "#16a34a" : "#dc2626" }}>
                          {t.resultado ? (pip >= 0 ? "+" : "") + pip.toFixed(2) : "—"}
                        </td>

                        <td>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            <button
                              className={isOpen ? "btn btn-sm btn-secondary" : "btn btn-sm btn-primary"}
                              onClick={() => toggleExpand(t.id)}
                            >
                              {isOpen ? "✕ CERRAR" : "● VER"}
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={() => onDelete(t.id)} title="Eliminar">🗑</button>
                          </div>
                        </td>
                      </tr>

                      {isOpen && <TradeDetailPanel trade={t} onEdit={onEdit} />}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
