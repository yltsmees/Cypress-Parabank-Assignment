# Parabank automation testing assignment


## Getting Started

To get started with testing and development, follow these simple steps:

### 1. Install Cypress and Faker Library

[Cypress](https://www.cypress.io/) is the testing framework we use for end-to-end testing, and [Faker](https://github.com/marak/Faker.js/) is a library for generating fake data.

Download the software from the link - https://nodejs.org/en/ - take LTS (long term support version)

Check with terminal that Node.js is installed by using command 
”node --version”. Instruction, how to open the terminal, can be found in Git installation manual.

Check with terminal that NPM is installed by using command 
”npm --version”

```bash
# Git clone
git clone https://github.com/yltsmees/Cypress-Parabank-Assignment.git
cd Cypress-Parabank-Assignment

# Install Cypress
npm install cypress --save-dev

# Faker for fake data
npm install --save-dev @faker-js/faker

# Headless mode
To run the test in headless mode use:
npx cypress run --browser chrome

# Visual mode
To run the test in visual mode use:
npx cypress open
and pick E2E and Chrome

# Test location
You can find them in /cypress/e2e/Parabank Website.cy.js
