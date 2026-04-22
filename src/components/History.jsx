// ─── ROADBOOK — Vista: Historial y Resultados ─────────────────────────────────
// Versión: 1.0.0

import React, { useState } from "react";
import { Badge, DirBadge } from "./UI";
import { calcStats } from "../utils/stats";
import { SESIONES } from "../constants";

export function History({ trades, onEdit, onDelete, onNew }) {
  const [search, setSearch] = useState("");
  const [fDir,   setFDir]   = useState("");
  const [fRes,   setFRes]   = useState("");
  const [fSes,   setFSes]   = useState("");

  const stats = calcStats(trades);

  const filtered = [...trades].reverse().filter(t => {
    if (search && !t.activo.toLowerCase().includes(search.toLowerCase())) return false;
    if (fDir && t.direccion !== fDir) return false;
    if (fRes && t.resultadoTrade !== fRes) return false;
    if (fSes && t.sesionOperativa !== fSes) return false;
    return true;
  });

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
        <div className="stat-card">
          <div className="stat-icon icon-purple" style={{ width: 44, height: 44, fontSize: 18 }}>📊</div>
          <div>
            <div className="stat-label">Estadísticas</div>
            {stats.totalClosed === 0
              ? <div className="stat-sub">Sin datos disponibles</div>
              : <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>
                  {stats.winners}G / {stats.losers}P · {stats.winRate}% WR
                </div>
            }
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><span className="card-title">🔽 Buscar y Filtrar Operaciones</span></div>
        <div className="card-body">
          <div className="filter-row">
            <input
              type="text"
              placeholder="EUR/USD, BTC, AAPL..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
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
          <span className="card-title">Historial de Operaciones</span>
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
                  <th>Activo</th><th>Dir.</th><th>Estrategia</th><th>TF</th>
                  <th>Fecha</th><th>P.Entrada</th><th>P.Salida</th>
                  <th>Resultado</th><th>Estado</th><th>Emociones</th><th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const pip = parseFloat(t.resultado);
                  return (
                    <tr key={t.id}>
                      <td style={{ fontWeight: 700 }}>{t.activo || "—"}</td>
                      <td><DirBadge value={t.direccion} /></td>
                      <td style={{ fontSize: 12, color: "#6b7280" }}>{t.estrategia || "—"}</td>
                      <td style={{ fontSize: 12 }}>{t.tfAnalisis || "—"}</td>
                      <td style={{ fontSize: 12 }}>
                        {t.fechaEntrada || "—"}
                        {t.horaEntrada && <div style={{ color: "#9ca3af", fontSize: 11 }}>{t.horaEntrada}</div>}
                      </td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{t.precioEntrada || "—"}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{t.precioSalida || "—"}</td>
                      <td>
                        {t.resultado
                          ? <span style={{ fontWeight: 700, color: pip >= 0 ? "#16a34a" : "#dc2626", fontFamily: "monospace" }}>
                              {pip >= 0 ? "+" : ""}{pip.toFixed(1)}
                            </span>
                          : "—"
                        }
                        {t.resultadoTrade && <div style={{ marginTop: 3 }}><Badge value={t.resultadoTrade} /></div>}
                      </td>
                      <td><Badge value={t.estado} /></td>
                      <td style={{ fontSize: 11, color: "#6b7280" }}>
                        {t.emociones && t.emociones.length > 0
                          ? t.emociones.slice(0, 2).join(", ") + (t.emociones.length > 2 ? "…" : "")
                          : "—"
                        }
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-sm btn-secondary" onClick={() => onEdit(t)}>✏️</button>
                          <button className="btn btn-sm btn-danger" onClick={() => onDelete(t.id)}>🗑</button>
                        </div>
                      </td>
                    </tr>
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
