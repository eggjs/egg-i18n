'use strict';

const egg = require('egg');

const EGG_PATH = __dirname;
const startCluster = egg.startCluster;

class CustomApplication extends egg.Application {
  get [Symbol.for('egg#eggPath')]() {
    return EGG_PATH;
  }
}

class BeggAgent extends egg.Agent {
  get [Symbol.for('egg#eggPath')]() {
    return EGG_PATH;
  }
}

exports.Application = CustomApplication;
exports.Agent = BeggAgent;
module.exports.startCluster = (options, callback) => {
  options = options || {};
  options.customEgg = EGG_PATH;
  startCluster(options, callback);
};
