import {
  BrowserSyncInstance,
  create,
} from 'browser-sync';
import { writeFileSync } from 'fs';
import { runner } from 'mocha-headless-chrome';
import { resolve } from 'path';

const uuid = (): string =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

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
    timeout: 600000,
    visible: false,
    args: ['no-sandbox'],
  });

  writeFileSync(`${resolve('.nyc_output')}/${uuid()}.json`, JSON.stringify(result.coverage));

  process.exit(0);
});
