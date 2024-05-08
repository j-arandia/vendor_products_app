describe('product add test', () => {
  it('visits the product page and adds an product', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'products').click();
    cy.contains('control_point').click();
    cy.get('input[formcontrolname=id]').click({ force: true }).type('AD98707');
    cy.get('mat-select[formcontrolname="vendorid"]').click({ force: true });
    cy.get('mat-option').contains('Jassika Arandia').click();
    cy.get('input[formcontrolname=name').click({ force: true }).type('Make up');
    cy.get('input[formcontrolname=msrp').click({ force: true }).type('11.99');
    cy.get('input[formcontrolname=costprice')
      .click({ force: true })
      .type('9.34');
    cy.get('.mat-expansion-indicator').eq(1).click();
    cy.get('input[formcontrolname=rop').clear();
    cy.get('input[formcontrolname=rop').type('40');
    cy.get('input[formcontrolname=eoq').type('60');
    cy.get('input[formcontrolname=qoh').click({ force: true }).type('100');
    cy.get('button').contains('Save').click();
    cy.contains('updated!');
  });
});
