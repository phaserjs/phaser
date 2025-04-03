# Phaser Tests

This directory contains tests for the Phaser game framework. The tests are written using Jest and are organized to mirror the structure of the Phaser codebase.

## Running Tests

To run the tests, use the following npm commands:

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

The tests are organized in the following structure:

```
/tests
  /unit             # Unit tests for individual components
    /math           # Tests for math utilities
    /geom           # Tests for geometry classes
    /core           # Tests for core functionality
    /gameobjects    # Tests for game objects
    /etc...
  /integration      # Integration tests (future)
  /setup            # Test configuration
    jest.config.js  # Jest configuration
    setup.js        # Global test setup
```

## Writing Tests

When writing tests for Phaser, follow these guidelines:

1. **Mirror the source structure**: Create test files that mirror the structure of the source code.
2. **Naming convention**: Name test files with the `.test.js` suffix.
3. **Test organization**: Use `describe` blocks to group related tests and `it` blocks for individual test cases.
4. **Assertions**: Use Jest's assertion functions like `expect().toBe()`, `expect().toEqual()`, etc.

### Example Test

```javascript
const Vector2 = require("../../../src/math/Vector2");

describe("Phaser.Math.Vector2", function () {
    describe("constructor", function () {
        it("should create a Vector2 with default values", function () {
            const vec = new Vector2();

            expect(vec.x).toBe(0);
            expect(vec.y).toBe(0);
        });

        // More tests...
    });

    // More describe blocks...
});
```

## Contributing Tests

When contributing tests to Phaser:

1. Focus on testing public API methods first.
2. Ensure tests are isolated and don't depend on other tests.
3. Use descriptive test names that explain what is being tested.
4. Test both normal usage and edge cases.
5. Keep tests simple and focused on a single aspect of functionality.

## Test Coverage

The test coverage report can be generated using `npm run test:coverage`. This will create a coverage report in the `/coverage` directory.

## Mocking

For tests that require browser APIs or WebGL context, use the mocks provided in `tests/setup/setup.js`. If you need additional mocks, add them to this file.

## Future Improvements

-   Add integration tests for complex interactions between components
-   Add visual regression tests for rendering
-   Add performance benchmarks
