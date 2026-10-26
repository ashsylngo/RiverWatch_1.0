// Presenter scenarios. Each one only changes SIMULATED state through the data layer.
import { demo } from '../../lib/data/index.js';

export const riverRising = () => demo.startRiverRising();
export const backToNormal = () => demo.startBackToNormal();
export const makeStale = () => demo.setSensorMode('stale');
export const makeOffline = () => demo.setSensorMode('offline');
export const restoreSensor = () => demo.setSensorMode('live');
export const cameraLost = () => demo.setCameraOk(false);
export const restoreCamera = () => demo.setCameraOk(true);
export const toggleGate = () => demo.toggleSimulatedGate();
export const setDelay = (ms) => demo.setTools({ delayMs: ms });
export const setForceError = (on) => demo.setTools({ forceError: on });
