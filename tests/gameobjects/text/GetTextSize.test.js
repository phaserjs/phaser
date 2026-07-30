var GetTextSize = require('../../../src/gameobjects/text/GetTextSize');

describe('Phaser.GameObjects.GetTextSize', function ()
{
    var mockText;
    var mockSize;
    var lines;

    beforeEach(function ()
    {
        mockText = {
            canvas: {},
            context: {
                measureText: function (str)
                {
                    return { width: str.length * 10 };
                }
            },
            style: {
                maxLines: 0,
                strokeThickness: 0,
                wordWrap: false,
                syncFont: function () {}
            },
            letterSpacing: 0,
            lineSpacing: 0
        };

        mockSize = {
            fontSize: 16
        };

        lines = [ 'hello', 'world' ];
    });

    it('should return an object with the expected keys', function ()
    {
        var result = GetTextSize(mockText, mockSize, lines);

        expect(result).toHaveProperty('width');
        expect(result).toHaveProperty('height');
        expect(result).toHaveProperty('lines');
        expect(result).toHaveProperty('lineWidths');
        expect(result).toHaveProperty('lineSpacing');
        expect(result).toHaveProperty('lineHeight');
    });

    it('should return correct line count for all lines when maxLines is 0', function ()
    {
        var result = GetTextSize(mockText, mockSize, lines);

        expect(result.lines).toBe(2);
    });

    it('should respect maxLines when set and less than total lines', function ()
    {
        mockText.style.maxLines = 1;

        var result = GetTextSize(mockText, mockSize, lines);

        expect(result.lines).toBe(1);
    });

    it('should not limit lines when maxLines equals total lines', function ()
    {
        mockText.style.maxLines = 2;

        var result = GetTextSize(mockText, mockSize, lines);

        expect(result.lines).toBe(2);
    });

    it('should not limit lines when maxLines exceeds total lines', function ()
    {
        mockText.style.maxLines = 10;

        var result = GetTextSize(mockText, mockSize, lines);

        expect(result.lines).toBe(2);
    });

    it('should calculate width as max of all line widths', function ()
    {
        // 'hello' = 5 chars * 10 = 50, 'world' = 5 chars * 10 = 50
        var result = GetTextSize(mockText, mockSize, [ 'hello', 'hi' ]);

        expect(result.width).toBe(50);
    });

    it('should include strokeThickness in each line width', function ()
    {
        mockText.style.strokeThickness = 4;

        // 'abc' = 3 * 10 = 30, plus 4 strokeThickness = 34
        var result = GetTextSize(mockText, mockSize, [ 'abc' ]);

        expect(result.width).toBe(34);
    });

    it('should calculate lineHeight as fontSize plus strokeThickness', function ()
    {
        mockSize.fontSize = 20;
        mockText.style.strokeThickness = 4;

        var result = GetTextSize(mockText, mockSize, lines);

        expect(result.lineHeight).toBe(24);
    });

    it('should calculate height as lineHeight times number of drawn lines with no spacing', function ()
    {
        mockSize.fontSize = 16;
        mockText.style.strokeThickness = 0;
        mockText.lineSpacing = 0;

        var result = GetTextSize(mockText, mockSize, [ 'a', 'b', 'c' ]);

        expect(result.height).toBe(48);
    });

    it('should add lineSpacing between lines when drawnLines > 1', function ()
    {
        mockSize.fontSize = 16;
        mockText.style.strokeThickness = 0;
        mockText.lineSpacing = 10;

        // 2 lines: height = 16 * 2 + 10 * 1 = 42
        var result = GetTextSize(mockText, mockSize, [ 'a', 'b' ]);

        expect(result.height).toBe(42);
    });

    it('should not add lineSpacing for a single line', function ()
    {
        mockSize.fontSize = 16;
        mockText.style.strokeThickness = 0;
        mockText.lineSpacing = 10;

        var result = GetTextSize(mockText, mockSize, [ 'a' ]);

        expect(result.height).toBe(16);
    });

    it('should add lineSpacing for multiple lines with maxLines applied', function ()
    {
        mockSize.fontSize = 16;
        mockText.style.strokeThickness = 0;
        mockText.lineSpacing = 5;
        mockText.style.maxLines = 2;

        // 3 lines but maxLines=2: height = 16 * 2 + 5 * 1 = 37
        var result = GetTextSize(mockText, mockSize, [ 'a', 'b', 'c' ]);

        expect(result.height).toBe(37);
    });

    it('should return lineSpacing from text object', function ()
    {
        mockText.lineSpacing = 8;

        var result = GetTextSize(mockText, mockSize, lines);

        expect(result.lineSpacing).toBe(8);
    });

    it('should return an array of individual line widths', function ()
    {
        // 'hi' = 2 * 10 = 20, 'hello' = 5 * 10 = 50
        var result = GetTextSize(mockText, mockSize, [ 'hi', 'hello' ]);

        expect(result.lineWidths).toHaveLength(2);
        expect(result.lineWidths[0]).toBe(20);
        expect(result.lineWidths[1]).toBe(50);
    });

    it('should ceil fractional line widths', function ()
    {
        mockText.context.measureText = function (str)
        {
            return { width: str.length * 10.3 };
        };

        // 'ab' = 2 * 10.3 = 20.6, ceil = 21
        var result = GetTextSize(mockText, mockSize, [ 'ab' ]);

        expect(result.lineWidths[0]).toBe(21);
    });

    it('should handle empty lines array', function ()
    {
        var result = GetTextSize(mockText, mockSize, []);

        expect(result.lines).toBe(0);
        expect(result.width).toBe(0);
        expect(result.lineWidths).toHaveLength(0);
    });

    it('should handle a single empty string line', function ()
    {
        mockText.style.strokeThickness = 0;

        var result = GetTextSize(mockText, mockSize, [ '' ]);

        expect(result.width).toBe(0);
        expect(result.lines).toBe(1);
    });

    it('should use letterSpacing to sum individual character widths', function ()
    {
        mockText.letterSpacing = 5;

        // 'abc' = 3 chars, each 10 wide = 30, plus 5 spacing * (3-1) = 10 => total 40
        var result = GetTextSize(mockText, mockSize, [ 'abc' ]);

        expect(result.width).toBe(40);
    });

    it('should not add letterSpacing for a single character', function ()
    {
        mockText.letterSpacing = 5;

        // 'a' = 1 char = 10, no spacing added
        var result = GetTextSize(mockText, mockSize, [ 'a' ]);

        expect(result.width).toBe(10);
    });

    it('should subtract word wrap space width when wordWrap is enabled', function ()
    {
        mockText.style.wordWrap = true;
        mockText.style.strokeThickness = 0;

        // measureText(' ') = 1 * 10 = 10
        // 'hello' = 5 * 10 = 50, minus 10 = 40
        var result = GetTextSize(mockText, mockSize, [ 'hello' ]);

        expect(result.width).toBe(40);
    });

    it('should call syncFont on the style with canvas and context', function ()
    {
        var syncFontCalled = false;
        var syncCanvas = null;
        var syncContext = null;

        mockText.style.syncFont = function (c, ctx)
        {
            syncFontCalled = true;
            syncCanvas = c;
            syncContext = ctx;
        };

        GetTextSize(mockText, mockSize, lines);

        expect(syncFontCalled).toBe(true);
        expect(syncCanvas).toBe(mockText.canvas);
        expect(syncContext).toBe(mockText.context);
    });

    it('should only measure drawnLines when maxLines is set', function ()
    {
        var measuredLines = [];

        mockText.context.measureText = function (str)
        {
            measuredLines.push(str);
            return { width: str.length * 10 };
        };

        mockText.style.maxLines = 1;

        GetTextSize(mockText, mockSize, [ 'first', 'second', 'third' ]);

        // Only 'first' should be measured
        expect(measuredLines).toContain('first');
        expect(measuredLines).not.toContain('second');
        expect(measuredLines).not.toContain('third');
    });

    it('should handle negative lineSpacing', function ()
    {
        mockSize.fontSize = 20;
        mockText.style.strokeThickness = 0;
        mockText.lineSpacing = -4;

        // 2 lines: height = 20 * 2 + (-4) * 1 = 36
        var result = GetTextSize(mockText, mockSize, [ 'a', 'b' ]);

        expect(result.height).toBe(36);
    });
});
