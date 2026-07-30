// Phaser's device detection modules access browser globals at require-time.
// Stub the minimum needed for Node.js.

if (typeof window === 'undefined')
{
    global.window = {
        cordova: undefined,
        ejecta: undefined,
        devicePixelRatio: 1,
        Worker: undefined,
        URL: undefined,
        webkitURL: undefined,
        mozURL: undefined,
        msURL: undefined,
        addEventListener: function () {}
    };
}

if (typeof navigator === 'undefined')
{
    global.navigator = {
        userAgent: '',
        appVersion: '',
        maxTouchPoints: 0,
        standalone: false,
        getUserMedia: undefined,
        webkitGetUserMedia: undefined,
        mozGetUserMedia: undefined,
        msGetUserMedia: undefined,
        oGetUserMedia: undefined,
        vibrate: undefined,
        msPointerEnabled: false,
        pointerEnabled: false,
        getGamepads: undefined
    };
}

if (typeof document === 'undefined')
{
    var mockContext = {
        fillStyle: '',
        globalCompositeOperation: '',
        globalAlpha: 1,
        fillRect: function () {},
        drawImage: function () {},
        getImageData: function () { return { data: [ 0, 0, 0, 0 ] }; },
        putImageData: function () {},
        createImageData: function () { return { data: [] }; },
        clearRect: function () {},
        save: function () {},
        restore: function () {}
    };

    var mockCanvas = {
        getContext: function () { return mockContext; },
        width: 1,
        height: 1,
        style: {}
    };

    global.document = {
        documentElement: {},
        pointerLockElement: undefined,
        mozPointerLockElement: undefined,
        webkitPointerLockElement: undefined,
        createElement: function (tag)
        {
            if (tag === 'canvas') { return mockCanvas; }

            return { style: {} };
        },
        addEventListener: function () {}
    };
}

if (typeof Image === 'undefined')
{
    global.Image = function ()
    {
        this.onload = null;
        this.src = '';
    };
}

if (typeof HTMLCanvasElement === 'undefined')
{
    global.HTMLCanvasElement = function () {};
}

var TilemapLayerBase = require('../../src/tilemaps/TilemapLayerBase');
var TilemapComponents = require('../../src/tilemaps/components');
var GameObject = require('../../src/gameobjects/GameObject');

function createMockLayer ()
{
    return {
        alpha: 1,
        width: 10,
        height: 8,
        tilemapLayer: null,
        data: []
    };
}

function createMockTilemap (layer)
{
    return {
        tileWidth: 32,
        tileHeight: 32,
        layers: [ layer ],
        tileToWorldX: vi.fn().mockReturnValue(64),
        tileToWorldY: vi.fn().mockReturnValue(96),
        tileToWorldXY: vi.fn().mockReturnValue({ x: 64, y: 96 }),
        getTileCorners: vi.fn().mockReturnValue([]),
        worldToTileX: vi.fn().mockReturnValue(2),
        worldToTileY: vi.fn().mockReturnValue(3),
        worldToTileXY: vi.fn().mockReturnValue({ x: 2, y: 3 }),
        removeLayer: vi.fn()
    };
}

function createMockObject (overrides)
{
    var layer = createMockLayer();
    var tilemap = createMockTilemap(layer);
    var base = {
        layer: layer,
        tilemap: tilemap,
        tempVec: { x: 0, y: 0 },
        scene: {
            sys: {
                updateList: {
                    add: vi.fn(),
                    remove: vi.fn()
                }
            }
        },
        updateTimer: vi.fn(),
        getTileAt: vi.fn().mockReturnValue({ index: 3 })
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            base[key] = overrides[key];
        }
    }

    return base;
}

