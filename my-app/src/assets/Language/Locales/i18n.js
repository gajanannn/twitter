// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation files

import en from "./en.json";
import hi from "./hi.json";
import fr from "./fr.json";
import es from "./es.json";
import pt from "./pt.json";
import zh from "./zh.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      fr: { translation: fr },
      es: { translation: es },
      pt: { translation: pt },
      zh: { translation: zh },
    },
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
