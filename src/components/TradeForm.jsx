// ─── ROADBOOK — Vista: Formulario de Trade ────────────────────────────────────
// Versión: 1.0.0

import React, { useState } from "react";
import { SelectField, Field } from "./UI";
import { emptyTrade } from "../utils/tradeModel";
import {
  TIMEFRAMES, TENDENCIAS, ESTRATEGIAS,
  MOTIVOS_OBJETIVO, MOTIVOS_SALIDA,
  EMOCIONES, TIPOS_OPERATIVA, SESIONES,
} from "../constants";

export function TradeForm({ initial, onSave, onCancel }) {
  const [trade, setTrade] = useState(initial || emptyTrade());

  function set(key, value) {
    setTrade(prev => ({ ...prev, [key]: value }));
  }

  function toggleEmocion(emo) {
    setTrade(prev => ({
      ...prev,
      emociones: prev.emociones.includes(emo)
        ? prev.emociones.filter(e => e !== emo)
        : [...prev.emociones, emo],
    }));
  }

  function handleSave() {
    const saved = {
      ...trade,
      estado: (trade.resultadoTrade || trade.fechaSalida) ? "CERRADA" : "ABIERTA",
    };
    onSave(saved);
  }

  const wordCount = trade.resumenDecision.split(/\s+/).filter(Boolean).length;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{initial ? "✏️ Editar Operación" : "📝 Nueva Entrada de Trading"}</div>
          <div className="page-sub">Registra todos los detalles de tu operación</div>
        </div>
        <button className="btn btn-secondary" onClick={onCancel}>← Panel Principal</button>
      </div>

      {/* ── INFORMACIÓN BÁSICA ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><span className="card-title">Información Básica</span></div>
        <div className="card-body">
          <div className="form-grid g4">
            <Field label="Activo" required>
              <input
                type="text"
                value={trade.activo}
                onChange={e => set("activo", e.target.value.toUpperCase())}
                placeholder="USD, EUR/USD, AAPL..."
              />
            </Field>
            <Field label="Dirección" required>
              <SelectField value={trade.direccion} onChange={v => set("direccion", v)} options={["COMPRA", "VENTA"]} />
            </Field>
            <Field label="Tipo Operativa" required>
              <SelectField value={trade.tipoOperativa} onChange={v => set("tipoOperativa", v)} options={TIPOS_OPERATIVA} />
            </Field>
            <Field label="Sesión Operativa">
              <SelectField value={trade.sesionOperativa} onChange={v => set("sesionOperativa", v)} options={SESIONES} placeholder="SIN ESPECIFICAR" />
            </Field>
          </div>
        </div>
      </div>

      {/* ── ANÁLISIS TÉCNICO ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><span className="card-title">Análisis Técnico</span></div>
        <div className="card-body">
          <div className="form-grid g3">
            <Field label="Temporalidad Análisis" required>
              <SelectField value={trade.tfAnalisis} onChange={v => set("tfAnalisis", v)} options={TIMEFRAMES} />
            </Field>
            <Field label="Temporalidad Control" required>
              <SelectField value={trade.tfControl} onChange={v => set("tfControl", v)} options={TIMEFRAMES} />
            </Field>
            <Field label="Tendencia Primaria" required>
              <SelectField value={trade.tendenciaPrimaria} onChange={v => set("tendenciaPrimaria", v)} options={TENDENCIAS} />
            </Field>
            <Field label="Tendencia Secundaria" required>
              <SelectField value={trade.tendenciaSecundaria} onChange={v => set("tendenciaSecundaria", v)} options={TENDENCIAS} />
            </Field>
            <Field label="Estrategia" required>
              <SelectField value={trade.estrategia} onChange={v => set("estrategia", v)} options={ESTRATEGIAS} />
            </Field>
          </div>
        </div>
      </div>

      {/* ── ENTRADA ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><span className="card-title">Entrada de la Operación</span></div>
        <div className="card-body">
          <div className="form-grid g3">
            <Field label="Fecha" required>
              <input type="date" value={trade.fechaEntrada} onChange={e => set("fechaEntrada", e.target.value)} />
            </Field>
            <Field label="Hora" required>
              <input type="time" value={trade.horaEntrada} onChange={e => set("horaEntrada", e.target.value)} />
            </Field>
            <Field label="Precio" required>
              <input type="number" step="0.00001" value={trade.precioEntrada} onChange={e => set("precioEntrada", e.target.value)} placeholder="0.00000" />
            </Field>
            <Field label="Lotes / Contratos" required>
              <input type="number" step="0.01" value={trade.lotes} onChange={e => set("lotes", e.target.value)} placeholder="0.01" />
            </Field>
            <Field label="Objetivo (pips/puntos)">
              <input type="number" value={trade.objetivo} onChange={e => set("objetivo", e.target.value)} placeholder="Ej: 50" />
            </Field>
            <Field label="Motivo del Objetivo">
              <SelectField value={trade.motivoObjetivo} onChange={v => set("motivoObjetivo", v)} options={MOTIVOS_OBJETIVO} />
            </Field>
          </div>
        </div>
      </div>

      {/* ── SALIDA ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><span className="card-title">Salida de la Operación</span></div>
        <div className="card-body">
          <div className="form-grid g3">
            <Field label="Fecha">
              <input type="date" value={trade.fechaSalida} onChange={e => set("fechaSalida", e.target.value)} />
            </Field>
            <Field label="Hora">
              <input type="time" value={trade.horaSalida} onChange={e => set("horaSalida", e.target.value)} />
            </Field>
            <Field label="Precio">
              <input type="number" step="0.00001" value={trade.precioSalida} onChange={e => set("precioSalida", e.target.value)} placeholder="0.00000" />
            </Field>
            <Field label="Resultado (pips/puntos)">
              <input type="number" value={trade.resultado} onChange={e => set("resultado", e.target.value)} placeholder="+50 o -30" />
            </Field>
            <Field label="Motivo de Salida">
              <SelectField value={trade.motivoSalida} onChange={v => set("motivoSalida", v)} options={MOTIVOS_SALIDA} />
            </Field>
          </div>
        </div>
      </div>

      {/* ── RESULTADO ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><span className="card-title">Resultado del Trade</span></div>
        <div className="card-body">
          <div className="alert-warning">
            ⚠️ Solo selecciona el resultado cuando hayas cerrado completamente el trade.
          </div>
          <div className="result-grid">
            {[["GANADORA", "G", "✅"], ["NEUTRAL", "N", "⚠️"], ["PERDEDORA", "P", "❌"]].map(([r, cls, icon]) => (
              <button
                key={r}
                className={"result-btn " + (trade.resultadoTrade === r ? "sel-" + cls : "")}
                onClick={() => set("resultadoTrade", trade.resultadoTrade === r ? "" : r)}
              >
                <span className="result-icon">{icon}</span>
                <span className="result-label">{r}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── PSICOLOGÍA ── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header"><span className="card-title">Psicología del Trading — Sensaciones</span></div>
        <div className="card-body">
          <div className="slider-grid">
            {[
              ["psicAntesSeguridad",    "Antes de entrar — Nivel de Seguridad (1-10)",    "Inseguro",    "Muy seguro"],
              ["psicMomentoSeguridad",  "Momento de entrada — Nivel de Seguridad (1-10)", "Dudoso",      "Convencido"],
              ["psicDuranteControl",    "Durante el trade — Sensación de Control (1-10)", "Sin control", "Total control"],
              ["psicSalidaSatisfaccion","En la salida — Seguridad (1-10)",                "Inseguro",    "Satisfecho"],
            ].map(([key, label, lo, hi]) => (
              <div className="slider-field" key={key}>
                <div className="slider-top">
                  <span className="slider-label">{label}</span>
                  <span className="slider-val">{trade[key]}</span>
                </div>
                <input
                  type="range" min="1" max="10"
                  value={trade[key]}
                  onChange={e => set(key, parseInt(e.target.value))}
                />
                <div className="slider-hints">
                  <span>1 ({lo})</span>
                  <span>10 ({hi})</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
              Emociones Experimentadas
            </div>
            <div className="emo-grid">
              {EMOCIONES.map(e => (
                <button
                  key={e}
                  className={"emo-btn " + (trade.emociones.includes(e) ? "active" : "")}
                  onClick={() => toggleEmocion(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              Resumen de Decisión / Causa del Resultado
            </div>
            <textarea
              value={trade.resumenDecision}
              onChange={e => set("resumenDecision", e.target.value)}
              placeholder="Ej: Seguí la estrategia y funcionó. Faltó validación por impulso..."
            />
            <div className="word-count">{wordCount} / 10 palabras mínimas</div>
          </div>
        </div>
      </div>

      <div className="btn-row">
        <button className="btn btn-secondary" onClick={onCancel}>← Volver al Panel</button>
        <button className="btn btn-primary" onClick={handleSave}>💾 Guardar Trade</button>
      </div>
    </div>
  );
}
