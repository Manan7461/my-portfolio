"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Loader from "./Loader";

interface LoaderContextType {
  startAnimation: boolean;
  loaderDone: boolean;
}

const LoaderContext = createContext<LoaderContextType>({
  startAnimation: false,
  loaderDone: false,
});

export const useLoader = () => useContext(LoaderContext);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [loaderDone, setLoaderDone] = useState(false);
  const [heroTriggered, setHeroTriggered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <LoaderContext.Provider
      value={{
        startAnimation: heroTriggered,
        loaderDone: loaderDone,
      }}
    >
      {mounted && !loaderDone && (
        <Loader
          onHeroTrigger={() => setHeroTriggered(true)}
          onLoaderComplete={() => setLoaderDone(true)}
        />
      )}
      {children}
    </LoaderContext.Provider>
  );
}
