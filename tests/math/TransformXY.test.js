var TransformXY = require('../../src/math/TransformXY');

describe('Phaser.Math.TransformXY', function ()
{
    it('should return a Vector2 when no output is provided', function ()
    {
        var result = TransformXY(0, 0, 0, 0, 0, 1, 1);

        expect(result).toBeDefined();
        expect(typeof result.x).toBe('number');
        expect(typeof result.y).toBe('number');
    });

    it('should use the provided output object', function ()
    {
        var output = { x: 0, y: 0 };
        var result = TransformXY(0, 0, 0, 0, 0, 1, 1, output);

        expect(result).toBe(output);
    });

    it('should return the same coordinates under identity transform', function ()
    {
        var result = TransformXY(10, 20, 0, 0, 0, 1, 1);

        expect(result.x).toBeCloseTo(10);
        expect(result.y).toBeCloseTo(20);
    });

    it('should subtract the position offset when there is no rotation or scale', function ()
    {
        var result = TransformXY(100, 200, 50, 75, 0, 1, 1);

        expect(result.x).toBeCloseTo(50);
        expect(result.y).toBeCloseTo(125);
    });

    it('should return zero when the point equals the position with no rotation or scale', function ()
    {
        var result = TransformXY(30, 40, 30, 40, 0, 1, 1);

        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(0);
    });

    it('should handle negative position offsets', function ()
    {
        var result = TransformXY(0, 0, -10, -20, 0, 1, 1);

        expect(result.x).toBeCloseTo(10);
        expect(result.y).toBeCloseTo(20);
    });

    it('should inverse-scale the coordinates when scaleX and scaleY are uniform', function ()
    {
        // World point (10, 0) with object scaled 2x should be local (5, 0)
        var result = TransformXY(10, 0, 0, 0, 0, 2, 2);

        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(0);
    });

    it('should handle non-uniform scale independently on each axis', function ()
    {
        var result = TransformXY(10, 6, 0, 0, 0, 2, 3);

        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(2);
    });

    it('should rotate coordinates inversely by 90 degrees', function ()
    {
        // 90 degrees: local x maps to world y, local y maps to -world x
        // Inverse: world (1, 0) => local (0, -1)
        var result = TransformXY(1, 0, 0, 0, Math.PI / 2, 1, 1);

        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(-1);
    });

    it('should rotate coordinates inversely by 180 degrees', function ()
    {
        var result = TransformXY(1, 0, 0, 0, Math.PI, 1, 1);

        expect(result.x).toBeCloseTo(-1);
        expect(result.y).toBeCloseTo(0);
    });

    it('should rotate coordinates inversely by 270 degrees', function ()
    {
        var result = TransformXY(0, 1, 0, 0, 3 * Math.PI / 2, 1, 1);

        expect(result.x).toBeCloseTo(-1);
        expect(result.y).toBeCloseTo(0);
    });

    it('should combine position and rotation correctly', function ()
    {
        // Point at (1, 0) with object at (1, 0) rotated 90 degrees
        // Relative point is (0, 0) in world, so local should be (0, 0)
        var result = TransformXY(1, 0, 1, 0, Math.PI / 2, 1, 1);

        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(0);
    });

    it('should combine rotation and scale correctly', function ()
    {
        // World (2, 0), rotation=90deg, scaleX=2, scaleY=2
        // Unscaled inverse-rotate: local world is (0, -2)
        // With scale 2: (0, -1)
        var result = TransformXY(2, 0, 0, 0, Math.PI / 2, 2, 2);

        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(-1);
    });

    it('should handle floating point coordinates', function ()
    {
        var result = TransformXY(1.5, 2.5, 0.5, 0.5, 0, 1, 1);

        expect(result.x).toBeCloseTo(1);
        expect(result.y).toBeCloseTo(2);
    });

    it('should handle negative input coordinates', function ()
    {
        var result = TransformXY(-10, -20, 0, 0, 0, 1, 1);

        expect(result.x).toBeCloseTo(-10);
        expect(result.y).toBeCloseTo(-20);
    });

    it('should handle zero position, rotation, and scale of 1 for origin point', function ()
    {
        var result = TransformXY(0, 0, 0, 0, 0, 1, 1);

        expect(result.x).toBeCloseTo(0);
        expect(result.y).toBeCloseTo(0);
    });

    it('should write results into a plain object output', function ()
    {
        var out = { x: 999, y: 999 };

        TransformXY(5, 10, 5, 10, 0, 1, 1, out);

        expect(out.x).toBeCloseTo(0);
        expect(out.y).toBeCloseTo(0);
    });

    it('should return the output object as its return value', function ()
    {
        var out = { x: 0, y: 0 };
        var result = TransformXY(1, 2, 0, 0, 0, 1, 1, out);

        expect(result).toBe(out);
    });

    it('should handle a 45-degree rotation', function ()
    {
        var angle = Math.PI / 4;
        var sqrt2 = Math.sqrt(2);

        // World point (sqrt2, 0), object at origin, rotated 45 degrees
        // In local space this should be (1, -1)
        var result = TransformXY(sqrt2, 0, 0, 0, angle, 1, 1);

        expect(result.x).toBeCloseTo(1);
        expect(result.y).toBeCloseTo(-1);
    });

    it('should handle non-zero position with non-uniform scale', function ()
    {
        // Object at (10, 10), scaleX=2, scaleY=4, no rotation
        // World point (20, 30) => relative (10, 20) => scaled (5, 5)
        var result = TransformXY(20, 30, 10, 10, 0, 2, 4);

        expect(result.x).toBeCloseTo(5);
        expect(result.y).toBeCloseTo(5);
    });
});
