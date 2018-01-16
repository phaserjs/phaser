var GameObject = require('../../GameObject');
var TransformMatrix = require('../../components/TransformMatrix');
var Utils = require('../../../renderer/webgl/Utils');
var tempMatrix = new TransformMatrix();
var tempMatrixChar = new TransformMatrix();

var DynamicBitmapTextWebGLRenderer = function (renderer, gameObject, interpolationPercentage, camera)
{
    var text = gameObject.text;
    var textLength = text.length;

    if (GameObject.RENDER_MASK !== gameObject.renderFlags || textLength === 0 || (gameObject.cameraFilter > 0 && (gameObject.cameraFilter & camera._id)))
    {
        return;
    }

    var spriteRenderer = renderer.spriteRenderer;
    var displayCallback = gameObject.displayCallback;
    var textureFrame = gameObject.frame;
    var cameraScrollX = camera.scrollX * gameObject.scrollFactorX;
    var cameraScrollY = camera.scrollY * gameObject.scrollFactorY;
    var chars = gameObject.fontData.chars;
    var lineHeight = gameObject.fontData.lineHeight;
    var getTint = Utils.getTintAppendFloatAlpha;
    var alpha = gameObject.alpha;
    var tintTL = getTint(gameObject._tintTL, alpha);
    var tintTR = getTint(gameObject._tintTR, alpha);
    var tintBL = getTint(gameObject._tintBL, alpha);
    var tintBR = getTint(gameObject._tintBR, alpha);
    var vertexViewF32 = spriteRenderer.vertexViewF32;
    var vertexViewU32 = spriteRenderer.vertexViewU32;
    var vertexOffset = 0;
    var textureData = gameObject.texture.source[textureFrame.sourceIndex];
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
    var rotation = 0;
    var xw = 0;
    var yh = 0;
    var umin = 0;
    var umax = 0;
    var vmin = 0;
    var vmax = 0;
    var lastGlyph = null;
    var lastCharCode = 0;
    var tempMatrixMatrix = tempMatrix.matrix;
    var cameraMatrix = camera.matrix.matrix;
    var scale = (gameObject.fontSize / gameObject.fontData.size);
    var uta, utb, utc, utd, ute, utf;
    var tempMatrixCharMatrix = tempMatrixChar.matrix;
    var renderTarget = gameObject.renderTarget;
    var sr = Math.sin(-gameObject.rotation);
    var cr = Math.cos(-gameObject.rotation);
    var sra = cr * gameObject.scaleX;
    var srb = -sr * gameObject.scaleX;
    var src = sr * gameObject.scaleY;
    var srd = cr * gameObject.scaleY;
    var sre = gameObject.x - cameraScrollX;
    var srf = gameObject.y - cameraScrollY;
    var cma = cameraMatrix[0];
    var cmb = cameraMatrix[1];
    var cmc = cameraMatrix[2];
    var cmd = cameraMatrix[3];
    var cme = cameraMatrix[4];
    var cmf = cameraMatrix[5];
    var mva = sra * cma + srb * cmc;
    var mvb = sra * cmb + srb * cmd;
    var mvc = src * cma + srd * cmc;
    var mvd = src * cmb + srd * cmd;
    var mve = sre * cma + srf * cmc + cme;
    var mvf = sre * cmb + srf * cmd + cmf;
    var gl = renderer.gl;
    var shader = null;

    renderer.setPipeline(spriteRenderer);
    spriteRenderer.beginPass(gameObject.shader, gameObject.renderTarget);
    renderer.setTexture(texture, 0);
    shader = spriteRenderer.currentProgram;

    spriteRenderer.orthoViewMatrix[0] = +2.0 / spriteRenderer.width;
    spriteRenderer.orthoViewMatrix[5] = -2.0 / spriteRenderer.height;

    shader.setConstantMatrix4x4(shader.getUniformLocation('uOrthoMatrix'), spriteRenderer.orthoViewMatrix);

    if (gameObject.cropWidth > 0 && gameObject.cropHeight > 0)
    {
        spriteRenderer.flush();

        if (!renderer.scissor.enabled)
        {
            gl.enable(gl.SCISSOR_TEST);
        }

        var sw = gameObject.cropWidth * gameObject.scaleX;
        var sh = gameObject.cropHeight * gameObject.scaleY;

        gl.scissor(gameObject.x, gl.drawingBufferHeight - gameObject.y - sh, sw, sh);
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

        x = (indexCount + glyph.xOffset + xAdvance) * scale;
        y = (glyph.yOffset + yAdvance) * scale;

        rotation = 0;

        if (lastGlyph !== null)
        {
            var kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }

        if (displayCallback)
        {
            var output = displayCallback({ color: 0, tint: { topLeft: tintTL, topRight: tintTR, bottomLeft: tintBL, bottomRight: tintBR }, index: index, charCode: charCode, x: x, y: y, scale: scale, rotation: 0, data: glyph.data });

            x = output.x;
            y = output.y;
            scale = output.scale;
            rotation = output.rotation;

            if (output.color)
            {
                tintTL = output.color;
                tintTR = output.color;
                tintBL = output.color;
                tintBR = output.color;
            }
            else
            {
                tintTL = output.tint.topLeft;
                tintTR = output.tint.topRight;
                tintBL = output.tint.bottomLeft;
                tintBR = output.tint.bottomRight;
            }

            tintTL = getTint(tintTL, alpha);
            tintTR = getTint(tintTR, alpha);
            tintBL = getTint(tintBL, alpha);
            tintBR = getTint(tintBR, alpha);
        }

        x -= gameObject.scrollX | 0;
        y -= gameObject.scrollY | 0;

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

        if (spriteRenderer.vertexCount >= spriteRenderer.vertexCapacity)
        {
            spriteRenderer.flush();
            vertexOffset = 0;
        }

        spriteRenderer.vertexCount += 6;

        vertexViewF32[vertexOffset++] = tx0;
        vertexViewF32[vertexOffset++] = ty0;
        vertexViewF32[vertexOffset++] = umin;
        vertexViewF32[vertexOffset++] = vmin;
        vertexViewU32[vertexOffset++] = tintTL;

        vertexViewF32[vertexOffset++] = tx1;
        vertexViewF32[vertexOffset++] = ty1;
        vertexViewF32[vertexOffset++] = umin;
        vertexViewF32[vertexOffset++] = vmax;
        vertexViewU32[vertexOffset++] = tintBL;

        vertexViewF32[vertexOffset++] = tx2;
        vertexViewF32[vertexOffset++] = ty2;
        vertexViewF32[vertexOffset++] = umax;
        vertexViewF32[vertexOffset++] = vmax;
        vertexViewU32[vertexOffset++] = tintBR;

        vertexViewF32[vertexOffset++] = tx0;
        vertexViewF32[vertexOffset++] = ty0;
        vertexViewF32[vertexOffset++] = umin;
        vertexViewF32[vertexOffset++] = vmin;
        vertexViewU32[vertexOffset++] = tintTL;

        vertexViewF32[vertexOffset++] = tx2;
        vertexViewF32[vertexOffset++] = ty2;
        vertexViewF32[vertexOffset++] = umax;
        vertexViewF32[vertexOffset++] = vmax;
        vertexViewU32[vertexOffset++] = tintBR;

        vertexViewF32[vertexOffset++] = tx3;
        vertexViewF32[vertexOffset++] = ty3;
        vertexViewF32[vertexOffset++] = umax;
        vertexViewF32[vertexOffset++] = vmin;
        vertexViewU32[vertexOffset++] = tintTR;

        xAdvance += glyph.xAdvance;
        indexCount += 1;
        lastGlyph = glyph;
        lastCharCode = charCode;

    }

    if (gameObject.cropWidth > 0 && gameObject.cropHeight > 0)
    {
        spriteRenderer.flush();

        if (renderer.scissor.enabled)
        {
            gl.scissor(renderer.scissor.x, renderer.scissor.y, renderer.scissor.width, renderer.scissor.height);
        }
        else
        {
            gl.scissor(camera.x, gl.drawingBufferHeight - camera.y - camera.height, camera.width, camera.height);
            gl.disable(gl.SCISSOR_TEST);
        }
    }

    spriteRenderer.flush();
    spriteRenderer.endPass();
};

module.exports = DynamicBitmapTextWebGLRenderer;
