// More info on Webpack's Node API here: https://webpack.github.io/docs/node.js-api.html
// Allowing console calls below since this is a build file.
/*eslint-disable no-console */
import webpack from 'webpack';
import config from '../webpack.config.npm';
import colors from 'colors';

process.env.NODE_ENV = 'production'; // This assures React is built in prod mode and that the Babel dev config doesn't apply.

console.log('Generating bundle for NPM via Webpack. Please wait...'.blue);

webpack(config).run((err, stats) => {
  if (err) { // So a fatal error occurred. Stop here.
    console.log(err.bold.red);
    return 1;
  }

  console.log('Done'.green);

  return 0;
});
