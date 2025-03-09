# Contributing Tests to Phaser

Thank you for your interest in contributing tests to Phaser! This document provides guidelines for writing and submitting tests.

## Getting Started

1. Make sure you have Node.js installed.
2. Clone the Phaser repository.
3. Install dependencies with `npm install`.
4. Run the tests with `npm test`.

## Test Structure

Tests are organized to mirror the structure of the Phaser codebase. For example, if you're testing a class in `src/math/Vector2.js`, the test file should be in `tests/unit/math/Vector2.test.js`.

## Writing Tests

### Basic Test Structure

```javascript
const MyClass = require("../../../src/path/to/MyClass");

describe("Phaser.Path.MyClass", function () {
    describe("methodName", function () {
        it("should do something specific", function () {
            // Arrange
            const instance = new MyClass();

            // Act
            const result = instance.methodName();

            // Assert
            expect(result).toBe(expectedValue);
        });
    });
});
```

### Best Practices

1. **Test one thing per test**: Each `it` block should test a single aspect of behavior.
2. **Use descriptive names**: Test names should clearly describe what is being tested.
3. **Arrange-Act-Assert**: Structure your tests with clear setup, action, and assertion phases.
4. **Test edge cases**: Include tests for boundary conditions and error cases.
5. **Keep tests independent**: Tests should not depend on the state from other tests.
6. **Avoid test interdependence**: Each test should be able to run in isolation.

### What to Test

Focus on testing:

1. **Public API methods**: Test the public interface of classes and modules.
2. **Edge cases**: Test boundary conditions and error handling.
3. **Complex logic**: Test complex algorithms and calculations.
4. **Regression cases**: Add tests for bugs that have been fixed.

### What Not to Test

Avoid testing:

1. **Implementation details**: Test behavior, not implementation.
2. **Framework internals**: Focus on testing Phaser's public API.
3. **Trivial code**: Simple getters/setters may not need extensive testing.

## Mocking

For tests that require browser APIs or WebGL context, use the mocks provided in `tests/setup/setup.js`. If you need additional mocks, add them to this file.

```javascript
// Example of mocking a browser API
global.requestAnimationFrame = jest.fn((callback) => setTimeout(callback, 0));
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Submitting Tests

1. Make sure your tests pass: `npm test`.
2. Follow the Phaser coding style.
3. Submit a pull request with your tests.
4. In your pull request description, explain what you're testing and why.

## Test Coverage

Aim for high test coverage, but prioritize meaningful tests over coverage percentage. A few well-designed tests are better than many superficial ones.

## Questions?

If you have questions about testing Phaser, please ask in the Phaser Discord or open an issue on GitHub.
