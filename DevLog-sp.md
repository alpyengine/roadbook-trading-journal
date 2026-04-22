# DevLog — Roadbook Trading Journal
## Registro Técnico del Proyecto

> Documento de referencia técnica para replicar el proyecto desde cero,
> entender las decisiones de arquitectura y consultar el historial de incidencias.

---

## 1. Resumen del Proyecto

**Nombre:** Roadbook Trading Journal
**Repositorio:** https://github.com/alpyengine/roadbook-trading-journal
**Inicio del proyecto:** 21 de Abril de 2026
**Versión actual:** v1.0.0

**Qué es:**
Diario de operaciones bursátiles personal construido en React con persistencia
en localStorage. Permite registrar trades con datos técnicos, de gestión y
psicológicos, consultar estadísticas en tiempo real y exportar los datos a
CSV o JSON para análisis externo.

**Objetivo técnico:**
Construir una alternativa propia a herramientas SaaS de trading journal
(referencia visual: DeInversorATrader Roadbook) con control total sobre
los datos y capacidad de exportación para análisis estadístico con
Python/pandas, Excel o R.

---

## 2. Stack Tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Node.js | 18.20.8 | Entorno de ejecución |
| npm | 10.8.2 | Gestor de paquetes |
| React | 18.2.0 | Framework de UI |
| React DOM | 18.2.0 | Renderizado en navegador |
| Vite | 5.4.21 | Bundler y servidor de desarrollo |
| @vitejs/plugin-react | 4.0.0 | Soporte JSX en Vite |
| localStorage | API nativa | Persistencia de datos |
| Git | sistema | Control de versiones |
| GitHub | cloud | Repositorio remoto |

---

## 3. Estructura del Proyecto

```
roadbook-v1/
│
├── index.html                  ← Punto de entrada HTML (raíz del proyecto, requerido por Vite)
│
├── src/
│   ├── App.jsx                 ← Componente raíz: router entre las 4 vistas
│   ├── main.jsx                ← Punto de entrada React (monta App en #root)
│   ├── styles.css              ← Estilos globales (paleta, tipografía, todos los componentes)
│   │
│   ├── components/
│   │   ├── Dashboard.jsx       ← Vista: Panel principal con KPIs y equity curve
│   │   ├── TradeForm.jsx       ← Vista: Formulario nueva entrada y edición
│   │   ├── History.jsx         ← Vista: Historial filtrable con edición y borrado
│   │   ├── ExportView.jsx      ← Vista: Exportación CSV y JSON
│   │   └── UI.jsx              ← Componentes compartidos: Badge, Field, SelectField, EquityCurve
│   │
│   ├── hooks/
│   │   └── useTrades.js        ← Hook: estado centralizado y persistencia de trades
│   │
│   ├── utils/
│   │   ├── tradeModel.js       ← Factoría: genera objeto Trade vacío con valores por defecto
│   │   ├── storage.js          ← Utilidades: loadTrades, saveTrades, exportToCSV, exportToJSON
│   │   └── stats.js            ← Cálculo de métricas: winRate, equityCurve, byStrategy, bySession
│   │
│   └── constants/
│       └── index.js            ← Listas de opciones: timeframes, estrategias, emociones...
│
├── public/                     ← Recursos estáticos (vacío en v1)
│
├── data/                       ← LOCAL ONLY — no se sube a GitHub
│   └── README.md               ← Instrucciones para backups manuales y análisis Python
│
├── .gitignore                  ← Excluye: node_modules/, dist/, data/, .env
├── package.json                ← Dependencias y scripts npm
├── vite.config.js              ← Configuración Vite (puerto 3000, auto-open)
└── README.md                   ← Documentación general del proyecto
```

---

## 4. Arquitectura y Decisiones Técnicas

### 4.1 Por qué React + Vite

