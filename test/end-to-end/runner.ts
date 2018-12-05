import {
  BrowserSyncInstance,
  create,
} from 'browser-sync';

import { runner } from 'mocha-headless-chrome';

const browserSync = create();

browserSync.init({
  server: {
    baseDir: './',
    index: 'test/end-to-end/index.html',
  },
  open: false,
  serveStatic: [{
    route: 'resources/rnm.jpg',
    dir: 'test/resources/rnm.jpg',
  }],
}, async (_, browser: BrowserSyncInstance) => {
  const url = browser.getOption('urls').get('local');

  await runner({
    file: url,
    reporter: 'mochawesome',
    timeout: 60000,
    visible: false,
    args: ['no-sandbox'],
  });

  process.exit(0);
});
