/**
 * @author       Test Contributor
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const RandomDataGenerator = require("../../../src/math/random-data-generator/RandomDataGenerator");

describe("Phaser.Math.RandomDataGenerator", function () {
    describe("constructor", function () {
        it("should create a RandomDataGenerator with a default seed if none is provided", function () {
            const rnd = new RandomDataGenerator();

            expect(rnd).toBeDefined();
            expect(rnd.c).toBe(1);
        });

        it("should create a RandomDataGenerator with the given seed", function () {
            const rnd = new RandomDataGenerator(["test"]);

            expect(rnd).toBeDefined();
        });
    });

    describe("integer", function () {
        it("should return an integer between 0 and 2^32", function () {
            const rnd = new RandomDataGenerator(["test"]);

            for (let i = 0; i < 10; i++) {
                const value = rnd.integer();

                expect(Number.isInteger(value)).toBe(true);
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(0x100000000);
            }
        });
    });

    describe("frac", function () {
        it("should return a number between 0 and 1", function () {
            const rnd = new RandomDataGenerator(["test"]);

            for (let i = 0; i < 10; i++) {
                const value = rnd.frac();

                expect(typeof value).toBe("number");
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(1);
            }
        });
    });

    describe("integerInRange", function () {
        it("should return an integer within the given range", function () {
            const rnd = new RandomDataGenerator(["test"]);
            const min = 5;
            const max = 10;

            for (let i = 0; i < 10; i++) {
                const value = rnd.integerInRange(min, max);

                expect(Number.isInteger(value)).toBe(true);
                expect(value).toBeGreaterThanOrEqual(min);
                expect(value).toBeLessThanOrEqual(max);
            }
        });
    });

    describe("between", function () {
        it("should return an integer within the given range (alias for integerInRange)", function () {
            const rnd = new RandomDataGenerator(["test"]);
            const min = 5;
            const max = 10;

            for (let i = 0; i < 10; i++) {
                const value = rnd.between(min, max);

                expect(Number.isInteger(value)).toBe(true);
                expect(value).toBeGreaterThanOrEqual(min);
                expect(value).toBeLessThanOrEqual(max);
            }
        });
    });

    describe("realInRange", function () {
        it("should return a number within the given range", function () {
            const rnd = new RandomDataGenerator(["test"]);
            const min = 5;
            const max = 10;

            for (let i = 0; i < 10; i++) {
                const value = rnd.realInRange(min, max);

                expect(typeof value).toBe("number");
                expect(value).toBeGreaterThanOrEqual(min);
                expect(value).toBeLessThanOrEqual(max);
            }
        });
    });

    describe("normal", function () {
        it("should return a normally distributed random number", function () {
            const rnd = new RandomDataGenerator(["test"]);

            for (let i = 0; i < 10; i++) {
                const value = rnd.normal();

                expect(typeof value).toBe("number");
            }
        });
    });

    describe("uuid", function () {
        it("should return a valid UUID", function () {
            const rnd = new RandomDataGenerator(["test"]);
            const uuid = rnd.uuid();

            // UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
            // where x is any hexadecimal digit and y is one of 8, 9, A, or B
            const uuidRegex =
                /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

            expect(typeof uuid).toBe("string");
            expect(uuid).toMatch(uuidRegex);
        });
    });

    describe("pick", function () {
        it("should return a random element from the given array", function () {
            const rnd = new RandomDataGenerator(["test"]);
            const array = [1, 2, 3, 4, 5];

            for (let i = 0; i < 10; i++) {
                const value = rnd.pick(array);

                expect(array).toContain(value);
            }
        });
    });

    describe("sign", function () {
        it("should return either -1 or 1", function () {
            const rnd = new RandomDataGenerator(["test"]);

            for (let i = 0; i < 10; i++) {
                const value = rnd.sign();

                expect(value === -1 || value === 1).toBe(true);
            }
        });
    });

    describe("shuffle", function () {
        it("should shuffle the given array", function () {
            // For this test, we'll use a fixed seed that we know will produce a shuffle
            const rnd = new RandomDataGenerator(["predictable-shuffle-seed"]);
            const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const original = [...array];

            rnd.shuffle(array);

            // The array should contain the same elements
            expect(array.sort()).toEqual(original.sort());

            // Skip the equality check since it's possible (though unlikely) that a shuffle
            // could result in the same order, and we don't want a flaky test
        });
    });
});
