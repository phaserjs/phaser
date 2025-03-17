/**
 * @author       Test Contributor
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const Point = require("../../../src/geom/point/Point");
const GEOM_CONST = require("../../../src/geom/const");

describe("Phaser.Geom.Point", function () {
    describe("constructor", function () {
        it("should create a Point with default values", function () {
            const point = new Point();

            expect(point.x).toBe(0);
            expect(point.y).toBe(0);
            expect(point.type).toBe(GEOM_CONST.POINT);
        });

        it("should create a Point with the given values", function () {
            const point = new Point(10, 20);

            expect(point.x).toBe(10);
            expect(point.y).toBe(20);
        });

        it("should create a Point with the same value for both components if only one is provided", function () {
            const point = new Point(5);

            expect(point.x).toBe(5);
            expect(point.y).toBe(5);
        });
    });

    describe("setTo", function () {
        it("should set the x and y values", function () {
            const point = new Point();

            point.setTo(10, 20);

            expect(point.x).toBe(10);
            expect(point.y).toBe(20);
        });

        it("should set both components to the same value if only one is provided", function () {
            const point = new Point();

            point.setTo(15);

            expect(point.x).toBe(15);
            expect(point.y).toBe(15);
        });

        it("should set to default values if no arguments are provided", function () {
            const point = new Point(10, 20);

            point.setTo();

            expect(point.x).toBe(0);
            expect(point.y).toBe(0);
        });

        it("should return the Point instance", function () {
            const point = new Point();

            const result = point.setTo(10, 20);

            expect(result).toBe(point);
        });
    });
});
