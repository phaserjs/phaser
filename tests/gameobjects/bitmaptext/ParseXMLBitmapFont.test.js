var ParseXMLBitmapFont = require('../../../src/gameobjects/bitmaptext/ParseXMLBitmapFont');

function createMockNode (attrs)
{
    return {
        getAttribute: function (name)
        {
            return attrs[name] !== undefined ? String(attrs[name]) : null;
        }
    };
}

function createMockXML (infoAttrs, commonAttrs, charNodes, kerningNodes)
{
    var info = createMockNode(infoAttrs);
    var common = createMockNode(commonAttrs);

    return {
        getElementsByTagName: function (tag)
        {
            if (tag === 'info') { return [ info ]; }
            if (tag === 'common') { return [ common ]; }
            if (tag === 'char') { return charNodes || []; }
            if (tag === 'kerning') { return kerningNodes || []; }
            return [];
        }
    };
}

function createMockFrame (options)
{
    options = options || {};
    return {
        cutX: options.cutX !== undefined ? options.cutX : 0,
        cutY: options.cutY !== undefined ? options.cutY : 0,
        source: {
            width: options.sourceWidth !== undefined ? options.sourceWidth : 512,
            height: options.sourceHeight !== undefined ? options.sourceHeight : 512
        },
        sourceIndex: options.sourceIndex !== undefined ? options.sourceIndex : 0,
        trimmed: options.trimmed || false,
        data: {
            spriteSourceSize: {
                x: options.trimX !== undefined ? options.trimX : 0,
                y: options.trimY !== undefined ? options.trimY : 0
            },
            cut: {
                x: options.cutDataX !== undefined ? options.cutDataX : 0,
                y: options.cutDataY !== undefined ? options.cutDataY : 0
            }
        }
    };
}

function createCharNode (id, x, y, w, h, xoffset, yoffset, xadvance)
{
    return createMockNode({
        id: id,
        x: x,
        y: y,
        width: w,
        height: h,
        xoffset: xoffset !== undefined ? xoffset : 0,
        yoffset: yoffset !== undefined ? yoffset : 0,
        xadvance: xadvance !== undefined ? xadvance : w
    });
}

