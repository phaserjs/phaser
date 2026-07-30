var ContainsPoint = require('../../../src/geom/polygon/ContainsPoint');

describe('Phaser.Geom.Polygon.ContainsPoint', function ()
{
    var square;
    var triangle;

    beforeEach(function ()
    {
        square = {
            points: [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 100, y: 100 },
                { x: 0, y: 100 }
            ]
        };

        triangle = {
            points: [
                { x: 0, y: 0 },
                { x: 100, y: 0 },
                { x: 50, y: 100 }
            ]
        };
    });

    it('should return true for a point clearly inside a square polygon', function ()
    {
        var vec = { x: 50, y: 50 };
        expect(ContainsPoint(square, vec)).toBe(true);
    });

    it('should return false for a point clearly outside a square polygon', function ()
    {
        var vec = { x: 200, y: 200 };
        expect(ContainsPoint(square, vec)).toBe(false);
    });

    it('should return false for a point to the left of the polygon', function ()
    {
        var vec = { x: -10, y: 50 };
        expect(ContainsPoint(square, vec)).toBe(false);
    });

    it('should return false for a point above the polygon', function ()
    {
        var vec = { x: 50, y: -10 };
        expect(ContainsPoint(square, vec)).toBe(false);
    });

    it('should return false for a point below the polygon', function ()
    {
        var vec = { x: 50, y: 110 };
        expect(ContainsPoint(square, vec)).toBe(false);
    });

    it('should return false for a point to the right of the polygon', function ()
    {
        var vec = { x: 110, y: 50 };
        expect(ContainsPoint(square, vec)).toBe(false);
    });

    it('should return true for a point inside a triangle polygon', function ()
    {
        var vec = { x: 50, y: 40 };
        expect(ContainsPoint(triangle, vec)).toBe(true);
    });

    it('should return false for a point outside a triangle polygon', function ()
    {
        var vec = { x: 10, y: 90 };
        expect(ContainsPoint(triangle, vec)).toBe(false);
    });

    it('should use the x and y properties from the vec object', function ()
    {
        var inside = { x: 50, y: 50 };
        var outside = { x: 150, y: 150 };
        expect(ContainsPoint(square, inside)).toBe(true);
        expect(ContainsPoint(square, outside)).toBe(false);
    });

    it('should return false for an empty polygon', function ()
    {
        var empty = { points: [] };
        var vec = { x: 50, y: 50 };
        expect(ContainsPoint(empty, vec)).toBe(false);
    });

    it('should handle negative coordinate points inside the polygon', function ()
    {
        var negSquare = {
            points: [
                { x: -100, y: -100 },
                { x: 0, y: -100 },
                { x: 0, y: 0 },
                { x: -100, y: 0 }
            ]
        };
        var vec = { x: -50, y: -50 };
        expect(ContainsPoint(negSquare, vec)).toBe(true);
    });

    it('should return false for negative coordinate points outside the polygon', function ()
    {
        var negSquare = {
            points: [
                { x: -100, y: -100 },
                { x: 0, y: -100 },
                { x: 0, y: 0 },
                { x: -100, y: 0 }
            ]
        };
        var vec = { x: 50, y: 50 };
        expect(ContainsPoint(negSquare, vec)).toBe(false);
    });

    it('should return a boolean value', function ()
    {
        var vec = { x: 50, y: 50 };
        var result = ContainsPoint(square, vec);
        expect(typeof result).toBe('boolean');
    });

    it('should handle floating point coordinates inside the polygon', function ()
    {
        var vec = { x: 50.5, y: 50.5 };
        expect(ContainsPoint(square, vec)).toBe(true);
    });

    it('should handle floating point coordinates outside the polygon', function ()
    {
        var vec = { x: 100.1, y: 50.5 };
        expect(ContainsPoint(square, vec)).toBe(false);
    });
});
