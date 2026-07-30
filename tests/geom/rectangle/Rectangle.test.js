var Rectangle = require('../../../src/geom/rectangle/Rectangle');

describe('Phaser.Geom.Rectangle', function ()
{
    describe('constructor', function ()
    {
        it('should create a rectangle with default values', function ()
        {
            var rect = new Rectangle();
            expect(rect.x).toBe(0);
            expect(rect.y).toBe(0);
            expect(rect.width).toBe(0);
            expect(rect.height).toBe(0);
        });

        it('should create a rectangle with given values', function ()
        {
            var rect = new Rectangle(10, 20, 100, 200);
            expect(rect.x).toBe(10);
            expect(rect.y).toBe(20);
            expect(rect.width).toBe(100);
            expect(rect.height).toBe(200);
        });

        it('should create a rectangle with negative position values', function ()
        {
            var rect = new Rectangle(-50, -75, 100, 150);
            expect(rect.x).toBe(-50);
            expect(rect.y).toBe(-75);
            expect(rect.width).toBe(100);
            expect(rect.height).toBe(150);
        });

        it('should create a rectangle with floating point values', function ()
        {
            var rect = new Rectangle(1.5, 2.5, 10.25, 20.75);
            expect(rect.x).toBeCloseTo(1.5);
            expect(rect.y).toBeCloseTo(2.5);
            expect(rect.width).toBeCloseTo(10.25);
            expect(rect.height).toBeCloseTo(20.75);
        });

        it('should have the correct type constant', function ()
        {
            var rect = new Rectangle();
            expect(rect.type).toBe(5);
        });
    });

    describe('contains', function ()
    {
        it('should return true for a point inside the rectangle', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            expect(rect.contains(50, 50)).toBe(true);
        });

        it('should return false for a point outside the rectangle', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            expect(rect.contains(200, 200)).toBe(false);
        });

        it('should return false for a point to the left of the rectangle', function ()
        {
            var rect = new Rectangle(10, 10, 100, 100);
            expect(rect.contains(5, 50)).toBe(false);
        });

        it('should return false for a point above the rectangle', function ()
        {
            var rect = new Rectangle(10, 10, 100, 100);
            expect(rect.contains(50, 5)).toBe(false);
        });

        it('should return false for a point to the right of the rectangle', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            expect(rect.contains(150, 50)).toBe(false);
        });

        it('should return false for a point below the rectangle', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            expect(rect.contains(50, 150)).toBe(false);
        });

        it('should return true for a point on the top-left corner', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            expect(rect.contains(0, 0)).toBe(true);
        });

        it('should return false for an empty rectangle', function ()
        {
            var rect = new Rectangle(0, 0, 0, 0);
            expect(rect.contains(0, 0)).toBe(false);
        });

        it('should work with negative position', function ()
        {
            var rect = new Rectangle(-50, -50, 100, 100);
            expect(rect.contains(0, 0)).toBe(true);
            expect(rect.contains(-25, -25)).toBe(true);
            expect(rect.contains(-60, -60)).toBe(false);
        });
    });

    describe('getPoint', function ()
    {
        it('should return a point object with x and y properties', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var point = rect.getPoint(0);
            expect(point).toHaveProperty('x');
            expect(point).toHaveProperty('y');
        });

        it('should return the top-left corner at position 0', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var point = rect.getPoint(0);
            expect(point.x).toBeCloseTo(0);
            expect(point.y).toBeCloseTo(0);
        });

        it('should return the top-right corner at position 0.25', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var point = rect.getPoint(0.25);
            expect(point.x).toBeCloseTo(100);
            expect(point.y).toBeCloseTo(0);
        });

        it('should return the bottom-right corner at position 0.5', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var point = rect.getPoint(0.5);
            expect(point.x).toBeCloseTo(100);
            expect(point.y).toBeCloseTo(100);
        });

        it('should return the bottom-left corner at position 0.75', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var point = rect.getPoint(0.75);
            expect(point.x).toBeCloseTo(0);
            expect(point.y).toBeCloseTo(100);
        });

        it('should accept and update an output object', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var output = { x: 0, y: 0 };
            var result = rect.getPoint(0.25, output);
            expect(result).toBe(output);
            expect(output.x).toBeCloseTo(100);
        });
    });

    describe('getPoints', function ()
    {
        it('should return an array', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var points = rect.getPoints(4);
            expect(Array.isArray(points)).toBe(true);
        });

        it('should return the requested number of points', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var points = rect.getPoints(4);
            expect(points.length).toBe(4);
        });

        it('should return points with x and y properties', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var points = rect.getPoints(4);
            expect(points[0]).toHaveProperty('x');
            expect(points[0]).toHaveProperty('y');
        });

        it('should append to an existing output array', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var output = [];
            rect.getPoints(4, null, output);
            expect(output.length).toBe(4);
        });

        it('should use stepRate when quantity is 0', function ()
        {
            // Perimeter of 100x100 rect = 400; stepRate=100 gives 400/100 = 4 points
            var rect = new Rectangle(0, 0, 100, 100);
            var points = rect.getPoints(0, 100);
            expect(points.length).toBe(4);
        });
    });

    describe('getRandomPoint', function ()
    {
        it('should return an object with x and y properties', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var point = rect.getRandomPoint();
            expect(point).toHaveProperty('x');
            expect(point).toHaveProperty('y');
        });

        it('should return a point within the rectangle bounds', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            for (var i = 0; i < 100; i++)
            {
                var point = rect.getRandomPoint();
                expect(point.x).toBeGreaterThanOrEqual(0);
                expect(point.x).toBeLessThanOrEqual(100);
                expect(point.y).toBeGreaterThanOrEqual(0);
                expect(point.y).toBeLessThanOrEqual(100);
            }
        });

        it('should return a point within an offset rectangle', function ()
        {
            var rect = new Rectangle(50, 50, 100, 100);
            for (var i = 0; i < 50; i++)
            {
                var point = rect.getRandomPoint();
                expect(point.x).toBeGreaterThanOrEqual(50);
                expect(point.x).toBeLessThanOrEqual(150);
                expect(point.y).toBeGreaterThanOrEqual(50);
                expect(point.y).toBeLessThanOrEqual(150);
            }
        });

        it('should update a provided vector object', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var vec = { x: 0, y: 0 };
            var result = rect.getRandomPoint(vec);
            expect(result).toBe(vec);
        });
    });

    describe('setTo', function ()
    {
        it('should set x, y, width, and height', function ()
        {
            var rect = new Rectangle();
            rect.setTo(10, 20, 100, 200);
            expect(rect.x).toBe(10);
            expect(rect.y).toBe(20);
            expect(rect.width).toBe(100);
            expect(rect.height).toBe(200);
        });

        it('should return the rectangle itself for chaining', function ()
        {
            var rect = new Rectangle();
            var result = rect.setTo(10, 20, 100, 200);
            expect(result).toBe(rect);
        });

        it('should overwrite existing values', function ()
        {
            var rect = new Rectangle(1, 2, 3, 4);
            rect.setTo(10, 20, 30, 40);
            expect(rect.x).toBe(10);
            expect(rect.y).toBe(20);
            expect(rect.width).toBe(30);
            expect(rect.height).toBe(40);
        });

        it('should work with zero values', function ()
        {
            var rect = new Rectangle(10, 20, 30, 40);
            rect.setTo(0, 0, 0, 0);
            expect(rect.x).toBe(0);
            expect(rect.y).toBe(0);
            expect(rect.width).toBe(0);
            expect(rect.height).toBe(0);
        });

        it('should work with negative values', function ()
        {
            var rect = new Rectangle();
            rect.setTo(-10, -20, -5, -15);
            expect(rect.x).toBe(-10);
            expect(rect.y).toBe(-20);
            expect(rect.width).toBe(-5);
            expect(rect.height).toBe(-15);
        });
    });

    describe('setEmpty', function ()
    {
        it('should reset all properties to zero', function ()
        {
            var rect = new Rectangle(10, 20, 100, 200);
            rect.setEmpty();
            expect(rect.x).toBe(0);
            expect(rect.y).toBe(0);
            expect(rect.width).toBe(0);
            expect(rect.height).toBe(0);
        });

        it('should return the rectangle itself for chaining', function ()
        {
            var rect = new Rectangle(10, 20, 100, 200);
            var result = rect.setEmpty();
            expect(result).toBe(rect);
        });
    });

    describe('setPosition', function ()
    {
        it('should set x and y', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            rect.setPosition(50, 75);
            expect(rect.x).toBe(50);
            expect(rect.y).toBe(75);
        });

        it('should default y to x when only x is provided', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            rect.setPosition(50);
            expect(rect.x).toBe(50);
            expect(rect.y).toBe(50);
        });

        it('should not change width or height', function ()
        {
            var rect = new Rectangle(0, 0, 100, 200);
            rect.setPosition(50, 75);
            expect(rect.width).toBe(100);
            expect(rect.height).toBe(200);
        });

        it('should return the rectangle itself for chaining', function ()
        {
            var rect = new Rectangle();
            var result = rect.setPosition(10, 20);
            expect(result).toBe(rect);
        });

        it('should work with negative values', function ()
        {
            var rect = new Rectangle();
            rect.setPosition(-50, -75);
            expect(rect.x).toBe(-50);
            expect(rect.y).toBe(-75);
        });
    });

    describe('setSize', function ()
    {
        it('should set width and height', function ()
        {
            var rect = new Rectangle(0, 0, 0, 0);
            rect.setSize(100, 200);
            expect(rect.width).toBe(100);
            expect(rect.height).toBe(200);
        });

        it('should default height to width when only width is provided', function ()
        {
            var rect = new Rectangle(0, 0, 0, 0);
            rect.setSize(100);
            expect(rect.width).toBe(100);
            expect(rect.height).toBe(100);
        });

        it('should not change x or y', function ()
        {
            var rect = new Rectangle(10, 20, 0, 0);
            rect.setSize(100, 200);
            expect(rect.x).toBe(10);
            expect(rect.y).toBe(20);
        });

        it('should return the rectangle itself for chaining', function ()
        {
            var rect = new Rectangle();
            var result = rect.setSize(100, 200);
            expect(result).toBe(rect);
        });
    });

    describe('isEmpty', function ()
    {
        it('should return true for a rectangle with zero width', function ()
        {
            var rect = new Rectangle(0, 0, 0, 100);
            expect(rect.isEmpty()).toBe(true);
        });

        it('should return true for a rectangle with zero height', function ()
        {
            var rect = new Rectangle(0, 0, 100, 0);
            expect(rect.isEmpty()).toBe(true);
        });

        it('should return true for a rectangle with zero width and height', function ()
        {
            var rect = new Rectangle();
            expect(rect.isEmpty()).toBe(true);
        });

        it('should return false for a rectangle with positive width and height', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            expect(rect.isEmpty()).toBe(false);
        });

        it('should return true for a rectangle with negative width', function ()
        {
            var rect = new Rectangle(0, 0, -10, 100);
            expect(rect.isEmpty()).toBe(true);
        });

        it('should return true for a rectangle with negative height', function ()
        {
            var rect = new Rectangle(0, 0, 100, -10);
            expect(rect.isEmpty()).toBe(true);
        });
    });

    describe('getLineA', function ()
    {
        it('should return a line representing the top edge', function ()
        {
            var rect = new Rectangle(10, 20, 100, 50);
            var line = rect.getLineA();
            expect(line.x1).toBe(10);
            expect(line.y1).toBe(20);
            expect(line.x2).toBe(110);
            expect(line.y2).toBe(20);
        });

        it('should create a new Line when none is provided', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var line = rect.getLineA();
            expect(line).toBeDefined();
            expect(line).toHaveProperty('x1');
        });

        it('should update a provided line object', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var existing = { x1: 0, y1: 0, x2: 0, y2: 0, setTo: function (x1, y1, x2, y2) { this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2; return this; } };
            var result = rect.getLineA(existing);
            expect(result).toBe(existing);
            expect(existing.x1).toBe(0);
            expect(existing.y1).toBe(0);
            expect(existing.x2).toBe(100);
            expect(existing.y2).toBe(0);
        });
    });

    describe('getLineB', function ()
    {
        it('should return a line representing the right edge', function ()
        {
            var rect = new Rectangle(10, 20, 100, 50);
            var line = rect.getLineB();
            expect(line.x1).toBe(110);
            expect(line.y1).toBe(20);
            expect(line.x2).toBe(110);
            expect(line.y2).toBe(70);
        });

        it('should create a new Line when none is provided', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var line = rect.getLineB();
            expect(line).toBeDefined();
            expect(line).toHaveProperty('x1');
        });

        it('should update a provided line object', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var existing = { x1: 0, y1: 0, x2: 0, y2: 0, setTo: function (x1, y1, x2, y2) { this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2; return this; } };
            var result = rect.getLineB(existing);
            expect(result).toBe(existing);
            expect(existing.x1).toBe(100);
            expect(existing.y1).toBe(0);
            expect(existing.x2).toBe(100);
            expect(existing.y2).toBe(100);
        });
    });

    describe('getLineC', function ()
    {
        it('should return a line representing the bottom edge', function ()
        {
            var rect = new Rectangle(10, 20, 100, 50);
            var line = rect.getLineC();
            expect(line.x1).toBe(110);
            expect(line.y1).toBe(70);
            expect(line.x2).toBe(10);
            expect(line.y2).toBe(70);
        });

        it('should create a new Line when none is provided', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var line = rect.getLineC();
            expect(line).toBeDefined();
            expect(line).toHaveProperty('x1');
        });

        it('should update a provided line object', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var existing = { x1: 0, y1: 0, x2: 0, y2: 0, setTo: function (x1, y1, x2, y2) { this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2; return this; } };
            var result = rect.getLineC(existing);
            expect(result).toBe(existing);
            expect(existing.x1).toBe(100);
            expect(existing.y1).toBe(100);
            expect(existing.x2).toBe(0);
            expect(existing.y2).toBe(100);
        });
    });

    describe('getLineD', function ()
    {
        it('should return a line representing the left edge', function ()
        {
            var rect = new Rectangle(10, 20, 100, 50);
            var line = rect.getLineD();
            expect(line.x1).toBe(10);
            expect(line.y1).toBe(70);
            expect(line.x2).toBe(10);
            expect(line.y2).toBe(20);
        });

        it('should create a new Line when none is provided', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var line = rect.getLineD();
            expect(line).toBeDefined();
            expect(line).toHaveProperty('x1');
        });

        it('should update a provided line object', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            var existing = { x1: 0, y1: 0, x2: 0, y2: 0, setTo: function (x1, y1, x2, y2) { this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2; return this; } };
            var result = rect.getLineD(existing);
            expect(result).toBe(existing);
            expect(existing.x1).toBe(0);
            expect(existing.y1).toBe(100);
            expect(existing.x2).toBe(0);
            expect(existing.y2).toBe(0);
        });
    });

    describe('left property', function ()
    {
        it('should return the x value', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            expect(rect.left).toBe(10);
        });

        it('should adjust width when set to a smaller value', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            rect.left = 0;
            expect(rect.x).toBe(0);
            expect(rect.width).toBe(110);
        });

        it('should set width to zero when set to a value equal to right', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            rect.left = 110;
            expect(rect.x).toBe(110);
            expect(rect.width).toBe(0);
        });

        it('should set width to zero when set to a value greater than right', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            rect.left = 200;
            expect(rect.x).toBe(200);
            expect(rect.width).toBe(0);
        });
    });

    describe('right property', function ()
    {
        it('should return x + width', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            expect(rect.right).toBe(110);
        });

        it('should adjust width when set', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            rect.right = 200;
            expect(rect.width).toBe(190);
            expect(rect.x).toBe(10);
        });

        it('should set width to zero when set to a value equal to x', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            rect.right = 10;
            expect(rect.width).toBe(0);
        });

        it('should set width to zero when set to a value less than x', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            rect.right = 5;
            expect(rect.width).toBe(0);
        });
    });

    describe('top property', function ()
    {
        it('should return the y value', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            expect(rect.top).toBe(20);
        });

        it('should adjust height when set to a smaller value', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            rect.top = 10;
            expect(rect.y).toBe(10);
            expect(rect.height).toBe(110);
        });

        it('should set height to zero when set to a value equal to bottom', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            rect.top = 120;
            expect(rect.y).toBe(120);
            expect(rect.height).toBe(0);
        });
    });

    describe('bottom property', function ()
    {
        it('should return y + height', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            expect(rect.bottom).toBe(120);
        });

        it('should adjust height when set', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            rect.bottom = 200;
            expect(rect.height).toBe(180);
            expect(rect.y).toBe(20);
        });

        it('should set height to zero when set to a value equal to y', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            rect.bottom = 20;
            expect(rect.height).toBe(0);
        });

        it('should set height to zero when set to a value less than y', function ()
        {
            var rect = new Rectangle(10, 20, 100, 100);
            rect.bottom = 5;
            expect(rect.height).toBe(0);
        });
    });

    describe('centerX property', function ()
    {
        it('should return the horizontal center', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            expect(rect.centerX).toBe(50);
        });

        it('should return the horizontal center for offset rectangle', function ()
        {
            var rect = new Rectangle(10, 20, 100, 80);
            expect(rect.centerX).toBe(60);
        });

        it('should reposition x when set', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            rect.centerX = 100;
            expect(rect.x).toBe(50);
        });

        it('should not change width when set', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            rect.centerX = 100;
            expect(rect.width).toBe(100);
        });
    });

    describe('centerY property', function ()
    {
        it('should return the vertical center', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            expect(rect.centerY).toBe(50);
        });

        it('should return the vertical center for offset rectangle', function ()
        {
            var rect = new Rectangle(10, 20, 100, 80);
            expect(rect.centerY).toBe(60);
        });

        it('should reposition y when set', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            rect.centerY = 100;
            expect(rect.y).toBe(50);
        });

        it('should not change height when set', function ()
        {
            var rect = new Rectangle(0, 0, 100, 100);
            rect.centerY = 100;
            expect(rect.height).toBe(100);
        });
    });
});
