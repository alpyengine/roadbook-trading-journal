# DevLog — Roadbook Trading Journal
## Technical Project Log

> Technical reference document to replicate the project from scratch,
> understand architectural decisions and consult the incident history.

---

## 1. Project Summary

**Name:** Roadbook Trading Journal
**Repository:** https://github.com/alpyengine/roadbook-trading-journal
**Project start:** April 21, 2026
**Current version:** v1.0.0

**What it is:**
A personal stock trading journal built in React with localStorage persistence.
Allows recording trades with technical, management and psychological data,
viewing real-time statistics and exporting data to CSV or JSON for external
analysis.

**Technical objective:**
Build a personal alternative to SaaS trading journal tools
(visual reference: DeInversorATrader Roadbook) with full control over
data and export capability for statistical analysis with
Python/pandas, Excel or R.

---

## 2. Technology Stack

| Technology | Version | Role |
|---|---|---|
| Node.js | 18.20.8 | Runtime environment |
| npm | 10.8.2 | Package manager |
| React | 18.2.0 | UI framework |
| React DOM | 18.2.0 | Browser rendering |
| Vite | 5.4.21 | Bundler and dev server |
| @vitejs/plugin-react | 4.0.0 | JSX support in Vite |
| localStorage | Native API | Data persistence |
| Git | system | Version control |
| GitHub | cloud | Remote repository |

---

## 3. Project Structure

```
roadbook-v1/
│
├── index.html                  ← HTML entry point (project root, required by Vite)
│
├── src/
│   ├── App.jsx                 ← Root component: router between the 4 views
│   ├── main.jsx                ← React entry point (mounts App into #root)
│   ├── styles.css              ← Global styles (palette, typography, all components)
│   │
│   ├── components/
│   │   ├── Dashboard.jsx       ← View: Main panel with KPIs and equity curve
│   │   ├── TradeForm.jsx       ← View: New entry form and edit
│   │   ├── History.jsx         ← View: Filterable history with edit and delete
│   │   ├── ExportView.jsx      ← View: CSV and JSON export
│   │   └── UI.jsx              ← Shared components: Badge, Field, SelectField, EquityCurve
│   │
│   ├── hooks/
│   │   └── useTrades.js        ← Hook: centralized state and trade persistence
│   │
│   ├── utils/
│   │   ├── tradeModel.js       ← Factory: generates empty Trade object with default values
│   │   ├── storage.js          ← Utilities: loadTrades, saveTrades, exportToCSV, exportToJSON
│   │   └── stats.js            ← Metrics calculation: winRate, equityCurve, byStrategy, bySession
│   │
│   └── constants/
│       └── index.js            ← Option lists: timeframes, strategies, emotions...
│
├── public/                     ← Static assets (empty in v1)
│
├── data/                       ← LOCAL ONLY — not uploaded to GitHub
│   └── README.md               ← Instructions for manual backups and Python analysis
│
├── .gitignore                  ← Excludes: node_modules/, dist/, data/, .env
├── package.json                ← Dependencies and npm scripts
├── vite.config.js              ← Vite config (port 3000, auto-open)
└── README.md                   ← General project documentation
```

---

## 4. Architecture and Technical Decisions

### 4.1 Why React + Vite

React was chosen for its reusable component model and hook-based state
management, suitable for a SPA with multiple views and shared data.
Vite was chosen over Create React App because its dev server is
significantly faster (starts in ~1s vs 10-30s) and requires minimal
configuration for new projects.

### 4.2 Why localStorage and not window.storage

The code was initially developed using `window.storage`, which is an API
exclusive to the Claude Artifacts environment (AI tool used to generate
the code). When trying to run the project locally with `npm run dev`,
the app failed because `window.storage` does not exist in a standard browser.

**Decision:** replace `window.storage` with `localStorage`, which is a
native API in all browsers, with no external dependencies and sufficient
for personal use on a single device.

```js
// Before (only works in Claude Artifacts)
const result = await window.storage.get(STORAGE_KEY);

// After (works in any browser)
const raw = localStorage.getItem(STORAGE_KEY);
```

**Known limitation:** data is tied to the browser and PC where the app
runs. Clearing the browser's localStorage will delete the data. That is
why the `data/` folder exists for manual CSV/JSON backups.

