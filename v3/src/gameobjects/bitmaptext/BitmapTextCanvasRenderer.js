var BitmapTextCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    var text = src.text;
    var textLength = text.length;

    if (this.renderMask !== this.renderFlags || textLength === 0)
    {
        return;
    }
    
    var textureFrame = src.frame;

    var cameraScrollX = camera.scrollX;
    var cameraScrollY = camera.scrollY;

    var chars = src.fontData.chars;
    var lineHeight = src.fontData.lineHeight;

    var srcX = src.x;
    var srcY = src.y;

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

    var ctx = renderer.currentContext;
    var image = src.frame.source.image;

    var textureX = textureFrame.cutX;
    var textureY = textureFrame.cutY;

    var scaleX = src.scaleX * (src.fontSize / src.fontData.size);
    var scaleY = src.scaleY * (src.fontSize / src.fontData.size);

    //  Blend Mode
    if (renderer.currentBlendMode !== src.blendMode)
    {
        renderer.currentBlendMode = src.blendMode;
        ctx.globalCompositeOperation = renderer.blendModes[src.blendMode];
    }

    //  Alpha
    if (renderer.currentAlpha !== src.alpha)
    {
        renderer.currentAlpha = src.alpha;
        ctx.globalAlpha = src.alpha;
    }

    //  Smoothing
    if (renderer.currentScaleMode !== src.scaleMode)
    {
        renderer.currentScaleMode = src.scaleMode;
    }

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

        x = srcX + indexCount + glyph.xOffset + xAdvance;
        y = srcY + glyph.yOffset + yAdvance;

        if (lastGlyph !== null)
        {
            var kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }

        x *= scaleX;
        y *= scaleY;

        x -= cameraScrollX;
        y -= cameraScrollY;

        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scaleX, scaleY);
        ctx.drawImage(image, glyphX, glyphY, glyphW, glyphH, 0, 0, glyphW, glyphH);
        ctx.restore();
        
        xAdvance += glyph.xAdvance;
        indexCount += 1;
        lastGlyph = glyph;
        lastCharCode = charCode;
    }
};

module.exports = BitmapTextCanvasRenderer;
