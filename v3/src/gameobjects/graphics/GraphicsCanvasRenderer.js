var Commands = require('./Commands');
var PI2 = 2 * Math.PI;
var GraphicsCanvasRenderer = function (renderer, src, interpolationPercentage, camera)
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
    var ctx = renderer.currentContext;
    var value;

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
    ctx.translate(srcX, srcY);
    ctx.rotate(srcRotation);
    ctx.scale(srcScaleX, srcScaleY);
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = src.alpha;

    for (var index = 0, length = commandBuffer.length; index < length; ++index)
    {
        var commandID = commandBuffer[index];

        switch(commandID)
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
            case Commands.BEGIN_FILL:
                value = commandBuffer[index + 1];
                ctx.fillStyle = 'rgb(' + ((value & 0xFF0000) >>> 16) + ',' + ((value & 0xFF00) >>> 8) + ',' + (value & 0xFF) + ')';
                ctx.beginPath();
                index += 1;
                break;
            case Commands.END_FILL:
                ctx.fill();
                ctx.closePath();
                ctx.fillStyle = '#fff';
                break;
            case Commands.DRAW_CIRCLE:
                ctx.beginPath();
                ctx.arc(
                    commandBuffer[index + 1], 
                    commandBuffer[index + 2], 
                    commandBuffer[index + 3],
                    0,
                    PI2
                );
                ctx.fill();
                ctx.closePath();
                index += 3;
                break;
            case Commands.DRAW_RECT:
                ctx.fillRect(
                    commandBuffer[index + 1],
                    commandBuffer[index + 2],
                    commandBuffer[index + 3],
                    commandBuffer[index + 4]
                );
                index += 4;
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
            default:
                console.error('Phaser: Invalid Graphics Command ID ' + commandID);
                break;
        }
    }

    ctx.restore();
    ctx.globalAlpha = 1.0;
}

module.exports = GraphicsCanvasRenderer;
