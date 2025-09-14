"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

// Import locale files
import en from "@/lib/locales/en.json";
import ml from "@/lib/locales/ml.json";

type Language = "en" | "ml";
type Translations = Record<string, string>;

const locales: Record<Language, Translations> = { en, ml };

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const LanguageProviderContext = createContext<LanguageProviderState | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<Translations>(locales.en);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language | null;
    if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'ml')) {
      setLanguage(storedLanguage);
      setTranslations(locales[storedLanguage]);
      document.documentElement.lang = storedLanguage;
    } else {
      setLanguage("en");
      setTranslations(locales.en);
      document.documentElement.lang = "en";
    }
  }, []);

  const handleSetLanguage = (newLanguage: Language) => {
    localStorage.setItem("language", newLanguage);
    setLanguage(newLanguage);
    setTranslations(locales[newLanguage]);
    document.documentElement.lang = newLanguage;
  };

  const toggleLanguage = () => {
    handleSetLanguage(language === "en" ? "ml" : "en");
  };

  const t = useCallback((key: string): string => {
    return translations[key] || key;
  }, [translations]);

  const value = { language, setLanguage: handleSetLanguage, toggleLanguage, t };

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