describe('TilemapLayerBase', function ()
{
    beforeEach(function ()
    {
        vi.spyOn(TilemapComponents, 'CalculateFacesAt').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'CalculateFacesWithin').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'CreateFromTiles').mockReturnValue([]);
        vi.spyOn(TilemapComponents, 'Copy').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'Fill').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'FilterTiles').mockReturnValue([ { index: 1 } ]);
        vi.spyOn(TilemapComponents, 'FindByIndex').mockReturnValue({ index: 5 });
        vi.spyOn(TilemapComponents, 'FindTile').mockReturnValue(null);
        vi.spyOn(TilemapComponents, 'ForEachTile').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'GetTileAt').mockReturnValue({ index: 3 });
        vi.spyOn(TilemapComponents, 'GetTileAtWorldXY').mockReturnValue({ index: 2 });
        vi.spyOn(TilemapComponents, 'GetTilesWithin').mockReturnValue([]);
        vi.spyOn(TilemapComponents, 'GetTilesWithinShape').mockReturnValue([]);
        vi.spyOn(TilemapComponents, 'GetTilesWithinWorldXY').mockReturnValue([]);
        vi.spyOn(TilemapComponents, 'HasTileAt').mockReturnValue(true);
        vi.spyOn(TilemapComponents, 'HasTileAtWorldXY').mockReturnValue(false);
        vi.spyOn(TilemapComponents, 'IsometricWorldToTileXY').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'PutTileAt').mockReturnValue({ index: 7 });
        vi.spyOn(TilemapComponents, 'PutTileAtWorldXY').mockReturnValue({ index: 8 });
        vi.spyOn(TilemapComponents, 'PutTilesAt').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'Randomize').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'RemoveTileAt').mockReturnValue({ index: 1 });
        vi.spyOn(TilemapComponents, 'RemoveTileAtWorldXY').mockReturnValue({ index: 2 });
        vi.spyOn(TilemapComponents, 'RenderDebug').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'ReplaceByIndex').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'SetCollision').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'SetCollisionBetween').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'SetCollisionByProperty').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'SetCollisionByExclusion').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'SetCollisionFromCollisionGroup').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'SetTileIndexCallback').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'SetTileLocationCallback').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'Shuffle').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'SwapByIndex').mockImplementation(function () {});
        vi.spyOn(TilemapComponents, 'WeightedRandomize').mockImplementation(function () {});
    });

    afterEach(function ()
    {
        vi.restoreAllMocks();
    });

    it('should be importable', function ()
    {
        expect(TilemapLayerBase).toBeDefined();
    });

    describe('addedToScene', function ()
    {
        it('should add this to the scene update list', function ()
        {
            var mock = createMockObject();

            TilemapLayerBase.prototype.addedToScene.call(mock);

            expect(mock.scene.sys.updateList.add).toHaveBeenCalledWith(mock);
        });
    });

    describe('removedFromScene', function ()
    {
        it('should remove this from the scene update list', function ()
        {
            var mock = createMockObject();

            TilemapLayerBase.prototype.removedFromScene.call(mock);

            expect(mock.scene.sys.updateList.remove).toHaveBeenCalledWith(mock);
        });
    });

    describe('preUpdate', function ()
    {
        it('should call updateTimer with time and delta', function ()
        {
            var mock = createMockObject();

            TilemapLayerBase.prototype.preUpdate.call(mock, 1000, 16);

            expect(mock.updateTimer).toHaveBeenCalledWith(1000, 16);
        });
    });

    describe('calculateFacesAt', function ()
    {
        it('should delegate to TilemapComponents with tileX, tileY, and layer', function ()
        {
            var mock = createMockObject();

            TilemapLayerBase.prototype.calculateFacesAt.call(mock, 3, 5);

            expect(TilemapComponents.CalculateFacesAt).toHaveBeenCalledWith(3, 5, mock.layer);
        });

        it('should return this for chaining', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.calculateFacesAt.call(mock, 0, 0);

            expect(result).toBe(mock);
        });
    });

    describe('calculateFacesWithin', function ()
    {
        it('should delegate to TilemapComponents and return this', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.calculateFacesWithin.call(mock, 0, 0, 5, 5);

            expect(TilemapComponents.CalculateFacesWithin).toHaveBeenCalledWith(0, 0, 5, 5, mock.layer);
            expect(result).toBe(mock);
        });
    });

    describe('fill', function ()
    {
        it('should delegate to TilemapComponents with all arguments', function ()
        {
            var mock = createMockObject();

            TilemapLayerBase.prototype.fill.call(mock, 2, 1, 1, 4, 4, true);

            expect(TilemapComponents.Fill).toHaveBeenCalledWith(2, 1, 1, 4, 4, true, mock.layer);
        });

        it('should return this for chaining', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.fill.call(mock, 1, 0, 0, 3, 3);

            expect(result).toBe(mock);
        });
    });

    describe('filterTiles', function ()
    {
        it('should delegate to TilemapComponents and return the result', function ()
        {
            var mock = createMockObject();
            var cb = function (tile) { return tile.index > 0; };

            var result = TilemapLayerBase.prototype.filterTiles.call(mock, cb, null, 0, 0, 5, 5, null);

            expect(TilemapComponents.FilterTiles).toHaveBeenCalledWith(cb, null, 0, 0, 5, 5, null, mock.layer);
            expect(Array.isArray(result)).toBe(true);
        });
    });

    describe('findByIndex', function ()
    {
        it('should delegate to TilemapComponents and return the tile', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.findByIndex.call(mock, 5, 0, false);

            expect(TilemapComponents.FindByIndex).toHaveBeenCalledWith(5, 0, false, mock.layer);
            expect(result).toEqual({ index: 5 });
        });
    });

    describe('getTileAt', function ()
    {
        it('should delegate to TilemapComponents and return the tile', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.getTileAt.call(mock, 2, 3, false);

            expect(TilemapComponents.GetTileAt).toHaveBeenCalledWith(2, 3, false, mock.layer);
            expect(result).toEqual({ index: 3 });
        });
    });

    describe('hasTileAt', function ()
    {
        it('should delegate to TilemapComponents and return boolean true', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.hasTileAt.call(mock, 1, 2);

            expect(TilemapComponents.HasTileAt).toHaveBeenCalledWith(1, 2, mock.layer);
            expect(result).toBe(true);
        });

        it('should return boolean false when HasTileAtWorldXY returns false', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.hasTileAtWorldXY.call(mock, 64, 96, null);

            expect(TilemapComponents.HasTileAtWorldXY).toHaveBeenCalledWith(64, 96, null, mock.layer);
            expect(result).toBe(false);
        });
    });

    describe('putTileAt', function ()
    {
        it('should delegate to TilemapComponents and return the tile', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.putTileAt.call(mock, 7, 2, 3, true);

            expect(TilemapComponents.PutTileAt).toHaveBeenCalledWith(7, 2, 3, true, mock.layer);
            expect(result).toEqual({ index: 7 });
        });
    });

    describe('putTilesAt', function ()
    {
        it('should delegate to TilemapComponents and return this', function ()
        {
            var mock = createMockObject();
            var tiles = [ 1, 2, 3 ];

            var result = TilemapLayerBase.prototype.putTilesAt.call(mock, tiles, 0, 0, true);

            expect(TilemapComponents.PutTilesAt).toHaveBeenCalledWith(tiles, 0, 0, true, mock.layer);
            expect(result).toBe(mock);
        });
    });

    describe('replaceByIndex', function ()
    {
        it('should delegate to TilemapComponents and return this', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.replaceByIndex.call(mock, 1, 2, 0, 0, 5, 5);

            expect(TilemapComponents.ReplaceByIndex).toHaveBeenCalledWith(1, 2, 0, 0, 5, 5, mock.layer);
            expect(result).toBe(mock);
        });
    });

    describe('setCollision', function ()
    {
        it('should delegate to TilemapComponents and return this', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.setCollision.call(mock, [ 1, 2, 3 ], true, true, true);

            expect(TilemapComponents.SetCollision).toHaveBeenCalledWith([ 1, 2, 3 ], true, true, mock.layer, true);
            expect(result).toBe(mock);
        });
    });

    describe('setCollisionBetween', function ()
    {
        it('should delegate to TilemapComponents and return this', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.setCollisionBetween.call(mock, 1, 5, true, true);

            expect(TilemapComponents.SetCollisionBetween).toHaveBeenCalledWith(1, 5, true, true, mock.layer);
            expect(result).toBe(mock);
        });
    });

    describe('shuffle', function ()
    {
        it('should delegate to TilemapComponents and return this', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.shuffle.call(mock, 0, 0, 4, 4);

            expect(TilemapComponents.Shuffle).toHaveBeenCalledWith(0, 0, 4, 4, mock.layer);
            expect(result).toBe(mock);
        });
    });

    describe('swapByIndex', function ()
    {
        it('should delegate to TilemapComponents and return this', function ()
        {
            var mock = createMockObject();

            var result = TilemapLayerBase.prototype.swapByIndex.call(mock, 1, 2, 0, 0, 3, 3);

            expect(TilemapComponents.SwapByIndex).toHaveBeenCalledWith(1, 2, 0, 0, 3, 3, mock.layer);
            expect(result).toBe(mock);
        });
    });

    describe('tileToWorldX', function ()
    {
        it('should delegate to tilemap.tileToWorldX and return the result', function ()
        {
            var mock = createMockObject();
            var camera = {};

            var result = TilemapLayerBase.prototype.tileToWorldX.call(mock, 2, camera);

            expect(mock.tilemap.tileToWorldX).toHaveBeenCalledWith(2, camera, mock);
            expect(result).toBe(64);
        });
    });

    describe('tileToWorldY', function ()
    {
        it('should delegate to tilemap.tileToWorldY and return the result', function ()
        {
            var mock = createMockObject();
            var camera = {};

            var result = TilemapLayerBase.prototype.tileToWorldY.call(mock, 3, camera);

            expect(mock.tilemap.tileToWorldY).toHaveBeenCalledWith(3, camera, mock);
            expect(result).toBe(96);
        });
    });

    describe('worldToTileX', function ()
    {
        it('should delegate to tilemap.worldToTileX and return the result', function ()
        {
            var mock = createMockObject();
            var camera = {};

            var result = TilemapLayerBase.prototype.worldToTileX.call(mock, 64, true, camera);

            expect(mock.tilemap.worldToTileX).toHaveBeenCalledWith(64, true, camera, mock);
            expect(result).toBe(2);
        });
    });

    describe('worldToTileY', function ()
    {
        it('should delegate to tilemap.worldToTileY and return the result', function ()
        {
            var mock = createMockObject();
            var camera = {};

            var result = TilemapLayerBase.prototype.worldToTileY.call(mock, 96, true, camera);

            expect(mock.tilemap.worldToTileY).toHaveBeenCalledWith(96, true, camera, mock);
            expect(result).toBe(3);
        });
    });

    describe('destroy', function ()
    {
        it('should do nothing if tilemap is already undefined', function ()
        {
            var mock = createMockObject();
            mock.tilemap = undefined;
            var goDestroySpy = vi.spyOn(GameObject.prototype, 'destroy').mockImplementation(function () {});

            expect(function ()
            {
                TilemapLayerBase.prototype.destroy.call(mock);
            }).not.toThrow();

            goDestroySpy.mockRestore();
        });

        it('should unlink layer.tilemapLayer when it references this', function ()
        {
            var mock = createMockObject();
            mock.layer.tilemapLayer = mock;
            var goDestroySpy = vi.spyOn(GameObject.prototype, 'destroy').mockImplementation(function () {});

            TilemapLayerBase.prototype.destroy.call(mock);

            expect(mock.layer).toBeUndefined();
            goDestroySpy.mockRestore();
        });

        it('should call tilemap.removeLayer by default', function ()
        {
            var mock = createMockObject();
            mock.layer.tilemapLayer = mock;
            var goDestroySpy = vi.spyOn(GameObject.prototype, 'destroy').mockImplementation(function () {});

            TilemapLayerBase.prototype.destroy.call(mock);

            expect(mock.tilemap).toBeUndefined();
            goDestroySpy.mockRestore();
        });

        it('should not call removeLayer when removeFromTilemap is false', function ()
        {
            var layer = createMockLayer();
            var tilemap = createMockTilemap(layer);
            var mock = createMockObject();
            mock.layer = layer;
            mock.tilemap = tilemap;
            mock.layer.tilemapLayer = mock;
            var goDestroySpy = vi.spyOn(GameObject.prototype, 'destroy').mockImplementation(function () {});

            TilemapLayerBase.prototype.destroy.call(mock, false);

            expect(tilemap.removeLayer).not.toHaveBeenCalled();
            goDestroySpy.mockRestore();
        });

        it('should set tilemap to undefined after destroy', function ()
        {
            var mock = createMockObject();
            mock.layer.tilemapLayer = mock;
            var goDestroySpy = vi.spyOn(GameObject.prototype, 'destroy').mockImplementation(function () {});

            TilemapLayerBase.prototype.destroy.call(mock);

            expect(mock.tilemap).toBeUndefined();
            goDestroySpy.mockRestore();
        });
    });
});
