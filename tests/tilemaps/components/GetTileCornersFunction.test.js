var GetTileCornersFunction = require('../../../src/tilemaps/components/GetTileCornersFunction');
var CONST = require('../../../src/tilemaps/const/ORIENTATION_CONST');
var GetTileCorners = require('../../../src/tilemaps/components/GetTileCorners');
var HexagonalGetTileCorners = require('../../../src/tilemaps/components/HexagonalGetTileCorners');
var NOOP = require('../../../src/utils/NOOP');

describe('Phaser.Tilemaps.Components.GetTileCornersFunction', function ()
{
    it('should return GetTileCorners for ORTHOGONAL orientation', function ()
    {
        var result = GetTileCornersFunction(CONST.ORTHOGONAL);

        expect(result).toBe(GetTileCorners);
    });

    it('should return NOOP for ISOMETRIC orientation', function ()
    {
        var result = GetTileCornersFunction(CONST.ISOMETRIC);

        expect(result).toBe(NOOP);
    });

    it('should return HexagonalGetTileCorners for HEXAGONAL orientation', function ()
    {
        var result = GetTileCornersFunction(CONST.HEXAGONAL);

        expect(result).toBe(HexagonalGetTileCorners);
    });

    it('should return NOOP for STAGGERED orientation', function ()
    {
        var result = GetTileCornersFunction(CONST.STAGGERED);

        expect(result).toBe(NOOP);
    });

    it('should return NOOP for an unknown orientation value', function ()
    {
        var result = GetTileCornersFunction(99);

        expect(result).toBe(NOOP);
    });

    it('should return NOOP for undefined orientation', function ()
    {
        var result = GetTileCornersFunction(undefined);

        expect(result).toBe(NOOP);
    });

    it('should return a function for all known orientations', function ()
    {
        expect(typeof GetTileCornersFunction(CONST.ORTHOGONAL)).toBe('function');
        expect(typeof GetTileCornersFunction(CONST.ISOMETRIC)).toBe('function');
        expect(typeof GetTileCornersFunction(CONST.HEXAGONAL)).toBe('function');
        expect(typeof GetTileCornersFunction(CONST.STAGGERED)).toBe('function');
    });
});