React fue elegido por su modelo de componentes reutilizables y gestión de
estado con hooks, adecuado para una SPA con múltiples vistas y datos
compartidos entre ellas. Vite fue elegido frente a Create React App porque
su servidor de desarrollo es significativamente más rápido (arranque en ~1s
frente a 10-30s) y tiene configuración mínima para proyectos nuevos.

### 4.2 Por qué localStorage y no window.storage

El código se desarrolló inicialmente usando `window.storage`, que es una API
exclusiva del entorno de Claude Artifacts (herramienta de IA usada para
generar el código). Al intentar ejecutar el proyecto con `npm run dev` en
local, la app fallaba porque `window.storage` no existe en un navegador
estándar.

**Decisión:** reemplazar `window.storage` por `localStorage`, que es una API
nativa de todos los navegadores, sin dependencias externas y suficiente para
uso personal en un solo dispositivo.

```js
// Antes (solo funciona en Claude Artifacts)
const result = await window.storage.get(STORAGE_KEY);

// Después (funciona en cualquier navegador)
const raw = localStorage.getItem(STORAGE_KEY);
```

**Limitación conocida:** los datos quedan ligados al navegador y PC donde
se ejecuta la app. Si se limpia el localStorage del navegador, se pierden
los datos. Por eso existe la carpeta `data/` para backups manuales en CSV/JSON.

**Plan v2:** migrar a Supabase (PostgreSQL en la nube, tier gratuito) para
acceso multi-dispositivo sin perder datos.

### 4.3 Por qué se separaron storage.js, stats.js y tradeModel.js

Se aplicó el principio de **responsabilidad única**: cada fichero tiene un
único motivo para cambiar.

- `storage.js` — si cambia el sistema de persistencia (localStorage → Supabase),
  solo se modifica este fichero. El resto del código no sabe dónde se guardan los datos.
- `stats.js` — si se añaden nuevas métricas, se modifica solo aquí sin tocar los componentes.
- `tradeModel.js` — si se añaden nuevos campos al modelo de trade, hay un único
  lugar donde está definida la estructura por defecto.

### 4.4 Por qué useTrades.js como hook centralizado

Concentrar el estado en un hook evita prop drilling (pasar datos a través de
múltiples niveles de componentes) y garantiza que todos los componentes
trabajan con la misma fuente de verdad. Cualquier componente que necesite
los trades importa el hook y obtiene datos y operaciones CRUD directamente.

### 4.5 Por qué CSS global en lugar de CSS Modules o Tailwind

Para un proyecto de una sola persona con un único fichero de estilos,
el CSS global en `styles.css` es suficiente y más sencillo de mantener.
CSS Modules añade complejidad de nomenclatura innecesaria a esta escala.
Tailwind requiere configuración adicional y genera dependencia de su
sistema de clases. El CSS global permite además replicar fielmente
el diseño de referencia (DeInversorATrader) con control total sobre
cada selector.

---

## 5. Setup desde Cero

### 5.1 Prerrequisitos

Verificar que están instalados:

```bash
node --version   # requerido: >= 18.x
npm --version    # requerido: >= 9.x
git --version    # cualquier versión reciente
```

### 5.2 Crear proyecto con Vite

```bash
# Crear proyecto React con Vite
npm create vite@latest roadbook -- --template react

cd roadbook
```

### 5.3 Estructura de ficheros

Crear manualmente la estructura de carpetas y copiar los ficheros del
repositorio. El proyecto no usa generadores automáticos más allá de Vite.

```bash
mkdir -p src/components src/hooks src/utils src/constants data
```

**⚠️ Atención:** usar el comando anterior tal cual. No usar sintaxis de
expansión de llaves como `mkdir -p src/{components,hooks}` porque en algunos
entornos crea una carpeta literal llamada `{src` en lugar de expandir la lista.

### 5.4 Instalar dependencias

```bash
npm install
```

Las dependencias se instalan desde `package.json`. No hay dependencias de
terceros más allá de React y Vite.

### 5.5 Ubicación del index.html

