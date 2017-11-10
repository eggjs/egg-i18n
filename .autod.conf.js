'use strict'

module.exports = {
  write: true,
  prefix: '^',
  devprefix: '^',
  exclude: [
    'test/fixtures',
  ],
  devdep: [
    'autod',
    'egg-bin',
    'egg-ci',
    'egg-mock',
    'eslint',
    'eslint-config-egg',
  ],
  keep: [
  ],
  semver: [
  ],
  registry: 'https://r.cnpmjs.org',
};
