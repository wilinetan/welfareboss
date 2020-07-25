import { createSelector } from "../utils";

const TEST_TELEUSER_PATH = "Computing/ids/123456789";

const fakeUser = {
  name: "Bob Tan",
  matric: "A1234567H",
  teleid: 123456789,
  collected: false,
  surveyVerified: false,
  queueNum: -1,
  faculty:
    "https://www.google.com/search?q=black+sqaure&tbm=isch&ved=2ahUKEwjAjayS25_qAhXOeX0KHUWwDiAQ2-cCegQIABAA&oq=black+sqaure&gs_lcp=CgNpbWcQAzIECAAQQzICCAAyAggAMgIIADICCAAyAggAMgIIADIGCAAQBxAeMgYIABAHEB4yBggAEAgQHlDXEljXEmDSFGgAcAB4AIABN4gBN5IBATGYAQCgAQGqAQtnd3Mtd2l6LWltZw&sclient=img&ei=9wj2XoA2zvP1A8XguoAC&bih=789&biw=1440#imgrc=UW_EthV1IXKg3M",
  nussu:
    "https://www.google.com/search?q=dark+pink+sqaure&tbm=isch&ved=2ahUKEwjiirKm25_qAhUjkksFHXyHBiUQ2-cCegQIABAA&oq=dark+pink+sqaure&gs_lcp=CgNpbWcQAzoCCAA6BggAEAcQHjoICAAQCBAHEB46BggAEAoQGFD7G1juJGCBJ2gAcAB4AIABPYgBlgOSAQE5mAEAoAEBqgELZ3dzLXdpei1pbWc&sclient=img&ei=IQn2XqL2AqOkrtoP_I6aqAI&bih=789&biw=1440#imgrc=I0_Vmk0a9d1PEM",
};

describe("Queue List", () => {
  before(() => {
    // Login using custom token
    cy.login();
    // Go to home page
    cy.visit("http://localhost:3000/home");

    // Seed database with fake user
    cy.callRtdb("set", TEST_TELEUSER_PATH, fakeUser);
  });

  after(() => {
    // Remove the teleuser from database
    cy.callRtdb("remove", TEST_TELEUSER_PATH);
    // Set the currQueueNum and currServing to original number
    cy.callRtdb("update", "Computing/queueDetails", {
      currQueueNum: 0,
      currServing: 0,
    });
    // Log out
    cy.logout();
  });

  describe("User with no queue number yet", () => {
    it("User should not be shown in Queue List", () => {
      cy.get(createSelector("queuelist-123456789")).should("not.exist");
    });
  });

  describe("User with queue number", () => {
    before(() => {
      cy.callRtdb("update", TEST_TELEUSER_PATH, { queueNum: 5 });
      cy.callRtdb("update", "Computing/queueDetails", { currQueueNum: 5 });
    });

    it("After updating queue number, user should be in Queue List with correct details", () => {
      cy.get(createSelector("queuelist-123456789")).should("exist");

      // Check that queue number is correct
      cy.get(createSelector("queuelist-123456789"))
        .contains("td", 5)
        .should("be.visible");

      // Check that name is correct
      cy.get(createSelector("queuelist-123456789"))
        .contains("td", "Bob Tan")
        .should("be.visible");

      // Check that matric number is correct
      cy.get(createSelector("queuelist-123456789"))
        .contains("td", "A1234567H")
        .should("be.visible");
    });

    it("Current Queue Number should be updated", () => {
      cy.get(createSelector("dashboard-currQueueNum")).should("have.text", "5");
    });
  });

  describe("View survey image when clicked", () => {
    it("Image should not be shown when first rendered", () => {
      cy.get(createSelector("facultysurvey-123456789"))
        .find("img")
        .should("not.exist");
    });

    it("Image should be shown when button is clicked", () => {
      cy.get(createSelector("facultysurvey-123456789")).find("button").click();
      cy.get(createSelector("facultysurvey-123456789"))
        .find("img")
        .should("have.attr", "src")
        .should("include", fakeUser.faculty);
    });
  });

  describe("Verify survey images", () => {
    it("Verified checkbox should be unchecked at first", () => {
      cy.get(createSelector("verified-123456789"))
        .find('[type="checkbox"]')
        .should("not.have.attr", "checked");
    });

    it("Database should be updated after checking checkbox", () => {
      // Check the verified checkbox
      cy.get(createSelector("verified-123456789"))
        .find('[type="checkbox"]')
        .check();
      // .should("be.checked");

      // Checks if user's data in database is updated
      cy.callRtdb("get", TEST_TELEUSER_PATH).then((user) => {
        cy.wrap(user).its("surveyVerified").should("equal", true);
      });
    });
  });

  describe("When student has collected", () => {
    it("Collected checkbox should be unchecked at first", () => {
      cy.get(createSelector("collected-123456789"))
        .find('[type="checkbox"]')
        .should("not.have.attr", "checked");
    });

    it("Database should be updated after checking checkbox", () => {
      // Check the completed checkbox
      cy.get(createSelector("collected-123456789"))
        .find('[type="checkbox"]')
        .check();
      // .should("be.checked");

      // Checks if user's data in database is updated
      cy.callRtdb("get", TEST_TELEUSER_PATH).then((user) => {
        cy.wrap(user).its("collected").should("equal", true);
      });

      // Checks if current serving queue number is updated
      cy.callRtdb("get", "Computing/queueDetails").then((details) => {
        cy.wrap(details).its("currServing").should("equal", 5);
      });
    });
  });
});
