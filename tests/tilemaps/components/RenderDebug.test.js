var RenderDebug = require('../../../src/tilemaps/components/RenderDebug');

function createGraphics ()
{
    return {
        translateCanvas: vi.fn(),
        scaleCanvas: vi.fn(),
        fillStyle: vi.fn(),
        fillRect: vi.fn(),
        lineStyle: vi.fn(),
        lineBetween: vi.fn()
    };
}

function createTile (overrides)
{
    var tile = {
        index: 1,
        width: 32,
        height: 32,
        pixelX: 0,
        pixelY: 0,
        collides: false,
        hasInterestingFace: false,
        faceTop: false,
        faceRight: false,
        faceBottom: false,
        faceLeft: false,
        tileset: null
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            tile[key] = overrides[key];
        }
    }

    return tile;
}

function createLayer (tiles, overrides)
{
    // tiles is a flat array; we build a 1xN or NxM grid
    // For simplicity, create a 1-row layer with all tiles in row 0
    var width = tiles.length;
    var height = 1;

    var data = [ tiles.slice() ];

    var layer = {
        width: width,
        height: height,
        data: data,
        tilemapLayer: {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        }
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            layer[key] = overrides[key];
        }
    }

    return layer;
}

function createEmptyLayer (overrides)
{
    var layer = {
        width: 0,
        height: 0,
        data: [],
        tilemapLayer: {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1
        }
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            layer[key] = overrides[key];
        }
    }

    return layer;
}

