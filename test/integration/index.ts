import {
  BrowserSyncInstance,
  create,
} from 'browser-sync';

import { runner } from 'mocha-headless-chrome';

const browserSync = create();

browserSync.init({
  server: {
    baseDir: './',
    index: 'test/integration/index.html',
  },
  open: false,
  serveStatic: [{
    route: 'resources/rnm.jpg',
    dir: 'test/resources/rnm.jpg',
  }],
}, async (_, browser: BrowserSyncInstance) => {
  const url = browser.getOption('urls').get('local');

  const result = await runner({
    file: url,
    timeout: 60000,
    visible: false,
    args: ['no-sandbox'],
  });

  process.exit(0);
});
