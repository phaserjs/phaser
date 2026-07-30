var PCT = require('../../../src/textures/parsers/PCT');

describe('Phaser.Textures.Parsers.PCT', function ()
{
    var texture;
    var addedFrames;
    var warnSpy;

    function makeNewFrame ()
    {
        return {
            rotated: false,
            setTrim: vi.fn(),
            updateUVsInverted: vi.fn()
        };
    }

    function makeTexture (sources)
    {
        if (sources === undefined)
        {
            sources = [ { width: 2048, height: 512 } ];
        }

        addedFrames = [];

        return {
            source: sources,
            customData: {},
            add: vi.fn(function (name, sourceIndex, x, y, w, h)
            {
                var f = makeNewFrame();

                addedFrames.push({
                    name: name,
                    sourceIndex: sourceIndex,
                    x: x, y: y, w: w, h: h,
                    frame: f
                });

                return f;
            })
        };
    }

    function makeDecoded (overrides)
    {
        var base = {
            pages: [
                { filename: 'atlas_0.png', format: 'RGBA8888', width: 2048, height: 512, padding: 2 }
            ],
            folders: [],
            frames: {}
        };

        if (overrides)
        {
            for (var k in overrides)
            {
                base[k] = overrides[k];
            }
        }

        return base;
    }

    beforeEach(function ()
    {
        texture = makeTexture();
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});
    });

    afterEach(function ()
    {
        warnSpy.mockRestore();
    });

    // -------------------------------------------------------------------------
    // Invalid input guards
    // -------------------------------------------------------------------------

    describe('invalid input', function ()
    {
        it('should return undefined when decoded is null', function ()
        {
            expect(PCT(texture, null)).toBeUndefined();
        });

        it('should return undefined when decoded is missing frames', function ()
        {
            expect(PCT(texture, { pages: [] })).toBeUndefined();
        });

        it('should return undefined when decoded is missing pages', function ()
        {
            expect(PCT(texture, { frames: {} })).toBeUndefined();
        });

        it('should warn on invalid input', function ()
        {
            PCT(texture, null);

            expect(warnSpy).toHaveBeenCalled();
        });

        it('should not call texture.add on invalid input', function ()
        {
            PCT(texture, null);

            expect(texture.add).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // __BASE frame
    // -------------------------------------------------------------------------

    describe('__BASE frame', function ()
    {
        it('should add a __BASE frame sized to source 0', function ()
        {
            texture = makeTexture([ { width: 512, height: 256 } ]);

            PCT(texture, makeDecoded());

            expect(texture.add).toHaveBeenCalledWith('__BASE', 0, 0, 0, 512, 256);
        });

        it('should only add one __BASE frame regardless of source count', function ()
        {
            texture = makeTexture([
                { width: 512, height: 256 },
                { width: 1024, height: 512 }
            ]);

            PCT(texture, makeDecoded());

            var baseCalls = texture.add.mock.calls.filter(function (c) { return c[0] === '__BASE'; });
            expect(baseCalls.length).toBe(1);
        });
    });

    // -------------------------------------------------------------------------
    // Frame creation
    // -------------------------------------------------------------------------

    describe('frame creation', function ()
    {
        it('should return the texture on success', function ()
        {
            var result = PCT(texture, makeDecoded());

            expect(result).toBe(texture);
        });

        it('should add each frame with the correct x/y/w/h', function ()
        {
            var decoded = makeDecoded({
                frames: {
                    a: { key: 'a', page: 0, x: 10, y: 20, w: 30, h: 40, trimmed: false, rotated: false, sourceW: 30, sourceH: 40, trimX: 0, trimY: 0 },
                    b: { key: 'b', page: 0, x: 50, y: 60, w: 70, h: 80, trimmed: false, rotated: false, sourceW: 70, sourceH: 80, trimX: 0, trimY: 0 }
                }
            });

            PCT(texture, decoded);

            expect(texture.add).toHaveBeenCalledWith('a', 0, 10, 20, 30, 40);
            expect(texture.add).toHaveBeenCalledWith('b', 0, 50, 60, 70, 80);
        });

        it('should pass frame.key as the name to texture.add, not the object key', function ()
        {
            var decoded = makeDecoded({
                frames: {
                    'warrior/idle_01.png': { key: 'warrior/idle_01.png', page: 0, x: 0, y: 0, w: 10, h: 10, trimmed: false, rotated: false, sourceW: 10, sourceH: 10, trimX: 0, trimY: 0 }
                }
            });

            PCT(texture, decoded);

            expect(texture.add).toHaveBeenCalledWith('warrior/idle_01.png', 0, 0, 0, 10, 10);
        });

        it('should fall back to the object key when frame.key is missing', function ()
        {
            var decoded = makeDecoded({
                frames: {
                    'fallback': { page: 0, x: 1, y: 2, w: 3, h: 4, trimmed: false, rotated: false, sourceW: 3, sourceH: 4, trimX: 0, trimY: 0 }
                }
            });

            PCT(texture, decoded);

            //  Expected: the second call after __BASE should use 'fallback' as name
            var nonBaseCall = texture.add.mock.calls.find(function (c) { return c[0] !== '__BASE'; });
            expect(nonBaseCall[0]).toBe('fallback');
        });

        it('should skip frames whose page index is outside texture.source range', function ()
        {
            texture = makeTexture([ { width: 512, height: 512 } ]);

            var decoded = makeDecoded({
                frames: {
                    good: { key: 'good', page: 0, x: 0, y: 0, w: 10, h: 10, trimmed: false, rotated: false, sourceW: 10, sourceH: 10, trimX: 0, trimY: 0 },
                    bad:  { key: 'bad',  page: 3, x: 0, y: 0, w: 10, h: 10, trimmed: false, rotated: false, sourceW: 10, sourceH: 10, trimX: 0, trimY: 0 }
                }
            });

            PCT(texture, decoded);

            var names = texture.add.mock.calls.map(function (c) { return c[0]; });
            expect(names).toContain('good');
            expect(names).not.toContain('bad');
            expect(warnSpy).toHaveBeenCalled();
        });

        it('should route frames to the matching TextureSource via frame.page', function ()
        {
            texture = makeTexture([
                { width: 512, height: 512 },
                { width: 256, height: 256 }
            ]);

            var decoded = {
                pages: [
                    { filename: 'a.png', format: 'RGBA8888', width: 512, height: 512, padding: 0 },
                    { filename: 'b.png', format: 'RGBA8888', width: 256, height: 256, padding: 0 }
                ],
                folders: [],
                frames: {
                    onPage0: { key: 'onPage0', page: 0, x: 0, y: 0, w: 10, h: 10, trimmed: false, rotated: false, sourceW: 10, sourceH: 10, trimX: 0, trimY: 0 },
                    onPage1: { key: 'onPage1', page: 1, x: 0, y: 0, w: 20, h: 20, trimmed: false, rotated: false, sourceW: 20, sourceH: 20, trimX: 0, trimY: 0 }
                }
            };

            PCT(texture, decoded);

            expect(texture.add).toHaveBeenCalledWith('onPage0', 0, 0, 0, 10, 10);
            expect(texture.add).toHaveBeenCalledWith('onPage1', 1, 0, 0, 20, 20);
        });

        it('should skip frames where texture.add returns null (duplicate key)', function ()
        {
            texture.add = vi.fn(function (name)
            {
                if (name === '__BASE') { return {}; }
                return null;
            });

            var decoded = makeDecoded({
                frames: {
                    dup: { key: 'dup', page: 0, x: 0, y: 0, w: 10, h: 10, trimmed: false, rotated: false, sourceW: 10, sourceH: 10, trimX: 0, trimY: 0 }
                }
            });

            expect(function ()
            {
                PCT(texture, decoded);
            }).not.toThrow();

            expect(warnSpy).toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // Trim handling
    // -------------------------------------------------------------------------

    describe('trim handling', function ()
    {
        it('should call setTrim on trimmed frames with the correct arguments', function ()
        {
            var decoded = makeDecoded({
                frames: {
                    f: {
                        key: 'f',
                        page: 0,
                        x: 10, y: 20, w: 30, h: 40,
                        trimmed: true, rotated: false,
                        sourceW: 50, sourceH: 60, trimX: 2, trimY: 3
                    }
                }
            });

            PCT(texture, decoded);

            var addedFrame = addedFrames[addedFrames.length - 1].frame;
            //  Frame.setTrim signature is:
            //    (actualWidth, actualHeight, destX, destY, destWidth, destHeight)
            //  => (sourceW, sourceH, trimX, trimY, w, h)
            expect(addedFrame.setTrim).toHaveBeenCalledWith(50, 60, 2, 3, 30, 40);
        });

        it('should not call setTrim on untrimmed frames', function ()
        {
            var decoded = makeDecoded({
                frames: {
                    f: { key: 'f', page: 0, x: 0, y: 0, w: 10, h: 10, trimmed: false, rotated: false, sourceW: 10, sourceH: 10, trimX: 0, trimY: 0 }
                }
            });

            PCT(texture, decoded);

            var addedFrame = addedFrames[addedFrames.length - 1].frame;
            expect(addedFrame.setTrim).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // Rotation handling
    // -------------------------------------------------------------------------

    describe('rotation handling', function ()
    {
        it('should set rotated=true and call updateUVsInverted on rotated frames', function ()
        {
            var decoded = makeDecoded({
                frames: {
                    r: { key: 'r', page: 0, x: 0, y: 0, w: 10, h: 10, trimmed: false, rotated: true, sourceW: 10, sourceH: 10, trimX: 0, trimY: 0 }
                }
            });

            PCT(texture, decoded);

            var addedFrame = addedFrames[addedFrames.length - 1].frame;
            expect(addedFrame.rotated).toBe(true);
            expect(addedFrame.updateUVsInverted).toHaveBeenCalled();
        });

        it('should not set rotated or call updateUVsInverted on non-rotated frames', function ()
        {
            var decoded = makeDecoded({
                frames: {
                    r: { key: 'r', page: 0, x: 0, y: 0, w: 10, h: 10, trimmed: false, rotated: false, sourceW: 10, sourceH: 10, trimX: 0, trimY: 0 }
                }
            });

            PCT(texture, decoded);

            var addedFrame = addedFrames[addedFrames.length - 1].frame;
            expect(addedFrame.rotated).toBe(false);
            expect(addedFrame.updateUVsInverted).not.toHaveBeenCalled();
        });
    });

    // -------------------------------------------------------------------------
    // customData copy
    // -------------------------------------------------------------------------

    describe('texture.customData', function ()
    {
        it('should attach pages and folders to texture.customData.pct', function ()
        {
            var decoded = makeDecoded({
                folders: [ 'warrior', 'knight' ]
            });

            PCT(texture, decoded);

            expect(texture.customData.pct).toBeDefined();
            expect(texture.customData.pct.pages).toBe(decoded.pages);
            expect(texture.customData.pct.folders).toEqual([ 'warrior', 'knight' ]);
        });

        it('should not populate pct metadata when decoded is invalid', function ()
        {
            PCT(texture, null);

            expect(texture.customData.pct).toBeUndefined();
        });
    });
});
