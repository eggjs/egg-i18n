'use strict';

const LOCALE = Symbol('context#locale');

module.exports = {
  /**
   * get current request locale
   * @member Context#locale
   * @return {String} lower case locale string, e.g.: 'zh-cn', 'en-us'
   */
  get locale() {
    if (this[LOCALE] === undefined) return this.__getLocale();
    return this[LOCALE];
  },

  set locale(l) {
    this[LOCALE] = l;
  },
};
