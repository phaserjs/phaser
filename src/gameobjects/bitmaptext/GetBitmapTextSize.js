/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the full bounds, in local and world space, of a BitmapText Game Object.
 *
 * Returns a BitmapTextSize object that contains global and local variants of the Game Objects x and y coordinates and
 * its width and height. Also includes an array of the line lengths and all word positions.
 *
 * The global position and size take into account the Game Object's position and scale.
 *
 * The local position and size just takes into account the font data.
 *
 * @function GetBitmapTextSize
 * @since 3.0.0
 * @private
 *
 * @param {(Phaser.GameObjects.DynamicBitmapText|Phaser.GameObjects.BitmapText)} src - The BitmapText to calculate the bounds values for.
 * @param {boolean} [round=false] - Whether to round the positions to the nearest integer.
 * @param {boolean} [updateOrigin=false] - Whether to update the origin of the BitmapText after bounds calculations?
 * @param {object} [out] - Object to store the results in, to save constant object creation. If not provided an empty object is returned.
 *
 * @return {Phaser.Types.GameObjects.BitmapText.BitmapTextSize} The calculated bounds values of the BitmapText.
 */
var GetBitmapTextSize = function (src, round, updateOrigin, out)
{
    if (updateOrigin === undefined) { updateOrigin = false; }

    if (out === undefined)
    {
        out = {
            local: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            global: {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            },
            lines: {
                shortest: 0,
                longest: 0,
                lengths: null,
                height: 0
            },
            wrappedText: '',
            words: [],
            characters: [],
            scaleX: 0,
            scaleY: 0
        };

        return out;
    }

    var text = src.text;
    var textLength = text.length;
    var maxWidth = src.maxWidth;
    var wordWrapCharCode = src.wordWrapCharCode;

    var bx = Number.MAX_VALUE;
    var by = Number.MAX_VALUE;
    var bw = 0;
    var bh = 0;

    var chars = src.fontData.chars;
    var lineHeight = src.fontData.lineHeight;
    var letterSpacing = src.letterSpacing;
    var lineSpacing = src.lineSpacing;

    var xAdvance = 0;
    var yAdvance = 0;

    var charCode = 0;

    var glyph = null;

    var align = src._align;

    var x = 0;
    var y = 0;

    var scale = (src.fontSize / src.fontData.size);
    var sx = scale * src.scaleX;
    var sy = scale * src.scaleY;

    var lastGlyph = null;
    var lastCharCode = 0;
    var lineWidths = [];
    var shortestLine = Number.MAX_VALUE;
    var longestLine = 0;
    var currentLine = 0;
    var currentLineWidth = 0;

    var i;
    var words = [];
    var characters = [];
    var current = null;

    //  Scan for breach of maxWidth and insert carriage-returns
    if (maxWidth > 0)
    {
        for (i = 0; i < textLength; i++)
        {
            charCode = text.charCodeAt(i);

            if (charCode === 10)
            {
                if (current !== null)
                {
                    words.push({
                        word: current.word,
                        i: current.i,
                        x: current.x * sx,
                        y: current.y * sy,
                        w: current.w * sx,
                        h: current.h * sy,
                        cr: true
                    });

                    current = null;
                }

                xAdvance = 0;
                yAdvance += lineHeight + lineSpacing;
                lastGlyph = null;

                continue;
            }

            glyph = chars[charCode];

            if (!glyph)
            {
                continue;
            }

            if (lastGlyph !== null)
            {
                var glyphKerningOffset = glyph.kerning[lastCharCode];
            }

            if (charCode === wordWrapCharCode)
            {
                if (current !== null)
                {
                    words.push({
                        word: current.word,
                        i: current.i,
                        x: current.x * sx,
                        y: current.y * sy,
                        w: current.w * sx,
                        h: current.h * sy,
                        cr: false
                    });

                    current = null;
                }
            }
            else
            {
                if (current === null)
                {
                    //  We're starting a new word, recording the starting index, etc
                    current = { word: '', i: i, x: xAdvance, y: yAdvance, w: 0, h: lineHeight, cr: false };
                }

                current.word = current.word.concat(text[i]);
                current.w += glyph.xOffset + glyph.xAdvance + ((glyphKerningOffset !== undefined) ? glyphKerningOffset : 0);
            }

            xAdvance += glyph.xAdvance + letterSpacing;
            lastGlyph = glyph;
            lastCharCode = charCode;
        }

        //  Last word
        if (current !== null)
        {
            words.push({
                word: current.word,
                i: current.i,
                x: current.x * sx,
                y: current.y * sy,
                w: current.w * sx,
                h: current.h * sy,
                cr: false
            });
        }

        //  Reset for the next loop
        xAdvance = 0;
        yAdvance = 0;
        lastGlyph = null;
        lastCharCode = 0;

        //  Loop through the words array and see if we've got any > maxWidth
        var prev;
        var offset = 0;
        var crs = [];

        for (i = 0; i < words.length; i++)
        {
            var entry = words[i];
            var left = entry.x;
            var right = entry.x + entry.w;

            if (prev)
            {
                var diff = left - (prev.x + prev.w);

                offset = left - (diff + prev.w);

                prev = null;
            }

            var checkLeft = left - offset;
            var checkRight = right - offset;

            if (checkLeft > maxWidth || checkRight > maxWidth)
            {
                crs.push(entry.i - 1);

                if (entry.cr)
                {
                    crs.push(entry.i + entry.word.length);

                    offset = 0;
                    prev = null;
                }
                else
                {
                    prev = entry;
                }
            }
            else if (entry.cr)
            {
                crs.push(entry.i + entry.word.length);

                offset = 0;
                prev = null;
            }
        }

        var stringInsert = function (str, index, value)
        {
            return str.substr(0, index) + value + str.substr(index + 1);
        };

        for (i = crs.length - 1; i >= 0; i--)
        {
            // eslint-disable-next-line quotes
            text = stringInsert(text, crs[i], "\n");
        }

        out.wrappedText = text;

        textLength = text.length;

        //  Recalculated in the next loop
        words = [];
        current = null;
    }

    var charIndex = 0;

    for (i = 0; i < textLength; i++)
    {
        charCode = text.charCodeAt(i);

        if (charCode === 10)
        {
            if (current !== null)
            {
                words.push({
                    word: current.word,
                    i: current.i,
                    x: current.x * sx,
                    y: current.y * sy,
                    w: current.w * sx,
                    h: current.h * sy
                });

                current = null;
            }

            xAdvance = 0;
            yAdvance += lineHeight + lineSpacing;
            lastGlyph = null;

            lineWidths[currentLine] = currentLineWidth;

            if (currentLineWidth > longestLine)
            {
                longestLine = currentLineWidth;
            }

            if (currentLineWidth < shortestLine)
            {
                shortestLine = currentLineWidth;
            }

            currentLine++;
            currentLineWidth = 0;

            continue;
        }

        glyph = chars[charCode];

        if (!glyph)
        {
            continue;
        }

        x = xAdvance;
        y = yAdvance;

        if (lastGlyph !== null)
        {
            var kerningOffset = glyph.kerning[lastCharCode];

            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }

        if (bx > x)
        {
            bx = x;
        }

        if (by > y)
        {
            by = y;
        }

        var gw = x + glyph.xAdvance;
        var gh = y + lineHeight;

        if (bw < gw)
        {
            bw = gw;
        }

        if (bh < gh)
        {
            bh = gh;
        }

        var charWidth = glyph.xOffset + glyph.xAdvance + ((kerningOffset !== undefined) ? kerningOffset : 0);

        if (charCode === wordWrapCharCode)
        {
            if (current !== null)
            {
                words.push({
                    word: current.word,
                    i: current.i,
                    x: current.x * sx,
                    y: current.y * sy,
                    w: current.w * sx,
                    h: current.h * sy
                });

                current = null;
            }
        }
        else
        {
            if (current === null)
            {
                //  We're starting a new word, recording the starting index, etc
                current = { word: '', i: charIndex, x: xAdvance, y: yAdvance, w: 0, h: lineHeight };
            }

            current.word = current.word.concat(text[i]);
            current.w += charWidth;
        }

        characters.push({
            i: charIndex,
            idx: i,
            char: text[i],
            code: charCode,
            x: (glyph.xOffset + x) * scale,
            y: (glyph.yOffset + yAdvance) * scale,
            w: glyph.width * scale,
            h: glyph.height * scale,
            t: yAdvance * scale,
            r: gw * scale,
            b: lineHeight * scale,
            line: currentLine,
            glyph: glyph
        });

        xAdvance += glyph.xAdvance + letterSpacing + ((kerningOffset !== undefined) ? kerningOffset : 0);
        lastGlyph = glyph;
        lastCharCode = charCode;
        currentLineWidth = gw * scale;
        charIndex++;
    }

    //  Last word
    if (current !== null)
    {
        words.push({
            word: current.word,
            i: current.i,
            x: current.x * sx,
            y: current.y * sy,
            w: current.w * sx,
            h: current.h * sy
        });
    }

    lineWidths[currentLine] = currentLineWidth;

    if (currentLineWidth > longestLine)
    {
        longestLine = currentLineWidth;
    }

    if (currentLineWidth < shortestLine)
    {
        shortestLine = currentLineWidth;
    }

    //  Adjust all of the character positions based on alignment
    if (align > 0)
    {
        for (var c = 0; c < characters.length; c++)
        {
            var currentChar = characters[c];

            if (align === 1)
            {
                var ax1 = ((longestLine - lineWidths[currentChar.line]) / 2);

                currentChar.x += ax1;
                currentChar.r += ax1;
            }
            else if (align === 2)
            {
                var ax2 = (longestLine - lineWidths[currentChar.line]);

                currentChar.x += ax2;
                currentChar.r += ax2;
            }
        }
    }

    var local = out.local;
    var global = out.global;
    var lines = out.lines;

    local.x = bx * scale;
    local.y = by * scale;
    local.width = bw * scale;
    local.height = bh * scale;

    global.x = (src.x - src._displayOriginX) + (bx * sx);
    global.y = (src.y - src._displayOriginY) + (by * sy);

    global.width = bw * sx;
    global.height = bh * sy;

    lines.shortest = shortestLine;
    lines.longest = longestLine;
    lines.lengths = lineWidths;

    if (round)
    {
        local.x = Math.ceil(local.x);
        local.y = Math.ceil(local.y);
        local.width = Math.ceil(local.width);
        local.height = Math.ceil(local.height);

        global.x = Math.ceil(global.x);
        global.y = Math.ceil(global.y);
        global.width = Math.ceil(global.width);
        global.height = Math.ceil(global.height);

        lines.shortest = Math.ceil(shortestLine);
        lines.longest = Math.ceil(longestLine);
    }

    if (updateOrigin)
    {
        src._displayOriginX = (src.originX * local.width);
        src._displayOriginY = (src.originY * local.height);

        global.x = src.x - (src._displayOriginX * src.scaleX);
        global.y = src.y - (src._displayOriginY * src.scaleY);

        if (round)
        {
            global.x = Math.ceil(global.x);
            global.y = Math.ceil(global.y);
        }
    }

    out.words = words;
    out.characters = characters;
    out.lines.height = lineHeight;
    out.scale = scale;
    out.scaleX = src.scaleX;
    out.scaleY = src.scaleY;

    return out;
};

module.exports = GetBitmapTextSize;
