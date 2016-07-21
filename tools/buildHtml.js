// This script copies src/www/index.html into /dist/index.html
// This is a good example of using Node and cheerio to do a simple file transformation.
// In this case, the transformation is useful since we only want to track errors in the built production code.

// Allowing console calls below since this is a build file.
/*eslint-disable no-console */

import fs from 'fs';
import colors from 'colors';
import cheerio from 'cheerio';

fs.readFile('src/www/index.html', 'utf8', function (err,data) {
  if (err) return console.log(err);

  const $ = cheerio.load(data);

  fs.writeFile('dist/index.html', $.html(), 'utf8', function (err) {
    if (err) return console.log(err);
    console.log('index.html written to /dist'.green);
  });
});