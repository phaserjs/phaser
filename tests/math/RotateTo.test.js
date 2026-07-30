var RotateTo = require('../../src/math/RotateTo');

describe('Phaser.Math.RotateTo', function ()
{
    it('should return the point object', function ()
    {
        var point = { x: 0, y: 0 };
        var result = RotateTo(point, 0, 0, 0, 10);

        expect(result).toBe(point);
    });

    it('should position point at angle 0 and given distance', function ()
    {
        var point = { x: 0, y: 0 };
        RotateTo(point, 0, 0, 0, 10);

        expect(point.x).toBeCloseTo(10);
        expect(point.y).toBeCloseTo(0);
    });

    it('should position point at angle PI/2 and given distance', function ()
    {
        var point = { x: 0, y: 0 };
        RotateTo(point, 0, 0, Math.PI / 2, 10);

        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(10);
    });

    it('should position point at angle PI and given distance', function ()
    {
        var point = { x: 0, y: 0 };
        RotateTo(point, 0, 0, Math.PI, 10);

        expect(point.x).toBeCloseTo(-10);
        expect(point.y).toBeCloseTo(0);
    });

    it('should position point at angle 3*PI/2 and given distance', function ()
    {
        var point = { x: 0, y: 0 };
        RotateTo(point, 0, 0, 3 * Math.PI / 2, 10);

        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(-10);
    });

    it('should offset by the given x and y origin', function ()
    {
        var point = { x: 0, y: 0 };
        RotateTo(point, 100, 200, 0, 50);

        expect(point.x).toBeCloseTo(150);
        expect(point.y).toBeCloseTo(200);
    });

    it('should work with negative origin coordinates', function ()
    {
        var point = { x: 0, y: 0 };
        RotateTo(point, -100, -100, 0, 10);

        expect(point.x).toBeCloseTo(-90);
        expect(point.y).toBeCloseTo(-100);
    });

    it('should place point at origin when distance is zero', function ()
    {
        var point = { x: 99, y: 99 };
        RotateTo(point, 50, 75, Math.PI / 4, 0);

        expect(point.x).toBeCloseTo(50);
        expect(point.y).toBeCloseTo(75);
    });

    it('should work with negative distance', function ()
    {
        var point = { x: 0, y: 0 };
        RotateTo(point, 0, 0, 0, -10);

        expect(point.x).toBeCloseTo(-10);
        expect(point.y).toBeCloseTo(0);
    });

    it('should work with negative angle', function ()
    {
        var point = { x: 0, y: 0 };
        RotateTo(point, 0, 0, -Math.PI / 2, 10);

        expect(point.x).toBeCloseTo(0);
        expect(point.y).toBeCloseTo(-10);
    });

    it('should work with floating point angle and distance', function ()
    {
        var point = { x: 0, y: 0 };
        RotateTo(point, 0, 0, Math.PI / 4, Math.SQRT2);

        expect(point.x).toBeCloseTo(1);
        expect(point.y).toBeCloseTo(1);
    });

    it('should mutate the point in place', function ()
    {
        var point = { x: 5, y: 5 };
        RotateTo(point, 0, 0, 0, 10);

        expect(point.x).toBeCloseTo(10);
        expect(point.y).toBeCloseTo(0);
    });

    it('should work with angle of 2*PI (full rotation)', function ()
    {
        var point = { x: 0, y: 0 };
        RotateTo(point, 0, 0, 2 * Math.PI, 10);

        expect(point.x).toBeCloseTo(10);
        expect(point.y).toBeCloseTo(0);
    });
});
