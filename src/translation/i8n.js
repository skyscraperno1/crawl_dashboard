import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zh from './zh/zh.json'
import en from './en/en.json'
const resources = {
  zh: {
    translation: zh
  },
  en: {
    translation: en
  },
};

const lang = sessionStorage.getItem('i18n') || 'zh'
i18n.use(initReactI18next).init({
  resources,
  lng: lang,
  fallbackLng: "zh",
  interpolation: {
    escapeValue: false,
  },
  keySeparator: false,
  nsSeparator: false
});

export default i18n;