**⚠️ Importante:** Vite requiere que `index.html` esté en la **raíz del
proyecto**, no dentro de `public/`. Si se coloca en `public/`, el servidor
arrancará pero el navegador devolverá HTTP 404.

```bash
# Estructura correcta
roadbook/
├── index.html    ← aquí, en la raíz
├── src/
└── public/       ← vacío o con otros recursos estáticos
```

### 5.6 Arrancar servidor de desarrollo

```bash
npm run dev
# → servidor disponible en http://localhost:3000
```

### 5.7 Alias de terminal (opcional pero recomendado)

Para arrancar la app desde cualquier directorio con un solo comando:

```bash
# Añadir al fichero ~/.zshrc
nano ~/.zshrc
```

Añadir al final:
```bash
alias roadbook="cd /Users/alex/Coding/TradingProjects/Roadbook && npm run dev"
```

Recargar la configuración:
```bash
source ~/.zshrc
```

Desde ese momento, escribir `roadbook` en cualquier terminal arranca la app.

---

## 6. Configuración Git y GitHub

### 6.1 Crear repositorio en GitHub

1. Ir a github.com con la cuenta `alpyengine`
2. Botón verde **"New"**
3. Nombre: `roadbook-trading-journal`
4. Visibilidad: **Private** (contiene datos de operaciones personales)
5. **NO** marcar "Initialize with README" (el proyecto ya tiene uno)
6. Clic en **"Create repository"**
7. Copiar la URL: `https://github.com/alpyengine/roadbook-trading-journal.git`

### 6.2 Inicializar Git en el proyecto

```bash
cd /Users/alex/Coding/TradingProjects/Roadbook
git init
```

### 6.3 Configurar usuario LOCAL vs GLOBAL

Este proyecto usa una cuenta de GitHub diferente (`alpyengine`) a la cuenta
principal del sistema (`alexPic`). La configuración local sobreescribe la
global solo dentro de esta carpeta.

```bash
# Configurar usuario LOCAL (solo para este proyecto)
git config --local user.name "alpy"
git config --local user.email "alpyengine@gmail.com"
```

**Verificar ambas configuraciones:**

```bash
git config --list --show-origin
```

La salida muestra el origen de cada valor:
```
file:/Users/alex/.gitconfig     user.name=alexPic          ← global
file:/Users/alex/.gitconfig     user.email=alexp.java@gmail.com  ← global
file:.git/config                user.name=alpy             ← local (este proyecto)
file:.git/config                user.email=alpyengine@gmail.com  ← local (este proyecto)
```

Git siempre prioriza la configuración local sobre la global. El usuario
global no se ve afectado.

### 6.4 Conectar el repositorio remoto

Incluir el usuario en la URL para evitar conflictos con credenciales
cacheadas en el sistema (ver Error 3 más abajo):

```bash
git remote add origin https://alpyengine@github.com/alpyengine/roadbook-trading-journal.git

# Verificar
git remote -v
# origin  https://alpyengine@github.com/alpyengine/roadbook-trading-journal.git (fetch)
# origin  https://alpyengine@github.com/alpyengine/roadbook-trading-journal.git (push)
```

### 6.5 Primer commit y push

```bash
git add .
git commit -m "feat: Roadbook v1.0.0 — versión inicial

- Dashboard con KPIs, equity curve y tabla de abiertos
- Formulario completo: básica, técnico, entrada, salida, psicología
- Historial filtrable con edición y borrado
- Exportación CSV y JSON (29 columnas)
- Persistencia via localStorage"

git branch -M main
git push -u origin main
```

Al pedir contraseña, introducir el **Personal Access Token** de GitHub
(no la contraseña de la cuenta). Obtenerlo en:
```
GitHub → Settings → Developer Settings → Personal access tokens
→ Tokens (classic) → Generate new token
→ Marcar: ✅ repo → Copiar token (empieza por ghp_...)
```

Mac guarda el token en el Keychain automáticamente. No se volverá a pedir.

### 6.6 Crear y subir tag de versión

