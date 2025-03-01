import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './translations/en.json';
import zh from './translations/zh.json';
import ko from './translations/ko.json';
import ja from './translations/ja.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  ko: { translation: ko },
  ja: { translation: ja },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 