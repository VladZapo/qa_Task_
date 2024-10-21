describe('Dropdown List Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('a[href="/dropdown"]').click();
    cy.url().should('include', '/dropdown');
  });

  it('should select Option 1 and verify', () => {
    cy.get('#dropdown').select('Option 1').should('have.value', '1');
    // Verify that the selected option is correctly displayed
    cy.get('#dropdown option:selected').should('have.text', 'Option 1');
  });

  it('should select Option 2 and verify', () => {
    cy.get('#dropdown').select('Option 2').should('have.value', '2');
    // Verify that the selected option is correctly displayed
    cy.get('#dropdown option:selected').should('have.text', 'Option 2');
  });

  it('should verify that the "Please select an option" is disabled and the value already selected is not changed', () => {
    // Select Option 1
    cy.get('#dropdown').select('Option 1').should('have.value', '1');

    // Check that the "Please select an option" exists and is disabled
    cy.get('select#dropdown option[value=""]').should('exist')
      .and('have.text', 'Please select an option')
      .and('be.disabled'); // Verify it is disabled

    // Verify that the value has not changed (should still be Option 1)
    cy.get('#dropdown').should('have.value', '1');

    // Check that no option is selected other than "Option 1"
    cy.get('#dropdown option:selected').should('have.text', 'Option 1');
  });

  it('should validate the dropdown options', () => {
    const expectedOptions = [
      'Please select an option',
      'Option 1',
      'Option 2',
    ];

    cy.get('select#dropdown option').each(($option, index) => {
      cy.wrap($option).should('have.text', expectedOptions[index]);
      // Optionally check the value attributes match expected values
      const expectedValue = index === 0 ? '' : (index + '').toString();
      cy.wrap($option).should('have.value', expectedValue);
    });
  });
});

describe('Broken Images Tests', () => {
  beforeEach(() => {
    // Visit the page containing the images in other mode
    cy.visit('/broken_images');
  });

  const brokenImages = [{
      src: 'asdf.jpg',
      expectedStatus: 404
    },
    {
      src: 'hjkl.jpg',
      expectedStatus: 404
    },
  ];

  brokenImages.forEach(({
    src,
    expectedStatus
  }) => {
    it(`should verify that the image ${src} is broken (expected status: ${expectedStatus})`, () => {
      const imgSelector = `img[src="${src}"]`;

      // Ensure the image exists in the DOM
      cy.get(imgSelector).should('exist');

      // Make a request to check if the image loads successfully
      cy.request({
        url: `https://the-internet.herokuapp.com/${src}`, // Construct full URL
        failOnStatusCode: false, // Prevent failing the test on non-200 responses
      }).then((response) => {
        // Assert that the status is 404
        expect(response.status).to.eq(expectedStatus);
        cy.log(`Checked image: ${src} (Status: ${response.status})`);
      });
    });
  });

  it('should verify that all images are present and load successfully, if not, log the broken images', () => {
    // Get all images
    cy.get('.example img').each(($img) => {
      const src = $img.prop('src');

      // Check if the image is visible
      cy.wrap($img).should('be.visible');

      // Make a request to check if the image loads successfully
      cy.request({
        url: src,
        failOnStatusCode: false, // Prevent failing the test on non-200 responses
      }).then((response) => {
        // Log broken images and their statuses
        if (response.status !== 200 && response.status !== 304) {
          cy.log(`Broken image found: ${src} (Status: ${response.status})`);
          // Assert that the status is not 200 or 304 to fail the test
          expect(response.status).to.not.be.oneOf([200, 304]);
        } else {
          // Assert image loads successfully
          expect(response.status).to.be.oneOf([200, 304]);
        }
      });
    });
  });

  it('should report known broken images', () => {
    const validImages = [
      'asdf.jpg',
      'hjkl.jpg',
      'img/avatar-blank.jpg',
    ];

    // Iterate over valid images and check if they load
    validImages.forEach((image) => {
      cy.get(`img[src="${image}"]`).should('exist').and('be.visible');

      // Construct full URL
      const src = `https://the-internet.herokuapp.com/${image}`;

      cy.request({
        url: src,
        failOnStatusCode: false,
      }).then((response) => {
        // Log broken images and their statuses
        if (response.status !== 200 && response.status !== 304) {
          cy.log(`Broken image found: ${src} (Status: ${response.status})`);
          // Assert that the status is not 200 or 304 to fail the test
          expect(response.status).to.not.be.oneOf([200, 304]);
        } else {
          expect(response.status).to.be.oneOf([200, 304]); // Validate accessible images
        }
      });
    });
  });
});




