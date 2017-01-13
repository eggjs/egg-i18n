'use strict';

const egg = require('egg');

const EGG_PATH = __dirname;
const startCluster = egg.startCluster;

class View {
  * render() {
    throw new Error('not implements');
  }
  /* eslint-disable no-new-func */
  * renderString(tpl, locals) {
    const render = new Function('local', `with(local) { return \`${tpl}\` }`);
    return render(locals);
  }
  /* eslint-enable no-new-func */
}

class CustomApplication extends egg.Application {
  get [Symbol.for('egg#eggPath')]() {
    return EGG_PATH;
  }

  get [Symbol.for('egg#view')]() {
    return View;
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
