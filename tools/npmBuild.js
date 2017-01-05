// More info on Webpack's Node API here: https://webpack.github.io/docs/node.js-api.html
// Allowing console calls below since this is a build file.
/* eslint-disable no-console */

import webpack from 'webpack';
import config from '../webpack.config.npm';
import colors from 'colors';

process.env.NODE_ENV = 'production'; // This assures React is built in prod mode and that the Babel dev config doesn't apply.

console.log(colors.blue('Generating bundle for NPM via Webpack. Please wait...'));

webpack(config).run((err) => {
  if (err) { // So a fatal error occurred. Stop here.
    console.log(colors.bold.red(err));
    return 1;
  }

  console.log(colors.green('Done'));

  return 0;
});
