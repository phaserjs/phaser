/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
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
    var styleByIndex = src._styleByIndex;
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
    var lastFontData = null;
    var lineWidths = [];
    var shortestLine = Number.MAX_VALUE;
    var longestLine = 0;
    var currentLine = 0;
    var currentLineWidth = 0;

    var i;
    var lines;
    var words = [];
    var characters = [];
    var current = null;

    //  Resolve each character into an item carrying its glyph, advance and kerning
    var items = [];
    for (i = 0; i < textLength; i++)
    {
        charCode = text.charCodeAt(i);
        if (charCode === 10)
        {
            items.push({ newline: true });
            lastGlyph = null;
            lastFontData = null;
            continue;
        }

        var fontData = src.fontData;
        var style = null;

        if (styleByIndex)
        {
            style = styleByIndex[i];
            fontData = style.fontData;

            glyph = fontData.chars[charCode];

            //  The style font is missing this char: fall back to the default
            if (!glyph)
            {
                fontData = src.fontData;
                glyph = fontData.chars[charCode];
                style = null;
            }
        }
        else
        {
            glyph = chars[charCode];
        }

        if (!glyph) continue;

        var kerningOffset = 0;

        if (lastGlyph !== null && fontData === lastFontData)
        {
            kerningOffset = glyph.kerning[lastCharCode];
            if (kerningOffset === undefined)
                kerningOffset = 0;
        }

        //  Scale of this item relative to the global scale; 1 unless the
        //  style sets an explicit size
        var rel = 1;

        if (style !== null && style.size !== undefined)
        {
            rel = (style.size / fontData.size) / scale;
        }

        items.push({
            idx: i,
            char: text[i],
            code: charCode,
            glyph: glyph,
            fontData: fontData,
            base: (fontData.base === undefined) ? fontData.lineHeight : fontData.base,
            style: style,
            rel: rel,
            kerningOffset: kerningOffset,
            advance: glyph.xAdvance + letterSpacing + kerningOffset,
            charWidth: glyph.xOffset + glyph.xAdvance + kerningOffset,
            isSpace: charCode === wordWrapCharCode
        });

        lastGlyph = glyph;
        lastCharCode = charCode;
        lastFontData = fontData;
    }

    //  Apply automatic wrapping
    if (maxWidth > 0)
    {
        var breakIndices = [];
        var wordWidth = 0;
        var wordSpace = null;
        var wordFirst = null;
        var wrapLineWidth = 0;
        var lastSpace = null;

        for (i = 0; i <= items.length; i++)
        {
            var wrapItem = (i < items.length) ? items[i] : null;
            var atLineEnd = (wrapItem === null || wrapItem.newline);

            if (!atLineEnd)
            {
                if (wordWidth === 0)
                {
                    wordFirst = wrapItem;
                }

                //  More correct would be wordWidth += wrapItem.advance, but the old
                //  string-based wrap used glyph.xAdvance only, so keeping it to avoid a behaviour change
                wordWidth += wrapItem.glyph.xAdvance * wrapItem.rel;

                if (wrapItem.code === wordWrapCharCode)
                {
                    wordSpace = wrapItem;
                }
                else
                {
                    continue;
                }
            }

            if (wordWidth > 0 || wordSpace !== null)
            {
                if ((wrapLineWidth + wordWidth) * sx <= maxWidth)
                {
                    wrapLineWidth += wordWidth;
                }
                else
                {
                    if (lastSpace !== null)
                    {
                        lastSpace.newline = true;
                        breakIndices.push(lastSpace.idx);

                        wordFirst.advance -= wordFirst.kerningOffset;
                        wordFirst.charWidth -= wordFirst.kerningOffset;
                        wordFirst.kerningOffset = 0;
                    }

                    wrapLineWidth = wordWidth;
                }

                lastSpace = wordSpace;
                wordSpace = null;
                wordWidth = 0;
                wordFirst = null;
            }

            if (atLineEnd)
            {
                wrapLineWidth = 0;
                lastSpace = null;
            }
        }

        if (breakIndices.length > 0)
        {
            var textChars = text.split('');

            for (i = 0; i < breakIndices.length; i++)
            {
                textChars[breakIndices[i]] = '\n';
            }

            text = textChars.join('');
        }

        out.wrappedText = text;
    }

    //  Calculate per-line metrics (base and height)
    var lineHeights = null;
    var lineBases = null;

    if (styleByIndex)
    {
        var defaultBase = (src.fontData.base === undefined) ? lineHeight : src.fontData.base;
        var metricsLine = 0;

        lineHeights = [ lineHeight ];
        lineBases = [ defaultBase ];

        for (i = 0; i < items.length; i++)
        {
            var metricsItem = items[i];

            if (metricsItem.newline)
            {
                metricsLine++;

                lineHeights[metricsLine] = lineHeight;
                lineBases[metricsLine] = defaultBase;
            }
            else
            {
                if (metricsItem.fontData.lineHeight * metricsItem.rel > lineHeights[metricsLine])
                {
                    lineHeights[metricsLine] = metricsItem.fontData.lineHeight * metricsItem.rel;
                }

                if (metricsItem.base * metricsItem.rel > lineBases[metricsLine])
                {
                    lineBases[metricsLine] = metricsItem.base * metricsItem.rel;
                }
            }
        }
    }

    //  Position characters
    var charIndex = 0;
    for (i = 0; i < items.length; i++)
    {
        var item = items[i];

        if (item.newline)
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

            xAdvance = 0;

            if (lineHeights)
            {
                yAdvance += lineHeights[currentLine - 1] + lineSpacing;
            }
            else
            {
                yAdvance = (lineHeight + lineSpacing) * currentLine;
            }

            continue;
        }

        glyph = item.glyph;

        x = xAdvance + item.kerningOffset * item.rel;
        y = yAdvance;

        //  Baseline alignment: raise chars of shorter fonts to the line base
        if (lineHeights)
        {
            y += lineBases[currentLine] - item.base * item.rel;
        }

        if (bx > x)
        {
            bx = x;
        }

        if (by > y)
        {
            by = y;
        }

        var gw = x + glyph.xAdvance * item.rel;
        var gh = y + (lineHeights ? lineHeights[currentLine] : lineHeight);

        if (bw < gw)
        {
            bw = gw;
        }

        if (bh < gh)
        {
            bh = gh;
        }

        if (item.isSpace)
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

            current.word = current.word.concat(item.char);
            current.w += item.charWidth * item.rel;
        }

        var charEntry = {
            i: charIndex,
            idx: item.idx,
            char: item.char,
            code: item.code,
            x: (glyph.xOffset * item.rel + x) * scale,
            y: (glyph.yOffset * item.rel + y) * scale,
            w: glyph.width * item.rel * scale,
            h: glyph.height * item.rel * scale,
            t: yAdvance * scale,
            r: gw * scale,
            b: (lineHeights ? lineHeights[currentLine] : lineHeight) * scale,
            line: currentLine,
            glyph: glyph
        };

        if (item.style !== null)
        {
            charEntry.style = item.style;
        }

        characters.push(charEntry);

        xAdvance += item.advance * item.rel;
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

    lines = out.lines;

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
