
var GetBitmapTextSize = function (src)
{
    var text = src.text;
    var textLength = text.length;

    var bounds = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    if (textLength === 0)
    {
        return bounds;
    }

    bounds.x = Number.MAX_VALUE;
    bounds.y = Number.MAX_VALUE;
    bounds.width = 0;
    bounds.height = 0;
    
    var chars = src.fontData.chars;
    var lineHeight = src.fontData.lineHeight;

    var xAdvance = 0;
    var yAdvance = 0;

    var indexCount = 0;
    var charCode = 0;

    var glyph = null;
    var glyphW = 0;
    var glyphH = 0;

    var x = 0;
    var y = 0;

    var lastGlyph = null;
    var lastCharCode = 0;

    var scale = (src.fontSize / src.fontData.size);

    for (var index = 0; index < textLength; ++index)
    {
        charCode = text.charCodeAt(index);

        if (charCode === 10)
        {
            xAdvance = 0;
            indexCount = 0;
            yAdvance += lineHeight;
            lastGlyph = null;
            continue;
        }

        glyph = chars[charCode];

        if (!glyph)
        {
            continue;
        }

        glyphW = glyph.width;
        glyphH = glyph.height;

        x = indexCount + glyph.xOffset + xAdvance;
        y = glyph.yOffset + yAdvance;

        if (lastGlyph !== null)
        {
            var kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }

        x *= scale;
        y *= scale;

        if (bounds.x > x)
        {
            bounds.x = x;
        }

        if (bounds.y > y)
        {
            bounds.y = y;
        }

        var gw = x + (glyphW * scale) - bounds.x;
        var gh = y + (glyphH * scale) - bounds.y;

        if (bounds.width < gw)
        {
            bounds.width = gw;
        }
        
        if (bounds.height < gh)
        {
            bounds.height = gh;
        }

        xAdvance += glyph.xAdvance;
        indexCount += 1;
        lastGlyph = glyph;
        lastCharCode = charCode;
    }

    // bounds.width *= src.scaleX;
    // bounds.height *= src.scaleY;

    return bounds;
};

module.exports = GetBitmapTextSize;
