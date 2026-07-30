var JSONArray = require('../../../src/textures/parsers/JSONArray');

describe('Phaser.Textures.Parsers.JSONArray', function ()
{
    var texture;
    var newFrame;

    function makeFrame (overrides)
    {
        var base = {
            filename: 'sprite.png',
            frame: { x: 0, y: 0, w: 32, h: 32 },
            trimmed: false,
            rotated: false
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

    function makeTexture ()
    {
        newFrame = {
            rotated: false,
            customPivot: false,
            pivotX: 0,
            pivotY: 0,
            customData: null,
            setTrim: vi.fn(),
            updateUVsInverted: vi.fn(),
            setScale9: vi.fn()
        };

        return {
            source: [{ width: 512, height: 512 }],
            customData: {},
            add: vi.fn(function (name)
            {
                if (name === '__BASE') { return {}; }
                return newFrame;
            })
        };
    }

    beforeEach(function ()
    {
        texture = makeTexture();
    });

    // -------------------------------------------------------------------------
    // Malformed JSON guard
    // -------------------------------------------------------------------------

    it('should return undefined when json has no frames or textures property', function ()
    {
        var result = JSONArray(texture, 0, {});

        expect(result).toBeUndefined();
    });

    it('should not call texture.add when json is malformed', function ()
    {
        JSONArray(texture, 0, {});

        expect(texture.add).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // __BASE frame
    // -------------------------------------------------------------------------

    it('should add a __BASE frame using source dimensions', function ()
    {
        texture.source[0].width = 256;
        texture.source[0].height = 128;

        JSONArray(texture, 0, { frames: [] });

        expect(texture.add).toHaveBeenCalledWith('__BASE', 0, 0, 0, 256, 128);
    });

    it('should use sourceIndex to select the correct source', function ()
    {
        texture.source = [
            { width: 64, height: 64 },
            { width: 128, height: 256 }
        ];

        JSONArray(texture, 1, { frames: [] });

        expect(texture.add).toHaveBeenCalledWith('__BASE', 1, 0, 0, 128, 256);
    });

    // -------------------------------------------------------------------------
    // Frame parsing — json.frames array
    // -------------------------------------------------------------------------

    it('should return the texture on success', function ()
    {
        var result = JSONArray(texture, 0, { frames: [] });

        expect(result).toBe(texture);
    });

    it('should add each frame from json.frames with correct coordinates', function ()
    {
        var frames = [
            makeFrame({ filename: 'a.png', frame: { x: 10, y: 20, w: 30, h: 40 } }),
            makeFrame({ filename: 'b.png', frame: { x: 50, y: 60, w: 70, h: 80 } })
        ];

        JSONArray(texture, 0, { frames: frames });

        expect(texture.add).toHaveBeenCalledWith('a.png', 0, 10, 20, 30, 40);
        expect(texture.add).toHaveBeenCalledWith('b.png', 0, 50, 60, 70, 80);
    });

    it('should store a clone of the frame data in newFrame.customData', function ()
    {
        var src = makeFrame({ filename: 'sprite.png', frame: { x: 0, y: 0, w: 16, h: 16 } });

        JSONArray(texture, 0, { frames: [ src ] });

        expect(newFrame.customData).toBeDefined();
        expect(newFrame.customData.filename).toBe('sprite.png');
        // Ensure it is a clone, not the same reference
        expect(newFrame.customData).not.toBe(src);
    });

    // -------------------------------------------------------------------------
    // Frame parsing — json.textures array (multi-atlas)
    // -------------------------------------------------------------------------

    it('should read frames from json.textures[sourceIndex].frames when textures is an array', function ()
    {
        texture.source = [
            { width: 512, height: 512 },
            { width: 256, height: 256 }
        ];

        var frames = [ makeFrame({ filename: 'multi.png', frame: { x: 5, y: 5, w: 20, h: 20 } }) ];

        var json = {
            textures: [
                { frames: [] },
                { frames: frames }
            ]
        };

        JSONArray(texture, 1, json);

        expect(texture.add).toHaveBeenCalledWith('multi.png', 1, 5, 5, 20, 20);
    });

    // -------------------------------------------------------------------------
    // Trimmed frames
    // -------------------------------------------------------------------------

    it('should call setTrim when frame is trimmed', function ()
    {
        var src = makeFrame({
            trimmed: true,
            sourceSize: { w: 64, h: 64 },
            spriteSourceSize: { x: 4, y: 8, w: 56, h: 48 }
        });

        JSONArray(texture, 0, { frames: [ src ] });

        expect(newFrame.setTrim).toHaveBeenCalledWith(64, 64, 4, 8, 56, 48);
    });

    it('should not call setTrim when frame is not trimmed', function ()
    {
        JSONArray(texture, 0, { frames: [ makeFrame() ] });

        expect(newFrame.setTrim).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Rotated frames
    // -------------------------------------------------------------------------

    it('should set rotated flag and call updateUVsInverted when frame is rotated', function ()
    {
        var src = makeFrame({ rotated: true });

        JSONArray(texture, 0, { frames: [ src ] });

        expect(newFrame.rotated).toBe(true);
        expect(newFrame.updateUVsInverted).toHaveBeenCalled();
    });

    it('should not call updateUVsInverted when frame is not rotated', function ()
    {
        JSONArray(texture, 0, { frames: [ makeFrame() ] });

        expect(newFrame.updateUVsInverted).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Pivot / anchor
    // -------------------------------------------------------------------------

    it('should set custom pivot from anchor property', function ()
    {
        var src = makeFrame({ anchor: { x: 0.5, y: 0.5 } });

        JSONArray(texture, 0, { frames: [ src ] });

        expect(newFrame.customPivot).toBe(true);
        expect(newFrame.pivotX).toBe(0.5);
        expect(newFrame.pivotY).toBe(0.5);
    });

    it('should set custom pivot from pivot property', function ()
    {
        var src = makeFrame({ pivot: { x: 0.25, y: 0.75 } });

        JSONArray(texture, 0, { frames: [ src ] });

        expect(newFrame.customPivot).toBe(true);
        expect(newFrame.pivotX).toBe(0.25);
        expect(newFrame.pivotY).toBe(0.75);
    });

    it('should prefer anchor over pivot when both are present', function ()
    {
        var src = makeFrame({
            anchor: { x: 0.1, y: 0.2 },
            pivot: { x: 0.9, y: 0.8 }
        });

        JSONArray(texture, 0, { frames: [ src ] });

        expect(newFrame.pivotX).toBe(0.1);
        expect(newFrame.pivotY).toBe(0.2);
    });

    it('should not set customPivot when neither anchor nor pivot is present', function ()
    {
        JSONArray(texture, 0, { frames: [ makeFrame() ] });

        expect(newFrame.customPivot).toBe(false);
    });

    // -------------------------------------------------------------------------
    // Scale9 borders
    // -------------------------------------------------------------------------

    it('should call setScale9 when scale9Borders is defined', function ()
    {
        var src = makeFrame({ scale9Borders: { x: 10, y: 10, w: 44, h: 44 } });

        JSONArray(texture, 0, { frames: [ src ] });

        expect(newFrame.setScale9).toHaveBeenCalledWith(10, 10, 44, 44);
    });

    it('should not call setScale9 when scale9Borders is not present', function ()
    {
        JSONArray(texture, 0, { frames: [ makeFrame() ] });

        expect(newFrame.setScale9).not.toHaveBeenCalled();
    });

    // -------------------------------------------------------------------------
    // Duplicate frame handling
    // -------------------------------------------------------------------------

    it('should skip processing when texture.add returns falsy for a frame', function ()
    {
        texture.add = vi.fn(function (name)
        {
            if (name === '__BASE') { return {}; }
            return null;
        });

        var src = makeFrame({ rotated: true });

        // Should not throw even though newFrame is null
        expect(function ()
        {
            JSONArray(texture, 0, { frames: [ src ] });
        }).not.toThrow();
    });

    // -------------------------------------------------------------------------
    // Extra JSON data copied to texture.customData
    // -------------------------------------------------------------------------

    it('should copy scalar metadata from json to texture.customData', function ()
    {
        JSONArray(texture, 0, {
            frames: [],
            meta: { app: 'TexturePacker', version: '1.0' }
        });

        expect(texture.customData.meta).toEqual({ app: 'TexturePacker', version: '1.0' });
    });

    it('should copy array metadata from json to texture.customData as a new array', function ()
    {
        var tags = ['a', 'b', 'c'];

        JSONArray(texture, 0, {
            frames: [],
            tags: tags
        });

        expect(texture.customData.tags).toEqual(['a', 'b', 'c']);
        expect(texture.customData.tags).not.toBe(tags);
    });

    it('should not copy the frames key to texture.customData', function ()
    {
        JSONArray(texture, 0, { frames: [ makeFrame() ] });

        expect(texture.customData.frames).toBeUndefined();
    });

    it('should handle an empty frames array without errors', function ()
    {
        var result = JSONArray(texture, 0, { frames: [] });

        expect(result).toBe(texture);
    });

    it('should process multiple frames correctly', function ()
    {
        var frames = [];

        for (var i = 0; i < 5; i++)
        {
            frames.push(makeFrame({ filename: 'frame' + i + '.png', frame: { x: i * 10, y: 0, w: 10, h: 10 } }));
        }

        JSONArray(texture, 0, { frames: frames });

        // __BASE + 5 frames = 6 calls
        expect(texture.add).toHaveBeenCalledTimes(6);
    });
});
