// More info on Webpack's Node API here: https://webpack.github.io/docs/node.js-api.html
// Allowing console calls below since this is a build file.
/*eslint-disable no-console */
import webpack from 'webpack';
import config from '../webpack.config.prod';
import colors from 'colors';

process.env.NODE_ENV = 'production'; // This assures React is built in prod mode and that the Babel dev config doesn't apply.

console.log('Generating minified bundle for production via Webpack. Please wait...'.blue);

webpack(config).run((err, stats) => {
  if (err) { // So a fatal error occurred. Stop here.
    console.log(err.bold.red);
    return 1;
  }

  const jsonStats = stats.toJson();

  if (jsonStats.hasErrors) {
    return jsonStats.errors.map(error => console.log(error.red));
  }

  if (jsonStats.hasWarnings) {
    console.log('Webpack generated the following warnings: '.bold.yellow);
    jsonStats.warnings.map(warning => console.log(warning.yellow));
  }

  console.log(`Webpack stats: ${stats}`);

  // If we got this far, the build succeeded.
  console.log('Your app is compiled in production mode in /dist. It\'s available for testing now...'.green);

  return 0;
});
