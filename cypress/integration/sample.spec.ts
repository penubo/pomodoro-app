describe('Pomodoro App Test', () => {
  it('should create a new todo with a given amount of sprint', () => {
    const newTodoName = 'newTodoName';
    cy.visit('http://localhost:8080');
    cy.findByText(/new todo/i).click();
    cy.findByRole('textbox', { name: /title for new todo/i }).type(newTodoName);
    cy.findByRole('button', { name: /increase sprint/i })
      .click()
      .click();
    cy.findByRole('button', { name: /save/i }).click();
    cy.findByText(newTodoName).should('exist');
  });
});
