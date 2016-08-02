'use strict';

module.exports = () => {
  return function* i18n(next) {
    const gettext = this.__.bind(this);
    this.locals = {
      gettext,
      __: gettext,
    };

    yield next;
  };
};
