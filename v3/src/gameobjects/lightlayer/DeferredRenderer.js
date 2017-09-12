var VertexBuffer = require('../../renderer/webgl/resources/VertexBuffer');
var GameObject = require('../GameObject');

var DeferredRenderer = function (renderer, lightLayer, interpolationPercentage, camera)
{
    var spriteList = lightLayer.sprites;
    var length = spriteList.length;
    var batch = renderer.spriteBatch;
    var gl = renderer.gl;

    if (GameObject.RENDER_MASK !== lightLayer.renderFlags || length === 0 || (lightLayer.cameraFilter > 0 && (lightLayer.cameraFilter & camera._id)))
    {
        return;
    }

    if (renderer.currentRenderer !== null)
    {
        renderer.currentRenderer.flush();
    }

    batch.bind(lightLayer.gBufferShaderPass);
    batch.indexBufferObject.bind();
    lightLayer.updateLights(renderer, camera, lightLayer.lightPassShader);

    gl.bindFramebuffer(gl.FRAMEBUFFER, lightLayer.gBufferFbo);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (var index = 0; index < length; ++index)
    {
        var spriteNormalPair = spriteList[index];
        var gameObject = spriteNormalPair.spriteRef;
        
        /* Inlined function of add sprite modified. */
        {
            var tempMatrix = batch.tempMatrix;
            var frame = gameObject.frame;
            var forceFlipY = (frame.texture.source[frame.sourceIndex].glTexture.isRenderTexture ? true : false);
            var flipX = gameObject.flipX;
            var flipY = gameObject.flipY ^ forceFlipY;
            var vertexDataBuffer = batch.vertexDataBuffer;
            var vertexBufferObjectF32 = vertexDataBuffer.floatView;
            var vertexBufferObjectU32 = vertexDataBuffer.uintView;
            var vertexOffset = 0;
            var uvs = frame.uvs;
            var width = frame.width * (flipX ? -1 : 1);
            var height = frame.height * (flipY ? -1 : 1);
            var translateX = gameObject.x - camera.scrollX * gameObject.scrollFactorX;
            var translateY = gameObject.y - camera.scrollY * gameObject.scrollFactorY;
            var scaleX = gameObject.scaleX;
            var scaleY = gameObject.scaleY;
            var rotation = -gameObject.rotation;
            var tempMatrixMatrix = tempMatrix.matrix;
            var x = -gameObject.displayOriginX + frame.x + ((frame.width) * (flipX ? 1 : 0.0));
            var y = -gameObject.displayOriginY + frame.y + ((frame.height) * (flipY ? 1 : 0.0));
            var xw = x + width;
            var yh = y + height;
            var cameraMatrix = camera.matrix.matrix;
            var mva, mvb, mvc, mvd, mve, mvf, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3;
            var sra, srb, src, srd, sre, srf, cma, cmb, cmc, cmd, cme, cmf;
            var alphaTL = gameObject._alphaTL;
            var alphaTR = gameObject._alphaTR;
            var alphaBL = gameObject._alphaBL;
            var alphaBR = gameObject._alphaBR;
            var tintTL = gameObject._tintTL;
            var tintTR = gameObject._tintTR;
            var tintBL = gameObject._tintBL;
            var tintBR = gameObject._tintBR;

            tempMatrix.applyITRS(translateX, translateY, rotation, scaleX, scaleY);

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
            
            tx0 = x * mva + y * mvc + mve;
            ty0 = x * mvb + y * mvd + mvf;
            tx1 = x * mva + yh * mvc + mve;
            ty1 = x * mvb + yh * mvd + mvf;
            tx2 = xw * mva + yh * mvc + mve;
            ty2 = xw * mvb + yh * mvd + mvf;
            tx3 = xw * mva + y * mvc + mve;
            ty3 = xw * mvb + y * mvd + mvf;

    
            if (renderer.currentTexture[0] !== frame.texture.source[frame.sourceIndex].glTexture ||
                renderer.currentTexture[1] !== spriteNormalPair.normalTextureRef.source[spriteNormalPair.spriteRef.frame.sourceIndex].glTexture ||
                batch.shouldFlush())
            {
                batch.flush(lightLayer.gBufferShaderPass, lightLayer.renderTarget);
                renderer.setTexture(frame.texture.source[frame.sourceIndex].glTexture, 0);
                renderer.setTexture(spriteNormalPair.normalTextureRef.source[spriteNormalPair.spriteRef.frame.sourceIndex].glTexture, 1);
            }

            batch.drawIndexed = true;
            batch.drawingMesh = false;
            vertexOffset = vertexDataBuffer.allocate(24);
            batch.elementCount += 6;
            
            //  Top Left
            vertexBufferObjectF32[vertexOffset++] = tx0;
            vertexBufferObjectF32[vertexOffset++] = ty0;
            vertexBufferObjectF32[vertexOffset++] = uvs.x0;
            vertexBufferObjectF32[vertexOffset++] = uvs.y0;
            vertexBufferObjectU32[vertexOffset++] = tintTL;
            vertexBufferObjectF32[vertexOffset++] = alphaTL;

            //  Bottom Left
            vertexBufferObjectF32[vertexOffset++] = tx1;
            vertexBufferObjectF32[vertexOffset++] = ty1;
            vertexBufferObjectF32[vertexOffset++] = uvs.x1;
            vertexBufferObjectF32[vertexOffset++] = uvs.y1;
            vertexBufferObjectU32[vertexOffset++] = tintBL;
            vertexBufferObjectF32[vertexOffset++] = alphaBL;

            //  Bottom Right
            vertexBufferObjectF32[vertexOffset++] = tx2;
            vertexBufferObjectF32[vertexOffset++] = ty2;
            vertexBufferObjectF32[vertexOffset++] = uvs.x2;
            vertexBufferObjectF32[vertexOffset++] = uvs.y2;
            vertexBufferObjectU32[vertexOffset++] = tintBR;
            vertexBufferObjectF32[vertexOffset++] = alphaBR;

            //  Top Right
            vertexBufferObjectF32[vertexOffset++] = tx3;
            vertexBufferObjectF32[vertexOffset++] = ty3;
            vertexBufferObjectF32[vertexOffset++] = uvs.x3;
            vertexBufferObjectF32[vertexOffset++] = uvs.y3;
            vertexBufferObjectU32[vertexOffset++] = tintTR;
            vertexBufferObjectF32[vertexOffset++] = alphaTR;
        }
    }

    batch.flush(lightLayer.gBufferShaderPass, lightLayer.renderTarget);
    renderer.setTexture({texture: lightLayer.gBufferColorTex}, 0);
    renderer.setTexture({texture: lightLayer.gBufferNormalTex}, 1);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    lightLayer.lightPassShader.bind();
    gl.bindBuffer(gl.ARRAY_BUFFER, lightLayer.lightPassVBO);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, Float32Array.BYTES_PER_ELEMENT, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    VertexBuffer.SetDirty();
    batch.bind();
};

module.exports = DeferredRenderer;
