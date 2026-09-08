import en from './en.json';
import ta from './ta.json';
import te from './te.json';
import hi from './hi.json';

const translations = { en, ta, te, hi };

export function getTranslation(keyPath, lang = 'en') {
  const currentDict = translations[lang] || translations.en;
  const keys = keyPath.split('.');
  let result = currentDict;

  for (const k of keys) {
    if (result && result[k] !== undefined) {
      result = result[k];
    } else {
      // Fallback to English
      let fallback = translations.en;
      for (const fk of keys) {
        if (fallback && fallback[fk] !== undefined) {
          fallback = fallback[fk];
        } else {
          return keyPath;
        }
      }
      return fallback;
    }
  }

  return result;
}

export default translations;
