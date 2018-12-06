declare interface NodeRequire {
  context: (dir: string, recurse: boolean, regEx: RegExp) => any;
}

const ctx = require.context('./', true, /.+\.test\.ts?$/);
ctx.keys().forEach(ctx);
module.exports = ctx;
