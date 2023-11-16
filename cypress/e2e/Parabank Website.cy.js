import { faker } from "@faker-js/faker";

const fakeUsername = faker.internet.userName();
const fakePassword = faker.internet.password();
const fakeEmail = faker.internet.email();
const invalidChars = "@!#";
const PosMoney = 999999;
const NegMoney = -999999;

describe("Parabank automation testing assignment", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Login with BLANK username and password", () => {
    cy.get('input[type="text"]').clear();
    cy.get('input[type="password"]').clear();
    cy.get('input[type="submit"]').click();
    //Assert that loging was not successful and we get error
    cy.contains("h1", "Error!").should("be.visible");
    cy.contains("p", "Please enter a username and password.").should("be.visible");
  });

  it("Register with valid information", () => {
    cy.fixture("userData.json").then((userData) => {
      //Find Register link and assert its correct page
      cy.get('a[href*="register.htm"]').click();
      cy.contains("h1", "Signing up is easy!").should("be.visible");

      // Fill out the form fields
      cy.get('input[name="customer.firstName"]').type(userData.oldUser.firstName);
      cy.get('input[name="customer.lastName"]').type(userData.oldUser.lastName);
      cy.get('input[name="customer.address.street"]').type(userData.oldUser.street);
      cy.get('input[name="customer.address.city"]').type(userData.oldUser.city);
      cy.get('input[name="customer.address.state"]').type(userData.oldUser.state);
      cy.get('input[name="customer.address.zipCode"]').type(userData.oldUser.zipCode);
      cy.get('input[name="customer.phoneNumber"]').type(userData.oldUser.phoneNumber);
      cy.get('input[name="customer.ssn"]').type(userData.oldUser.ssn);
      cy.get('input[name="customer.username"]').type(fakeUsername);
      cy.get('input[name="customer.password"]').type(fakePassword);
      cy.get('input[name="repeatedPassword"]').type(fakePassword);
      cy.get('input[type="submit"][value="Register"]').click();

      //Assert that registration was successful
      cy.contains("h1", "Welcome " + fakeUsername).should("be.visible");
      cy.contains("p", "Your account was created successfully. You are now logged in.").should("be.visible");
      cy.get('a[href*="logout.htm"]').click();
    });
  });
  it("Login with correct username and password", () => {
    //Parabank saves registration info for limited time i think
    cy.get('input[type="text"]').type(fakeUsername);
    cy.get('input[type="password"]').type(fakePassword);
    cy.get('input[type="submit"]').click();
    cy.contains("h1", "Accounts Overview").should("be.visible");
  });

  it("Open savings account", () => {
    cy.get('a[href*="openaccount.htm"]').click();
    cy.get("#type").select("SAVINGS");
    cy.wait(1000);
    cy.get("#fromAccountId")
      .find("option")
      .eq(0)
      .invoke("val")
      .then((value) => {
        cy.get("#fromAccountId").select(value);
      });
    cy.get('input[type="submit"][value="Open New Account"]').click();
    cy.contains("h1", "Account Opened!").should("be.visible");
  });
  it("Transfer funds (positive number)", () => {
    cy.get('a[href*="transfer.htm"]').click();
    cy.wait(1000);
    cy.get('input[name="input"]').type(PosMoney);

    cy.get("#fromAccountId")
      .find("option")
      .eq(0)
      .invoke("val")
      .then((value) => {
        cy.get("#fromAccountId").select(value);
      });
    cy.get("#fromAccountId")
      .find("option")
      .eq(1)
      .invoke("val")
      .then((value) => {
        cy.get("#toAccountId").select(value);
      });

    cy.get('input[type="submit"][value="Transfer"]').click();
    cy.contains("h1", "Transfer Complete!").should("be.visible");
    cy.get("#amount")
      .should("be.visible")
      .contains("$" + PosMoney);
  });
  it("Transfer funds (negative number)", () => {
    cy.get('a[href*="transfer.htm"]').click();
    cy.wait(1000);
    cy.get('input[name="input"]').type(NegMoney);

    cy.get("#fromAccountId")
      .find("option")
      .eq(0)
      .invoke("val")
      .then((value) => {
        cy.get("#fromAccountId").select(value);
      });
    cy.get("#fromAccountId")
      .find("option")
      .eq(1)
      .invoke("val")
      .then((value) => {
        cy.get("#toAccountId").select(value);
      });

    cy.get('input[type="submit"][value="Transfer"]').click();

    //Assert that transfer was NOT successful
    //Error message unknown, it allows negative numbers?
    cy.contains("p", "Negative numbers not allowed")
      .should("be.visible", { timeout: 5000 })
      .then(() => {
        // Continue to the next test steps
        cy.log("Transer not complete");
      });
  });
  it("Update user contact info", () => {
    cy.fixture("userData.json").then((userData) => {
      cy.get('a[href*="updateprofile.htm"]').click();
      //Assert that we are on the update profile page
      cy.get('input[name="customer.firstName"]').clear().type(userData.newUser.firstName);
      cy.get('input[name="customer.lastName"]').clear().type(userData.newUser.lastName);
      cy.get('input[name="customer.address.street"]').clear().type(userData.newUser.street);
      cy.get('input[name="customer.address.city"]').clear().type(userData.newUser.city);
      cy.get('input[name="customer.address.state"]').clear().type(userData.newUser.state);
      cy.get('input[name="customer.address.zipCode"]').clear().type(userData.newUser.zipCode);
      cy.get('input[name="customer.phoneNumber"]').clear().type(userData.newUser.phoneNumber);
      cy.get('input[type="submit"][value="Update Profile"]').click();
      cy.wait(1000);
      //Assert that we are on the profile update was successful
      cy.contains("h1", "Profile Updated").should("be.visible");
      cy.contains("p", "Your updated address and phone number have been added to the system.").should("be.visible");
    });
  });

  it("Using a website contact form", () => {
    cy.fixture("userData.json").then((userData) => {
      cy.get("li.contact a").click();
      cy.wait(1000);
      cy.get('input[name="name"]').type(userData.newUser.firstName + " " + userData.newUser.lastName);
      cy.get('input[name="email"]').type(fakeEmail);
      cy.get('input[name="phone"]').type(userData.newUser.phoneNumber);
      cy.get('textarea[name="message"]').type("Hello!");
      cy.get('input[type="submit"][value="Send to Customer Care"]').click();
      //Assert that loging out was successful and we are on the main page
      cy.contains("h1", "Customer Care").should("be.visible");
      cy.contains("p", "Thank you " + userData.newUser.firstName + " " + userData.newUser.lastName).should("be.visible");
    });
  });

  it("Logout from the website", () => {
    cy.get('a[href*="logout.htm"]').click();
    //Assert that loging out was successful and we are on the main page
    cy.contains("h2", "Customer Login").should("be.visible");
    cy.contains("p", "Username").should("be.visible");
    cy.contains("p", "Password").should("be.visible");
  });

  it("Register using INVALID characters", () => {
    // Find Register link and assert its correct page
    cy.get('a[href*="register.htm"]').click();
    cy.contains("h1", "Signing up is easy!").should("be.visible");
  
    // Fill out the form fields
    cy.get('input[name="customer.firstName"]').type(invalidChars);
    cy.get('input[name="customer.lastName"]').type(invalidChars);
    cy.get('input[name="customer.address.street"]').type(invalidChars);
    cy.get('input[name="customer.address.city"]').type(invalidChars);
    cy.get('input[name="customer.address.state"]').type(invalidChars);
    cy.get('input[name="customer.address.zipCode"]').type(invalidChars);
    cy.get('input[name="customer.phoneNumber"]').type(invalidChars);
    cy.get('input[name="customer.ssn"]').type(invalidChars);
    cy.get('input[name="customer.username"]').type(fakeUsername);
    cy.get('input[name="customer.password"]').type(invalidChars);
    cy.get('input[name="repeatedPassword"]').type(invalidChars);
    cy.get('input[type="submit"][value="Register"]').click();
  
    // Assert that registration was NOT successful
    // Error message unknown, it allows any character?
    cy.contains("p", "Invalid characters not allowed")
      .should("be.visible", { timeout: 5000 })
      .then(() => {
        cy.log("Registration was successful using invalid characters.");
      });
  });
});
