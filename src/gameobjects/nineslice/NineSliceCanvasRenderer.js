/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DrawSlice = function (ctx, image, roundPixels, res, fx, fy, width, height, x, y, frameWidth, frameHeight)
{
    var fw = width / res;
    var fh = height / res;

    if (frameWidth === undefined) { frameWidth = width; }
    if (frameHeight === undefined) { frameHeight = height; }

    if (roundPixels)
    {
        var rx = Math.floor(x + 0.5);
        var ry = Math.floor(y + 0.5);
        fw = Math.floor((x + fw) + 0.5) - rx;
        fh = Math.floor((y + fh) + 0.5) - ry;
        x = rx;
        y = ry;
    }

    ctx.drawImage(
        image,
        fx, fy,
        frameWidth, frameHeight,
        x, y,
        fw, fh
    );
};

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.NineSlice#renderCanvas
 * @since 4.0.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.NineSlice} src - The Game Object being rendered in this call.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var NineSliceCanvasRenderer = function (renderer, src, camera, parentMatrix)
{
    camera.addToRenderList(src);

    var alpha = camera.alpha * src.alpha;

    if (alpha === 0)
    {
        //  Nothing to see, so abort early
        return;
    }

    var ctx = renderer.currentContext;

    var camMatrix = renderer._tempMatrix1;
    var spriteMatrix = renderer._tempMatrix2;

    var frame = src.frame;

    var cd = frame.canvasData;

    var frameX = cd.x;
    var frameY = cd.y;
    var frameWidth = frame.cutWidth;
    var frameHeight = frame.cutHeight;

    var res = frame.source.resolution;

    var displayOriginX = src.displayOriginX;
    var displayOriginY = src.displayOriginY;

    var x = -displayOriginX + frame.x;
    var y = -displayOriginY + frame.y;

    var gx = src.x;
    var gy = src.y;

    if (camera.roundPixels)
    {
        gx = Math.floor(gx);
        gy = Math.floor(gy);
    }

    spriteMatrix.applyITRS(gx, gy, src.rotation, src.scaleX, src.scaleY);

    camMatrix.copyWithScrollFactorFrom(
        camera.matrixCombined,
        camera.scrollX, camera.scrollY,
        src.scrollFactorX, src.scrollFactorY
    );

    if (parentMatrix)
    {
        camMatrix.multiply(parentMatrix);
    }

    //  Multiply by the Sprite matrix
    camMatrix.multiply(spriteMatrix);

    if (camera.renderRoundPixels)
    {
        camMatrix.e = Math.floor(camMatrix.e + 0.5);
        camMatrix.f = Math.floor(camMatrix.f + 0.5);
    }

    ctx.save();

    camMatrix.setToContext(ctx);

    ctx.globalCompositeOperation = renderer.blendModes[src.blendMode];

    ctx.globalAlpha = alpha;

    ctx.imageSmoothingEnabled = !frame.source.scaleMode;

    if (src.mask)
    {
        src.mask.preRenderCanvas(renderer, src, camera);
    }

    if (frameWidth > 0 && frameHeight > 0)
    {
        var img = frame.source.image;
        var rp = camera.roundPixels;

        if (src.is3Slice)
        {
            // Left side
            DrawSlice(
                ctx, img, rp, res,
                frameX, frameY,
                src.leftWidth, src.height,
                x, y
            );

            // Middle
            DrawSlice(
                ctx, img, rp, res,
                frameX + src.leftWidth, frameY,
                src.width - src.leftWidth - src.rightWidth, src.height,
                x + src.leftWidth, y,
                frameWidth - src.leftWidth - src.rightWidth
            );

            // Right side
            DrawSlice(
                ctx, img, rp, res,
                frameX + frameWidth - src.rightWidth, frameY,
                src.rightWidth, src.height,
                x + src.width - src.rightWidth, y
            );
        }
        else
        {
            // Top-left corner
            DrawSlice(
                ctx, img, rp, res,
                frameX, frameY,
                src.leftWidth, src.topHeight,
                x, y
            );

            // Top-right corner
            DrawSlice(
                ctx, img, rp, res,
                frameX + frameWidth - src.rightWidth, frameY,
                src.rightWidth, src.topHeight,
                x + src.width - src.rightWidth, y
            );

            // Bottom-left corner
            DrawSlice(
                ctx, img, rp, res,
                frameX, frameY + frameHeight - src.bottomHeight,
                src.leftWidth, src.bottomHeight,
                x, y + src.height - src.bottomHeight
            );

            // Bottom-right corner
            DrawSlice(
                ctx, img, rp, res,
                frameX + frameWidth - src.rightWidth, frameY + frameHeight - src.bottomHeight,
                src.rightWidth, src.bottomHeight,
                x + src.width - src.rightWidth, y + src.height - src.bottomHeight
            );

            // Top edge
            DrawSlice(
                ctx, img, rp, res,
                frameX + src.leftWidth, frameY,
                src.width - src.leftWidth - src.rightWidth, src.topHeight,
                x + src.leftWidth, y,
                frameWidth - src.leftWidth - src.rightWidth
            );

            // Bottom edge
            DrawSlice(
                ctx, img, rp, res,
                frameX + src.leftWidth, frameY + frameHeight - src.bottomHeight,
                src.width - src.leftWidth - src.rightWidth, src.bottomHeight,
                x + src.leftWidth, y + src.height - src.bottomHeight,
                frameWidth - src.leftWidth - src.rightWidth
            );

            // Left edge
            DrawSlice(
                ctx, img, rp, res,
                frameX, frameY + src.topHeight,
                src.leftWidth, src.height - src.topHeight - src.bottomHeight,
                x, y + src.topHeight,
                undefined, frameHeight - src.topHeight - src.bottomHeight
            );

            // Right edge
            DrawSlice(
                ctx, img, rp, res,
                frameX + frameWidth - src.rightWidth, frameY + src.topHeight,
                src.rightWidth, src.height - src.topHeight - src.bottomHeight,
                x + src.width - src.rightWidth, y + src.topHeight,
                undefined, frameHeight - src.topHeight - src.bottomHeight
            );

            // Center
            DrawSlice(
                ctx, img, rp, res,
                frameX + src.leftWidth, frameY + src.topHeight,
                src.width - src.leftWidth - src.rightWidth, src.height - src.topHeight - src.bottomHeight,
                x + src.leftWidth, y + src.topHeight,
                frameWidth - src.leftWidth - src.rightWidth, frameHeight - src.topHeight - src.bottomHeight
            );
        }
    }

    if (src.mask)
    {
        src.mask.postRenderCanvas(renderer, src, camera);
    }

    ctx.restore();
};

module.exports = NineSliceCanvasRenderer;
