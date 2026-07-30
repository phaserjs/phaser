var Circle = require('../../../src/geom/circle/Circle');

describe('Circle', function ()
{
    describe('Constructor', function ()
    {
        it('should create a circle with default values', function ()
        {
            var circle = new Circle();
            expect(circle.x).toBe(0);
            expect(circle.y).toBe(0);
            expect(circle.radius).toBe(0);
            expect(circle.diameter).toBe(0);
        });

        it('should create a circle with given values', function ()
        {
            var circle = new Circle(10, 20, 50);
            expect(circle.x).toBe(10);
            expect(circle.y).toBe(20);
            expect(circle.radius).toBe(50);
            expect(circle.diameter).toBe(100);
        });

        it('should set diameter to twice the radius', function ()
        {
            var circle = new Circle(0, 0, 7);
            expect(circle.diameter).toBe(14);
        });

        it('should have the correct type constant', function ()
        {
            var circle = new Circle();
            expect(circle.type).toBe(0);
        });

        it('should handle floating point values', function ()
        {
            var circle = new Circle(1.5, 2.5, 3.5);
            expect(circle.x).toBeCloseTo(1.5);
            expect(circle.y).toBeCloseTo(2.5);
            expect(circle.radius).toBeCloseTo(3.5);
        });

        it('should handle negative position values', function ()
        {
            var circle = new Circle(-10, -20, 5);
            expect(circle.x).toBe(-10);
            expect(circle.y).toBe(-20);
            expect(circle.radius).toBe(5);
        });
    });

    describe('contains', function ()
    {
        it('should return true for the center point', function ()
        {
            var circle = new Circle(0, 0, 10);
            expect(circle.contains(0, 0)).toBe(true);
        });

        it('should return true for a point inside the circle', function ()
        {
            var circle = new Circle(0, 0, 10);
            expect(circle.contains(5, 5)).toBe(true);
        });

        it('should return false for a point outside the circle', function ()
        {
            var circle = new Circle(0, 0, 10);
            expect(circle.contains(20, 20)).toBe(false);
        });

        it('should return true for a point on the circumference', function ()
        {
            var circle = new Circle(0, 0, 10);
            expect(circle.contains(10, 0)).toBe(true);
        });

        it('should work with non-origin center', function ()
        {
            var circle = new Circle(50, 50, 10);
            expect(circle.contains(50, 50)).toBe(true);
            expect(circle.contains(55, 55)).toBe(true);
            expect(circle.contains(0, 0)).toBe(false);
        });

        it('should return false for an empty circle', function ()
        {
            var circle = new Circle(0, 0, 0);
            expect(circle.contains(0, 0)).toBe(false);
        });
    });

    describe('getPoint', function ()
    {
        it('should return an object with x and y properties', function ()
        {
            var circle = new Circle(0, 0, 10);
            var point = circle.getPoint(0);
            expect(point).toBeDefined();
            expect(typeof point.x).toBe('number');
            expect(typeof point.y).toBe('number');
        });

        it('should return the topmost point at position 0', function ()
        {
            var circle = new Circle(0, 0, 10);
            var point = circle.getPoint(0);
            expect(point.x).toBeCloseTo(10);
            expect(point.y).toBeCloseTo(0);
        });

        it('should return the leftmost point at position 0.25', function ()
        {
            var circle = new Circle(0, 0, 10);
            var point = circle.getPoint(0.25);
            expect(point.x).toBeCloseTo(0, 0);
            expect(point.y).toBeCloseTo(10, 0);
        });

        it('should return the opposite side at position 0.5', function ()
        {
            var circle = new Circle(0, 0, 10);
            var point = circle.getPoint(0.5);
            expect(point.x).toBeCloseTo(-10);
            expect(point.y).toBeCloseTo(0, 0);
        });

        it('should use the provided out object', function ()
        {
            var circle = new Circle(0, 0, 10);
            var out = { x: 0, y: 0 };
            var result = circle.getPoint(0, out);
            expect(result).toBe(out);
        });

        it('should offset correctly with non-origin center', function ()
        {
            var circle = new Circle(100, 200, 10);
            var point = circle.getPoint(0);
            expect(point.x).toBeCloseTo(110);
            expect(point.y).toBeCloseTo(200);
        });
    });

    describe('getPoints', function ()
    {
        it('should return an array of points', function ()
        {
            var circle = new Circle(0, 0, 10);
            var points = circle.getPoints(4);
            expect(Array.isArray(points)).toBe(true);
            expect(points.length).toBe(4);
        });

        it('should return points with x and y properties', function ()
        {
            var circle = new Circle(0, 0, 10);
            var points = circle.getPoints(4);
            points.forEach(function (point)
            {
                expect(typeof point.x).toBe('number');
                expect(typeof point.y).toBe('number');
            });
        });

        it('should populate a provided output array', function ()
        {
            var circle = new Circle(0, 0, 10);
            var output = [];
            var result = circle.getPoints(4, null, output);
            expect(result).toBe(output);
            expect(output.length).toBe(4);
        });

        it('should derive quantity from stepRate when quantity is falsy', function ()
        {
            var circle = new Circle(0, 0, 10);
            var circumference = 2 * Math.PI * 10;
            var stepRate = circumference / 4;
            var points = circle.getPoints(0, stepRate);
            expect(points.length).toBe(4);
        });

        it('should return points on the circumference', function ()
        {
            var circle = new Circle(0, 0, 10);
            var points = circle.getPoints(8);
            points.forEach(function (point)
            {
                var dist = Math.sqrt(point.x * point.x + point.y * point.y);
                expect(dist).toBeCloseTo(10, 5);
            });
        });
    });

    describe('getRandomPoint', function ()
    {
        it('should return an object with x and y properties', function ()
        {
            var circle = new Circle(0, 0, 10);
            var point = circle.getRandomPoint();
            expect(typeof point.x).toBe('number');
            expect(typeof point.y).toBe('number');
        });

        it('should return a point within the circle', function ()
        {
            var circle = new Circle(0, 0, 10);
            for (var i = 0; i < 50; i++)
            {
                var point = circle.getRandomPoint();
                var dist = Math.sqrt(point.x * point.x + point.y * point.y);
                expect(dist).toBeLessThanOrEqual(10);
            }
        });

        it('should use the provided vec object', function ()
        {
            var circle = new Circle(0, 0, 10);
            var vec = { x: 0, y: 0 };
            var result = circle.getRandomPoint(vec);
            expect(result).toBe(vec);
        });

        it('should return points offset by the circle center', function ()
        {
            var circle = new Circle(100, 100, 10);
            for (var i = 0; i < 20; i++)
            {
                var point = circle.getRandomPoint();
                expect(point.x).toBeGreaterThanOrEqual(90);
                expect(point.x).toBeLessThanOrEqual(110);
                expect(point.y).toBeGreaterThanOrEqual(90);
                expect(point.y).toBeLessThanOrEqual(110);
            }
        });
    });

    describe('setTo', function ()
    {
        it('should set x, y and radius', function ()
        {
            var circle = new Circle();
            circle.setTo(10, 20, 30);
            expect(circle.x).toBe(10);
            expect(circle.y).toBe(20);
            expect(circle.radius).toBe(30);
        });

        it('should update the diameter when radius is set', function ()
        {
            var circle = new Circle();
            circle.setTo(0, 0, 15);
            expect(circle.diameter).toBe(30);
        });

        it('should return the circle itself for chaining', function ()
        {
            var circle = new Circle();
            var result = circle.setTo(1, 2, 3);
            expect(result).toBe(circle);
        });

        it('should overwrite existing values', function ()
        {
            var circle = new Circle(10, 20, 30);
            circle.setTo(1, 2, 3);
            expect(circle.x).toBe(1);
            expect(circle.y).toBe(2);
            expect(circle.radius).toBe(3);
        });
    });

    describe('setEmpty', function ()
    {
        it('should set radius to zero', function ()
        {
            var circle = new Circle(0, 0, 50);
            circle.setEmpty();
            expect(circle.radius).toBe(0);
        });

        it('should set diameter to zero', function ()
        {
            var circle = new Circle(0, 0, 50);
            circle.setEmpty();
            expect(circle.diameter).toBe(0);
        });

        it('should not change the position', function ()
        {
            var circle = new Circle(10, 20, 50);
            circle.setEmpty();
            expect(circle.x).toBe(10);
            expect(circle.y).toBe(20);
        });

        it('should return the circle itself for chaining', function ()
        {
            var circle = new Circle(0, 0, 10);
            var result = circle.setEmpty();
            expect(result).toBe(circle);
        });
    });

    describe('setPosition', function ()
    {
        it('should set x and y independently', function ()
        {
            var circle = new Circle();
            circle.setPosition(10, 20);
            expect(circle.x).toBe(10);
            expect(circle.y).toBe(20);
        });

        it('should set both x and y to x when y is omitted', function ()
        {
            var circle = new Circle();
            circle.setPosition(15);
            expect(circle.x).toBe(15);
            expect(circle.y).toBe(15);
        });

        it('should not change the radius', function ()
        {
            var circle = new Circle(0, 0, 50);
            circle.setPosition(10, 20);
            expect(circle.radius).toBe(50);
        });

        it('should return the circle itself for chaining', function ()
        {
            var circle = new Circle();
            var result = circle.setPosition(1, 2);
            expect(result).toBe(circle);
        });

        it('should handle negative values', function ()
        {
            var circle = new Circle();
            circle.setPosition(-10, -20);
            expect(circle.x).toBe(-10);
            expect(circle.y).toBe(-20);
        });
    });

    describe('isEmpty', function ()
    {
        it('should return true when radius is zero', function ()
        {
            var circle = new Circle();
            expect(circle.isEmpty()).toBe(true);
        });

        it('should return false when radius is positive', function ()
        {
            var circle = new Circle(0, 0, 10);
            expect(circle.isEmpty()).toBe(false);
        });

        it('should return true when radius is negative', function ()
        {
            var circle = new Circle(0, 0, -1);
            expect(circle.isEmpty()).toBe(true);
        });

        it('should return true after setEmpty is called', function ()
        {
            var circle = new Circle(0, 0, 50);
            circle.setEmpty();
            expect(circle.isEmpty()).toBe(true);
        });

        it('should return false after radius is set to a positive value', function ()
        {
            var circle = new Circle();
            circle.radius = 5;
            expect(circle.isEmpty()).toBe(false);
        });
    });

    describe('radius property', function ()
    {
        it('should get the radius', function ()
        {
            var circle = new Circle(0, 0, 10);
            expect(circle.radius).toBe(10);
        });

        it('should set the radius and update diameter', function ()
        {
            var circle = new Circle();
            circle.radius = 20;
            expect(circle.radius).toBe(20);
            expect(circle.diameter).toBe(40);
        });
    });

    describe('diameter property', function ()
    {
        it('should get the diameter', function ()
        {
            var circle = new Circle(0, 0, 10);
            expect(circle.diameter).toBe(20);
        });

        it('should set the diameter and update radius', function ()
        {
            var circle = new Circle();
            circle.diameter = 40;
            expect(circle.diameter).toBe(40);
            expect(circle.radius).toBe(20);
        });
    });

    describe('left property', function ()
    {
        it('should return x minus radius', function ()
        {
            var circle = new Circle(10, 0, 5);
            expect(circle.left).toBe(5);
        });

        it('should adjust x when set', function ()
        {
            var circle = new Circle(10, 0, 5);
            circle.left = 0;
            expect(circle.x).toBe(5);
        });
    });

    describe('right property', function ()
    {
        it('should return x plus radius', function ()
        {
            var circle = new Circle(10, 0, 5);
            expect(circle.right).toBe(15);
        });

        it('should adjust x when set', function ()
        {
            var circle = new Circle(10, 0, 5);
            circle.right = 20;
            expect(circle.x).toBe(15);
        });
    });

    describe('top property', function ()
    {
        it('should return y minus radius', function ()
        {
            var circle = new Circle(0, 10, 5);
            expect(circle.top).toBe(5);
        });

        it('should adjust y when set', function ()
        {
            var circle = new Circle(0, 10, 5);
            circle.top = 0;
            expect(circle.y).toBe(5);
        });
    });

    describe('bottom property', function ()
    {
        it('should return y plus radius', function ()
        {
            var circle = new Circle(0, 10, 5);
            expect(circle.bottom).toBe(15);
        });

        it('should adjust y when set', function ()
        {
            var circle = new Circle(0, 10, 5);
            circle.bottom = 20;
            expect(circle.y).toBe(15);
        });
    });
});
