import { createSelector } from "../utils";

describe("Home Page", () => {
  describe("when not authenticated", () => {
    before(() => {
      cy.logout();
      // Attempt to go to /home (requires user to be logged in)
      cy.visit("http://localhost:3000/home");
    });

    it("Redirects to Sign In page (/)", () => {
      cy.url().should("equal", "http://localhost:3000/signin");
    });

    it("Should not display Home and Account tabs in Navigation bar", () => {
      cy.get(createSelector("homepage-btn")).should("not.exist");
      cy.get(createSelector("accountpage-btn")).should("not.exist");
    });
  });

  describe("when authenticated", () => {
    before(() => {
      // Login using custom token
      cy.login();
      // Go to /home (which requires user to be logged in)
      cy.visit("http://localhost:3000/home");
    });

    it("Does not redirect", () => {
      cy.url().should("equal", "http://localhost:3000/home");
    });

    it("Should display Home and Account tabs in Navigation bar", () => {
      cy.get(createSelector("homepage-btn")).should("exist");
      cy.get(createSelector("accountpage-btn")).should("exist");
    });

    it("Shows Dashboard", () => {
      cy.get(createSelector("dashboard")).should("exist");
    });

    it("Shows Queue List", () => {
      cy.get(createSelector("queuelist")).should("exist");
    });

    it("Has Sign out button", () => {
      cy.get(createSelector("signout-btn")).click();
      cy.url().should("include", "http://localhost:3000/");
    });
  });
});
