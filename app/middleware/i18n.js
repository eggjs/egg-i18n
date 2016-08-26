'use strict';

module.exports = () => {
  return function* i18n(next) {
    const ctx = this;
    function gettext() {
      return ctx.__.apply(ctx, arguments);
    }
    this.locals = {
      gettext,
      __: gettext,
    };

    yield next;
  };
};
