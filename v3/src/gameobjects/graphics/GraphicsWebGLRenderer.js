var Commands = require('./Commands');
var TransformMatrix = require('../../components/TransformMatrix');
var pathArray = [];
var cos = Math.cos;
var sin = Math.sin;
var sqrt = Math.sqrt;
var tempMatrix = new TransformMatrix();

var Point = function (x, y)
{
    this.x = x;
    this.y = y;
};

var Path = function (x, y)
{
    this.points = [];
    this.pointsLength = 1;
    this.points[0] = new Point(x, y);
};

var GraphicsWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }

    var shapeBatch = renderer.shapeBatch;
    var vertexDataBuffer = shapeBatch.vertexDataBuffer;
    var vertexBufferF32 = vertexDataBuffer.floatView;
    var vertexBufferU32 = vertexDataBuffer.uintView;
    var vertexOffset = 0;
    var cameraScrollX = camera.scrollX;
    var cameraScrollY = camera.scrollY;
    const srcX = src.x - cameraScrollX;
    const srcY = src.y - cameraScrollY;
    const srcScaleX = src.scaleX;
    const srcScaleY = src.scaleY;
    const srcRotation = -src.rotation;
    var commandBuffer = src.commandBuffer;
    var value;
    var lineAlpha = 1.0;
    var fillAlpha = 1.0;
    var lineColor = 0;
    var fillColor = 0;
    var lineWidth = 1.0;
    var cameraMatrix = camera.matrix.matrix;
    var lastPath = null;
    var iteration = 0;
    var iterStep = 0.01;
    var tx = 0;
    var ty = 0;
    var ta = 0;
    var x, y, radius, startAngle, endAngle, anticlockwise;
    var width, height, txw, tyh;
    var vertexCount = shapeBatch.vertexCount;
    var polygon = [];
    var x0, y0, x1, y1, x2, y2;
    var tx0, ty0, tx1, ty1, tx2, ty2;
    var v0, v1, v2;
    var polygonIndex;
    var path;
    var pathLength;
    var point;
    var maxVertices = shapeBatch.maxVertices;
    var translateX, translateY;
    var tempMatrixMatrix = tempMatrix.matrix;
    var sra, srb, src, srd, sre, srf, cma, cmb, cmc, cmd, cme, cmf;
    var mva, mvb, mvc, mvd, mve, mvf;

    tempMatrix.applyITRS(srcX, srcY, srcRotation, srcScaleX, srcScaleY);

    sra = tempMatrixMatrix[0];
    srb = tempMatrixMatrix[1];
    src = tempMatrixMatrix[2];
    srd = tempMatrixMatrix[3];
    sre = tempMatrixMatrix[4];
    srf = tempMatrixMatrix[5];

    cma = cameraMatrix[0];
    cmb = cameraMatrix[1];
    cmc = cameraMatrix[2];
    cmd = cameraMatrix[3];
    cme = cameraMatrix[4];
    cmf = cameraMatrix[5];

    mva = sra * cma + srb * cmc;
    mvb = sra * cmb + srb * cmd;
    mvc = src * cma + srd * cmc;
    mvd = src * cmb + srd * cmd;
    mve = sre * cma + srf * cmc + cme;
    mvf = sre * cmb + srf * cmd + cmf;

    renderer.setBatch(shapeBatch, null);

    for (var cmdIndex = 0, cmdLength = commandBuffer.length; cmdIndex < cmdLength; ++cmdIndex)
    {
        var cmd = commandBuffer[cmdIndex];

        switch(cmd)
        {
            case Commands.ARC:
                x = commandBuffer[cmdIndex + 1];
                y = commandBuffer[cmdIndex + 2];
                radius = commandBuffer[cmdIndex + 3];
                startAngle = commandBuffer[cmdIndex + 4];
                endAngle = commandBuffer[cmdIndex + 5];
                anticlockwise = commandBuffer[cmdIndex + 6];
                
                while (iteration < 1)
                {
                    ta = (endAngle - startAngle) * iteration + startAngle;
                    tx = x + cos(ta) * radius;
                    ty = y + sin(ta) * radius;

                    if (iteration === 0)
                    {
                        lastPath = new Path(tx, ty);
                        pathArray.push(lastPath);
                    }
                    else
                    {
                        lastPath.points.push(new Point(tx, ty));
                    }

                    iteration += iterStep;
                }
                cmdIndex += 6;
                break;

            case Commands.LINE_STYLE:
                lineWidth = commandBuffer[cmdIndex + 1];
                lineColor = commandBuffer[cmdIndex + 2];
                lineAlpha = commandBuffer[cmdIndex + 3];
                cmdIndex += 3;
                break;

            case Commands.FILL_STYLE:
                fillColor = commandBuffer[cmdIndex + 1];
                fillAlpha = commandBuffer[cmdIndex + 2];
                cmdIndex += 2;
                break;

            case Commands.BEGIN_PATH:
                pathArray.length = 0;
                break;

            case Commands.CLOSE_PATH:
                if (lastPath !== null && lastPath.points.length > 0)
                {
                    var firstPoint = lastPath.points[0];
                    lastPath.points.push(firstPoint);
                    lastPath = new Path(x, y);
                    pathArray.push(lastPath);
                }
                break;

            case Commands.FILL_PATH:
                for (var pathArrayIndex = 0, pathArrayLength = pathArray.length;
                    pathArrayIndex < pathArrayLength;
                    ++pathArrayIndex)
                {
                    shapeBatch.addFillPath(
                        /* Graphics Game Object Properties */
                        srcX, srcY, srcScaleX, srcScaleY, srcRotation,
                        /* Rectangle properties */ 
                        pathArray[pathArrayIndex].points,
                        fillColor,
                        fillAlpha,
                        /* Transform */
                        mva, mvb, mvc, mvd, mve, mvf
                    );
                }
                break;

            case Commands.STROKE_PATH:
                for (var pathArrayIndex = 0, pathArrayLength = pathArray.length;
                    pathArrayIndex < pathArrayLength;
                    ++pathArrayIndex)
                {
                    var path = pathArray[pathArrayIndex];
                    shapeBatch.addStrokePath(
                        /* Graphics Game Object Properties */
                        srcX, srcY, srcScaleX, srcScaleY, srcRotation,
                        /* Rectangle properties */ 
                        path.points,
                        lineWidth,
                        lineColor,
                        lineAlpha,
                        /* Transform */
                        mva, mvb, mvc, mvd, mve, mvf,
                        path === this._lastPath
                    );
                }
                break;
                
            case Commands.FILL_RECT:
                shapeBatch.addFillRect(
                    /* Graphics Game Object Properties */
                    srcX, srcY, srcScaleX, srcScaleY, srcRotation,
                    /* Rectangle properties */ 
                    commandBuffer[cmdIndex + 1] - cameraScrollX,
                    commandBuffer[cmdIndex + 2] - cameraScrollY,
                    commandBuffer[cmdIndex + 3],
                    commandBuffer[cmdIndex + 4],
                    fillColor,
                    fillAlpha,
                    /* Transform */
                    mva, mvb, mvc, mvd, mve, mvf
                );
             
                cmdIndex += 4;
                break;

            case Commands.LINE_TO:
                if (lastPath !== null)
                {
                    lastPath.points.push(new Point(commandBuffer[cmdIndex + 1], commandBuffer[cmdIndex + 2]));
                }
                else
                {
                    lastPath = new Path(commandBuffer[cmdIndex + 1], commandBuffer[cmdIndex + 2]);
                    pathArray.push(lastPath);
                }
                cmdIndex += 2;
                break;

            case Commands.MOVE_TO:
                lastPath = new Path(commandBuffer[cmdIndex + 1], commandBuffer[cmdIndex + 2]);
                pathArray.push(lastPath);
                cmdIndex += 2;
                break;

            default:
                console.error('Phaser: Invalid Graphics Command ID ' + cmd);
                break;
        }
    }

    pathArray.length = 0;
};

module.exports = GraphicsWebGLRenderer;