**v2 plan:** migrate to Supabase (cloud PostgreSQL, free tier) for
multi-device access without data loss.

### 4.3 Why storage.js, stats.js and tradeModel.js are separated

The **single responsibility principle** was applied: each file has one
single reason to change.

- `storage.js` — if the persistence system changes (localStorage → Supabase),
  only this file is modified. The rest of the code doesn't know where data is stored.
- `stats.js` — if new metrics are added, only this file changes without touching components.
- `tradeModel.js` — if new fields are added to the trade model, there is a single
  place where the default structure is defined.

### 4.4 Why useTrades.js as a centralized hook

Concentrating state in a hook avoids prop drilling (passing data through
multiple component levels) and ensures all components work with the same
source of truth. Any component that needs trades imports the hook and
gets data and CRUD operations directly.

### 4.5 Why global CSS instead of CSS Modules or Tailwind

For a single-person project with a single stylesheet, global CSS in
`styles.css` is sufficient and easier to maintain. CSS Modules adds
unnecessary naming complexity at this scale. Tailwind requires additional
configuration and creates dependency on its class system. Global CSS
also allows faithfully replicating the reference design (DeInversorATrader)
with full control over every selector.

---

## 5. Setup from Scratch

### 5.1 Prerequisites

Verify these are installed:

```bash
node --version   # required: >= 18.x
npm --version    # required: >= 9.x
git --version    # any recent version
```

### 5.2 Create project with Vite

```bash
# Create React project with Vite
npm create vite@latest roadbook -- --template react

cd roadbook
```

### 5.3 File structure

Manually create the folder structure and copy the repository files.
The project uses no automatic generators beyond Vite.

```bash
mkdir -p src/components src/hooks src/utils src/constants data
```

**⚠️ Warning:** use the command exactly as shown above. Do not use brace
expansion syntax like `mkdir -p src/{components,hooks}` because in some
environments it creates a folder literally named `{src` instead of
expanding the list.

### 5.4 Install dependencies

```bash
npm install
```

Dependencies are installed from `package.json`. There are no third-party
dependencies beyond React and Vite.

### 5.5 Location of index.html

**⚠️ Important:** Vite requires `index.html` to be in the **project root**,
not inside `public/`. If placed in `public/`, the server will start but
the browser will return HTTP 404.

```bash
# Correct structure
roadbook/
├── index.html    ← here, in the root
├── src/
└── public/       ← empty or with other static assets
```

### 5.6 Start development server

```bash
npm run dev
# → server available at http://localhost:3000
```

### 5.7 Terminal alias (optional but recommended)

To start the app from any directory with a single command:

```bash
# Add to ~/.zshrc
nano ~/.zshrc
```

Add at the end:
```bash
alias roadbook="cd /Users/alex/Coding/TradingProjects/Roadbook && npm run dev"
```

Reload configuration:
```bash
source ~/.zshrc
```

From that moment, typing `roadbook` in any terminal starts the app.

---

## 6. Git and GitHub Configuration

### 6.1 Create repository on GitHub

1. Go to github.com logged in as `alpyengine`
2. Green button **"New"**
3. Name: `roadbook-trading-journal`
4. Visibility: **Private** (contains personal trading data)
5. **DO NOT** check "Initialize with README" (the project already has one)
6. Click **"Create repository"**
7. Copy the URL: `https://github.com/alpyengine/roadbook-trading-journal.git`

### 6.2 Initialize Git in the project

```bash
cd /Users/alex/Coding/TradingProjects/Roadbook
git init
```

### 6.3 Configure LOCAL vs GLOBAL user

This project uses a different GitHub account (`alpyengine`) from the main
system account (`alexPic`). Local configuration overrides global only
within this folder.

```bash
# Configure LOCAL user (only for this project)
git config --local user.name "alpy"
git config --local user.email "alpyengine@gmail.com"
```

**Verify both configurations:**

```bash
git config --list --show-origin
```

Output shows the origin of each value:
```
file:/Users/alex/.gitconfig     user.name=alexPic               ← global
file:/Users/alex/.gitconfig     user.email=alexp.java@gmail.com ← global
file:.git/config                user.name=alpy                  ← local (this project)
file:.git/config                user.email=alpyengine@gmail.com ← local (this project)
```

Git always prioritizes local configuration over global. The global user
is not affected.

### 6.4 Connect the remote repository

