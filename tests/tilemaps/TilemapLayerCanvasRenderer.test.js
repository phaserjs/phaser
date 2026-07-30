var TilemapLayerCanvasRenderer = require('../../src/tilemaps/TilemapLayerCanvasRenderer');
var TransformMatrix = require('../../src/gameobjects/components/TransformMatrix');

describe('TilemapLayerCanvasRenderer', function ()
{
    var renderer;
    var src;
    var camera;
    var ctx;

    function makeMockCtx ()
    {
        return {
            save: vi.fn(),
            restore: vi.fn(),
            translate: vi.fn(),
            rotate: vi.fn(),
            scale: vi.fn(),
            drawImage: vi.fn(),
            setTransform: vi.fn(),
            globalAlpha: 1,
            imageSmoothingEnabled: true
        };
    }

    function makeMockCameraMatrix ()
    {
        return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0, tx: 0, ty: 0 };
    }

    function makeMockTile (overrides)
    {
        var tile = {
            index: 1,
            pixelX: 0,
            pixelY: 0,
            rotation: 0,
            flipX: false,
            flipY: false,
            alpha: 1
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

    function makeMockTileset (overrides)
    {
        var tileset = {
            image: {
                getSourceImage: vi.fn().mockReturnValue({})
            },
            getTileTextureCoordinates: vi.fn().mockReturnValue({ x: 0, y: 0 }),
            tileWidth: 32,
            tileHeight: 32,
            tileOffset: { x: 0, y: 0 }
        };
        if (overrides)
        {
            for (var key in overrides)
            {
                tileset[key] = overrides[key];
            }
        }
        return tileset;
    }

    function makeMockSrc (tiles, gidMap, overrides)
    {
        var src = {
            x: 0,
            y: 0,
            rotation: 0,
            scaleX: 1,
            scaleY: 1,
            alpha: 1,
            scrollFactorX: 1,
            scrollFactorY: 1,
            gidMap: gidMap || {},
            cull: vi.fn().mockReturnValue(tiles || [])
        };
        if (overrides)
        {
            for (var key in overrides)
            {
                src[key] = overrides[key];
            }
        }
        return src;
    }

    function makeMockCamera (overrides)
    {
        var cam = {
            alpha: 1,
            scrollX: 0,
            scrollY: 0,
            matrixCombined: makeMockCameraMatrix()
        };
        if (overrides)
        {
            for (var key in overrides)
            {
                cam[key] = overrides[key];
            }
        }
        return cam;
    }

    function makeMockRenderer (overrides)
    {
        var r = {
            currentContext: makeMockCtx(),
            antialias: true
        };
        if (overrides)
        {
            for (var key in overrides)
            {
                r[key] = overrides[key];
            }
        }
        return r;
    }

    beforeEach(function ()
    {
        ctx = makeMockCtx();
        renderer = { currentContext: ctx, antialias: true };
        camera = makeMockCamera();
        src = makeMockSrc([], {});
    });

    describe('early return conditions', function ()
    {
        it('should return without rendering when there are no tiles to render', function ()
        {
            src = makeMockSrc([], {});
            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.save).not.toHaveBeenCalled();
        });

        it('should return without rendering when camera alpha is zero', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset });
            camera = makeMockCamera({ alpha: 0 });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.save).not.toHaveBeenCalled();
        });

        it('should return without rendering when src alpha is zero', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset }, { alpha: 0 });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.save).not.toHaveBeenCalled();
        });

        it('should return without rendering when combined alpha is negative', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset }, { alpha: -1 });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.save).not.toHaveBeenCalled();
        });

        it('should return without rendering when camera alpha is negative', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset });
            camera = makeMockCamera({ alpha: -0.5 });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.save).not.toHaveBeenCalled();
        });
    });

    describe('context save and restore', function ()
    {
        it('should call ctx.save and ctx.restore when rendering tiles', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.save).toHaveBeenCalled();
            expect(ctx.restore).toHaveBeenCalled();
        });

        it('should call ctx.save and ctx.restore once per tile plus once for the layer', function ()
        {
            var tile1 = makeMockTile({ index: 1 });
            var tile2 = makeMockTile({ index: 2 });
            var tileset1 = makeMockTileset();
            var tileset2 = makeMockTileset();
            src = makeMockSrc([ tile1, tile2 ], { 1: tileset1, 2: tileset2 });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            // one outer save/restore + one per tile
            expect(ctx.save).toHaveBeenCalledTimes(3);
            expect(ctx.restore).toHaveBeenCalledTimes(3);
        });
    });

    describe('tile skipping', function ()
    {
        it('should skip tiles that have no entry in gidMap', function ()
        {
            var tile = makeMockTile({ index: 999 });
            src = makeMockSrc([ tile ], {});

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            // outer save/restore still called, but no per-tile draw
            expect(ctx.save).toHaveBeenCalledTimes(1);
            expect(ctx.drawImage).not.toHaveBeenCalled();
        });

        it('should skip tiles whose tileTexCoords is null', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset();
            tileset.getTileTextureCoordinates = vi.fn().mockReturnValue(null);
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.drawImage).not.toHaveBeenCalled();
        });

        it('should skip tiles whose tileWidth is zero', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset({ tileWidth: 0 });
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.drawImage).not.toHaveBeenCalled();
        });

        it('should skip tiles whose tileHeight is zero', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset({ tileHeight: 0 });
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.drawImage).not.toHaveBeenCalled();
        });

        it('should still render valid tiles when some tiles are invalid', function ()
        {
            var badTile = makeMockTile({ index: 999 });
            var goodTile = makeMockTile({ index: 1 });
            var tileset = makeMockTileset();
            src = makeMockSrc([ badTile, goodTile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.drawImage).toHaveBeenCalledTimes(1);
        });
    });

    describe('tile translation', function ()
    {
        it('should call ctx.translate with tile pixelX + halfWidth and pixelY + halfHeight', function ()
        {
            var tile = makeMockTile({ pixelX: 64, pixelY: 128 });
            var tileset = makeMockTileset({ tileWidth: 32, tileHeight: 32 });
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.translate).toHaveBeenCalledWith(64 + 16, 128 + 16);
        });

        it('should compute halfWidth and halfHeight correctly for non-square tiles', function ()
        {
            var tile = makeMockTile({ pixelX: 0, pixelY: 0 });
            var tileset = makeMockTileset({ tileWidth: 64, tileHeight: 48 });
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.translate).toHaveBeenCalledWith(32, 24);
        });
    });

    describe('tile rotation', function ()
    {
        it('should not call ctx.rotate when tile rotation is zero', function ()
        {
            var tile = makeMockTile({ rotation: 0 });
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.rotate).not.toHaveBeenCalled();
        });

        it('should call ctx.rotate with tile rotation when non-zero', function ()
        {
            var tile = makeMockTile({ rotation: Math.PI / 2 });
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.rotate).toHaveBeenCalledWith(Math.PI / 2);
        });

        it('should call ctx.rotate with negative rotation', function ()
        {
            var tile = makeMockTile({ rotation: -Math.PI });
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.rotate).toHaveBeenCalledWith(-Math.PI);
        });
    });

    describe('tile flipping', function ()
    {
        it('should not call ctx.scale when tile is not flipped', function ()
        {
            var tile = makeMockTile({ flipX: false, flipY: false });
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.scale).not.toHaveBeenCalled();
        });

        it('should call ctx.scale with -1, 1 when flipX is true', function ()
        {
            var tile = makeMockTile({ flipX: true, flipY: false });
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.scale).toHaveBeenCalledWith(-1, 1);
        });

        it('should call ctx.scale with 1, -1 when flipY is true', function ()
        {
            var tile = makeMockTile({ flipX: false, flipY: true });
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.scale).toHaveBeenCalledWith(1, -1);
        });

        it('should call ctx.scale with -1, -1 when both flipX and flipY are true', function ()
        {
            var tile = makeMockTile({ flipX: true, flipY: true });
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.scale).toHaveBeenCalledWith(-1, -1);
        });
    });

    describe('alpha blending', function ()
    {
        it('should set ctx.globalAlpha to camera alpha times src alpha times tile alpha', function ()
        {
            var tile = makeMockTile({ alpha: 0.5 });
            var tileset = makeMockTileset();
            camera = makeMockCamera({ alpha: 0.8 });
            src = makeMockSrc([ tile ], { 1: tileset }, { alpha: 0.5 });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.globalAlpha).toBeCloseTo(0.8 * 0.5 * 0.5);
        });

        it('should set ctx.globalAlpha to 1 when all alphas are 1', function ()
        {
            var tile = makeMockTile({ alpha: 1 });
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset }, { alpha: 1 });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.globalAlpha).toBeCloseTo(1);
        });
    });

    describe('image smoothing', function ()
    {
        it('should not set imageSmoothingEnabled to false when antialias is true and scale is 1', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset }, { scaleX: 1, scaleY: 1 });
            renderer = makeMockRenderer({ antialias: true });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(renderer.currentContext.imageSmoothingEnabled).toBe(true);
        });

        it('should set imageSmoothingEnabled to false when antialias is false', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset }, { scaleX: 1, scaleY: 1 });
            renderer = makeMockRenderer({ antialias: false });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(renderer.currentContext.imageSmoothingEnabled).toBe(false);
        });

        it('should set imageSmoothingEnabled to false when scaleX is greater than 1', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset }, { scaleX: 2, scaleY: 1 });
            renderer = makeMockRenderer({ antialias: true });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(renderer.currentContext.imageSmoothingEnabled).toBe(false);
        });

        it('should set imageSmoothingEnabled to false when scaleY is greater than 1', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset }, { scaleX: 1, scaleY: 2 });
            renderer = makeMockRenderer({ antialias: true });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(renderer.currentContext.imageSmoothingEnabled).toBe(false);
        });
    });

    describe('drawImage call', function ()
    {
        it('should call ctx.drawImage with correct arguments', function ()
        {
            var mockImage = { id: 'testImage' };
            var tile = makeMockTile({ index: 1, pixelX: 0, pixelY: 0 });
            var tileset = makeMockTileset({
                tileWidth: 32,
                tileHeight: 32,
                tileOffset: { x: 0, y: 0 }
            });
            tileset.image = { getSourceImage: vi.fn().mockReturnValue(mockImage) };
            tileset.getTileTextureCoordinates = vi.fn().mockReturnValue({ x: 10, y: 20 });
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.drawImage).toHaveBeenCalledWith(
                mockImage,
                10, 20,
                32, 32,
                -16, -16,
                32, 32
            );
        });

        it('should apply tileOffset to texture coordinates', function ()
        {
            var mockImage = {};
            var tile = makeMockTile({ index: 1 });
            var tileset = makeMockTileset({
                tileWidth: 32,
                tileHeight: 32,
                tileOffset: { x: 5, y: 10 }
            });
            tileset.image = { getSourceImage: vi.fn().mockReturnValue(mockImage) };
            tileset.getTileTextureCoordinates = vi.fn().mockReturnValue({ x: 0, y: 0 });
            src = makeMockSrc([ tile ], { 1: tileset });

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.drawImage).toHaveBeenCalledWith(
                mockImage,
                5, 10,
                32, 32,
                -16, -16,
                32, 32
            );
        });

        it('should not call ctx.drawImage when there are no renderable tiles', function ()
        {
            src = makeMockSrc([], {});

            TilemapLayerCanvasRenderer(renderer, src, camera, null);

            expect(ctx.drawImage).not.toHaveBeenCalled();
        });
    });

    describe('parentMatrix handling', function ()
    {
        it('should render correctly without a parentMatrix', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset });

            expect(function ()
            {
                TilemapLayerCanvasRenderer(renderer, src, camera, null);
            }).not.toThrow();

            expect(ctx.drawImage).toHaveBeenCalledTimes(1);
        });

        it('should render correctly with a parentMatrix provided', function ()
        {
            var tile = makeMockTile();
            var tileset = makeMockTileset();
            src = makeMockSrc([ tile ], { 1: tileset });

            var parentMatrix = new TransformMatrix();

            expect(function ()
            {
                TilemapLayerCanvasRenderer(renderer, src, camera, parentMatrix);
            }).not.toThrow();

            expect(ctx.drawImage).toHaveBeenCalledTimes(1);
        });
    });

    describe('module export', function ()
    {
        it('should export a function', function ()
        {
            expect(typeof TilemapLayerCanvasRenderer).toBe('function');
        });
    });
});
