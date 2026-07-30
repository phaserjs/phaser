var JSONHash = require('../../../src/textures/parsers/JSONHash');

describe('Phaser.Textures.Parsers.JSONHash', function ()
{
    var texture;
    var mockFrame;

    function createMockFrame ()
    {
        return {
            rotated: false,
            customPivot: false,
            pivotX: 0,
            pivotY: 0,
            customData: null,
            setTrim: vi.fn(),
            updateUVsInverted: vi.fn(),
            setScale9: vi.fn()
        };
    }

    function createMockTexture ()
    {
        mockFrame = createMockFrame();

        var addCallCount = 0;

        return {
            source: [{ width: 512, height: 512 }],
            customData: {},
            add: vi.fn(function (key)
            {
                addCallCount++;
                if (key === '__BASE')
                {
                    return createMockFrame();
                }
                return mockFrame;
            })
        };
    }

    function createMinimalJson (frames)
    {
        return { frames: frames || {} };
    }

    function createFrameEntry (x, y, w, h)
    {
        return {
            frame: { x: x || 0, y: y || 0, w: w || 64, h: h || 64 }
        };
    }

    beforeEach(function ()
    {
        texture = createMockTexture();
    });

    // -------------------------------------------------------------------------
    // Malformed input
    // -------------------------------------------------------------------------

    it('should return undefined when json has no frames property', function ()
    {
        var result = JSONHash(texture, 0, {});

        expect(result).toBeUndefined();
    });

    it('should warn when json has no frames property', function ()
    {
        var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});

        JSONHash(texture, 0, {});

        expect(warnSpy).toHaveBeenCalledWith(
            "Invalid Texture Atlas JSON Hash given, missing 'frames' Object"
        );

        warnSpy.mockRestore();
    });

    it('should not add any frames when json has no frames property', function ()
    {
        JSONHash(texture, 0, {});

        expect(texture.add).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Return value
    // -------------------------------------------------------------------------

    it('should return the texture when json is valid', function ()
    {
        var result = JSONHash(texture, 0, createMinimalJson());

        expect(result).toBe(texture);
    });

    it('should return the texture when frames object is empty', function ()
    {
        var result = JSONHash(texture, 0, createMinimalJson({}));

        expect(result).toBe(texture);
    });

    // -------------------------------------------------------------------------
    // __BASE frame
    // -------------------------------------------------------------------------

    it('should add a __BASE frame using the source dimensions', function ()
    {
        texture.source[0].width = 1024;
        texture.source[0].height = 768;

        JSONHash(texture, 0, createMinimalJson());

        expect(texture.add).toHaveBeenCalledWith('__BASE', 0, 0, 0, 1024, 768);
    });

    it('should use the correct sourceIndex when adding __BASE', function ()
    {
        texture.source[2] = { width: 256, height: 256 };

        JSONHash(texture, 2, createMinimalJson());

        expect(texture.add).toHaveBeenCalledWith('__BASE', 2, 0, 0, 256, 256);
    });

    // -------------------------------------------------------------------------
    // Frame addition
    // -------------------------------------------------------------------------

    it('should add each frame from the frames hash', function ()
    {
        var json = createMinimalJson({
            'hero': createFrameEntry(0, 0, 64, 64),
            'enemy': createFrameEntry(64, 0, 32, 32)
        });

        JSONHash(texture, 0, json);

        expect(texture.add).toHaveBeenCalledWith('hero', 0, 0, 0, 64, 64);
        expect(texture.add).toHaveBeenCalledWith('enemy', 0, 64, 0, 32, 32);
    });

    it('should add frame with correct coordinates', function ()
    {
        var json = createMinimalJson({
            'sprite': createFrameEntry(128, 256, 48, 72)
        });

        JSONHash(texture, 0, json);

        expect(texture.add).toHaveBeenCalledWith('sprite', 0, 128, 256, 48, 72);
    });

    it('should warn and skip frame when texture.add returns falsy', function ()
    {
        var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});

        texture.add = vi.fn(function (key)
        {
            if (key === '__BASE') { return createMockFrame(); }
            return null;
        });

        var json = createMinimalJson({ 'duplicate': createFrameEntry(0, 0, 32, 32) });

        JSONHash(texture, 0, json);

        expect(warnSpy).toHaveBeenCalledWith(
            'Invalid atlas json, frame already exists: duplicate'
        );

        warnSpy.mockRestore();
    });

    // -------------------------------------------------------------------------
    // Trimmed frames
    // -------------------------------------------------------------------------

    it('should call setTrim when frame is trimmed', function ()
    {
        var json = createMinimalJson({
            'trimmed_sprite': {
                frame: { x: 0, y: 0, w: 50, h: 50 },
                trimmed: true,
                sourceSize: { w: 64, h: 64 },
                spriteSourceSize: { x: 7, y: 5, w: 50, h: 54 }
            }
        });

        JSONHash(texture, 0, json);

        expect(mockFrame.setTrim).toHaveBeenCalledWith(64, 64, 7, 5, 50, 54);
    });

    it('should not call setTrim when frame is not trimmed', function ()
    {
        var json = createMinimalJson({
            'sprite': createFrameEntry(0, 0, 64, 64)
        });

        JSONHash(texture, 0, json);

        expect(mockFrame.setTrim).not.toHaveBeenCalled();
    });

    it('should not call setTrim when trimmed is false', function ()
    {
        var json = createMinimalJson({
            'sprite': {
                frame: { x: 0, y: 0, w: 64, h: 64 },
                trimmed: false
            }
        });

        JSONHash(texture, 0, json);

        expect(mockFrame.setTrim).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Rotated frames
    // -------------------------------------------------------------------------

    it('should set rotated and call updateUVsInverted when frame is rotated', function ()
    {
        var json = createMinimalJson({
            'rotated_sprite': {
                frame: { x: 0, y: 0, w: 64, h: 32 },
                rotated: true
            }
        });

        JSONHash(texture, 0, json);

        expect(mockFrame.rotated).toBe(true);
        expect(mockFrame.updateUVsInverted).toHaveBeenCalled();
    });

    it('should not set rotated or call updateUVsInverted when frame is not rotated', function ()
    {
        var json = createMinimalJson({
            'sprite': createFrameEntry(0, 0, 64, 64)
        });

        JSONHash(texture, 0, json);

        expect(mockFrame.rotated).toBe(false);
        expect(mockFrame.updateUVsInverted).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Pivot / Anchor
    // -------------------------------------------------------------------------

    it('should set customPivot and pivot values from anchor property', function ()
    {
        var json = createMinimalJson({
            'anchored': {
                frame: { x: 0, y: 0, w: 64, h: 64 },
                anchor: { x: 0.5, y: 0.75 }
            }
        });

        JSONHash(texture, 0, json);

        expect(mockFrame.customPivot).toBe(true);
        expect(mockFrame.pivotX).toBe(0.5);
        expect(mockFrame.pivotY).toBe(0.75);
    });

    it('should set customPivot and pivot values from pivot property', function ()
    {
        var json = createMinimalJson({
            'pivoted': {
                frame: { x: 0, y: 0, w: 64, h: 64 },
                pivot: { x: 0.25, y: 1.0 }
            }
        });

        JSONHash(texture, 0, json);

        expect(mockFrame.customPivot).toBe(true);
        expect(mockFrame.pivotX).toBe(0.25);
        expect(mockFrame.pivotY).toBe(1.0);
    });

    it('should prefer anchor over pivot when both are defined', function ()
    {
        var json = createMinimalJson({
            'both': {
                frame: { x: 0, y: 0, w: 64, h: 64 },
                anchor: { x: 0.1, y: 0.2 },
                pivot: { x: 0.9, y: 0.8 }
            }
        });

        JSONHash(texture, 0, json);

        expect(mockFrame.pivotX).toBe(0.1);
        expect(mockFrame.pivotY).toBe(0.2);
    });

    it('should not set customPivot when neither anchor nor pivot is defined', function ()
    {
        var json = createMinimalJson({
            'sprite': createFrameEntry(0, 0, 64, 64)
        });

        JSONHash(texture, 0, json);

        expect(mockFrame.customPivot).toBe(false);
    });

    // -------------------------------------------------------------------------
    // Scale9 Borders
    // -------------------------------------------------------------------------

    it('should call setScale9 when scale9Borders is defined', function ()
    {
        var json = createMinimalJson({
            'nineslice': {
                frame: { x: 0, y: 0, w: 64, h: 64 },
                scale9Borders: { x: 10, y: 10, w: 44, h: 44 }
            }
        });

        JSONHash(texture, 0, json);

        expect(mockFrame.setScale9).toHaveBeenCalledWith(10, 10, 44, 44);
    });

    it('should not call setScale9 when scale9Borders is not defined', function ()
    {
        var json = createMinimalJson({
            'sprite': createFrameEntry(0, 0, 64, 64)
        });

        JSONHash(texture, 0, json);

        expect(mockFrame.setScale9).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // customData on frame
    // -------------------------------------------------------------------------

    it('should copy frame source data to frame.customData via Clone', function ()
    {
        var frameData = {
            frame: { x: 0, y: 0, w: 32, h: 32 },
            extra: 'test-value'
        };

        var json = createMinimalJson({ 'sprite': frameData });

        JSONHash(texture, 0, json);

        expect(mockFrame.customData).not.toBeNull();
        expect(mockFrame.customData.extra).toBe('test-value');
    });

    it('should create a separate customData object (not the same reference as the source)', function ()
    {
        var frameData = {
            frame: { x: 0, y: 0, w: 32, h: 32 },
            extra: 'test-value'
        };

        var json = createMinimalJson({ 'sprite': frameData });

        JSONHash(texture, 0, json);

        expect(mockFrame.customData).not.toBe(frameData);
        expect(mockFrame.customData.extra).toBe('test-value');
    });

    // -------------------------------------------------------------------------
    // texture.customData population
    // -------------------------------------------------------------------------

    it('should copy non-frames keys from json to texture.customData', function ()
    {
        var json = {
            frames: {},
            meta: { app: 'TexturePacker', version: '1.0', scale: 1 }
        };

        JSONHash(texture, 0, json);

        expect(texture.customData.meta).toBeDefined();
        expect(texture.customData.meta.app).toBe('TexturePacker');
    });

    it('should not copy frames key to texture.customData', function ()
    {
        var json = {
            frames: { 'sprite': createFrameEntry(0, 0, 32, 32) }
        };

        JSONHash(texture, 0, json);

        expect(texture.customData.frames).toBeUndefined();
    });

    it('should slice array values when copying to texture.customData', function ()
    {
        var tags = ['a', 'b', 'c'];
        var json = {
            frames: {},
            tags: tags
        };

        JSONHash(texture, 0, json);

        expect(texture.customData.tags).toEqual(['a', 'b', 'c']);
        expect(texture.customData.tags).not.toBe(tags);
    });

    it('should copy scalar values directly to texture.customData', function ()
    {
        var json = {
            frames: {},
            scale: 2,
            version: '1.0'
        };

        JSONHash(texture, 0, json);

        expect(texture.customData.scale).toBe(2);
        expect(texture.customData.version).toBe('1.0');
    });

    it('should copy multiple extra properties to texture.customData', function ()
    {
        var json = {
            frames: {},
            meta: { scale: 1 },
            animations: [{ name: 'run', frames: ['a', 'b'] }]
        };

        JSONHash(texture, 0, json);

        expect(texture.customData.meta).toBeDefined();
        expect(texture.customData.animations).toBeDefined();
        expect(texture.customData.animations.length).toBe(1);
    });

    // -------------------------------------------------------------------------
    // Multiple frames — integration-style
    // -------------------------------------------------------------------------

    it('should handle a typical atlas json with multiple frames', function ()
    {
        var frames = {};
        var names = ['hero', 'enemy', 'bullet', 'explosion'];

        for (var i = 0; i < names.length; i++)
        {
            frames[names[i]] = createFrameEntry(i * 64, 0, 64, 64);
        }

        var json = { frames: frames, meta: { image: 'atlas.png' } };

        var result = JSONHash(texture, 0, json);

        // __BASE + 4 frames = 5 calls
        expect(texture.add).toHaveBeenCalledTimes(5);
        expect(result).toBe(texture);
        expect(texture.customData.meta).toBeDefined();
    });
});
