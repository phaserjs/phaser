var ParseRetroFont = require('../../../src/gameobjects/bitmaptext/ParseRetroFont');

describe('Phaser.GameObjects.RetroFont.Parse', function ()
{
    var mockScene;
    var mockFrame;

    beforeEach(function ()
    {
        mockFrame = {
            cutX: 0,
            cutY: 0,
            source: {
                width: 256,
                height: 256
            }
        };

        mockScene = {
            sys: {
                textures: {
                    getFrame: function (key)
                    {
                        return mockFrame;
                    }
                }
            }
        };
    });

    // --- Return value structure ---

    it('should return undefined when chars is an empty string', function ()
    {
        var config = { width: 8, height: 8, chars: '', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        expect(result).toBeUndefined();
    });

    it('should return undefined when chars is missing and defaults to empty string', function ()
    {
        var config = { width: 8, height: 8, image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        expect(result).toBeUndefined();
    });

    it('should return an object with data, frame, and texture properties', function ()
    {
        var config = { width: 8, height: 8, chars: 'A', image: 'myfont' };
        var result = ParseRetroFont(mockScene, config);
        expect(result).toBeDefined();
        expect(result).toHaveProperty('data');
        expect(result).toHaveProperty('frame');
        expect(result).toHaveProperty('texture');
    });

    it('should set frame to null on the returned entry', function ()
    {
        var config = { width: 8, height: 8, chars: 'A', image: 'myfont' };
        var result = ParseRetroFont(mockScene, config);
        expect(result.frame).toBeNull();
    });

    it('should set texture to the image key on the returned entry', function ()
    {
        var config = { width: 8, height: 8, chars: 'A', image: 'myfont' };
        var result = ParseRetroFont(mockScene, config);
        expect(result.texture).toBe('myfont');
    });

    // --- data block ---

    it('should set retroFont to true on the data block', function ()
    {
        var config = { width: 8, height: 8, chars: 'A', image: 'myfont' };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.retroFont).toBe(true);
    });

    it('should set font to the image key on the data block', function ()
    {
        var config = { width: 16, height: 16, chars: 'A', image: 'retrofont' };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.font).toBe('retrofont');
    });

    it('should set size to the character width', function ()
    {
        var config = { width: 16, height: 12, chars: 'A', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.size).toBe(16);
    });

    it('should set lineHeight to height when lineSpacing is not provided', function ()
    {
        var config = { width: 8, height: 10, chars: 'A', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.lineHeight).toBe(10);
    });

    it('should set lineHeight to height plus lineSpacing', function ()
    {
        var config = { width: 8, height: 10, chars: 'A', image: 'font', lineSpacing: 4 };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.lineHeight).toBe(14);
    });

    it('should create a chars object on the data block', function ()
    {
        var config = { width: 8, height: 8, chars: 'A', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.chars).toBeDefined();
        expect(typeof result.data.chars).toBe('object');
    });

    // --- Per-character glyph entries ---

    it('should create an entry for each character in chars', function ()
    {
        var config = { width: 8, height: 8, chars: 'ABC', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.chars[65]).toBeDefined(); // A
        expect(result.data.chars[66]).toBeDefined(); // B
        expect(result.data.chars[67]).toBeDefined(); // C
    });

    it('should key each character by its char code', function ()
    {
        var config = { width: 8, height: 8, chars: 'Z', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.chars['Z'.charCodeAt(0)]).toBeDefined();
    });

    it('should set width and height on each glyph', function ()
    {
        var config = { width: 16, height: 12, chars: 'A', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        var glyph = result.data.chars[65];
        expect(glyph.width).toBe(16);
        expect(glyph.height).toBe(12);
    });

    it('should set centerX to floor(width/2) and centerY to floor(height/2)', function ()
    {
        var config = { width: 9, height: 11, chars: 'A', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        var glyph = result.data.chars[65];
        expect(glyph.centerX).toBe(4);
        expect(glyph.centerY).toBe(5);
    });

    it('should set xOffset and yOffset to 0', function ()
    {
        var config = { width: 8, height: 8, chars: 'A', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        var glyph = result.data.chars[65];
        expect(glyph.xOffset).toBe(0);
        expect(glyph.yOffset).toBe(0);
    });

    it('should set xAdvance to the character width', function ()
    {
        var config = { width: 16, height: 8, chars: 'A', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        var glyph = result.data.chars[65];
        expect(glyph.xAdvance).toBe(16);
    });

    it('should set data and kerning to empty objects on each glyph', function ()
    {
        var config = { width: 8, height: 8, chars: 'A', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        var glyph = result.data.chars[65];
        expect(glyph.data).toEqual({});
        expect(glyph.kerning).toEqual({});
    });

    // --- UV coordinates ---

    it('should set correct u0, v0, u1, v1 for first character with no offset', function ()
    {
        // textureWidth=256, textureHeight=256, cutX=0, cutY=0
        // w=8, h=8, x=0, y=0
        // u0 = 0/256 = 0, v0 = 1 - 0/256 = 1
        // u1 = 8/256 = 0.03125, v1 = 1 - 8/256 = 0.96875
        var config = { width: 8, height: 8, chars: 'A', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        var glyph = result.data.chars[65];
        expect(glyph.u0).toBeCloseTo(0, 5);
        expect(glyph.v0).toBeCloseTo(1, 5);
        expect(glyph.u1).toBeCloseTo(8 / 256, 5);
        expect(glyph.v1).toBeCloseTo(1 - 8 / 256, 5);
    });

    it('should account for cutX and cutY in UV calculations', function ()
    {
        mockFrame.cutX = 32;
        mockFrame.cutY = 16;
        // u0 = (32+0)/256, v0 = 1-(16+0)/256
        // u1 = (32+8)/256, v1 = 1-(16+8)/256
        var config = { width: 8, height: 8, chars: 'A', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        var glyph = result.data.chars[65];
        expect(glyph.u0).toBeCloseTo(32 / 256, 5);
        expect(glyph.v0).toBeCloseTo(1 - 16 / 256, 5);
        expect(glyph.u1).toBeCloseTo(40 / 256, 5);
        expect(glyph.v1).toBeCloseTo(1 - 24 / 256, 5);
    });

    // --- Character positioning: x layout ---

    it('should place first character at x=0 when no offset', function ()
    {
        var config = { width: 8, height: 8, chars: 'A', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.chars[65].x).toBe(0);
        expect(result.data.chars[65].y).toBe(0);
    });

    it('should advance x by width for consecutive characters on the same row', function ()
    {
        // textureWidth=256, w=8 → charsPerRow = 256/8 = 32 (>2 so stays 32)
        var config = { width: 8, height: 8, chars: 'AB', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.chars[65].x).toBe(0); // A
        expect(result.data.chars[66].x).toBe(8); // B
    });

    it('should advance x by width plus spacingX', function ()
    {
        var config = { width: 8, height: 8, chars: 'AB', image: 'font', spacing: { x: 2, y: 0 } };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.chars[65].x).toBe(0); // A
        expect(result.data.chars[66].x).toBe(10); // B: 0 + 8 + 2
    });

    it('should wrap to next row after charsPerRow characters', function ()
    {
        // charsPerRow=2 explicitly, w=8, h=8
        var config = { width: 8, height: 8, chars: 'ABC', image: 'font', charsPerRow: 2 };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.chars[65].x).toBe(0); // A row 0
        expect(result.data.chars[65].y).toBe(0);
        expect(result.data.chars[66].x).toBe(8); // B row 0
        expect(result.data.chars[66].y).toBe(0);
        expect(result.data.chars[67].x).toBe(0); // C wrapped to row 1
        expect(result.data.chars[67].y).toBe(8);
    });

    it('should apply spacingY when wrapping to the next row', function ()
    {
        var config = {
            width: 8, height: 8, chars: 'ABC', image: 'font',
            charsPerRow: 2,
            spacing: { x: 0, y: 4 }
        };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.chars[67].y).toBe(12); // 8 + 4
    });

    it('should apply offsetX and offsetY to starting position', function ()
    {
        var config = {
            width: 8, height: 8, chars: 'AB', image: 'font',
            offset: { x: 10, y: 5 },
            charsPerRow: 10
        };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.chars[65].x).toBe(10); // A starts at offsetX
        expect(result.data.chars[65].y).toBe(5);  // A starts at offsetY
        expect(result.data.chars[66].x).toBe(18); // B = offsetX + width
    });

    it('should reset x back to offsetX when wrapping rows', function ()
    {
        var config = {
            width: 8, height: 8, chars: 'ABC', image: 'font',
            offset: { x: 4, y: 0 },
            charsPerRow: 2
        };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.chars[67].x).toBe(4); // C resets to offsetX
    });

    // --- charsPerRow auto-calculation ---

    it('should auto-calculate charsPerRow from textureWidth / charWidth', function ()
    {
        // textureWidth=64, w=16 → charsPerRow=4
        mockFrame.source.width = 64;
        mockFrame.source.height = 64;
        var config = { width: 16, height: 16, chars: 'ABCDE', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        // After 4 chars (A,B,C,D), E should wrap to next row
        expect(result.data.chars['E'.charCodeAt(0)].x).toBe(0);
        expect(result.data.chars['E'.charCodeAt(0)].y).toBe(16);
    });

    it('should cap auto charsPerRow to letters.length when texture is wider', function ()
    {
        // textureWidth=256, w=8 → would be 32 but only 3 chars so cap to 3
        var config = { width: 8, height: 8, chars: 'ABC', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        // All 3 chars should be on the same row — none wraps
        expect(result.data.chars[65].y).toBe(0);
        expect(result.data.chars[66].y).toBe(0);
        expect(result.data.chars[67].y).toBe(0);
    });

    // --- Edge cases ---

    it('should handle a single character correctly', function ()
    {
        var config = { width: 8, height: 8, chars: 'X', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        expect(Object.keys(result.data.chars).length).toBe(1);
        expect(result.data.chars['X'.charCodeAt(0)]).toBeDefined();
    });

    it('should handle numeric characters', function ()
    {
        var config = { width: 8, height: 8, chars: '0123456789', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        for (var i = 0; i <= 9; i++)
        {
            expect(result.data.chars['0'.charCodeAt(0) + i]).toBeDefined();
        }
    });

    it('should handle space character', function ()
    {
        var config = { width: 8, height: 8, chars: ' ', image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        expect(result.data.chars[32]).toBeDefined();
    });

    it('should produce correct number of glyph entries', function ()
    {
        var letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        var config = { width: 8, height: 8, chars: letters, image: 'font' };
        var result = ParseRetroFont(mockScene, config);
        expect(Object.keys(result.data.chars).length).toBe(letters.length);
    });
});
