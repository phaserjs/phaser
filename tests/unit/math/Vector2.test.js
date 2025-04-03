/**
 * @author       Test Contributor
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const Vector2 = require("../../../src/math/Vector2");

describe("Phaser.Math.Vector2", function () {
    describe("constructor", function () {
        it("should create a Vector2 with default values", function () {
            const vec = new Vector2();

            expect(vec.x).toBe(0);
            expect(vec.y).toBe(0);
        });

        it("should create a Vector2 with the given values", function () {
            const vec = new Vector2(5, 10);

            expect(vec.x).toBe(5);
            expect(vec.y).toBe(10);
        });

        it("should create a Vector2 with the same value for both components", function () {
            const vec = new Vector2(7);

            expect(vec.x).toBe(7);
            expect(vec.y).toBe(7);
        });

        it("should create a Vector2 from an object", function () {
            const vec = new Vector2({ x: 3, y: 4 });

            expect(vec.x).toBe(3);
            expect(vec.y).toBe(4);
        });
    });

    describe("clone", function () {
        it("should clone a Vector2", function () {
            const vec = new Vector2(10, 20);
            const clone = vec.clone();

            expect(clone).not.toBe(vec);
            expect(clone.x).toBe(10);
            expect(clone.y).toBe(20);
        });
    });

    describe("copy", function () {
        it("should copy values from another Vector2", function () {
            const vec1 = new Vector2(10, 20);
            const vec2 = new Vector2();

            vec2.copy(vec1);

            expect(vec2.x).toBe(10);
            expect(vec2.y).toBe(20);
        });

        it("should handle missing components", function () {
            const vec = new Vector2(10, 20);

            vec.copy({});

            expect(vec.x).toBe(0);
            expect(vec.y).toBe(0);
        });
    });

    describe("set", function () {
        it("should set x and y values", function () {
            const vec = new Vector2();

            vec.set(10, 20);

            expect(vec.x).toBe(10);
            expect(vec.y).toBe(20);
        });

        it("should set both components to the same value if only one is provided", function () {
            const vec = new Vector2();

            vec.set(15);

            expect(vec.x).toBe(15);
            expect(vec.y).toBe(15);
        });
    });

    describe("equals", function () {
        it("should return true for equal vectors", function () {
            const vec1 = new Vector2(10, 20);
            const vec2 = new Vector2(10, 20);

            expect(vec1.equals(vec2)).toBe(true);
        });

        it("should return false for different vectors", function () {
            const vec1 = new Vector2(10, 20);
            const vec2 = new Vector2(10, 30);

            expect(vec1.equals(vec2)).toBe(false);
        });
    });

    describe("add", function () {
        it("should add another vector", function () {
            const vec1 = new Vector2(10, 20);
            const vec2 = new Vector2(5, 10);

            vec1.add(vec2);

            expect(vec1.x).toBe(15);
            expect(vec1.y).toBe(30);
        });
    });

    describe("subtract", function () {
        it("should subtract another vector", function () {
            const vec1 = new Vector2(10, 20);
            const vec2 = new Vector2(5, 10);

            vec1.subtract(vec2);

            expect(vec1.x).toBe(5);
            expect(vec1.y).toBe(10);
        });
    });

    describe("multiply", function () {
        it("should multiply by another vector", function () {
            const vec1 = new Vector2(10, 20);
            const vec2 = new Vector2(2, 3);

            vec1.multiply(vec2);

            expect(vec1.x).toBe(20);
            expect(vec1.y).toBe(60);
        });
    });

    describe("scale", function () {
        it("should scale the vector", function () {
            const vec = new Vector2(10, 20);

            vec.scale(2);

            expect(vec.x).toBe(20);
            expect(vec.y).toBe(40);
        });
    });

    describe("length", function () {
        it("should calculate the correct length", function () {
            const vec = new Vector2(3, 4);

            expect(vec.length()).toBe(5);
        });
    });

    describe("normalize", function () {
        it("should normalize the vector to a unit vector", function () {
            const vec = new Vector2(3, 4);

            vec.normalize();

            expect(vec.x).toBeCloseTo(0.6);
            expect(vec.y).toBeCloseTo(0.8);
            expect(vec.length()).toBeCloseTo(1);
        });

        it("should handle zero vectors", function () {
            const vec = new Vector2(0, 0);

            vec.normalize();

            expect(vec.x).toBe(0);
            expect(vec.y).toBe(0);
        });
    });
});
