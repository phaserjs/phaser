var Commands = require('./Commands');
var MATH_CONST = require('../../math/const');

var GraphicsCanvasRenderer = function (renderer, src, interpolationPercentage, camera, renderTargetCtx)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }

    var cameraScrollX = camera.scrollX;
    var cameraScrollY = camera.scrollY;
    var srcX = src.x;
    var srcY = src.y;
    var srcScaleX = src.scaleX;
    var srcScaleY = src.scaleY;
    var srcRotation = src.rotation;
    var commandBuffer = src.commandBuffer;
    var ctx = renderTargetCtx || renderer.currentContext;
    var value;
    var lineAlpha = 1.0;
    var fillAlpha = 1.0;
    var lineColor = 0;
    var fillColor = 0;
    var lineWidth = 1.0;
    var red = 0;
    var green = 0;
    var blue = 0;

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
    ctx.translate(srcX - cameraScrollX, srcY - cameraScrollY);
    ctx.rotate(srcRotation);
    ctx.scale(srcScaleX, srcScaleY);
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = src.alpha;

    for (var index = 0, length = commandBuffer.length; index < length; ++index)
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
                index += 6;
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
                ctx.fill();
                break;

            case Commands.STROKE_PATH:
                ctx.stroke();
                break;

            case Commands.FILL_RECT:
                ctx.fillRect(
                    commandBuffer[index + 1],
                    commandBuffer[index + 2],
                    commandBuffer[index + 3],
                    commandBuffer[index + 4]
                );
                index += 4;
                break;

            case Commands.FILL_TRIANGLE:
                ctx.beginPath();
                ctx.moveTo(commandBuffer[index + 1], commandBuffer[index + 2]);
                ctx.lineTo(commandBuffer[index + 3], commandBuffer[index + 4]);
                ctx.lineTo(commandBuffer[index + 5], commandBuffer[index + 6]);
                ctx.lineTo(commandBuffer[index + 1], commandBuffer[index + 2]);
                ctx.closePath();
                ctx.fill();
                index += 6;
                break;

            case Commands.STROKE_TRIANGLE:
                ctx.beginPath();
                ctx.moveTo(commandBuffer[index + 1], commandBuffer[index + 2]);
                ctx.lineTo(commandBuffer[index + 3], commandBuffer[index + 4]);
                ctx.lineTo(commandBuffer[index + 5], commandBuffer[index + 6]);
                ctx.lineTo(commandBuffer[index + 1], commandBuffer[index + 2]);
                ctx.closePath();
                ctx.stroke();
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

            default:
                console.error('Phaser: Invalid Graphics Command ID ' + commandID);
                break;
        }
    }

    ctx.restore();
};

module.exports = GraphicsCanvasRenderer;
