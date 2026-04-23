// ─── ROADBOOK — Vista: Dashboard ──────────────────────────────────────────────
// Versión: 1.0.0

import React from "react";
import { EquityCurve, DirBadge, PnLChart } from "./UI";
import { calcStats } from "../utils/stats";

export function Dashboard({ trades, onNew, onHistory }) {
  const stats = calcStats(trades);

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">📊 Panel Principal</div>
          <div className="page-sub">Resumen de tu actividad operativa</div>
        </div>
        <button className="btn btn-primary" onClick={onNew}>+ Nueva Entrada</button>
      </div>

      {/* Acciones rápidas */}
      <div className="action-grid">
        <div className="action-card" onClick={onNew}>
          <div className="action-icon">➕</div>
          <div className="action-title">Nueva Entrada</div>
          <div className="action-desc">Registrar nueva operación de trading</div>
          <span className="action-link">Crear ahora →</span>
        </div>
        <div className="action-card" onClick={onHistory}>
          <div className="action-icon">📈</div>
          <div className="action-title">Mis Resultados</div>
          <div className="action-desc">Análisis y estadísticas personales</div>
          <span className="action-link">Ver mis resultados →</span>
        </div>
        <div className="action-card" onClick={onHistory}>
          <div className="action-icon">👥</div>
          <div className="action-title">Historial Completo</div>
          <div className="action-desc">Explorar todas tus operaciones</div>
          <span className="action-link">Explorar ahora →</span>
        </div>
      </div>

      {/* KPIs */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon icon-blue">📋</div>
          <div>
            <div className="stat-label">Total Entradas</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-sub">{stats.totalOpen} abiertas · {stats.totalClosed} cerradas</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon icon-amber">⏳</div>
          <div>
            <div className="stat-label">Entradas Abiertas</div>
            <div className="stat-value amber">{stats.totalOpen}</div>
            <div className="stat-sub">En seguimiento activo</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon icon-green">✅</div>
          <div>
            <div className="stat-label">Entradas Cerradas</div>
            <div className="stat-value">{stats.totalClosed}</div>
            <div className="stat-sub">Historial completado</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon icon-purple">🎯</div>
          <div>
            <div className="stat-label">Tasa de Acierto</div>
            <div className={"stat-value " + (stats.winRate >= 50 ? "green" : stats.winRate > 0 ? "amber" : "")}>
              {stats.winRate}%
            </div>
            <div className="stat-sub">{stats.winners} Ganadoras / {stats.losers} Perdedoras</div>
          </div>
        </div>
      </div>

      {/* Equity + Por estrategia */}
      <div className="dash-grid">
        <div className="card">
          <div className="card-header">
            <span className="card-title">📈 Equity Curve</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: stats.totalPips >= 0 ? "#16a34a" : "#dc2626" }}>
              {stats.totalPips >= 0 ? "+" : ""}{stats.totalPips.toFixed(1)} pips
            </span>
          </div>
          <div className="card-body">
            <EquityCurve trades={trades.filter(t => t.estado === "CERRADA")} />
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">🗂 Por Estrategia</span>
          </div>
          {Object.keys(stats.byStrategy).length === 0 ? (
            <div className="empty" style={{ padding: "28px 24px" }}>
              <div className="empty-icon">📊</div>
              <div className="empty-text">Sin datos todavía</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Estrategia</th><th>Ops</th><th>Win%</th><th>Pips</th></tr>
                </thead>
                <tbody>
                  {Object.entries(stats.byStrategy).map(([k, v]) => (
                    <tr key={k}>
                      <td style={{ fontSize: 12 }}>{k}</td>
                      <td>{v.total}</td>
                      <td style={{ color: v.wins / v.total >= 0.5 ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                        {Math.round((v.wins / v.total) * 100)}%
                      </td>
                      <td style={{ color: v.pips >= 0 ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
                        {v.pips >= 0 ? "+" : ""}{v.pips.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* P&L Acumulado */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <span className="card-title">💰 P&amp;L Acumulado</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: stats.totalPips >= 0 ? "#16a34a" : "#dc2626" }}>
            {stats.totalPips >= 0 ? "+" : ""}{stats.totalPips.toFixed(1)} pips total
          </span>
        </div>
        <div className="card-body">
          <PnLChart trades={trades} />
        </div>
      </div>

      {/* Entradas abiertas */}
      <div className="card" style={{ marginTop: 16 }}>
        <div className="card-header">
          <span className="card-title">⏳ Entradas Abiertas</span>
          <span style={{ fontSize: 12, color: "#9ca3af" }}>{stats.totalOpen} entradas</span>
        </div>
        {stats.totalOpen === 0 ? (
          <div className="empty">
            <div className="empty-icon">⏳</div>
            <div className="empty-text">No hay entradas abiertas</div>
            <div className="empty-sub">Todas tus entradas están cerradas.</div>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={onNew}>+ Nueva Entrada</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Activo</th><th>Dirección</th><th>Estrategia</th><th>Fecha</th><th>Precio</th><th>Objetivo</th><th>Sesión</th></tr>
              </thead>
              <tbody>
                {trades.filter(t => t.estado === "ABIERTA").map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700 }}>{t.activo || "—"}</td>
                    <td><DirBadge value={t.direccion} /></td>
                    <td style={{ fontSize: 12, color: "#6b7280" }}>{t.estrategia || "—"}</td>
                    <td>{t.fechaEntrada || "—"}</td>
                    <td style={{ fontFamily: "monospace" }}>{t.precioEntrada || "—"}</td>
                    <td>{t.objetivo ? t.objetivo + " pips" : "—"}</td>
                    <td style={{ fontSize: 12 }}>{t.sesionOperativa || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
