describe('products delete test', () => {
  it('visits the products page and deletes a product', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'products').click();
    cy.contains('AD98707').click();
    cy.get('button').contains('Delete').click();
    cy.contains('deleted!');
  });
});
