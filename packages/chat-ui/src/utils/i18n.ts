import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import your translation files
import en from '../locales/en.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';

i18n
  .use(LanguageDetector) // Detects user's browser language
  .use(initReactI18next) // Connects i18n to React
  .init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr }
    },
    fallbackLng: 'en', // fallback language if detection fails
    debug: false, // Set to true to debug in dev mode

    interpolation: {
      escapeValue: false // React already escapes values
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    }
  });

export default i18n;