```bash
git tag -a v1.0.0 -m "Versión 1.0.0 — CRUD completo, dashboard, exportación CSV/JSON, localStorage"
git push origin v1.0.0
```

Verificar en GitHub:
```
https://github.com/alpyengine/roadbook-trading-journal/tags
```

---

## 7. Errores Encontrados y Soluciones

### Error 1 — Carpeta `{src` basura en el ZIP

**Síntoma:** Al descomprimir el ZIP del proyecto aparecía una carpeta llamada
literalmente `{src` junto a la carpeta `src` correcta.

**Causa:** El comando `mkdir` se ejecutó con sintaxis de expansión de llaves:
```bash
# Comando problemático
mkdir -p /project/{src/components,src/hooks,src/utils}
```
En el entorno donde se ejecutó, las llaves no se expandieron y se creó
una carpeta con el nombre literal `{src/components,src/hooks,src/utils}`.

**Solución:**
```bash
# Eliminar la carpeta basura
rm -rf "/home/project/{src/"

# Crear directorios uno a uno o con ruta completa
mkdir -p src/components src/hooks src/utils src/constants
```

**Lección:** nunca usar expansión de llaves en `mkdir` sin verificar que
el entorno la soporta correctamente.

---

### Error 2 — index.html en public/ en lugar de la raíz

**Síntoma:** Vite arrancaba correctamente (`VITE ready in 1156ms`) pero el
navegador devolvía `HTTP ERROR 404` al acceder a `http://localhost:3000`.

**Causa:** El fichero `index.html` estaba dentro de `public/` en lugar de
en la raíz del proyecto. Vite requiere que `index.html` esté en la raíz
para usarlo como punto de entrada de la aplicación.

**Solución:**
```bash
mv public/index.html ./index.html
```

**Lección:** en proyectos Vite, `index.html` siempre en la raíz.
La carpeta `public/` es para recursos estáticos (imágenes, favicon, etc.)
que se sirven tal cual sin procesamiento.

---

### Error 3 — Conflicto de credenciales Git (error 403)

**Síntoma:**
```
remote: Permission to alpyengine/roadbook-trading-journal.git denied to alexpjava.
fatal: unable to access '...': The requested URL returned error: 403
```

**Causa:** Mac tiene un sistema de caché de credenciales llamado Keychain
(llavero del sistema). Al hacer el primer `git push`, usó automáticamente
las credenciales de `alexpjava` (usuario principal del sistema) que ya
estaban guardadas en el Keychain para `github.com`, ignorando la
configuración local del repositorio.

**Solución:** incluir el usuario directamente en la URL del remote para
que Git no consulte el Keychain y use explícitamente `alpyengine`:

```bash
git remote set-url origin https://alpyengine@github.com/alpyengine/roadbook-trading-journal.git
```

Con el usuario en la URL, Mac guarda las credenciales de `alpyengine`
asociadas específicamente a esa URL, sin interferir con `alexpjava`.

**Lección:** en Mac con múltiples cuentas de GitHub, siempre incluir el
usuario en la URL del remote. Es la forma más fiable de evitar conflictos
con el Keychain.

---

## 8. Workflow del Día a Día

### Ciclo de trabajo estándar

```bash
# 1. Arrancar la app
roadbook   # alias configurado en ~/.zshrc

# 2. Trabajar... editar ficheros...

# 3. Ver qué ha cambiado
git status

# 4. Preparar los cambios
git add .                          # todos los cambios
git add src/components/History.jsx # o solo un fichero

# 5. Commit con mensaje descriptivo
git commit -m "feat: añadir panel expandible en historial"

# 6. Subir a GitHub
git push
```

### Convención de mensajes de commit

Prefijo que describe el tipo de cambio:

```
feat:     nueva funcionalidad
fix:      corrección de bug
style:    cambios visuales sin afectar lógica
refactor: reorganización de código sin cambiar comportamiento
docs:     cambios en README, DevLog u otros documentos
chore:    configuración (package.json, vite.config, aliases...)
```

