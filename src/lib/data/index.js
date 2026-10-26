// The data layer. Screens and components import ONLY from here, never from seed files or browser storage.
// There is one source today (`demo`: seeds, generator, simulated stream, simulated SMS gateway).
// A real backend can replace ./demo/ later without changing the screens.
import { init, subscribe as subscribeToStore } from './demo/store.js';
import { startSimulator, startRiverRising, startBackToNormal, setSensorMode, setCameraOk, toggleSimulatedGate, setTools } from './demo/simulator.js';
import * as source from './demo/source.js';
import { hasSeenSplash, markSplashSeen } from './storage.js';

init();
startSimulator();

/** Subscribe to changes. The callback receives the list of changed topics. Returns an unsubscribe function. */
export const subscribe = subscribeToStore;

// Reads
export const { getBarangay, getHome, getResidents, getAlertForm, getAlertDetail, getHistory, getAlertsLog, getGate, getDemoSnapshot } = source;

// Actions
export const { addResident, updateResident, deleteResident, importResidents, sendAlert, countRecipients, resetDemo } = source;

// Demo tools (simulated scenarios only)
export const demo = {
  startRiverRising,
  startBackToNormal,
  setSensorMode,
  setCameraOk,
  toggleSimulatedGate,
  setTools,
};

// Splash flag (once per browser session)
export { hasSeenSplash, markSplashSeen };
