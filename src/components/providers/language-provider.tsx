"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type Language = "en" | "ml";
type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageProviderContext = createContext<LanguageProviderState | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language | null;
    if (storedLanguage) {
      setLanguage(storedLanguage);
      document.documentElement.lang = storedLanguage;
    } else {
      document.documentElement.lang = "en";
    }
  }, []);

  const handleSetLanguage = (newLanguage: Language) => {
    localStorage.setItem("language", newLanguage);
    setLanguage(newLanguage);
    document.documentElement.lang = newLanguage;
  };

  const toggleLanguage = () => {
    handleSetLanguage(language === "en" ? "ml" : "en");
  };

  const value = { language, setLanguage: handleSetLanguage, toggleLanguage };

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