Ejemplos reales del proyecto:
```bash
git commit -m "feat: Roadbook v1.0.0 — versión inicial"
git commit -m "fix: mover index.html a raíz del proyecto para Vite"
git commit -m "fix: reemplazar window.storage por localStorage"
git commit -m "feat: añadir panel expandible en historial v2"
```

### Cuándo crear un tag de versión

Crear un tag cuando se completa un conjunto de funcionalidades coherente
y la app está estable. No hace falta tagear cada commit.

```bash
git tag -a v2.0.0 -m "Versión 2.0.0 — panel expandible, estadísticas mejoradas"
git push origin v2.0.0
```

### Comandos de consulta útiles

```bash
git log --oneline          # historial de commits resumido
git tag                    # listar todos los tags
git config --list --show-origin  # ver configuración local vs global
git remote -v              # ver URL del repositorio remoto
git status                 # ver ficheros modificados
```

---

## 9. Versiones del Proyecto

### v1.0.0 — 22 de Abril de 2026
**Estado:** ✅ Completa y taggeada en GitHub

Funcionalidades incluidas:
- Dashboard con 4 KPIs (total, abiertas, cerradas, win rate)
- Equity curve SVG calculada sobre operaciones cerradas
- Tabla de operaciones abiertas en seguimiento
- Panel de estadísticas por estrategia
- Formulario completo de nueva entrada:
  - Información básica (activo, dirección, tipo operativa, sesión)
  - Análisis técnico (temporalidades, tendencias, estrategia)
  - Datos de entrada (fecha, hora, precio, lotes, objetivo)
  - Datos de salida (fecha, hora, precio, resultado, motivo)
  - Resultado del trade (Ganadora / Neutral / Perdedora)
  - Psicología: 4 sliders 1-10 + selección de emociones + resumen
- Historial filtrable por activo, dirección, resultado y sesión
- Edición y borrado de trades
- Exportación CSV (29 columnas) y JSON

---

### v1.0.1 — 22 de Abril de 2026
**Estado:** ✅ Taggeada en GitHub

Cambios incluidos:
- Añadido `DevLog-sp.md` — documentación técnica completa en español
- Añadido `DevLog-en.md` — documentación técnica completa en inglés

**Motivo del parche:**
Los ficheros DevLog documentan la v1.0.0 y conceptualmente pertenecen
a ella. Como el tag v1.0.0 ya estaba publicado en GitHub y no se debe
modificar un tag publicado, se creó un tag de parche v1.0.1 para
incluir esta documentación dentro del ciclo de la versión 1.

**Pasos ejecutados:**
```bash
# 1. Copiar los ficheros al proyecto
cp DevLog-sp.md /Users/alex/Coding/TradingProjects/Roadbook/
cp DevLog-en.md /Users/alex/Coding/TradingProjects/Roadbook/

# 2. Commit
git add DevLog-sp.md DevLog-en.md
git commit -m "docs: añadir DevLog técnico v1 en español e inglés"

# 3. Tag de parche
git tag -a v1.0.1 -m "Versión 1.0.1 — añadir documentación técnica DevLog"
git push
git push origin v1.0.1
```

---

### v2.0.0 — En desarrollo
**Estado:** 🔜 Planificada

Funcionalidades previstas:
- Panel expandible inline en el historial (ver detalles completos del trade)
- Columna Sesión con emoji de bandera en la tabla
- Tarjeta Estadísticas mejorada (mayor estrategia ganadora con win rate)
- Botón VER / CERRAR en lugar de solo editar y borrar

---

## 10. Referencias

| Recurso | URL |
|---|---|
| Documentación Vite | https://vite.dev |
| Documentación React | https://react.dev |
| Conventional Commits | https://www.conventionalcommits.org |
| GitHub Personal Access Tokens | https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens |
| localStorage MDN | https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage |
| Git config documentation | https://git-scm.com/docs/git-config |
