var GetBitmapTextSize = require('../../../src/gameobjects/bitmaptext/GetBitmapTextSize');

// Helper to create a basic glyph object
function makeGlyph (xAdvance, xOffset, yOffset, width, height)
{
    return {
        xAdvance: xAdvance,
        xOffset: xOffset !== undefined ? xOffset : 0,
        yOffset: yOffset !== undefined ? yOffset : 0,
        width: width !== undefined ? width : xAdvance,
        height: height !== undefined ? height : 10,
        kerning: {}
    };
}

// Helper to create a basic src mock with sensible defaults
function makeSrc (text, options)
{
    options = options || {};

    var fontDataSize = options.fontDataSize !== undefined ? options.fontDataSize : 16;
    var lineHeight = options.lineHeight !== undefined ? options.lineHeight : 16;
    var fontSize = options.fontSize !== undefined ? options.fontSize : 16;
    var chars = options.chars || {};

    return {
        text: text,
        maxWidth: options.maxWidth !== undefined ? options.maxWidth : 0,
        wordWrapCharCode: options.wordWrapCharCode !== undefined ? options.wordWrapCharCode : 32,
        fontData: {
            chars: chars,
            lineHeight: lineHeight,
            size: fontDataSize
        },
        letterSpacing: options.letterSpacing !== undefined ? options.letterSpacing : 0,
        lineSpacing: options.lineSpacing !== undefined ? options.lineSpacing : 0,
        fontSize: fontSize,
        scaleX: options.scaleX !== undefined ? options.scaleX : 1,
        scaleY: options.scaleY !== undefined ? options.scaleY : 1,
        _align: options._align !== undefined ? options._align : 0,
        x: options.x !== undefined ? options.x : 0,
        y: options.y !== undefined ? options.y : 0,
        _displayOriginX: options._displayOriginX !== undefined ? options._displayOriginX : 0,
        _displayOriginY: options._displayOriginY !== undefined ? options._displayOriginY : 0,
        originX: options.originX !== undefined ? options.originX : 0,
        originY: options.originY !== undefined ? options.originY : 0
    };
}

// Helper to create a structured out object matching the default shape
function makeOut ()
{
    return {
        local: { x: 0, y: 0, width: 0, height: 0 },
        global: { x: 0, y: 0, width: 0, height: 0 },
        lines: { shortest: 0, longest: 0, lengths: null, height: 0 },
        wrappedText: '',
        words: [],
        characters: [],
        scaleX: 0,
        scaleY: 0
    };
}

