/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Commands = require('./Commands');
var Utils = require('../../renderer/webgl/Utils');

//  TODO: Remove the use of this
var Point = function (x, y, width)
{
    this.x = x;
    this.y = y;
    this.width = width;
};

//  TODO: Remove the use of this
var Path = function (x, y, width)
{
    this.points = [];
    this.pointsLength = 1;
    this.points[0] = new Point(x, y, width);
};

var matrixStack = [];

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Graphics#renderWebGL
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.Graphics} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var GraphicsWebGLRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix)
{
    if (src.commandBuffer.length === 0)
    {
        return;
    }

    var pipeline = this.pipeline;

    renderer.setPipeline(pipeline, src);

    var camMatrix = src._tempMatrix1;
    var graphicsMatrix = src._tempMatrix2;
    var currentMatrix = src._tempMatrix3;

    currentMatrix.loadIdentity();

    graphicsMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

    camMatrix.copyFrom(camera.matrix);

    if (parentMatrix)
    {
        //  Multiply the camera by the parent matrix
        camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);

        //  Undo the camera scroll
        graphicsMatrix.e = src.x;
        graphicsMatrix.f = src.y;

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(graphicsMatrix);
    }
    else
    {
        graphicsMatrix.e -= camera.scrollX * src.scrollFactorX;
        graphicsMatrix.f -= camera.scrollY * src.scrollFactorY;

        //  Multiply by the Sprite matrix, store result in calcMatrix
        camMatrix.multiply(graphicsMatrix);
    }

    var commands = src.commandBuffer;
    var alpha = camera.alpha * src.alpha;

    var lineWidth = 1;
    var fillTint = pipeline.fillTint;
    var strokeTint = pipeline.strokeTint;

    var tx = 0;
    var ty = 0;
    var ta = 0;
    var iterStep = 0.01;
    var PI2 = Math.PI * 2;

    var cmd;

    var path = [];
    var pathIndex = 0;
    var pathOpen = false;
    var lastPath = null;

    var getTint = Utils.getTintAppendFloatAlphaAndSwap;

    var currentTexture = renderer.blankTexture.glTexture;

    for (var cmdIndex = 0; cmdIndex < commands.length; cmdIndex++)
    {
        cmd = commands[cmdIndex];

        switch (cmd)
        {
            case Commands.BEGIN_PATH:

                path.length = 0;
                lastPath = null;
                pathOpen = true;
                break;

            case Commands.CLOSE_PATH:

                pathOpen = false;

                if (lastPath && lastPath.points.length)
                {
                    lastPath.points.push(lastPath.points[0]);
                }
                break;

            case Commands.FILL_PATH:
                for (pathIndex = 0; pathIndex < path.length; pathIndex++)
                {
                    pipeline.setTexture2D(currentTexture);

                    pipeline.batchFillPath(
                        path[pathIndex].points,
                        currentMatrix,
                        camMatrix
                    );
                }
                break;

            case Commands.STROKE_PATH:
                for (pathIndex = 0; pathIndex < path.length; pathIndex++)
                {
                    pipeline.setTexture2D(currentTexture);

                    pipeline.batchStrokePath(
                        path[pathIndex].points,
                        lineWidth,
                        pathOpen,
                        currentMatrix,
                        camMatrix
                    );
                }
                break;

            case Commands.LINE_STYLE:
                lineWidth = commands[++cmdIndex];
                var strokeColor = commands[++cmdIndex];
                var strokeAlpha = commands[++cmdIndex] * alpha;
                var strokeTintColor = getTint(strokeColor, strokeAlpha);
                strokeTint.TL = strokeTintColor;
                strokeTint.TR = strokeTintColor;
                strokeTint.BL = strokeTintColor;
                strokeTint.BR = strokeTintColor;
                break;

            case Commands.FILL_STYLE:
                var fillColor = commands[++cmdIndex];
                var fillAlpha = commands[++cmdIndex] * alpha;
                var fillTintColor = getTint(fillColor, fillAlpha);
                fillTint.TL = fillTintColor;
                fillTint.TR = fillTintColor;
                fillTint.BL = fillTintColor;
                fillTint.BR = fillTintColor;
                break;

            case Commands.GRADIENT_FILL_STYLE:
                var gradientFillAlpha = commands[++cmdIndex] * alpha;
                fillTint.TL = getTint(commands[++cmdIndex], gradientFillAlpha);
                fillTint.TR = getTint(commands[++cmdIndex], gradientFillAlpha);
                fillTint.BL = getTint(commands[++cmdIndex], gradientFillAlpha);
                fillTint.BR = getTint(commands[++cmdIndex], gradientFillAlpha);
                break;

            case Commands.GRADIENT_LINE_STYLE:
                lineWidth = commands[++cmdIndex];
                var gradientLineAlpha = commands[++cmdIndex] * alpha;
                strokeTint.TL = getTint(commands[++cmdIndex], gradientLineAlpha);
                strokeTint.TR = getTint(commands[++cmdIndex], gradientLineAlpha);
                strokeTint.BL = getTint(commands[++cmdIndex], gradientLineAlpha);
                strokeTint.BR = getTint(commands[++cmdIndex], gradientLineAlpha);
                break;

            case Commands.ARC:
                var iteration = 0;
                var x = commands[++cmdIndex];
                var y = commands[++cmdIndex];
                var radius = commands[++cmdIndex];
                var startAngle = commands[++cmdIndex];
                var endAngle = commands[++cmdIndex];
                var anticlockwise = commands[++cmdIndex];
                var overshoot = commands[++cmdIndex];

                endAngle -= startAngle;

                if (anticlockwise)
                {
                    if (endAngle < -PI2)
                    {
                        endAngle = -PI2;
                    }
                    else if (endAngle > 0)
                    {
                        endAngle = -PI2 + endAngle % PI2;
                    }
                }
                else if (endAngle > PI2)
                {
                    endAngle = PI2;
                }
                else if (endAngle < 0)
                {
                    endAngle = PI2 + endAngle % PI2;
                }

                if (lastPath === null)
                {
                    lastPath = new Path(x + Math.cos(startAngle) * radius, y + Math.sin(startAngle) * radius, lineWidth);
                    path.push(lastPath);
                    iteration += iterStep;
                }

                while (iteration < 1 + overshoot)
                {
                    ta = endAngle * iteration + startAngle;
                    tx = x + Math.cos(ta) * radius;
                    ty = y + Math.sin(ta) * radius;

                    lastPath.points.push(new Point(tx, ty, lineWidth));

                    iteration += iterStep;
                }

                ta = endAngle + startAngle;
                tx = x + Math.cos(ta) * radius;
                ty = y + Math.sin(ta) * radius;

                lastPath.points.push(new Point(tx, ty, lineWidth));

                break;

            case Commands.FILL_RECT:
                pipeline.setTexture2D(currentTexture);
                pipeline.batchFillRect(
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    currentMatrix,
                    camMatrix
                );
                break;

            case Commands.FILL_TRIANGLE:
                pipeline.setTexture2D(currentTexture);
                pipeline.batchFillTriangle(
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    currentMatrix,
                    camMatrix
                );
                break;

            case Commands.STROKE_TRIANGLE:
                pipeline.setTexture2D(currentTexture);
                pipeline.batchStrokeTriangle(
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    lineWidth,
                    currentMatrix,
                    camMatrix
                );
                break;

            case Commands.LINE_TO:
                if (lastPath !== null)
                {
                    lastPath.points.push(new Point(commands[++cmdIndex], commands[++cmdIndex], lineWidth));
                }
                else
                {
                    lastPath = new Path(commands[++cmdIndex], commands[++cmdIndex], lineWidth);
                    path.push(lastPath);
                }
                break;

            case Commands.MOVE_TO:
                lastPath = new Path(commands[++cmdIndex], commands[++cmdIndex], lineWidth);
                path.push(lastPath);
                break;

            case Commands.SAVE:
                matrixStack.push(currentMatrix.copyToArray());
                break;

            case Commands.RESTORE:
                currentMatrix.copyFromArray(matrixStack.pop());
                break;

            case Commands.TRANSLATE:
                x = commands[++cmdIndex];
                y = commands[++cmdIndex];
                currentMatrix.translate(x, y);
                break;

            case Commands.SCALE:
                x = commands[++cmdIndex];
                y = commands[++cmdIndex];
                currentMatrix.scale(x, y);
                break;

            case Commands.ROTATE:
                currentMatrix.rotate(commands[++cmdIndex]);
                break;

            case Commands.SET_TEXTURE:
                var frame = commands[++cmdIndex];
                var mode = commands[++cmdIndex];

                pipeline.currentFrame = frame;
                pipeline.setTexture2D(frame.glTexture, 0);
                pipeline.tintEffect = mode;

                currentTexture = frame.glTexture;

                break;

            case Commands.CLEAR_TEXTURE:
                pipeline.currentFrame = renderer.blankTexture;
                pipeline.tintEffect = 2;
                currentTexture = renderer.blankTexture.glTexture;
                break;
        }
    }
};

module.exports = GraphicsWebGLRenderer;
