const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr'],
  },
  defaultNS: ['common', 'footer', 'contact'],
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
