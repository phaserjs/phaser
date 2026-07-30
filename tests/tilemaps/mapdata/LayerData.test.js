var LayerData = require('../../../src/tilemaps/mapdata/LayerData');
var CONST = require('../../../src/tilemaps/const/ORIENTATION_CONST');

describe('LayerData', function ()
{
    describe('constructor with no config', function ()
    {
        it('should create a LayerData with default values', function ()
        {
            var layer = new LayerData();
            expect(layer.name).toBe('layer');
            expect(layer.id).toBe(0);
            expect(layer.x).toBe(0);
            expect(layer.y).toBe(0);
            expect(layer.width).toBe(0);
            expect(layer.height).toBe(0);
            expect(layer.tileWidth).toBe(0);
            expect(layer.tileHeight).toBe(0);
            expect(layer.baseTileWidth).toBe(0);
            expect(layer.baseTileHeight).toBe(0);
            expect(layer.widthInPixels).toBe(0);
            expect(layer.heightInPixels).toBe(0);
            expect(layer.alpha).toBe(1);
            expect(layer.visible).toBe(true);
            expect(layer.hexSideLength).toBe(0);
            expect(layer.staggerAxis).toBe('y');
            expect(layer.staggerIndex).toBe('odd');
        });

        it('should default orientation to ORTHOGONAL', function ()
        {
            var layer = new LayerData();
            expect(layer.orientation).toBe(CONST.ORTHOGONAL);
        });

        it('should default tilemapLayer to null', function ()
        {
            var layer = new LayerData();
            expect(layer.tilemapLayer).toBeNull();
        });

        it('should default array properties to empty arrays', function ()
        {
            var layer = new LayerData();
            expect(Array.isArray(layer.properties)).toBe(true);
            expect(layer.properties.length).toBe(0);
            expect(Array.isArray(layer.indexes)).toBe(true);
            expect(layer.indexes.length).toBe(0);
            expect(Array.isArray(layer.collideIndexes)).toBe(true);
            expect(layer.collideIndexes.length).toBe(0);
            expect(Array.isArray(layer.callbacks)).toBe(true);
            expect(layer.callbacks.length).toBe(0);
            expect(Array.isArray(layer.bodies)).toBe(true);
            expect(layer.bodies.length).toBe(0);
            expect(Array.isArray(layer.data)).toBe(true);
            expect(layer.data.length).toBe(0);
        });
    });

    describe('constructor with config', function ()
    {
        it('should use provided name', function ()
        {
            var layer = new LayerData({ name: 'ground' });
            expect(layer.name).toBe('ground');
        });

        it('should use provided id', function ()
        {
            var layer = new LayerData({ id: 42 });
            expect(layer.id).toBe(42);
        });

        it('should use provided x and y offsets', function ()
        {
            var layer = new LayerData({ x: 100, y: 200 });
            expect(layer.x).toBe(100);
            expect(layer.y).toBe(200);
        });

        it('should use provided width and height', function ()
        {
            var layer = new LayerData({ width: 20, height: 15 });
            expect(layer.width).toBe(20);
            expect(layer.height).toBe(15);
        });

        it('should use provided tileWidth and tileHeight', function ()
        {
            var layer = new LayerData({ tileWidth: 32, tileHeight: 32 });
            expect(layer.tileWidth).toBe(32);
            expect(layer.tileHeight).toBe(32);
        });

        it('should derive baseTileWidth from tileWidth when not provided', function ()
        {
            var layer = new LayerData({ tileWidth: 64, tileHeight: 48 });
            expect(layer.baseTileWidth).toBe(64);
            expect(layer.baseTileHeight).toBe(48);
        });

        it('should use explicit baseTileWidth and baseTileHeight over tileWidth/tileHeight', function ()
        {
            var layer = new LayerData({ tileWidth: 32, tileHeight: 32, baseTileWidth: 16, baseTileHeight: 16 });
            expect(layer.baseTileWidth).toBe(16);
            expect(layer.baseTileHeight).toBe(16);
        });

        it('should calculate widthInPixels from width * baseTileWidth when not provided', function ()
        {
            var layer = new LayerData({ width: 10, tileWidth: 32 });
            expect(layer.widthInPixels).toBe(320);
        });

        it('should calculate heightInPixels from height * baseTileHeight when not provided', function ()
        {
            var layer = new LayerData({ height: 8, tileHeight: 16 });
            expect(layer.heightInPixels).toBe(128);
        });

        it('should use explicit widthInPixels over calculated value', function ()
        {
            var layer = new LayerData({ width: 10, tileWidth: 32, widthInPixels: 999 });
            expect(layer.widthInPixels).toBe(999);
        });

        it('should use explicit heightInPixels over calculated value', function ()
        {
            var layer = new LayerData({ height: 8, tileHeight: 16, heightInPixels: 777 });
            expect(layer.heightInPixels).toBe(777);
        });

        it('should use provided alpha', function ()
        {
            var layer = new LayerData({ alpha: 0.5 });
            expect(layer.alpha).toBeCloseTo(0.5);
        });

        it('should use provided visible flag', function ()
        {
            var layer = new LayerData({ visible: false });
            expect(layer.visible).toBe(false);
        });

        it('should use provided properties array', function ()
        {
            var props = [{ name: 'speed', value: 10 }];
            var layer = new LayerData({ properties: props });
            expect(layer.properties).toBe(props);
            expect(layer.properties.length).toBe(1);
        });

        it('should use provided indexes array', function ()
        {
            var indexes = [1, 2, 3];
            var layer = new LayerData({ indexes: indexes });
            expect(layer.indexes).toBe(indexes);
        });

        it('should use provided collideIndexes array', function ()
        {
            var collideIndexes = [5, 6, 7];
            var layer = new LayerData({ collideIndexes: collideIndexes });
            expect(layer.collideIndexes).toBe(collideIndexes);
        });

        it('should use provided callbacks array', function ()
        {
            var callbacks = [{ index: 1, callback: function () {} }];
            var layer = new LayerData({ callbacks: callbacks });
            expect(layer.callbacks).toBe(callbacks);
        });

        it('should use provided bodies array', function ()
        {
            var bodies = [{ x: 0, y: 0 }];
            var layer = new LayerData({ bodies: bodies });
            expect(layer.bodies).toBe(bodies);
        });

        it('should use provided data array', function ()
        {
            var data = [[null, null], [null, null]];
            var layer = new LayerData({ data: data });
            expect(layer.data).toBe(data);
            expect(layer.data.length).toBe(2);
        });

        it('should use provided tilemapLayer reference', function ()
        {
            var mockLayer = { scene: {}, tileset: [] };
            var layer = new LayerData({ tilemapLayer: mockLayer });
            expect(layer.tilemapLayer).toBe(mockLayer);
        });

        it('should use provided hexSideLength', function ()
        {
            var layer = new LayerData({ hexSideLength: 18 });
            expect(layer.hexSideLength).toBe(18);
        });

        it('should use provided staggerAxis', function ()
        {
            var layer = new LayerData({ staggerAxis: 'x' });
            expect(layer.staggerAxis).toBe('x');
        });

        it('should use provided staggerIndex', function ()
        {
            var layer = new LayerData({ staggerIndex: 'even' });
            expect(layer.staggerIndex).toBe('even');
        });

        it('should use provided orientation', function ()
        {
            var layer = new LayerData({ orientation: CONST.ISOMETRIC });
            expect(layer.orientation).toBe(CONST.ISOMETRIC);
        });
    });

    describe('constructor with empty config object', function ()
    {
        it('should apply all defaults when given an empty config', function ()
        {
            var layer = new LayerData({});
            expect(layer.name).toBe('layer');
            expect(layer.id).toBe(0);
            expect(layer.x).toBe(0);
            expect(layer.y).toBe(0);
            expect(layer.width).toBe(0);
            expect(layer.height).toBe(0);
            expect(layer.tileWidth).toBe(0);
            expect(layer.tileHeight).toBe(0);
            expect(layer.baseTileWidth).toBe(0);
            expect(layer.baseTileHeight).toBe(0);
            expect(layer.widthInPixels).toBe(0);
            expect(layer.heightInPixels).toBe(0);
            expect(layer.alpha).toBe(1);
            expect(layer.visible).toBe(true);
            expect(layer.hexSideLength).toBe(0);
            expect(layer.staggerAxis).toBe('y');
            expect(layer.staggerIndex).toBe('odd');
            expect(layer.tilemapLayer).toBeNull();
        });
    });

    describe('property mutation', function ()
    {
        it('should allow name to be changed after construction', function ()
        {
            var layer = new LayerData({ name: 'original' });
            layer.name = 'updated';
            expect(layer.name).toBe('updated');
        });

        it('should allow visible to be toggled', function ()
        {
            var layer = new LayerData({ visible: true });
            layer.visible = false;
            expect(layer.visible).toBe(false);
        });

        it('should allow alpha to be changed', function ()
        {
            var layer = new LayerData({ alpha: 1 });
            layer.alpha = 0;
            expect(layer.alpha).toBe(0);
        });

        it('should allow tilemapLayer to be assigned after construction', function ()
        {
            var layer = new LayerData();
            expect(layer.tilemapLayer).toBeNull();
            var mockLayer = { id: 1 };
            layer.tilemapLayer = mockLayer;
            expect(layer.tilemapLayer).toBe(mockLayer);
        });

        it('should allow data to be populated after construction', function ()
        {
            var layer = new LayerData({ width: 2, height: 2 });
            layer.data = [[{}, {}], [{}, {}]];
            expect(layer.data.length).toBe(2);
            expect(layer.data[0].length).toBe(2);
        });
    });

    describe('widthInPixels and heightInPixels calculations', function ()
    {
        it('should compute widthInPixels as zero when width is zero', function ()
        {
            var layer = new LayerData({ width: 0, tileWidth: 32 });
            expect(layer.widthInPixels).toBe(0);
        });

        it('should compute heightInPixels as zero when height is zero', function ()
        {
            var layer = new LayerData({ height: 0, tileHeight: 32 });
            expect(layer.heightInPixels).toBe(0);
        });

        it('should use baseTileWidth (not tileWidth) for widthInPixels calculation', function ()
        {
            var layer = new LayerData({ width: 5, tileWidth: 32, baseTileWidth: 64 });
            expect(layer.widthInPixels).toBe(320);
        });

        it('should use baseTileHeight (not tileHeight) for heightInPixels calculation', function ()
        {
            var layer = new LayerData({ height: 4, tileHeight: 32, baseTileHeight: 16 });
            expect(layer.heightInPixels).toBe(64);
        });
    });
});
