var ParseGID = require('../../../../src/tilemaps/parsers/tiled/ParseGID');

var FLIPPED_HORIZONTAL = 0x80000000;
var FLIPPED_VERTICAL = 0x40000000;
var FLIPPED_ANTI_DIAGONAL = 0x20000000;

describe('Phaser.Tilemaps.Parsers.Tiled.ParseGID', function ()
{
    it('should return a GIDData object with expected properties', function ()
    {
        var result = ParseGID(1);

        expect(result).toHaveProperty('gid');
        expect(result).toHaveProperty('flippedHorizontal');
        expect(result).toHaveProperty('flippedVertical');
        expect(result).toHaveProperty('flippedAntiDiagonal');
        expect(result).toHaveProperty('rotation');
        expect(result).toHaveProperty('flipped');
    });

    it('should return the raw tile index with no flags set', function ()
    {
        var result = ParseGID(42);

        expect(result.gid).toBe(42);
        expect(result.flippedHorizontal).toBe(false);
        expect(result.flippedVertical).toBe(false);
        expect(result.flippedAntiDiagonal).toBe(false);
        expect(result.rotation).toBe(0);
        expect(result.flipped).toBe(false);
    });

    it('should return gid of 0 with rotation 0 and flipped false when input is 0', function ()
    {
        var result = ParseGID(0);

        expect(result.gid).toBe(0);
        expect(result.flippedHorizontal).toBe(false);
        expect(result.flippedVertical).toBe(false);
        expect(result.flippedAntiDiagonal).toBe(false);
        expect(result.rotation).toBe(0);
        expect(result.flipped).toBe(false);
    });

    it('should strip all three flip flags and return the raw tile index', function ()
    {
        var rawGID = 7;
        var gid = rawGID | FLIPPED_HORIZONTAL | FLIPPED_VERTICAL | FLIPPED_ANTI_DIAGONAL;
        var result = ParseGID(gid);

        expect(result.gid).toBe(rawGID);
    });

    it('should handle H+V+A flags: rotation PI/2, flipped true', function ()
    {
        var gid = 1 | FLIPPED_HORIZONTAL | FLIPPED_VERTICAL | FLIPPED_ANTI_DIAGONAL;
        var result = ParseGID(gid);

        expect(result.flippedHorizontal).toBe(true);
        expect(result.flippedVertical).toBe(true);
        expect(result.flippedAntiDiagonal).toBe(true);
        expect(result.rotation).toBeCloseTo(Math.PI / 2);
        expect(result.flipped).toBe(true);
    });

    it('should handle H+V flags only: rotation PI, flipped false', function ()
    {
        var gid = 1 | FLIPPED_HORIZONTAL | FLIPPED_VERTICAL;
        var result = ParseGID(gid);

        expect(result.flippedHorizontal).toBe(true);
        expect(result.flippedVertical).toBe(true);
        expect(result.flippedAntiDiagonal).toBe(false);
        expect(result.rotation).toBeCloseTo(Math.PI);
        expect(result.flipped).toBe(false);
    });

    it('should handle H+A flags only: rotation PI/2, flipped false', function ()
    {
        var gid = 1 | FLIPPED_HORIZONTAL | FLIPPED_ANTI_DIAGONAL;
        var result = ParseGID(gid);

        expect(result.flippedHorizontal).toBe(true);
        expect(result.flippedVertical).toBe(false);
        expect(result.flippedAntiDiagonal).toBe(true);
        expect(result.rotation).toBeCloseTo(Math.PI / 2);
        expect(result.flipped).toBe(false);
    });

    it('should handle H flag only: rotation 0, flipped true', function ()
    {
        var gid = 1 | FLIPPED_HORIZONTAL;
        var result = ParseGID(gid);

        expect(result.flippedHorizontal).toBe(true);
        expect(result.flippedVertical).toBe(false);
        expect(result.flippedAntiDiagonal).toBe(false);
        expect(result.rotation).toBe(0);
        expect(result.flipped).toBe(true);
    });

    it('should handle V+A flags only: rotation 3*PI/2, flipped false', function ()
    {
        var gid = 1 | FLIPPED_VERTICAL | FLIPPED_ANTI_DIAGONAL;
        var result = ParseGID(gid);

        expect(result.flippedHorizontal).toBe(false);
        expect(result.flippedVertical).toBe(true);
        expect(result.flippedAntiDiagonal).toBe(true);
        expect(result.rotation).toBeCloseTo(3 * Math.PI / 2);
        expect(result.flipped).toBe(false);
    });

    it('should handle V flag only: rotation PI, flipped true', function ()
    {
        var gid = 1 | FLIPPED_VERTICAL;
        var result = ParseGID(gid);

        expect(result.flippedHorizontal).toBe(false);
        expect(result.flippedVertical).toBe(true);
        expect(result.flippedAntiDiagonal).toBe(false);
        expect(result.rotation).toBeCloseTo(Math.PI);
        expect(result.flipped).toBe(true);
    });

    it('should handle A flag only: rotation 3*PI/2, flipped true', function ()
    {
        var gid = 1 | FLIPPED_ANTI_DIAGONAL;
        var result = ParseGID(gid);

        expect(result.flippedHorizontal).toBe(false);
        expect(result.flippedVertical).toBe(false);
        expect(result.flippedAntiDiagonal).toBe(true);
        expect(result.rotation).toBeCloseTo(3 * Math.PI / 2);
        expect(result.flipped).toBe(true);
    });

    it('should correctly strip flags from a large tile index', function ()
    {
        var rawGID = 1000;
        var gid = rawGID | FLIPPED_HORIZONTAL;
        var result = ParseGID(gid);

        expect(result.gid).toBe(rawGID);
        expect(result.flippedHorizontal).toBe(true);
    });

    it('should return boolean types for all flip flags', function ()
    {
        var result = ParseGID(1);

        expect(typeof result.flippedHorizontal).toBe('boolean');
        expect(typeof result.flippedVertical).toBe('boolean');
        expect(typeof result.flippedAntiDiagonal).toBe('boolean');
        expect(typeof result.flipped).toBe('boolean');
    });

    it('should return number types for gid and rotation', function ()
    {
        var result = ParseGID(1);

        expect(typeof result.gid).toBe('number');
        expect(typeof result.rotation).toBe('number');
    });
});
