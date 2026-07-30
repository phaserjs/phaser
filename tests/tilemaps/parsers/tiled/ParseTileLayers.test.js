vi.mock('../../../../src/tilemaps/Tile', function ()
{
    function MockTile (layer, index, x, y, width, height)
    {
        this.layer = layer;
        this.index = index;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.flipX = false;
        this.rotation = 0;
    }

    return MockTile;
});

var ParseTileLayers = require('../../../../src/tilemaps/parsers/tiled/ParseTileLayers');

describe('Phaser.Tilemaps.Parsers.Tiled.ParseTileLayers', function ()
{
    function makeFiniteJSON (layers, overrides)
    {
        return Object.assign({
            infinite: false,
            orientation: 'orthogonal',
            tilewidth: 32,
            tileheight: 32,
            layers: layers
        }, overrides);
    }

    function makeTileLayer (overrides)
    {
        return Object.assign({
            type: 'tilelayer',
            name: 'layer1',
            id: 1,
            x: 0,
            y: 0,
            width: 2,
            height: 2,
            opacity: 1,
            visible: true,
            data: [1, 2, 3, 4]
        }, overrides);
    }

    function makeInfiniteJSON (layers, overrides)
    {
        return Object.assign({
            infinite: true,
            orientation: 'orthogonal',
            tilewidth: 32,
            tileheight: 32,
            layers: layers
        }, overrides);
    }

    function makeInfiniteTileLayer (overrides)
    {
        return Object.assign({
            type: 'tilelayer',
            name: 'layer1',
            id: 1,
            x: 0,
            y: 0,
            startx: 0,
            starty: 0,
            width: 2,
            height: 2,
            opacity: 1,
            visible: true,
            chunks: [
                {
                    x: 0, y: 0,
                    width: 2, height: 2,
                    data: [1, 2, 3, 4]
                }
            ]
        }, overrides);
    }

    // -------------------------------------------------------------------------
    // Return value structure
    // -------------------------------------------------------------------------

    it('should return an empty array when json has no layers', function ()
    {
        var json = makeFiniteJSON([]);
        var result = ParseTileLayers(json, false);

        expect(result).toEqual([]);
    });

    it('should return an empty array when no tilelayer type layers exist', function ()
    {
        var json = makeFiniteJSON([
            { type: 'objectgroup', name: 'objects', id: 1 },
            { type: 'imagelayer', name: 'bg', id: 2 }
        ]);
        var result = ParseTileLayers(json, false);

        expect(result).toEqual([]);
    });

    it('should return one LayerData for a single tilelayer', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer() ]);
        var result = ParseTileLayers(json, false);

        expect(result.length).toBe(1);
    });

    it('should return one LayerData per tilelayer when multiple exist', function ()
    {
        var json = makeFiniteJSON([
            makeTileLayer({ name: 'a', id: 1 }),
            makeTileLayer({ name: 'b', id: 2 })
        ]);
        var result = ParseTileLayers(json, false);

        expect(result.length).toBe(2);
    });

    // -------------------------------------------------------------------------
    // Finite map — LayerData properties
    // -------------------------------------------------------------------------

    it('should set the layer name from the JSON', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer({ name: 'myLayer' }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].name).toBe('myLayer');
    });

    it('should set the layer id from the JSON', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer({ id: 7 }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].id).toBe(7);
    });

    it('should set layer width and height from the JSON', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer({ width: 4, height: 3, data: new Array(12).fill(1) }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].width).toBe(4);
        expect(result[0].height).toBe(3);
    });

    it('should set tile dimensions from the JSON map tilewidth and tileheight', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer() ], { tilewidth: 16, tileheight: 16 });
        var result = ParseTileLayers(json, false);

        expect(result[0].tileWidth).toBe(16);
        expect(result[0].tileHeight).toBe(16);
    });

    it('should set layer alpha as product of layer opacity and group opacity', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer({ opacity: 0.5 }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].alpha).toBeCloseTo(0.5);
    });

    it('should set layer visible from the JSON', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer({ visible: false }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].visible).toBe(false);
    });

    it('should set layer x position including offsetx and layer x', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer({ x: 5, offsetx: 10 }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].x).toBe(15);
    });

    it('should set layer y position including offsety and layer y', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer({ y: 3, offsety: 7 }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].y).toBe(10);
    });

    it('should set layer properties from the JSON', function ()
    {
        var props = [ { name: 'speed', type: 'int', value: 5 } ];
        var json = makeFiniteJSON([ makeTileLayer({ properties: props }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].properties).toEqual(props);
    });

    it('should default properties to empty array when not present', function ()
    {
        var layer = makeTileLayer();
        delete layer.properties;
        var json = makeFiniteJSON([ layer ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].properties).toEqual([]);
    });

    // -------------------------------------------------------------------------
    // Finite map — tile data (output grid)
    // -------------------------------------------------------------------------

    it('should produce a 2D data array with correct row and column counts', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer({ width: 2, height: 2, data: [1, 2, 3, 4] }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].data.length).toBe(2);
        expect(result[0].data[0].length).toBe(2);
    });

    it('should create Tile objects for gids greater than zero', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer({ width: 2, height: 1, data: [1, 2] }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].data[0][0]).not.toBeNull();
        expect(result[0].data[0][0].index).toBe(1);
        expect(result[0].data[0][1].index).toBe(2);
    });

    it('should place null for empty gids (0) when insertNull is true', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer({ width: 2, height: 1, data: [0, 1] }) ]);
        var result = ParseTileLayers(json, true);

        expect(result[0].data[0][0]).toBeNull();
    });

    it('should place a Tile with index -1 for empty gids when insertNull is false', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer({ width: 2, height: 1, data: [0, 1] }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].data[0][0]).not.toBeNull();
        expect(result[0].data[0][0].index).toBe(-1);
    });

    it('should set tile x and y coordinates based on position in data array', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer({ width: 2, height: 2, data: [1, 2, 3, 4] }) ]);
        var result = ParseTileLayers(json, false);

        // first row: x=0,y=0 and x=1,y=0
        expect(result[0].data[0][0].x).toBe(0);
        expect(result[0].data[0][0].y).toBe(0);
        expect(result[0].data[0][1].x).toBe(1);
        expect(result[0].data[0][1].y).toBe(0);
        // second row: x=0,y=1 and x=1,y=1
        expect(result[0].data[1][0].x).toBe(0);
        expect(result[0].data[1][0].y).toBe(1);
    });

    it('should apply flipX=true on a horizontally flipped tile', function ()
    {
        // FLIPPED_HORIZONTAL = 0x80000000, no other flags => rotation=0, flipped=true
        var gid = 0x80000000 | 1;
        var json = makeFiniteJSON([ makeTileLayer({ width: 1, height: 1, data: [gid] }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].data[0][0].flipX).toBe(true);
        expect(result[0].data[0][0].rotation).toBe(0);
    });

    it('should apply rotation PI on a tile flipped both horizontally and vertically', function ()
    {
        // H+V => rotation=Math.PI, flipped=false
        var gid = (0x80000000 | 0x40000000) | 1;
        var json = makeFiniteJSON([ makeTileLayer({ width: 1, height: 1, data: [gid] }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].data[0][0].rotation).toBeCloseTo(Math.PI);
        expect(result[0].data[0][0].flipX).toBe(false);
    });

    // -------------------------------------------------------------------------
    // Compressed layers
    // -------------------------------------------------------------------------

    it('should skip compressed layers and emit a console warning', function ()
    {
        var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});
        var compressedLayer = makeTileLayer({ name: 'compressed', compression: 'zlib' });
        delete compressedLayer.data;
        var json = makeFiniteJSON([ compressedLayer ]);
        var result = ParseTileLayers(json, false);

        expect(result.length).toBe(0);
        expect(warnSpy).toHaveBeenCalled();

        warnSpy.mockRestore();
    });

    it('should include the layer name in the compression warning message', function ()
    {
        var warnings = [];
        var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function (msg)
        {
            warnings.push(msg);
        });

        var compressedLayer = makeTileLayer({ name: 'secretLayer', compression: 'gzip' });
        delete compressedLayer.data;
        var json = makeFiniteJSON([ compressedLayer ]);
        ParseTileLayers(json, false);

        expect(warnings[0]).toContain('secretLayer');

        warnSpy.mockRestore();
    });

    // -------------------------------------------------------------------------
    // Base64 encoded layers
    // -------------------------------------------------------------------------

    it('should decode a base64-encoded layer and remove the encoding property', function ()
    {
        // Set up window.atob for the node environment
        if (typeof global.window === 'undefined')
        {
            global.window = { atob: function (str) { return Buffer.from(str, 'base64').toString('binary'); } };
        }

        // [1, 2, 3, 4] encoded as little-endian uint32 bytes in base64
        // bytes: 01 00 00 00 02 00 00 00 03 00 00 00 04 00 00 00
        var base64Data = Buffer.from(new Uint8Array([1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0])).toString('base64');

        var layer = makeTileLayer({ encoding: 'base64', width: 2, height: 2 });
        delete layer.data;
        layer.data = base64Data;

        var json = makeFiniteJSON([ layer ]);
        var result = ParseTileLayers(json, false);

        expect(result.length).toBe(1);
        expect(result[0].data[0][0].index).toBe(1);
        expect(layer.encoding).toBeUndefined();

        delete global.window;
    });

    it('should decode base64-encoded chunks for infinite maps', function ()
    {
        if (typeof global.window === 'undefined')
        {
            global.window = { atob: function (str) { return Buffer.from(str, 'base64').toString('binary'); } };
        }

        var base64Data = Buffer.from(new Uint8Array([1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0])).toString('base64');

        var layer = makeInfiniteTileLayer({ encoding: 'base64' });
        layer.chunks[0].data = base64Data;

        var json = makeInfiniteJSON([ layer ]);
        var result = ParseTileLayers(json, false);

        expect(result.length).toBe(1);
        expect(result[0].data[0][0].index).toBe(1);
        expect(layer.encoding).toBeUndefined();

        delete global.window;
    });

    // -------------------------------------------------------------------------
    // Group layers
    // -------------------------------------------------------------------------

    it('should process tilelayers nested inside a group layer', function ()
    {
        var childLayer = makeTileLayer({ name: 'child', id: 10 });
        var groupLayer = {
            type: 'group',
            name: 'myGroup',
            id: 99,
            x: 0,
            y: 0,
            opacity: 1,
            visible: true,
            layers: [ childLayer ]
        };
        var json = makeFiniteJSON([ groupLayer ]);
        var result = ParseTileLayers(json, false);

        expect(result.length).toBe(1);
    });

    it('should prefix child layer names with the group name and a slash', function ()
    {
        var childLayer = makeTileLayer({ name: 'child', id: 10 });
        var groupLayer = {
            type: 'group',
            name: 'myGroup',
            id: 99,
            x: 0,
            y: 0,
            opacity: 1,
            visible: true,
            layers: [ childLayer ]
        };
        var json = makeFiniteJSON([ groupLayer ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].name).toBe('myGroup/child');
    });

    it('should multiply child layer opacity by the group opacity', function ()
    {
        var childLayer = makeTileLayer({ name: 'child', id: 10, opacity: 0.5 });
        var groupLayer = {
            type: 'group',
            name: 'g',
            id: 99,
            x: 0,
            y: 0,
            opacity: 0.4,
            visible: true,
            layers: [ childLayer ]
        };
        var json = makeFiniteJSON([ groupLayer ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].alpha).toBeCloseTo(0.2);
    });

    it('should hide child layer when group is not visible', function ()
    {
        var childLayer = makeTileLayer({ name: 'child', id: 10, visible: true });
        var groupLayer = {
            type: 'group',
            name: 'g',
            id: 99,
            x: 0,
            y: 0,
            opacity: 1,
            visible: false,
            layers: [ childLayer ]
        };
        var json = makeFiniteJSON([ groupLayer ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].visible).toBe(false);
    });

    it('should not include group layers themselves in the output', function ()
    {
        var childLayer = makeTileLayer({ name: 'child', id: 10 });
        var groupLayer = {
            type: 'group',
            name: 'g',
            id: 99,
            x: 0,
            y: 0,
            opacity: 1,
            visible: true,
            layers: [ childLayer ]
        };
        // top-level also has a direct tile layer
        var topLayer = makeTileLayer({ name: 'top', id: 1 });
        var json = makeFiniteJSON([ groupLayer, topLayer ]);
        var result = ParseTileLayers(json, false);

        expect(result.length).toBe(2);
        var names = result.map(function (l) { return l.name; });
        expect(names).toContain('g/child');
        expect(names).toContain('top');
    });

    it('should process layers in a doubly nested group', function ()
    {
        var innerChild = makeTileLayer({ name: 'deep', id: 20 });
        var innerGroup = {
            type: 'group',
            name: 'inner',
            id: 10,
            x: 0,
            y: 0,
            opacity: 1,
            visible: true,
            layers: [ innerChild ]
        };
        var outerGroup = {
            type: 'group',
            name: 'outer',
            id: 9,
            x: 0,
            y: 0,
            opacity: 1,
            visible: true,
            layers: [ innerGroup ]
        };
        var json = makeFiniteJSON([ outerGroup ]);
        var result = ParseTileLayers(json, false);

        expect(result.length).toBe(1);
        expect(result[0].name).toBe('outer/inner/deep');
    });

    // -------------------------------------------------------------------------
    // Non-tilelayer types are ignored at the top level
    // -------------------------------------------------------------------------

    it('should skip objectgroup layers', function ()
    {
        var json = makeFiniteJSON([
            { type: 'objectgroup', name: 'objects', id: 1, objects: [] },
            makeTileLayer({ name: 'tiles', id: 2 })
        ]);
        var result = ParseTileLayers(json, false);

        expect(result.length).toBe(1);
        expect(result[0].name).toBe('tiles');
    });

    // -------------------------------------------------------------------------
    // Infinite maps
    // -------------------------------------------------------------------------

    it('should return a LayerData for an infinite tilelayer', function ()
    {
        var json = makeInfiniteJSON([ makeInfiniteTileLayer() ]);
        var result = ParseTileLayers(json, false);

        expect(result.length).toBe(1);
    });

    it('should set layer dimensions correctly for an infinite map', function ()
    {
        var json = makeInfiniteJSON([ makeInfiniteTileLayer({ width: 2, height: 2 }) ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].width).toBe(2);
        expect(result[0].height).toBe(2);
    });

    it('should populate tile data from chunks in an infinite map', function ()
    {
        var json = makeInfiniteJSON([ makeInfiniteTileLayer() ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].data[0][0]).not.toBeNull();
        expect(result[0].data[0][0].index).toBe(1);
        expect(result[0].data[0][1].index).toBe(2);
        expect(result[0].data[1][0].index).toBe(3);
        expect(result[0].data[1][1].index).toBe(4);
    });

    it('should place null for empty gids in infinite map when insertNull is true', function ()
    {
        var layer = makeInfiniteTileLayer({
            chunks: [ { x: 0, y: 0, width: 2, height: 1, data: [0, 1] } ],
            width: 2,
            height: 1
        });
        var json = makeInfiniteJSON([ layer ]);
        var result = ParseTileLayers(json, true);

        expect(result[0].data[0][0]).toBeNull();
    });

    it('should use x/y offsets from layer startx/starty on infinite maps', function ()
    {
        // Chunk must be placed at (startx, starty) so tile offsets compute to 0,0 within the output array
        var layer = makeInfiniteTileLayer({
            startx: 2, starty: 1, x: 0, y: 0,
            chunks: [ { x: 2, y: 1, width: 2, height: 2, data: [1, 2, 3, 4] } ]
        });
        var json = makeInfiniteJSON([ layer ], { tilewidth: 32, tileheight: 32 });
        var result = ParseTileLayers(json, false);

        // x = curGroupState.x(0) + offsetx(0) + layerOffsetX(startx=2 + x=0) * tilewidth(32) = 64
        expect(result[0].x).toBe(64);
    });

    // -------------------------------------------------------------------------
    // Hexagonal maps
    // -------------------------------------------------------------------------

    it('should set hexSideLength, staggerAxis, staggerIndex on hexagonal layers', function ()
    {
        var json = makeFiniteJSON(
            [ makeTileLayer() ],
            {
                orientation: 'hexagonal',
                hexsidelength: 18,
                staggeraxis: 'y',
                staggerindex: 'odd'
            }
        );
        var result = ParseTileLayers(json, false);

        expect(result[0].hexSideLength).toBe(18);
        expect(result[0].staggerAxis).toBe('y');
        expect(result[0].staggerIndex).toBe('odd');
    });

    it('should calculate widthInPixels and heightInPixels for hexagonal staggerAxis y', function ()
    {
        // tileWidth=32, tileHeight=32, hexSideLength=16, width=4, height=3
        // triangleHeight = (32 - 16) / 2 = 8
        // widthInPixels  = 32 * (4 + 0.5) = 144
        // heightInPixels = 3 * (16 + 8) + 8 = 80
        var json = makeFiniteJSON(
            [ makeTileLayer({ width: 4, height: 3, data: new Array(12).fill(1) }) ],
            {
                orientation: 'hexagonal',
                tilewidth: 32,
                tileheight: 32,
                hexsidelength: 16,
                staggeraxis: 'y',
                staggerindex: 'odd'
            }
        );
        var result = ParseTileLayers(json, false);

        expect(result[0].widthInPixels).toBeCloseTo(144);
        expect(result[0].heightInPixels).toBeCloseTo(80);
    });

    it('should calculate widthInPixels and heightInPixels for hexagonal staggerAxis x', function ()
    {
        // tileWidth=32, tileHeight=32, hexSideLength=16, width=4, height=3
        // triangleWidth  = (32 - 16) / 2 = 8
        // widthInPixels  = 4 * (16 + 8) + 8 = 104
        // heightInPixels = 32 * (3 + 0.5) = 112
        var json = makeFiniteJSON(
            [ makeTileLayer({ width: 4, height: 3, data: new Array(12).fill(1) }) ],
            {
                orientation: 'hexagonal',
                tilewidth: 32,
                tileheight: 32,
                hexsidelength: 16,
                staggeraxis: 'x',
                staggerindex: 'even'
            }
        );
        var result = ParseTileLayers(json, false);

        expect(result[0].widthInPixels).toBeCloseTo(104);
        expect(result[0].heightInPixels).toBeCloseTo(112);
    });

    it('should not set hexSideLength on orthogonal layers', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer() ]);
        var result = ParseTileLayers(json, false);

        expect(result[0].hexSideLength).toBe(0);
    });

    // -------------------------------------------------------------------------
    // Orientation
    // -------------------------------------------------------------------------

    it('should set ORTHOGONAL orientation constant for orthogonal maps', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer() ], { orientation: 'orthogonal' });
        var result = ParseTileLayers(json, false);

        expect(result[0].orientation).toBe(0); // CONST.ORTHOGONAL
    });

    it('should set ISOMETRIC orientation constant for isometric maps', function ()
    {
        var json = makeFiniteJSON([ makeTileLayer() ], { orientation: 'isometric' });
        var result = ParseTileLayers(json, false);

        expect(result[0].orientation).toBe(1); // CONST.ISOMETRIC
    });

    it('should set HEXAGONAL orientation constant for hexagonal maps', function ()
    {
        var json = makeFiniteJSON(
            [ makeTileLayer() ],
            {
                orientation: 'hexagonal',
                hexsidelength: 16,
                staggeraxis: 'y',
                staggerindex: 'odd'
            }
        );
        var result = ParseTileLayers(json, false);

        expect(result[0].orientation).toBe(3); // CONST.HEXAGONAL
    });
});
