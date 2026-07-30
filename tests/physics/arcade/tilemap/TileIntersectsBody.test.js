var TileIntersectsBody = require('../../../../src/physics/arcade/tilemap/TileIntersectsBody');

describe('Phaser.Physics.Arcade.Tilemap.TileIntersectsBody', function ()
{
    var tile;
    var body;

    beforeEach(function ()
    {
        tile = { left: 100, right: 200, top: 100, bottom: 200 };

        body = {
            position: { x: 100, y: 100 },
            right: 200,
            bottom: 200
        };
    });

    it('should return true when body fully overlaps the tile', function ()
    {
        body.position.x = 110;
        body.position.y = 110;
        body.right = 190;
        body.bottom = 190;

        expect(TileIntersectsBody(tile, body)).toBe(true);
    });

    it('should return true when body partially overlaps the tile from the left', function ()
    {
        body.position.x = 50;
        body.position.y = 110;
        body.right = 150;
        body.bottom = 190;

        expect(TileIntersectsBody(tile, body)).toBe(true);
    });

    it('should return true when body partially overlaps the tile from the right', function ()
    {
        body.position.x = 150;
        body.position.y = 110;
        body.right = 250;
        body.bottom = 190;

        expect(TileIntersectsBody(tile, body)).toBe(true);
    });

    it('should return true when body partially overlaps the tile from the top', function ()
    {
        body.position.x = 110;
        body.position.y = 50;
        body.right = 190;
        body.bottom = 150;

        expect(TileIntersectsBody(tile, body)).toBe(true);
    });

    it('should return true when body partially overlaps the tile from the bottom', function ()
    {
        body.position.x = 110;
        body.position.y = 150;
        body.right = 190;
        body.bottom = 250;

        expect(TileIntersectsBody(tile, body)).toBe(true);
    });

    it('should return false when body is entirely to the left of the tile', function ()
    {
        body.position.x = 0;
        body.position.y = 110;
        body.right = 100;
        body.bottom = 190;

        expect(TileIntersectsBody(tile, body)).toBe(false);
    });

    it('should return false when body is entirely to the right of the tile', function ()
    {
        body.position.x = 200;
        body.position.y = 110;
        body.right = 300;
        body.bottom = 190;

        expect(TileIntersectsBody(tile, body)).toBe(false);
    });

    it('should return false when body is entirely above the tile', function ()
    {
        body.position.x = 110;
        body.position.y = 0;
        body.right = 190;
        body.bottom = 100;

        expect(TileIntersectsBody(tile, body)).toBe(false);
    });

    it('should return false when body is entirely below the tile', function ()
    {
        body.position.x = 110;
        body.position.y = 200;
        body.right = 190;
        body.bottom = 300;

        expect(TileIntersectsBody(tile, body)).toBe(false);
    });

    it('should return false when body right edge exactly touches tile left edge', function ()
    {
        body.position.x = 50;
        body.position.y = 110;
        body.right = 100;
        body.bottom = 190;

        expect(TileIntersectsBody(tile, body)).toBe(false);
    });

    it('should return false when body bottom edge exactly touches tile top edge', function ()
    {
        body.position.x = 110;
        body.position.y = 50;
        body.right = 190;
        body.bottom = 100;

        expect(TileIntersectsBody(tile, body)).toBe(false);
    });

    it('should return true when body left edge exactly touches tile right edge minus one pixel', function ()
    {
        body.position.x = 199;
        body.position.y = 110;
        body.right = 299;
        body.bottom = 190;

        expect(TileIntersectsBody(tile, body)).toBe(true);
    });

    it('should return false when body left edge is at tile right edge', function ()
    {
        body.position.x = 200;
        body.position.y = 110;
        body.right = 300;
        body.bottom = 190;

        expect(TileIntersectsBody(tile, body)).toBe(false);
    });

    it('should return false when body top edge is at tile bottom edge', function ()
    {
        body.position.x = 110;
        body.position.y = 200;
        body.right = 190;
        body.bottom = 300;

        expect(TileIntersectsBody(tile, body)).toBe(false);
    });

    it('should return true when body is larger than the tile and fully contains it', function ()
    {
        body.position.x = 50;
        body.position.y = 50;
        body.right = 250;
        body.bottom = 250;

        expect(TileIntersectsBody(tile, body)).toBe(true);
    });

    it('should return true when bodies share only a corner region', function ()
    {
        body.position.x = 150;
        body.position.y = 150;
        body.right = 250;
        body.bottom = 250;

        expect(TileIntersectsBody(tile, body)).toBe(true);
    });

    it('should handle zero-sized tile rect', function ()
    {
        var zeroTile = { left: 100, right: 100, top: 100, bottom: 100 };

        body.position.x = 99;
        body.position.y = 99;
        body.right = 101;
        body.bottom = 101;

        expect(TileIntersectsBody(zeroTile, body)).toBe(true);
    });

    it('should handle negative coordinates', function ()
    {
        var negativeTile = { left: -200, right: -100, top: -200, bottom: -100 };

        body.position.x = -150;
        body.position.y = -150;
        body.right = -120;
        body.bottom = -120;

        expect(TileIntersectsBody(negativeTile, body)).toBe(true);
    });

    it('should return false when body is far to the left with negative coordinates', function ()
    {
        var negativeTile = { left: -200, right: -100, top: -200, bottom: -100 };

        body.position.x = -500;
        body.position.y = -150;
        body.right = -201;
        body.bottom = -120;

        expect(TileIntersectsBody(negativeTile, body)).toBe(false);
    });
});
