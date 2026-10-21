var GetTilesWithinShape = require('../../../src/tilemaps/components/GetTilesWithinShape');
var CONST = require('../../../src/tilemaps/const/ORIENTATION_CONST');
var Geom = require('../../../src/geom/');

describe('Phaser.Tilemaps.Components.GetTilesWithinShape', function ()
{
    var layer;
    var camera;
    var TILE_WIDTH = 32;
    var TILE_HEIGHT = 32;
    var GRID_WIDTH = 5;
    var GRID_HEIGHT = 5;

    function createTile(x, y)
    {
        return { x: x, y: y, index: 1, collides: false, hasInterestingFace: false };
    }

    function createLayer(scaleX, scaleY)
    {
        if (scaleX === undefined) { scaleX = 1; }
        if (scaleY === undefined) { scaleY = 1; }

        var data = [];

        for (var ty = 0; ty < GRID_HEIGHT; ty++)
        {
            data[ty] = [];
            for (var tx = 0; tx < GRID_WIDTH; tx++)
            {
                data[ty][tx] = createTile(tx, ty);
            }
        }

        var tilemapLayer = {
            scaleX: scaleX,
            scaleY: scaleY,
            worldToTileXY: function (worldX, worldY, snapToFloor, point)
            {
                if (snapToFloor)
                {
                    point.x = Math.floor(worldX / TILE_WIDTH);
                    point.y = Math.floor(worldY / TILE_HEIGHT);
                }
                else
                {
                    point.x = worldX / TILE_WIDTH;
                    point.y = worldY / TILE_HEIGHT;
                }
            },
            tileToWorldXY: function (tileX, tileY, point)
            {
                point.x = tileX * TILE_WIDTH * scaleX;
                point.y = tileY * TILE_HEIGHT * scaleY;
            }
        };

        return {
            orientation: CONST.ORTHOGONAL,
            tileWidth: TILE_WIDTH,
            tileHeight: TILE_HEIGHT,
            width: GRID_WIDTH,
            height: GRID_HEIGHT,
            data: data,
            tilemapLayer: tilemapLayer
        };
    }

    beforeEach(function ()
    {
        layer = createLayer();
        camera = {};
    });

    it('should return an empty array when shape is undefined', function ()
    {
        var result = GetTilesWithinShape(undefined, {}, camera, layer);

        expect(result).toEqual([]);
    });

    it('should return an empty array when layer orientation is STAGGERED', function ()
    {
        layer.orientation = CONST.STAGGERED;

        var shape = new Geom.Rectangle(0, 0, 64, 64);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result).toEqual([]);
    });

    it('should return an empty array when layer orientation is HEXAGONAL', function ()
    {
        layer.orientation = CONST.HEXAGONAL;

        var shape = new Geom.Rectangle(0, 0, 64, 64);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result).toEqual([]);
    });

    it('should return an array when given a valid orthogonal layer and shape', function ()
    {
        var shape = new Geom.Rectangle(0, 0, 32, 32);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(Array.isArray(result)).toBe(true);
    });

    it('should return the single tile whose bounds exactly match a Rectangle shape', function ()
    {
        // Rectangle(32, 32, 32, 32) covers exactly tile (1,1) in world space
        var shape = new Geom.Rectangle(32, 32, 32, 32);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result.length).toBe(1);
        expect(result[0].x).toBe(1);
        expect(result[0].y).toBe(1);
    });

    it('should return all tiles when a Rectangle shape covers the entire layer', function ()
    {
        // 5x5 grid of 32x32 tiles = 160x160 world pixels
        var shape = new Geom.Rectangle(0, 0, 160, 160);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result.length).toBe(25);
    });

    it('should return the first row of tiles for a Rectangle shape covering only row 0', function ()
    {
        var shape = new Geom.Rectangle(0, 0, 160, 32);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result.length).toBe(5);
        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].y).toBe(0);
        }
    });

    it('should return a single column of tiles for a Rectangle shape covering only column 0', function ()
    {
        var shape = new Geom.Rectangle(0, 0, 32, 160);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result.length).toBe(5);
        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].x).toBe(0);
        }
    });

    it('should return tiles intersecting a Circle centered within a tile', function ()
    {
        // Circle centered at world (80, 80) covers tile (2,2) which has world rect (64,64)-(96,96)
        var shape = new Geom.Circle(80, 80, 16);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result.length).toBeGreaterThan(0);

        var tileXValues = result.map(function (t) { return t.x; });
        var tileYValues = result.map(function (t) { return t.y; });

        expect(tileXValues).toContain(2);
        expect(tileYValues).toContain(2);
    });

    it('should return tiles intersecting a Circle that spans multiple tiles', function ()
    {
        // Large circle centered at (80, 80) with radius 64 should cover many tiles
        var shape = new Geom.Circle(80, 80, 64);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result.length).toBeGreaterThan(1);
    });

    it('should return tiles intersecting a Triangle shape', function ()
    {
        // Triangle covering top-left portion of the layer
        var shape = new Geom.Triangle(0, 0, 64, 0, 0, 64);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should return tiles intersecting a horizontal Line shape', function ()
    {
        // Horizontal line at y=16 spanning x=0 to x=96 (crosses tiles (0,0), (1,0), (2,0))
        var shape = new Geom.Line(0, 16, 96, 16);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result.length).toBeGreaterThan(0);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].y).toBe(0);
        }
    });

    it('should return tiles intersecting a diagonal Line shape', function ()
    {
        // Diagonal line from (0,0) to (128,128) - should cross multiple tiles
        var shape = new Geom.Line(0, 0, 128, 128);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result.length).toBeGreaterThan(1);
    });

    it('should return tiles intersecting a vertical Line shape', function ()
    {
        // Vertical line at x=16 spanning y=0 to y=96 (crosses tiles in column 0, rows 0-2)
        var shape = new Geom.Line(16, 0, 16, 96);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result.length).toBeGreaterThan(0);

        for (var i = 0; i < result.length; i++)
        {
            expect(result[i].x).toBe(0);
        }
    });

    it('should return an empty array when shape is outside the layer bounds', function ()
    {
        // Shape far outside the 5x5 grid (160x160 world pixels)
        var shape = new Geom.Rectangle(1000, 1000, 32, 32);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result).toEqual([]);
    });

    it('should return tile objects with x and y properties', function ()
    {
        var shape = new Geom.Rectangle(0, 0, 32, 32);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result.length).toBeGreaterThan(0);
        expect(result[0].x).toBeDefined();
        expect(result[0].y).toBeDefined();
    });

    it('should return an empty array for an object that is not a recognised Geom shape', function ()
    {
        // Plain object with bounding box properties but no Geom prototype —
        // intersectTest will remain NOOP (returns undefined/falsy), so nothing passes
        var shape = { left: 0, top: 0, right: 64, bottom: 64 };
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result).toEqual([]);
    });

    it('should account for tilemapLayer scaleX and scaleY when building tile rects', function ()
    {
        // Scale up tiles 2x: each tile is now 64x64 in world space
        layer = createLayer(2, 2);

        // Rectangle covering the large scaled tile at (0,0) → world rect (0,0)-(64,64)
        var shape = new Geom.Rectangle(0, 0, 64, 64);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result.length).toBeGreaterThan(0);
    });

    it('should respect isNotEmpty filtering option and skip empty tiles', function ()
    {
        // Mark all tiles as empty (index -1)
        for (var ty = 0; ty < GRID_HEIGHT; ty++)
        {
            for (var tx = 0; tx < GRID_WIDTH; tx++)
            {
                layer.data[ty][tx].index = -1;
            }
        }

        var shape = new Geom.Rectangle(0, 0, 160, 160);
        var result = GetTilesWithinShape(shape, { isNotEmpty: true }, camera, layer);

        expect(result).toEqual([]);
    });

    it('should respect isColliding filtering option and only return colliding tiles', function ()
    {
        // Mark only tile (0,0) as colliding
        layer.data[0][0].collides = true;

        var shape = new Geom.Rectangle(0, 0, 64, 32);
        var result = GetTilesWithinShape(shape, { isColliding: true }, camera, layer);

        expect(result.length).toBe(1);
        expect(result[0].x).toBe(0);
        expect(result[0].y).toBe(0);
    });

    it('should return tiles containing null entries as non-results', function ()
    {
        // Set tile (0,0) to null — GetTilesWithin skips null tiles
        layer.data[0][0] = null;

        var shape = new Geom.Rectangle(0, 0, 32, 32);
        var result = GetTilesWithinShape(shape, {}, camera, layer);

        expect(result).toEqual([]);
    });

    describe('isometric layers', function ()
    {
        var ISO_TILE_WIDTH = 64;
        var ISO_TILE_HEIGHT = 32;

        function createIsometricLayer()
        {
            var data = [];

            for (var ty = 0; ty < GRID_HEIGHT; ty++)
            {
                data[ty] = [];
                for (var tx = 0; tx < GRID_WIDTH; tx++)
                {
                    data[ty][tx] = createTile(tx, ty);
                }
            }

            //  Same projection as IsometricTileToWorldXY: the top-left of the tile's bounding box
            var tilemapLayer = {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                scrollFactorX: 1,
                scrollFactorY: 1,
                tileToWorldXY: function (tileX, tileY, point)
                {
                    point.x = (tileX - tileY) * ISO_TILE_WIDTH / 2;
                    point.y = (tileX + tileY) * ISO_TILE_HEIGHT / 2;
                }
            };

            return {
                orientation: CONST.ISOMETRIC,
                tileWidth: ISO_TILE_WIDTH,
                tileHeight: ISO_TILE_HEIGHT,
                baseTileWidth: ISO_TILE_WIDTH,
                baseTileHeight: ISO_TILE_HEIGHT,
                width: GRID_WIDTH,
                height: GRID_HEIGHT,
                data: data,
                tilemapLayer: tilemapLayer
            };
        }

        function coords(tiles)
        {
            return tiles.map(function (tile) { return tile.x + ',' + tile.y; }).sort();
        }

        beforeEach(function ()
        {
            layer = createIsometricLayer();
            camera = { scrollX: 0, scrollY: 0 };
        });

        it('should return the tile whose diamond contains a small Circle', function ()
        {
            //  Tile (2, 1) spans x 32 to 96 and y 48 to 80, its center is (64, 64)
            var result = GetTilesWithinShape(new Geom.Circle(64, 64, 2), {}, camera, layer);

            expect(coords(result)).toEqual([ '2,1' ]);
        });

        it('should use the diamond and not the bounding box of a tile', function ()
        {
            //  (34, 50) is inside the bounding box of tile (2, 1) but in the diamond of tile (1, 1)
            var result = GetTilesWithinShape(new Geom.Circle(34, 50, 1), {}, camera, layer);

            expect(coords(result)).toEqual([ '1,1' ]);
        });

        it('should return every tile when a Rectangle covers the whole map', function ()
        {
            var result = GetTilesWithinShape(new Geom.Rectangle(-200, -10, 500, 300), {}, camera, layer);

            expect(result.length).toBe(GRID_WIDTH * GRID_HEIGHT);
        });

        it('should return the tiles of one row for a Line along that row', function ()
        {
            //  Through the centers of tiles (0, 2) to (4, 2)
            var line = new Geom.Line(-32, 48, 96, 112);
            var result = GetTilesWithinShape(line, {}, camera, layer);

            expect(coords(result)).toEqual([ '0,2', '1,2', '2,2', '3,2', '4,2' ]);
        });

        it('should return tiles intersecting a Triangle', function ()
        {
            var triangle = new Geom.Triangle(60, 62, 68, 62, 64, 66);
            var result = GetTilesWithinShape(triangle, {}, camera, layer);

            expect(coords(result)).toEqual([ '2,1' ]);
        });

        it('should return an empty array when the shape is outside the map', function ()
        {
            var result = GetTilesWithinShape(new Geom.Circle(1000, 1000, 10), {}, camera, layer);

            expect(result).toEqual([]);
        });
    });
});
