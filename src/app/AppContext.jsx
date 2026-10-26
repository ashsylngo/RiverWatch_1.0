import { createContext, useContext } from 'react';

const AppContext = createContext({ replaySplash: () => {} });

export const AppProvider = AppContext.Provider;
export const useApp = () => useContext(AppContext);
