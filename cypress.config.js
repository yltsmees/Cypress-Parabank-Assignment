const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    reporter: "mochawesome",
    baseUrl: 'https://parabank.parasoft.com/parabank/',
    testIsolation: false,
  },
});
