// More info on Webpack's Node API here: https://webpack.github.io/docs/node.js-api.html
// Allowing console calls below since this is a build file.
/* eslint-disable no-console */

import webpack from 'webpack';
import config from '../webpack.config.prod';
import colors from 'colors';

process.env.NODE_ENV = 'production'; // This assures React is built in prod mode and that the Babel dev config doesn't apply.

console.log(colors.blue('Generating minified bundle for production via Webpack. Please wait...'));

webpack(config).run((err, stats) => {
  if (err) { // So a fatal error occurred. Stop here.
    console.log(colors.bold.red(err));
    return 1;
  }

  const jsonStats = stats.toJson();

  if (jsonStats.hasErrors) {
    return jsonStats.errors.map(error => console.log(colors.red(error)));
  }

  if (jsonStats.hasWarnings) {
    console.log(colors.bold.yellow('Webpack generated the following warnings: '));
    jsonStats.warnings.map(warning => console.log(colors.yellow(warning)));
  }

  console.log(`Webpack stats: ${stats}`);

  // If we got this far, the build succeeded.
  console.log(colors.green('Your app is compiled in production mode in /dist. It\'s available for testing now...'));

  return 0;
});
