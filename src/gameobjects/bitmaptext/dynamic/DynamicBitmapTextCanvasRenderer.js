/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var GameObject = require('../../GameObject');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.DynamicBitmapText#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.DynamicBitmapText} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 */
var DynamicBitmapTextCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
{
    var text = src.text;
    var textLength = text.length;

    if (GameObject.RENDER_MASK !== src.renderFlags || textLength === 0 || (src.cameraFilter > 0 && (src.cameraFilter & camera._id)))
    {
        return;
    }
    
    var textureFrame = src.frame;

    var displayCallback = src.displayCallback;

    var cameraScrollX = camera.scrollX * src.scrollFactorX;
    var cameraScrollY = camera.scrollY * src.scrollFactorY;

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

    var ctx = renderer.currentContext;
    var image = src.frame.source.image;

    var textureX = textureFrame.cutX;
    var textureY = textureFrame.cutY;

    var rotation = 0;
    var scale = (src.fontSize / src.fontData.size);

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

    ctx.save();
    ctx.translate(src.x, src.y);
    ctx.rotate(src.rotation);
    ctx.translate(-src.displayOriginX, -src.displayOriginY);
    ctx.scale(src.scaleX, src.scaleY);

    if (src.cropWidth > 0 && src.cropHeight > 0)
    {
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, src.cropWidth, src.cropHeight);
        ctx.clip();
    }

    for (var index = 0; index < textLength; ++index)
    {
        //  Reset the scale (in case the callback changed it)
        scale = (src.fontSize / src.fontData.size);
        rotation = 0;

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

        x = (indexCount + glyph.xOffset + xAdvance) - src.scrollX;
        y = (glyph.yOffset + yAdvance) - src.scrollY;

        //  This could be optimized so that it doesn't even bother drawing it if the x/y is out of range

        if (lastGlyph !== null)
        {
            var kerningOffset = glyph.kerning[lastCharCode];
            x += (kerningOffset !== undefined) ? kerningOffset : 0;
        }

        if (displayCallback)
        {
            var output = displayCallback({ tint: { topLeft: 0, topRight: 0, bottomLeft: 0, bottomRight: 0 }, index: index, charCode: charCode, x: x, y: y, scale: scale, rotation: 0, data: glyph.data });

            x = output.x;
            y = output.y;
            scale = output.scale;
            rotation = output.rotation;
        }

        x *= scale;
        y *= scale;

        x -= cameraScrollX;
        y -= cameraScrollY;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);

        // ctx.fillStyle = 'rgba(0,255,0,0.2)';
        // ctx.fillRect(0, 0, glyphW, glyphH);

        ctx.drawImage(image, glyphX, glyphY, glyphW, glyphH, 0, 0, glyphW, glyphH);

        ctx.restore();
        
        xAdvance += glyph.xAdvance;
        indexCount += 1;
        lastGlyph = glyph;
        lastCharCode = charCode;
    }

    if (src.cropWidth > 0 && src.cropHeight > 0)
    {
        ctx.restore();
    }

    ctx.restore();
};

module.exports = DynamicBitmapTextCanvasRenderer;
