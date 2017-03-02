
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
        console.log('bailed');
        return bounds;
    }

    bounds.x = Number.MAX_VALUE;
    bounds.y = Number.MAX_VALUE;
    bounds.width = -1;
    bounds.height = -1;
    
    var textureFrame = src.frame;

    var chars = src.fontData.chars;
    var lineHeight = src.fontData.lineHeight;

    var xAdvance = 0;
    var yAdvance = 0;

    var indexCount = 0;
    var charCode = 0;

    var glyph = null;
    var glyphX = 0;
    var glyphY = 0;
    var glyphW = 0;
    var glyphH = 0;

    var x = 0;
    var y = 0;

    var lastGlyph = null;
    var lastCharCode = 0;

    var textureX = textureFrame.cutX;
    var textureY = textureFrame.cutY;

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

        glyphX = textureX + glyph.x;
        glyphY = textureY + glyph.y;

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

        // ctx.save();
        // ctx.translate(x, y);
        // ctx.rotate(rotation);
        // ctx.scale(scale, scale);

        // ctx.fillStyle = 'rgb(255,0,255)';
        // ctx.fillRect(0, 0, glyphW, glyphH);

        // ctx.drawImage(image, glyphX, glyphY, glyphW, glyphH, 0, 0, glyphW, glyphH);

        // var xs = x * scale;
        // var ys = y * scale;

        if (bounds.x > x)
        {
            bounds.x = x;
        }

        if (bounds.y > y)
        {
            bounds.y = y;
        }

        var gw = x + (glyphW * scale);
        var gh = y + (glyphH * scale);

        if (bounds.width < gw)
        {
            bounds.width = gw - bounds.x;
        }
        
        if (bounds.height < gh)
        {
            bounds.height = gh - bounds.y;
        }

        // console.log('Letter', text[index]);
        // console.log('pos', x, y);
        // console.log('wh', glyphW, glyphH);
        // console.log('scaled', gw, gh);
        // console.log('bounds', bounds.width, bounds.height);

        xAdvance += glyph.xAdvance;
        indexCount += 1;
        lastGlyph = glyph;
        lastCharCode = charCode;
    }

    return bounds;
};

module.exports = GetBitmapTextSize;
