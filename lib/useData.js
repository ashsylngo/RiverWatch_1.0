// Loads data through the data layer and exposes loading, error and ready states.
// Refetches quietly when one of `topics` changes, and with a visible loading state
// when Demo tools changes the delay or error toggle or when the demo is reset.
import { useCallback, useEffect, useRef, useState } from 'react';
import { subscribe } from './data/index.js';

export function useData(loader, topics = [], deps = []) {
  const [state, setState] = useState({ status: 'loading', data: null, error: null });
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const requestId = useRef(0);
  const topicsRef = useRef(topics);
  topicsRef.current = topics;

  const load = useCallback(async (silent) => {
    const id = ++requestId.current;
    if (!silent) setState((s) => ({ status: 'loading', data: s.data, error: null }));
    try {
      const data = await loaderRef.current();
      if (id === requestId.current) setState({ status: 'ready', data, error: null });
    } catch (error) {
      if (id === requestId.current) setState({ status: 'error', data: null, error });
    }
  }, []);

  useEffect(() => {
    load(false);
    const unsubscribe = subscribe((changed) => {
      if (changed.includes('tools') || changed.includes('reset')) load(false);
      else if (changed.some((c) => topicsRef.current.includes(c))) load(true);
    });
    return () => {
      requestId.current += 1;
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const reload = useCallback(() => load(false), [load]);
  return { ...state, reload };
}
