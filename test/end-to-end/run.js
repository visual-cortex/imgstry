const browserSync = require('browser-sync').create();
const { runner } = require('mocha-headless-chrome');

console.log(process.arch);
console.log(process.argv);

browserSync.init({
  server: {
    baseDir: './',
    index: 'test/end-to-end/index.html',
  },
  open: false,
  serveStatic: [{
    route: 'resources/rnm.jpg',
    dir: 'test/end-to-end/resources/rnm.jpg'
  }]
}, async (_, browser) => {
  const url = browser.getOption('urls').get('local');

  await runner({
    file: url,
    reporter: 'mochawesome',
    timeout: 60000,
    visible: false,
    args: ['no-sandbox']
  });

  process.exit(0);
});
