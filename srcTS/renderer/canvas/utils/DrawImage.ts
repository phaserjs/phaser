/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');

var _tempCameraMatrix = new TransformMatrix();
var _tempSpriteMatrix = new TransformMatrix();

/**
 * [description]
 *
 * @function Phaser.Renderer.Canvas.DrawImage
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} src - [description]
 * @param {Phaser.Cameras.Scene2D.Camera} camera - [description]
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentTransformMatrix - [description]
 */
var DrawImage = function (src, camera, parentTransformMatrix)
{
    var ctx = this.currentContext;

    //  Alpha

    var alpha = camera.alpha * src.alpha;

    if (alpha === 0)
    {
        //  Nothing to see, so abort early
        return;
    }

    ctx.globalAlpha = alpha;

    //  Blend Mode

    if (this.currentBlendMode !== src.blendMode)
    {
        this.currentBlendMode = src.blendMode;
        ctx.globalCompositeOperation = this.blendModes[src.blendMode];
    }

    var camMatrix = _tempCameraMatrix;
    var spriteMatrix = _tempSpriteMatrix;

    spriteMatrix.applyITRS(src.x - camera.scrollX * src.scrollFactorX, src.y - camera.scrollY * src.scrollFactorY, src.rotation, src.scaleX, src.scaleY);

    var frame = src.frame;

    var cd = frame.canvasData;

    var frameX = cd.x;
    var frameY = cd.y;
    var frameWidth = frame.width;
    var frameHeight = frame.height;

    var x = -src.displayOriginX + frame.x;
    var y = -src.displayOriginY + frame.y;

    var fx = (src.flipX) ? -1 : 1;
    var fy = (src.flipY) ? -1 : 1;

    if (src.isCropped)
    {
        var crop = src._crop;

        if (crop.flipX !== src.flipX || crop.flipY !== src.flipY)
        {
            frame.updateCropUVs(crop, src.flipX, src.flipY);
        }

        frameWidth = crop.cw;
        frameHeight = crop.ch;

        frameX = crop.cx;
        frameY = crop.cy;

        x = -src.displayOriginX + crop.x;
        y = -src.displayOriginY + crop.y;

        if (fx === -1)
        {
            if (x >= 0)
            {
                x = -(x + frameWidth);
            }
            else if (x < 0)
            {
                x = (Math.abs(x) - frameWidth);
            }
        }
    
        if (fy === -1)
        {
            if (y >= 0)
            {
                y = -(y + frameHeight);
            }
            else if (y < 0)
            {
                y = (Math.abs(y) - frameHeight);
            }
        }
    }

    camMatrix.copyFrom(camera.matrix);

    var calcMatrix;

    if (parentTransformMatrix)
    {
        //  Multiply the camera by the parent matrix
        camMatrix.multiplyWithOffset(parentTransformMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);

        //  Undo the camera scroll
        spriteMatrix.e = src.x;
        spriteMatrix.f = src.y;

        //  Multiply by the Sprite matrix
        calcMatrix = camMatrix.multiply(spriteMatrix);
    }
    else
    {
        calcMatrix = spriteMatrix.multiply(camMatrix);
    }

    ctx.save();

    ctx.transform(calcMatrix.a, calcMatrix.b, calcMatrix.c, calcMatrix.d, calcMatrix.e, calcMatrix.f);

    ctx.scale(fx, fy);

    ctx.drawImage(frame.source.image, frameX, frameY, frameWidth, frameHeight, x, y, frameWidth, frameHeight);

    ctx.restore();
};

module.exports = DrawImage;
