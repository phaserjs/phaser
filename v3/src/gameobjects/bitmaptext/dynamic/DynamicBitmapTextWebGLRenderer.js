var TransformMatrix = require('../../../components/TransformMatrix');
var tempMatrix = new TransformMatrix();
var tempMatrixChar = new TransformMatrix();

var DynamicBitmapTextWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }

    var displayCallback = src.displayCallback;
    var textureFrame = src.frame;
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
    var textureData = src.texture.source[textureFrame.sourceIndex];
    var textureX = textureFrame.cutX;
    var textureY = textureFrame.cutY;
    var textureWidth = textureData.width;
    var textureHeight = textureData.height;
    var texture = textureData.glTexture;
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
    var tempMatrixMatrix = tempMatrix.matrix;
    var cameraMatrix = camera.matrix.matrix;
    var mva, mvb, mvc, mvd, mve, mvf, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3;
    var sra, srb, src, srd, sre, srf, cma, cmb, cmc, cmd, cme, cmf;
    var scale = (src.fontSize / src.fontData.size);
    var uta, utb, utc, utd, ute, utf;
    var tempMatrixCharMatrix = tempMatrixChar.matrix;

    tempMatrix.applyITRS(
        src.x - cameraScrollX, src.y - cameraScrollY, 
        -src.rotation, 
        src.scaleX, src.scaleY
    );

    sra = tempMatrixMatrix[0];
    srb = tempMatrixMatrix[1];
    src = tempMatrixMatrix[2];
    srd = tempMatrixMatrix[3];
    sre = tempMatrixMatrix[4];
    srf = tempMatrixMatrix[5];

    cma = cameraMatrix[0];
    cmb = cameraMatrix[1];
    cmc = cameraMatrix[2];
    cmd = cameraMatrix[3];
    cme = cameraMatrix[4];
    cmf = cameraMatrix[5];

    mva = sra * cma + srb * cmc;
    mvb = sra * cmb + srb * cmd;
    mvc = src * cma + srd * cmc;
    mvd = src * cmb + srd * cmd;
    mve = sre * cma + srf * cmc + cme;
    mvf = sre * cmb + srf * cmd + cmf;

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
        x = (indexCount + glyph.xOffset + xAdvance) * scale;
        y = (glyph.yOffset + yAdvance) * scale;

        if (lastGlyph !== null)
        {
            var kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }

        if (displayCallback)
        {
            var output = displayCallback({ index: index, charCode: charCode, x: x, y: y, scale: scale, rotation: 0 });

            x = output.x;
            y = output.y;
            scale = output.scale;
            rotation = output.rotation;
        }

        tempMatrixChar.applyITRS(
            x, y,
            -rotation,
            scale, scale
        );

        uta = tempMatrixCharMatrix[0];
        utb = tempMatrixCharMatrix[1];
        utc = tempMatrixCharMatrix[2];
        utd = tempMatrixCharMatrix[3];
        ute = tempMatrixCharMatrix[4];
        utf = tempMatrixCharMatrix[5];

        sra = uta * mva + utb * mvc;
        srb = uta * mvb + utb * mvd;
        src = utc * mva + utd * mvc;
        srd = utc * mvb + utd * mvd;
        sre = ute * mva + utf * mvc + mve;
        srf = ute * mvb + utf * mvd + mvf;

        xw = glyphW;
        yh = glyphH;
        tx0 = sre;
        ty0 = srf;
        tx1 = yh * src + sre;
        ty1 = yh * srd + srf;
        tx2 = xw * sra + yh * src + sre;
        ty2 = xw * srb + yh * srd + srf;
        tx3 = xw * sra + sre;
        ty3 = xw * srb + srf;
        umin = glyphX / textureWidth;
        umax = (glyphX + glyphW) / textureWidth;
        vmin = glyphY / textureHeight;
        vmax = (glyphY + glyphH) / textureHeight;

        if (blitterBatch.elementCount >= blitterBatch.maxParticles)
        {
            blitterBatch.flush();
        }

        renderer.setRenderer(blitterBatch, texture);
        vertexOffset = vertexDataBuffer.allocate(20);
        blitterBatch.elementCount += 6;

        vertexBuffer[vertexOffset++] = tx0;
        vertexBuffer[vertexOffset++] = ty0;
        vertexBuffer[vertexOffset++] = umin;
        vertexBuffer[vertexOffset++] = vmin;
        vertexBuffer[vertexOffset++] = alpha;
        vertexBuffer[vertexOffset++] = tx1;
        vertexBuffer[vertexOffset++] = ty1;
        vertexBuffer[vertexOffset++] = umin;
        vertexBuffer[vertexOffset++] = vmax;
        vertexBuffer[vertexOffset++] = alpha;
        vertexBuffer[vertexOffset++] = tx2;
        vertexBuffer[vertexOffset++] = ty2;
        vertexBuffer[vertexOffset++] = umax;
        vertexBuffer[vertexOffset++] = vmax;
        vertexBuffer[vertexOffset++] = alpha;
        vertexBuffer[vertexOffset++] = tx3;
        vertexBuffer[vertexOffset++] = ty3;
        vertexBuffer[vertexOffset++] = umax;
        vertexBuffer[vertexOffset++] = vmin;
        vertexBuffer[vertexOffset++] = alpha;

        xAdvance += glyph.xAdvance;
        indexCount += 1;
        lastGlyph = glyph;
        lastCharCode = charCode;
    }
};

module.exports = DynamicBitmapTextWebGLRenderer;
