var CreateFromTiles = require('../../../src/tilemaps/components/CreateFromTiles');

describe('Phaser.Tilemaps.Components.CreateFromTiles', function ()
{
    function makeTile (index, x, y)
    {
        return {
            index: index,
            x: x,
            y: y,
            width: 32,
            height: 32,
            rotation: 0,
            flipX: false,
            flipY: false,
            alpha: 1,
            visible: true,
            tint: 0xffffff
        };
    }

    function makeLayer (tileGrid)
    {
        // tileGrid is a 2D array [y][x] of tile objects (or null)
        var height = tileGrid.length;
        var width = height > 0 ? tileGrid[0].length : 0;

        var scene = {
            cameras: {
                main: {}
            },
            make: {
                sprite: vi.fn(function (config)
                {
                    return { type: 'Sprite', config: config };
                })
            }
        };

        var layer = {
            width: width,
            height: height,
            data: tileGrid,
            tilemapLayer: {
                scene: scene,
                tileToWorldXY: vi.fn(function (tx, ty)
                {
                    return { x: tx * 32, y: ty * 32 };
                })
            }
        };

        return { layer: layer, scene: scene };
    }

    function makeGrid (width, height, defaultIndex)
    {
        var grid = [];

        for (var y = 0; y < height; y++)
        {
            grid[y] = [];

            for (var x = 0; x < width; x++)
            {
                grid[y][x] = makeTile(defaultIndex !== undefined ? defaultIndex : -1, x, y);
            }
        }

        return grid;
    }

    beforeEach(function ()
    {
        vi.clearAllMocks();
    });

    it('should return an empty array when no tiles match the given index', function ()
    {
        var grid = makeGrid(3, 3, 5);
        var setup = makeLayer(grid);
        var result = CreateFromTiles(1, null, {}, setup.scene, {}, setup.layer);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when the layer has no tiles', function ()
    {
        var setup = makeLayer([[]]);
        var result = CreateFromTiles(1, null, {}, setup.scene, {}, setup.layer);

        expect(result).toBeInstanceOf(Array);
        expect(result.length).toBe(0);
    });

    it('should create a sprite for each tile matching the given index', function ()
    {
        var grid = makeGrid(3, 1, -1);
        grid[0][0] = makeTile(1, 0, 0);
        grid[0][2] = makeTile(1, 2, 0);

        var setup = makeLayer(grid);
        var result = CreateFromTiles(1, null, {}, setup.scene, {}, setup.layer);

        expect(result.length).toBe(2);
        expect(setup.scene.make.sprite).toHaveBeenCalledTimes(2);
    });

    it('should create sprites for all tiles when an array of indexes is provided', function ()
    {
        var grid = makeGrid(4, 1, -1);
        grid[0][0] = makeTile(1, 0, 0);
        grid[0][1] = makeTile(2, 1, 0);
        grid[0][2] = makeTile(3, 2, 0);
        grid[0][3] = makeTile(4, 3, 0);

        var setup = makeLayer(grid);
        var result = CreateFromTiles([ 1, 3 ], null, {}, setup.scene, {}, setup.layer);

        expect(result.length).toBe(2);
    });

    it('should set sprite x/y from tileToWorldXY offset by half the tile size', function ()
    {
        var grid = makeGrid(1, 1, -1);
        grid[0][0] = makeTile(1, 0, 0);

        var setup = makeLayer(grid);
        setup.layer.tilemapLayer.tileToWorldXY = vi.fn(function ()
        {
            return { x: 64, y: 96 };
        });

        var result = CreateFromTiles(1, null, {}, setup.scene, {}, setup.layer);
        var cfg = result[0].config;

        // x = 64 + (32 * 0.5) = 80, y = 96 + (32 * 0.5) = 112
        expect(cfg.x).toBe(80);
        expect(cfg.y).toBe(112);
    });

    it('should not add half-tile offset when origin is specified in spriteConfig', function ()
    {
        var grid = makeGrid(1, 1, -1);
        grid[0][0] = makeTile(1, 0, 0);

        var setup = makeLayer(grid);
        setup.layer.tilemapLayer.tileToWorldXY = vi.fn(function ()
        {
            return { x: 64, y: 96 };
        });

        var result = CreateFromTiles(1, null, { origin: 0 }, setup.scene, {}, setup.layer);
        var cfg = result[0].config;

        expect(cfg.x).toBe(64);
        expect(cfg.y).toBe(96);
    });

    it('should copy tile rotation into sprite config when not already set', function ()
    {
        var grid = makeGrid(1, 1, -1);
        var tile = makeTile(1, 0, 0);
        tile.rotation = 1.57;
        grid[0][0] = tile;

        var setup = makeLayer(grid);
        var result = CreateFromTiles(1, null, {}, setup.scene, {}, setup.layer);

        expect(result[0].config.rotation).toBeCloseTo(1.57);
    });

    it('should copy tile flipX, flipY, alpha, visible and tint into sprite config', function ()
    {
        var grid = makeGrid(1, 1, -1);
        var tile = makeTile(1, 0, 0);
        tile.flipX = true;
        tile.flipY = true;
        tile.alpha = 0.5;
        tile.visible = false;
        tile.tint = 0xff0000;
        grid[0][0] = tile;

        var setup = makeLayer(grid);
        var result = CreateFromTiles(1, null, {}, setup.scene, {}, setup.layer);
        var cfg = result[0].config;

        expect(cfg.flipX).toBe(true);
        expect(cfg.flipY).toBe(true);
        expect(cfg.alpha).toBe(0.5);
        expect(cfg.visible).toBe(false);
        expect(cfg.tint).toBe(0xff0000);
    });

    it('should not overwrite spriteConfig properties already set with tile properties', function ()
    {
        var grid = makeGrid(1, 1, -1);
        var tile = makeTile(1, 0, 0);
        tile.alpha = 0.25;
        grid[0][0] = tile;

        var setup = makeLayer(grid);
        var result = CreateFromTiles(1, null, { alpha: 0.9 }, setup.scene, {}, setup.layer);

        expect(result[0].config.alpha).toBe(0.9);
    });

    it('should set key and frame from tileset when useSpriteSheet is in spriteConfig', function ()
    {
        var grid = makeGrid(1, 1, -1);
        var tile = makeTile(5, 0, 0);
        tile.tileset = { image: 'tiles_texture', firstgid: 1 };
        grid[0][0] = tile;

        var setup = makeLayer(grid);
        var result = CreateFromTiles(5, null, { useSpriteSheet: true }, setup.scene, {}, setup.layer);
        var cfg = result[0].config;

        expect(cfg.key).toBe('tiles_texture');
        expect(cfg.frame).toBe(4); // index(5) - firstgid(1) = 4
    });

    it('should not mutate the original spriteConfig object across multiple sprites', function ()
    {
        var grid = makeGrid(2, 1, -1);
        var tile1 = makeTile(1, 0, 0);
        tile1.rotation = 0.5;
        var tile2 = makeTile(1, 1, 0);
        tile2.rotation = 1.0;
        grid[0][0] = tile1;
        grid[0][1] = tile2;

        var originalConfig = { someKey: 'someValue' };
        var setup = makeLayer(grid);

        CreateFromTiles(1, null, originalConfig, setup.scene, {}, setup.layer);

        expect(originalConfig).toEqual({ someKey: 'someValue' });
    });

    it('should convert a single index number to an array and match tiles', function ()
    {
        var grid = makeGrid(3, 1, -1);
        grid[0][0] = makeTile(42, 0, 0);
        grid[0][1] = makeTile(42, 1, 0);
        grid[0][2] = makeTile(99, 2, 0);

        var setup = makeLayer(grid);
        var result = CreateFromTiles(42, null, {}, setup.scene, {}, setup.layer);

        expect(result.length).toBe(2);
    });

    it('should replace tile indexes with a single replacement value', function ()
    {
        var grid = makeGrid(3, 1, -1);
        grid[0][0] = makeTile(1, 0, 0);
        grid[0][1] = makeTile(2, 1, 0);
        grid[0][2] = makeTile(1, 2, 0);

        var setup = makeLayer(grid);
        CreateFromTiles(1, 0, {}, setup.scene, {}, setup.layer);

        expect(setup.layer.data[0][0].index).toBe(0);
        expect(setup.layer.data[0][2].index).toBe(0);
        expect(setup.layer.data[0][1].index).toBe(2); // unchanged
    });

    it('should replace each index with its matching replacement when arrays are provided', function ()
    {
        var grid = makeGrid(3, 1, -1);
        grid[0][0] = makeTile(1, 0, 0);
        grid[0][1] = makeTile(2, 1, 0);
        grid[0][2] = makeTile(3, 2, 0);

        var setup = makeLayer(grid);
        CreateFromTiles([ 1, 2, 3 ], [ 10, 20, 30 ], {}, setup.scene, {}, setup.layer);

        expect(setup.layer.data[0][0].index).toBe(10);
        expect(setup.layer.data[0][1].index).toBe(20);
        expect(setup.layer.data[0][2].index).toBe(30);
    });

    it('should not replace any tile indexes when replacements is null', function ()
    {
        var grid = makeGrid(2, 1, -1);
        grid[0][0] = makeTile(1, 0, 0);
        grid[0][1] = makeTile(1, 1, 0);

        var setup = makeLayer(grid);
        CreateFromTiles(1, null, {}, setup.scene, {}, setup.layer);

        expect(setup.layer.data[0][0].index).toBe(1);
        expect(setup.layer.data[0][1].index).toBe(1);
    });

    it('should default to an empty object when spriteConfig is falsy', function ()
    {
        var grid = makeGrid(1, 1, 1);
        var setup = makeLayer(grid);

        expect(function ()
        {
            CreateFromTiles(1, null, null, setup.scene, {}, setup.layer);
        }).not.toThrow();
    });

    it('should use scene from layer.tilemapLayer when no scene is provided', function ()
    {
        var grid = makeGrid(1, 1, 1);
        var setup = makeLayer(grid);
        var layerScene = setup.layer.tilemapLayer.scene;

        var result = CreateFromTiles(1, null, {}, null, layerScene.cameras.main, setup.layer);

        expect(layerScene.make.sprite).toHaveBeenCalled();
        expect(result.length).toBe(1);
    });

    it('should use camera from scene.cameras.main when no camera is provided', function ()
    {
        var grid = makeGrid(1, 1, 1);
        var setup = makeLayer(grid);

        expect(function ()
        {
            CreateFromTiles(1, null, {}, setup.scene, null, setup.layer);
        }).not.toThrow();

        expect(setup.layer.tilemapLayer.tileToWorldXY).toHaveBeenCalledWith(
            0, 0, undefined, setup.scene.cameras.main, setup.layer
        );
    });

    it('should pass the camera to tileToWorldXY for each matching tile', function ()
    {
        var grid = makeGrid(1, 1, 7);
        var setup = makeLayer(grid);
        var camera = { id: 'custom-camera' };

        CreateFromTiles(7, null, {}, setup.scene, camera, setup.layer);

        expect(setup.layer.tilemapLayer.tileToWorldXY).toHaveBeenCalledWith(0, 0, undefined, camera, setup.layer);
    });

    it('should return sprites corresponding to each matched tile across rows', function ()
    {
        var grid = makeGrid(3, 3, -1);
        grid[0][1] = makeTile(5, 1, 0);
        grid[1][0] = makeTile(5, 0, 1);
        grid[2][2] = makeTile(5, 2, 2);

        var setup = makeLayer(grid);
        var result = CreateFromTiles(5, null, {}, setup.scene, {}, setup.layer);

        expect(result.length).toBe(3);
    });

    it('should skip null tiles in the layer data', function ()
    {
        var grid = makeGrid(3, 1, -1);
        grid[0][0] = makeTile(1, 0, 0);
        grid[0][1] = null;
        grid[0][2] = makeTile(1, 2, 0);

        var setup = makeLayer(grid);
        var result = CreateFromTiles(1, null, {}, setup.scene, {}, setup.layer);

        expect(result.length).toBe(2);
    });

    it('should apply a single replacement to each index in the indexes array', function ()
    {
        var grid = makeGrid(2, 1, -1);
        grid[0][0] = makeTile(1, 0, 0);
        grid[0][1] = makeTile(2, 1, 0);

        var setup = makeLayer(grid);
        CreateFromTiles([ 1, 2 ], 0, {}, setup.scene, {}, setup.layer);

        expect(setup.layer.data[0][0].index).toBe(0);
        expect(setup.layer.data[0][1].index).toBe(0);
    });
});
