var BlitterWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    if (this.renderMask !== this.renderFlags)
    {
        return;
    }

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
    var renderTarget = src.renderTarget;

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
        var width = frame.width * (bob.flipX ? -1 : 1);
        var height = frame.height * (bob.flipY ? -1 : 1);
        var x = bob.x + frame.x - cameraScrollX + ((frame.width) * (bob.flipX ? 1 : 0.0));
        var y = bob.y + frame.y - cameraScrollY + ((frame.height) * (bob.flipY ? 1 : 0.0));
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

        renderer.setRenderer(blitterBatch, frame.texture.source[frame.sourceIndex].glTexture, camera, renderTarget);
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
