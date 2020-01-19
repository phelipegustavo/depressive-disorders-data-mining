import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from './Localization/en.json';
import pt from './Localization/pt.json';

// the translations
const resources = {
  en: en,
  pt: pt,
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "pt",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;