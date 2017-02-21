
var ImageWebGLRenderer = function (renderer, src, interpolationPercentage, camera)
{
    //--------------------
    // Inlined quad push
    //--------------------

    var frame = src.frame;
    var alpha = 16777216;
    var transform2D = src.transform;
    var spriteBatch = renderer.spriteBatch;
    var anchorX = src.anchorX;
    var anchorY = src.anchorY;
    var vertexColor = src.color._glTint;
    var vertexDataBuffer = spriteBatch.vertexDataBuffer;
    var vertexBufferF32 = vertexDataBuffer.floatView;
    var vertexBufferU32 = vertexDataBuffer.uintView;
    var vertexOffset = 0;
    var uvs = frame.uvs;
    var width = frame.width;
    var height = frame.height;
    var translateX = transform2D.x - camera.scrollX;
    var translateY = transform2D.y - camera.scrollY;
    var scaleX = transform2D.scaleX;
    var scaleY = transform2D.scaleY;
    var rotation = transform2D.angle;
    var cameraMatrix = camera.matrix.matrix;
    var a = cameraMatrix[0];
    var b = cameraMatrix[1];
    var c = cameraMatrix[2];
    var d = cameraMatrix[3];
    var e = cameraMatrix[4];
    var f = cameraMatrix[5];
    var x = width * -anchorX + frame.x;
    var y = height * -anchorY + frame.y;
    var xw = x + width;
    var yh = y + height;
    var tx = x * a + y * c + e;
    var ty = x * b + y * d + f;
    var txw = xw * a + yh * c + e;
    var tyh = xw * b + yh * d + f;

    renderer.setBatch(spriteBatch, frame.texture.source[frame.sourceIndex].glTexture);
    vertexOffset = vertexDataBuffer.allocate(40);
    spriteBatch.elementCount += 6;
    
    vertexBufferF32[vertexOffset++] = tx;
    vertexBufferF32[vertexOffset++] = ty;
    vertexBufferF32[vertexOffset++] = uvs.x0;
    vertexBufferF32[vertexOffset++] = uvs.y0;
    vertexBufferF32[vertexOffset++] = translateX;
    vertexBufferF32[vertexOffset++] = translateY;
    vertexBufferF32[vertexOffset++] = scaleX;
    vertexBufferF32[vertexOffset++] = scaleY;
    vertexBufferF32[vertexOffset++] = rotation;
    vertexBufferU32[vertexOffset++] = vertexColor.topLeft;
    vertexBufferF32[vertexOffset++] = tx;
    vertexBufferF32[vertexOffset++] = tyh;
    vertexBufferF32[vertexOffset++] = uvs.x1;
    vertexBufferF32[vertexOffset++] = uvs.y1;
    vertexBufferF32[vertexOffset++] = translateX;
    vertexBufferF32[vertexOffset++] = translateY;
    vertexBufferF32[vertexOffset++] = scaleX;
    vertexBufferF32[vertexOffset++] = scaleY;
    vertexBufferF32[vertexOffset++] = rotation;
    vertexBufferU32[vertexOffset++] = vertexColor.bottomLeft;
    vertexBufferF32[vertexOffset++] = txw;
    vertexBufferF32[vertexOffset++] = tyh;
    vertexBufferF32[vertexOffset++] = uvs.x2;
    vertexBufferF32[vertexOffset++] = uvs.y2;
    vertexBufferF32[vertexOffset++] = translateX;
    vertexBufferF32[vertexOffset++] = translateY;
    vertexBufferF32[vertexOffset++] = scaleX;
    vertexBufferF32[vertexOffset++] = scaleY;
    vertexBufferF32[vertexOffset++] = rotation;
    vertexBufferU32[vertexOffset++] = vertexColor.bottomRight;
    vertexBufferF32[vertexOffset++] = txw;
    vertexBufferF32[vertexOffset++] = ty;
    vertexBufferF32[vertexOffset++] = uvs.x3;
    vertexBufferF32[vertexOffset++] = uvs.y3;
    vertexBufferF32[vertexOffset++] = translateX;
    vertexBufferF32[vertexOffset++] = translateY;
    vertexBufferF32[vertexOffset++] = scaleX;
    vertexBufferF32[vertexOffset++] = scaleY;
    vertexBufferF32[vertexOffset++] = rotation;
    vertexBufferU32[vertexOffset++] = vertexColor.topRight;
};

module.exports = ImageWebGLRenderer;
