var RunCull = require('../../../src/tilemaps/components/RunCull');

function makeTile(index, visible, alpha)
{
    return {
        index: (index === undefined) ? 1 : index,
        visible: (visible === undefined) ? true : visible,
        alpha: (alpha === undefined) ? 1 : alpha
    };
}

function makeLayer(width, height, fillIndex)
{
    var data = [];
    var idx = (fillIndex === undefined) ? 1 : fillIndex;

    for (var y = 0; y < height; y++)
    {
        data[y] = [];

        for (var x = 0; x < width; x++)
        {
            data[y][x] = makeTile(idx);
        }
    }

    return {
        data: data,
        width: width,
        height: height,
        tilemapLayer: { tilesDrawn: 0, tilesTotal: 0 }
    };
}

function makeBounds(left, right, top, bottom)
{
    return { left: left, right: right, top: top, bottom: bottom };
}

describe('Phaser.Tilemaps.Components.RunCull', function ()
{
    describe('return value', function ()
    {
        it('should return the outputArray', function ()
        {
            var layer = makeLayer(4, 4);
            var output = [];
            var result = RunCull(layer, makeBounds(0, 4, 0, 4), 0, output);

            expect(result).toBe(output);
        });

        it('should return an empty array when bounds produce no tiles', function ()
        {
            var layer = makeLayer(4, 4);
            var output = [];
            RunCull(layer, makeBounds(0, 0, 0, 0), 0, output);

            expect(output.length).toBe(0);
        });
    });

    describe('tilemapLayer statistics', function ()
    {
        it('should set tilesDrawn to the number of visible tiles collected', function ()
        {
            var layer = makeLayer(3, 3);
            var output = [];
            RunCull(layer, makeBounds(0, 3, 0, 3), 0, output);

            expect(layer.tilemapLayer.tilesDrawn).toBe(9);
        });

        it('should set tilesTotal to mapWidth * mapHeight', function ()
        {
            var layer = makeLayer(5, 4);
            RunCull(layer, makeBounds(0, 5, 0, 4), 0, []);

            expect(layer.tilemapLayer.tilesTotal).toBe(20);
        });

        it('should set tilesDrawn to 0 when all tiles are filtered', function ()
        {
            var layer = makeLayer(3, 3, -1);
            RunCull(layer, makeBounds(0, 3, 0, 3), 0, []);

            expect(layer.tilemapLayer.tilesDrawn).toBe(0);
        });
    });

    describe('bounds clamping', function ()
    {
        it('should clamp negative left bound to 0', function ()
        {
            var layer = makeLayer(4, 4);
            var output = [];
            RunCull(layer, makeBounds(-5, 2, 0, 1), 0, output);

            expect(output.length).toBe(2);
        });

        it('should clamp negative top bound to 0', function ()
        {
            var layer = makeLayer(4, 4);
            var output = [];
            RunCull(layer, makeBounds(0, 2, -5, 2), 0, output);

            expect(output.length).toBe(4);
        });

        it('should clamp right bound to mapWidth', function ()
        {
            var layer = makeLayer(4, 4);
            var output = [];
            RunCull(layer, makeBounds(0, 100, 0, 1), 0, output);

            expect(output.length).toBe(4);
        });

        it('should clamp bottom bound to mapHeight', function ()
        {
            var layer = makeLayer(4, 4);
            var output = [];
            RunCull(layer, makeBounds(0, 1, 0, 100), 0, output);

            expect(output.length).toBe(4);
        });

        it('should collect no tiles when left >= right after clamping', function ()
        {
            var layer = makeLayer(4, 4);
            var output = [];
            RunCull(layer, makeBounds(3, 2, 0, 4), 0, output);

            expect(output.length).toBe(0);
        });

        it('should collect no tiles when top >= bottom after clamping', function ()
        {
            var layer = makeLayer(4, 4);
            var output = [];
            RunCull(layer, makeBounds(0, 4, 3, 2), 0, output);

            expect(output.length).toBe(0);
        });
    });

    describe('tile filtering', function ()
    {
        it('should skip tiles where index is -1', function ()
        {
            var layer = makeLayer(3, 1);
            layer.data[0][1] = makeTile(-1);
            var output = [];
            RunCull(layer, makeBounds(0, 3, 0, 1), 0, output);

            expect(output.length).toBe(2);
        });

        it('should skip tiles where visible is false', function ()
        {
            var layer = makeLayer(3, 1);
            layer.data[0][1] = makeTile(1, false);
            var output = [];
            RunCull(layer, makeBounds(0, 3, 0, 1), 0, output);

            expect(output.length).toBe(2);
        });

        it('should skip tiles where alpha is 0', function ()
        {
            var layer = makeLayer(3, 1);
            layer.data[0][1] = makeTile(1, true, 0);
            var output = [];
            RunCull(layer, makeBounds(0, 3, 0, 1), 0, output);

            expect(output.length).toBe(2);
        });

        it('should skip null tiles', function ()
        {
            var layer = makeLayer(3, 1);
            layer.data[0][1] = null;
            var output = [];
            RunCull(layer, makeBounds(0, 3, 0, 1), 0, output);

            expect(output.length).toBe(2);
        });

        it('should include tiles with fractional alpha greater than 0', function ()
        {
            var layer = makeLayer(1, 1);
            layer.data[0][0] = makeTile(1, true, 0.5);
            var output = [];
            RunCull(layer, makeBounds(0, 1, 0, 1), 0, output);

            expect(output.length).toBe(1);
        });

        it('should skip tiles where the row is undefined', function ()
        {
            var layer = makeLayer(3, 3);
            layer.data[1] = undefined;
            var output = [];
            RunCull(layer, makeBounds(0, 3, 0, 3), 0, output);

            expect(output.length).toBe(6);
        });
    });

    describe('renderOrder 0 (right-down)', function ()
    {
        it('should iterate top-to-bottom, left-to-right', function ()
        {
            var layer = makeLayer(3, 2);
            var ids = [];

            for (var y = 0; y < 2; y++)
            {
                for (var x = 0; x < 3; x++)
                {
                    layer.data[y][x] = makeTile(y * 3 + x);
                }
            }

            layer.data[0][0] = makeTile(0);
            layer.data[0][0].index = 0;

            // Assign unique ids via a separate property for order verification
            var counter = 0;
            for (var ry = 0; ry < 2; ry++)
            {
                for (var rx = 0; rx < 3; rx++)
                {
                    layer.data[ry][rx] = { index: counter++, visible: true, alpha: 1, _id: (ry * 3 + rx) };
                }
            }

            var output = [];
            RunCull(layer, makeBounds(0, 3, 0, 2), 0, output);

            expect(output.length).toBe(6);
            // first tile should be top-left (row 0, col 0)
            expect(output[0]._id).toBe(0);
            // last tile should be bottom-right (row 1, col 2)
            expect(output[5]._id).toBe(5);
        });

        it('should collect all tiles in a 2x2 grid', function ()
        {
            var layer = makeLayer(2, 2);
            var output = [];
            RunCull(layer, makeBounds(0, 2, 0, 2), 0, output);

            expect(output.length).toBe(4);
        });
    });

    describe('renderOrder 1 (left-down)', function ()
    {
        it('should iterate top-to-bottom, right-to-left', function ()
        {
            var layer = makeLayer(3, 2);
            var counter = 0;

            for (var ry = 0; ry < 2; ry++)
            {
                for (var rx = 0; rx < 3; rx++)
                {
                    layer.data[ry][rx] = { index: 1, visible: true, alpha: 1, _id: (ry * 3 + rx) };
                }
            }

            var output = [];
            RunCull(layer, makeBounds(0, 3, 0, 2), 1, output);

            expect(output.length).toBe(6);
            // first tile: row 0, col 2 (right-most of top row)
            expect(output[0]._id).toBe(2);
            // second tile: row 0, col 1
            expect(output[1]._id).toBe(1);
        });

        it('should collect all tiles in a 2x2 grid', function ()
        {
            var layer = makeLayer(2, 2);
            var output = [];
            RunCull(layer, makeBounds(0, 2, 0, 2), 1, output);

            expect(output.length).toBe(4);
        });
    });

    describe('renderOrder 2 (right-up)', function ()
    {
        it('should iterate bottom-to-top, left-to-right', function ()
        {
            var layer = makeLayer(3, 2);

            for (var ry = 0; ry < 2; ry++)
            {
                for (var rx = 0; rx < 3; rx++)
                {
                    layer.data[ry][rx] = { index: 1, visible: true, alpha: 1, _id: (ry * 3 + rx) };
                }
            }

            var output = [];
            RunCull(layer, makeBounds(0, 3, 0, 2), 2, output);

            expect(output.length).toBe(6);
            // first tile: row 1, col 0 (left-most of bottom row)
            expect(output[0]._id).toBe(3);
        });

        it('should collect all tiles in a 2x2 grid', function ()
        {
            var layer = makeLayer(2, 2);
            var output = [];
            RunCull(layer, makeBounds(0, 2, 0, 2), 2, output);

            expect(output.length).toBe(4);
        });
    });

    describe('renderOrder 3 (left-up)', function ()
    {
        it('should iterate bottom-to-top, right-to-left', function ()
        {
            var layer = makeLayer(3, 2);

            for (var ry = 0; ry < 2; ry++)
            {
                for (var rx = 0; rx < 3; rx++)
                {
                    layer.data[ry][rx] = { index: 1, visible: true, alpha: 1, _id: (ry * 3 + rx) };
                }
            }

            var output = [];
            RunCull(layer, makeBounds(0, 3, 0, 2), 3, output);

            expect(output.length).toBe(6);
            // first tile: row 1, col 2 (right-most of bottom row)
            expect(output[0]._id).toBe(5);
            // second tile: row 1, col 1
            expect(output[1]._id).toBe(4);
        });

        it('should collect all tiles in a 2x2 grid', function ()
        {
            var layer = makeLayer(2, 2);
            var output = [];
            RunCull(layer, makeBounds(0, 2, 0, 2), 3, output);

            expect(output.length).toBe(4);
        });
    });

    describe('render order consistency', function ()
    {
        it('should collect the same number of tiles regardless of render order', function ()
        {
            var layer0 = makeLayer(3, 3);
            var layer1 = makeLayer(3, 3);
            var layer2 = makeLayer(3, 3);
            var layer3 = makeLayer(3, 3);
            var bounds = makeBounds(1, 3, 1, 3);

            var out0 = [];
            var out1 = [];
            var out2 = [];
            var out3 = [];

            RunCull(layer0, bounds, 0, out0);
            RunCull(layer1, bounds, 1, out1);
            RunCull(layer2, bounds, 2, out2);
            RunCull(layer3, bounds, 3, out3);

            expect(out0.length).toBe(4);
            expect(out1.length).toBe(4);
            expect(out2.length).toBe(4);
            expect(out3.length).toBe(4);
        });

        it('all render orders should collect the same tile objects for a given region', function ()
        {
            var tile00 = { index: 1, visible: true, alpha: 1 };
            var tile01 = { index: 2, visible: true, alpha: 1 };
            var tile10 = { index: 3, visible: true, alpha: 1 };
            var tile11 = { index: 4, visible: true, alpha: 1 };

            function makeSharedLayer()
            {
                return {
                    data: [ [ tile00, tile01 ], [ tile10, tile11 ] ],
                    width: 2,
                    height: 2,
                    tilemapLayer: { tilesDrawn: 0, tilesTotal: 0 }
                };
            }

            var bounds = makeBounds(0, 2, 0, 2);
            var out0 = [];
            var out1 = [];
            var out2 = [];
            var out3 = [];

            RunCull(makeSharedLayer(), bounds, 0, out0);
            RunCull(makeSharedLayer(), bounds, 1, out1);
            RunCull(makeSharedLayer(), bounds, 2, out2);
            RunCull(makeSharedLayer(), bounds, 3, out3);

            // All four outputs should contain the same 4 tiles (in different order)
            expect(out0.length).toBe(4);
            expect(out1.length).toBe(4);
            expect(out2.length).toBe(4);
            expect(out3.length).toBe(4);

            [out0, out1, out2, out3].forEach(function (out)
            {
                expect(out).toContain(tile00);
                expect(out).toContain(tile01);
                expect(out).toContain(tile10);
                expect(out).toContain(tile11);
            });
        });
    });

    describe('unknown renderOrder', function ()
    {
        it('should collect no tiles for an unrecognised render order', function ()
        {
            var layer = makeLayer(4, 4);
            var output = [];
            RunCull(layer, makeBounds(0, 4, 0, 4), 99, output);

            expect(output.length).toBe(0);
        });

        it('should still set tilesTotal for an unrecognised render order', function ()
        {
            var layer = makeLayer(4, 4);
            RunCull(layer, makeBounds(0, 4, 0, 4), 99, []);

            expect(layer.tilemapLayer.tilesTotal).toBe(16);
        });
    });

    describe('partial bounds within map', function ()
    {
        it('should collect only tiles within the specified sub-region', function ()
        {
            var layer = makeLayer(5, 5);
            var output = [];
            RunCull(layer, makeBounds(1, 3, 1, 3), 0, output);

            expect(output.length).toBe(4);
        });

        it('should respect a single-row bounds', function ()
        {
            var layer = makeLayer(4, 4);
            var output = [];
            RunCull(layer, makeBounds(0, 4, 2, 3), 0, output);

            expect(output.length).toBe(4);
        });

        it('should respect a single-column bounds', function ()
        {
            var layer = makeLayer(4, 4);
            var output = [];
            RunCull(layer, makeBounds(1, 2, 0, 4), 0, output);

            expect(output.length).toBe(4);
        });
    });
});
