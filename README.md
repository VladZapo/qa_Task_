Vlad Zapodeanu -QA task. - vlad.zapodeanu@gmail.com
## Description
This project is a collection of automated tests using Cypress, focusing on various web application functionalities, including dropdown interactions, image validation, dynamic loading, and redirect link handling. Each feature is organized into separate `describe` blocks within a single file to maintain clarity and cohesion while allowing for easier execution of related tests together.

## Why Separate Describes?

1. **Cohesive Grouping**: By grouping related tests into distinct `describe` blocks, we can clearly delineate functionalities. This enhances readability and allows for easier maintenance of the test cases.

2. **Simplified Test Execution**: Running all tests in a single file reduces the complexity of managing multiple files, especially when dealing with related tests. This makes it easier to execute tests as a whole or in specific segments without the overhead of file navigation.

3. **Reduced Overhead**: Fewer files mean less configuration and setup time, allowing for quicker iteration during development and debugging.

## Steps to Open and Run the Project

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. **Install Dependencies**:
   Ensure you have Node.js and npm installed. Then, run the following command to install the necessary dependencies:
   ```bash
   npm install
   ```

3. **Open Cypress & run tests**:
   To open the Cypress Test Runner, execute the following command:
   ```bash
   npx cypress open
   ```
   Once the Cypress Test Runner is open, you can select the spec file containing the tests you want to run. The tests will execute in the browser, allowing you to view the results interactively.

4. **Run Headless Tests (Optional)**:
   If you want to run the tests in headless mode (for CI/CD integration), use:
   ```bash
   npx cypress run
   ```

## Conclusion

By following these steps, you'll be able to open and run the tests seamlessly.
