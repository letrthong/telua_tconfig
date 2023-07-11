import 'i18next';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {getLocales} from 'react-native-localize';
import en from './en.json';
import vi from './vi.json';

export const resources: Record<TLanguage, {translation: Object}> = {
  vi: {translation: vi},
  en: {translation: en},
};
const fallbackLng: TLanguage = 'vi';
export const defaultNS = fallbackLng;

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  returnNull: false,
  resources,
  lng: getLocales()[0].languageCode,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  fallbackLng,
  debug: __DEV__,
});

export default i18n;
