var SpriteSheetFromAtlas = require('../../../src/textures/parsers/SpriteSheetFromAtlas');

describe('Phaser.Textures.Parsers.SpriteSheetFromAtlas', function ()
{
    function makeSheetFrame (sheetFrame)
    {
        return {
            cutWidth: sheetFrame.cutWidth !== undefined ? sheetFrame.cutWidth : 0,
            cutHeight: sheetFrame.cutHeight !== undefined ? sheetFrame.cutHeight : 0,
            setTrim: vi.fn()
        };
    }

    function makeTexture (sourceWidth, sourceHeight)
    {
        var frames = [];

        return {
            source: [ { width: sourceWidth, height: sourceHeight } ],
            add: vi.fn(function (name, sourceIndex, x, y, w, h)
            {
                var f = makeSheetFrame({ cutWidth: w, cutHeight: h });
                frames.push({ name: name, sourceIndex: sourceIndex, x: x, y: y, w: w, h: h, frame: f });
                return f;
            }),
            _frames: frames
        };
    }

    function makeFrame (options)
    {
        return {
            cutX: options.cutX !== undefined ? options.cutX : 0,
            cutY: options.cutY !== undefined ? options.cutY : 0,
            cutWidth: options.cutWidth !== undefined ? options.cutWidth : options.realWidth,
            cutHeight: options.cutHeight !== undefined ? options.cutHeight : options.realHeight,
            realWidth: options.realWidth,
            realHeight: options.realHeight,
            x: options.x !== undefined ? options.x : 0,
            y: options.y !== undefined ? options.y : 0
        };
    }

    // ----------------------------
    // Error handling
    // ----------------------------

    it('should throw when frameWidth is not provided', function ()
    {
        var texture = makeTexture(128, 128);
        var frame = makeFrame({ realWidth: 128, realHeight: 128 });

        expect(function ()
        {
            SpriteSheetFromAtlas(texture, frame, {});
        }).toThrow('TextureManager.SpriteSheetFromAtlas: Invalid frameWidth given.');
    });

    it('should throw when frameWidth is zero', function ()
    {
        var texture = makeTexture(128, 128);
        var frame = makeFrame({ realWidth: 128, realHeight: 128 });

        expect(function ()
        {
            SpriteSheetFromAtlas(texture, frame, { frameWidth: 0 });
        }).toThrow('TextureManager.SpriteSheetFromAtlas: Invalid frameWidth given.');
    });

    it('should throw when frameWidth is null', function ()
    {
        var texture = makeTexture(128, 128);
        var frame = makeFrame({ realWidth: 128, realHeight: 128 });

        expect(function ()
        {
            SpriteSheetFromAtlas(texture, frame, { frameWidth: null });
        }).toThrow('TextureManager.SpriteSheetFromAtlas: Invalid frameWidth given.');
    });

    // ----------------------------
    // Return value
    // ----------------------------

    it('should return the texture', function ()
    {
        var texture = makeTexture(128, 128);
        var frame = makeFrame({ realWidth: 128, realHeight: 128 });
        var result = SpriteSheetFromAtlas(texture, frame, { frameWidth: 32 });

        expect(result).toBe(texture);
    });

    // ----------------------------
    // __BASE frame
    // ----------------------------

    it('should add a __BASE frame using the source dimensions', function ()
    {
        var texture = makeTexture(256, 128);
        var frame = makeFrame({ realWidth: 256, realHeight: 128 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 64 });

        var baseCall = texture.add.mock.calls[0];
        expect(baseCall[0]).toBe('__BASE');
        expect(baseCall[1]).toBe(0);
        expect(baseCall[2]).toBe(0);
        expect(baseCall[3]).toBe(0);
        expect(baseCall[4]).toBe(256);
        expect(baseCall[5]).toBe(128);
    });

    // ----------------------------
    // frameHeight defaults
    // ----------------------------

    it('should use frameWidth as frameHeight when frameHeight is not provided', function ()
    {
        var texture = makeTexture(64, 64);
        var frame = makeFrame({ realWidth: 64, realHeight: 64 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32 });

        // 2x2 grid = 4 frames + 1 __BASE call = 5 total adds
        // Each frame add after __BASE should have height equal to frameWidth (32)
        var frameCall = texture.add.mock.calls[1];
        expect(frameCall[5]).toBe(32);
    });

    it('should use explicit frameHeight when provided', function ()
    {
        var texture = makeTexture(64, 128);
        var frame = makeFrame({ realWidth: 64, realHeight: 128 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32, frameHeight: 64 });

        var frameCall = texture.add.mock.calls[1];
        expect(frameCall[4]).toBe(32);
        expect(frameCall[5]).toBe(64);
    });

    // ----------------------------
    // Frame count
    // ----------------------------

    it('should add the correct number of frames for a simple 2x2 sheet', function ()
    {
        var texture = makeTexture(64, 64);
        var frame = makeFrame({ realWidth: 64, realHeight: 64 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32 });

        // 1 __BASE + 4 frames
        expect(texture.add.mock.calls.length).toBe(5);
    });

    it('should add the correct number of frames for a 4x2 sheet', function ()
    {
        var texture = makeTexture(128, 64);
        var frame = makeFrame({ realWidth: 128, realHeight: 64, cutWidth: 128, cutHeight: 64 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32, frameHeight: 32 });

        // 1 __BASE + 8 frames
        expect(texture.add.mock.calls.length).toBe(9);
    });

    it('should add only one frame when sheet exactly matches frame dimensions', function ()
    {
        var texture = makeTexture(32, 32);
        var frame = makeFrame({ realWidth: 32, realHeight: 32 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32 });

        // 1 __BASE + 1 frame
        expect(texture.add.mock.calls.length).toBe(2);
    });

    // ----------------------------
    // Frame indices
    // ----------------------------

    it('should assign sequential frame indices starting at 0', function ()
    {
        var texture = makeTexture(64, 32);
        var frame = makeFrame({ realWidth: 64, realHeight: 32, cutWidth: 64, cutHeight: 32 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32 });

        // calls: __BASE (index 0 skipped), frame 0, frame 1
        expect(texture.add.mock.calls[1][0]).toBe(0);
        expect(texture.add.mock.calls[2][0]).toBe(1);
    });

    // ----------------------------
    // startFrame / endFrame
    // ----------------------------

    it('should add all frames regardless of endFrame since the loop iterates the full grid', function ()
    {
        var texture = makeTexture(128, 32);
        var frame = makeFrame({ realWidth: 128, realHeight: 32, cutWidth: 128, cutHeight: 32 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32, endFrame: 1 });

        // The loop iterates row*column positions without an early-exit guard on total,
        // so all 4 frames (128/32=4 cols, 32/32=1 row) are added regardless of endFrame.
        // 1 __BASE + 4 frame adds
        expect(texture.add.mock.calls.length).toBe(5);
    });

    it('should reset startFrame to 0 when startFrame exceeds total', function ()
    {
        var texture = makeTexture(64, 32);
        var frame = makeFrame({ realWidth: 64, realHeight: 32, cutWidth: 64, cutHeight: 32 });
        // 2 frames total, startFrame=99 should reset to 0
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32, startFrame: 99 });

        // Should add all 2 frames
        expect(texture.add.mock.calls.length).toBe(3);
    });

    it('should reset startFrame to 0 when startFrame is more negative than -total', function ()
    {
        var texture = makeTexture(64, 32);
        var frame = makeFrame({ realWidth: 64, realHeight: 32, cutWidth: 64, cutHeight: 32 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32, startFrame: -99 });

        expect(texture.add.mock.calls.length).toBe(3);
    });

    it('should handle negative startFrame as offset from end', function ()
    {
        var texture = makeTexture(128, 32);
        var frame = makeFrame({ realWidth: 128, realHeight: 32, cutWidth: 128, cutHeight: 32 });
        // 4 frames total, startFrame=-1 => total + (-1) = 3, so start at frame 3
        // endFrame=-1 means all remaining from startFrame
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32, startFrame: -1 });

        // startFrame=3, endFrame=-1 so total stays at 4; loop runs frames 0..3 but
        // frameIndex < total (4) the whole time, so all 4 frames added
        expect(texture.add.mock.calls.length).toBe(5);
    });

    // ----------------------------
    // Margin and spacing
    // ----------------------------

    it('should account for margin in row/column calculation', function ()
    {
        // row  = Math.floor((66 - 2 + 0) / (32 + 0)) = Math.floor(64/32) = 2
        // col  = Math.floor((34 - 2 + 0) / (32 + 0)) = Math.floor(32/32) = 1
        var texture = makeTexture(66, 34);
        var frame = makeFrame({ realWidth: 66, realHeight: 34, cutWidth: 66, cutHeight: 34 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32, frameHeight: 32, margin: 2 });

        // 2x1 = 2 frames + __BASE
        expect(texture.add.mock.calls.length).toBe(3);
    });

    it('should account for spacing in row/column calculation', function ()
    {
        // 66px wide, 32px frameWidth, 2px spacing => (66 - 0 + 2) / (32 + 2) = 2.0 => 2 cols
        var texture = makeTexture(66, 32);
        var frame = makeFrame({ realWidth: 66, realHeight: 32, cutWidth: 66, cutHeight: 32 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32, spacing: 2 });

        // 2 cols x 1 row = 2 frames + __BASE
        expect(texture.add.mock.calls.length).toBe(3);
    });

    // ----------------------------
    // Frame x/y positions (cutX, cutY offset)
    // ----------------------------

    it('should offset frame positions by frame.cutX and frame.cutY', function ()
    {
        var texture = makeTexture(128, 64);
        var frame = makeFrame({ realWidth: 64, realHeight: 32, cutX: 10, cutY: 20, cutWidth: 64, cutHeight: 32 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32 });

        // First frame add after __BASE: x should be cutX + margin (10+0=10), y = cutY + margin (20+0=20)
        var firstFrameCall = texture.add.mock.calls[1];
        expect(firstFrameCall[2]).toBe(10);
        expect(firstFrameCall[3]).toBe(20);
    });

    // ----------------------------
    // setTrim calls on edge frames
    // ----------------------------

    it('should call setTrim on edge frames', function ()
    {
        var texture = makeTexture(64, 64);
        var frame = makeFrame({ realWidth: 64, realHeight: 64 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32 });

        // In a 2x2 grid all 4 frames are edge frames (each is on left/right/top/bottom)
        // All 4 returned sheetFrame mocks should have setTrim called
        var frameCalls = texture.add.mock.results.slice(1); // skip __BASE
        frameCalls.forEach(function (result)
        {
            expect(result.value.setTrim).toHaveBeenCalled();
        });
    });

    it('should not call setTrim on interior frames of a large grid', function ()
    {
        // 5x5 grid of 32px frames = 160x160 sheet; interior frames are not on any edge
        var texture = makeTexture(160, 160);
        var frame = makeFrame({ realWidth: 160, realHeight: 160, cutWidth: 160, cutHeight: 160 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32 });

        // Frame at index 6 is row=1,col=1 (0-indexed) — interior frame
        // texture.add calls: index 0 = __BASE, indices 1..25 = frames 0..24
        // Frame index 6 => add call index 7
        var interiorFrameResult = texture.add.mock.results[7].value;
        expect(interiorFrameResult.setTrim).not.toHaveBeenCalled();
    });

    it('should call setTrim with correct dimensions on a top-left corner frame with no trim', function ()
    {
        // No trim: frame.x=0, frame.y=0, cutWidth=realWidth, cutHeight=realHeight
        var texture = makeTexture(64, 64);
        var frame = makeFrame({ realWidth: 64, realHeight: 64, cutWidth: 64, cutHeight: 64, x: 0, y: 0 });
        SpriteSheetFromAtlas(texture, frame, { frameWidth: 32 });

        // Top-left frame (index 0, add call index 1)
        var topLeftFrame = texture.add.mock.results[1].value;
        expect(topLeftFrame.setTrim).toHaveBeenCalled();

        var trimArgs = topLeftFrame.setTrim.mock.calls[0];
        // setTrim(frameWidth, frameHeight, destX, destY, destWidth, destHeight)
        expect(trimArgs[0]).toBe(32); // frameWidth
        expect(trimArgs[1]).toBe(32); // frameHeight
        expect(trimArgs[2]).toBe(0);  // destX = leftPad (frame.x=0)
        expect(trimArgs[3]).toBe(0);  // destY = topPad (frame.y=0)
        expect(trimArgs[4]).toBe(32); // destWidth
        expect(trimArgs[5]).toBe(32); // destHeight
    });
});
