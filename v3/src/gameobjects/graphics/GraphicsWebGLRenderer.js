var Commands = require('./Commands');
var Earcut = require('./earcut');
var pathArray = [];
var cos = Math.cos;
var sin = Math.sin;
var sqrt = Math.sqrt;

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

var lerp = function (norm, min, max)
{
    return (max - min) * norm + min;
};

var renderLine = function (
    /* start and end of line */
    ax, ay, bx, by,
    /* buffers */
    vertexBufferF32, vertexBufferU32, vertexDataBuffer,
    /* camera scroll */
    cameraScrollX, cameraScrollY,
    /* Camera transform */
    a, b, c, d, e, f,
    /* line properties */
    lineColor, lineAlpha, lineWidth,
    /* vertex count and limits */
    vertexCount, maxVertices,
    /* batch */
    shapeBatch,
    /* Game Object transform */
    srcX, srcY, srcScaleX, srcScaleY, srcRotation
)
{
    if (vertexCount + 6 > maxVertices)
    {
        shapeBatch.flush();
        vertexCount = 0;
    }

    shapeBatch.vertexCount = vertexCount + 6;

    ax -= cameraScrollX;
    bx -= cameraScrollX;
    ay -= cameraScrollY;
    by -= cameraScrollY;

    var vertexOffset = vertexDataBuffer.allocate(9 * 6);
    var dx = bx - ax;
    var dy = by - ay;
    var len = sqrt(dx * dx + dy * dy);
    var l0 = lineWidth * (by - ay) / len;
    var l1 = lineWidth * (ax - bx) / len;
    var lx0 = bx - l0;
    var ly0 = by - l1;
    var lx1 = ax - l0;
    var ly1 = ay - l1;
    var lx2 = bx + l0;
    var ly2 = by + l1;
    var lx3 = ax + l0;
    var ly3 = ay + l1;
    var x0 = lx0 * a + ly0 * c + e;
    var y0 = lx0 * b + ly0 * d + f;
    var x1 = lx1 * a + ly1 * c + e;
    var y1 = lx1 * b + ly1 * d + f;
    var x2 = lx2 * a + ly2 * c + e;
    var y2 = lx2 * b + ly2 * d + f;
    var x3 = lx3 * a + ly3 * c + e;
    var y3 = lx3 * b + ly3 * d + f;

    vertexBufferF32[vertexOffset++] = x0;
    vertexBufferF32[vertexOffset++] = y0;
    vertexBufferU32[vertexOffset++] = lineColor;
    vertexBufferF32[vertexOffset++] = lineAlpha;
    vertexBufferF32[vertexOffset++] = srcX;
    vertexBufferF32[vertexOffset++] = srcY;
    vertexBufferF32[vertexOffset++] = srcScaleX;
    vertexBufferF32[vertexOffset++] = srcScaleY;
    vertexBufferF32[vertexOffset++] = srcRotation;

    vertexBufferF32[vertexOffset++] = x1;
    vertexBufferF32[vertexOffset++] = y1;
    vertexBufferU32[vertexOffset++] = lineColor;
    vertexBufferF32[vertexOffset++] = lineAlpha;
    vertexBufferF32[vertexOffset++] = srcX;
    vertexBufferF32[vertexOffset++] = srcY;
    vertexBufferF32[vertexOffset++] = srcScaleX;
    vertexBufferF32[vertexOffset++] = srcScaleY;
    vertexBufferF32[vertexOffset++] = srcRotation;

    vertexBufferF32[vertexOffset++] = x2;
    vertexBufferF32[vertexOffset++] = y2;
    vertexBufferU32[vertexOffset++] = lineColor;
    vertexBufferF32[vertexOffset++] = lineAlpha;
    vertexBufferF32[vertexOffset++] = srcX;
    vertexBufferF32[vertexOffset++] = srcY;
    vertexBufferF32[vertexOffset++] = srcScaleX;
    vertexBufferF32[vertexOffset++] = srcScaleY;
    vertexBufferF32[vertexOffset++] = srcRotation;

    vertexBufferF32[vertexOffset++] = x1;
    vertexBufferF32[vertexOffset++] = y1;
    vertexBufferU32[vertexOffset++] = lineColor;
    vertexBufferF32[vertexOffset++] = lineAlpha;
    vertexBufferF32[vertexOffset++] = srcX;
    vertexBufferF32[vertexOffset++] = srcY;
    vertexBufferF32[vertexOffset++] = srcScaleX;
    vertexBufferF32[vertexOffset++] = srcScaleY;
    vertexBufferF32[vertexOffset++] = srcRotation;

    vertexBufferF32[vertexOffset++] = x3;
    vertexBufferF32[vertexOffset++] = y3;
    vertexBufferU32[vertexOffset++] = lineColor;
    vertexBufferF32[vertexOffset++] = lineAlpha;
    vertexBufferF32[vertexOffset++] = srcX;
    vertexBufferF32[vertexOffset++] = srcY;
    vertexBufferF32[vertexOffset++] = srcScaleX;
    vertexBufferF32[vertexOffset++] = srcScaleY;
    vertexBufferF32[vertexOffset++] = srcRotation;

    vertexBufferF32[vertexOffset++] = x2;
    vertexBufferF32[vertexOffset++] = y2;
    vertexBufferU32[vertexOffset++] = lineColor;
    vertexBufferF32[vertexOffset++] = lineAlpha;
    vertexBufferF32[vertexOffset++] = srcX;
    vertexBufferF32[vertexOffset++] = srcY;
    vertexBufferF32[vertexOffset++] = srcScaleX;
    vertexBufferF32[vertexOffset++] = srcScaleY;
    vertexBufferF32[vertexOffset++] = srcRotation;

    return [
        x0, y0,
        x1, y1,
        x2, y2,
        x3, y3
    ];
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
    var srcX = src.x;
    var srcY = src.y;
    var srcScaleX = src.scaleX;
    var srcScaleY = src.scaleY;
    var srcRotation = src.rotation;
    var commandBuffer = src.commandBuffer;
    var value;
    var lineAlpha = 1.0;
    var fillAlpha = 1.0;
    var lineColor = 0;
    var fillColor = 0;
    var lineWidth = 1.0;
    var cameraMatrix = camera.matrix.matrix;
    var a = cameraMatrix[0];
    var b = cameraMatrix[1];
    var c = cameraMatrix[2];
    var d = cameraMatrix[3];
    var e = cameraMatrix[4];
    var f = cameraMatrix[5];
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
                    ta = lerp(iteration, startAngle, endAngle);
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
                    // var lastPoint = lastPath.points[lastPath.points.length - 1];
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
                    path = pathArray[pathArrayIndex].points;
                    pathLength = path.length;

                    for (var pathIndex = 0;
                        pathIndex < pathLength;
                        ++pathIndex)
                    {
                        point = path[pathIndex];
                        polygon.push(point.x, point.y);
                    }

                    polygonIndex = Earcut(polygon);

                    for (var index = 0, length = polygonIndex.length; index < length; index += 3)
                    {
                        v0 = polygonIndex[index + 0] * 2;
                        v1 = polygonIndex[index + 1] * 2;
                        v2 = polygonIndex[index + 2] * 2;

                        if (vertexCount + 3 > maxVertices)
                        {
                            shapeBatch.flush();
                            vertexCount = 0;
                        }

                        vertexOffset = vertexDataBuffer.allocate(9 * 3);
                        vertexCount += 3;

                        x0 = polygon[v0 + 0] - cameraScrollX;
                        y0 = polygon[v0 + 1] - cameraScrollY;
                        x1 = polygon[v1 + 0] - cameraScrollX;
                        y1 = polygon[v1 + 1] - cameraScrollY;
                        x2 = polygon[v2 + 0] - cameraScrollX;
                        y2 = polygon[v2 + 1] - cameraScrollY;

                        tx0 = x0 * a + y0 * c + e;
                        ty0 = x0 * b + y0 * d + f;
                        tx1 = x1 * a + y1 * c + e;
                        ty1 = x1 * b + y1 * d + f;
                        tx2 = x2 * a + y2 * c + e;
                        ty2 = x2 * b + y2 * d + f;

                        vertexBufferF32[vertexOffset++] = tx0;
                        vertexBufferF32[vertexOffset++] = ty0;
                        vertexBufferU32[vertexOffset++] = fillColor;
                        vertexBufferF32[vertexOffset++] = fillAlpha;
                        vertexBufferF32[vertexOffset++] = srcX;
                        vertexBufferF32[vertexOffset++] = srcY;
                        vertexBufferF32[vertexOffset++] = srcScaleX;
                        vertexBufferF32[vertexOffset++] = srcScaleY;
                        vertexBufferF32[vertexOffset++] = srcRotation;
                        
                        vertexBufferF32[vertexOffset++] = tx1;
                        vertexBufferF32[vertexOffset++] = ty1;
                        vertexBufferU32[vertexOffset++] = fillColor;
                        vertexBufferF32[vertexOffset++] = fillAlpha;
                        vertexBufferF32[vertexOffset++] = srcX;
                        vertexBufferF32[vertexOffset++] = srcY;
                        vertexBufferF32[vertexOffset++] = srcScaleX;
                        vertexBufferF32[vertexOffset++] = srcScaleY;
                        vertexBufferF32[vertexOffset++] = srcRotation;

                        vertexBufferF32[vertexOffset++] = tx2;
                        vertexBufferF32[vertexOffset++] = ty2;
                        vertexBufferU32[vertexOffset++] = fillColor;
                        vertexBufferF32[vertexOffset++] = fillAlpha;
                        vertexBufferF32[vertexOffset++] = srcX;
                        vertexBufferF32[vertexOffset++] = srcY;
                        vertexBufferF32[vertexOffset++] = srcScaleX;
                        vertexBufferF32[vertexOffset++] = srcScaleY;
                        vertexBufferF32[vertexOffset++] = srcRotation;
                    }
                    polygon.length = 0;
                }
                break;

            case Commands.STROKE_PATH:

                //  All of these vars are already defined (except polylines, last, curr, point0 and point1)
                var pathArrayLength = pathArray.length;
                var lineWidth = lineWidth * 0.5;
                var pathArrayIndex, path, pathLength, pathIndex, point0, point1;
                var polylines = [];
                var lineColor = lineColor;
                var index, length, last, curr;
                var x0, y0, x1, y1, x2, y2, offset, position, color;

                for (pathArrayIndex = 0; pathArrayIndex < pathArrayLength; ++pathArrayIndex)
                {
                    path = pathArray[pathArrayIndex].points;
                    pathLength = path.length;

                    for (pathIndex = 0; pathIndex + 1 < pathLength; pathIndex += 1)
                    {
                        point0 = path[pathIndex];
                        point1 = path[pathIndex + 1];
                        polylines.push(renderLine(
                            point0.x, point0.y, point1.x, point1.y,
                            vertexBufferF32, vertexBufferU32, vertexDataBuffer,
                            cameraScrollX, cameraScrollY,
                            a, b, c, d, e, f,
                            lineColor, lineAlpha, lineWidth,
                            vertexCount, maxVertices,
                            shapeBatch,
                            srcX, srcY, srcScaleX, srcScaleY, srcRotation
                        ));
                        vertexCount = shapeBatch.vertexCount;
                    }

                    if (pathArray[pathArrayIndex] === this._lastPath)
                    {
                        for (index = 1, length = polylines.length; index < length; ++index)
                        {
                            last = polylines[index - 1];
                            curr = polylines[index];

                            if (vertexCount + 6 > maxVertices)
                            {
                                shapeBatch.flush();
                                vertexCount = 0;
                            }

                            vertexOffset = vertexDataBuffer.allocate(9 * 6);
                            vertexCount += 6;

                            x0 = last[2 * 2 + 0] - cameraScrollX;
                            y0 = last[2 * 2 + 1] - cameraScrollY;
                            x1 = last[2 * 0 + 0] - cameraScrollX;
                            y1 = last[2 * 0 + 1] - cameraScrollY;
                            x2 = curr[2 * 3 + 0] - cameraScrollX;
                            y2 = curr[2 * 3 + 1] - cameraScrollY;

                            vertexBufferF32[vertexOffset++] = x0;
                            vertexBufferF32[vertexOffset++] = y0;
                            vertexBufferU32[vertexOffset++] = lineColor;
                            vertexBufferF32[vertexOffset++] = lineAlpha;
                            vertexBufferF32[vertexOffset++] = srcX;
                            vertexBufferF32[vertexOffset++] = srcY;
                            vertexBufferF32[vertexOffset++] = srcScaleX;
                            vertexBufferF32[vertexOffset++] = srcScaleY;
                            vertexBufferF32[vertexOffset++] = srcRotation;

                            vertexBufferF32[vertexOffset++] = x1;
                            vertexBufferF32[vertexOffset++] = y1;
                            vertexBufferU32[vertexOffset++] = lineColor;
                            vertexBufferF32[vertexOffset++] = lineAlpha;
                            vertexBufferF32[vertexOffset++] = srcX;
                            vertexBufferF32[vertexOffset++] = srcY;
                            vertexBufferF32[vertexOffset++] = srcScaleX;
                            vertexBufferF32[vertexOffset++] = srcScaleY;
                            vertexBufferF32[vertexOffset++] = srcRotation;

                            vertexBufferF32[vertexOffset++] = x2;
                            vertexBufferF32[vertexOffset++] = y2;
                            vertexBufferU32[vertexOffset++] = lineColor;
                            vertexBufferF32[vertexOffset++] = lineAlpha;
                            vertexBufferF32[vertexOffset++] = srcX;
                            vertexBufferF32[vertexOffset++] = srcY;
                            vertexBufferF32[vertexOffset++] = srcScaleX;
                            vertexBufferF32[vertexOffset++] = srcScaleY;
                            vertexBufferF32[vertexOffset++] = srcRotation;

                            x0 = last[2 * 0 + 0] - cameraScrollX;
                            y0 = last[2 * 0 + 1] - cameraScrollY;
                            x1 = last[2 * 2 + 0] - cameraScrollX;
                            y1 = last[2 * 2 + 1] - cameraScrollY;
                            x2 = curr[2 * 1 + 0] - cameraScrollX;
                            y2 = curr[2 * 1 + 1] - cameraScrollY;

                            vertexBufferF32[vertexOffset++] = x0;
                            vertexBufferF32[vertexOffset++] = y0;
                            vertexBufferU32[vertexOffset++] = lineColor;
                            vertexBufferF32[vertexOffset++] = lineAlpha;
                            vertexBufferF32[vertexOffset++] = srcX;
                            vertexBufferF32[vertexOffset++] = srcY;
                            vertexBufferF32[vertexOffset++] = srcScaleX;
                            vertexBufferF32[vertexOffset++] = srcScaleY;
                            vertexBufferF32[vertexOffset++] = srcRotation;

                            vertexBufferF32[vertexOffset++] = x1;
                            vertexBufferF32[vertexOffset++] = y1;
                            vertexBufferU32[vertexOffset++] = lineColor;
                            vertexBufferF32[vertexOffset++] = lineAlpha;
                            vertexBufferF32[vertexOffset++] = srcX;
                            vertexBufferF32[vertexOffset++] = srcY;
                            vertexBufferF32[vertexOffset++] = srcScaleX;
                            vertexBufferF32[vertexOffset++] = srcScaleY;
                            vertexBufferF32[vertexOffset++] = srcRotation;

                            vertexBufferF32[vertexOffset++] = x2;
                            vertexBufferF32[vertexOffset++] = y2;
                            vertexBufferU32[vertexOffset++] = lineColor;
                            vertexBufferF32[vertexOffset++] = lineAlpha;
                            vertexBufferF32[vertexOffset++] = srcX;
                            vertexBufferF32[vertexOffset++] = srcY;
                            vertexBufferF32[vertexOffset++] = srcScaleX;
                            vertexBufferF32[vertexOffset++] = srcScaleY;
                            vertexBufferF32[vertexOffset++] = srcRotation;

                            vertexCount += 6;
                        }
                    }
                    else
                    {
                        for (index = 0, length = polylines.length; index < length; ++index)
                        {
                            last = polylines[index - 1] || polylines[polylines.length - 1];
                            curr = polylines[index];

                            if (vertexCount + 6 > maxVertices)
                            {
                                shapeBatch.flush();
                                vertexCount = 0;
                            }

                            vertexOffset = vertexDataBuffer.allocate(9 * 6);
                            vertexCount += 6;

                            x0 = last[2 * 2 + 0] - cameraScrollX;
                            y0 = last[2 * 2 + 1] - cameraScrollY;
                            x1 = last[2 * 0 + 0] - cameraScrollX;
                            y1 = last[2 * 0 + 1] - cameraScrollY;
                            x2 = curr[2 * 3 + 0] - cameraScrollX;
                            y2 = curr[2 * 3 + 1] - cameraScrollY;

                            vertexBufferF32[vertexOffset++] = x0;
                            vertexBufferF32[vertexOffset++] = y0;
                            vertexBufferU32[vertexOffset++] = lineColor;
                            vertexBufferF32[vertexOffset++] = lineAlpha;
                            vertexBufferF32[vertexOffset++] = srcX;
                            vertexBufferF32[vertexOffset++] = srcY;
                            vertexBufferF32[vertexOffset++] = srcScaleX;
                            vertexBufferF32[vertexOffset++] = srcScaleY;
                            vertexBufferF32[vertexOffset++] = srcRotation;

                            vertexBufferF32[vertexOffset++] = x1;
                            vertexBufferF32[vertexOffset++] = y1;
                            vertexBufferU32[vertexOffset++] = lineColor;
                            vertexBufferF32[vertexOffset++] = lineAlpha;
                            vertexBufferF32[vertexOffset++] = srcX;
                            vertexBufferF32[vertexOffset++] = srcY;
                            vertexBufferF32[vertexOffset++] = srcScaleX;
                            vertexBufferF32[vertexOffset++] = srcScaleY;
                            vertexBufferF32[vertexOffset++] = srcRotation;

                            vertexBufferF32[vertexOffset++] = x2;
                            vertexBufferF32[vertexOffset++] = y2;
                            vertexBufferU32[vertexOffset++] = lineColor;
                            vertexBufferF32[vertexOffset++] = lineAlpha;
                            vertexBufferF32[vertexOffset++] = srcX;
                            vertexBufferF32[vertexOffset++] = srcY;
                            vertexBufferF32[vertexOffset++] = srcScaleX;
                            vertexBufferF32[vertexOffset++] = srcScaleY;
                            vertexBufferF32[vertexOffset++] = srcRotation;

                            x0 = last[2 * 0 + 0] - cameraScrollX;
                            y0 = last[2 * 0 + 1] - cameraScrollY;
                            x1 = last[2 * 2 + 0] - cameraScrollX;
                            y1 = last[2 * 2 + 1] - cameraScrollY;
                            x2 = curr[2 * 1 + 0] - cameraScrollX;
                            y2 = curr[2 * 1 + 1] - cameraScrollY;

                            vertexBufferF32[vertexOffset++] = x0;
                            vertexBufferF32[vertexOffset++] = y0;
                            vertexBufferU32[vertexOffset++] = lineColor;
                            vertexBufferF32[vertexOffset++] = lineAlpha;
                            vertexBufferF32[vertexOffset++] = srcX;
                            vertexBufferF32[vertexOffset++] = srcY;
                            vertexBufferF32[vertexOffset++] = srcScaleX;
                            vertexBufferF32[vertexOffset++] = srcScaleY;
                            vertexBufferF32[vertexOffset++] = srcRotation;

                            vertexBufferF32[vertexOffset++] = x1;
                            vertexBufferF32[vertexOffset++] = y1;
                            vertexBufferU32[vertexOffset++] = lineColor;
                            vertexBufferF32[vertexOffset++] = lineAlpha;
                            vertexBufferF32[vertexOffset++] = srcX;
                            vertexBufferF32[vertexOffset++] = srcY;
                            vertexBufferF32[vertexOffset++] = srcScaleX;
                            vertexBufferF32[vertexOffset++] = srcScaleY;
                            vertexBufferF32[vertexOffset++] = srcRotation;

                            vertexBufferF32[vertexOffset++] = x2;
                            vertexBufferF32[vertexOffset++] = y2;
                            vertexBufferU32[vertexOffset++] = lineColor;
                            vertexBufferF32[vertexOffset++] = lineAlpha;
                            vertexBufferF32[vertexOffset++] = srcX;
                            vertexBufferF32[vertexOffset++] = srcY;
                            vertexBufferF32[vertexOffset++] = srcScaleX;
                            vertexBufferF32[vertexOffset++] = srcScaleY;
                            vertexBufferF32[vertexOffset++] = srcRotation;

                            vertexCount += 6;
                        }
                    }
                    polylines.length = 0;
                }
                break;

            case Commands.FILL_RECT:
                if (vertexCount + 6 > maxVertices)
                {
                    shapeBatch.flush();
                    vertexCount = 0;
                }
                vertexOffset = vertexDataBuffer.allocate(9 * 6);
                vertexCount += 6;

                x = commandBuffer[cmdIndex + 1] - cameraScrollX;
                y = commandBuffer[cmdIndex + 2] - cameraScrollY;
                var xw = x + commandBuffer[cmdIndex + 3];
                var yh = y + commandBuffer[cmdIndex + 4];
                tx = x * a + y * c + e;
                ty = x * b + y * d + f;
                txw = xw * a + yh * c + e;
                tyh = xw * b + yh * d + f;

                vertexBufferF32[vertexOffset++] = tx;
                vertexBufferF32[vertexOffset++] = ty;
                vertexBufferU32[vertexOffset++] = fillColor;
                vertexBufferF32[vertexOffset++] = fillAlpha;
                vertexBufferF32[vertexOffset++] = srcX;
                vertexBufferF32[vertexOffset++] = srcY;
                vertexBufferF32[vertexOffset++] = srcScaleX;
                vertexBufferF32[vertexOffset++] = srcScaleY;
                vertexBufferF32[vertexOffset++] = srcRotation;
                vertexBufferF32[vertexOffset++] = tx;
                vertexBufferF32[vertexOffset++] = tyh;
                vertexBufferU32[vertexOffset++] = fillColor;
                vertexBufferF32[vertexOffset++] = fillAlpha;
                vertexBufferF32[vertexOffset++] = srcX;
                vertexBufferF32[vertexOffset++] = srcY;
                vertexBufferF32[vertexOffset++] = srcScaleX;
                vertexBufferF32[vertexOffset++] = srcScaleY;
                vertexBufferF32[vertexOffset++] = srcRotation;
                vertexBufferF32[vertexOffset++] = txw;
                vertexBufferF32[vertexOffset++] = tyh;
                vertexBufferU32[vertexOffset++] = fillColor;
                vertexBufferF32[vertexOffset++] = fillAlpha;
                vertexBufferF32[vertexOffset++] = srcX;
                vertexBufferF32[vertexOffset++] = srcY;
                vertexBufferF32[vertexOffset++] = srcScaleX;
                vertexBufferF32[vertexOffset++] = srcScaleY;
                vertexBufferF32[vertexOffset++] = srcRotation;
                vertexBufferF32[vertexOffset++] = tx;
                vertexBufferF32[vertexOffset++] = ty;
                vertexBufferU32[vertexOffset++] = fillColor;
                vertexBufferF32[vertexOffset++] = fillAlpha;
                vertexBufferF32[vertexOffset++] = srcX;
                vertexBufferF32[vertexOffset++] = srcY;
                vertexBufferF32[vertexOffset++] = srcScaleX;
                vertexBufferF32[vertexOffset++] = srcScaleY;
                vertexBufferF32[vertexOffset++] = srcRotation;
                vertexBufferF32[vertexOffset++] = txw;
                vertexBufferF32[vertexOffset++] = tyh;
                vertexBufferU32[vertexOffset++] = fillColor;
                vertexBufferF32[vertexOffset++] = fillAlpha;
                vertexBufferF32[vertexOffset++] = srcX;
                vertexBufferF32[vertexOffset++] = srcY;
                vertexBufferF32[vertexOffset++] = srcScaleX;
                vertexBufferF32[vertexOffset++] = srcScaleY;
                vertexBufferF32[vertexOffset++] = srcRotation;
                vertexBufferF32[vertexOffset++] = txw;
                vertexBufferF32[vertexOffset++] = ty;
                vertexBufferU32[vertexOffset++] = fillColor;
                vertexBufferF32[vertexOffset++] = fillAlpha;
                vertexBufferF32[vertexOffset++] = srcX;
                vertexBufferF32[vertexOffset++] = srcY;
                vertexBufferF32[vertexOffset++] = srcScaleX;
                vertexBufferF32[vertexOffset++] = srcScaleY;
                vertexBufferF32[vertexOffset++] = srcRotation;
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

    shapeBatch.vertexCount = vertexCount;
    pathArray.length = 0;
};

module.exports = GraphicsWebGLRenderer;
