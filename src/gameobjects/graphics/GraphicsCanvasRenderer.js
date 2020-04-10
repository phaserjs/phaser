/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Commands = require('./Commands');
var SetTransform = require('../../renderer/canvas/utils/SetTransform');

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @method Phaser.GameObjects.Graphics#renderCanvas
 * @since 3.0.0
 * @private
 *
 * @param {Phaser.Renderer.Canvas.CanvasRenderer} renderer - A reference to the current active Canvas renderer.
 * @param {Phaser.GameObjects.Graphics} src - The Game Object being rendered in this call.
 * @param {number} interpolationPercentage - Reserved for future use and custom pipelines.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that is rendering the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - This transform matrix is defined if the game object is nested
 * @param {CanvasRenderingContext2D} [renderTargetCtx] - The target rendering context.
 * @param {boolean} allowClip - If `true` then path operations will be used instead of fill operations.
 */
var GraphicsCanvasRenderer = function (renderer, src, interpolationPercentage, camera, parentMatrix, renderTargetCtx, allowClip)
{
    var commandBuffer = src.commandBuffer;
    var commandBufferLength = commandBuffer.length;

    var ctx = renderTargetCtx || renderer.currentContext;

    if (commandBufferLength === 0 || !SetTransform(renderer, ctx, src, camera, parentMatrix))
    {
        return;
    }

    var lineAlpha = 1;
    var fillAlpha = 1;
    var lineColor = 0;
    var fillColor = 0;
    var lineWidth = 1;
    var red = 0;
    var green = 0;
    var blue = 0;

    //  Reset any currently active paths
    ctx.beginPath();

    for (var index = 0; index < commandBufferLength; ++index)
    {
        var commandID = commandBuffer[index];

        switch (commandID)
        {
            case Commands.ARC:
                ctx.arc(
                    commandBuffer[index + 1],
                    commandBuffer[index + 2],
                    commandBuffer[index + 3],
                    commandBuffer[index + 4],
                    commandBuffer[index + 5],
                    commandBuffer[index + 6]
                );

                //  +7 because overshoot is the 7th value, not used in Canvas
                index += 7;
                break;

            case Commands.LINE_STYLE:
                lineWidth = commandBuffer[index + 1];
                lineColor = commandBuffer[index + 2];
                lineAlpha = commandBuffer[index + 3];
                red = ((lineColor & 0xFF0000) >>> 16);
                green = ((lineColor & 0xFF00) >>> 8);
                blue = (lineColor & 0xFF);
                ctx.strokeStyle = 'rgba(' + red + ',' + green + ',' + blue + ',' + lineAlpha + ')';
                ctx.lineWidth = lineWidth;
                index += 3;
                break;

            case Commands.FILL_STYLE:
                fillColor = commandBuffer[index + 1];
                fillAlpha = commandBuffer[index + 2];
                red = ((fillColor & 0xFF0000) >>> 16);
                green = ((fillColor & 0xFF00) >>> 8);
                blue = (fillColor & 0xFF);
                ctx.fillStyle = 'rgba(' + red + ',' + green + ',' + blue + ',' + fillAlpha + ')';
                index += 2;
                break;

            case Commands.BEGIN_PATH:
                ctx.beginPath();
                break;

            case Commands.CLOSE_PATH:
                ctx.closePath();
                break;

            case Commands.FILL_PATH:
                if (!allowClip)
                {
                    ctx.fill();
                }
                break;

            case Commands.STROKE_PATH:
                if (!allowClip)
                {
                    ctx.stroke();
                }
                break;

            case Commands.FILL_RECT:
                if (!allowClip)
                {
                    ctx.fillRect(
                        commandBuffer[index + 1],
                        commandBuffer[index + 2],
                        commandBuffer[index + 3],
                        commandBuffer[index + 4]
                    );
                }
                else
                {
                    ctx.rect(
                        commandBuffer[index + 1],
                        commandBuffer[index + 2],
                        commandBuffer[index + 3],
                        commandBuffer[index + 4]
                    );
                }
                index += 4;
                break;

            case Commands.FILL_TRIANGLE:
                ctx.beginPath();
                ctx.moveTo(commandBuffer[index + 1], commandBuffer[index + 2]);
                ctx.lineTo(commandBuffer[index + 3], commandBuffer[index + 4]);
                ctx.lineTo(commandBuffer[index + 5], commandBuffer[index + 6]);
                ctx.closePath();
                if (!allowClip)
                {
                    ctx.fill();
                }
                index += 6;
                break;

            case Commands.STROKE_TRIANGLE:
                ctx.beginPath();
                ctx.moveTo(commandBuffer[index + 1], commandBuffer[index + 2]);
                ctx.lineTo(commandBuffer[index + 3], commandBuffer[index + 4]);
                ctx.lineTo(commandBuffer[index + 5], commandBuffer[index + 6]);
                ctx.closePath();
                if (!allowClip)
                {
                    ctx.stroke();
                }
                index += 6;
                break;

            case Commands.LINE_TO:
                ctx.lineTo(
                    commandBuffer[index + 1],
                    commandBuffer[index + 2]
                );
                index += 2;
                break;

            case Commands.MOVE_TO:
                ctx.moveTo(
                    commandBuffer[index + 1],
                    commandBuffer[index + 2]
                );
                index += 2;
                break;

            case Commands.LINE_FX_TO:
                ctx.lineTo(
                    commandBuffer[index + 1],
                    commandBuffer[index + 2]
                );
                index += 5;
                break;

            case Commands.MOVE_FX_TO:
                ctx.moveTo(
                    commandBuffer[index + 1],
                    commandBuffer[index + 2]
                );
                index += 5;
                break;

            case Commands.SAVE:
                ctx.save();
                break;

            case Commands.RESTORE:
                ctx.restore();
                break;

            case Commands.TRANSLATE:
                ctx.translate(
                    commandBuffer[index + 1],
                    commandBuffer[index + 2]
                );
                index += 2;
                break;

            case Commands.SCALE:
                ctx.scale(
                    commandBuffer[index + 1],
                    commandBuffer[index + 2]
                );
                index += 2;
                break;

            case Commands.ROTATE:
                ctx.rotate(
                    commandBuffer[index + 1]
                );
                index += 1;
                break;

            case Commands.GRADIENT_FILL_STYLE:
                index += 5;
                break;

            case Commands.GRADIENT_LINE_STYLE:
                index += 6;
                break;

            case Commands.SET_TEXTURE:
                index += 2;
                break;
        }
    }

    //  Restore the context saved in SetTransform
    ctx.restore();
};

module.exports = GraphicsCanvasRenderer;
