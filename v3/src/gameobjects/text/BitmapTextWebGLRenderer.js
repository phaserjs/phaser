var BitmapTextWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }

    var cameraMatrix = camera.matrix.matrix;
    var a = cameraMatrix[0];
    var b = cameraMatrix[1];
    var c = cameraMatrix[2];
    var d = cameraMatrix[3];
    var e = cameraMatrix[4];
    var f = cameraMatrix[5];
    var cameraScrollX = camera.scrollX;
    var cameraScrollY = camera.scrollY;
    var text = src.text;
    var textLength = text.length;
    var chars = src.fontData.chars;
    var lineHeight = src.fontData.lineHeight;
    var blitterBatch = renderer.blitterBatch;
    var alpha = src.alpha;
    var vertexDataBuffer = blitterBatch.vertexDataBuffer;
    var vertexBuffer = vertexDataBuffer.floatView;
    var vertexOffset = 0;
    var srcX = src.x; 
    var srcY = src.y;
    var texture = src.texture.source[0].glTexture
    var textureWidth = src.texture.source[0].width;
    var textureHeight = src.texture.source[0].height
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
    var xw = 0;
    var yh = 0;
    var tx = 0;
    var ty = 0;
    var txw = 0;
    var tyh = 0;
    var umin = 0;
    var umax = 0;
    var vmin = 0;
    var vmax = 0;
    var lastGlyph = null;
    var lastCharCode = 0;

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

        glyphX = glyph.x;
        glyphY = glyph.y;
        glyphW = glyph.width;
        glyphH = glyph.height;
        x = (srcX + indexCount + glyph.xOffset + xAdvance) - cameraScrollX;
        y = (srcY + glyph.yOffset + yAdvance) - cameraScrollY;

        if (lastGlyph !== null)
        {
            var kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }

        xw = x + glyphW;
        yh = y + glyphH;
        tx = x * a + y * c + e;
        ty = x * b + y * d + f;
        txw = xw * a + yh * c + e;
        tyh = xw * b + yh * d + f;
        umin = glyphX / textureWidth;
        umax = (glyphX + glyphW) / textureWidth;
        vmin = glyphY / textureHeight;
        vmax = (glyphY + glyphH) / textureHeight;

        if (blitterBatch.elementCount >= blitterBatch.maxParticles)
        {
            blitterBatch.flush();
        }

        renderer.setBatch(blitterBatch, texture);
        vertexOffset = vertexDataBuffer.allocate(20);
        blitterBatch.elementCount += 6;

        vertexBuffer[vertexOffset++] = tx;
        vertexBuffer[vertexOffset++] = ty;
        vertexBuffer[vertexOffset++] = umin;
        vertexBuffer[vertexOffset++] = vmin;
        vertexBuffer[vertexOffset++] = alpha;
        vertexBuffer[vertexOffset++] = tx;
        vertexBuffer[vertexOffset++] = tyh;
        vertexBuffer[vertexOffset++] = umin;
        vertexBuffer[vertexOffset++] = vmax;
        vertexBuffer[vertexOffset++] = alpha;
        vertexBuffer[vertexOffset++] = txw;
        vertexBuffer[vertexOffset++] = tyh;
        vertexBuffer[vertexOffset++] = umax;
        vertexBuffer[vertexOffset++] = vmax;
        vertexBuffer[vertexOffset++] = alpha;
        vertexBuffer[vertexOffset++] = txw;
        vertexBuffer[vertexOffset++] = ty;
        vertexBuffer[vertexOffset++] = umax;
        vertexBuffer[vertexOffset++] = vmin;
        vertexBuffer[vertexOffset++] = alpha;

        xAdvance += glyph.xAdvance;
        indexCount += 1;
        lastGlyph = glyph;
        lastCharCode = charCode;
    }
};

module.exports = BitmapTextWebGLRenderer;