describe('Phaser.Tilemaps.Components.RenderDebug', function ()
{
    var graphics;

    beforeEach(function ()
    {
        graphics = createGraphics();
    });

    afterEach(function ()
    {
        vi.clearAllMocks();
    });

    it('should be importable', function ()
    {
        expect(RenderDebug).toBeDefined();
        expect(typeof RenderDebug).toBe('function');
    });

    it('should not throw when there are no tiles', function ()
    {
        var layer = createEmptyLayer();

        expect(function ()
        {
            RenderDebug(graphics, {}, layer);
        }).not.toThrow();
    });

    it('should not call fillRect or lineBetween when there are no tiles', function ()
    {
        var layer = createEmptyLayer();

        RenderDebug(graphics, {}, layer);

        expect(graphics.fillRect).not.toHaveBeenCalled();
        expect(graphics.lineBetween).not.toHaveBeenCalled();
    });

    it('should call translateCanvas with the tilemapLayer position', function ()
    {
        var layer = createEmptyLayer();
        layer.tilemapLayer.x = 100;
        layer.tilemapLayer.y = 200;

        RenderDebug(graphics, {}, layer);

        expect(graphics.translateCanvas).toHaveBeenCalledWith(100, 200);
    });

    it('should call scaleCanvas with the tilemapLayer scale', function ()
    {
        var layer = createEmptyLayer();
        layer.tilemapLayer.scaleX = 2.5;
        layer.tilemapLayer.scaleY = 0.5;

        RenderDebug(graphics, {}, layer);

        expect(graphics.scaleCanvas).toHaveBeenCalledWith(2.5, 0.5);
    });

    it('should handle undefined styleConfig without throwing', function ()
    {
        var layer = createEmptyLayer();

        expect(function ()
        {
            RenderDebug(graphics, undefined, layer);
        }).not.toThrow();

        expect(graphics.translateCanvas).toHaveBeenCalled();
    });

    it('should call fillStyle and fillRect for a non-colliding tile using tileColor', function ()
    {
        var customColor = { color: 0xaabbcc, alpha: 200 };
        var tile = createTile({ pixelX: 64, pixelY: 96, width: 32, height: 32, collides: false });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { tileColor: customColor }, layer);

        expect(graphics.fillStyle).toHaveBeenCalledWith(customColor.color, customColor.alpha / 255);
        expect(graphics.fillRect).toHaveBeenCalledWith(64, 96, 32, 32);
    });

    it('should call fillStyle and fillRect for a colliding tile using collidingTileColor', function ()
    {
        var customColor = { color: 0xff0000, alpha: 128 };
        var tile = createTile({ collides: true });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { collidingTileColor: customColor }, layer);

        expect(graphics.fillStyle).toHaveBeenCalledWith(customColor.color, customColor.alpha / 255);
    });

    it('should skip fillRect when tileColor is null for a non-colliding tile', function ()
    {
        var tile = createTile({ collides: false });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { tileColor: null }, layer);

        expect(graphics.fillRect).not.toHaveBeenCalled();
    });

    it('should skip fillRect when collidingTileColor is null for a colliding tile', function ()
    {
        var tile = createTile({ collides: true });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { collidingTileColor: null }, layer);

        expect(graphics.fillRect).not.toHaveBeenCalled();
    });

    it('should draw faceTop line inset by 1 pixel', function ()
    {
        var faceColor = { color: 0x112233, alpha: 180 };
        var tile = createTile({ pixelX: 64, pixelY: 96, width: 32, height: 32, faceTop: true, collides: false });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { faceColor: faceColor, tileColor: null }, layer);

        // x = pixelX + 1, y = pixelY + 1, tw = width - 2
        var x = 65;
        var y = 97;
        var tw = 30;

        expect(graphics.lineBetween).toHaveBeenCalledWith(x, y, x + tw, y);
    });

    it('should draw faceRight line inset by 1 pixel', function ()
    {
        var faceColor = { color: 0x112233, alpha: 180 };
        var tile = createTile({ pixelX: 64, pixelY: 96, width: 32, height: 32, faceRight: true, collides: false });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { faceColor: faceColor, tileColor: null }, layer);

        var x = 65;
        var y = 97;
        var tw = 30;
        var th = 30;

        expect(graphics.lineBetween).toHaveBeenCalledWith(x + tw, y, x + tw, y + th);
    });

    it('should draw faceBottom line inset by 1 pixel', function ()
    {
        var faceColor = { color: 0x112233, alpha: 180 };
        var tile = createTile({ pixelX: 64, pixelY: 96, width: 32, height: 32, faceBottom: true, collides: false });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { faceColor: faceColor, tileColor: null }, layer);

        var x = 65;
        var y = 97;
        var tw = 30;
        var th = 30;

        expect(graphics.lineBetween).toHaveBeenCalledWith(x, y + th, x + tw, y + th);
    });

    it('should draw faceLeft line inset by 1 pixel', function ()
    {
        var faceColor = { color: 0x112233, alpha: 180 };
        var tile = createTile({ pixelX: 64, pixelY: 96, width: 32, height: 32, faceLeft: true, collides: false });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { faceColor: faceColor, tileColor: null }, layer);

        var x = 65;
        var y = 97;
        var th = 30;

        expect(graphics.lineBetween).toHaveBeenCalledWith(x, y, x, y + th);
    });

    it('should draw all four face lines when all faces are set', function ()
    {
        var faceColor = { color: 0x112233, alpha: 180 };
        var tile = createTile({
            faceTop: true,
            faceRight: true,
            faceBottom: true,
            faceLeft: true
        });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { faceColor: faceColor, tileColor: null }, layer);

        expect(graphics.lineBetween).toHaveBeenCalledTimes(4);
    });

    it('should not draw any face lines when no faces are set', function ()
    {
        var faceColor = { color: 0x112233, alpha: 180 };
        var tile = createTile({
            faceTop: false,
            faceRight: false,
            faceBottom: false,
            faceLeft: false
        });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { faceColor: faceColor, tileColor: null }, layer);

        expect(graphics.lineBetween).not.toHaveBeenCalled();
    });

    it('should skip all face lines when faceColor is null', function ()
    {
        var tile = createTile({
            faceTop: true,
            faceRight: true,
            faceBottom: true,
            faceLeft: true
        });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { faceColor: null }, layer);

        expect(graphics.lineStyle).not.toHaveBeenCalled();
        expect(graphics.lineBetween).not.toHaveBeenCalled();
    });

    it('should call lineStyle with faceColor when a tile has a face', function ()
    {
        var faceColor = { color: 0x334455, alpha: 180 };
        var tile = createTile({ faceTop: true });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { faceColor: faceColor }, layer);

        expect(graphics.lineStyle).toHaveBeenCalledWith(1, faceColor.color, faceColor.alpha / 255);
    });

    it('should apply tileset tileOffset to tile draw position', function ()
    {
        var customColor = { color: 0xaabbcc, alpha: 200 };
        var tile = createTile({
            pixelX: 64,
            pixelY: 96,
            width: 32,
            height: 32,
            tileset: { tileOffset: { x: 4, y: 8 } }
        });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { tileColor: customColor }, layer);

        // x = pixelX - offset.x = 60, y = pixelY - offset.y = 88
        expect(graphics.fillRect).toHaveBeenCalledWith(60, 88, 32, 32);
    });

    it('should use zero offset when tileset is null', function ()
    {
        var customColor = { color: 0xaabbcc, alpha: 200 };
        var tile = createTile({
            pixelX: 64,
            pixelY: 96,
            width: 32,
            height: 32,
            tileset: null
        });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { tileColor: customColor }, layer);

        expect(graphics.fillRect).toHaveBeenCalledWith(64, 96, 32, 32);
    });

    it('should process multiple tiles independently', function ()
    {
        var customColor = { color: 0xaabbcc, alpha: 200 };
        var tile1 = createTile({ pixelX: 0 });
        var tile2 = createTile({ pixelX: 32 });
        var tile3 = createTile({ pixelX: 64 });
        var layer = createLayer([ tile1, tile2, tile3 ]);

        RenderDebug(graphics, { tileColor: customColor }, layer);

        expect(graphics.fillRect).toHaveBeenCalledTimes(3);
    });

    it('should use default tile color objects when styleConfig is empty', function ()
    {
        var tile = createTile();
        var layer = createLayer([ tile ]);

        // Should not throw — default Color objects have .color and .alpha properties
        expect(function ()
        {
            RenderDebug(graphics, {}, layer);
        }).not.toThrow();

        expect(graphics.fillStyle).toHaveBeenCalled();
        expect(graphics.fillRect).toHaveBeenCalled();
    });

    it('should use default faceColor when not specified in styleConfig', function ()
    {
        var tile = createTile({ faceTop: true });
        var layer = createLayer([ tile ]);

        expect(function ()
        {
            RenderDebug(graphics, {}, layer);
        }).not.toThrow();

        expect(graphics.lineStyle).toHaveBeenCalled();
        expect(graphics.lineBetween).toHaveBeenCalled();
    });

    it('should normalise alpha of 255 to 1 in fillStyle', function ()
    {
        var customColor = { color: 0xff0000, alpha: 255 };
        var tile = createTile({ collides: false });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { tileColor: customColor }, layer);

        expect(graphics.fillStyle).toHaveBeenCalledWith(0xff0000, 1);
    });

    it('should normalise alpha of 0 to 0 in fillStyle', function ()
    {
        var customColor = { color: 0xff0000, alpha: 0 };
        var tile = createTile({ collides: false });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { tileColor: customColor }, layer);

        expect(graphics.fillStyle).toHaveBeenCalledWith(0xff0000, 0);
    });

    it('should normalise alpha of 128 to approximately 0.502 in fillStyle', function ()
    {
        var customColor = { color: 0x00ff00, alpha: 128 };
        var tile = createTile({ collides: false });
        var layer = createLayer([ tile ]);

        RenderDebug(graphics, { tileColor: customColor }, layer);

        var callArgs = graphics.fillStyle.mock.calls[0];
        expect(callArgs[0]).toBe(0x00ff00);
        expect(callArgs[1]).toBeCloseTo(128 / 255);
    });

    it('should skip null tiles returned from the layer data', function ()
    {
        // Create a layer where one tile slot is null
        var tile = createTile({ pixelX: 32 });
        var data = [ [ null, tile ] ];
        var layer = {
            width: 2,
            height: 1,
            data: data,
            tilemapLayer: { x: 0, y: 0, scaleX: 1, scaleY: 1 }
        };

        var customColor = { color: 0xffffff, alpha: 255 };

        RenderDebug(graphics, { tileColor: customColor }, layer);

        // Only the non-null tile should be drawn
        expect(graphics.fillRect).toHaveBeenCalledTimes(1);
        expect(graphics.fillRect).toHaveBeenCalledWith(32, 0, 32, 32);
    });

    it('should use tileColor for non-colliding and collidingTileColor for colliding in same layer', function ()
    {
        var tileColor = { color: 0x0000ff, alpha: 150 };
        var collidingTileColor = { color: 0xff0000, alpha: 200 };
        var normalTile = createTile({ pixelX: 0, collides: false });
        var collidingTile = createTile({ pixelX: 32, collides: true });
        var layer = createLayer([ normalTile, collidingTile ]);

        RenderDebug(graphics, { tileColor: tileColor, collidingTileColor: collidingTileColor }, layer);

        expect(graphics.fillStyle).toHaveBeenCalledWith(0x0000ff, 150 / 255);
        expect(graphics.fillStyle).toHaveBeenCalledWith(0xff0000, 200 / 255);
    });
});
