var MoveTo = require('../../../src/curves/path/MoveTo');
var Vector2 = require('../../../src/math/Vector2');

describe('MoveTo', function ()
{
    describe('constructor', function ()
    {
        it('should create a MoveTo with default values', function ()
        {
            var moveTo = new MoveTo();
            expect(moveTo.p0.x).toBe(0);
            expect(moveTo.p0.y).toBe(0);
        });

        it('should create a MoveTo with given x and y values', function ()
        {
            var moveTo = new MoveTo(100, 200);
            expect(moveTo.p0.x).toBe(100);
            expect(moveTo.p0.y).toBe(200);
        });

        it('should set active to false', function ()
        {
            var moveTo = new MoveTo(10, 20);
            expect(moveTo.active).toBe(false);
        });

        it('should create a MoveTo with negative coordinates', function ()
        {
            var moveTo = new MoveTo(-50, -75);
            expect(moveTo.p0.x).toBe(-50);
            expect(moveTo.p0.y).toBe(-75);
        });

        it('should create a MoveTo with floating point coordinates', function ()
        {
            var moveTo = new MoveTo(1.5, 2.7);
            expect(moveTo.p0.x).toBeCloseTo(1.5);
            expect(moveTo.p0.y).toBeCloseTo(2.7);
        });

        it('should store p0 as a Vector2 instance', function ()
        {
            var moveTo = new MoveTo(10, 20);
            expect(moveTo.p0).toBeInstanceOf(Vector2);
        });
    });

    describe('getPoint', function ()
    {
        it('should return a Vector2 with the curve point coordinates', function ()
        {
            var moveTo = new MoveTo(100, 200);
            var result = moveTo.getPoint(0);
            expect(result.x).toBe(100);
            expect(result.y).toBe(200);
        });

        it('should create a new Vector2 when no out parameter is provided', function ()
        {
            var moveTo = new MoveTo(50, 75);
            var result = moveTo.getPoint(0.5);
            expect(result).toBeInstanceOf(Vector2);
        });

        it('should use the provided out vector', function ()
        {
            var moveTo = new MoveTo(30, 40);
            var out = new Vector2();
            var result = moveTo.getPoint(0, out);
            expect(result).toBe(out);
            expect(out.x).toBe(30);
            expect(out.y).toBe(40);
        });

        it('should ignore the t parameter and always return p0', function ()
        {
            var moveTo = new MoveTo(10, 20);
            var result0 = moveTo.getPoint(0);
            var result1 = moveTo.getPoint(1);
            var result05 = moveTo.getPoint(0.5);
            expect(result0.x).toBe(10);
            expect(result0.y).toBe(20);
            expect(result1.x).toBe(10);
            expect(result1.y).toBe(20);
            expect(result05.x).toBe(10);
            expect(result05.y).toBe(20);
        });
    });

    describe('getPointAt', function ()
    {
        it('should return the same point as getPoint', function ()
        {
            var moveTo = new MoveTo(100, 200);
            var result = moveTo.getPointAt(0.5);
            expect(result.x).toBe(100);
            expect(result.y).toBe(200);
        });

        it('should use the provided out vector', function ()
        {
            var moveTo = new MoveTo(30, 40);
            var out = new Vector2();
            var result = moveTo.getPointAt(0, out);
            expect(result).toBe(out);
            expect(out.x).toBe(30);
            expect(out.y).toBe(40);
        });

        it('should ignore the u parameter and always return p0', function ()
        {
            var moveTo = new MoveTo(10, 20);
            var result0 = moveTo.getPointAt(0);
            var result1 = moveTo.getPointAt(1);
            expect(result0.x).toBe(10);
            expect(result0.y).toBe(20);
            expect(result1.x).toBe(10);
            expect(result1.y).toBe(20);
        });
    });

    describe('getResolution', function ()
    {
        it('should always return 1', function ()
        {
            var moveTo = new MoveTo(0, 0);
            expect(moveTo.getResolution()).toBe(1);
        });

        it('should return 1 regardless of curve position', function ()
        {
            var moveTo = new MoveTo(999, 999);
            expect(moveTo.getResolution()).toBe(1);
        });
    });

    describe('getLength', function ()
    {
        it('should always return 0', function ()
        {
            var moveTo = new MoveTo(0, 0);
            expect(moveTo.getLength()).toBe(0);
        });

        it('should return 0 regardless of curve position', function ()
        {
            var moveTo = new MoveTo(100, 200);
            expect(moveTo.getLength()).toBe(0);
        });
    });

    describe('toJSON', function ()
    {
        it('should return an object with type MoveTo', function ()
        {
            var moveTo = new MoveTo(10, 20);
            var json = moveTo.toJSON();
            expect(json.type).toBe('MoveTo');
        });

        it('should include the point coordinates in the points array', function ()
        {
            var moveTo = new MoveTo(10, 20);
            var json = moveTo.toJSON();
            expect(json.points[0]).toBe(10);
            expect(json.points[1]).toBe(20);
        });

        it('should return a points array with exactly two values', function ()
        {
            var moveTo = new MoveTo(5, 15);
            var json = moveTo.toJSON();
            expect(json.points.length).toBe(2);
        });

        it('should serialise floating point coordinates correctly', function ()
        {
            var moveTo = new MoveTo(1.5, 2.7);
            var json = moveTo.toJSON();
            expect(json.points[0]).toBeCloseTo(1.5);
            expect(json.points[1]).toBeCloseTo(2.7);
        });

        it('should serialise negative coordinates correctly', function ()
        {
            var moveTo = new MoveTo(-10, -20);
            var json = moveTo.toJSON();
            expect(json.points[0]).toBe(-10);
            expect(json.points[1]).toBe(-20);
        });

        it('should serialise zero coordinates correctly', function ()
        {
            var moveTo = new MoveTo();
            var json = moveTo.toJSON();
            expect(json.points[0]).toBe(0);
            expect(json.points[1]).toBe(0);
        });
    });
});
