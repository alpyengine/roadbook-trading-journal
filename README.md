# 📒 Roadbook — Diario de Trading Personal

> Diario de operaciones bursátiles con persistencia local, análisis estadístico y exportación CSV/JSON.  
> Diseño inspirado en DeInversorATrader Roadbook.

---

## 📋 Índice

- [Descripción](#descripción)
- [Características por versión](#características-por-versión)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y uso](#instalación-y-uso)
- [Modelo de datos](#modelo-de-datos)
- [Exportación y análisis](#exportación-y-análisis)
- [Roadmap](#roadmap)

---

## Descripción

**Roadbook** es un diario de trading personal construido en React que permite:

- Registrar operaciones con todos sus detalles técnicos, de gestión y psicológicos.
- Consultar estadísticas en tiempo real (win rate, equity curve, resultado por estrategia).
- Exportar todos los datos a CSV o JSON para análisis externos (Excel, Python, R).
- Persistir los datos entre sesiones sin necesidad de backend.

Nació como alternativa propia a herramientas SaaS de trading journal, con **control total sobre los datos**.

---

## Características por versión

### ✅ v1.0.0 — Versión inicial (Abril 2026)

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
- Almacenamiento automático via `window.storage` (API de Claude Artifacts).
- En despliegue standalone: sustituir por `localStorage` o API.

---

### 🔜 v2.0.0 — Planificada

> Las siguientes funcionalidades están previstas para versiones futuras.

- [ ] Importación de JSON (merge con datos existentes).
- [ ] Gráficos adicionales: win rate por sesión, distribución de emociones, heatmap día de semana.
- [ ] Cálculo automático de R:R (Risk/Reward ratio).
- [ ] Filtro por rango de fechas en historial.
- [ ] Modo oscuro.
- [ ] Backend opcional: sustitución de `window.storage` por Supabase o API REST.
- [ ] Adjunto de imágenes de gráficos por trade.

---

## Estructura del proyecto

```
roadbook-v1/
│
├── src/
│   ├── components/
│   │   ├── Dashboard.jsx      # Vista: Panel principal con KPIs y equity curve
│   │   ├── TradeForm.jsx      # Vista: Formulario nueva entrada / edición
│   │   ├── History.jsx        # Vista: Historial y resultados filtrable
│   │   ├── ExportView.jsx     # Vista: Exportación CSV y JSON
│   │   └── UI.jsx             # Componentes compartidos: Badge, Field, SelectField, EquityCurve
│   │
│   ├── hooks/
│   │   └── useTrades.js       # Hook: gestión de estado y persistencia de trades
│   │
│   ├── utils/
│   │   ├── tradeModel.js      # Factoría: estructura de datos de un trade vacío
│   │   ├── storage.js         # Utilidades: load/save/exportCSV/exportJSON
│   │   └── stats.js           # Cálculo de métricas y estadísticas
│   │
│   ├── constants/
│   │   └── index.js           # Listas de opciones: estrategias, timeframes, emociones...
│   │
│   ├── App.jsx                # Componente raíz: routing entre vistas
│   ├── main.jsx               # Punto de entrada React
│   └── styles.css             # Estilos globales (paleta, tipografía, componentes)
│
├── public/
│   └── index.html             # HTML raíz
│
├── data/                      # ⚠️ LOCAL ONLY — no se sube a GitHub
│   └── README.md              # Instrucciones para backups y análisis Python
│
├── .gitignore                 # Excluye: node_modules/, dist/, data/, .env
├── package.json               # Dependencias y scripts npm
├── vite.config.js             # Configuración de Vite (dev server puerto 3000)
└── README.md                  # Este archivo
```

---

## Instalación y uso

### Prerrequisitos
- Node.js ≥ 18
- npm ≥ 9

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/roadbook.git
cd roadbook

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
# → Abre http://localhost:3000

# 4. Compilar para producción
npm run build
# → Genera /dist listo para deploy en Vercel / Netlify / GitHub Pages
```

---

## Modelo de datos

Cada trade es un objeto JavaScript con la siguiente estructura:

```js
{
  // Metadatos
  id:           string,   // Timestamp como ID único
  createdAt:    string,   // ISO 8601

  // Información básica
  activo:           string,  // "EUR/USD", "AAPL", etc.
  direccion:        string,  // "COMPRA" | "VENTA"
  tipoOperativa:    string,  // "SCALPING" | "INTRADÍA" | ...
  sesionOperativa:  string,  // "ASIÁTICA" | "EUROPEA" | "AMERICANA"

  // Análisis técnico
  tfAnalisis:          string,  // "H1" | "DIARIO" | ...
  tfControl:           string,
  tendenciaPrimaria:   string,  // "ALCISTA" | "BAJISTA"
  tendenciaSecundaria: string,
  estrategia:          string,  // "QUIEBRE + PULLBACK" | ...

  // Entrada
  fechaEntrada:   string,  // "YYYY-MM-DD"
  horaEntrada:    string,  // "HH:MM"
  precioEntrada:  string,
  lotes:          string,
  objetivo:       string,  // en pips/puntos
  motivoObjetivo: string,  // "PROYECCIÓN" | "ZONA S/R" | ...

  // Salida
  fechaSalida:   string,
  horaSalida:    string,
  precioSalida:  string,
  resultado:     string,   // número en pips, positivo o negativo
  motivoSalida:  string,   // "TP ALCANZADO" | "STOP LOSS" | ...

  // Resultado
  resultadoTrade: string,  // "GANADORA" | "NEUTRAL" | "PERDEDORA"
  estado:         string,  // "ABIERTA" | "CERRADA"

  // Psicología (escala 1-10)
  psicAntesSeguridad:    number,
  psicMomentoSeguridad:  number,
  psicDuranteControl:    number,
  psicSalidaSatisfaccion: number,
  emociones:             string[],  // ["FOMO", "ANSIEDAD", ...]
  resumenDecision:       string,
}
```

---

## Exportación y análisis

### CSV — 29 columnas

Compatible con Excel, Google Sheets, Python (pandas) y R.

```python
import pandas as pd

df = pd.read_csv("data/roadbook_2026-04-22.csv")

# Win rate global
cerradas = df[df['estado'] == 'CERRADA']
win_rate = (cerradas['resultadoTrade'] == 'GANADORA').mean() * 100
print(f"Win Rate: {win_rate:.1f}%")

# Resultado por estrategia
print(cerradas.groupby('estrategia')['resultado'].agg(['mean', 'sum', 'count']))

# Impacto del FOMO
df['tuvo_fomo'] = df['emociones'].str.contains('FOMO', na=False)
print(df.groupby('tuvo_fomo')[['resultado','psicAntesSeguridad']].mean())
```

### JSON — Backup completo

```bash
# Restaurar desde backup JSON
# (pendiente funcionalidad de importación en v2.0)
```

---

## Roadmap

| Versión | Estado | Descripción |
|---------|--------|-------------|
| v1.0.0  | ✅ Completa | CRUD completo, Dashboard, Equity Curve, Exportación CSV/JSON |
| v2.0.0  | 🔜 Planificada | Importación JSON, R:R automático, filtro por fechas, gráficos adicionales |
| v3.0.0  | 💡 Idea | Backend Supabase, adjunto de imágenes de gráficos, modo oscuro |

---

## Licencia

Uso personal. No redistribuir sin autorización.

---

*Construido con React + Vite · Diseño basado en DeInversorATrader Roadbook*
