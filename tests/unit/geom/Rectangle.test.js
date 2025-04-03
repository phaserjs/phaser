/**
 * @author       Test Contributor
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

const Rectangle = require("../../../src/geom/rectangle/Rectangle");
const Point = require("../../../src/geom/point/Point");

describe("Phaser.Geom.Rectangle", function () {
    describe("constructor", function () {
        it("should create a Rectangle with default values", function () {
            const rect = new Rectangle();

            expect(rect.x).toBe(0);
            expect(rect.y).toBe(0);
            expect(rect.width).toBe(0);
            expect(rect.height).toBe(0);
        });

        it("should create a Rectangle with the given values", function () {
            const rect = new Rectangle(10, 20, 30, 40);

            expect(rect.x).toBe(10);
            expect(rect.y).toBe(20);
            expect(rect.width).toBe(30);
            expect(rect.height).toBe(40);
        });
    });

    describe("contains", function () {
        it("should detect points inside the rectangle", function () {
            const rect = new Rectangle(10, 10, 100, 100);

            expect(rect.contains(10, 10)).toBe(true); // Top-left corner
            expect(rect.contains(110, 10)).toBe(true); // Top-right corner
            expect(rect.contains(10, 110)).toBe(true); // Bottom-left corner
            expect(rect.contains(110, 110)).toBe(true); // Bottom-right corner
            expect(rect.contains(60, 60)).toBe(true); // Center
        });

        it("should detect points outside the rectangle", function () {
            const rect = new Rectangle(10, 10, 100, 100);

            expect(rect.contains(9, 10)).toBe(false); // Left of left edge
            expect(rect.contains(111, 10)).toBe(false); // Right of right edge
            expect(rect.contains(10, 9)).toBe(false); // Above top edge
            expect(rect.contains(10, 111)).toBe(false); // Below bottom edge
        });
    });

    describe("setTo", function () {
        it("should set the position and size of the rectangle", function () {
            const rect = new Rectangle();

            rect.setTo(10, 20, 30, 40);

            expect(rect.x).toBe(10);
            expect(rect.y).toBe(20);
            expect(rect.width).toBe(30);
            expect(rect.height).toBe(40);
        });
    });

    describe("setEmpty", function () {
        it("should reset the rectangle to empty state", function () {
            const rect = new Rectangle(10, 20, 30, 40);

            rect.setEmpty();

            expect(rect.x).toBe(0);
            expect(rect.y).toBe(0);
            expect(rect.width).toBe(0);
            expect(rect.height).toBe(0);
        });
    });

    describe("setPosition", function () {
        it("should set the position of the rectangle", function () {
            const rect = new Rectangle(10, 20, 30, 40);

            rect.setPosition(50, 60);

            expect(rect.x).toBe(50);
            expect(rect.y).toBe(60);
            expect(rect.width).toBe(30);
            expect(rect.height).toBe(40);
        });

        it("should set both coordinates to the same value if only one is provided", function () {
            const rect = new Rectangle(10, 20, 30, 40);

            rect.setPosition(50);

            expect(rect.x).toBe(50);
            expect(rect.y).toBe(50);
            expect(rect.width).toBe(30);
            expect(rect.height).toBe(40);
        });
    });

    describe("setSize", function () {
        it("should set the size of the rectangle", function () {
            const rect = new Rectangle(10, 20, 30, 40);

            rect.setSize(50, 60);

            expect(rect.x).toBe(10);
            expect(rect.y).toBe(20);
            expect(rect.width).toBe(50);
            expect(rect.height).toBe(60);
        });

        it("should set both dimensions to the same value if only one is provided", function () {
            const rect = new Rectangle(10, 20, 30, 40);

            rect.setSize(50);

            expect(rect.x).toBe(10);
            expect(rect.y).toBe(20);
            expect(rect.width).toBe(50);
            expect(rect.height).toBe(50);
        });
    });

    describe("isEmpty", function () {
        it("should return true for empty rectangles", function () {
            expect(new Rectangle(0, 0, 0, 0).isEmpty()).toBe(true);
            expect(new Rectangle(10, 10, 0, 10).isEmpty()).toBe(true);
            expect(new Rectangle(10, 10, 10, 0).isEmpty()).toBe(true);
            expect(new Rectangle(10, 10, -5, 10).isEmpty()).toBe(true);
            expect(new Rectangle(10, 10, 10, -5).isEmpty()).toBe(true);
        });

        it("should return false for non-empty rectangles", function () {
            expect(new Rectangle(0, 0, 1, 1).isEmpty()).toBe(false);
            expect(new Rectangle(10, 10, 10, 10).isEmpty()).toBe(false);
        });
    });

    describe("getRandomPoint", function () {
        it("should return a point within the rectangle", function () {
            const rect = new Rectangle(10, 20, 30, 40);
            const point = rect.getRandomPoint();

            expect(point.x).toBeGreaterThanOrEqual(10);
            expect(point.x).toBeLessThanOrEqual(40); // x + width
            expect(point.y).toBeGreaterThanOrEqual(20);
            expect(point.y).toBeLessThanOrEqual(60); // y + height
        });

        it("should update the provided point object", function () {
            const rect = new Rectangle(10, 20, 30, 40);
            const point = new Point(0, 0);

            const result = rect.getRandomPoint(point);

            expect(result).toBe(point);
            expect(point.x).toBeGreaterThanOrEqual(10);
            expect(point.x).toBeLessThanOrEqual(40); // x + width
            expect(point.y).toBeGreaterThanOrEqual(20);
            expect(point.y).toBeLessThanOrEqual(60); // y + height
        });
    });
});
