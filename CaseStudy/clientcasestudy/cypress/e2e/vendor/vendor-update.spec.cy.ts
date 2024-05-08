describe('vendor update test', () => {
  it('visits the vendor page and updates an vendor', () => {
    cy.visit('/');
    cy.reload;
    cy.get('button').click();
    cy.contains('a', 'vendors').click();
    cy.contains('Kim').click(); // replace Slick with your own name
    cy.get("[type='email']").clear();
    cy.get("[type='email']").type('SVT_Mingyu@17.com');
    cy.contains('Save').click({ force: true });
    cy.contains('updated!');
  });
});
