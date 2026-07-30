var FromOrientationString = require('../../../src/tilemaps/parsers/FromOrientationString');

describe('Phaser.Tilemaps.Parsers.FromOrientationString', function ()
{
    it('should return 1 for isometric', function ()
    {
        expect(FromOrientationString('isometric')).toBe(1);
    });

    it('should return 2 for staggered', function ()
    {
        expect(FromOrientationString('staggered')).toBe(2);
    });

    it('should return 3 for hexagonal', function ()
    {
        expect(FromOrientationString('hexagonal')).toBe(3);
    });

    it('should return 0 for orthogonal', function ()
    {
        expect(FromOrientationString('orthogonal')).toBe(0);
    });

    it('should return 0 for any unrecognized string', function ()
    {
        expect(FromOrientationString('unknown')).toBe(0);
        expect(FromOrientationString('flat')).toBe(0);
        expect(FromOrientationString('3d')).toBe(0);
    });

    it('should be case-insensitive for isometric', function ()
    {
        expect(FromOrientationString('ISOMETRIC')).toBe(1);
        expect(FromOrientationString('Isometric')).toBe(1);
        expect(FromOrientationString('IsoMetric')).toBe(1);
    });

    it('should be case-insensitive for staggered', function ()
    {
        expect(FromOrientationString('STAGGERED')).toBe(2);
        expect(FromOrientationString('Staggered')).toBe(2);
    });

    it('should be case-insensitive for hexagonal', function ()
    {
        expect(FromOrientationString('HEXAGONAL')).toBe(3);
        expect(FromOrientationString('Hexagonal')).toBe(3);
    });

    it('should be case-insensitive for orthogonal', function ()
    {
        expect(FromOrientationString('ORTHOGONAL')).toBe(0);
        expect(FromOrientationString('Orthogonal')).toBe(0);
    });

    it('should return a number type', function ()
    {
        expect(typeof FromOrientationString('isometric')).toBe('number');
        expect(typeof FromOrientationString('orthogonal')).toBe('number');
    });
});
