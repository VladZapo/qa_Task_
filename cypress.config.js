const { defineConfig } = require('cypress');

module.exports = defineConfig({
  env:{
  },
  e2e: {
    baseUrl: 'https://the-internet.herokuapp.com',
    chromeWebSecurity: false, // Disable Chrome web security to allow self-signed certs
    setupNodeEvents(on, config) {
    },
  },
});
