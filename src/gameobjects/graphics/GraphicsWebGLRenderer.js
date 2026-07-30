/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Commands = require('./Commands');
var GetCalcMatrix = require('../GetCalcMatrix');
var Utils = require('../../renderer/webgl/Utils');
var TransformMatrix = require('../components/TransformMatrix');

var Point = function (x, y, width)
{
    this.x = x;
    this.y = y;
    this.width = width;
};

var Path = function (x, y, width)
{
    this.points = [];
    this.points[0] = new Point(x, y, width);

    this.addPoint = function (x, y, width)
    {
        var point = this.points[this.points.length - 1];

        if (point.x === x && point.y === y)
        {
            return;
        }

        this.points.push(new Point(x, y, width));
    };
};

var matrixStack = [];
var tempMatrix = new TransformMatrix();
var renderMatrix = new TransformMatrix();
var fillTint = { TL: 0, TR: 0, BL: 0, BR: 0 };
var strokeTint = { TL: 0, TR: 0, BL: 0, BR: 0 };
var trianglePath = [
    { x: 0, y: 0, width: 0 },
    { x: 0, y: 0, width: 0 },
    { x: 0, y: 0, width: 0 },
    { x: 0, y: 0, width: 0 }
];

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
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 */
var GraphicsWebGLRenderer = function (renderer, src, drawingContext, parentMatrix)
{
    if (src.commandBuffer.length === 0)
    {
        return;
    }

    var customRenderNodes = src.customRenderNodes;
    var defaultRenderNodes = src.defaultRenderNodes;
    var submitterNode = customRenderNodes.Submitter || defaultRenderNodes.Submitter;
    var lighting = src.lighting;

    var currentContext = drawingContext;

    var camera = currentContext.camera;
    camera.addToRenderList(src);

    var calcMatrix = GetCalcMatrix(src, camera, parentMatrix, !drawingContext.useCanvas).calc;

    var currentMatrix = tempMatrix.loadIdentity();

    var commands = src.commandBuffer;
    var alpha = src.alpha;

    var pathDetailThreshold = Math.max(
        src.pathDetailThreshold,
        renderer.config.pathDetailThreshold,
        0
    );

    var lineWidth = 1;

    var tx = 0;
    var ty = 0;
    var ta = 0;
    var iterStep = 0.01;
    var PI2 = Math.PI * 2;

    var cmd;

    var path = [];
    var pathIndex = 0;
    var pathOpen = true;
    var lastPath = null;

    var getTint = Utils.getTintAppendFloatAlpha;

    for (var cmdIndex = 0; cmdIndex < commands.length; cmdIndex++)
    {
        cmd = commands[cmdIndex];

        switch (cmd)
        {
            case Commands.BEGIN_PATH:
            {
                path.length = 0;
                lastPath = null;
                pathOpen = true;
                break;
            }

            case Commands.CLOSE_PATH:
            {
                pathOpen = false;

                if (lastPath && lastPath.points.length)
                {
                    lastPath.points.push(lastPath.points[0]);
                }
                break;
            }

            case Commands.FILL_PATH:
            {
                calcMatrix.multiply(currentMatrix, renderMatrix);

                for (pathIndex = 0; pathIndex < path.length; pathIndex++)
                {
                    (customRenderNodes.FillPath || defaultRenderNodes.FillPath).run(
                        currentContext,
                        renderMatrix,
                        submitterNode,
                        path[pathIndex].points,
                        fillTint.TL,
                        fillTint.TR,
                        fillTint.BL,
                        pathDetailThreshold,
                        lighting
                    );
                }
                break;
            }

            case Commands.STROKE_PATH:
            {
                calcMatrix.multiply(currentMatrix, renderMatrix);

                for (pathIndex = 0; pathIndex < path.length; pathIndex++)
                {
                    (customRenderNodes.StrokePath || defaultRenderNodes.StrokePath).run(
                        currentContext,
                        submitterNode,
                        path[pathIndex].points,
                        lineWidth,
                        pathOpen,
                        renderMatrix,
                        strokeTint.TL,
                        strokeTint.TR,
                        strokeTint.BL,
                        strokeTint.BR,
                        pathDetailThreshold,
                        lighting
                    );
                }
                break;
            }

            case Commands.LINE_STYLE:
            {
                lineWidth = commands[++cmdIndex];
                var strokeColor = commands[++cmdIndex];
                var strokeAlpha = commands[++cmdIndex] * alpha;
                var strokeTintColor = getTint(strokeColor, strokeAlpha);
                strokeTint.TL = strokeTintColor;
                strokeTint.TR = strokeTintColor;
                strokeTint.BL = strokeTintColor;
                strokeTint.BR = strokeTintColor;
                break;
            }

            case Commands.FILL_STYLE:
            {
                var fillColor = commands[++cmdIndex];
                var fillAlpha = commands[++cmdIndex] * alpha;
                var fillTintColor = getTint(fillColor, fillAlpha);
                fillTint.TL = fillTintColor;
                fillTint.TR = fillTintColor;
                fillTint.BL = fillTintColor;
                fillTint.BR = fillTintColor;
                break;
            }

            case Commands.GRADIENT_FILL_STYLE:
            {
                var alphaTL = commands[++cmdIndex] * alpha;
                var alphaTR = commands[++cmdIndex] * alpha;
                var alphaBL = commands[++cmdIndex] * alpha;
                var alphaBR = commands[++cmdIndex] * alpha;

                fillTint.TL = getTint(commands[++cmdIndex], alphaTL);
                fillTint.TR = getTint(commands[++cmdIndex], alphaTR);
                fillTint.BL = getTint(commands[++cmdIndex], alphaBL);
                fillTint.BR = getTint(commands[++cmdIndex], alphaBR);
                break;
            }

            case Commands.GRADIENT_LINE_STYLE:
            {
                lineWidth = commands[++cmdIndex];
                var gradientLineAlpha = commands[++cmdIndex] * alpha;
                strokeTint.TL = getTint(commands[++cmdIndex], gradientLineAlpha);
                strokeTint.TR = getTint(commands[++cmdIndex], gradientLineAlpha);
                strokeTint.BL = getTint(commands[++cmdIndex], gradientLineAlpha);
                strokeTint.BR = getTint(commands[++cmdIndex], gradientLineAlpha);
                break;
            }

            case Commands.ARC:
            {
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

                    lastPath.addPoint(tx, ty, lineWidth);

                    iteration += iterStep;
                }

                ta = endAngle + startAngle;
                tx = x + Math.cos(ta) * radius;
                ty = y + Math.sin(ta) * radius;

                lastPath.addPoint(tx, ty, lineWidth);

                break;
            }

            case Commands.FILL_RECT:
            {
                calcMatrix.multiply(currentMatrix, renderMatrix);

                (customRenderNodes.FillRect || defaultRenderNodes.FillRect).run(
                    currentContext,
                    renderMatrix,
                    submitterNode,
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    fillTint.TL,
                    fillTint.TR,
                    fillTint.BL,
                    fillTint.BR,
                    lighting
                );

                break;
            }

            case Commands.FILL_TRIANGLE:
            {
                calcMatrix.multiply(currentMatrix, renderMatrix);

                (customRenderNodes.FillTri || defaultRenderNodes.FillTri).run(
                    currentContext,
                    renderMatrix,
                    submitterNode,
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    commands[++cmdIndex],
                    fillTint.TL,
                    fillTint.TR,
                    fillTint.BL,
                    lighting
                );

                break;
            }

            case Commands.STROKE_TRIANGLE:
            {
                calcMatrix.multiply(currentMatrix, renderMatrix);

                trianglePath[0].x = commands[++cmdIndex];
                trianglePath[0].y = commands[++cmdIndex];
                trianglePath[0].width = lineWidth;

                trianglePath[1].x = commands[++cmdIndex];
                trianglePath[1].y = commands[++cmdIndex];
                trianglePath[1].width = lineWidth;

                trianglePath[2].x = commands[++cmdIndex];
                trianglePath[2].y = commands[++cmdIndex];
                trianglePath[2].width = lineWidth;

                trianglePath[3].x = trianglePath[0].x;
                trianglePath[3].y = trianglePath[0].y;
                trianglePath[3].width = lineWidth;

                (customRenderNodes.StrokePath || defaultRenderNodes.StrokePath).run(
                    currentContext,
                    submitterNode,
                    trianglePath,
                    lineWidth,
                    false,
                    renderMatrix,
                    strokeTint.TL,
                    strokeTint.TR,
                    strokeTint.BL,
                    strokeTint.BR,
                    lighting
                );
                break;
            }

            case Commands.LINE_TO:
            {
                x = commands[++cmdIndex];
                y = commands[++cmdIndex];

                if (lastPath !== null)
                {
                    lastPath.addPoint(x, y, lineWidth);
                }
                else
                {
                    lastPath = new Path(x, y, lineWidth);
                    path.push(lastPath);
                }
                break;
            }

            case Commands.MOVE_TO:
            {
                lastPath = new Path(commands[++cmdIndex], commands[++cmdIndex], lineWidth);
                path.push(lastPath);
                break;
            }

            case Commands.SAVE:
            {
                matrixStack.push(currentMatrix.copyToArray());
                break;
            }

            case Commands.RESTORE:
            {
                currentMatrix.copyFromArray(matrixStack.pop());
                break;
            }

            case Commands.TRANSLATE:
            {
                x = commands[++cmdIndex];
                y = commands[++cmdIndex];
                currentMatrix.translate(x, y);
                break;
            }

            case Commands.SCALE:
            {
                x = commands[++cmdIndex];
                y = commands[++cmdIndex];
                currentMatrix.scale(x, y);
                break;
            }

            case Commands.ROTATE:
            {
                currentMatrix.rotate(commands[++cmdIndex]);
                break;
            }
        }
    }
};

module.exports = GraphicsWebGLRenderer;
