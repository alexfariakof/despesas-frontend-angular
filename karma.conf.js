// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  const selectedBrowser = process.env.BROWSER || 'ChromeHeadless';

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'lcov' },
        { type: 'clover' },
        { type: 'json' },
        { exclude: [/\.*\.routing\.module\.ts$/],}
      ],
    },
    reporters: ['progress', 'kjhtml', 'coverage'],
    browsers:  [selectedBrowser],
    debugger: {
      ChromeDebugging: {
        base: 'Chrome',
        protocol: 'inspector',
        host: 'localhost',
        port: 9876
      }
    },
    restartOnFileChange: true
  });
};
