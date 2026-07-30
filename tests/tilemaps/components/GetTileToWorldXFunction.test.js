var GetTileToWorldXFunction = require('../../../src/tilemaps/components/GetTileToWorldXFunction');
var CONST = require('../../../src/tilemaps/const/ORIENTATION_CONST');
var TileToWorldX = require('../../../src/tilemaps/components/TileToWorldX');
var NOOP = require('../../../src/utils/NOOP');

describe('Phaser.Tilemaps.Components.GetTileToWorldXFunction', function ()
{
    it('should return TileToWorldX for ORTHOGONAL orientation', function ()
    {
        var fn = GetTileToWorldXFunction(CONST.ORTHOGONAL);

        expect(fn).toBe(TileToWorldX);
    });

    it('should return NOOP for ISOMETRIC orientation', function ()
    {
        var fn = GetTileToWorldXFunction(CONST.ISOMETRIC);

        expect(fn).toBe(NOOP);
    });

    it('should return NOOP for STAGGERED orientation', function ()
    {
        var fn = GetTileToWorldXFunction(CONST.STAGGERED);

        expect(fn).toBe(NOOP);
    });

    it('should return NOOP for HEXAGONAL orientation', function ()
    {
        var fn = GetTileToWorldXFunction(CONST.HEXAGONAL);

        expect(fn).toBe(NOOP);
    });

    it('should return a function for ORTHOGONAL orientation', function ()
    {
        var fn = GetTileToWorldXFunction(CONST.ORTHOGONAL);

        expect(typeof fn).toBe('function');
    });

    it('should return a function for non-orthogonal orientations', function ()
    {
        var fn = GetTileToWorldXFunction(CONST.ISOMETRIC);

        expect(typeof fn).toBe('function');
    });

    it('should return NOOP for unknown orientation values', function ()
    {
        var fn = GetTileToWorldXFunction(99);

        expect(fn).toBe(NOOP);
    });

    it('should return NOOP when orientation is undefined', function ()
    {
        var fn = GetTileToWorldXFunction(undefined);

        expect(fn).toBe(NOOP);
    });

    it('should return NOOP when orientation is null', function ()
    {
        var fn = GetTileToWorldXFunction(null);

        expect(fn).toBe(NOOP);
    });

    it('should return NOOP when orientation is a negative number', function ()
    {
        var fn = GetTileToWorldXFunction(-1);

        expect(fn).toBe(NOOP);
    });
});
