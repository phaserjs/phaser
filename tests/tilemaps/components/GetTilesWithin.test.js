var GetTilesWithin = require('../../../src/tilemaps/components/GetTilesWithin');

describe('Phaser.Tilemaps.Components.GetTilesWithin', function ()
{
    function makeTile(index, collides, hasInterestingFace)
    {
        return {
            index: index === undefined ? 1 : index,
            collides: collides === undefined ? false : collides,
            hasInterestingFace: hasInterestingFace === undefined ? false : hasInterestingFace
        };
    }

    function makeLayer(width, height)
    {
        var data = [];

        for (var y = 0; y < height; y++)
        {
            var row = [];

            for (var x = 0; x < width; x++)
            {
                row.push(makeTile(y * width + x + 1));
            }

            data.push(row);
        }

        return { width: width, height: height, data: data };
    }

    var layer;

    beforeEach(function ()
    {
        layer = makeLayer(5, 5);
    });

    it('should return all tiles when no filtering options are given', function ()
    {
        var result = GetTilesWithin(0, 0, 5, 5, {}, layer);

        expect(result.length).toBe(25);
    });

    it('should return tiles within the specified rectangular area', function ()
    {
        var result = GetTilesWithin(1, 1, 2, 2, {}, layer);

        expect(result.length).toBe(4);
        expect(result[0]).toBe(layer.data[1][1]);
        expect(result[1]).toBe(layer.data[1][2]);
        expect(result[2]).toBe(layer.data[2][1]);
        expect(result[3]).toBe(layer.data[2][2]);
    });

    it('should default tileX to 0 when undefined', function ()
    {
        var result = GetTilesWithin(undefined, 0, 2, 2, {}, layer);

        expect(result[0]).toBe(layer.data[0][0]);
    });

    it('should default tileY to 0 when undefined', function ()
    {
        var result = GetTilesWithin(0, undefined, 2, 2, {}, layer);

        expect(result[0]).toBe(layer.data[0][0]);
    });

    it('should default width to layer.width when undefined', function ()
    {
        var result = GetTilesWithin(0, 0, undefined, 1, {}, layer);

        expect(result.length).toBe(5);
    });

    it('should default height to layer.height when undefined', function ()
    {
        var result = GetTilesWithin(0, 0, 1, undefined, {}, layer);

        expect(result.length).toBe(5);
    });

    it('should default filteringOptions to empty object when falsy', function ()
    {
        var result = GetTilesWithin(0, 0, 5, 5, null, layer);

        expect(result.length).toBe(25);
    });

    it('should clip negative tileX to 0 and reduce width accordingly', function ()
    {
        var result = GetTilesWithin(-2, 0, 4, 1, {}, layer);

        // tileX clipped to 0, width becomes 4 + (-2) = 2
        expect(result.length).toBe(2);
        expect(result[0]).toBe(layer.data[0][0]);
        expect(result[1]).toBe(layer.data[0][1]);
    });

    it('should clip negative tileY to 0 and reduce height accordingly', function ()
    {
        var result = GetTilesWithin(0, -2, 1, 4, {}, layer);

        // tileY clipped to 0, height becomes 4 + (-2) = 2
        expect(result.length).toBe(2);
        expect(result[0]).toBe(layer.data[0][0]);
        expect(result[1]).toBe(layer.data[1][0]);
    });

    it('should clip width when tileX + width exceeds layer width', function ()
    {
        var result = GetTilesWithin(3, 0, 5, 1, {}, layer);

        // Only columns 3 and 4 are valid
        expect(result.length).toBe(2);
        expect(result[0]).toBe(layer.data[0][3]);
        expect(result[1]).toBe(layer.data[0][4]);
    });

    it('should clip height when tileY + height exceeds layer height', function ()
    {
        var result = GetTilesWithin(0, 3, 1, 5, {}, layer);

        // Only rows 3 and 4 are valid
        expect(result.length).toBe(2);
        expect(result[0]).toBe(layer.data[3][0]);
        expect(result[1]).toBe(layer.data[4][0]);
    });

    it('should return empty array when area is fully outside layer bounds', function ()
    {
        var result = GetTilesWithin(10, 0, 2, 2, {}, layer);

        expect(result.length).toBe(0);
    });

    it('should return empty array when tileX is so negative that width becomes zero or less', function ()
    {
        var result = GetTilesWithin(-10, 0, 2, 2, {}, layer);

        expect(result.length).toBe(0);
    });

    it('should skip null tiles', function ()
    {
        layer.data[0][0] = null;
        layer.data[0][1] = null;

        var result = GetTilesWithin(0, 0, 3, 1, {}, layer);

        expect(result.length).toBe(1);
        expect(result[0]).toBe(layer.data[0][2]);
    });

    it('should filter out empty tiles when isNotEmpty is true', function ()
    {
        layer.data[0][0].index = -1;
        layer.data[0][2].index = -1;

        var result = GetTilesWithin(0, 0, 5, 1, { isNotEmpty: true }, layer);

        expect(result.length).toBe(3);
        expect(result.indexOf(layer.data[0][0])).toBe(-1);
        expect(result.indexOf(layer.data[0][2])).toBe(-1);
    });

    it('should include empty tiles when isNotEmpty is false', function ()
    {
        layer.data[0][0].index = -1;

        var result = GetTilesWithin(0, 0, 5, 1, { isNotEmpty: false }, layer);

        expect(result.length).toBe(5);
    });

    it('should filter out non-colliding tiles when isColliding is true', function ()
    {
        layer.data[0][1].collides = true;
        layer.data[0][3].collides = true;

        var result = GetTilesWithin(0, 0, 5, 1, { isColliding: true }, layer);

        expect(result.length).toBe(2);
        expect(result[0]).toBe(layer.data[0][1]);
        expect(result[1]).toBe(layer.data[0][3]);
    });

    it('should include all tiles when isColliding is false', function ()
    {
        var result = GetTilesWithin(0, 0, 5, 1, { isColliding: false }, layer);

        expect(result.length).toBe(5);
    });

    it('should filter out tiles without interesting faces when hasInterestingFace is true', function ()
    {
        layer.data[0][0].hasInterestingFace = true;
        layer.data[0][4].hasInterestingFace = true;

        var result = GetTilesWithin(0, 0, 5, 1, { hasInterestingFace: true }, layer);

        expect(result.length).toBe(2);
        expect(result[0]).toBe(layer.data[0][0]);
        expect(result[1]).toBe(layer.data[0][4]);
    });

    it('should include all tiles when hasInterestingFace is false', function ()
    {
        var result = GetTilesWithin(0, 0, 5, 1, { hasInterestingFace: false }, layer);

        expect(result.length).toBe(5);
    });

    it('should apply multiple filters together', function ()
    {
        // tile at [0][1]: not empty (index=1), collides, interesting face
        layer.data[0][1].index = 1;
        layer.data[0][1].collides = true;
        layer.data[0][1].hasInterestingFace = true;

        // tile at [0][2]: not empty but no collision
        layer.data[0][2].index = 1;
        layer.data[0][2].collides = false;
        layer.data[0][2].hasInterestingFace = true;

        // tile at [0][3]: empty but collides
        layer.data[0][3].index = -1;
        layer.data[0][3].collides = true;
        layer.data[0][3].hasInterestingFace = true;

        var result = GetTilesWithin(0, 0, 5, 1, {
            isNotEmpty: true,
            isColliding: true,
            hasInterestingFace: true
        }, layer);

        expect(result.length).toBe(1);
        expect(result[0]).toBe(layer.data[0][1]);
    });

    it('should return tiles in row-major order', function ()
    {
        var result = GetTilesWithin(0, 0, 2, 2, {}, layer);

        expect(result[0]).toBe(layer.data[0][0]);
        expect(result[1]).toBe(layer.data[0][1]);
        expect(result[2]).toBe(layer.data[1][0]);
        expect(result[3]).toBe(layer.data[1][1]);
    });

    it('should return references to the original tile objects', function ()
    {
        var result = GetTilesWithin(0, 0, 1, 1, {}, layer);

        expect(result[0]).toBe(layer.data[0][0]);
    });

    it('should handle a 1x1 area', function ()
    {
        var result = GetTilesWithin(2, 2, 1, 1, {}, layer);

        expect(result.length).toBe(1);
        expect(result[0]).toBe(layer.data[2][2]);
    });

    it('should return empty array when width is 0', function ()
    {
        var result = GetTilesWithin(0, 0, 0, 5, {}, layer);

        expect(result.length).toBe(0);
    });

    it('should return empty array when height is 0', function ()
    {
        var result = GetTilesWithin(0, 0, 5, 0, {}, layer);

        expect(result.length).toBe(0);
    });

    it('should handle a single-row layer', function ()
    {
        var singleRow = makeLayer(4, 1);
        var result = GetTilesWithin(0, 0, 4, 1, {}, singleRow);

        expect(result.length).toBe(4);
    });

    it('should handle a single-column layer', function ()
    {
        var singleCol = makeLayer(1, 4);
        var result = GetTilesWithin(0, 0, 1, 4, {}, singleCol);

        expect(result.length).toBe(4);
    });

    it('should handle a 1x1 layer', function ()
    {
        var tiny = makeLayer(1, 1);
        var result = GetTilesWithin(0, 0, 1, 1, {}, tiny);

        expect(result.length).toBe(1);
        expect(result[0]).toBe(tiny.data[0][0]);
    });
});
