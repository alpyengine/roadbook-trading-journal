// ─── ROADBOOK — Componente raíz: App ──────────────────────────────────────────
// Versión: 1.0.0

import React from "react";
import "./styles.css";
import { useTrades }    from "./hooks/useTrades";
import { Dashboard }    from "./components/Dashboard";
import { TradeForm }    from "./components/TradeForm";
import { History }      from "./components/History";
import { ExportView }   from "./components/ExportView";
import { useState }     from "react";

export default function App() {
  const { trades, ready, saveTrade, deleteTrade } = useTrades();
  const [view, setView] = useState("dashboard"); // dashboard | form | history | export
  const [edit, setEdit] = useState(null);

  function goNew()       { setEdit(null); setView("form"); }
  function goEdit(trade) { setEdit(trade); setView("form"); }
  function goHistory()   { setEdit(null); setView("history"); }

  function handleSave(trade) {
    saveTrade(trade);
    setView("history");
    setEdit(null);
  }

  function handleDelete(id) {
    if (!confirm("¿Eliminar esta operación? Esta acción no se puede deshacer.")) return;
    deleteTrade(id);
  }

  function handleCancel() {
    setView(edit ? "history" : "dashboard");
    setEdit(null);
  }

  if (!ready) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100vh", background: "#f3f4f6",
        color: "#9ca3af", fontFamily: "Inter, sans-serif", fontSize: 14,
      }}>
        Cargando Roadbook…
      </div>
    );
  }

  const NAV_ITEMS = [
    { id: "dashboard", label: "Panel Principal" },
    { id: "form",      label: "Nueva Entrada"   },
    { id: "history",   label: "Mis Resultados"  },
    { id: "export",    label: "Exportar"         },
  ];

  return (
    <div className="app">
      {/* ── BARRA DE NAVEGACIÓN ── */}
      <nav className="topbar">
        <div className="logo">
          <div className="logo-bars">
            <div className="logo-bar1" />
            <div className="logo-bar2" />
          </div>
          ROADBOOK
        </div>

        {NAV_ITEMS.map(({ id, label }) => (
          <button
            key={id}
            className={"nav-btn " + (view === id ? "active" : "")}
            onClick={() => id === "form" ? goNew() : (setView(id), setEdit(null))}
          >
            {label}
          </button>
        ))}

        <div className="topbar-end">
          <span className="chip">{trades.length} trades · guardado ✓</span>
        </div>
      </nav>

      {/* ── CONTENIDO PRINCIPAL ── */}
      <main className="main">
        {view === "dashboard" && (
          <Dashboard trades={trades} onNew={goNew} onHistory={goHistory} />
        )}
        {view === "form" && (
          <TradeForm initial={edit} onSave={handleSave} onCancel={handleCancel} />
        )}
        {view === "history" && (
          <History trades={trades} onEdit={goEdit} onDelete={handleDelete} onNew={goNew} />
        )}
        {view === "export" && (
          <ExportView trades={trades} />
        )}
      </main>
    </div>
  );
}
