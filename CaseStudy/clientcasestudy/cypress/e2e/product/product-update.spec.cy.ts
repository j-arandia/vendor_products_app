describe('employee update test', () => {
  it('visits the employee page and updates an employee', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'products').click();
    cy.reload();
    cy.contains('AD98707').click();
    cy.get('input[formcontrolname=costprice]').clear();
    cy.get('input[formcontrolname=costprice]').type('109.99');
    cy.get('.mat-expansion-indicator').eq(0).click();
    cy.get('.mat-expansion-indicator').eq(1).click();
    cy.get('input[formcontrolname=rop]').clear();
    cy.get('input[formcontrolname=rop]').type('10');
    cy.contains('Save').click();
    cy.contains('updated!');
  });
});