Include the username in the URL to avoid conflicts with system-cached
credentials (see Error 3 below):

```bash
git remote add origin https://alpyengine@github.com/alpyengine/roadbook-trading-journal.git

# Verify
git remote -v
# origin  https://alpyengine@github.com/alpyengine/roadbook-trading-journal.git (fetch)
# origin  https://alpyengine@github.com/alpyengine/roadbook-trading-journal.git (push)
```

### 6.5 First commit and push

```bash
git add .
git commit -m "feat: Roadbook v1.0.0 — initial version

- Dashboard with KPIs, equity curve and open trades table
- Complete form: basic info, technical analysis, entry, exit, psychology
- Filterable history with edit and delete
- CSV and JSON export (29 columns)
- Persistence via localStorage"

git branch -M main
git push -u origin main
```

When prompted for a password, enter the GitHub **Personal Access Token**
(not the account password). Obtain it at:
```
GitHub → Settings → Developer Settings → Personal access tokens
→ Tokens (classic) → Generate new token
→ Check: ✅ repo → Copy token (starts with ghp_...)
```

Mac saves the token in Keychain automatically. It will not be asked again.

### 6.6 Create and push version tag

```bash
git tag -a v1.0.0 -m "Version 1.0.0 — full CRUD, dashboard, CSV/JSON export, localStorage"
git push origin v1.0.0
```

Verify on GitHub:
```
https://github.com/alpyengine/roadbook-trading-journal/tags
```

---

## 7. Errors Found and Solutions

### Error 1 — Garbage `{src` folder in the ZIP

**Symptom:** When unzipping the project ZIP, a folder literally named
`{src` appeared alongside the correct `src` folder.

**Cause:** The `mkdir` command was run with brace expansion syntax:
```bash
# Problematic command
mkdir -p /project/{src/components,src/hooks,src/utils}
```
In the environment where it ran, the braces were not expanded and a
folder with the literal name `{src/components,src/hooks,src/utils}` was created.

**Solution:**
```bash
# Remove the garbage folder
rm -rf "/home/project/{src/"

# Create directories one by one or with full path
mkdir -p src/components src/hooks src/utils src/constants
```

**Lesson:** never use brace expansion in `mkdir` without verifying the
environment supports it correctly.

---

### Error 2 — index.html in public/ instead of root

**Symptom:** Vite started correctly (`VITE ready in 1156ms`) but the
browser returned `HTTP ERROR 404` when accessing `http://localhost:3000`.

**Cause:** The `index.html` file was inside `public/` instead of the
project root. Vite requires `index.html` to be at the root to use it
as the application entry point.

**Solution:**
```bash
mv public/index.html ./index.html
```

**Lesson:** in Vite projects, `index.html` always goes in the root.
The `public/` folder is for static assets (images, favicon, etc.)
that are served as-is without processing.

---

### Error 3 — Git credentials conflict (403 error)

**Symptom:**
```
remote: Permission to alpyengine/roadbook-trading-journal.git denied to alexpjava.
fatal: unable to access '...': The requested URL returned error: 403
```

**Cause:** Mac has a credential caching system called Keychain. On the
first `git push`, it automatically used the credentials of `alexpjava`
(main system user) already stored in Keychain for `github.com`, ignoring
the repository's local configuration.

**Solution:** include the username directly in the remote URL so Git
doesn't consult the Keychain and explicitly uses `alpyengine`:

```bash
git remote set-url origin https://alpyengine@github.com/alpyengine/roadbook-trading-journal.git
```

With the user in the URL, Mac stores `alpyengine` credentials associated
specifically with that URL, without interfering with `alexpjava`.

**Lesson:** on Mac with multiple GitHub accounts, always include the
username in the remote URL. It is the most reliable way to avoid
Keychain conflicts.

---

## 8. Day-to-Day Workflow

### Standard work cycle

```bash
# 1. Start the app
roadbook   # alias configured in ~/.zshrc

# 2. Work... edit files...

# 3. See what changed
git status

# 4. Stage changes
git add .                          # all changes
git add src/components/History.jsx # or just one file

# 5. Commit with descriptive message
git commit -m "feat: add expandable panel in history"

# 6. Push to GitHub
git push
```

### Commit message convention

Prefix describing the type of change:

