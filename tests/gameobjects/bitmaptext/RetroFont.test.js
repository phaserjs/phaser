var RetroFont = require('../../../src/gameobjects/bitmaptext/RetroFont');

describe('RetroFont', function ()
{
    describe('constants', function ()
    {
        it('should export TEXT_SET1 with full printable ASCII range', function ()
        {
            expect(typeof RetroFont.TEXT_SET1).toBe('string');
            expect(RetroFont.TEXT_SET1.charAt(0)).toBe(' ');
            expect(RetroFont.TEXT_SET1.charAt(RetroFont.TEXT_SET1.length - 1)).toBe('~');
        });

        it('should export TEXT_SET2 with characters up to uppercase Z', function ()
        {
            expect(typeof RetroFont.TEXT_SET2).toBe('string');
            expect(RetroFont.TEXT_SET2.charAt(0)).toBe(' ');
            expect(RetroFont.TEXT_SET2.charAt(RetroFont.TEXT_SET2.length - 1)).toBe('Z');
        });

        it('should export TEXT_SET3 with uppercase letters then digits then space', function ()
        {
            expect(typeof RetroFont.TEXT_SET3).toBe('string');
            expect(RetroFont.TEXT_SET3.charAt(0)).toBe('A');
            expect(RetroFont.TEXT_SET3.charAt(RetroFont.TEXT_SET3.length - 1)).toBe(' ');
            expect(RetroFont.TEXT_SET3).toContain('Z');
            expect(RetroFont.TEXT_SET3).toContain('9');
        });

        it('should export TEXT_SET4 with space between alphabet and digits', function ()
        {
            expect(typeof RetroFont.TEXT_SET4).toBe('string');
            expect(RetroFont.TEXT_SET4.charAt(0)).toBe('A');
            expect(RetroFont.TEXT_SET4).toContain(' ');
            expect(RetroFont.TEXT_SET4.charAt(RetroFont.TEXT_SET4.length - 1)).toBe('9');
        });

        it('should export TEXT_SET5 with uppercase letters and punctuation', function ()
        {
            expect(typeof RetroFont.TEXT_SET5).toBe('string');
            expect(RetroFont.TEXT_SET5.charAt(0)).toBe('A');
            expect(RetroFont.TEXT_SET5).toContain('.');
            expect(RetroFont.TEXT_SET5).toContain('?');
            expect(RetroFont.TEXT_SET5).toContain('9');
        });

        it('should export TEXT_SET6 with uppercase letters, digits and punctuation', function ()
        {
            expect(typeof RetroFont.TEXT_SET6).toBe('string');
            expect(RetroFont.TEXT_SET6.charAt(0)).toBe('A');
            expect(RetroFont.TEXT_SET6).toContain('!');
            expect(RetroFont.TEXT_SET6).toContain('?');
        });

        it('should export TEXT_SET7 with interleaved character order', function ()
        {
            expect(typeof RetroFont.TEXT_SET7).toBe('string');
            expect(RetroFont.TEXT_SET7.charAt(0)).toBe('A');
            expect(RetroFont.TEXT_SET7.charAt(1)).toBe('G');
            expect(RetroFont.TEXT_SET7.charAt(2)).toBe('M');
        });

        it('should export TEXT_SET8 with digits first then letters', function ()
        {
            expect(typeof RetroFont.TEXT_SET8).toBe('string');
            expect(RetroFont.TEXT_SET8.charAt(0)).toBe('0');
            expect(RetroFont.TEXT_SET8.charAt(RetroFont.TEXT_SET8.length - 1)).toBe('Z');
        });

        it('should export TEXT_SET9 with uppercase letters and sentence punctuation', function ()
        {
            expect(typeof RetroFont.TEXT_SET9).toBe('string');
            expect(RetroFont.TEXT_SET9.charAt(0)).toBe('A');
            expect(RetroFont.TEXT_SET9).toContain('!');
            expect(RetroFont.TEXT_SET9).toContain('?');
        });

        it('should export TEXT_SET10 with only uppercase alphabet', function ()
        {
            expect(typeof RetroFont.TEXT_SET10).toBe('string');
            expect(RetroFont.TEXT_SET10).toBe('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
            expect(RetroFont.TEXT_SET10.length).toBe(26);
        });

        it('should export TEXT_SET11 with uppercase letters, punctuation and digits', function ()
        {
            expect(typeof RetroFont.TEXT_SET11).toBe('string');
            expect(RetroFont.TEXT_SET11.charAt(0)).toBe('A');
            expect(RetroFont.TEXT_SET11).toContain('0');
            expect(RetroFont.TEXT_SET11).toContain('9');
        });
    });

    describe('Parse', function ()
    {
        function makeScene(textureWidth, textureHeight, cutX, cutY)
        {
            if (cutX === undefined) { cutX = 0; }
            if (cutY === undefined) { cutY = 0; }

            return {
                sys: {
                    textures: {
                        getFrame: function ()
                        {
                            return {
                                cutX: cutX,
                                cutY: cutY,
                                source: {
                                    width: textureWidth,
                                    height: textureHeight
                                }
                            };
                        }
                    }
                }
            };
        }

        it('should return undefined when chars is empty string', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, { width: 16, height: 16, chars: '', image: 'font' });

            expect(result).toBeUndefined();
        });

        it('should return an object with data, frame, and texture properties', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'ABC',
                image: 'myfont'
            });

            expect(result).not.toBeUndefined();
            expect(result.frame).toBeNull();
            expect(result.texture).toBe('myfont');
            expect(typeof result.data).toBe('object');
        });

        it('should set retroFont flag to true on data', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'A',
                image: 'font'
            });

            expect(result.data.retroFont).toBe(true);
        });

        it('should set size to the character width', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 24,
                height: 32,
                chars: 'A',
                image: 'font'
            });

            expect(result.data.size).toBe(24);
        });

        it('should set lineHeight to height plus lineSpacing', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 20,
                chars: 'A',
                image: 'font',
                lineSpacing: 4
            });

            expect(result.data.lineHeight).toBe(24);
        });

        it('should set lineHeight to height when lineSpacing is not provided', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 20,
                chars: 'A',
                image: 'font'
            });

            expect(result.data.lineHeight).toBe(20);
        });

        it('should generate a glyph entry for each character', function ()
        {
            var scene = makeScene(256, 256);
            var chars = 'ABCDE';
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: chars,
                image: 'font'
            });

            expect(Object.keys(result.data.chars).length).toBe(chars.length);

            for (var i = 0; i < chars.length; i++)
            {
                var code = chars.charCodeAt(i);
                expect(result.data.chars[code]).toBeDefined();
            }
        });

        it('should set correct width and height on each glyph', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 24,
                chars: 'A',
                image: 'font'
            });

            var glyph = result.data.chars['A'.charCodeAt(0)];

            expect(glyph.width).toBe(16);
            expect(glyph.height).toBe(24);
        });

        it('should set xAdvance equal to the character width', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'A',
                image: 'font'
            });

            var glyph = result.data.chars['A'.charCodeAt(0)];

            expect(glyph.xAdvance).toBe(16);
        });

        it('should set xOffset and yOffset to zero', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'AB',
                image: 'font'
            });

            var glyphA = result.data.chars['A'.charCodeAt(0)];
            var glyphB = result.data.chars['B'.charCodeAt(0)];

            expect(glyphA.xOffset).toBe(0);
            expect(glyphA.yOffset).toBe(0);
            expect(glyphB.xOffset).toBe(0);
            expect(glyphB.yOffset).toBe(0);
        });

        it('should compute centerX and centerY as floor of half width/height', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 17,
                height: 19,
                chars: 'A',
                image: 'font'
            });

            var glyph = result.data.chars['A'.charCodeAt(0)];

            expect(glyph.centerX).toBe(8);
            expect(glyph.centerY).toBe(9);
        });

        it('should lay out characters left to right with spacing', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'ABC',
                image: 'font',
                spacing: { x: 2, y: 0 },
                charsPerRow: 10
            });

            var glyphA = result.data.chars['A'.charCodeAt(0)];
            var glyphB = result.data.chars['B'.charCodeAt(0)];
            var glyphC = result.data.chars['C'.charCodeAt(0)];

            expect(glyphA.x).toBe(0);
            expect(glyphB.x).toBe(18);
            expect(glyphC.x).toBe(36);
        });

        it('should wrap to next row when charsPerRow is reached', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'ABCD',
                image: 'font',
                charsPerRow: 2
            });

            var glyphA = result.data.chars['A'.charCodeAt(0)];
            var glyphB = result.data.chars['B'.charCodeAt(0)];
            var glyphC = result.data.chars['C'.charCodeAt(0)];
            var glyphD = result.data.chars['D'.charCodeAt(0)];

            expect(glyphA.x).toBe(0);
            expect(glyphA.y).toBe(0);
            expect(glyphB.x).toBe(16);
            expect(glyphB.y).toBe(0);
            expect(glyphC.x).toBe(0);
            expect(glyphC.y).toBe(16);
            expect(glyphD.x).toBe(16);
            expect(glyphD.y).toBe(16);
        });

        it('should apply offsetX and offsetY to glyph positions', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'A',
                image: 'font',
                offset: { x: 4, y: 8 }
            });

            var glyph = result.data.chars['A'.charCodeAt(0)];

            expect(glyph.x).toBe(4);
            expect(glyph.y).toBe(8);
        });

        it('should apply vertical spacing when wrapping rows', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'ABC',
                image: 'font',
                charsPerRow: 2,
                spacing: { x: 0, y: 4 }
            });

            var glyphC = result.data.chars['C'.charCodeAt(0)];

            expect(glyphC.y).toBe(20);
        });

        it('should compute u0 and u1 UV coordinates correctly', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'A',
                image: 'font'
            });

            var glyph = result.data.chars['A'.charCodeAt(0)];

            expect(glyph.u0).toBeCloseTo(0 / 256);
            expect(glyph.u1).toBeCloseTo(16 / 256);
        });

        it('should compute v0 and v1 UV coordinates correctly', function ()
        {
            var scene = makeScene(256, 256);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'A',
                image: 'font'
            });

            var glyph = result.data.chars['A'.charCodeAt(0)];

            expect(glyph.v0).toBeCloseTo(1 - 0 / 256);
            expect(glyph.v1).toBeCloseTo(1 - 16 / 256);
        });

        it('should account for cutX and cutY in UV computation', function ()
        {
            var scene = makeScene(256, 256, 32, 64);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'A',
                image: 'font'
            });

            var glyph = result.data.chars['A'.charCodeAt(0)];

            expect(glyph.u0).toBeCloseTo(32 / 256);
            expect(glyph.u1).toBeCloseTo(48 / 256);
            expect(glyph.v0).toBeCloseTo(1 - 64 / 256);
            expect(glyph.v1).toBeCloseTo(1 - 80 / 256);
        });

        it('should infer charsPerRow from texture width when not specified', function ()
        {
            var scene = makeScene(64, 16);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'ABCDEFGH',
                image: 'font'
            });

            var glyphA = result.data.chars['A'.charCodeAt(0)];
            var glyphE = result.data.chars['E'.charCodeAt(0)];

            expect(glyphA.y).toBe(0);
            expect(glyphE.y).toBe(16);
        });

        it('should cap inferred charsPerRow to letters.length', function ()
        {
            var scene = makeScene(512, 512);
            var result = RetroFont.Parse(scene, {
                width: 16,
                height: 16,
                chars: 'AB',
                image: 'font'
            });

            var glyphA = result.data.chars['A'.charCodeAt(0)];
            var glyphB = result.data.chars['B'.charCodeAt(0)];

            expect(glyphA.y).toBe(0);
            expect(glyphB.y).toBe(0);
        });
    });
});
