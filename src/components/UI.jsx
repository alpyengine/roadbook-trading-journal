// ─── ROADBOOK — Componentes UI compartidos ────────────────────────────────────
// Versión: 1.0.0

import React from "react";

// ─── SelectField ──────────────────────────────────────────────────────────────
export function SelectField({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{placeholder || "SELECCIONAR..."}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

// ─── Field (label + input wrapper) ───────────────────────────────────────────
export function Field({ label, required, children }) {
  return (
    <div className="field">
      <label>
        {label}
        {required && <span className="req"> *</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Badge genérico ───────────────────────────────────────────────────────────
export function Badge({ value }) {
  if (!value) return <span className="badge badge-gray">—</span>;
  const map = {
    GANADORA:  "badge-green",
    NEUTRAL:   "badge-amber",
    PERDEDORA: "badge-red",
    ABIERTA:   "badge-blue",
    CERRADA:   "badge-gray",
  };
  return <span className={"badge " + (map[value] || "badge-gray")}>{value}</span>;
}

// ─── Badge Dirección (COMPRA/VENTA) ──────────────────────────────────────────
export function DirBadge({ value }) {
  if (!value) return <span className="badge badge-gray">—</span>;
  return (
    <span className={"badge " + (value === "COMPRA" ? "badge-green" : "badge-red")}>
      {value}
    </span>
  );
}

// ─── Equity Curve SVG ─────────────────────────────────────────────────────────
export function EquityCurve({ trades }) {
  const closed = trades.filter(t => t.estado === "CERRADA" && t.resultado);

  if (closed.length < 2) {
    return (
      <div style={{ height: 100, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 13 }}>
        Registra al menos 2 operaciones cerradas para ver la curva
      </div>
    );
  }

  let eq = 0;
  const points = closed.map(t => {
    const v = parseFloat(t.resultado) || 0;
    eq += v;
    return eq;
  });

  const min   = Math.min(...points, 0);
  const max   = Math.max(...points, 1);
  const range = max - min || 1;
  const W = 800, H = 90, P = 6;

  const pts = points.map((v, i) => {
    const x = P + (i / (points.length - 1)) * (W - P * 2);
    const y = H - P - ((v - min) / range) * (H - P * 2);
    return x + "," + y;
  }).join(" ");

  const zY      = H - P - ((0 - min) / range) * (H - P * 2);
  const color   = eq >= 0 ? "#16a34a" : "#dc2626";
  const fillPts = P + "," + H + " " + pts + " " + (W - P) + "," + H;

  return (
    <svg viewBox={"0 0 " + W + " " + H} style={{ width: "100%", height: 100 }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <line x1={P} y1={zY} x2={W - P} y2={zY} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="4,3" />
      <polygon points={fillPts} fill="url(#eqGrad)" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
