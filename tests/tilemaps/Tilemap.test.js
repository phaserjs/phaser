vi.mock('../../src/tilemaps/Tile', function ()
{
    function MockTile (layer, index, x, y, tileWidth, tileHeight, baseWidth, baseHeight)
    {
        this.layer = layer;
        this.index = index;
        this.x = x;
        this.y = y;
        this.width = tileWidth;
        this.height = tileHeight;
        this.baseWidth = baseWidth;
        this.baseHeight = baseHeight;
    }

    MockTile.prototype.setSize = function (tileWidth, tileHeight, baseWidth, baseHeight)
    {
        if (tileWidth !== undefined) { this.width = tileWidth; }
        if (tileHeight !== undefined) { this.height = tileHeight; }
        if (baseWidth !== undefined) { this.baseWidth = baseWidth; }
        if (baseHeight !== undefined) { this.baseHeight = baseHeight; }

        return this;
    };

    return { default: MockTile };
});

vi.mock('../../src/tilemaps/TilemapLayer', function ()
{
    function MockTilemapLayer (scene, tilemap, layerIndex, tileset, x, y)
    {
        this.scene = scene;
        this.tilemap = tilemap;
        this.layerIndex = layerIndex;
        this._renderOrder = 'right-down';
        this._destroyed = false;
    }

    MockTilemapLayer.prototype.setRenderOrder = function (order)
    {
        this._renderOrder = order;

        return this;
    };

    MockTilemapLayer.prototype.destroy = function ()
    {
        this._destroyed = true;
    };

    return { default: MockTilemapLayer };
});

vi.mock('../../src/tilemaps/TilemapGPULayer', function ()
{
    function MockTilemapGPULayer (scene, tilemap, layerIndex, tileset, x, y)
    {
        this.scene = scene;
        this.tilemap = tilemap;
        this.layerIndex = layerIndex;
    }

    MockTilemapGPULayer.prototype.destroy = function () {};

    return { default: MockTilemapGPULayer };
});

vi.mock('../../src/tilemaps/TilemapLayerBase', function ()
{
    function MockTilemapLayerBase () {}

    return { default: MockTilemapLayerBase };
});

vi.mock('../../src/gameobjects/sprite/Sprite', function ()
{
    function MockSprite () {}

    return { default: MockSprite };
});

vi.mock('../../src/tilemaps/components', function ()
{
    var noop = function () {};
    var identity = function (val) { return val; };

    return {
        default: {
            GetWorldToTileXYFunction: function () { return noop; },
            GetWorldToTileXFunction: function () { return noop; },
            GetWorldToTileYFunction: function () { return noop; },
            GetTileToWorldXYFunction: function () { return noop; },
            GetTileToWorldXFunction: function () { return noop; },
            GetTileToWorldYFunction: function () { return noop; },
            GetTileCornersFunction: function () { return noop; },
            Copy: noop,
            Fill: noop,
            FilterTiles: function () { return []; },
            FindByIndex: function () { return null; },
            FindTile: function () { return null; },
            ForEachTile: noop,
            GetTileAt: function () { return null; },
            GetTileAtWorldXY: function () { return null; },
            GetTilesWithin: function () { return []; },
            GetTilesWithinShape: function () { return []; },
            GetTilesWithinWorldXY: function () { return []; },
            HasTileAt: function () { return false; },
            HasTileAtWorldXY: function () { return false; },
            PutTileAt: function () { return null; },
            PutTileAtWorldXY: function () { return null; },
            PutTilesAt: noop,
            Randomize: noop,
            CalculateFacesAt: noop,
            CalculateFacesWithin: noop,
            RemoveTileAt: function () { return null; },
            RemoveTileAtWorldXY: function () { return null; },
            RenderDebug: noop,
            ReplaceByIndex: noop,
            SetCollision: noop,
            SetCollisionBetween: noop,
            SetCollisionByProperty: noop,
            SetCollisionByExclusion: noop,
            SetCollisionFromCollisionGroup: noop,
            SetTileIndexCallback: noop,
            SetTileLocationCallback: noop,
            Shuffle: noop,
            SwapByIndex: noop,
            WeightedRandomize: noop,
            CreateFromTiles: function () { return []; }
        }
    };
});

var Tilemap = require('../../src/tilemaps/Tilemap');