```
feat:     new functionality
fix:      bug fix
style:    visual changes without affecting logic
refactor: code reorganization without changing behavior
docs:     changes to README, DevLog or other documents
chore:    configuration (package.json, vite.config, aliases...)
```

Real examples from the project:
```bash
git commit -m "feat: Roadbook v1.0.0 — initial version"
git commit -m "fix: move index.html to project root for Vite"
git commit -m "fix: replace window.storage with localStorage"
git commit -m "feat: add expandable panel in history v2"
```

### When to create a version tag

Create a tag when a coherent set of features is complete and the app
is stable. There is no need to tag every commit.

The version convention is **MAJOR.MINOR.PATCH**:

```
MAJOR  →  architecture change or breaking change (v1 → v2)
MINOR  →  new features within the same version (v1.0 → v1.1)
PATCH  →  bug fixes or documentation additions (v1.0.0 → v1.0.1)
```

**Can I modify an already published tag?**
No. Once a tag has been pushed to GitHub with `git push origin vX.X.X`,
it must not be modified. Doing so would rewrite the public history and
break references for anyone who already downloaded it.

**Correct solution:** if you need to add something that conceptually belongs
to an already tagged version (like documentation for v1 added later),
create a patch tag:

```bash
# Add documentation or minor fix
git add .
git commit -m "docs: add technical DevLog in Spanish and English"

# Patch tag — same MAJOR.MINOR, increment PATCH
git tag -a v1.0.1 -m "Version 1.0.1 — add technical DevLog documentation"
git push
git push origin v1.0.1
```

**Tag for new version with features:**
```bash
git tag -a v2.0.0 -m "Version 2.0.0 — expandable panel, improved statistics"
git push origin v2.0.0
```

### Useful query commands

```bash
git log --oneline          # summarized commit history
git tag                    # list all tags
git config --list --show-origin  # see local vs global configuration
git remote -v              # see remote repository URL
git status                 # see modified files
```

---

## 9. Project Versions

### v1.0.0 — April 22, 2026
**Status:** ✅ Complete and tagged on GitHub

Included features:
- Dashboard with 4 KPIs (total, open, closed, win rate)
- SVG equity curve calculated on closed operations
- Open trades monitoring table
- Statistics panel by strategy
- Complete new entry form:
  - Basic info (asset, direction, operation type, session)
  - Technical analysis (timeframes, trends, strategy)
  - Entry data (date, time, price, lots, target)
  - Exit data (date, time, price, result, reason)
  - Trade result (Winner / Neutral / Loser)
  - Psychology: 4 sliders 1-10 + emotion selection + summary
- Filterable history by asset, direction, result and session
- Trade editing and deletion
- CSV export (29 columns) and JSON

---

### v1.0.1 — April 22, 2026
**Status:** ✅ Tagged on GitHub

Changes included:
- Added `DevLog-sp.md` — full technical documentation in Spanish
- Added `DevLog-en.md` — full technical documentation in English

**Reason for patch:**
The DevLog files document v1.0.0 and conceptually belong to it.
Since the v1.0.0 tag was already published on GitHub and a published
tag must not be modified, a patch tag v1.0.1 was created to include
this documentation within the version 1 cycle.

**Steps executed:**
```bash
# 1. Copy files to the project
cp DevLog-sp.md /Users/alex/Coding/TradingProjects/Roadbook/
cp DevLog-en.md /Users/alex/Coding/TradingProjects/Roadbook/

# 2. Commit
git add DevLog-sp.md DevLog-en.md
git commit -m "docs: add technical DevLog v1 in Spanish and English"

# 3. Patch tag
git tag -a v1.0.1 -m "Version 1.0.1 — add technical DevLog documentation"
git push
git push origin v1.0.1
```

---

### v2.0.0 — In development
**Status:** 🔜 Planned

Planned features:
- Inline expandable panel in history (view full trade details)
- Session column with flag emoji in the table
- Improved Statistics card (top winning strategy with win rate)
- VER / CERRAR button instead of just edit and delete

---

## 10. References

| Resource | URL |
|---|---|
| Vite documentation | https://vite.dev |
| React documentation | https://react.dev |
| Conventional Commits | https://www.conventionalcommits.org |
| GitHub Personal Access Tokens | https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens |
| localStorage MDN | https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage |
| Git config documentation | https://git-scm.com/docs/git-config |