describe('ParseXMLBitmapFont', function ()
{
    var xml;
    var frame;

    beforeEach(function ()
    {
        xml = createMockXML(
            { face: 'Arial', size: 32 },
            { lineHeight: 40 },
            [
                createCharNode(65, 10, 20, 16, 18, 1, 2, 17)  // 'A'
            ],
            []
        );

        frame = createMockFrame();
    });

    describe('return value structure', function ()
    {
        it('should return an object with font, size, lineHeight, and chars properties', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result).toHaveProperty('font');
            expect(result).toHaveProperty('size');
            expect(result).toHaveProperty('lineHeight');
            expect(result).toHaveProperty('chars');
        });

        it('should parse font face name from info element', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.font).toBe('Arial');
        });

        it('should parse font size as integer from info element', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.size).toBe(32);
        });

        it('should parse lineHeight as integer from common element', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.lineHeight).toBe(40);
        });

        it('should return chars as an object', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(typeof result.chars).toBe('object');
        });
    });

    describe('ySpacing parameter', function ()
    {
        it('should default ySpacing to 0', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.lineHeight).toBe(40);
        });

        it('should add ySpacing to lineHeight', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame, 0, 10);
            expect(result.lineHeight).toBe(50);
        });

        it('should subtract ySpacing from lineHeight when negative', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame, 0, -5);
            expect(result.lineHeight).toBe(35);
        });
    });

    describe('character parsing', function ()
    {
        it('should key chars by char code', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65]).toBeDefined();
        });

        it('should parse character x and y positions', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].x).toBe(10);
            expect(result.chars[65].y).toBe(20);
        });

        it('should parse character width and height', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].width).toBe(16);
            expect(result.chars[65].height).toBe(18);
        });

        it('should compute centerX as floor of width / 2', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].centerX).toBe(8);
        });

        it('should compute centerY as floor of height / 2', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].centerY).toBe(9);
        });

        it('should floor centerX for odd widths', function ()
        {
            xml = createMockXML(
                { face: 'Test', size: 16 },
                { lineHeight: 20 },
                [ createCharNode(65, 0, 0, 17, 19) ],
                []
            );
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].centerX).toBe(8);
            expect(result.chars[65].centerY).toBe(9);
        });

        it('should parse xOffset and yOffset', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].xOffset).toBe(1);
            expect(result.chars[65].yOffset).toBe(2);
        });

        it('should parse xAdvance', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].xAdvance).toBe(17);
        });

        it('should initialise char data and kerning as empty objects', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(typeof result.chars[65].data).toBe('object');
            expect(typeof result.chars[65].kerning).toBe('object');
        });
    });

    describe('xSpacing parameter', function ()
    {
        it('should default xSpacing to 0', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].xAdvance).toBe(17);
        });

        it('should add xSpacing to each character xAdvance', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame, 5);
            expect(result.chars[65].xAdvance).toBe(22);
        });

        it('should subtract xSpacing from each character xAdvance when negative', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame, -3);
            expect(result.chars[65].xAdvance).toBe(14);
        });
    });

    describe('UV coordinate calculation', function ()
    {
        it('should compute u0 as (textureX + gx) / textureWidth', function ()
        {
            // frame cutX=0, gx=10, textureWidth=512
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].u0).toBeCloseTo(10 / 512);
        });

        it('should compute u1 as (textureX + gx + gw) / textureWidth', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].u1).toBeCloseTo((10 + 16) / 512);
        });

        it('should compute v0 as 1 - (textureY + gy) / textureHeight', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].v0).toBeCloseTo(1 - 20 / 512);
        });

        it('should compute v1 as 1 - (textureY + gy + gh) / textureHeight', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].v1).toBeCloseTo(1 - (20 + 18) / 512);
        });

        it('should account for frame cutX and cutY in UV calculation', function ()
        {
            frame = createMockFrame({ cutX: 64, cutY: 32 });
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].u0).toBeCloseTo((64 + 10) / 512);
            expect(result.chars[65].v0).toBeCloseTo(1 - (32 + 20) / 512);
        });
    });

    describe('multiple characters', function ()
    {
        it('should parse all characters in the xml', function ()
        {
            xml = createMockXML(
                { face: 'Font', size: 16 },
                { lineHeight: 20 },
                [
                    createCharNode(65, 0, 0, 8, 10),
                    createCharNode(66, 10, 0, 8, 10),
                    createCharNode(67, 20, 0, 8, 10)
                ],
                []
            );
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65]).toBeDefined();
            expect(result.chars[66]).toBeDefined();
            expect(result.chars[67]).toBeDefined();
        });

        it('should return an empty chars object when there are no char nodes', function ()
        {
            xml = createMockXML(
                { face: 'Empty', size: 16 },
                { lineHeight: 20 },
                [],
                []
            );
            var result = ParseXMLBitmapFont(xml, frame);
            expect(Object.keys(result.chars).length).toBe(0);
        });
    });

    describe('kerning', function ()
    {
        it('should store kerning amounts on the second character keyed by first', function ()
        {
            xml = createMockXML(
                { face: 'Font', size: 16 },
                { lineHeight: 20 },
                [
                    createCharNode(65, 0, 0, 8, 10),
                    createCharNode(86, 10, 0, 8, 10)
                ],
                [
                    createMockNode({ first: 65, second: 86, amount: -2 })
                ]
            );
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[86].kerning[65]).toBe(-2);
        });

        it('should handle multiple kerning pairs', function ()
        {
            xml = createMockXML(
                { face: 'Font', size: 16 },
                { lineHeight: 20 },
                [
                    createCharNode(65, 0, 0, 8, 10),
                    createCharNode(84, 10, 0, 8, 10),
                    createCharNode(86, 20, 0, 8, 10)
                ],
                [
                    createMockNode({ first: 65, second: 84, amount: -1 }),
                    createMockNode({ first: 65, second: 86, amount: -3 })
                ]
            );
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[84].kerning[65]).toBe(-1);
            expect(result.chars[86].kerning[65]).toBe(-3);
        });

        it('should leave kerning empty when no kerning nodes exist', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(Object.keys(result.chars[65].kerning).length).toBe(0);
        });
    });

    describe('frame trim adjustment', function ()
    {
        it('should not adjust gx/gy when frame is not trimmed', function ()
        {
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].x).toBe(10);
            expect(result.chars[65].y).toBe(20);
        });

        it('should subtract trimX and trimY from gx and gy when frame is trimmed', function ()
        {
            frame = createMockFrame({ trimmed: true, trimX: 4, trimY: 6 });
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].x).toBe(6);
            expect(result.chars[65].y).toBe(14);
        });

        it('should handle zero trim offset on a trimmed frame', function ()
        {
            frame = createMockFrame({ trimmed: true, trimX: 0, trimY: 0 });
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65].x).toBe(10);
            expect(result.chars[65].y).toBe(20);
        });
    });

    describe('texture parameter', function ()
    {
        it('should call texture.add for each character with non-zero dimensions', function ()
        {
            var mockTexture = { add: vi.fn() };
            var result = ParseXMLBitmapFont(xml, frame, 0, 0, mockTexture);
            expect(mockTexture.add).toHaveBeenCalledTimes(1);
            expect(result.chars[65]).toBeDefined();
        });

        it('should pass correct arguments to texture.add', function ()
        {
            frame = createMockFrame({ cutDataX: 5, cutDataY: 3, sourceIndex: 2 });
            var mockTexture = { add: vi.fn() };
            ParseXMLBitmapFont(xml, frame, 0, 0, mockTexture);
            // letter 'A', sourceIndex 2, gx + cut.x, gy + cut.y, gw, gh
            expect(mockTexture.add).toHaveBeenCalledWith('A', 2, 10 + 5, 20 + 3, 16, 18);
        });

        it('should not call texture.add when glyph width is zero', function ()
        {
            xml = createMockXML(
                { face: 'Font', size: 16 },
                { lineHeight: 20 },
                [ createCharNode(32, 0, 0, 0, 10) ],  // space char
                []
            );
            var mockTexture = { add: vi.fn() };
            ParseXMLBitmapFont(xml, frame, 0, 0, mockTexture);
            expect(mockTexture.add).not.toHaveBeenCalled();
        });

        it('should not call texture.add when glyph height is zero', function ()
        {
            xml = createMockXML(
                { face: 'Font', size: 16 },
                { lineHeight: 20 },
                [ createCharNode(32, 0, 0, 10, 0) ],
                []
            );
            var mockTexture = { add: vi.fn() };
            ParseXMLBitmapFont(xml, frame, 0, 0, mockTexture);
            expect(mockTexture.add).not.toHaveBeenCalled();
        });

        it('should not call texture.add when texture is not provided', function ()
        {
            // Should not throw even without texture
            var result = ParseXMLBitmapFont(xml, frame);
            expect(result.chars[65]).toBeDefined();
        });
    });
});
