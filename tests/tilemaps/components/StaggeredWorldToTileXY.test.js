var StaggeredWorldToTileXY = require('../../../src/tilemaps/components/StaggeredWorldToTileXY');
var StaggeredTileToWorldXY = require('../../../src/tilemaps/components/StaggeredTileToWorldXY');
var Vector2 = require('../../../src/math/Vector2');

describe('Phaser.Tilemaps.Components.StaggeredWorldToTileXY', function ()
{
    var layer;

    //  Center of the tile's diamond, from the top left of its bounding box
    function center (tileX, tileY)
    {
        var topLeft = StaggeredTileToWorldXY(tileX, tileY, null, null, layer);

        return {
            x: topLeft.x + layer.baseTileWidth / 2,
            y: topLeft.y + layer.baseTileHeight / 2
        };
    }

    beforeEach(function ()
    {
        layer = {
            baseTileWidth: 32,
            baseTileHeight: 32,
            tilemapLayer: null
        };
    });

    describe('return value', function ()
    {
        it('should return a Vector2', function ()
        {
            var result = StaggeredWorldToTileXY(0, 0, true, null, null, layer);

            expect(result).toBeInstanceOf(Vector2);
        });

        it('should create a new Vector2 when no point is provided', function ()
        {
            var result = StaggeredWorldToTileXY(32, 32, true, null, null, layer);

            expect(result).toBeInstanceOf(Vector2);
        });

        it('should use and return the provided point object', function ()
        {
            var point = new Vector2();
            var result = StaggeredWorldToTileXY(32, 32, true, point, null, layer);

            expect(result).toBe(point);
        });

        it('should set x and y on the provided point', function ()
        {
            var point = new Vector2();
            var c = center(2, 4);

            StaggeredWorldToTileXY(c.x, c.y, true, point, null, layer);

            expect(point.x).toBe(2);
            expect(point.y).toBe(4);
        });
    });

    describe('coordinate conversion without tilemapLayer', function ()
    {
        it('should return the tile whose diamond contains the point', function ()
        {
            [ [ 32, 32 ], [ 64, 32 ], [ 32, 16 ] ].forEach(function (size)
            {
                layer.baseTileWidth = size[0];
                layer.baseTileHeight = size[1];

                var hw = size[0] / 2 - 1;
                var hh = size[1] / 2 - 1;

                for (var tileY = 0; tileY < 6; tileY++)
                {
                    for (var tileX = 0; tileX < 4; tileX++)
                    {
                        var c = center(tileX, tileY);

                        //  The center and points just inside each corner of the diamond
                        [ [ 0, 0 ], [ -hw, 0 ], [ hw, 0 ], [ 0, -hh ], [ 0, hh ] ].forEach(function (offset)
                        {
                            var result = StaggeredWorldToTileXY(c.x + offset[0], c.y + offset[1], true, null, null, layer);

                            expect([ result.x, result.y ]).toEqual([ tileX, tileY ]);
                        });
                    }
                }
            });
        });

        it('should return the neighboring row in the corners of the bounding box', function ()
        {
            //  Tile (1, 2) has its bounding box at 32,32 to 64,64. Its top corners
            //  belong to the diamonds of row 1 above it.
            expect(StaggeredWorldToTileXY(33, 33, true, null, null, layer)).toEqual(new Vector2(0, 1));
            expect(StaggeredWorldToTileXY(63, 33, true, null, null, layer)).toEqual(new Vector2(1, 1));
            expect(StaggeredWorldToTileXY(48, 33, true, null, null, layer)).toEqual(new Vector2(1, 2));
        });

        it('should shift odd rows half a tile to the right', function ()
        {
            //  Tile (0, 1) spans x = 16 to 48 across its middle, left of it is tile (-1, 1)
            expect(StaggeredWorldToTileXY(12, 32, true, null, null, layer)).toEqual(new Vector2(-1, 1));
            expect(StaggeredWorldToTileXY(20, 32, true, null, null, layer)).toEqual(new Vector2(0, 1));
        });

        it('should handle negative world coordinates with snapToFloor true', function ()
        {
            var result = StaggeredWorldToTileXY(-16, -16, true, null, null, layer);

            expect(result.x).toBe(-1);
            expect(result.y).toBe(-2);
        });

        it('should return exact (non-floored) values when snapToFloor is false', function ()
        {
            // y = 32 / 16 = 2.0, x = (32 + 0) / 32 = 1.0
            var result = StaggeredWorldToTileXY(32, 32, false, null, null, layer);

            expect(result.x).toBeCloseTo(1.0);
            expect(result.y).toBeCloseTo(2.0);
        });

        it('should return fractional tile coordinates when snapToFloor is false', function ()
        {
            // y = 10 / 16 = 0.625
            var result = StaggeredWorldToTileXY(10, 10, false, null, null, layer);

            expect(result.y).toBeCloseTo(0.625);
        });

        it('should handle negative world coordinates with snapToFloor false', function ()
        {
            var result = StaggeredWorldToTileXY(-32, -16, false, null, null, layer);

            expect(result.y).toBeCloseTo(-1.0);
        });

        it('should handle zero tile position', function ()
        {
            var result = StaggeredWorldToTileXY(0, 0, false, null, null, layer);

            expect(result.x).toBeCloseTo(0);
            expect(result.y).toBeCloseTo(0);
        });

        it('should handle floating point world coordinates', function ()
        {
            var result = StaggeredWorldToTileXY(32.5, 32.5, false, null, null, layer);

            expect(result.y).toBeCloseTo(32.5 / 16);
        });
    });

    describe('coordinate conversion with tilemapLayer', function ()
    {
        var camera;
        var tilemapLayer;

        //  Center of tile (1, 2) with no layer offset, scale or scroll
        var cx = 48;
        var cy = 48;

        beforeEach(function ()
        {
            camera = {
                scrollX: 0,
                scrollY: 0
            };

            tilemapLayer = {
                x: 0,
                y: 0,
                scaleX: 1,
                scaleY: 1,
                scrollFactorX: 1,
                scrollFactorY: 1,
                scene: {
                    cameras: {
                        main: camera
                    }
                }
            };

            layer.tilemapLayer = tilemapLayer;
        });

        it('should use provided camera instead of scene main camera', function ()
        {
            var customCamera = {
                scrollX: 0,
                scrollY: 0
            };

            var result = StaggeredWorldToTileXY(cx, cy, true, null, customCamera, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should fall back to scene main camera when no camera provided', function ()
        {
            var result = StaggeredWorldToTileXY(cx, cy, true, null, null, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should account for layer x position', function ()
        {
            tilemapLayer.x = 32;

            var result = StaggeredWorldToTileXY(cx + 32, cy, true, null, camera, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should account for layer y position', function ()
        {
            tilemapLayer.y = 16;

            var result = StaggeredWorldToTileXY(cx, cy + 16, true, null, camera, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should account for camera horizontal scroll', function ()
        {
            camera.scrollX = 32;
            tilemapLayer.scrollFactorX = 0;

            var result = StaggeredWorldToTileXY(cx + 32, cy, true, null, camera, layer);

            expect(result.x).toBe(1);
        });

        it('should account for camera vertical scroll', function ()
        {
            camera.scrollY = 16;
            tilemapLayer.scrollFactorY = 0;

            var result = StaggeredWorldToTileXY(cx, cy + 16, true, null, camera, layer);

            expect(result.y).toBe(2);
        });

        it('should apply scaleX to tile width', function ()
        {
            tilemapLayer.scaleX = 2;

            //  Tile (1, 2) is now 64 wide, centered at x = 96
            var result = StaggeredWorldToTileXY(96, cy, true, null, camera, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should apply scaleY to tile height', function ()
        {
            tilemapLayer.scaleY = 2;

            //  Tile (1, 2) is now 64 high, centered at y = 96
            var result = StaggeredWorldToTileXY(cx, 96, true, null, camera, layer);

            expect(result.x).toBe(1);
            expect(result.y).toBe(2);
        });

        it('should respect scrollFactorX of 1 (default, full camera scroll)', function ()
        {
            camera.scrollX = 32;
            tilemapLayer.scrollFactorX = 1;

            // scrollX contribution = 32 * (1 - 1) = 0
            var result = StaggeredWorldToTileXY(cx, cy, true, null, camera, layer);

            expect(result.x).toBe(1);
        });

        it('should respect scrollFactorX of 0 (no camera scroll applied)', function ()
        {
            camera.scrollX = 100;
            tilemapLayer.scrollFactorX = 0;

            // scrollX contribution = 100 * (1 - 0) = 100
            var result = StaggeredWorldToTileXY(cx + 100, cy, true, null, camera, layer);

            expect(result.x).toBe(1);
        });
    });
});
