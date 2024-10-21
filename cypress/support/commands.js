import 'cypress-wait-until';

Cypress.Commands.add('checkImage', (imageSelector) => {
    cy.get(imageSelector).each(($img) => {
      const src = $img.prop('src');
      cy.request(src).its('status').should('eq', 200);
    });
  });
  