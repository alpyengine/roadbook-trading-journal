// ─── ROADBOOK — Vista: Exportar Datos ────────────────────────────────────────
// Versión: 1.0.0

import React from "react";
import { exportToCSV, exportToJSON } from "../utils/storage";

export function ExportView({ trades }) {
  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">💾 Exportar Datos</div>
          <div className="page-sub">{trades.length} operaciones guardadas · Tus datos son tuyos</div>
        </div>
      </div>

      <div className="export-grid">
        <div className="export-card">
          <div className="export-title">📊 Exportar CSV</div>
          <div className="export-desc">
            Compatible con Excel, Google Sheets, Python (pandas) y R.
            29 columnas incluyendo psicología y emociones.
          </div>
          <button className="btn btn-primary" onClick={() => exportToCSV(trades)} disabled={trades.length === 0}>
            ⬇ Descargar CSV
          </button>
        </div>

        <div className="export-card">
          <div className="export-title">🗂 Exportar JSON</div>
          <div className="export-desc">
            Backup completo con todos los tipos de datos preservados.
            Ideal para restaurar en otra sesión o analizar con código.
          </div>
          <button className="btn btn-primary" onClick={() => exportToJSON(trades)} disabled={trades.length === 0}>
            ⬇ Descargar JSON
          </button>
        </div>

        <div className="export-card">
          <div className="export-title">📋 Campos exportados (29 columnas)</div>
          <div style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.9 }}>
            <strong>Básicos:</strong> activo, dirección, tipo operativa, sesión<br />
            <strong>Técnico:</strong> temporalidades, tendencias, estrategia<br />
            <strong>Operación:</strong> precios entrada/salida, lotes, resultado<br />
            <strong>Psicología:</strong> 4 métricas numéricas (1-10)<br />
            <strong>Emociones:</strong> lista separada por punto y coma<br />
            <strong>Notas:</strong> resumen de decisión (texto libre)
          </div>
        </div>

        <div className="export-card">
          <div className="export-title">ℹ️ Sobre la persistencia</div>
          <div className="export-desc">
            Las operaciones se guardan automáticamente al guardar cada trade.
            Exporta periódicamente para hacer backups externos y análisis estadísticos.
          </div>
          <div style={{ fontSize: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, padding: "10px 14px", color: "#166534" }}>
            ✅ {trades.length} operaciones guardadas correctamente
          </div>
        </div>
      </div>
    </div>
  );
}
