
var ImageWebGLRenderer = function (renderer, src, interpolationPercentage)
{
    var frame = src.frame;
    // var alpha = src.color.worldAlpha * 255 << 24;

    var alpha = 16777216;

    //  Skip rendering?

    // if (src.skipRender || !src.visible || alpha === 0 || !frame.cutWidth || !frame.cutHeight)
    // {
    //     return;
    // }

    // var verts = src.transform.getVertexData(interpolationPercentage, renderer);
    // var index = src.frame.source.glTextureIndex;
    // var tint = src.color._glTint;
    // var bg = src.color._glBg;
    // renderer.batch.add(frame.source, src.blendMode, verts, frame.uvs, index, alpha, tint, bg);

    // Not inlined
    //renderer.setBlendMode(src.color._blendMode);
    //renderer.spriteBatch.add(
    //    src.frame,
    //    src.anchorX, src.anchorY,
    //    transform.worldMatrix.matrix,
    //    src.color._glTint
    //);

    /*******************/

    // Inline spriteBatch.add gives a huge boost
    var transform = src.transform;
    var spriteBatch = renderer.spriteBatch;
    var anchorX = src.anchorX;
    var anchorY = src.anchorY;
    var matrix = transform.worldMatrix;
    var vertexColor = src.color._glTint;

    //renderer.setBlendMode(src.color._blendMode);
    renderer.setBatch(spriteBatch, frame.texture.source[frame.sourceIndex].glTexture);
    // The user must check if the buffers are full before flushing
    // this is to give freedom of when should the renderer flush. var vertexDataBuffer = this.vertexDataBuffer;
    var vertexDataBuffer = spriteBatch.vertexDataBuffer;
    var vertexBufferF32 = vertexDataBuffer.floatView;
    var vertexBufferU32 = vertexDataBuffer.uintView;
    var vertexOffset = vertexDataBuffer.allocate(44);
    var uvs = frame.uvs;
    var width = frame.width;
    var height = frame.height;
    var x = width * -anchorX + frame.x;
    var y = height * -anchorY + frame.y;
    var a = matrix[0];
    var b = matrix[1];
    var c = matrix[2];
    var d = matrix[3];
    var tx = matrix[4];
    var ty = matrix[5];
    var xw = x + width;
    var yh = y + height;
    
    vertexBufferF32[vertexOffset++] = x;
    vertexBufferF32[vertexOffset++] = y;
    vertexBufferF32[vertexOffset++] = uvs.x0;
    vertexBufferF32[vertexOffset++] = uvs.y0;
    vertexBufferF32[vertexOffset++] = a;
    vertexBufferF32[vertexOffset++] = b;
    vertexBufferF32[vertexOffset++] = c;
    vertexBufferF32[vertexOffset++] = d;
    vertexBufferF32[vertexOffset++] = tx;
    vertexBufferF32[vertexOffset++] = ty;
    vertexBufferU32[vertexOffset++] = vertexColor.topLeft;
    vertexBufferF32[vertexOffset++] = x;
    vertexBufferF32[vertexOffset++] = yh;
    vertexBufferF32[vertexOffset++] = uvs.x1;
    vertexBufferF32[vertexOffset++] = uvs.y1;
    vertexBufferF32[vertexOffset++] = a;
    vertexBufferF32[vertexOffset++] = b;
    vertexBufferF32[vertexOffset++] = c;
    vertexBufferF32[vertexOffset++] = d;
    vertexBufferF32[vertexOffset++] = tx;
    vertexBufferF32[vertexOffset++] = ty;
    vertexBufferU32[vertexOffset++] = vertexColor.bottomLeft;
    vertexBufferF32[vertexOffset++] = xw;
    vertexBufferF32[vertexOffset++] = yh;
    vertexBufferF32[vertexOffset++] = uvs.x2;
    vertexBufferF32[vertexOffset++] = uvs.y2;
    vertexBufferF32[vertexOffset++] = a;
    vertexBufferF32[vertexOffset++] = b;
    vertexBufferF32[vertexOffset++] = c;
    vertexBufferF32[vertexOffset++] = d;
    vertexBufferF32[vertexOffset++] = tx;
    vertexBufferF32[vertexOffset++] = ty;
    vertexBufferU32[vertexOffset++] = vertexColor.bottomRight;
    vertexBufferF32[vertexOffset++] = xw;
    vertexBufferF32[vertexOffset++] = y;
    vertexBufferF32[vertexOffset++] = uvs.x3;
    vertexBufferF32[vertexOffset++] = uvs.y3;
    vertexBufferF32[vertexOffset++] = a;
    vertexBufferF32[vertexOffset++] = b;
    vertexBufferF32[vertexOffset++] = c;
    vertexBufferF32[vertexOffset++] = d;
    vertexBufferF32[vertexOffset++] = tx;
    vertexBufferF32[vertexOffset++] = ty;
    vertexBufferU32[vertexOffset++] = vertexColor.topRight;
    spriteBatch.elementCount += 6;
};

module.exports = ImageWebGLRenderer;
