'use strict';

module.exports = app => {
  app.get('/', function*() {
    this.body = this.__(this.query.key);
  });

  app.get('/renderString', function*() {
    const tpl = `<li>\${__('Email')}: \${user.email || ''}</li>
<li>\${gettext('Hello %s, how are you today?', user.name)}</li>
<li>\${__('%s %s', 'foo', 'bar')}</li>
`;

    this.body = yield this.renderString(tpl, {
      user: {
        name: 'fengmk2',
      },
    });
  });
};