describe('GetBitmapTextSize', function ()
{
    // -------------------------------------------------------------------------
    // Default out object (no out provided)
    // -------------------------------------------------------------------------

    describe('default out structure', function ()
    {
        it('should return an object when no out argument is provided', function ()
        {
            var result = GetBitmapTextSize(null, false, false, undefined);

            expect(result).toBeDefined();
        });

        it('should return a local object with zeroed values', function ()
        {
            var result = GetBitmapTextSize(null, false, false, undefined);

            expect(result.local.x).toBe(0);
            expect(result.local.y).toBe(0);
            expect(result.local.width).toBe(0);
            expect(result.local.height).toBe(0);
        });

        it('should return a global object with zeroed values', function ()
        {
            var result = GetBitmapTextSize(null, false, false, undefined);

            expect(result.global.x).toBe(0);
            expect(result.global.y).toBe(0);
            expect(result.global.width).toBe(0);
            expect(result.global.height).toBe(0);
        });

        it('should return a lines object with zero shortest and longest', function ()
        {
            var result = GetBitmapTextSize(null, false, false, undefined);

            expect(result.lines.shortest).toBe(0);
            expect(result.lines.longest).toBe(0);
            expect(result.lines.lengths).toBeNull();
            expect(result.lines.height).toBe(0);
        });

        it('should return empty words and characters arrays', function ()
        {
            var result = GetBitmapTextSize(null, false, false, undefined);

            expect(Array.isArray(result.words)).toBe(true);
            expect(result.words.length).toBe(0);
            expect(Array.isArray(result.characters)).toBe(true);
            expect(result.characters.length).toBe(0);
        });

        it('should return an empty wrappedText string', function ()
        {
            var result = GetBitmapTextSize(null, false, false, undefined);

            expect(result.wrappedText).toBe('');
        });

        it('should return zero scaleX and scaleY', function ()
        {
            var result = GetBitmapTextSize(null, false, false, undefined);

            expect(result.scaleX).toBe(0);
            expect(result.scaleY).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // Single-character text
    // -------------------------------------------------------------------------

    describe('single character text', function ()
    {
        var glyphA;
        var src;
        var out;

        beforeEach(function ()
        {
            // 'A' = charCode 65, xAdvance=10, xOffset=1, yOffset=2, width=8, height=12
            glyphA = makeGlyph(10, 1, 2, 8, 12);
            src = makeSrc('A', {
                chars: { 65: glyphA },
                lineHeight: 16,
                fontDataSize: 16,
                fontSize: 16
            });
            out = makeOut();
        });

        it('should compute correct local bounds', function ()
        {
            GetBitmapTextSize(src, false, false, out);

            expect(out.local.x).toBe(0);
            expect(out.local.y).toBe(0);
            expect(out.local.width).toBe(10);
            expect(out.local.height).toBe(16);
        });

        it('should compute correct global bounds', function ()
        {
            GetBitmapTextSize(src, false, false, out);

            expect(out.global.x).toBe(0);
            expect(out.global.y).toBe(0);
            expect(out.global.width).toBe(10);
            expect(out.global.height).toBe(16);
        });

        it('should set correct line metrics', function ()
        {
            GetBitmapTextSize(src, false, false, out);

            expect(out.lines.shortest).toBe(10);
            expect(out.lines.longest).toBe(10);
            expect(out.lines.height).toBe(16);
            expect(out.lines.lengths).toEqual([10]);
        });

        it('should produce one character entry', function ()
        {
            GetBitmapTextSize(src, false, false, out);

            expect(out.characters.length).toBe(1);
        });

        it('should store correct character data', function ()
        {
            GetBitmapTextSize(src, false, false, out);

            var ch = out.characters[0];

            expect(ch.i).toBe(0);
            expect(ch.idx).toBe(0);
            expect(ch.char).toBe('A');
            expect(ch.code).toBe(65);
            expect(ch.x).toBe(1);  // (xOffset + x) * scale = (1+0)*1
            expect(ch.y).toBe(2);  // (yOffset + yAdvance) * scale = (2+0)*1
            expect(ch.w).toBe(8);
            expect(ch.h).toBe(12);
            expect(ch.t).toBe(0);
            expect(ch.r).toBe(10); // gw * scale = 10*1
            expect(ch.b).toBe(16); // lineHeight * scale
            expect(ch.line).toBe(0);
        });

        it('should produce one word entry', function ()
        {
            GetBitmapTextSize(src, false, false, out);

            expect(out.words.length).toBe(1);
            expect(out.words[0].word).toBe('A');
            expect(out.words[0].i).toBe(0);
            expect(out.words[0].x).toBe(0);
            expect(out.words[0].y).toBe(0);
        });

        it('should set scale and scaleX/scaleY on out', function ()
        {
            GetBitmapTextSize(src, false, false, out);

            expect(out.scale).toBe(1);
            expect(out.scaleX).toBe(1);
            expect(out.scaleY).toBe(1);
        });
    });

    // -------------------------------------------------------------------------
    // Multi-character single-line text
    // -------------------------------------------------------------------------

    describe('multi-character single line text', function ()
    {
        it('should accumulate width across multiple characters', function ()
        {
            // 'AB': each char has xAdvance=10, so width should be 20
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                66: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('AB', { chars: chars, lineHeight: 16, fontDataSize: 16, fontSize: 16 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.local.width).toBe(20);
            expect(out.local.height).toBe(16);
        });

        it('should produce a character entry per non-newline character', function ()
        {
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                66: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('AB', { chars: chars });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.characters.length).toBe(2);
            expect(out.characters[0].char).toBe('A');
            expect(out.characters[1].char).toBe('B');
        });

        it('should merge adjacent non-space characters into one word', function ()
        {
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                66: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('AB', { chars: chars });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.words.length).toBe(1);
            expect(out.words[0].word).toBe('AB');
        });

        it('should split words on the wordWrapCharCode boundary', function ()
        {
            // 'A B': A=65, space=32, B=66
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                32: makeGlyph(5, 0, 0, 0, 0),
                66: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('A B', { chars: chars, wordWrapCharCode: 32 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            // Space triggers word boundary: 'A' and 'B' are separate words
            expect(out.words.length).toBe(2);
            expect(out.words[0].word).toBe('A');
            expect(out.words[1].word).toBe('B');
        });

        it('should skip characters with no matching glyph', function ()
        {
            // Only 'A' has a glyph; 'B' has no entry
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('AB', { chars: chars });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.characters.length).toBe(1);
            expect(out.characters[0].char).toBe('A');
        });
    });

    // -------------------------------------------------------------------------
    // Multi-line text
    // -------------------------------------------------------------------------

    describe('multi-line text', function ()
    {
        it('should stack lines vertically using lineHeight', function ()
        {
            // 'A\nB': two lines, height = 2 * lineHeight = 32
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                66: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('A\nB', { chars: chars, lineHeight: 16, fontDataSize: 16, fontSize: 16 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.local.height).toBe(32);
        });

        it('should track per-line widths in lines.lengths', function ()
        {
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                66: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('A\nB', { chars: chars, lineHeight: 16, fontDataSize: 16, fontSize: 16 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.lines.lengths.length).toBe(2);
            expect(out.lines.lengths[0]).toBe(10);
            expect(out.lines.lengths[1]).toBe(10);
        });

        it('should record the longest and shortest line widths', function ()
        {
            // 'AB\nC': line 0 = 20, line 1 = 10
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                66: makeGlyph(10, 0, 0, 10, 10),
                67: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('AB\nC', { chars: chars, lineHeight: 16, fontDataSize: 16, fontSize: 16 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.lines.longest).toBe(20);
            expect(out.lines.shortest).toBe(10);
        });

        it('should set the correct line index on each character', function ()
        {
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                66: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('A\nB', { chars: chars });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.characters[0].line).toBe(0);
            expect(out.characters[1].line).toBe(1);
        });

        it('should apply lineSpacing between lines', function ()
        {
            // 'A\nB' with lineSpacing=4: second line y = (lineHeight + lineSpacing) * 1 = 20
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                66: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('A\nB', {
                chars: chars,
                lineHeight: 16,
                lineSpacing: 4,
                fontDataSize: 16,
                fontSize: 16
            });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            // Second char (B) yAdvance = (16 + 4) * 1 = 20
            // gh = 20 + 16 = 36
            expect(out.local.height).toBe(36);
        });

        it('should push the in-progress word when a newline is encountered', function ()
        {
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                66: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('A\nB', { chars: chars });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            // 'A' is flushed at the newline, 'B' at end of text
            expect(out.words.length).toBe(2);
            expect(out.words[0].word).toBe('A');
            expect(out.words[1].word).toBe('B');
        });
    });

    // -------------------------------------------------------------------------
    // Scale (fontSize vs fontData.size)
    // -------------------------------------------------------------------------

    describe('scale factor', function ()
    {
        it('should scale local dimensions by fontSize / fontData.size', function ()
        {
            // scale = 32/16 = 2 → local.width = 10*2 = 20, local.height = 16*2 = 32
            var chars = { 65: makeGlyph(10, 0, 0, 10, 10) };
            var src = makeSrc('A', {
                chars: chars,
                lineHeight: 16,
                fontDataSize: 16,
                fontSize: 32
            });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.local.width).toBe(20);
            expect(out.local.height).toBe(32);
        });

        it('should report scale on the out object', function ()
        {
            var chars = { 65: makeGlyph(10, 0, 0, 10, 10) };
            var src = makeSrc('A', { chars: chars, fontDataSize: 16, fontSize: 32 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.scale).toBe(2);
        });

        it('should apply scaleX to global width but not local width', function ()
        {
            // scale=1 (fontSize==fontDataSize), scaleX=2 → sx=2
            // local.width = bw * scale = 10*1 = 10
            // global.width = bw * sx = 10*2 = 20
            var chars = { 65: makeGlyph(10, 0, 0, 10, 10) };
            var src = makeSrc('A', {
                chars: chars,
                lineHeight: 16,
                fontDataSize: 16,
                fontSize: 16,
                scaleX: 2,
                scaleY: 1
            });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.local.width).toBe(10);
            expect(out.global.width).toBe(20);
        });

        it('should store scaleX and scaleY from src on the out object', function ()
        {
            var chars = { 65: makeGlyph(10, 0, 0, 10, 10) };
            var src = makeSrc('A', { chars: chars, scaleX: 3, scaleY: 4 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.scaleX).toBe(3);
            expect(out.scaleY).toBe(4);
        });
    });

    // -------------------------------------------------------------------------
    // Global position offset
    // -------------------------------------------------------------------------

    describe('global position', function ()
    {
        it('should offset global.x/y by src.x/y minus display origins', function ()
        {
            // global.x = (src.x - src._displayOriginX) + (bx * sx)
            // With src.x=50, _displayOriginX=10, bx=0: global.x = (50-10) + 0 = 40
            var chars = { 65: makeGlyph(10, 0, 0, 10, 10) };
            var src = makeSrc('A', {
                chars: chars,
                x: 50,
                y: 30,
                _displayOriginX: 10,
                _displayOriginY: 5
            });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.global.x).toBe(40);
            expect(out.global.y).toBe(25);
        });
    });

    // -------------------------------------------------------------------------
    // Letter spacing
    // -------------------------------------------------------------------------

    describe('letter spacing', function ()
    {
        it('should increase character advance by the letterSpacing amount', function ()
        {
            // 'AB' with letterSpacing=5:
            // A: xAdvance = 0+10+5 = 15, B: x=15, gw=15+10=25
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                66: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('AB', {
                chars: chars,
                lineHeight: 16,
                fontDataSize: 16,
                fontSize: 16,
                letterSpacing: 5
            });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.local.width).toBe(25);
        });
    });

    // -------------------------------------------------------------------------
    // Kerning
    // -------------------------------------------------------------------------

    describe('kerning', function ()
    {
        it('should apply kerning offset between adjacent characters', function ()
        {
            // 'AB': glyph B has kerning offset of -2 after A (charCode 65)
            var glyphA = makeGlyph(10, 0, 0, 10, 10);
            var glyphB = {
                xAdvance: 10,
                xOffset: 0,
                yOffset: 0,
                width: 10,
                height: 10,
                kerning: { 65: -2 }
            };
            var chars = { 65: glyphA, 66: glyphB };
            var src = makeSrc('AB', { chars: chars, lineHeight: 16, fontDataSize: 16, fontSize: 16 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            // B.x = xAdvance(after A) + kerning = 10 + (-2) = 8
            // gw_B = 8 + 10 = 18 → local.width = 18
            expect(out.local.width).toBe(18);
            expect(out.characters[1].x).toBe(8); // (xOffset + x) * scale = (0+8)*1
        });
    });

    // -------------------------------------------------------------------------
    // round parameter
    // -------------------------------------------------------------------------

    describe('round parameter', function ()
    {
        it('should ceil local and global dimensions when round is true', function ()
        {
            // scale = 10/3 ≈ 0.3333... → local.width = 1*(10/3) = 3.333...
            // Math.ceil(3.333) = 4
            var chars = { 65: makeGlyph(1, 0, 0, 1, 1) };
            var src = makeSrc('A', {
                chars: chars,
                lineHeight: 3,
                fontDataSize: 3,
                fontSize: 10
            });
            var out = makeOut();

            GetBitmapTextSize(src, true, false, out);

            // local.width = ceil(1 * 10/3) = ceil(3.333) = 4
            expect(out.local.width).toBe(4);
            // local.height = ceil(3 * 10/3) = ceil(10) = 10
            expect(out.local.height).toBe(10);
        });

        it('should ceil line lengths when round is true', function ()
        {
            var chars = { 65: makeGlyph(1, 0, 0, 1, 1) };
            var src = makeSrc('A', {
                chars: chars,
                lineHeight: 3,
                fontDataSize: 3,
                fontSize: 10
            });
            var out = makeOut();

            GetBitmapTextSize(src, true, false, out);

            // currentLineWidth = gw * scale = 1 * (10/3) = 3.333, ceil = 4
            // lines.longest = ceil(3.333) = 4
            expect(out.lines.longest).toBe(4);
            expect(out.lines.shortest).toBe(4);
        });

        it('should not round values when round is false', function ()
        {
            var chars = { 65: makeGlyph(1, 0, 0, 1, 1) };
            var src = makeSrc('A', {
                chars: chars,
                lineHeight: 3,
                fontDataSize: 3,
                fontSize: 10
            });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            // local.width = 1 * (10/3)
            expect(out.local.width).toBeCloseTo(3.333, 2);
        });
    });

    // -------------------------------------------------------------------------
    // updateOrigin parameter
    // -------------------------------------------------------------------------

    describe('updateOrigin parameter', function ()
    {
        it('should update src._displayOriginX and src._displayOriginY', function ()
        {
            // originX=0.5, originY=0.5, local.width=10, local.height=16
            // _displayOriginX = 0.5 * 10 = 5, _displayOriginY = 0.5 * 16 = 8
            var chars = { 65: makeGlyph(10, 0, 0, 10, 10) };
            var src = makeSrc('A', {
                chars: chars,
                lineHeight: 16,
                fontDataSize: 16,
                fontSize: 16,
                originX: 0.5,
                originY: 0.5
            });
            var out = makeOut();

            GetBitmapTextSize(src, false, true, out);

            expect(src._displayOriginX).toBe(5);
            expect(src._displayOriginY).toBe(8);
        });

        it('should recalculate global.x and global.y using updated display origins', function ()
        {
            // src.x=100, src.y=100, originX=0.5, originY=0.5, scaleX=1, scaleY=1
            // After update: _displayOriginX=5, _displayOriginY=8
            // global.x = 100 - (5 * 1) = 95, global.y = 100 - (8 * 1) = 92
            var chars = { 65: makeGlyph(10, 0, 0, 10, 10) };
            var src = makeSrc('A', {
                chars: chars,
                lineHeight: 16,
                fontDataSize: 16,
                fontSize: 16,
                x: 100,
                y: 100,
                originX: 0.5,
                originY: 0.5
            });
            var out = makeOut();

            GetBitmapTextSize(src, false, true, out);

            expect(out.global.x).toBe(95);
            expect(out.global.y).toBe(92);
        });

        it('should not modify src._displayOriginX/Y when updateOrigin is false', function ()
        {
            var chars = { 65: makeGlyph(10, 0, 0, 10, 10) };
            var src = makeSrc('A', {
                chars: chars,
                _displayOriginX: 99,
                _displayOriginY: 88,
                originX: 0.5,
                originY: 0.5
            });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(src._displayOriginX).toBe(99);
            expect(src._displayOriginY).toBe(88);
        });

        it('should ceil global.x and global.y after updateOrigin when round is true', function ()
        {
            // scale = 10/3, local.width = 1 * 10/3 = 3.333
            // originX=0.5: _displayOriginX = 0.5 * 3.333 = 1.666
            // global.x = 0 - (1.666 * 1) = -1.666, ceil = -1
            var chars = { 65: makeGlyph(1, 0, 0, 1, 1) };
            var src = makeSrc('A', {
                chars: chars,
                lineHeight: 3,
                fontDataSize: 3,
                fontSize: 10,
                originX: 0.5,
                originY: 0.5
            });
            var out = makeOut();

            GetBitmapTextSize(src, true, true, out);

            expect(out.global.x).toBe(Math.ceil(src.x - (src._displayOriginX * src.scaleX)));
            expect(out.global.y).toBe(Math.ceil(src.y - (src._displayOriginY * src.scaleY)));
        });
    });

    // -------------------------------------------------------------------------
    // Alignment
    // -------------------------------------------------------------------------

    describe('alignment', function ()
    {
        // 'AB\nC': line 0 width=20, line 1 width=10; longestLine=20
        var chars;

        beforeEach(function ()
        {
            chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                66: makeGlyph(10, 0, 0, 10, 10),
                67: makeGlyph(10, 0, 0, 10, 10)
            };
        });

        it('should not shift characters with left alignment (align=0)', function ()
        {
            var src = makeSrc('AB\nC', { chars: chars, _align: 0, lineHeight: 16, fontDataSize: 16, fontSize: 16 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            // C is on line 1 with width 10; no shift expected
            expect(out.characters[2].x).toBe(0); // xOffset=0, x=0, scale=1
            expect(out.characters[2].r).toBe(10); // gw*scale = 10
        });

        it('should centre-shift shorter lines with centre alignment (align=1)', function ()
        {
            var src = makeSrc('AB\nC', { chars: chars, _align: 1, lineHeight: 16, fontDataSize: 16, fontSize: 16 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            // C line 1: ax1 = (longestLine - lineWidths[1]) / 2 = (20 - 10) / 2 = 5
            // C.x = (xOffset + x) * scale + ax1 = 0 + 5 = 5
            // C.r = gw * scale + ax1 = 10 + 5 = 15
            expect(out.characters[2].x).toBe(5);
            expect(out.characters[2].r).toBe(15);
        });

        it('should not shift the longest line with centre alignment (align=1)', function ()
        {
            var src = makeSrc('AB\nC', { chars: chars, _align: 1, lineHeight: 16, fontDataSize: 16, fontSize: 16 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            // A is on line 0 (the longest line); no shift expected
            expect(out.characters[0].x).toBe(0);
        });

        it('should right-shift shorter lines with right alignment (align=2)', function ()
        {
            var src = makeSrc('AB\nC', { chars: chars, _align: 2, lineHeight: 16, fontDataSize: 16, fontSize: 16 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            // C line 1: ax2 = longestLine - lineWidths[1] = 20 - 10 = 10
            // C.x = 0 + 10 = 10, C.r = 10 + 10 = 20
            expect(out.characters[2].x).toBe(10);
            expect(out.characters[2].r).toBe(20);
        });

        it('should not shift the longest line with right alignment (align=2)', function ()
        {
            var src = makeSrc('AB\nC', { chars: chars, _align: 2, lineHeight: 16, fontDataSize: 16, fontSize: 16 });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.characters[0].x).toBe(0);
        });
    });

    // -------------------------------------------------------------------------
    // Word wrap / maxWidth
    // -------------------------------------------------------------------------

    describe('word wrap', function ()
    {
        it('should set wrappedText when maxWidth forces a line break', function ()
        {
            // 'AB CD': each char xAdvance=10, maxWidth=25
            // 'AB ' = 30 > 25, so wrap after 'AB'; result 'AB\nCD'
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10), // A
                66: makeGlyph(10, 0, 0, 10, 10), // B
                32: makeGlyph(10, 0, 0, 0, 0),   // space
                67: makeGlyph(10, 0, 0, 10, 10), // C
                68: makeGlyph(10, 0, 0, 10, 10)  // D
            };
            var src = makeSrc('AB CD', {
                chars: chars,
                lineHeight: 16,
                fontDataSize: 16,
                fontSize: 16,
                maxWidth: 25,
                wordWrapCharCode: 32
            });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            expect(out.wrappedText).toBe('AB\nCD');
        });

        it('should not set wrappedText when text fits within maxWidth', function ()
        {
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                66: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('AB', {
                chars: chars,
                fontDataSize: 16,
                fontSize: 16,
                maxWidth: 100,
                wordWrapCharCode: 32
            });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            // text fits, wrappedText mirrors the original
            expect(out.wrappedText).toBe('AB');
        });

        it('should not perform word wrap when maxWidth is zero', function ()
        {
            var chars = {
                65: makeGlyph(10, 0, 0, 10, 10),
                32: makeGlyph(5, 0, 0, 0, 0),
                66: makeGlyph(10, 0, 0, 10, 10)
            };
            var src = makeSrc('A B', {
                chars: chars,
                fontDataSize: 16,
                fontSize: 16,
                maxWidth: 0
            });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);

            // maxWidth=0 disables word wrap; wrappedText stays empty
            expect(out.wrappedText).toBe('');
        });
    });

    // -------------------------------------------------------------------------
    // Reuse of out object
    // -------------------------------------------------------------------------

    describe('out object reuse', function ()
    {
        it('should return the same out object that was passed in', function ()
        {
            var chars = { 65: makeGlyph(10, 0, 0, 10, 10) };
            var src = makeSrc('A', { chars: chars });
            var out = makeOut();
            var result = GetBitmapTextSize(src, false, false, out);

            expect(result).toBe(out);
        });

        it('should overwrite characters and words arrays on repeated calls', function ()
        {
            var chars = { 65: makeGlyph(10, 0, 0, 10, 10) };
            var src = makeSrc('A', { chars: chars });
            var out = makeOut();

            GetBitmapTextSize(src, false, false, out);
            expect(out.characters.length).toBe(1);

            // Second call with empty text (no glyphs match) should replace arrays
            src.text = '';
            GetBitmapTextSize(src, false, false, out);
            expect(out.characters.length).toBe(0);
        });
    });
});
