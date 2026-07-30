var RadToDeg = require('../../src/math/RadToDeg');

describe('Phaser.Math.RadToDeg', function ()
{
    it('should convert 0 radians to 0 degrees', function ()
    {
        expect(RadToDeg(0)).toBe(0);
    });

    it('should convert PI/2 radians to 90 degrees', function ()
    {
        expect(RadToDeg(Math.PI / 2)).toBeCloseTo(90);
    });

    it('should convert PI radians to 180 degrees', function ()
    {
        expect(RadToDeg(Math.PI)).toBeCloseTo(180);
    });

    it('should convert 2*PI radians to 360 degrees', function ()
    {
        expect(RadToDeg(Math.PI * 2)).toBeCloseTo(360);
    });

    it('should convert PI/4 radians to 45 degrees', function ()
    {
        expect(RadToDeg(Math.PI / 4)).toBeCloseTo(45);
    });

    it('should handle negative radians', function ()
    {
        expect(RadToDeg(-Math.PI / 2)).toBeCloseTo(-90);
        expect(RadToDeg(-Math.PI)).toBeCloseTo(-180);
    });

    it('should handle values greater than 2*PI', function ()
    {
        expect(RadToDeg(Math.PI * 4)).toBeCloseTo(720);
    });
});
