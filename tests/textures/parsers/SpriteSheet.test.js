var SpriteSheet = require('../../../src/textures/parsers/SpriteSheet');

describe('Phaser.Textures.Parsers.SpriteSheet', function ()
{
    var texture;
    var calls;

    function makeMockTexture (sourceWidth, sourceHeight)
    {
        calls = [];
        return {
            key: 'testTexture',
            source: [ { width: sourceWidth || 256, height: sourceHeight || 256 } ],
            add: function (name, sourceIndex, x, y, w, h)
            {
                calls.push({ name: name, sourceIndex: sourceIndex, x: x, y: y, w: w, h: h });
            }
        };
    }

    beforeEach(function ()
    {
        texture = makeMockTexture(256, 256);
    });

    // -------------------------------------------------------------------------
    // Error handling
    // -------------------------------------------------------------------------

    it('should throw an error when frameWidth is not provided', function ()
    {
        expect(function ()
        {
            SpriteSheet(texture, 0, 0, 0, 256, 256, {});
        }).toThrow('TextureManager.SpriteSheet: Invalid frameWidth given.');
    });

    it('should throw an error when config has no frameWidth property', function ()
    {
        expect(function ()
        {
            SpriteSheet(texture, 0, 0, 0, 256, 256, { frameHeight: 32 });
        }).toThrow('TextureManager.SpriteSheet: Invalid frameWidth given.');
    });

    // -------------------------------------------------------------------------
    // Return value
    // -------------------------------------------------------------------------

    it('should return the texture object', function ()
    {
        var result = SpriteSheet(texture, 0, 0, 0, 256, 256, { frameWidth: 32 });
        expect(result).toBe(texture);
    });

    // -------------------------------------------------------------------------
    // __BASE frame
    // -------------------------------------------------------------------------

    it('should add a __BASE entry using the source dimensions', function ()
    {
        texture = makeMockTexture(512, 128);
        SpriteSheet(texture, 0, 0, 0, 512, 128, { frameWidth: 32 });
        var base = calls.find(function (c) { return c.name === '__BASE'; });
        expect(base).toBeDefined();
        expect(base.x).toBe(0);
        expect(base.y).toBe(0);
        expect(base.w).toBe(512);
        expect(base.h).toBe(128);
        expect(base.sourceIndex).toBe(0);
    });

    it('should use the correct sourceIndex for __BASE', function ()
    {
        texture = { key: 'multi', source: [ {}, { width: 64, height: 64 } ], add: function (n, si, x, y, w, h) { calls.push({ name: n, sourceIndex: si }); } };
        SpriteSheet(texture, 1, 0, 0, 64, 64, { frameWidth: 32 });
        var base = calls.find(function (c) { return c.name === '__BASE'; });
        expect(base.sourceIndex).toBe(1);
    });

    // -------------------------------------------------------------------------
    // Frame count (basic grids)
    // -------------------------------------------------------------------------

    it('should add the correct number of frames for a simple 2x2 grid', function ()
    {
        // 64x64 sheet, 32x32 frames => 2 cols * 2 rows = 4 frames
        texture = makeMockTexture(64, 64);
        SpriteSheet(texture, 0, 0, 0, 64, 64, { frameWidth: 32 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(4);
    });

    it('should add the correct number of frames for a 4x2 grid', function ()
    {
        // 128 wide / 32 = 4 cols, 64 tall / 32 = 2 rows = 8 frames
        texture = makeMockTexture(128, 64);
        SpriteSheet(texture, 0, 0, 0, 128, 64, { frameWidth: 32 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(8);
    });

    it('should number frames starting from 0', function ()
    {
        texture = makeMockTexture(64, 32);
        SpriteSheet(texture, 0, 0, 0, 64, 32, { frameWidth: 32 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames[0].name).toBe(0);
        expect(frames[1].name).toBe(1);
    });

    // -------------------------------------------------------------------------
    // frameHeight defaults to frameWidth
    // -------------------------------------------------------------------------

    it('should use frameWidth as frameHeight when frameHeight is not provided', function ()
    {
        // 64 wide / 32 = 2 cols, 64 tall / 32 = 2 rows = 4 frames
        texture = makeMockTexture(64, 64);
        SpriteSheet(texture, 0, 0, 0, 64, 64, { frameWidth: 32 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(4);
        expect(frames[0].h).toBe(32);
    });

    it('should use explicit frameHeight when provided', function ()
    {
        // 64 wide / 32 = 2 cols, 64 tall / 16 = 4 rows = 8 frames
        texture = makeMockTexture(64, 64);
        SpriteSheet(texture, 0, 0, 0, 64, 64, { frameWidth: 32, frameHeight: 16 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(8);
        expect(frames[0].w).toBe(32);
        expect(frames[0].h).toBe(16);
    });

    // -------------------------------------------------------------------------
    // Frame positions
    // -------------------------------------------------------------------------

    it('should place frames at correct x/y positions', function ()
    {
        // 64x64, 32x32 frames => frames at (0,0), (32,0), (0,32), (32,32)
        texture = makeMockTexture(64, 64);
        SpriteSheet(texture, 0, 0, 0, 64, 64, { frameWidth: 32 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames[0].x).toBe(0);
        expect(frames[0].y).toBe(0);
        expect(frames[1].x).toBe(32);
        expect(frames[1].y).toBe(0);
        expect(frames[2].x).toBe(0);
        expect(frames[2].y).toBe(32);
        expect(frames[3].x).toBe(32);
        expect(frames[3].y).toBe(32);
    });

    it('should offset frame positions by the x/y parameters', function ()
    {
        texture = makeMockTexture(128, 128);
        SpriteSheet(texture, 0, 10, 20, 64, 64, { frameWidth: 32 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames[0].x).toBe(10);
        expect(frames[0].y).toBe(20);
        expect(frames[1].x).toBe(42);
        expect(frames[1].y).toBe(20);
    });

    // -------------------------------------------------------------------------
    // margin
    // -------------------------------------------------------------------------

    it('should account for margin when placing frames', function ()
    {
        // 66x66, 32x32 frames, margin 2
        // row = floor((66 - 2 + 0) / (32 + 0)) = floor(64/32) = 2
        // col = floor((66 - 2 + 0) / (32 + 0)) = 2 => 4 frames
        // first frame at (margin, margin) = (2, 2)
        texture = makeMockTexture(66, 66);
        SpriteSheet(texture, 0, 0, 0, 66, 66, { frameWidth: 32, margin: 2 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames[0].x).toBe(2);
        expect(frames[0].y).toBe(2);
    });

    it('should reduce frame count when margin eats into available space', function ()
    {
        // 64x64, 32x32 frames, margin 1
        // row = floor((64 - 1 + 0) / 32) = floor(63/32) = 1
        // col = 1 => total = 1
        texture = makeMockTexture(64, 64);
        SpriteSheet(texture, 0, 0, 0, 64, 64, { frameWidth: 32, margin: 1 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(1);
    });

    // -------------------------------------------------------------------------
    // spacing
    // -------------------------------------------------------------------------

    it('should account for spacing between frames', function ()
    {
        // 66x32, 32x32 frames, spacing 2
        // row = floor((66 - 0 + 2) / (32 + 2)) = floor(68/34) = 2
        // col = floor((32 - 0 + 2) / (32 + 2)) = floor(34/34) = 1 => total 2
        // frame 0 at (0,0), frame 1 at (34,0)
        texture = makeMockTexture(66, 32);
        SpriteSheet(texture, 0, 0, 0, 66, 32, { frameWidth: 32, spacing: 2 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(2);
        expect(frames[0].x).toBe(0);
        expect(frames[1].x).toBe(34);
    });

    // -------------------------------------------------------------------------
    // startFrame
    // -------------------------------------------------------------------------

    it('should start from frame 0 by default', function ()
    {
        texture = makeMockTexture(64, 32);
        SpriteSheet(texture, 0, 0, 0, 64, 32, { frameWidth: 32 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(2);
        expect(frames[0].name).toBe(0);
    });

    it('should skip frames before startFrame', function ()
    {
        // 128x32, 32x32 => 4 frames. startFrame=2 => frames 2,3 added
        texture = makeMockTexture(128, 32);
        SpriteSheet(texture, 0, 0, 0, 128, 32, { frameWidth: 32, startFrame: 2 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(2);
        // counter c starts at 0 even when startFrame skips
        expect(frames[0].name).toBe(0);
    });

    it('should reset startFrame to 0 when startFrame exceeds total', function ()
    {
        // 64x32, 32x32 => 2 frames. startFrame=99 => reset to 0 => all 2 frames
        texture = makeMockTexture(64, 32);
        SpriteSheet(texture, 0, 0, 0, 64, 32, { frameWidth: 32, startFrame: 99 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(2);
    });

    it('should support negative startFrame as an offset from end', function ()
    {
        // 128x32, 32x32 => 4 frames. startFrame=-1 => total+(-1)=3 => only frame index 3
        texture = makeMockTexture(128, 32);
        SpriteSheet(texture, 0, 0, 0, 128, 32, { frameWidth: 32, startFrame: -1 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(1);
    });

    it('should reset startFrame to 0 when negative startFrame exceeds total in magnitude', function ()
    {
        // 64x32 => 2 frames. startFrame=-99 => reset to 0 => all 2 frames
        texture = makeMockTexture(64, 32);
        SpriteSheet(texture, 0, 0, 0, 64, 32, { frameWidth: 32, startFrame: -99 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(2);
    });

    // -------------------------------------------------------------------------
    // endFrame
    // -------------------------------------------------------------------------

    it('should include all frames when endFrame is -1 (default)', function ()
    {
        texture = makeMockTexture(128, 32);
        SpriteSheet(texture, 0, 0, 0, 128, 32, { frameWidth: 32, endFrame: -1 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(4);
    });

    it('should limit frames to endFrame', function ()
    {
        // 128x32, 32x32 => 4 frames. endFrame=2 => frames 0,1,2
        texture = makeMockTexture(128, 32);
        SpriteSheet(texture, 0, 0, 0, 128, 32, { frameWidth: 32, endFrame: 2 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(3);
    });

    it('should reset endFrame to total when endFrame exceeds total', function ()
    {
        texture = makeMockTexture(64, 32);
        SpriteSheet(texture, 0, 0, 0, 64, 32, { frameWidth: 32, endFrame: 999 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(2);
    });

    it('should reset endFrame to total when endFrame is less than startFrame', function ()
    {
        // startFrame=2, endFrame=1 => endFrame reset to total=4 => frames 2,3,4
        texture = makeMockTexture(128, 32);
        SpriteSheet(texture, 0, 0, 0, 128, 32, { frameWidth: 32, startFrame: 2, endFrame: 1 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(2);
    });

    // -------------------------------------------------------------------------
    // Zero frames warning
    // -------------------------------------------------------------------------

    it('should warn when frame dimensions result in zero frames', function ()
    {
        var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});
        texture = makeMockTexture(16, 16);
        SpriteSheet(texture, 0, 0, 0, 16, 16, { frameWidth: 32 });
        expect(warnSpy).toHaveBeenCalledWith(
            'SpriteSheet frame dimensions will result in zero frames for texture:',
            'testTexture'
        );
        warnSpy.mockRestore();
    });

    it('should not add any numbered frames when total is zero', function ()
    {
        var warnSpy = vi.spyOn(console, 'warn').mockImplementation(function () {});
        texture = makeMockTexture(16, 16);
        SpriteSheet(texture, 0, 0, 0, 16, 16, { frameWidth: 32 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(0);
        warnSpy.mockRestore();
    });

    // -------------------------------------------------------------------------
    // Combined margin + spacing
    // -------------------------------------------------------------------------

    it('should correctly handle both margin and spacing together', function ()
    {
        // margin=2, spacing=2, frameWidth=32
        // row = floor((70 - 2 + 2) / (32 + 2)) = floor(70/34) = 2
        // col = floor((36 - 2 + 2) / (32 + 2)) = floor(36/34) = 1 => total 2
        // frame 0 at (2, 2), frame 1 at (2+32+2=36, 2) => but 36+32 > 70? 68<=70 ok
        texture = makeMockTexture(70, 36);
        SpriteSheet(texture, 0, 0, 0, 70, 36, { frameWidth: 32, margin: 2, spacing: 2 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        expect(frames.length).toBe(2);
        expect(frames[0].x).toBe(2);
        expect(frames[0].y).toBe(2);
        expect(frames[1].x).toBe(36);
        expect(frames[1].y).toBe(2);
    });

    // -------------------------------------------------------------------------
    // Frame dimensions are correct
    // -------------------------------------------------------------------------

    it('should use frameWidth and frameHeight for frame dimensions', function ()
    {
        texture = makeMockTexture(64, 48);
        SpriteSheet(texture, 0, 0, 0, 64, 48, { frameWidth: 32, frameHeight: 16 });
        var frames = calls.filter(function (c) { return c.name !== '__BASE'; });
        frames.forEach(function (f)
        {
            expect(f.w).toBe(32);
            expect(f.h).toBe(16);
        });
    });
});
