import React, { createContext, useContext, useState } from 'react'

const strings = {
  en: {
    appTitle: 'Smart Tourist Safety',
    roleTourist: 'Tourist',
    roleAuthority: 'Authority',
    getStarted: 'Get started',
    generateId: 'Generate Digital ID',
    tracking: 'Tracking',
    panic: 'Panic / SOS',
    lastSeen: 'Last seen',
    safetyScore: 'Safety Score',
    geofenceAlert: 'You entered a high-risk zone.',
    geofenceSafe: 'You left the high-risk zone.',
    dashboard: 'Dashboard',
    alerts: 'Alerts',
    eFIR: 'E-FIR',
    submit: 'Submit',
    language: 'Language',
  },
  hi: {
    appTitle: 'स्मार्ट टूरिस्ट सेफ़्टी',
    roleTourist: 'पर्यटक',
    roleAuthority: 'अधिकारी',
    getStarted: 'शुरू करें',
    generateId: 'डिजिटल आईडी बनाएँ',
    tracking: 'ट्रैकिंग',
    panic: 'पैनिक / एसओएस',
    lastSeen: 'अंतिम स्थान',
    safetyScore: 'सेफ़्टी स्कोर',
    geofenceAlert: 'आप उच्च-जोखिम क्षेत्र में पहुँच गए हैं।',
    geofenceSafe: 'आप उच्च-जोखिम क्षेत्र से बाहर हैं।',
    dashboard: 'डैशबोर्ड',
    alerts: 'अलर्ट',
    eFIR: 'ई-एफ़आईआर',
    submit: 'सबमिट',
    language: 'भाषा',
  }
}

const I18nContext = createContext()

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('en')
  const t = (key) => strings[lang][key] || key
  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
