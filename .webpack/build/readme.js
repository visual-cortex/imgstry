
const fs = require('fs-extra');

const docReadme = './docs/README.md';
const githubReadme = './README.md';

const lineReader = require('readline').createInterface({
  input: fs.createReadStream(docReadme)
});

fs.removeSync(githubReadme);

lineReader.on('line', function (line) {
  if (line.includes('.md')) {
    line = line.replace('](', '](docs/');
  }

  fs.appendFileSync(githubReadme, `${line}\r\n`);
});
