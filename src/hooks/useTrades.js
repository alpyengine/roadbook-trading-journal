// ─── ROADBOOK — Hook: useTrades ───────────────────────────────────────────────
// Versión: 1.0.0
//
// Centraliza toda la lógica de estado y persistencia de trades.

import { useState, useEffect, useCallback } from "react";
import { loadTrades, saveTrades } from "../utils/storage";

/**
 * Hook principal de gestión de trades.
 * Expone el array de trades y todas las operaciones CRUD.
 */
export function useTrades() {
  const [trades, setTrades] = useState([]);
  const [ready,  setReady]  = useState(false);

  // Carga inicial desde storage
  useEffect(() => {
    loadTrades().then(data => {
      setTrades(data);
      setReady(true);
    });
  }, []);

  // Persiste y actualiza estado en un solo paso
  const persist = useCallback((updated) => {
    setTrades(updated);
    saveTrades(updated);
  }, []);

  // Guardar (crear o actualizar)
  const saveTrade = useCallback((trade) => {
    setTrades(prev => {
      const exists = prev.find(t => t.id === trade.id);
      const updated = exists
        ? prev.map(t => t.id === trade.id ? trade : t)
        : [...prev, trade];
      saveTrades(updated);
      return updated;
    });
  }, []);

  // Eliminar por ID
  const deleteTrade = useCallback((id) => {
    setTrades(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveTrades(updated);
      return updated;
    });
  }, []);

  return { trades, ready, saveTrade, deleteTrade, persist };
}
