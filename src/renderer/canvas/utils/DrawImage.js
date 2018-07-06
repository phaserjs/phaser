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

    //  Smoothing

    // if (this.currentScaleMode !== src.scaleMode)
    // {
        // this.currentScaleMode = src.scaleMode;
        // ctx[this.smoothProperty] = (source.scaleMode === ScaleModes.LINEAR);
    // }

    var camMatrix = _tempCameraMatrix;
    var spriteMatrix = _tempSpriteMatrix;

    spriteMatrix.applyITRS(src.x - camera.scrollX * src.scrollFactorX, src.y - camera.scrollY * src.scrollFactorY, src.rotation, src.scaleX, src.scaleY);

    var frame = src.frame;
    var frameX = frame.x;
    var frameY = frame.y;
    var frameWidth = frame.width;
    var frameHeight = frame.height;

    var x = -src.displayOriginX + frameX;
    var y = -src.displayOriginY + frameY;

    var fx = 1;
    var fy = 1;

    if (src.isCropped)
    {
        var crop = src._crop;

        if (crop.flipX !== src.flipX || crop.flipY !== src.flipY)
        {
            frame.updateCropUVs(crop, src.flipX, src.flipY);
        }

        frameWidth = crop.width;
        frameHeight = crop.height;

        frameX = crop.x;
        frameY = crop.y;

        x = -src.displayOriginX + frameX;
        y = -src.displayOriginY + frameY;
    }

    if (src.flipX)
    {
        fx = -1;
    }

    if (src.flipY)
    {
        fy = -1;
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

    if (src.isCropped)
    {
        if (src.flipX)
        {
            if (x >= 0)
            {
                x = -(x + crop.cw);
            }
            else if (x < 0)
            {
                x = (Math.abs(x) - crop.cw);
            }
        }
    
        if (src.flipY)
        {
            if (y >= 0)
            {
                y = -(y + crop.ch);
            }
            else if (y < 0)
            {
                y = (Math.abs(y) - crop.ch);
            }
        }

        ctx.drawImage(frame.source.image, crop.cx, crop.cy, crop.cw, crop.ch, x, y, crop.cw, crop.ch);
    }
    else
    {
        var cd = frame.canvasData;

        ctx.drawImage(frame.source.image, cd.x, cd.y, frameWidth, frameHeight, x, y, frameWidth, frameHeight);
    }

    ctx.restore();

    /*
    var dx = frame.x;
    var dy = frame.y;

    var fx = 1;
    var fy = 1;

    if (src.flipX)
    {
        fx = -1;
        dx -= cd.width - src.displayOriginX;
    }
    else
    {
        dx -= src.displayOriginX;
    }

    if (src.flipY)
    {
        fy = -1;
        dy -= cd.height - src.displayOriginY;
    }
    else
    {
        dy -= src.displayOriginY;
    }

    var tx = src.x - camera.scrollX * src.scrollFactorX;
    var ty = src.y - camera.scrollY * src.scrollFactorY;

    if (camera.roundPixels)
    {
        tx |= 0;
        ty |= 0;
        dx |= 0;
        dy |= 0;
    }

    //  Perform Matrix ITRS

    ctx.save();

    if (parentMatrix)
    {
        var matrix = parentMatrix.matrix;

        ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    }

    ctx.translate(tx, ty);

    ctx.rotate(src.rotation);

    ctx.scale(src.scaleX, src.scaleY);
    ctx.scale(fx, fy);

    if (crop)
    {
        ctx.drawImage(frame.source.image, crop.cx, crop.cy, crop.width, crop.height, crop.x + dx, crop.y + dy, crop.width, crop.height);
    }
    else
    {
        ctx.drawImage(frame.source.image, cd.x, cd.y, cd.width, cd.height, dx, dy, cd.width, cd.height);
    }

    ctx.restore();
    */
};

module.exports = DrawImage;
