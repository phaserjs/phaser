var NineSlice = require('../../../src/gameobjects/nineslice/NineSlice');
var Frame = require('../../../src/textures/Frame');

function createNineSlice (is3Slice)
{
    var frames = {};
    var texture = {
        key: 'atlas',
        source: [ { width: 256, height: 256 } ],
        get: function (name) { return frames[name]; }
    };

    frames.first = new Frame(texture, 'first', 0, 0, 0, 64, 32);
    frames.second = new Frame(texture, 'second', 0, 128, 64, 64, 64);

    var textures = {
        get: function () { return texture; },
        getFrame: function (key, name) { return frames[name]; }
    };
    var scene = {
        textures: textures,
        sys: {
            textures: textures,
            queueDepthSort: function () {}
        }
    };

    return new NineSlice(scene, 0, 0, 'atlas', 'first', 128, 96, 8, 8, is3Slice ? 0 : 8, is3Slice ? 0 : 8);
}

describe('NineSlice', function ()
{
    [ true, false ].forEach(function (is3Slice)
    {
        describe(is3Slice ? '3-slice setFrame' : '9-slice setFrame', function ()
        {
            [ true, false ].forEach(function (updateOrigin)
            {
                it('should refresh UVs without resizing when updateOrigin is ' + updateOrigin, function ()
                {
                    var slice = createNineSlice(is3Slice);
                    var width = slice.width;
                    var height = slice.height;
                    var positions = slice.vertices.map(function (vertex)
                    {
                        return [ vertex.vx, vertex.vy ];
                    });

                    expect(slice.vertices[0].u).toBe(0);
                    expect(slice.vertices[0].v).toBe(1);

                    var result = slice.setFrame('second', false, updateOrigin);

                    expect(result).toBe(slice);
                    expect(slice.frame.name).toBe('second');
                    expect(slice.vertices[0].u).toBe(0.5);
                    expect(slice.vertices[0].v).toBe(0.75);
                    expect(slice.vertices[2].u).toBe(0.53125);
                    expect(slice.width).toBe(width);
                    expect(slice.height).toBe(height);
                    expect(slice.vertices.map(function (vertex)
                    {
                        return [ vertex.vx, vertex.vy ];
                    })).toEqual(positions);
                });
            });

            it('should refresh UVs when passed a Frame instance without resizing', function ()
            {
                var slice = createNineSlice(is3Slice);
                var frame = slice.texture.get('second');
                var height = slice.height;

                slice.setFrame(frame, false, false);

                expect(slice.frame).toBe(frame);
                expect(slice.vertices[0].u).toBe(0.5);
                expect(slice.vertices[0].v).toBe(0.75);
                expect(slice.height).toBe(height);
            });

            it('should preserve the default size update behavior', function ()
            {
                var slice = createNineSlice(is3Slice);

                slice.setFrame('second');

                expect(slice.vertices[0].u).toBe(0.5);
                expect(slice.vertices[0].v).toBe(0.75);
                expect(slice.width).toBe(128);
                expect(slice.height).toBe(is3Slice ? 64 : 96);
            });

            it('should refresh UVs through setTexture without changing size or origin', function ()
            {
                var slice = createNineSlice(is3Slice);
                var frame = slice.texture.get('second');
                frame.customPivot = true;
                frame.pivotX = 0.1;
                frame.pivotY = 0.2;
                slice.setOrigin(0.25, 0.75);

                var height = slice.height;
                var positions = slice.vertices.map(function (vertex)
                {
                    return [ vertex.vx, vertex.vy ];
                });

                slice.setTexture('atlas', 'second', false, false);

                expect(slice.vertices[0].u).toBe(0.5);
                expect(slice.vertices[0].v).toBe(0.75);
                expect(slice.width).toBe(128);
                expect(slice.height).toBe(height);
                expect(slice.originX).toBe(0.25);
                expect(slice.originY).toBe(0.75);
                expect(slice.vertices.map(function (vertex)
                {
                    return [ vertex.vx, vertex.vy ];
                })).toEqual(positions);
            });
        });
    });
});
