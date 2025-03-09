/**
 * @author       Test Contributor
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const Between = require("../../../src/math/angle/Between");
const Normalize = require("../../../src/math/angle/Normalize");
const Wrap = require("../../../src/math/angle/Wrap");
const WrapDegrees = require("../../../src/math/angle/WrapDegrees");
const Reverse = require("../../../src/math/angle/Reverse");

describe("Phaser.Math.Angle", function () {
    describe("Between", function () {
        it("should calculate the angle between two points", function () {
            // Right (0 radians)
            expect(Between(0, 0, 1, 0)).toBeCloseTo(0);

            // Down (PI/2 radians)
            expect(Between(0, 0, 0, 1)).toBeCloseTo(Math.PI / 2);

            // Left (PI radians)
            expect(Between(0, 0, -1, 0)).toBeCloseTo(Math.PI);

            // Up (-PI/2 radians)
            expect(Between(0, 0, 0, -1)).toBeCloseTo(-Math.PI / 2);

            // Diagonal (PI/4 radians)
            expect(Between(0, 0, 1, 1)).toBeCloseTo(Math.PI / 4);
        });
    });

    describe("Normalize", function () {
        it("should normalize angles to the [0, 2π] range", function () {
            // Already in range
            expect(Normalize(0)).toBe(0);
            expect(Normalize(Math.PI)).toBe(Math.PI);
            expect(Normalize(2 * Math.PI - 0.1)).toBeCloseTo(2 * Math.PI - 0.1);

            // Needs normalization
            expect(Normalize(2 * Math.PI)).toBeCloseTo(0);
            expect(Normalize(2 * Math.PI + 0.5)).toBeCloseTo(0.5);
            expect(Normalize(4 * Math.PI)).toBeCloseTo(0);

            // Negative angles
            expect(Normalize(-Math.PI)).toBeCloseTo(Math.PI);
            expect(Normalize(-2 * Math.PI)).toBeCloseTo(0);
            expect(Normalize(-Math.PI / 2)).toBeCloseTo((3 * Math.PI) / 2);
        });
    });

    describe("Wrap", function () {
        it("should wrap angles to the [-π, π] range", function () {
            // Already in range
            expect(Wrap(0)).toBe(0);
            expect(Wrap(Math.PI / 2)).toBeCloseTo(Math.PI / 2);
            expect(Wrap(-Math.PI / 2)).toBeCloseTo(-Math.PI / 2);
            expect(Wrap(Math.PI)).toBeCloseTo(-Math.PI);
            expect(Wrap(-Math.PI)).toBeCloseTo(-Math.PI);

            // Needs wrapping
            expect(Wrap(Math.PI + 0.5)).toBeCloseTo(-Math.PI + 0.5);
            expect(Wrap(2 * Math.PI)).toBeCloseTo(0);
            expect(Wrap(3 * Math.PI)).toBeCloseTo(-Math.PI);

            // Negative angles
            expect(Wrap(-2 * Math.PI)).toBeCloseTo(0);
            expect(Wrap(-3 * Math.PI)).toBeCloseTo(-Math.PI);
        });
    });

    describe("WrapDegrees", function () {
        it("should wrap angles in degrees to the [0, 360] range", function () {
            // Already in range
            expect(WrapDegrees(0)).toBe(0);
            expect(WrapDegrees(90)).toBe(90);
            expect(WrapDegrees(180)).toBe(-180);
            expect(WrapDegrees(359)).toBe(-1);

            // Needs wrapping
            expect(WrapDegrees(360)).toBe(0);
            expect(WrapDegrees(361)).toBe(1);
            expect(WrapDegrees(720)).toBe(0);
            expect(WrapDegrees(725)).toBe(5);

            // Negative angles
            expect(WrapDegrees(-90)).toBe(-90);
            expect(WrapDegrees(-180)).toBe(-180);
            expect(WrapDegrees(-360)).toBe(0);
            expect(WrapDegrees(-725)).toBe(-5);
        });
    });

    describe("Reverse", function () {
        it("should reverse an angle", function () {
            expect(Reverse(0)).toBeCloseTo(Math.PI);
            expect(Reverse(Math.PI / 2)).toBeCloseTo(Math.PI * 1.5);
            expect(Reverse(Math.PI)).toBeCloseTo(0);
            expect(Reverse(-Math.PI / 2)).toBeCloseTo(Math.PI / 2);
        });
    });
});
