const dts = require('dts-bundle');
const entries = require('../../webpack.entries');

const src = './lib';

const entryCollection = entries({
  isDeclaration: true,
  src,
})

Object.keys(entryCollection).forEach(bundle => {
  dts.bundle({
    "name": bundle,
    "main": entryCollection[bundle],
    "out": `${bundle}.min.d.ts`,
    "baseDir": './dist',
    "removeSource": false,
    "outputAsModuleFolder": true
  });
});

