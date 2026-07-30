var CheckIsoBounds = require('../../../src/tilemaps/components/CheckIsoBounds');

describe('Phaser.Tilemaps.Components.CheckIsoBounds', function ()
{
    var layer;
    var camera;
    var mockPos;

    beforeEach(function ()
    {
        mockPos = { x: 0, y: 0 };

        layer = {
            tileWidth: 32,
            tileHeight: 16,
            tilemapLayer: {
                cullPaddingX: 1,
                cullPaddingY: 1,
                scaleX: 1,
                scaleY: 1,
                tilemap: {
                    tileToWorldXY: function (tileX, tileY, point, cam, tilemapLayer)
                    {
                        return mockPos;
                    }
                }
            }
        };

        camera = {
            worldView: {
                x: 0,
                y: 0,
                right: 800,
                bottom: 600
            }
        };
    });

    it('should return true when tile position is fully inside camera bounds', function ()
    {
        mockPos.x = 400;
        mockPos.y = 300;

        expect(CheckIsoBounds(5, 5, layer, camera)).toBe(true);
    });

    it('should return false when tile x is to the left of the left bound', function ()
    {
        // left bound: worldView.x + scaleX * tileWidth * (-cullPaddingX - 0.5)
        // = 0 + 1 * 32 * (-1 - 0.5) = -48
        // pos.x must be > -48
        mockPos.x = -49;
        mockPos.y = 300;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should return true when tile x is exactly on the left bound (strict greater)', function ()
    {
        // left bound = -48; pos.x must be strictly > -48
        mockPos.x = -48;
        mockPos.y = 300;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should return true when tile x is just inside the left bound', function ()
    {
        mockPos.x = -47;
        mockPos.y = 300;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(true);
    });

    it('should return false when tile x is to the right of the right bound', function ()
    {
        // right bound: worldView.right + scaleX * tileWidth * (cullPaddingX - 0.5)
        // = 800 + 1 * 32 * (1 - 0.5) = 800 + 16 = 816
        // pos.x must be < 816
        mockPos.x = 817;
        mockPos.y = 300;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should return true when tile x is just inside the right bound', function ()
    {
        mockPos.x = 815;
        mockPos.y = 300;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(true);
    });

    it('should return false when tile y is above the top bound', function ()
    {
        // top bound: worldView.y + scaleY * tileHeight * (-cullPaddingY - 1.0)
        // = 0 + 1 * 16 * (-1 - 1.0) = -32
        // pos.y must be > -32
        mockPos.x = 400;
        mockPos.y = -33;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should return false when tile y is exactly on the top bound (strict greater)', function ()
    {
        mockPos.x = 400;
        mockPos.y = -32;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should return true when tile y is just inside the top bound', function ()
    {
        mockPos.x = 400;
        mockPos.y = -31;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(true);
    });

    it('should return false when tile y is below the bottom bound', function ()
    {
        // bottom bound: worldView.bottom + scaleY * tileHeight * (cullPaddingY - 0.5)
        // = 600 + 1 * 16 * (1 - 0.5) = 600 + 8 = 608
        // pos.y must be < 608
        mockPos.x = 400;
        mockPos.y = 609;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should return true when tile y is just inside the bottom bound', function ()
    {
        mockPos.x = 400;
        mockPos.y = 607;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(true);
    });

    it('should use cullPaddingX to expand left bound', function ()
    {
        layer.tilemapLayer.cullPaddingX = 2;

        // left bound: 0 + 1 * 32 * (-2 - 0.5) = -80
        // right bound: 800 + 1 * 32 * (2 - 0.5) = 848

        mockPos.x = -79;
        mockPos.y = 300;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(true);

        mockPos.x = -81;
        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should use cullPaddingX to expand right bound', function ()
    {
        layer.tilemapLayer.cullPaddingX = 2;

        // right bound: 800 + 1 * 32 * (2 - 0.5) = 848

        mockPos.x = 847;
        mockPos.y = 300;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(true);

        mockPos.x = 849;
        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should use cullPaddingY to expand top bound', function ()
    {
        layer.tilemapLayer.cullPaddingY = 2;

        // top bound: 0 + 1 * 16 * (-2 - 1.0) = -48

        mockPos.x = 400;
        mockPos.y = -47;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(true);

        mockPos.y = -49;
        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should use cullPaddingY to expand bottom bound', function ()
    {
        layer.tilemapLayer.cullPaddingY = 2;

        // bottom bound: 600 + 1 * 16 * (2 - 0.5) = 624

        mockPos.x = 400;
        mockPos.y = 623;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(true);

        mockPos.y = 625;
        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should account for scaleX when computing x bounds', function ()
    {
        layer.tilemapLayer.scaleX = 2;

        // left bound: 0 + 2 * 32 * (-1 - 0.5) = -96
        // right bound: 800 + 2 * 32 * (1 - 0.5) = 832

        mockPos.x = -95;
        mockPos.y = 300;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(true);

        mockPos.x = -97;
        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should account for scaleY when computing y bounds', function ()
    {
        layer.tilemapLayer.scaleY = 2;

        // top bound: 0 + 2 * 16 * (-1 - 1.0) = -64
        // bottom bound: 600 + 2 * 16 * (1 - 0.5) = 616

        mockPos.x = 400;
        mockPos.y = -63;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(true);

        mockPos.y = -65;
        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should pass tileX and tileY to tileToWorldXY', function ()
    {
        var capturedArgs = null;

        layer.tilemapLayer.tilemap.tileToWorldXY = function (tileX, tileY, point, cam, tilemapLayer)
        {
            capturedArgs = { tileX: tileX, tileY: tileY };
            return mockPos;
        };

        mockPos.x = 400;
        mockPos.y = 300;

        CheckIsoBounds(7, 12, layer, camera);

        expect(capturedArgs.tileX).toBe(7);
        expect(capturedArgs.tileY).toBe(12);
    });

    it('should pass camera to tileToWorldXY', function ()
    {
        var capturedCam = null;

        layer.tilemapLayer.tilemap.tileToWorldXY = function (tileX, tileY, point, cam, tilemapLayer)
        {
            capturedCam = cam;
            return mockPos;
        };

        mockPos.x = 400;
        mockPos.y = 300;

        CheckIsoBounds(0, 0, layer, camera);

        expect(capturedCam).toBe(camera);
    });

    it('should return false when tile is outside all four bounds simultaneously', function ()
    {
        mockPos.x = -1000;
        mockPos.y = -1000;

        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should handle zero cullPadding values', function ()
    {
        layer.tilemapLayer.cullPaddingX = 0;
        layer.tilemapLayer.cullPaddingY = 0;

        // left bound: 0 + 1 * 32 * (-0 - 0.5) = -16
        // right bound: 800 + 1 * 32 * (0 - 0.5) = 784
        // top bound: 0 + 1 * 16 * (-0 - 1.0) = -16
        // bottom bound: 600 + 1 * 16 * (0 - 0.5) = 592

        mockPos.x = 400;
        mockPos.y = 300;
        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(true);

        mockPos.x = -17;
        mockPos.y = 300;
        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);

        mockPos.x = 785;
        mockPos.y = 300;
        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });

    it('should handle non-zero worldView origin', function ()
    {
        camera.worldView.x = 200;
        camera.worldView.y = 100;
        camera.worldView.right = 1000;
        camera.worldView.bottom = 700;

        // left bound: 200 + 1 * 32 * (-1 - 0.5) = 200 - 48 = 152
        // top bound: 100 + 1 * 16 * (-1 - 1.0) = 100 - 32 = 68

        mockPos.x = 153;
        mockPos.y = 69;
        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(true);

        mockPos.x = 151;
        mockPos.y = 69;
        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);

        mockPos.x = 153;
        mockPos.y = 67;
        expect(CheckIsoBounds(0, 0, layer, camera)).toBe(false);
    });
});
