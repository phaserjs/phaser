/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Calculate the position, width and height of a BitmapText Game Object.
 *
 * Returns a BitmapTextSize object that contains global and local variants of the Game Objects x and y coordinates and
 * its width and height.
 *
 * The global position and size take into account the Game Object's position and scale.
 *
 * The local position and size just takes into account the font data.
 *
 * @function GetBitmapTextSize
 * @since 3.0.0
 * @private
 *
 * @param {(Phaser.GameObjects.DynamicBitmapText|Phaser.GameObjects.BitmapText)} src - The BitmapText to calculate the position, width and height of.
 * @param {boolean} [round] - Whether to round the results to the nearest integer.
 * @param {object} [out] - Optional object to store the results in, to save constant object creation.
 *
 * @return {Phaser.Types.GameObjects.BitmapText.BitmapTextSize} The calculated position, width and height of the BitmapText.
 */
var GetBitmapTextSize = function (src, round, out)
{
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

    var xAdvance = 0;
    var yAdvance = 0;

    var charCode = 0;

    var glyph = null;

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
                yAdvance += lineHeight;
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
            yAdvance += lineHeight;
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
                current = { word: '', i: i, x: xAdvance, y: yAdvance, w: 0, h: lineHeight };
            }

            current.word = current.word.concat(text[i]);
            current.w += glyph.xOffset + glyph.xAdvance + ((kerningOffset !== undefined) ? kerningOffset : 0);
        }

        xAdvance += glyph.xAdvance + letterSpacing;
        lastGlyph = glyph;
        lastCharCode = charCode;
        currentLineWidth = gw * scale;
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

    var local = out.local;
    var global = out.global;
    var lines = out.lines;

    local.x = bx * scale;
    local.y = by * scale;
    local.width = bw * scale;
    local.height = bh * scale;

    global.x = (src.x - src.displayOriginX) + (bx * sx);
    global.y = (src.y - src.displayOriginY) + (by * sy);
    global.width = bw * sx;
    global.height = bh * sy;

    lines.shortest = shortestLine;
    lines.longest = longestLine;
    lines.lengths = lineWidths;

    if (round)
    {
        local.x = Math.round(local.x);
        local.y = Math.round(local.y);
        local.width = Math.round(local.width);
        local.height = Math.round(local.height);

        global.x = Math.round(global.x);
        global.y = Math.round(global.y);
        global.width = Math.round(global.width);
        global.height = Math.round(global.height);

        lines.shortest = Math.round(shortestLine);
        lines.longest = Math.round(longestLine);
    }

    out.words = words;
    out.lines.height = lineHeight;
    out.scaleX = src.scaleX;
    out.scaleY = src.scaleY;

    return out;
};

module.exports = GetBitmapTextSize;
