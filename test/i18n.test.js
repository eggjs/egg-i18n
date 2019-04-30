'use strict';

const mm = require('egg-mock');
const assert = require('assert');
const pedding = require('pedding');
const join = require('path').join;

describe('test/i18n.test.js', () => {
  let app;
  before(done => {
    app = mm.app({
      baseDir: 'apps/i18n',
      plugin: 'i18n',
    });
    app.ready(done);
  });
  after(() => app.close());

  describe('ctx.__(key, value)', () => {
    it('should return locale de', done => {
      app.httpRequest()
        .get('/message?locale=de')
        .expect(200)
        .expect('Set-Cookie', /locale=de; path=\/; expires=[^;]+ GMT$/)
        .expect(res => {
          const cookie = res.headers['set-cookie'].join('|');
          assert(cookie);
          // don't set domain
          assert(/\|locale=de; path=\/; expires=[\w, :]+ GMT$/.test(cookie));
        })
        .expect({
          message: 'Hallo fengmk2, wie geht es dir heute? Wie war dein 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
        }, done);
    });

    it('should return default locale en_US', function(done) {
      app.httpRequest()
        .get('/message?locale=')
        .expect(200)
        .expect('Set-Cookie', /locale=en-us; path=\/; expires=[^;]+ GMT$/)
        .expect({
          message: 'Hello fengmk2, how are you today? How was your 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
        }, done);
    });
  });

  describe('with cookieDomain', () => {
    let app;
    before(done => {
      app = mm.app({
        baseDir: 'apps/i18n-domain',
        plugin: 'i18n',
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should return locale de', done => {
      app.httpRequest()
        .get('/message?locale=de')
        .expect(200)
        .expect('Set-Cookie', /locale=de; path=\/; expires=[^;]+ GMT; domain=.foo.com$/)
        .expect({
          message: 'Hallo fengmk2, wie geht es dir heute? Wie war dein 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
        }, done);
    });

    it('should return default locale en_US', function(done) {
      app.httpRequest()
        .get('/message?locale=')
        .expect(200)
        .expect('Set-Cookie', /locale=en-us; path=\/; expires=[^;]+ GMT; domain=.foo.com$/)
        .expect({
          message: 'Hello fengmk2, how are you today? How was your 18.',
          empty: '',
          notexists_key: 'key not exists',
          empty_string: '',
          novalue: 'key %s ok',
          arguments3: '1 2 3',
          arguments4: '1 2 3 4',
          arguments5: '1 2 3 4 5',
          arguments6: '1 2 3 4 5. 6',
          values: 'foo bar foo bar {2} {100}',
        }, done);
    });
  });

  describe('ctx.locale', () => {
    let app;
    before(() => {
      app = mm.app({
        baseDir: 'apps/i18n',
        plugin: 'i18n',
      });
      return app.ready();
    });
    after(() => app.close());

    it('should get request default locale', () => {
      const ctx = app.mockContext();
      assert(ctx.locale === 'en-us');
    });

    it('should get request locale from cookie', () => {
      const ctx = app.mockContext({
        headers: {
          Cookie: 'locale=zh-CN',
        },
      });
      assert(ctx.locale === 'zh-cn');
    });
  });

  describe('loader', function() {
    let app;
    before(done => {
      app = mm.app({
        baseDir: 'apps/loader',
        customEgg: join(__dirname, './fixtures/custom_egg'),
      });
      app.ready(done);
    });
    after(() => app.close());

    it('should return locale from plugin a', function(done) {
      app.httpRequest()
        .get('/?key=pluginA')
        .set('Accept-Language', 'zh-CN,zh;q=0.5')
        .expect('true', done);
    });

    it('should return locale from plugin b', function(done) {
      app.httpRequest()
        .get('/?key=pluginB')
        .set('Accept-Language', 'zh-CN,zh;q=0.5')
        .expect('true', done);
    });

    it('should return locale from framework', function(done) {
      app.httpRequest()
        .get('/?key=framework')
        .set('Accept-Language', 'zh-CN,zh;q=0.5')
        .expect('true', done);
    });

    it('should return locale from locales2', function(done) {
      app.httpRequest()
        .get('/?key=locales2')
        .set('Accept-Language', 'zh-CN,zh;q=0.5')
        .expect('true', done);
    });

    it('should use locale/ when both exist locales/ and locale/', function(done) {
      app.httpRequest()
        .get('/?key=pluginC')
        .set('Accept-Language', 'zh-CN,zh;q=0.5')
        .expect('i18n form locale', done);
    });

    describe('view renderString with __(key, value)', () => {
      it('should render with default locale: en-US', function(done) {
        app.httpRequest()
          .get('/renderString')
          .expect(200)
          .expect('Set-Cookie', /locale=en-us; path=\/; expires=[^;]+ GMT/)
          .expect('<li>Email: </li>\n<li>Hello fengmk2, how are you today?</li>\n<li>foo bar</li>\n', done);
      });

      it('should render with query locale: zh_CN', function(done) {
        app.httpRequest()
          .get('/renderString?locale=zh_CN')
          .expect(200)
          .expect('Set-Cookie', /locale=zh-cn; path=\/; expires=[^;]+ GMT/)
          .expect('<li>邮箱: </li>\n<li>fengmk2，今天过得如何？</li>\n<li>foo bar</li>\n', done);
      });

      // Accept-Language: zh-CN,zh;q=0.5
      // Accept-Language: zh-CN;q=1
      // Accept-Language: zh-CN
      it('should render with Accept-Language: zh-CN,zh;q=0.5', function(done) {
        done = pedding(3, done);
        app.httpRequest()
          .get('/renderString')
          .set('Accept-Language', 'zh-CN,zh;q=0.5')
          .expect(200)
          .expect('Set-Cookie', /locale=zh-cn; path=\/; expires=[^;]+ GMT/)
          .expect('<li>邮箱: </li>\n<li>fengmk2，今天过得如何？</li>\n<li>foo bar</li>\n', done);

        app.httpRequest()
          .get('/renderString')
          .set('Accept-Language', 'zh-CN;q=1')
          .expect(200)
          .expect('Set-Cookie', /locale=zh-cn; path=\/; expires=[^;]+ GMT/)
          .expect('<li>邮箱: </li>\n<li>fengmk2，今天过得如何？</li>\n<li>foo bar</li>\n', done);

        app.httpRequest()
          .get('/renderString')
          .set('Accept-Language', 'zh_cn')
          .expect(200)
          .expect('Set-Cookie', /locale=zh-cn; path=\/; expires=[^;]+ GMT/)
          .expect('<li>邮箱: </li>\n<li>fengmk2，今天过得如何？</li>\n<li>foo bar</li>\n', done);
      });

      it('should render set cookie locale: zh-CN if query locale not equal to cookie', function(done) {
        app.httpRequest()
          .get('/renderString?locale=en-US')
          .set('Cookie', 'locale=zh-CN')
          .expect(200)
          .expect('Set-Cookie', /locale=en-us; path=\/; expires=[^;]+ GMT/)
          .expect('<li>Email: </li>\n<li>Hello fengmk2, how are you today?</li>\n<li>foo bar</li>\n', done);
      });

      it('should render with cookie locale: zh-cn', () => {
        return app.httpRequest()
          .get('/renderString')
          .set('Cookie', 'locale=zh-cn')
          .expect(200)
          .expect('<li>邮箱: </li>\n<li>fengmk2，今天过得如何？</li>\n<li>foo bar</li>\n')
          .expect(res => {
            // cookie should not change
            const setCookies = res.headers['set-cookie'] || [];
            assert(!setCookies.join(',').includes('locale='));
          });
      });
    });
  });

  describe('ctx.locale', () => {
    it('should locale work and can be override', () => {
      const ctx = app.mockContext({
        query: { locale: 'zh-cn' },
      });
      assert(ctx.locale === 'zh-cn');
      assert(ctx.response.headers['set-cookie'].length === 1);
      assert(ctx.response.headers['set-cookie'][0].match(/^locale=zh\-cn; path=\/; expires=[^;]+ GMT$/));
      ctx.locale = 'en-us';
      assert(ctx.response.headers['set-cookie'].length === 1);
      assert(ctx.response.headers['set-cookie'][0].match(/^locale=en\-us; path=\/; expires=[^;]+ GMT$/));
      assert(ctx.locale === 'en-us');
      assert(ctx.response.headers['set-cookie'].length === 1);
      assert(ctx.response.headers['set-cookie'][0].match(/^locale=en\-us; path=\/; expires=[^;]+ GMT$/));
    });
  });
});