function makeMapData (overrides)
{
    var defaults = {
        tileWidth: 32,
        tileHeight: 32,
        width: 10,
        height: 10,
        orientation: 'orthogonal',
        renderOrder: 'right-down',
        format: 1,
        version: 1,
        properties: {},
        widthInPixels: 320,
        heightInPixels: 320,
        imageCollections: [],
        images: [],
        layers: [],
        tiles: [],
        tilesets: [],
        objects: [],
        hexSideLength: 0
    };

    if (overrides)
    {
        for (var key in overrides)
        {
            defaults[key] = overrides[key];
        }
    }

    return defaults;
}

function makeScene ()
{
    return {
        sys: {
            displayList: {
                add: function () {}
            }
        }
    };
}

describe('Phaser.Tilemaps.Tilemap', function ()
{
    var scene;
    var tilemap;

    beforeEach(function ()
    {
        scene = makeScene();
        tilemap = new Tilemap(scene, makeMapData());
    });

    describe('constructor', function ()
    {
        it('should assign tileWidth from mapData', function ()
        {
            expect(tilemap.tileWidth).toBe(32);
        });

        it('should assign tileHeight from mapData', function ()
        {
            expect(tilemap.tileHeight).toBe(32);
        });

        it('should assign width and height from mapData', function ()
        {
            expect(tilemap.width).toBe(10);
            expect(tilemap.height).toBe(10);
        });

        it('should assign widthInPixels and heightInPixels from mapData', function ()
        {
            expect(tilemap.widthInPixels).toBe(320);
            expect(tilemap.heightInPixels).toBe(320);
        });

        it('should assign orientation from mapData', function ()
        {
            expect(tilemap.orientation).toBe('orthogonal');
        });

        it('should assign renderOrder from mapData', function ()
        {
            expect(tilemap.renderOrder).toBe('right-down');
        });

        it('should default currentLayerIndex to 0', function ()
        {
            expect(tilemap.currentLayerIndex).toBe(0);
        });

        it('should assign the scene reference', function ()
        {
            expect(tilemap.scene).toBe(scene);
        });

        it('should initialise layers as empty array from mapData', function ()
        {
            expect(tilemap.layers).toEqual([]);
        });

        it('should initialise tilesets as empty array from mapData', function ()
        {
            expect(tilemap.tilesets).toEqual([]);
        });

        it('should initialise _convert with conversion functions', function ()
        {
            expect(typeof tilemap._convert.WorldToTileXY).toBe('function');
            expect(typeof tilemap._convert.TileToWorldXY).toBe('function');
        });
    });

    describe('setRenderOrder', function ()
    {
        it('should set renderOrder to right-down when passed 0', function ()
        {
            tilemap.setRenderOrder(0);

            expect(tilemap.renderOrder).toBe('right-down');
        });

        it('should set renderOrder to left-down when passed 1', function ()
        {
            tilemap.setRenderOrder(1);

            expect(tilemap.renderOrder).toBe('left-down');
        });

        it('should set renderOrder to right-up when passed 2', function ()
        {
            tilemap.setRenderOrder(2);

            expect(tilemap.renderOrder).toBe('right-up');
        });

        it('should set renderOrder to left-up when passed 3', function ()
        {
            tilemap.setRenderOrder(3);

            expect(tilemap.renderOrder).toBe('left-up');
        });

        it('should set renderOrder when a valid string is passed', function ()
        {
            tilemap.setRenderOrder('left-up');

            expect(tilemap.renderOrder).toBe('left-up');
        });

        it('should not change renderOrder when an invalid string is passed', function ()
        {
            tilemap.setRenderOrder('invalid-order');

            expect(tilemap.renderOrder).toBe('right-down');
        });

        it('should return this for chaining', function ()
        {
            var result = tilemap.setRenderOrder(0);

            expect(result).toBe(tilemap);
        });
    });

    describe('getIndex', function ()
    {
        it('should return the index of an element matching by name', function ()
        {
            var arr = [ { name: 'alpha' }, { name: 'beta' }, { name: 'gamma' } ];

            expect(tilemap.getIndex(arr, 'beta')).toBe(1);
        });

        it('should return 0 when the matching element is first', function ()
        {
            var arr = [ { name: 'first' }, { name: 'second' } ];

            expect(tilemap.getIndex(arr, 'first')).toBe(0);
        });

        it('should return null when no element matches the name', function ()
        {
            var arr = [ { name: 'alpha' }, { name: 'beta' } ];

            expect(tilemap.getIndex(arr, 'missing')).toBeNull();
        });

        it('should return null for an empty array', function ()
        {
            expect(tilemap.getIndex([], 'anything')).toBeNull();
        });
    });

    describe('getTileLayerNames', function ()
    {
        it('should return an empty array when no layers exist', function ()
        {
            expect(tilemap.getTileLayerNames()).toEqual([]);
        });

        it('should return an array of layer names', function ()
        {
            tilemap.layers = [ { name: 'Ground' }, { name: 'Objects' }, { name: 'Overlay' } ];

            expect(tilemap.getTileLayerNames()).toEqual([ 'Ground', 'Objects', 'Overlay' ]);
        });

        it('should return an empty array when layers is not an array', function ()
        {
            tilemap.layers = null;

            expect(tilemap.getTileLayerNames()).toEqual([]);
        });
    });

    describe('getImageLayerNames', function ()
    {
        it('should return an empty array when no images exist', function ()
        {
            expect(tilemap.getImageLayerNames()).toEqual([]);
        });

        it('should return an array of image layer names', function ()
        {
            tilemap.images = [ { name: 'Background' }, { name: 'Foreground' } ];

            expect(tilemap.getImageLayerNames()).toEqual([ 'Background', 'Foreground' ]);
        });

        it('should return an empty array when images is not an array', function ()
        {
            tilemap.images = null;

            expect(tilemap.getImageLayerNames()).toEqual([]);
        });
    });

    describe('getObjectLayerNames', function ()
    {
        it('should return an empty array when no object layers exist', function ()
        {
            expect(tilemap.getObjectLayerNames()).toEqual([]);
        });

        it('should return an array of object layer names', function ()
        {
            tilemap.objects = [ { name: 'Enemies' }, { name: 'Items' } ];

            expect(tilemap.getObjectLayerNames()).toEqual([ 'Enemies', 'Items' ]);
        });

        it('should return an empty array when objects is not an array', function ()
        {
            tilemap.objects = null;

            expect(tilemap.getObjectLayerNames()).toEqual([]);
        });
    });

    describe('getTileset', function ()
    {
        it('should return the tileset with the matching name', function ()
        {
            var ts = { name: 'tiles' };
            tilemap.tilesets = [ { name: 'other' }, ts ];

            expect(tilemap.getTileset('tiles')).toBe(ts);
        });

        it('should return null when no tileset matches', function ()
        {
            tilemap.tilesets = [ { name: 'tiles' } ];

            expect(tilemap.getTileset('missing')).toBeNull();
        });

        it('should return null when tilesets is empty', function ()
        {
            expect(tilemap.getTileset('anything')).toBeNull();
        });
    });

    describe('getTilesetIndex', function ()
    {
        it('should return the index of the named tileset', function ()
        {
            tilemap.tilesets = [ { name: 'first' }, { name: 'second' } ];

            expect(tilemap.getTilesetIndex('second')).toBe(1);
        });

        it('should return null when the tileset is not found', function ()
        {
            tilemap.tilesets = [ { name: 'first' } ];

            expect(tilemap.getTilesetIndex('missing')).toBeNull();
        });
    });

    describe('getObjectLayer', function ()
    {
        it('should return the object layer with the matching name', function ()
        {
            var layer = { name: 'Enemies', objects: [] };
            tilemap.objects = [ { name: 'Items', objects: [] }, layer ];

            expect(tilemap.getObjectLayer('Enemies')).toBe(layer);
        });

        it('should return null when no object layer matches', function ()
        {
            tilemap.objects = [ { name: 'Items', objects: [] } ];

            expect(tilemap.getObjectLayer('missing')).toBeNull();
        });
    });

    describe('getLayerIndex', function ()
    {
        it('should return currentLayerIndex when no argument is given', function ()
        {
            tilemap.layers = [ { name: 'Ground' }, { name: 'Objects' } ];
            tilemap.currentLayerIndex = 1;

            expect(tilemap.getLayerIndex()).toBe(1);
        });

        it('should return the index by string name', function ()
        {
            tilemap.layers = [ { name: 'Ground' }, { name: 'Objects' } ];

            expect(tilemap.getLayerIndex('Objects')).toBe(1);
        });

        it('should return a numeric index directly when it is within bounds', function ()
        {
            tilemap.layers = [ { name: 'Ground' }, { name: 'Objects' } ];

            expect(tilemap.getLayerIndex(0)).toBe(0);
            expect(tilemap.getLayerIndex(1)).toBe(1);
        });

        it('should return null when a numeric index is out of bounds', function ()
        {
            tilemap.layers = [ { name: 'Ground' } ];

            expect(tilemap.getLayerIndex(5)).toBeNull();
        });

        it('should return null when a string name does not match any layer', function ()
        {
            tilemap.layers = [ { name: 'Ground' } ];

            expect(tilemap.getLayerIndex('missing')).toBeNull();
        });
    });

    describe('getLayerIndexByName', function ()
    {
        it('should return the index of the layer with the matching name', function ()
        {
            tilemap.layers = [ { name: 'Ground' }, { name: 'Sky' } ];

            expect(tilemap.getLayerIndexByName('Sky')).toBe(1);
        });

        it('should return null when no layer has the given name', function ()
        {
            tilemap.layers = [ { name: 'Ground' } ];

            expect(tilemap.getLayerIndexByName('missing')).toBeNull();
        });
    });

    describe('getLayer', function ()
    {
        it('should return the LayerData for the current layer when no argument is given', function ()
        {
            var layerData = { name: 'Ground' };
            tilemap.layers = [ layerData ];
            tilemap.currentLayerIndex = 0;

            expect(tilemap.getLayer()).toBe(layerData);
        });

        it('should return the LayerData by name', function ()
        {
            var ground = { name: 'Ground' };
            var sky = { name: 'Sky' };
            tilemap.layers = [ ground, sky ];

            expect(tilemap.getLayer('Sky')).toBe(sky);
        });

        it('should return null when the layer name does not exist', function ()
        {
            tilemap.layers = [ { name: 'Ground' } ];

            expect(tilemap.getLayer('missing')).toBeNull();
        });
    });

    describe('setLayer', function ()
    {
        it('should update currentLayerIndex when a valid layer index is given', function ()
        {
            tilemap.layers = [ { name: 'Ground' }, { name: 'Objects' } ];
            tilemap.setLayer(1);

            expect(tilemap.currentLayerIndex).toBe(1);
        });

        it('should update currentLayerIndex when a valid layer name is given', function ()
        {
            tilemap.layers = [ { name: 'Ground' }, { name: 'Objects' } ];
            tilemap.setLayer('Objects');

            expect(tilemap.currentLayerIndex).toBe(1);
        });

        it('should not change currentLayerIndex when an invalid layer is given', function ()
        {
            tilemap.layers = [ { name: 'Ground' } ];
            tilemap.currentLayerIndex = 0;
            tilemap.setLayer('missing');

            expect(tilemap.currentLayerIndex).toBe(0);
        });

        it('should return this for chaining', function ()
        {
            var result = tilemap.setLayer(0);

            expect(result).toBe(tilemap);
        });
    });

    describe('setBaseTileSize', function ()
    {
        it('should update tileWidth and tileHeight', function ()
        {
            tilemap.setBaseTileSize(64, 64);

            expect(tilemap.tileWidth).toBe(64);
            expect(tilemap.tileHeight).toBe(64);
        });

        it('should recalculate widthInPixels and heightInPixels', function ()
        {
            tilemap.setBaseTileSize(16, 16);

            expect(tilemap.widthInPixels).toBe(tilemap.width * 16);
            expect(tilemap.heightInPixels).toBe(tilemap.height * 16);
        });

        it('should return this for chaining', function ()
        {
            var result = tilemap.setBaseTileSize(32, 32);

            expect(result).toBe(tilemap);
        });

        it('should update baseTileWidth and baseTileHeight on each layer', function ()
        {
            tilemap.layers = [
                { name: 'Ground', baseTileWidth: 32, baseTileHeight: 32, data: [], width: 0, height: 0 }
            ];

            tilemap.setBaseTileSize(64, 64);

            expect(tilemap.layers[0].baseTileWidth).toBe(64);
            expect(tilemap.layers[0].baseTileHeight).toBe(64);
        });
    });

    describe('removeAllLayers', function ()
    {
        it('should empty the layers array', function ()
        {
            tilemap.layers = [ { name: 'A', tilemapLayer: null }, { name: 'B', tilemapLayer: null } ];
            tilemap.removeAllLayers();

            expect(tilemap.layers.length).toBe(0);
        });

        it('should reset currentLayerIndex to 0', function ()
        {
            tilemap.layers = [ { name: 'A', tilemapLayer: null } ];
            tilemap.currentLayerIndex = 0;
            tilemap.removeAllLayers();

            expect(tilemap.currentLayerIndex).toBe(0);
        });

        it('should call destroy on any tilemapLayer that exists', function ()
        {
            var destroyed = false;
            tilemap.layers = [
                {
                    name: 'A',
                    tilemapLayer: {
                        destroy: function () { destroyed = true; }
                    }
                }
            ];

            tilemap.removeAllLayers();

            expect(destroyed).toBe(true);
        });

        it('should return this for chaining', function ()
        {
            var result = tilemap.removeAllLayers();

            expect(result).toBe(tilemap);
        });
    });

    describe('removeLayer', function ()
    {
        it('should remove a layer by index', function ()
        {
            tilemap.layers = [ { name: 'Ground' }, { name: 'Objects' } ];
            tilemap.removeLayer(0);

            expect(tilemap.layers.length).toBe(1);
            expect(tilemap.layers[0].name).toBe('Objects');
        });

        it('should remove a layer by name', function ()
        {
            tilemap.layers = [ { name: 'Ground' }, { name: 'Objects' } ];
            tilemap.removeLayer('Ground');

            expect(tilemap.layers.length).toBe(1);
            expect(tilemap.layers[0].name).toBe('Objects');
        });

        it('should return null when the layer does not exist', function ()
        {
            tilemap.layers = [ { name: 'Ground' } ];

            expect(tilemap.removeLayer('missing')).toBeNull();
        });

        it('should reset currentLayerIndex to 0 when the current layer is removed', function ()
        {
            tilemap.layers = [ { name: 'A' }, { name: 'B' } ];
            tilemap.currentLayerIndex = 1;
            tilemap.removeLayer(1);

            expect(tilemap.currentLayerIndex).toBe(0);
        });

        it('should return this on success', function ()
        {
            tilemap.layers = [ { name: 'Ground' } ];

            expect(tilemap.removeLayer(0)).toBe(tilemap);
        });
    });

    describe('filterObjects', function ()
    {
        it('should filter objects on an ObjectLayer instance by callback', function ()
        {
            var objects = [ { id: 1, type: 'enemy' }, { id: 2, type: 'coin' }, { id: 3, type: 'enemy' } ];
            var objectLayer = { name: 'Things', objects: objects };

            var result = tilemap.filterObjects(objectLayer, function (obj)
            {
                return obj.type === 'enemy';
            });

            expect(result.length).toBe(2);
            expect(result[0].id).toBe(1);
            expect(result[1].id).toBe(3);
        });

        it('should return null when a string name does not match any object layer', function ()
        {
            tilemap.objects = [];

            var result = tilemap.filterObjects('missing', function () { return true; });

            expect(result).toBeNull();
        });

        it('should accept a string name and find the object layer', function ()
        {
            var objectLayer = { name: 'Coins', objects: [ { id: 1 }, { id: 2 } ] };
            tilemap.objects = [ objectLayer ];

            var result = tilemap.filterObjects('Coins', function () { return true; });

            expect(result.length).toBe(2);
        });
    });

    describe('findObject', function ()
    {
        it('should find the first matching object in an ObjectLayer instance', function ()
        {
            var target = { id: 3, name: 'boss' };
            var objectLayer = { name: 'Enemies', objects: [ { id: 1, name: 'grunt' }, target ] };

            var result = tilemap.findObject(objectLayer, function (obj)
            {
                return obj.name === 'boss';
            });

            expect(result).toBe(target);
        });

        it('should return null when no object matches the callback', function ()
        {
            var objectLayer = { name: 'Enemies', objects: [ { id: 1, name: 'grunt' } ] };

            var result = tilemap.findObject(objectLayer, function () { return false; });

            expect(result).toBeNull();
        });

        it('should return null when a string name does not match any object layer', function ()
        {
            tilemap.objects = [];

            var result = tilemap.findObject('missing', function () { return true; });

            expect(result).toBeNull();
        });
    });

    describe('layer getter and setter', function ()
    {
        it('should get the LayerData for the current layer via the layer getter', function ()
        {
            var layerData = { name: 'Ground' };
            tilemap.layers = [ layerData, { name: 'Sky' } ];
            tilemap.currentLayerIndex = 0;

            expect(tilemap.layer).toBe(layerData);
        });

        it('should change currentLayerIndex via the layer setter', function ()
        {
            tilemap.layers = [ { name: 'Ground' }, { name: 'Sky' } ];
            tilemap.layer = 1;

            expect(tilemap.currentLayerIndex).toBe(1);
        });
    });

    describe('destroy', function ()
    {
        it('should clear the tiles array', function ()
        {
            tilemap.tiles = [ 1, 2, 3 ];
            tilemap.destroy();

            expect(tilemap.tiles.length).toBe(0);
        });

        it('should clear the tilesets array', function ()
        {
            tilemap.tilesets = [ { name: 'tiles' } ];
            tilemap.destroy();

            expect(tilemap.tilesets.length).toBe(0);
        });

        it('should clear the objects array', function ()
        {
            tilemap.objects = [ { name: 'layer' } ];
            tilemap.destroy();

            expect(tilemap.objects.length).toBe(0);
        });

        it('should set scene to null', function ()
        {
            tilemap.destroy();

            expect(tilemap.scene).toBeNull();
        });
    });
});
