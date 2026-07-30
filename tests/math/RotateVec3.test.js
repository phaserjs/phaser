var RotateVec3 = require('../../src/math/RotateVec3');
var Vector3 = require('../../src/math/Vector3');

describe('Phaser.Math.RotateVec3', function ()
{
    it('should return the same vector object that was passed in', function ()
    {
        var vec = new Vector3(1, 0, 0);
        var axis = new Vector3(0, 0, 1);
        var result = RotateVec3(vec, axis, 0);

        expect(result).toBe(vec);
    });

    it('should not change the vector when radians is zero', function ()
    {
        var vec = new Vector3(1, 0, 0);
        var axis = new Vector3(0, 0, 1);
        RotateVec3(vec, axis, 0);

        expect(vec.x).toBeCloseTo(1, 5);
        expect(vec.y).toBeCloseTo(0, 5);
        expect(vec.z).toBeCloseTo(0, 5);
    });

    it('should rotate a vector 90 degrees around the Z axis', function ()
    {
        var vec = new Vector3(1, 0, 0);
        var axis = new Vector3(0, 0, 1);
        RotateVec3(vec, axis, Math.PI / 2);

        expect(vec.x).toBeCloseTo(0, 5);
        expect(vec.y).toBeCloseTo(1, 5);
        expect(vec.z).toBeCloseTo(0, 5);
    });

    it('should rotate a vector 180 degrees around the Z axis', function ()
    {
        var vec = new Vector3(1, 0, 0);
        var axis = new Vector3(0, 0, 1);
        RotateVec3(vec, axis, Math.PI);

        expect(vec.x).toBeCloseTo(-1, 5);
        expect(vec.y).toBeCloseTo(0, 5);
        expect(vec.z).toBeCloseTo(0, 5);
    });

    it('should rotate a vector 360 degrees back to original position', function ()
    {
        var vec = new Vector3(1, 0, 0);
        var axis = new Vector3(0, 0, 1);
        RotateVec3(vec, axis, Math.PI * 2);

        expect(vec.x).toBeCloseTo(1, 5);
        expect(vec.y).toBeCloseTo(0, 5);
        expect(vec.z).toBeCloseTo(0, 5);
    });

    it('should rotate a vector 90 degrees around the Y axis', function ()
    {
        var vec = new Vector3(1, 0, 0);
        var axis = new Vector3(0, 1, 0);
        RotateVec3(vec, axis, Math.PI / 2);

        expect(vec.x).toBeCloseTo(0, 5);
        expect(vec.y).toBeCloseTo(0, 5);
        expect(vec.z).toBeCloseTo(-1, 5);
    });

    it('should rotate a vector 90 degrees around the X axis', function ()
    {
        var vec = new Vector3(0, 1, 0);
        var axis = new Vector3(1, 0, 0);
        RotateVec3(vec, axis, Math.PI / 2);

        expect(vec.x).toBeCloseTo(0, 5);
        expect(vec.y).toBeCloseTo(0, 5);
        expect(vec.z).toBeCloseTo(1, 5);
    });

    it('should rotate a negative vector correctly', function ()
    {
        var vec = new Vector3(-1, 0, 0);
        var axis = new Vector3(0, 0, 1);
        RotateVec3(vec, axis, Math.PI / 2);

        expect(vec.x).toBeCloseTo(0, 5);
        expect(vec.y).toBeCloseTo(-1, 5);
        expect(vec.z).toBeCloseTo(0, 5);
    });

    it('should rotate with negative radians (counter-rotation)', function ()
    {
        var vec = new Vector3(1, 0, 0);
        var axis = new Vector3(0, 0, 1);
        RotateVec3(vec, axis, -Math.PI / 2);

        expect(vec.x).toBeCloseTo(0, 5);
        expect(vec.y).toBeCloseTo(-1, 5);
        expect(vec.z).toBeCloseTo(0, 5);
    });

    it('should preserve vector length after rotation', function ()
    {
        var vec = new Vector3(3, 4, 0);
        var axis = new Vector3(0, 0, 1);
        var lengthBefore = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
        RotateVec3(vec, axis, Math.PI / 3);
        var lengthAfter = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);

        expect(lengthAfter).toBeCloseTo(lengthBefore, 5);
    });

    it('should handle a zero vector without error', function ()
    {
        var vec = new Vector3(0, 0, 0);
        var axis = new Vector3(0, 0, 1);
        RotateVec3(vec, axis, Math.PI / 2);

        expect(vec.x).toBeCloseTo(0, 5);
        expect(vec.y).toBeCloseTo(0, 5);
        expect(vec.z).toBeCloseTo(0, 5);
    });

    it('should rotate correctly with a non-cardinal axis', function ()
    {
        var vec = new Vector3(1, 0, 0);
        var axis = new Vector3(1, 1, 0);
        axis.normalize();
        RotateVec3(vec, axis, Math.PI);

        // Rotating (1,0,0) by 180 degrees around normalized (1,1,0)/sqrt(2) axis
        // Result should be (0, 1, 0)
        expect(vec.x).toBeCloseTo(0, 5);
        expect(vec.y).toBeCloseTo(1, 5);
        expect(vec.z).toBeCloseTo(0, 5);
    });

    it('should mutate the original vector in place', function ()
    {
        var vec = new Vector3(1, 0, 0);
        var axis = new Vector3(0, 0, 1);
        var originalRef = vec;
        RotateVec3(vec, axis, Math.PI / 2);

        expect(vec).toBe(originalRef);
        expect(vec.x).toBeCloseTo(0, 5);
        expect(vec.y).toBeCloseTo(1, 5);
    });

    it('should handle floating point radians correctly', function ()
    {
        var vec = new Vector3(1, 0, 0);
        var axis = new Vector3(0, 0, 1);
        RotateVec3(vec, axis, Math.PI / 4);

        var expected = Math.SQRT1_2;
        expect(vec.x).toBeCloseTo(expected, 5);
        expect(vec.y).toBeCloseTo(expected, 5);
        expect(vec.z).toBeCloseTo(0, 5);
    });
});