describe('Dynamic Loading Tests', () => {
  beforeEach(() => {

    cy.visit('/dynamic_loading');
    cy.visit('/');
    cy.get('a[href="/dynamic_loading"]').click();
    cy.url().should('include', '/dynamic_loading');
  });

  it('should verify that the hidden element is present in the DOM', () => {
    cy.get('a[href="/dynamic_loading/1"]').click();
    cy.url().should('include', '/dynamic_loading/1');

    // Check that the #finish element exists in the DOM
    cy.get('#finish')
      .should('exist')
      .and('have.css', 'display', 'none'); // Assert that it has display: none
  });

  it('should load the hidden element after clicking the "Start" button', () => {
    cy.get('a[href="/dynamic_loading/1"]').click();
    cy.url().should('include', '/dynamic_loading/1');

    // Ensure the loading element is not presented in page  initaly
    cy.get('#loading').should('not.exist');

    // Click the "Start" button to initiate loading
    cy.get('#start button').click();

    // Assert that the loading element is visible
    cy.get('#loading').should('be.visible');

    // Wait until the finish element becomes visible
    cy.waitUntil(() => cy.get('#finish').then($el => $el.is(':visible')));

    // Assert that the finish element is now visible
    cy.get('#finish').should('be.visible');

    // Assert that the correct content is displayed
    cy.get('#finish h4').should('have.text', 'Hello World!');
  });

  it('should verify that the element is not present in the DOM', () => {
    cy.get(`a[href="/dynamic_loading/2"]`).click();
    cy.url().should('include', '/dynamic_loading/2');

    // Check that the #finish element exists in the DOM
    cy.get('#finish')
      .should('not.exist');
  });

  it('should not find the #finish element initially and it gets added to the DOM', () => {
    cy.get('a[href="/dynamic_loading/2"]').click();
    cy.url().should('include', '/dynamic_loading/2');

    // Check that the #finish element is not present initially
    cy.get('#finish').should('not.exist'); // Assert it does not exist yet

    // Click the "Start" button to initiate loading
    cy.get('#start button').click();

    // Assert that the loading element is visible
    cy.get('#loading').should('be.visible');

    // Wait for the loading to finish and the #finish element to appear
    cy.get('#finish', {
      timeout: 10000
    }).should('exist').and('be.visible'); // Wait for it to appear

    // Assert that the correct content is displayed
    cy.get('#finish h4').should('have.text', 'Hello World!');
  });
});

describe('Redirect Link Tests', () => {
  beforeEach(() => {
    cy.visit('/'); 
  });

  it('should navigate to the Status Codes page', () => {
    // Click on the Status Codes link
    cy.get('a[href="/status_codes"]').click();
    
    // Validate that the URL includes /status_codes
    cy.url().should('include', '/status_codes');
  });

  
    it('should navigate to the Redirect Link page', () => {
      // Click on the Redirect Link
      cy.get('a[href="/redirector"]').click();
      
      // Validate that the URL includes /redirector
      cy.url().should('include', '/redirector');
    });
  
    it('should trigger a redirect to the Status Codes page', () => {
      // Click on the Redirect Link
      cy.get('a[href="/redirector"]').click();
      
      // Click the link that triggers the redirect
      cy.get('a#redirect').click();
  
      // Validate that the URL includes /status_codes
      cy.url().should('include', 'status_codes');
    });
  
    it('should verify the presence of status code links', () => {
      // Click on the Redirect Link to go to Status Codes
      cy.get('a[href="/redirector"]').click();
      cy.get('a#redirect').click();
      
      // Validate that the links to status codes are present
      cy.contains('200').should('exist');
      cy.contains('301').should('exist');
      cy.contains('404').should('exist');
      cy.contains('500').should('exist');
    });
  
    it('should navigate to the 200 status code page and validate content', () => {
      cy.get('a[href="/redirector"]').click();
      cy.get('a#redirect').click();
      cy.contains('200').click();
      
      // Validate that the URL includes the 200 status code
      cy.url().should('include', 'status_codes/200');
      cy.contains('This page returned a 200 status code.').should('exist'); // Adjust based on actual content
    });
  
    it('should navigate to the 301 status code page and validate content', () => {
      cy.get('a[href="/redirector"]').click();
      cy.get('a#redirect').click();
      cy.contains('301').click();
      
      // Validate that the URL includes the 301 status code
      cy.url().should('include', 'status_codes/301');
      cy.contains('This page returned a 301 status code.').should('exist'); // Adjust based on actual content
    });
  
    it('should navigate to the 404 status code page and validate content', () => {
      cy.get('a[href="/redirector"]').click();
      cy.get('a#redirect').click();
      cy.contains('404').click();
      
      // Validate that the URL includes the 404 status code
      cy.url().should('include', 'status_codes/404');
      cy.contains('This page returned a 404 status code.').should('exist'); // Adjust based on actual content
    });
  
    it('should navigate to the 500 status code page and validate content', () => {
      cy.get('a[href="/redirector"]').click();
      cy.get('a#redirect').click();
      cy.contains('500').click();
      
      // Validate that the URL includes the 500 status code
      cy.url().should('include', 'status_codes/500');
      cy.contains('This page returned a 500 status code.').should('exist'); // Adjust based on actual content
    });
    
});
