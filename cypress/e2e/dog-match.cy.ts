describe("testing happy path for user to match a dog", () => {
  it("should be able to browsing dogs, filter by breed, sort by variaous of conditions, and match a dog", () => {
    cy.visit("http://localhost:3000");
    cy.get('[name="name"]').type("Jane");
    cy.get('[name="email"]').type("jane@gmail.com");
    cy.get('[type="submit"]').should("contain", "Submit").click();
    cy.wait(500);

    cy.get('[data-test-id="total-dogs"]').should(
      "contain",
      "Total Available dogs: 10000"
    );
    cy.get("button").contains("Ready to match").should("be.disabled");
    cy.scrollTo("center");

    cy.get('[data-test-id="U3GFTIcBOvEgQ5OCx8A2"] > div')
      .should("have.css", "background-image")
      .and(
        "include",
        "https://frontend-take-home.fetch.com/dog-images/n02110627-affenpinscher/n02110627_11853.jpg"
      );

    cy.get('[data-test-id="U3GFTIcBOvEgQ5OCx8A2"] p')
      .should("contain", "SABINA")
      .and("contain", "Affenpinscher")
      .and("contain", "9 years old")
      .and("contain", "Denver, CO")
      .and("contain", "80264");

    cy.get('[data-test-id="U3GFTIcBOvEgQ5OCx8A2"]').click();
    cy.scrollTo("bottom");
    cy.get("button").contains("Next").click();

    cy.get('[data-test-id="sXGFTIcBOvEgQ5OCx8A2"] p').should("contain", "ZANE");
    cy.get('[data-test-id="sXGFTIcBOvEgQ5OCx8A2"]').click();

    cy.get("button")
      .contains("Ready to match")
      .should("not.be.disabled")
      .click();

    cy.wait(500);
    cy.get('[data-test-id="dogs-section"] > div').should("have.length", 1);

    cy.get("button").contains("Try again").should("be.visible").click();
    cy.get('[data-test-id="dogs-section"] > div').should("have.length", 25);

    cy.get("button").contains("Oldest").should("be.visible").click();
    cy.get('[data-test-id="dogs-section"] > div:first p').should(
      "contain",
      "JENIFER"
    );

    cy.get("button").contains("Youngest").should("be.visible").click();
    cy.get('[data-test-id="dogs-section"] > div:first p').should(
      "contain",
      "GARNETT"
    );

    cy.get("button").contains("Breed(A-Z)").should("be.visible").click();
    cy.get('[data-test-id="dogs-section"] > div:first p').should(
      "contain",
      "YOLANDA"
    );

    cy.get("button").contains("Breed(Z-A)").should("be.visible").click();
    cy.get('[data-test-id="dogs-section"] > div:first p').should(
      "contain",
      "CLARABELLE"
    );

    cy.get("button").contains("Name(A-Z)").should("be.visible").click();
    cy.get('[data-test-id="dogs-section"] > div:first p').should(
      "contain",
      "AALIYAH"
    );

    cy.get("button").contains("Name(Z-A)").should("be.visible").click();
    cy.get('[data-test-id="dogs-section"] > div:first p').should(
      "contain",
      "Bloodhound"
    );

    cy.get('[data-test-id="select-breed"]')
      .contains("Any Breed")
      .click({ force: true });
    cy.get('ul[role="listbox"] span')
      .contains("Airedale")
      .click({ force: true });

    cy.get('[data-test-id="dogs-section"] > div:first p').should(
      "contain",
      "LULU"
    );
  });
});
