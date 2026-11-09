// Locale helpers shared by the strings files, the time helpers and the components.
// No formatter is cached at module level: each call builds one for the language it is given.

/** UI language code ('en' or 'fil') to the Intl locale used for dates and numbers. */
export const intlLocale = (lang) => (lang === 'fil' ? 'fil-PH' : 'en-PH');

export const formatNumber = (value, lang, options) => new Intl.NumberFormat(intlLocale(lang), options).format(value);
