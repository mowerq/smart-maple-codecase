import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import tr from "./locales/tr";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
