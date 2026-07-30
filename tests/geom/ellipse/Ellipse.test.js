var Ellipse = require('../../../src/geom/ellipse/Ellipse');

describe('Phaser.Geom.Ellipse', function ()
{
    describe('constructor', function ()
    {
        it('should create an ellipse with default values', function ()
        {
            var ellipse = new Ellipse();
            expect(ellipse.x).toBe(0);
            expect(ellipse.y).toBe(0);
            expect(ellipse.width).toBe(0);
            expect(ellipse.height).toBe(0);
        });

        it('should create an ellipse with given values', function ()
        {
            var ellipse = new Ellipse(10, 20, 100, 50);
            expect(ellipse.x).toBe(10);
            expect(ellipse.y).toBe(20);
            expect(ellipse.width).toBe(100);
            expect(ellipse.height).toBe(50);
        });

        it('should set the type constant', function ()
        {
            var ellipse = new Ellipse();
            expect(typeof ellipse.type).toBe('number');
        });

        it('should handle negative position values', function ()
        {
            var ellipse = new Ellipse(-50, -100, 200, 100);
            expect(ellipse.x).toBe(-50);
            expect(ellipse.y).toBe(-100);
        });

        it('should handle floating point values', function ()
        {
            var ellipse = new Ellipse(1.5, 2.5, 10.5, 20.5);
            expect(ellipse.x).toBe(1.5);
            expect(ellipse.y).toBe(2.5);
            expect(ellipse.width).toBe(10.5);
            expect(ellipse.height).toBe(20.5);
        });
    });

    describe('contains', function ()
    {
        it('should return true for the center point', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            expect(ellipse.contains(0, 0)).toBe(true);
        });

        it('should return true for a point inside the ellipse', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            expect(ellipse.contains(10, 5)).toBe(true);
        });

        it('should return false for a point outside the ellipse', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            expect(ellipse.contains(60, 0)).toBe(false);
        });

        it('should return false for a point outside on the y axis', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            expect(ellipse.contains(0, 30)).toBe(false);
        });

        it('should work with offset center position', function ()
        {
            var ellipse = new Ellipse(100, 100, 50, 50);
            expect(ellipse.contains(100, 100)).toBe(true);
            expect(ellipse.contains(0, 0)).toBe(false);
        });

        it('should return false for an empty ellipse', function ()
        {
            var ellipse = new Ellipse(0, 0, 0, 0);
            expect(ellipse.contains(0, 0)).toBe(false);
        });

        it('should handle points near the boundary', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 100);
            expect(ellipse.contains(49, 0)).toBe(true);
            expect(ellipse.contains(51, 0)).toBe(false);
        });
    });

    describe('getPoint', function ()
    {
        it('should return a point object with x and y properties', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 100);
            var point = ellipse.getPoint(0);
            expect(typeof point.x).toBe('number');
            expect(typeof point.y).toBe('number');
        });

        it('should return the rightmost point at position 0', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 100);
            var point = ellipse.getPoint(0);
            expect(point.x).toBeCloseTo(50, 5);
            expect(point.y).toBeCloseTo(0, 5);
        });

        it('should return the leftmost point at position 0.5', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 100);
            var point = ellipse.getPoint(0.5);
            expect(point.x).toBeCloseTo(-50, 5);
            expect(point.y).toBeCloseTo(0, 5);
        });

        it('should use the provided point object', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 100);
            var out = { x: 0, y: 0 };
            var result = ellipse.getPoint(0, out);
            expect(result).toBe(out);
        });

        it('should account for ellipse center offset', function ()
        {
            var ellipse = new Ellipse(50, 50, 100, 100);
            var point = ellipse.getPoint(0);
            expect(point.x).toBeCloseTo(100, 5);
            expect(point.y).toBeCloseTo(50, 5);
        });

        it('should return top point at position 0.25 for a circle', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 100);
            var point = ellipse.getPoint(0.25);
            expect(point.x).toBeCloseTo(0, 4);
            expect(point.y).toBeCloseTo(50, 4);
        });
    });

    describe('getPoints', function ()
    {
        it('should return an array of points', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            var points = ellipse.getPoints(4);
            expect(Array.isArray(points)).toBe(true);
            expect(points.length).toBe(4);
        });

        it('should return points with x and y properties', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            var points = ellipse.getPoints(4);
            for (var i = 0; i < points.length; i++)
            {
                expect(typeof points[i].x).toBe('number');
                expect(typeof points[i].y).toBe('number');
            }
        });

        it('should use provided output array', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            var out = [];
            var result = ellipse.getPoints(4, null, out);
            expect(result).toBe(out);
            expect(result.length).toBe(4);
        });

        it('should return correct number of points', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            var points = ellipse.getPoints(10);
            expect(points.length).toBe(10);
        });
    });

    describe('getRandomPoint', function ()
    {
        it('should return a point with x and y properties', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            var point = ellipse.getRandomPoint();
            expect(typeof point.x).toBe('number');
            expect(typeof point.y).toBe('number');
        });

        it('should use the provided vector object', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            var vec = { x: 0, y: 0 };
            var result = ellipse.getRandomPoint(vec);
            expect(result).toBe(vec);
        });

        it('should return points within ellipse bounds', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            for (var i = 0; i < 50; i++)
            {
                var point = ellipse.getRandomPoint();
                expect(point.x).toBeGreaterThanOrEqual(-50);
                expect(point.x).toBeLessThanOrEqual(50);
                expect(point.y).toBeGreaterThanOrEqual(-25);
                expect(point.y).toBeLessThanOrEqual(25);
            }
        });
    });

    describe('setTo', function ()
    {
        it('should set all four properties', function ()
        {
            var ellipse = new Ellipse();
            ellipse.setTo(10, 20, 200, 100);
            expect(ellipse.x).toBe(10);
            expect(ellipse.y).toBe(20);
            expect(ellipse.width).toBe(200);
            expect(ellipse.height).toBe(100);
        });

        it('should return the ellipse instance for chaining', function ()
        {
            var ellipse = new Ellipse();
            var result = ellipse.setTo(10, 20, 200, 100);
            expect(result).toBe(ellipse);
        });

        it('should overwrite existing values', function ()
        {
            var ellipse = new Ellipse(5, 5, 50, 50);
            ellipse.setTo(10, 20, 200, 100);
            expect(ellipse.x).toBe(10);
            expect(ellipse.y).toBe(20);
            expect(ellipse.width).toBe(200);
            expect(ellipse.height).toBe(100);
        });
    });

    describe('setEmpty', function ()
    {
        it('should set width and height to zero', function ()
        {
            var ellipse = new Ellipse(10, 20, 100, 50);
            ellipse.setEmpty();
            expect(ellipse.width).toBe(0);
            expect(ellipse.height).toBe(0);
        });

        it('should not change x and y position', function ()
        {
            var ellipse = new Ellipse(10, 20, 100, 50);
            ellipse.setEmpty();
            expect(ellipse.x).toBe(10);
            expect(ellipse.y).toBe(20);
        });

        it('should return the ellipse instance for chaining', function ()
        {
            var ellipse = new Ellipse(10, 20, 100, 50);
            var result = ellipse.setEmpty();
            expect(result).toBe(ellipse);
        });
    });

    describe('setPosition', function ()
    {
        it('should set x and y position', function ()
        {
            var ellipse = new Ellipse();
            ellipse.setPosition(30, 40);
            expect(ellipse.x).toBe(30);
            expect(ellipse.y).toBe(40);
        });

        it('should set both x and y to x when y is omitted', function ()
        {
            var ellipse = new Ellipse();
            ellipse.setPosition(50);
            expect(ellipse.x).toBe(50);
            expect(ellipse.y).toBe(50);
        });

        it('should not change width and height', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            ellipse.setPosition(30, 40);
            expect(ellipse.width).toBe(100);
            expect(ellipse.height).toBe(50);
        });

        it('should return the ellipse instance for chaining', function ()
        {
            var ellipse = new Ellipse();
            var result = ellipse.setPosition(30, 40);
            expect(result).toBe(ellipse);
        });

        it('should handle negative values', function ()
        {
            var ellipse = new Ellipse();
            ellipse.setPosition(-10, -20);
            expect(ellipse.x).toBe(-10);
            expect(ellipse.y).toBe(-20);
        });
    });

    describe('setSize', function ()
    {
        it('should set width and height', function ()
        {
            var ellipse = new Ellipse();
            ellipse.setSize(200, 100);
            expect(ellipse.width).toBe(200);
            expect(ellipse.height).toBe(100);
        });

        it('should set height equal to width when height is omitted', function ()
        {
            var ellipse = new Ellipse();
            ellipse.setSize(150);
            expect(ellipse.width).toBe(150);
            expect(ellipse.height).toBe(150);
        });

        it('should not change x and y position', function ()
        {
            var ellipse = new Ellipse(10, 20, 0, 0);
            ellipse.setSize(200, 100);
            expect(ellipse.x).toBe(10);
            expect(ellipse.y).toBe(20);
        });

        it('should return the ellipse instance for chaining', function ()
        {
            var ellipse = new Ellipse();
            var result = ellipse.setSize(200, 100);
            expect(result).toBe(ellipse);
        });
    });

    describe('isEmpty', function ()
    {
        it('should return true when width is zero', function ()
        {
            var ellipse = new Ellipse(0, 0, 0, 100);
            expect(ellipse.isEmpty()).toBe(true);
        });

        it('should return true when height is zero', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 0);
            expect(ellipse.isEmpty()).toBe(true);
        });

        it('should return true when both width and height are zero', function ()
        {
            var ellipse = new Ellipse();
            expect(ellipse.isEmpty()).toBe(true);
        });

        it('should return false when both width and height are positive', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            expect(ellipse.isEmpty()).toBe(false);
        });

        it('should return true when width is negative', function ()
        {
            var ellipse = new Ellipse(0, 0, -10, 50);
            expect(ellipse.isEmpty()).toBe(true);
        });

        it('should return true when height is negative', function ()
        {
            var ellipse = new Ellipse(0, 0, 50, -10);
            expect(ellipse.isEmpty()).toBe(true);
        });
    });

    describe('getMinorRadius', function ()
    {
        it('should return half of the smaller dimension', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            expect(ellipse.getMinorRadius()).toBe(25);
        });

        it('should return half of width when width is smaller', function ()
        {
            var ellipse = new Ellipse(0, 0, 40, 100);
            expect(ellipse.getMinorRadius()).toBe(20);
        });

        it('should return half the radius for a circle', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 100);
            expect(ellipse.getMinorRadius()).toBe(50);
        });

        it('should return zero for an empty ellipse', function ()
        {
            var ellipse = new Ellipse();
            expect(ellipse.getMinorRadius()).toBe(0);
        });

        it('should handle floating point dimensions', function ()
        {
            var ellipse = new Ellipse(0, 0, 50.5, 100);
            expect(ellipse.getMinorRadius()).toBeCloseTo(25.25, 5);
        });
    });

    describe('getMajorRadius', function ()
    {
        it('should return half of the larger dimension', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 50);
            expect(ellipse.getMajorRadius()).toBe(50);
        });

        it('should return half of height when height is larger', function ()
        {
            var ellipse = new Ellipse(0, 0, 40, 100);
            expect(ellipse.getMajorRadius()).toBe(50);
        });

        it('should return half the radius for a circle', function ()
        {
            var ellipse = new Ellipse(0, 0, 100, 100);
            expect(ellipse.getMajorRadius()).toBe(50);
        });

        it('should return zero for an empty ellipse', function ()
        {
            var ellipse = new Ellipse();
            expect(ellipse.getMajorRadius()).toBe(0);
        });

        it('should handle floating point dimensions', function ()
        {
            var ellipse = new Ellipse(0, 0, 50, 100.5);
            expect(ellipse.getMajorRadius()).toBeCloseTo(50.25, 5);
        });
    });

    describe('computed properties', function ()
    {
        describe('left', function ()
        {
            it('should return x minus half the width', function ()
            {
                var ellipse = new Ellipse(100, 100, 80, 60);
                expect(ellipse.left).toBe(60);
            });

            it('should update x when set', function ()
            {
                var ellipse = new Ellipse(100, 100, 80, 60);
                ellipse.left = 50;
                expect(ellipse.x).toBe(90);
            });
        });

        describe('right', function ()
        {
            it('should return x plus half the width', function ()
            {
                var ellipse = new Ellipse(100, 100, 80, 60);
                expect(ellipse.right).toBe(140);
            });

            it('should update x when set', function ()
            {
                var ellipse = new Ellipse(100, 100, 80, 60);
                ellipse.right = 150;
                expect(ellipse.x).toBe(110);
            });
        });

        describe('top', function ()
        {
            it('should return y minus half the height', function ()
            {
                var ellipse = new Ellipse(100, 100, 80, 60);
                expect(ellipse.top).toBe(70);
            });

            it('should update y when set', function ()
            {
                var ellipse = new Ellipse(100, 100, 80, 60);
                ellipse.top = 50;
                expect(ellipse.y).toBe(80);
            });
        });

        describe('bottom', function ()
        {
            it('should return y plus half the height', function ()
            {
                var ellipse = new Ellipse(100, 100, 80, 60);
                expect(ellipse.bottom).toBe(130);
            });

            it('should update y when set', function ()
            {
                var ellipse = new Ellipse(100, 100, 80, 60);
                ellipse.bottom = 140;
                expect(ellipse.y).toBe(110);
            });
        });
    });
});
