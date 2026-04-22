# 📒 Roadbook — Diario de Trading Personal

**Autor:** Alex Picanyol
**Versión:** 2.0.1
**Estado:** En desarrollo activo
**Repositorio:** https://github.com/alpyengine/roadbook-trading-journal

> Diario de operaciones bursátiles con persistencia local, análisis estadístico y exportación CSV/JSON.
> Diseño inspirado en DeInversorATrader Roadbook.

---

## 📋 Índice

1. [Descripción](#1-descripción)
2. [Características por versión](#2-características-por-versión)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Instalación y uso](#4-instalación-y-uso)
5. [Modelo de datos](#5-modelo-de-datos)
6. [Exportación y análisis](#6-exportación-y-análisis)
7. [Documentación técnica](#7-documentación-técnica)
8. [Roadmap](#8-roadmap)
9. [Licencia](#9-licencia)

---

## 1. Descripción

**Roadbook** es un diario de trading personal construido en React que permite:

- Registrar operaciones con todos sus detalles técnicos, de gestión y psicológicos.
- Consultar estadísticas en tiempo real (win rate, equity curve, resultado por estrategia).
- Ver el detalle completo de cada operación cerrada con un panel expandible inline.
- Exportar todos los datos a CSV o JSON para análisis externos (Excel, Python, R).
- Persistir los datos entre sesiones sin necesidad de backend ni conexión a internet.

Nació como alternativa propia a herramientas SaaS de trading journal, con **control total sobre los datos**.

---

## 2. Características por versión

### ✅ v1.0.0 — Versión inicial (22 Abril 2026)

**Panel Principal (Dashboard)**
- KPIs en tiempo real: total trades, abiertos, cerrados, tasa de acierto.
- Equity curve SVG calculada sobre operaciones cerradas.
- Tabla de rendimiento agrupada por estrategia (ops, win%, pips).
- Tabla de entradas abiertas con seguimiento activo.
- Accesos rápidos: Nueva Entrada, Mis Resultados, Historial.

**Formulario de Trade (Nueva Entrada)**
- **Información Básica:** activo (texto libre), dirección (COMPRA/VENTA), tipo operativa, sesión operativa.
- **Análisis Técnico:** temporalidad análisis, temporalidad control, tendencia primaria, tendencia secundaria, estrategia.
- **Entrada:** fecha, hora, precio, lotes/contratos, objetivo (pips/puntos), motivo del objetivo.
- **Salida:** fecha, hora, precio, resultado (pips/puntos), motivo de salida.
- **Resultado del trade:** selección visual entre GANADORA / NEUTRAL / PERDEDORA.
- **Psicología:** 4 sliders (1-10) para nivel de seguridad antes, en el momento, control durante y satisfacción en salida.
- **Emociones:** selección múltiple (FOMO, Avaricia, Ansiedad, Miedo, Enfado, Bloqueo, Cansancio).
- **Resumen:** textarea libre con contador de palabras.

**Historial de Operaciones**
- Tabla filtrable por activo, dirección, resultado y sesión.
- Edición y eliminación de cada trade.
- KPIs de resumen propios de la vista.

**Exportar Datos**
- Exportación a **CSV** (29 columnas, compatible con Excel / Google Sheets / Python pandas / R).
- Exportación a **JSON** (backup completo tipado).

**Persistencia**
- Almacenamiento automático via `localStorage` del navegador.
- Sin backend, sin conexión a internet requerida.

---

### ✅ v1.0.1 — Documentación técnica (22 Abril 2026)

- Añadido `DevLog-sp.md` — log técnico completo en español.
- Añadido `DevLog-en.md` — log técnico completo en inglés.

---

### ✅ v2.0.0 — Panel expandible y mejoras en historial (23 Abril 2026)

**Historial de Operaciones — tabla renovada**
- Nueva columna **Sesión** con emoji de bandera (🌏 Asiática, 🇪🇺 Europea, 🇺🇸 Americana).
- Columna **Dirección** con flecha ↑ verde (Compra) / ↓ rojo (Venta).
- Botón **VER / CERRAR** que expande el panel de detalle inline.
- Columnas simplificadas: Fecha / Activo / Sesión / Dirección / Resultado / Puntos/Pips / Acción.

**Panel expandible inline (feature principal)**

Al pulsar VER se despliega bajo la fila un panel completo con:
- Cabecera de resultado coloreada (verde / ámbar / rojo según GANADORA / NEUTRAL / PERDEDORA).
- Fila resumen: activo, dirección, tipo operativa, sesión, lotes.
- Bloque **ENTRADA** (cabecera azul): fecha, hora, precio de entrada.
- Bloque **SALIDA** (cabecera rojo): fecha, hora, precio de salida, motivo de cierre.
- Resultado destacado en pips/puntos.
- Sección **Análisis Técnico**: temporalidades, tendencias, estrategia.
- Sección **Psicología**: 4 métricas X/10 + emociones como tags.
- Sección **Resumen de Decisión**: texto en bloque ámbar.
- Botón Editar Trade para acceso directo al formulario.

**Tarjeta Estadísticas mejorada**
- Muestra la **Mayor Estrategia Ganadora** con nombre, win rate y número de trades.
- Antes mostraba solo "Sin datos disponibles".

---

### ✅ v2.0.1 — Actualización de documentación (23 Abril 2026)

- README actualizado con todas las versiones, características y roadmap al día.

---

### 🔜 v3.0.0 — Planificada

- Importación de JSON con merge de datos existentes.
- Cálculo automático de R:R (Risk/Reward ratio).
- Filtro por rango de fechas en historial.
- Gráficos adicionales: win rate por sesión, distribución de emociones.
- Backend opcional: migración de localStorage a Supabase para acceso multi-dispositivo.
- Adjunto de imágenes de gráficos por trade.

---

## 3. Estructura del proyecto

```
roadbook/
│
├── index.html                 ← Punto de entrada HTML (raíz, requerido por Vite)
│
├── src/
│   ├── App.jsx                ← Componente raíz: router entre las 4 vistas
│   ├── main.jsx               ← Punto de entrada React
│   ├── styles.css             ← Estilos globales (paleta, tipografía, panel expandible)
│   │
│   ├── components/
│   │   ├── Dashboard.jsx      ← Vista: Panel principal con KPIs y equity curve
│   │   ├── TradeForm.jsx      ← Vista: Formulario nueva entrada / edición
│   │   ├── History.jsx        ← Vista: Historial con panel expandible (v2)
│   │   ├── ExportView.jsx     ← Vista: Exportación CSV y JSON
│   │   └── UI.jsx             ← Componentes compartidos: Badge, Field, EquityCurve
│   │
│   ├── hooks/
│   │   └── useTrades.js       ← Hook: estado centralizado y persistencia
│   │
│   ├── utils/
│   │   ├── tradeModel.js      ← Factoría: objeto Trade vacío con valores por defecto
│   │   ├── storage.js         ← localStorage: loadTrades / saveTrades / exportCSV / exportJSON
│   │   └── stats.js           ← Métricas: winRate, equityCurve, byStrategy, bySession
│   │
│   └── constants/
│       └── index.js           ← Listas de opciones: timeframes, estrategias, emociones...
│
├── public/                    ← Recursos estáticos
│
├── data/                      ← ⚠️ LOCAL ONLY — no se sube a GitHub
│   └── README.md              ← Instrucciones para backups y análisis Python
│
├── DevLog-sp.md               ← Log técnico completo en español
├── DevLog-en.md               ← Log técnico completo en inglés
├── .gitignore                 ← Excluye: node_modules/, dist/, data/, .env
├── package.json               ← Dependencias y scripts npm
├── vite.config.js             ← Vite: puerto 3000
└── README.md                  ← Este archivo
```

---

## 4. Instalación y uso

### Prerrequisitos
- Node.js ≥ 18.x
- npm ≥ 9.x

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/alpyengine/roadbook-trading-journal.git
cd roadbook-trading-journal

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
# → Abre http://localhost:3000

# 4. Alias recomendado (añadir a ~/.zshrc)
alias roadbook="cd /ruta/al/proyecto && npm run dev"
```

### Persistencia de datos

Los datos se guardan automáticamente en el `localStorage` del navegador.
Para hacer backups, usa la vista **Exportar** y guarda los ficheros CSV o JSON
en la carpeta `data/` del proyecto (excluida de Git).

---

## 5. Modelo de datos

Cada trade es un objeto JavaScript con 29 campos:

```js
{
  // Metadatos
  id:           string,   // Timestamp como ID único
  createdAt:    string,   // ISO 8601

  // Información básica
  activo:           string,  // "EUR/USD", "AAPL", etc.
  direccion:        string,  // "COMPRA" | "VENTA"
  tipoOperativa:    string,  // "SCALPING" | "INTRADÍA" | "ACCIONES CON DERIVADOS" | ...
  sesionOperativa:  string,  // "ASIÁTICA" | "EUROPEA" | "AMERICANA" | "SIN ESPECIFICAR"

  // Análisis técnico
  tfAnalisis:          string,  // "TRIMESTRAL" | "MENSUAL" | "DIARIO" | "H4" | "H1" | ...
  tfControl:           string,
  tendenciaPrimaria:   string,  // "ALCISTA" | "BAJISTA"
  tendenciaSecundaria: string,
  estrategia:          string,  // "VALIDACIÓN ESTRUCTURAL" | "QUIEBRE + PULLBACK" | ...

  // Entrada
  fechaEntrada:   string,  // "YYYY-MM-DD"
  horaEntrada:    string,  // "HH:MM"
  precioEntrada:  string,
  lotes:          string,
  objetivo:       string,  // en pips/puntos
  motivoObjetivo: string,  // "PROYECCIÓN" | "COTA HISTÓRICA" | "ZONA S/R" | ...

  // Salida
  fechaSalida:   string,
  horaSalida:    string,
  precioSalida:  string,
  resultado:     string,   // pips positivos o negativos
  motivoSalida:  string,   // "TP ALCANZADO" | "STOP LOSS" | "SISTEMA" | ...

  // Resultado
  resultadoTrade: string,  // "GANADORA" | "NEUTRAL" | "PERDEDORA"
  estado:         string,  // "ABIERTA" | "CERRADA"

  // Psicología (escala 1-10)
  psicAntesSeguridad:     number,
  psicMomentoSeguridad:   number,
  psicDuranteControl:     number,
  psicSalidaSatisfaccion: number,
  emociones:              string[],  // ["FOMO", "ANSIEDAD", ...]
  resumenDecision:        string,
}
```

---

## 6. Exportación y análisis

### CSV — 29 columnas

Compatible con Excel, Google Sheets, Python (pandas) y R.

```python
import pandas as pd

df = pd.read_csv("data/roadbook_2026-04-23.csv")

# Win rate global
cerradas = df[df['estado'] == 'CERRADA']
win_rate = (cerradas['resultadoTrade'] == 'GANADORA').mean() * 100
print(f"Win Rate: {win_rate:.1f}%")

# Resultado medio por estrategia
print(cerradas.groupby('estrategia')['resultado'].agg(['mean', 'sum', 'count']))

# Impacto del FOMO en el resultado
df['tuvo_fomo'] = df['emociones'].str.contains('FOMO', na=False)
print(df.groupby('tuvo_fomo')[['resultado', 'psicAntesSeguridad']].mean())

# Win rate por sesión operativa
print(cerradas.groupby('sesionOperativa')['resultadoTrade']
      .apply(lambda x: (x == 'GANADORA').mean() * 100).round(1))
```

### JSON — Backup completo

```bash
# Exportar desde la vista "Exportar" de la app
# Guardar en la carpeta data/ del proyecto (no se sube a GitHub)
```

---

## 7. Documentación técnica

Este proyecto incluye un log técnico detallado:

- `DevLog-sp.md` — Log técnico completo en español
- `DevLog-en.md` — Log técnico completo en inglés

Contenido: setup desde cero, decisiones de arquitectura con justificación,
errores encontrados y soluciones, configuración Git multi-usuario en Mac,
convención de versiones MAJOR.MINOR.PATCH y flujo de trabajo diario.

---

## 8. Roadmap

| Versión | Estado | Descripción |
|---------|--------|-------------|
| v1.0.0 | ✅ Completa | CRUD completo, Dashboard, Equity Curve, Exportación CSV/JSON |
| v1.0.1 | ✅ Completa | Documentación técnica DevLog (ES + EN) |
| v2.0.0 | ✅ Completa | Panel expandible inline, sesión con bandera, Mayor Estrategia Ganadora |
| v2.0.1 | ✅ Completa | README actualizado con todas las versiones |
| v3.0.0 | 🔜 Planificada | Importación JSON, R:R automático, filtro fechas, Supabase |

---

## 9. Licencia

Uso personal. No redistribuir sin autorización.

---

*Construido con React 18 + Vite 5 · Diseño basado en DeInversorATrader Roadbook*
