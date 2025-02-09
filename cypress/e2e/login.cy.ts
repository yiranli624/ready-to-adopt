describe("testing login page user flow", () => {
  it("should be redirected to login page when visiting home page", () => {
    cy.visit("http://localhost:3000");
    cy.url().should("include", "/login");

    cy.get('[name="name"]').type("test");
    cy.get('[name="email"]').type("test@gmail.com");

    cy.get('[type="reset"]').should("contain", "Reset").click();
    cy.get('[name="name"]').should("be.empty").type("test");
    cy.get('[name="email"]').should("be.empty").type("test@gmail.com");

    cy.get('[type="submit"]').should("contain", "Submit").click();
    cy.url().should("include", "/dogs");
  });
});
