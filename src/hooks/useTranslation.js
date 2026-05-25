// ─── hooks/useTranslation.js ──────────────────────────────────────
// Custom hook that simplifies language usage across all components

import { useState, useEffect } from 'react';
import { getLanguage, t as translateKey } from '../i18n';

/**
 * Custom hook for managing translations in React components
 * Automatically re-renders when language changes globally
 * 
 * Usage:
 * const { lang, t } = useTranslation();
 * return <h1>{t('welcomeMessage')}</h1>;
 */
export const useTranslation = () => {
  const [lang, setLang] = useState(getLanguage());

  useEffect(() => {
    // Listen for global language changes
    const handleLanguageChange = (event) => {
      setLang(event.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('languageChange', handleLanguageChange);
    };
  }, []);

  // Return an object with the current language and translation function
  return {
    lang,
    // Wrapper function that uses the current language
    t: (key) => translateKey(key, lang),
  };
};

export default useTranslation;