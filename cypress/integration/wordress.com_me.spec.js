/// <reference types="cypress" />

context('Testing Wordpress.com/me', () => {
  const USER_NAME = '';
  const PASSWORD = '';

  before(() => {
    cy.getCookies().then(cookies => cookies.forEach(cookie => cy.clearCookie(cookie.name)));

    Cypress.Cookies.defaults({
      preserve: (cookie) => true,
    });

    cy.visit('https://wordpress.com/log-in');
    
    cy.get('#usernameOrEmail').type(USER_NAME);
    cy.get('.login__form-action button[type="submit"]').click();
    cy.get('#password').type(PASSWORD);
    cy.get('.login__form-action button[type="submit"]').click();
    cy.visit('https://wordpress.com/me');
    cy.get('.continue-as-user a.button').click();
    cy.visit('https://wordpress.com/me');
  })

  describe('Wordpress.com/me', () => {
    it('.should() have the appropriate naviagation links', () => {
      cy.get('.sidebar__menu')
        .find('.sidebar__menu-link')
        .should('contain', 'My Profile')
        .should('contain', 'Account Settings')
        .should('contain', 'Purchases')
        .should('contain', 'Security')
        .should('contain', 'Privacy')
        .should('contain', 'Manage Blogs')
        .should('contain', 'Notification Settings')
        .should('contain', 'Blocked Sites')
        .should('contain', 'Get Apps');
    });

    it('.and() the "My Profile" navigation link should be selected', () => {
      cy.get('.sidebar__menu li.selected')
        .find('.sidebar__menu-link-text')
        .should('contain', 'My Profile')
        .and('have.attr', 'data-e2e-sidebar');
    });

    it('.and() have the appropriate form elements', () => {
      cy.get('#first_name').should('exist');
      cy.get('#last_name').should('exist');
      cy.get('#display_name').should('exist');
      cy.get('#description').should('exist');
      cy.get('#inspector-toggle-control-0').should('exist');
      cy.get('.sidebar__me-signout-button').should('exist');
    });
  
    it('.and() log you out when the "log out" button is clicked', () => {
      cy.intercept('/?apppromo').as('login');
      cy.getCookie('wordpress_logged_in').should('exist');
      cy.get('.sidebar__me-signout-button').click();
      cy.wait('@login').then((interception) => {
        cy.getCookie('wordpress_logged_in').should('not.exist');
      });
    });

  })
})
