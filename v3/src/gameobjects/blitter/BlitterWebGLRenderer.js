var BlitterWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    var worldAlpha = 1; //src.color.worldAlpha;
    var list = src.getRenderList();
    var blitterBatch = renderer.blitterBatch;
    var cameraMatrix = camera.matrix.matrix;
    var a = cameraMatrix[0];
    var b = cameraMatrix[1];
    var c = cameraMatrix[2];
    var d = cameraMatrix[3];
    var e = cameraMatrix[4];
    var f = cameraMatrix[5];
    var cameraScrollX = camera.scrollX;
    var cameraScrollY = camera.scrollY;
    //  Skip rendering?

    if (!src.visible || worldAlpha === 0 || list.length === 0)
    {
        return;
    }

    //  Render bobs

    for (var i = 0, l = list.length; i < l; i++)
    {
        var bob = list[i];
        var frame = bob.frame;
        var alpha = bob.alpha;
        var vertexDataBuffer = blitterBatch.vertexDataBuffer;
        var vertexBuffer = vertexDataBuffer.floatView;
        var vertexOffset = 0;
        var uvs = frame.uvs;
        var width = frame.width;
        var height = frame.height;
        var x = bob.x + frame.x - cameraScrollX;
        var y = bob.y + frame.y - cameraScrollY;
        var xw = x + width;
        var yh = y + height;
        var tx = x * a + y * c + e;
        var ty = x * b + y * d + f;
        var txw = xw * a + yh * c + e;
        var tyh = xw * b + yh * d + f;

        if (blitterBatch.elementCount >= blitterBatch.maxParticles)
        {
            blitterBatch.flush();
        }

        renderer.setBatch(blitterBatch, frame.texture.source[frame.sourceIndex].glTexture);
        vertexOffset = vertexDataBuffer.allocate(20);
        blitterBatch.elementCount += 6;
        x += frame.x;
        y += frame.y;

        vertexBuffer[vertexOffset++] = tx;
        vertexBuffer[vertexOffset++] = ty;
        vertexBuffer[vertexOffset++] = uvs.x0;
        vertexBuffer[vertexOffset++] = uvs.y0;
        vertexBuffer[vertexOffset++] = alpha;
        vertexBuffer[vertexOffset++] = tx;
        vertexBuffer[vertexOffset++] = tyh;
        vertexBuffer[vertexOffset++] = uvs.x1;
        vertexBuffer[vertexOffset++] = uvs.y1;
        vertexBuffer[vertexOffset++] = alpha;
        vertexBuffer[vertexOffset++] = txw;
        vertexBuffer[vertexOffset++] = tyh;
        vertexBuffer[vertexOffset++] = uvs.x2;
        vertexBuffer[vertexOffset++] = uvs.y2;
        vertexBuffer[vertexOffset++] = alpha;
        vertexBuffer[vertexOffset++] = txw;
        vertexBuffer[vertexOffset++] = ty;
        vertexBuffer[vertexOffset++] = uvs.x3;
        vertexBuffer[vertexOffset++] = uvs.y3;
        vertexBuffer[vertexOffset++] = alpha;
    }
};

module.exports = BlitterWebGLRenderer;
