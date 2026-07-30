var DegToRad = require('../../src/math/DegToRad');

describe('Phaser.Math.DegToRad', function ()
{
    it('should convert 0 degrees to 0 radians', function ()
    {
        expect(DegToRad(0)).toBe(0);
    });

    it('should convert 90 degrees to PI/2 radians', function ()
    {
        expect(DegToRad(90)).toBeCloseTo(Math.PI / 2);
    });

    it('should convert 180 degrees to PI radians', function ()
    {
        expect(DegToRad(180)).toBeCloseTo(Math.PI);
    });

    it('should convert 360 degrees to 2*PI radians', function ()
    {
        expect(DegToRad(360)).toBeCloseTo(Math.PI * 2);
    });

    it('should convert 45 degrees correctly', function ()
    {
        expect(DegToRad(45)).toBeCloseTo(Math.PI / 4);
    });

    it('should handle negative degrees', function ()
    {
        expect(DegToRad(-90)).toBeCloseTo(-Math.PI / 2);
        expect(DegToRad(-180)).toBeCloseTo(-Math.PI);
    });

    it('should handle values greater than 360', function ()
    {
        expect(DegToRad(720)).toBeCloseTo(Math.PI * 4);
    });
});
