var ParseImageLayers = require('../../../../src/tilemaps/parsers/tiled/ParseImageLayers');

describe('Phaser.Tilemaps.Parsers.Tiled.ParseImageLayers', function ()
{
    function makeJson (layers)
    {
        return {
            tilewidth: 32,
            tileheight: 32,
            layers: layers
        };
    }

    function makeImageLayer (overrides)
    {
        return Object.assign({
            type: 'imagelayer',
            name: 'bg',
            image: 'background.png',
            x: 0,
            y: 0,
            opacity: 1,
            visible: true
        }, overrides);
    }

    it('should return an empty array when there are no layers', function ()
    {
        var result = ParseImageLayers(makeJson([]));
        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
    });

    it('should return an empty array when no layers are image layers', function ()
    {
        var json = makeJson([
            { type: 'tilelayer', name: 'ground', x: 0, y: 0, opacity: 1, visible: true }
        ]);
        var result = ParseImageLayers(json);
        expect(result.length).toBe(0);
    });

    it('should parse a single image layer', function ()
    {
        var json = makeJson([ makeImageLayer() ]);
        var result = ParseImageLayers(json);
        expect(result.length).toBe(1);
    });

    it('should set the name from the layer name', function ()
    {
        var json = makeJson([ makeImageLayer({ name: 'sky' }) ]);
        var result = ParseImageLayers(json);
        expect(result[0].name).toBe('sky');
    });

    it('should set the image from the layer image property', function ()
    {
        var json = makeJson([ makeImageLayer({ image: 'sky.png' }) ]);
        var result = ParseImageLayers(json);
        expect(result[0].image).toBe('sky.png');
    });

    it('should set x and y from the layer x and y', function ()
    {
        var json = makeJson([ makeImageLayer({ x: 10, y: 20 }) ]);
        var result = ParseImageLayers(json);
        expect(result[0].x).toBe(10);
        expect(result[0].y).toBe(20);
    });

    it('should include offsetx and offsety in the x/y calculation', function ()
    {
        var json = makeJson([ makeImageLayer({ x: 10, y: 20, offsetx: 5, offsety: 3 }) ]);
        var result = ParseImageLayers(json);
        expect(result[0].x).toBe(15);
        expect(result[0].y).toBe(23);
    });

    it('should include startx and starty in the x/y calculation', function ()
    {
        var json = makeJson([ makeImageLayer({ x: 0, y: 0, startx: 4, starty: 2 }) ]);
        var result = ParseImageLayers(json);
        expect(result[0].x).toBe(4);
        expect(result[0].y).toBe(2);
    });

    it('should combine offsetx, startx and layer x for final x', function ()
    {
        var json = makeJson([ makeImageLayer({ x: 10, offsetx: 5, startx: 3, y: 0 }) ]);
        var result = ParseImageLayers(json);
        expect(result[0].x).toBe(18);
    });

    it('should default offsetx/offsety/startx/starty to 0 when absent', function ()
    {
        var json = makeJson([ makeImageLayer({ x: 7, y: 9 }) ]);
        var result = ParseImageLayers(json);
        expect(result[0].x).toBe(7);
        expect(result[0].y).toBe(9);
    });

    it('should set alpha from layer opacity', function ()
    {
        var json = makeJson([ makeImageLayer({ opacity: 0.5 }) ]);
        var result = ParseImageLayers(json);
        expect(result[0].alpha).toBeCloseTo(0.5);
    });

    it('should set visible from layer visible flag', function ()
    {
        var json = makeJson([ makeImageLayer({ visible: false }) ]);
        var result = ParseImageLayers(json);
        expect(result[0].visible).toBe(false);
    });

    it('should set visible to true when layer is visible', function ()
    {
        var json = makeJson([ makeImageLayer({ visible: true }) ]);
        var result = ParseImageLayers(json);
        expect(result[0].visible).toBe(true);
    });

    it('should set properties from layer properties field', function ()
    {
        var props = [ { name: 'speed', value: 42 } ];
        var json = makeJson([ makeImageLayer({ properties: props }) ]);
        var result = ParseImageLayers(json);
        expect(result[0].properties).toBe(props);
    });

    it('should default properties to empty object when absent', function ()
    {
        var json = makeJson([ makeImageLayer() ]);
        var result = ParseImageLayers(json);
        expect(result[0].properties).toBeDefined();
    });

    it('should parse multiple image layers', function ()
    {
        var json = makeJson([
            makeImageLayer({ name: 'sky', image: 'sky.png' }),
            makeImageLayer({ name: 'clouds', image: 'clouds.png' })
        ]);
        var result = ParseImageLayers(json);
        expect(result.length).toBe(2);
        expect(result[0].name).toBe('sky');
        expect(result[1].name).toBe('clouds');
    });

    it('should skip non-image layers mixed with image layers', function ()
    {
        var json = makeJson([
            { type: 'tilelayer', name: 'ground', x: 0, y: 0, opacity: 1, visible: true },
            makeImageLayer({ name: 'sky' }),
            { type: 'objectgroup', name: 'objects', x: 0, y: 0, opacity: 1, visible: true }
        ]);
        var result = ParseImageLayers(json);
        expect(result.length).toBe(1);
        expect(result[0].name).toBe('sky');
    });

    it('should parse image layers nested inside a group layer', function ()
    {
        var json = makeJson([
            {
                type: 'group',
                name: 'background',
                x: 0,
                y: 0,
                opacity: 1,
                visible: true,
                layers: [
                    makeImageLayer({ name: 'sky', image: 'sky.png' })
                ]
            }
        ]);
        var result = ParseImageLayers(json);
        expect(result.length).toBe(1);
    });

    it('should prefix image layer name with group name and slash', function ()
    {
        var json = makeJson([
            {
                type: 'group',
                name: 'bg',
                x: 0,
                y: 0,
                opacity: 1,
                visible: true,
                layers: [
                    makeImageLayer({ name: 'sky' })
                ]
            }
        ]);
        var result = ParseImageLayers(json);
        expect(result[0].name).toBe('bg/sky');
    });

    it('should multiply group opacity with layer opacity', function ()
    {
        var json = makeJson([
            {
                type: 'group',
                name: 'bg',
                x: 0,
                y: 0,
                opacity: 0.5,
                visible: true,
                layers: [
                    makeImageLayer({ name: 'sky', opacity: 0.8 })
                ]
            }
        ]);
        var result = ParseImageLayers(json);
        expect(result[0].alpha).toBeCloseTo(0.4);
    });

    it('should set visible to false when group is invisible regardless of layer visibility', function ()
    {
        var json = makeJson([
            {
                type: 'group',
                name: 'bg',
                x: 0,
                y: 0,
                opacity: 1,
                visible: false,
                layers: [
                    makeImageLayer({ name: 'sky', visible: true })
                ]
            }
        ]);
        var result = ParseImageLayers(json);
        expect(result[0].visible).toBe(false);
    });

    it('should set visible to false when layer is invisible even if group is visible', function ()
    {
        var json = makeJson([
            {
                type: 'group',
                name: 'bg',
                x: 0,
                y: 0,
                opacity: 1,
                visible: true,
                layers: [
                    makeImageLayer({ name: 'sky', visible: false })
                ]
            }
        ]);
        var result = ParseImageLayers(json);
        expect(result[0].visible).toBe(false);
    });

    it('should add group x/y offset to layer position', function ()
    {
        var json = makeJson([
            {
                type: 'group',
                name: 'bg',
                x: 100,
                y: 50,
                opacity: 1,
                visible: true,
                layers: [
                    makeImageLayer({ name: 'sky', x: 10, y: 5 })
                ]
            }
        ]);
        var result = ParseImageLayers(json);
        expect(result[0].x).toBe(110);
        expect(result[0].y).toBe(55);
    });

    it('should handle deeply nested group layers', function ()
    {
        var json = makeJson([
            {
                type: 'group',
                name: 'outer',
                x: 0,
                y: 0,
                opacity: 1,
                visible: true,
                layers: [
                    {
                        type: 'group',
                        name: 'inner',
                        x: 0,
                        y: 0,
                        opacity: 1,
                        visible: true,
                        layers: [
                            makeImageLayer({ name: 'sky' })
                        ]
                    }
                ]
            }
        ]);
        var result = ParseImageLayers(json);
        expect(result.length).toBe(1);
        expect(result[0].name).toBe('outer/inner/sky');
    });

    it('should accumulate names across multiple nesting levels', function ()
    {
        var json = makeJson([
            {
                type: 'group',
                name: 'a',
                x: 0,
                y: 0,
                opacity: 1,
                visible: true,
                layers: [
                    {
                        type: 'group',
                        name: 'b',
                        x: 0,
                        y: 0,
                        opacity: 1,
                        visible: true,
                        layers: [
                            makeImageLayer({ name: 'c' })
                        ]
                    }
                ]
            }
        ]);
        var result = ParseImageLayers(json);
        expect(result[0].name).toBe('a/b/c');
    });

    it('should multiply opacity across multiple nesting levels', function ()
    {
        var json = makeJson([
            {
                type: 'group',
                name: 'outer',
                x: 0,
                y: 0,
                opacity: 0.5,
                visible: true,
                layers: [
                    {
                        type: 'group',
                        name: 'inner',
                        x: 0,
                        y: 0,
                        opacity: 0.5,
                        visible: true,
                        layers: [
                            makeImageLayer({ name: 'sky', opacity: 1 })
                        ]
                    }
                ]
            }
        ]);
        var result = ParseImageLayers(json);
        expect(result[0].alpha).toBeCloseTo(0.25);
    });

    it('should return image layers from both top-level and inside groups', function ()
    {
        var json = makeJson([
            makeImageLayer({ name: 'top' }),
            {
                type: 'group',
                name: 'grp',
                x: 0,
                y: 0,
                opacity: 1,
                visible: true,
                layers: [
                    makeImageLayer({ name: 'nested' })
                ]
            }
        ]);
        var result = ParseImageLayers(json);
        expect(result.length).toBe(2);
        expect(result[0].name).toBe('top');
        expect(result[1].name).toBe('grp/nested');
    });

    it('should handle a group with no image layers', function ()
    {
        var json = makeJson([
            {
                type: 'group',
                name: 'grp',
                x: 0,
                y: 0,
                opacity: 1,
                visible: true,
                layers: [
                    { type: 'tilelayer', name: 'tiles', x: 0, y: 0, opacity: 1, visible: true }
                ]
            }
        ]);
        var result = ParseImageLayers(json);
        expect(result.length).toBe(0);
    });
});
