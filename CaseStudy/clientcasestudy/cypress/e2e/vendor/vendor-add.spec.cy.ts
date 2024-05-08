describe('vendor add test', () => {
  it('visits the vendor page and adds an vendor', () => {
    cy.visit('/');
    cy.get('button').click();
    cy.contains('a', 'vendors').click();
    cy.contains('control_point').click();
    cy.get('input[formcontrolname=name')
      .click({ force: true })
      .type('Kim Mingyu');
    cy.get('input[formcontrolname=email')
      .click({ force: true })
      .type('km@svt.com');
    cy.get('input[formcontrolname=phone')
      .click({ force: true })
      .type('(777)1331711');
    cy.get('input[formcontrolname=address1')
      .click({ force: true })
      .type('648 Millbank');
    cy.get('input[formcontrolname=city').click({ force: true }).type('Barrie');
    cy.get('mat-select[formcontrolname="province"]').click({ force: true });
    cy.get('mat-option').contains('Ontario').click();
    cy.get('input[formcontrolname=postalcode')
      .click({ force: true })
      .type('H6H-6H6');
    cy.get('mat-select[formcontrolname="type"]').click({ force: true });
    cy.get('mat-option').contains('Trusted').click();
    cy.get('button').contains('Save').click();
    cy.contains('added!');
  });
});
