var MapData = require('../../../src/tilemaps/mapdata/MapData');
var CONST = require('../../../src/tilemaps/const/ORIENTATION_CONST');

describe('MapData', function ()
{
    describe('constructor with no config', function ()
    {
        it('should create with default name', function ()
        {
            var mapData = new MapData();
            expect(mapData.name).toBe('map');
        });

        it('should create with default width and height of zero', function ()
        {
            var mapData = new MapData();
            expect(mapData.width).toBe(0);
            expect(mapData.height).toBe(0);
        });

        it('should create with infinite false by default', function ()
        {
            var mapData = new MapData();
            expect(mapData.infinite).toBe(false);
        });

        it('should create with default tileWidth and tileHeight of zero', function ()
        {
            var mapData = new MapData();
            expect(mapData.tileWidth).toBe(0);
            expect(mapData.tileHeight).toBe(0);
        });

        it('should create with widthInPixels as zero when width and tileWidth are zero', function ()
        {
            var mapData = new MapData();
            expect(mapData.widthInPixels).toBe(0);
        });

        it('should create with heightInPixels as zero when height and tileHeight are zero', function ()
        {
            var mapData = new MapData();
            expect(mapData.heightInPixels).toBe(0);
        });

        it('should create with format as null', function ()
        {
            var mapData = new MapData();
            expect(mapData.format).toBeNull();
        });

        it('should create with ORTHOGONAL orientation', function ()
        {
            var mapData = new MapData();
            expect(mapData.orientation).toBe(CONST.ORTHOGONAL);
        });

        it('should create with renderOrder as right-down', function ()
        {
            var mapData = new MapData();
            expect(mapData.renderOrder).toBe('right-down');
        });

        it('should create with version as 1', function ()
        {
            var mapData = new MapData();
            expect(mapData.version).toBe('1');
        });

        it('should create with empty properties object', function ()
        {
            var mapData = new MapData();
            expect(mapData.properties).toEqual({});
        });

        it('should create with empty layers array', function ()
        {
            var mapData = new MapData();
            expect(Array.isArray(mapData.layers)).toBe(true);
            expect(mapData.layers.length).toBe(0);
        });

        it('should create with empty images array', function ()
        {
            var mapData = new MapData();
            expect(Array.isArray(mapData.images)).toBe(true);
            expect(mapData.images.length).toBe(0);
        });

        it('should create with empty objects array', function ()
        {
            var mapData = new MapData();
            expect(Array.isArray(mapData.objects)).toBe(true);
            expect(mapData.objects.length).toBe(0);
        });

        it('should create with empty collision object', function ()
        {
            var mapData = new MapData();
            expect(mapData.collision).toEqual({});
        });

        it('should create with empty tilesets array', function ()
        {
            var mapData = new MapData();
            expect(Array.isArray(mapData.tilesets)).toBe(true);
            expect(mapData.tilesets.length).toBe(0);
        });

        it('should create with empty imageCollections array', function ()
        {
            var mapData = new MapData();
            expect(Array.isArray(mapData.imageCollections)).toBe(true);
            expect(mapData.imageCollections.length).toBe(0);
        });

        it('should create with empty tiles array', function ()
        {
            var mapData = new MapData();
            expect(Array.isArray(mapData.tiles)).toBe(true);
            expect(mapData.tiles.length).toBe(0);
        });

        it('should create with hexSideLength of zero', function ()
        {
            var mapData = new MapData();
            expect(mapData.hexSideLength).toBe(0);
        });

        it('should create with staggerAxis as y', function ()
        {
            var mapData = new MapData();
            expect(mapData.staggerAxis).toBe('y');
        });

        it('should create with staggerIndex as odd', function ()
        {
            var mapData = new MapData();
            expect(mapData.staggerIndex).toBe('odd');
        });
    });

    describe('constructor with config', function ()
    {
        it('should set name from config', function ()
        {
            var mapData = new MapData({ name: 'myMap' });
            expect(mapData.name).toBe('myMap');
        });

        it('should set width and height from config', function ()
        {
            var mapData = new MapData({ width: 20, height: 15 });
            expect(mapData.width).toBe(20);
            expect(mapData.height).toBe(15);
        });

        it('should set infinite from config', function ()
        {
            var mapData = new MapData({ infinite: true });
            expect(mapData.infinite).toBe(true);
        });

        it('should set tileWidth and tileHeight from config', function ()
        {
            var mapData = new MapData({ tileWidth: 32, tileHeight: 32 });
            expect(mapData.tileWidth).toBe(32);
            expect(mapData.tileHeight).toBe(32);
        });

        it('should compute widthInPixels from width and tileWidth when not provided', function ()
        {
            var mapData = new MapData({ width: 10, tileWidth: 32 });
            expect(mapData.widthInPixels).toBe(320);
        });

        it('should compute heightInPixels from height and tileHeight when not provided', function ()
        {
            var mapData = new MapData({ height: 8, tileHeight: 16 });
            expect(mapData.heightInPixels).toBe(128);
        });

        it('should use explicit widthInPixels from config over computed value', function ()
        {
            var mapData = new MapData({ width: 10, tileWidth: 32, widthInPixels: 999 });
            expect(mapData.widthInPixels).toBe(999);
        });

        it('should use explicit heightInPixels from config over computed value', function ()
        {
            var mapData = new MapData({ height: 8, tileHeight: 16, heightInPixels: 777 });
            expect(mapData.heightInPixels).toBe(777);
        });

        it('should set format from config', function ()
        {
            var mapData = new MapData({ format: 1 });
            expect(mapData.format).toBe(1);
        });

        it('should set orientation from config', function ()
        {
            var mapData = new MapData({ orientation: CONST.ISOMETRIC });
            expect(mapData.orientation).toBe(CONST.ISOMETRIC);
        });

        it('should set renderOrder from config', function ()
        {
            var mapData = new MapData({ renderOrder: 'left-up' });
            expect(mapData.renderOrder).toBe('left-up');
        });

        it('should set version from config', function ()
        {
            var mapData = new MapData({ version: '1.4' });
            expect(mapData.version).toBe('1.4');
        });

        it('should set properties from config', function ()
        {
            var props = { gravity: 9.8, fogColor: '#fff' };
            var mapData = new MapData({ properties: props });
            expect(mapData.properties).toBe(props);
        });

        it('should set layers from config', function ()
        {
            var layers = [{ name: 'layer1' }];
            var mapData = new MapData({ layers: layers });
            expect(mapData.layers).toBe(layers);
        });

        it('should set images from config', function ()
        {
            var images = [{ name: 'bg' }];
            var mapData = new MapData({ images: images });
            expect(mapData.images).toBe(images);
        });

        it('should set objects from config when it is an array', function ()
        {
            var objects = [{ name: 'obj1' }];
            var mapData = new MapData({ objects: objects });
            expect(mapData.objects).toBe(objects);
        });

        it('should replace non-array objects with an empty array', function ()
        {
            var mapData = new MapData({ objects: {} });
            expect(Array.isArray(mapData.objects)).toBe(true);
            expect(mapData.objects.length).toBe(0);
        });

        it('should replace null objects with an empty array', function ()
        {
            var mapData = new MapData({ objects: null });
            expect(Array.isArray(mapData.objects)).toBe(true);
            expect(mapData.objects.length).toBe(0);
        });

        it('should set collision from config', function ()
        {
            var collision = { layer0: [] };
            var mapData = new MapData({ collision: collision });
            expect(mapData.collision).toBe(collision);
        });

        it('should set tilesets from config', function ()
        {
            var tilesets = [{ name: 'tileset1' }];
            var mapData = new MapData({ tilesets: tilesets });
            expect(mapData.tilesets).toBe(tilesets);
        });

        it('should set imageCollections from config', function ()
        {
            var collections = [{ name: 'collection1' }];
            var mapData = new MapData({ imageCollections: collections });
            expect(mapData.imageCollections).toBe(collections);
        });

        it('should set tiles from config', function ()
        {
            var tiles = [[1, 2, 3]];
            var mapData = new MapData({ tiles: tiles });
            expect(mapData.tiles).toBe(tiles);
        });

        it('should set hexSideLength from config', function ()
        {
            var mapData = new MapData({ hexSideLength: 18 });
            expect(mapData.hexSideLength).toBe(18);
        });

        it('should set staggerAxis from config', function ()
        {
            var mapData = new MapData({ staggerAxis: 'x' });
            expect(mapData.staggerAxis).toBe('x');
        });

        it('should set staggerIndex from config', function ()
        {
            var mapData = new MapData({ staggerIndex: 'even' });
            expect(mapData.staggerIndex).toBe('even');
        });
    });

    describe('computed pixel dimensions', function ()
    {
        it('should correctly compute widthInPixels for non-square tiles', function ()
        {
            var mapData = new MapData({ width: 5, tileWidth: 64 });
            expect(mapData.widthInPixels).toBe(320);
        });

        it('should correctly compute heightInPixels for non-square tiles', function ()
        {
            var mapData = new MapData({ height: 3, tileHeight: 48 });
            expect(mapData.heightInPixels).toBe(144);
        });

        it('should have widthInPixels of zero when width is zero', function ()
        {
            var mapData = new MapData({ width: 0, tileWidth: 32 });
            expect(mapData.widthInPixels).toBe(0);
        });

        it('should have heightInPixels of zero when height is zero', function ()
        {
            var mapData = new MapData({ height: 0, tileHeight: 32 });
            expect(mapData.heightInPixels).toBe(0);
        });
    });
});
