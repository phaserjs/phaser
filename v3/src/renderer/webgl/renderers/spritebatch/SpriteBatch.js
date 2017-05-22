var DataBuffer32 = require('../../utils/DataBuffer32');
var DataBuffer16 = require('../../utils/DataBuffer16');
var TransformMatrix = require('../../../../components/TransformMatrix');
var TexturedAndNormalizedTintedShader = require('../../shaders/TexturedAndNormalizedTintedShader');

var PHASER_CONST = require('../../../../const');
var CONST = require('./const');

var SpriteBatch = function (game, gl, manager)
{
    this.game = game;
    this.type = PHASER_CONST.WEBGL;
    this.view = game.canvas;
    this.resolution = game.config.resolution;
    this.width = game.config.width * game.config.resolution;
    this.height = game.config.height * game.config.resolution;
    this.glContext = gl;
    this.maxSprites = null;
    this.shader = null;
    this.vertexBufferObject = null;
    this.indexBufferObject = null;
    this.indexBufferObjectForMesh = null;
    this.vertexDataBuffer = null;
    this.indexDataBuffer = null;
    this.elementCount = 0;
    this.currentTexture2D = null;
    this.viewMatrixLocation = null;
    this.tempMatrix = new TransformMatrix();
    //   All of these settings will be able to be controlled via the Game Config
    this.config = {
        clearBeforeRender: true,
        transparent: false,
        autoResize: false,
        preserveDrawingBuffer: false,

        WebGLContextOptions: {
            alpha: true,
            antialias: true,
            premultipliedAlpha: true,
            stencil: true,
            preserveDrawingBuffer: false
        }
    };

    this.manager = manager;
    this.dirty = false;
    this.drawIndexed = true;
    this.lastDrawIndexed = true;
    this.lastDrawingMesh = false;
    this.drawingMesh = false;
    this.vertexCount = 0;

    this.init(this.glContext);
};

SpriteBatch.prototype.constructor = SpriteBatch;

SpriteBatch.prototype = {

    init: function (gl)
    {

        var vertexDataBuffer = new DataBuffer32(CONST.VERTEX_SIZE * CONST.SPRITE_VERTEX_COUNT * CONST.MAX_SPRITES);
        var indexDataBuffer = new DataBuffer16(CONST.INDEX_SIZE * CONST.SPRITE_INDEX_COUNT * CONST.MAX_SPRITES);
        var shader = this.manager.resourceManager.createShader('TexturedAndNormalizedTintedShader', TexturedAndNormalizedTintedShader);
        var indexBufferObject = this.manager.resourceManager.createBuffer(gl.ELEMENT_ARRAY_BUFFER, indexDataBuffer.getByteCapacity(), gl.STATIC_DRAW);
        var indexBufferObjectForMesh = this.manager.resourceManager.createBuffer(gl.ELEMENT_ARRAY_BUFFER, indexDataBuffer.getByteCapacity(), gl.STREAM_DRAW);
        var vertexBufferObject = this.manager.resourceManager.createBuffer(gl.ARRAY_BUFFER, vertexDataBuffer.getByteCapacity(), gl.STREAM_DRAW);
        var viewMatrixLocation = shader.getUniformLocation('u_view_matrix');
        var indexBuffer = indexDataBuffer.uintView;
        var max = CONST.MAX_SPRITES * CONST.SPRITE_INDEX_COUNT;

        this.vertexDataBuffer = vertexDataBuffer;
        this.indexDataBuffer = indexDataBuffer;
        this.shader = shader;
        this.indexBufferObject = indexBufferObject;
        this.indexBufferObjectForMesh = indexBufferObjectForMesh;
        this.vertexBufferObject = vertexBufferObject;
        this.viewMatrixLocation = viewMatrixLocation;

        vertexBufferObject.addAttribute(shader.getAttribLocation('a_position'), 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 0);
        vertexBufferObject.addAttribute(shader.getAttribLocation('a_tex_coord'), 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 8);
        vertexBufferObject.addAttribute(shader.getAttribLocation('a_color'), 3, gl.UNSIGNED_BYTE, true, CONST.VERTEX_SIZE, 16);
        vertexBufferObject.addAttribute(shader.getAttribLocation('a_alpha'), 1, gl.FLOAT, false, CONST.VERTEX_SIZE, 20);

        // Populate the index buffer only once
        for (var indexA = 0, indexB = 0; indexA < max; indexA += CONST.SPRITE_INDEX_COUNT, indexB += CONST.SPRITE_VERTEX_COUNT)
        {
            indexBuffer[indexA + 0] = indexB + 0;
            indexBuffer[indexA + 1] = indexB + 1;
            indexBuffer[indexA + 2] = indexB + 2;
            indexBuffer[indexA + 3] = indexB + 0;
            indexBuffer[indexA + 4] = indexB + 2;
            indexBuffer[indexA + 5] = indexB + 3;
        }

        indexBufferObject.updateResource(indexBuffer, 0);

        this.resize(this.width, this.height, this.game.config.resolution);
    },

    shouldFlush: function ()
    {
        if (this.drawIndexed != this.lastDrawIndexed || this.lastDrawingMesh !== this.drawingMesh)
        {
            this.lastDrawIndexed = this.drawIndexed;
            this.lastDrawingMesh = this.drawingMesh;
            return true;
        }
        return false;
    },

    isFull: function ()
    {
        return (this.vertexDataBuffer.getByteLength() >= this.vertexDataBuffer.getByteCapacity());
    },

    bind: function (shader)
    {
        if (shader === undefined)
        {
            this.shader.bind();
        }
        else
        {
            shader.bind();
            this.resize(this.width, this.height, this.game.config.resolution, shader);
        }
        this.vertexBufferObject.bind();
    },

    flush: function (shader, renderTarget)
    {
        var gl = this.glContext;
        var vertexDataBuffer = this.vertexDataBuffer;

        if (this.elementCount === 0 && this.vertexCount === 0)
        {
            return;
        }
        
        if (renderTarget)
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget);
        }

        this.bind(shader);
        this.vertexBufferObject.updateResource(vertexDataBuffer.getUsedBufferAsFloat(), 0);
        if (this.drawIndexed)
        {
            if (this.drawingMesh)
            {
                this.indexBufferObjectForMesh.bind();
                this.indexBufferObjectForMesh.updateResource(this.indexDataBuffer.buffer, 0)
            }
            else
                this.indexBufferObject.bind();

            gl.drawElements(gl.TRIANGLES, this.elementCount, gl.UNSIGNED_SHORT, 0);
        }
        else
        {
            gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        }
        
        vertexDataBuffer.clear();
        this.elementCount = 0;
        this.vertexCount = 0;

        if (renderTarget)
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    },

    resize: function (width, height, resolution, shader)
    {
        var gl = this.glContext;
        var activeShader = shader !== undefined ? shader : this.shader;
        var location = activeShader == this.shader ? this.viewMatrixLocation : activeShader.getUniformLocation('u_view_matrix');
        this.width = width * resolution;
        this.height = height * resolution;
        this.setProjectionMatrix(activeShader, location);
    },

    setProjectionMatrix: function (shader, location)
    {
        shader.setConstantMatrix4x4(
            location,
            new Float32Array([
                2 / this.width, 0, 0, 0,
                0, -2 / this.height, 0, 0,
                0, 0, 1, 1,
                -1, 1, 0, 0
            ])
        );
    },

    destroy: function ()
    {
        this.manager.resourceManager.deleteShader(this.shader);
        this.manager.resourceManager.deleteBuffer(this.indexBufferObject);
        this.manager.resourceManager.deleteBuffer(this.vertexBufferObject);

        this.shader = null;
        this.indexBufferObject = null;
        this.vertexBufferObject = null;
    },

    addMeshIndexed: function (gameObject, camera)
    {
        var tempMatrix = this.tempMatrix;
        var frame = gameObject.frame;
        var vertexDataBuffer = this.vertexDataBuffer;
        var vertexBufferObjectF32 = vertexDataBuffer.floatView;
        var vertexBufferObjectU32 = vertexDataBuffer.uintView;
        var vertexOffset = 0;
        var translateX = gameObject.x - camera.scrollX;
        var translateY = gameObject.y - camera.scrollY;
        var scaleX = gameObject.scaleX;
        var scaleY = gameObject.scaleY;
        var rotation = -gameObject.rotation;
        var tempMatrixMatrix = tempMatrix.matrix;
        var cameraMatrix = camera.matrix.matrix;
        var mva, mvb, mvc, mvd, mve, mvf, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3;
        var sra, srb, src, srd, sre, srf, cma, cmb, cmc, cmd, cme, cmf;
        var alpha = gameObject.alpha;
        var vertices = gameObject.vertices;
        var uv = gameObject.uv;
        var length = vertices.length;
        var totalVertices = (length / 2)|0;
        var indexBuffer = this.indexDataBuffer.uintView;
        var indices = gameObject.indices;
        var colors = gameObject.colors;
        var alphas = gameObject.alphas;
        var indexLength = indices.length;
        var indexOffset = 0;

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
        
        this.manager.setRenderer(this, frame.texture.source[frame.sourceIndex].glTexture, gameObject.renderTarget);
        indexOffset = this.vertexCount;
        this.drawIndexed = true;
        this.drawingMesh = true;
        this.vertexCount += totalVertices;

        vertexOffset = vertexDataBuffer.allocate(totalVertices * 6);

        for (var index = 0, index0 = 0; index < length; index += 2)
        {
            var x = vertices[index + 0];
            var y = vertices[index + 1];
            var tx = x * mva + y * mvc + mve;
            var ty = x * mvb + y * mvd + mvf;
            vertexBufferObjectF32[vertexOffset++] = tx;
            vertexBufferObjectF32[vertexOffset++] = ty;
            vertexBufferObjectF32[vertexOffset++] = uv[index + 0];
            vertexBufferObjectF32[vertexOffset++] = uv[index + 1];
            vertexBufferObjectU32[vertexOffset++] = colors[index0];
            vertexBufferObjectF32[vertexOffset++] = alphas[index0];
            index0 += 1;
        }
        var elementCount = this.elementCount;
        for (var index = 0; index < indexLength; ++index)
        {
            indexBuffer[elementCount + index] = indexOffset + indices[index];
        }

        this.elementCount += indexLength;
    },

    addMesh: function (gameObject, camera)
    {
        var tempMatrix = this.tempMatrix;
        var frame = gameObject.frame;
        var vertexDataBuffer = this.vertexDataBuffer;
        var vertexBufferObjectF32 = vertexDataBuffer.floatView;
        var vertexBufferObjectU32 = vertexDataBuffer.uintView;
        var vertexOffset = 0;
        var translateX = gameObject.x - camera.scrollX;
        var translateY = gameObject.y - camera.scrollY;
        var scaleX = gameObject.scaleX;
        var scaleY = gameObject.scaleY;
        var rotation = -gameObject.rotation;
        var tempMatrixMatrix = tempMatrix.matrix;
        var cameraMatrix = camera.matrix.matrix;
        var mva, mvb, mvc, mvd, mve, mvf, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3;
        var sra, srb, src, srd, sre, srf, cma, cmb, cmc, cmd, cme, cmf;
        var alpha = gameObject.alpha;
        var vertices = gameObject.vertices;
        var uv = gameObject.uv;
        var colors = gameObject.colors;
        var alphas = gameObject.alphas;
        var length = vertices.length;
        var totalVertices = (length / 2)|0;

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
        
        this.manager.setRenderer(this, frame.texture.source[frame.sourceIndex].glTexture, gameObject.renderTarget);
        this.drawIndexed = false;
        this.drawingMesh = true;
        this.vertexCount += totalVertices;

        vertexOffset = vertexDataBuffer.allocate(totalVertices * 6);

        for (var index = 0, index0 = 0; index < length; index += 2)
        {
            var x = vertices[index + 0];
            var y = vertices[index + 1];
            var tx = x * mva + y * mvc + mve;
            var ty = x * mvb + y * mvd + mvf;
            vertexBufferObjectF32[vertexOffset++] = tx;
            vertexBufferObjectF32[vertexOffset++] = ty;
            vertexBufferObjectF32[vertexOffset++] = uv[index + 0];
            vertexBufferObjectF32[vertexOffset++] = uv[index + 1];
            vertexBufferObjectU32[vertexOffset++] = colors[index0];
            vertexBufferObjectF32[vertexOffset++] = alphas[index0];
            index0 += 1;
        }
    },

    addSpriteTexture: function (gameObject, camera, texture, textureWidth, textureHeight)
    {
        var tempMatrix = this.tempMatrix;
        var alpha = 16777216;
        var vertexDataBuffer = this.vertexDataBuffer;
        var vertexBufferObjectF32 = vertexDataBuffer.floatView;
        var vertexBufferObjectU32 = vertexDataBuffer.uintView;
        var vertexOffset = 0;
        var width = textureWidth * (gameObject.flipX ? -1 : 1);
        var height = textureHeight * (gameObject.flipY ? -1 : 1);
        var translateX = gameObject.x - camera.scrollX;
        var translateY = gameObject.y - camera.scrollY;
        var scaleX = gameObject.scaleX;
        var scaleY = gameObject.scaleY;
        var rotation = -gameObject.rotation;
        var tempMatrixMatrix = tempMatrix.matrix;
        var x = -gameObject.displayOriginX + ((textureWidth) * (gameObject.flipX ? 1 : 0.0));
        var y = -gameObject.displayOriginY + ((textureHeight) * (gameObject.flipY ? 1 : 0.0));
        var xw = x + width;
        var yh = y + height;
        var cameraMatrix = camera.matrix.matrix;
        var mva, mvb, mvc, mvd, mve, mvf, tx0, ty0, tx1, ty1, tx2, ty2, tx3, ty3;
        var sra, srb, src, srd, sre, srf, cma, cmb, cmc, cmd, cme, cmf;
        var alpha = gameObject.alpha;

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

        this.manager.setRenderer(this, texture, gameObject.renderTarget);
        this.drawIndexed = true;
        this.drawingMesh = false;
        vertexOffset = vertexDataBuffer.allocate(24);
        this.elementCount += 6;
        
        vertexBufferObjectF32[vertexOffset++] = tx0;
        vertexBufferObjectF32[vertexOffset++] = ty0;
        vertexBufferObjectF32[vertexOffset++] = 0;
        vertexBufferObjectF32[vertexOffset++] = 0;
        vertexBufferObjectU32[vertexOffset++] = 0xFFFFFF; //vertexColor.topLeft;
        vertexBufferObjectF32[vertexOffset++] = alpha;

        vertexBufferObjectF32[vertexOffset++] = tx1;
        vertexBufferObjectF32[vertexOffset++] = ty1;
        vertexBufferObjectF32[vertexOffset++] = 0;
        vertexBufferObjectF32[vertexOffset++] = 1;
        vertexBufferObjectU32[vertexOffset++] = 0xFFFFFF; //vertexColor.bottomLeft;
        vertexBufferObjectF32[vertexOffset++] = alpha;

        vertexBufferObjectF32[vertexOffset++] = tx2;
        vertexBufferObjectF32[vertexOffset++] = ty2;
        vertexBufferObjectF32[vertexOffset++] = 1;
        vertexBufferObjectF32[vertexOffset++] = 1;
        vertexBufferObjectU32[vertexOffset++] = 0xFFFFFF; //vertexColor.bottomRight;
        vertexBufferObjectF32[vertexOffset++] = alpha;

        vertexBufferObjectF32[vertexOffset++] = tx3;
        vertexBufferObjectF32[vertexOffset++] = ty3;
        vertexBufferObjectF32[vertexOffset++] = 1;
        vertexBufferObjectF32[vertexOffset++] = 0;
        vertexBufferObjectU32[vertexOffset++] = 0xFFFFFF; //vertexColor.topRight;
        vertexBufferObjectF32[vertexOffset++] = alpha;
    },

    addSprite: function (gameObject, camera)
    {
        var tempMatrix = this.tempMatrix;
        var frame = gameObject.frame;
        var alpha = 16777216;
        var forceFlipY = (frame.texture.source[frame.sourceIndex].glTexture.isRenderTexture ? true : false);
        var flipX = gameObject.flipX;
        var flipY = gameObject.flipY ^ forceFlipY;
        var vertexDataBuffer = this.vertexDataBuffer;
        var vertexBufferObjectF32 = vertexDataBuffer.floatView;
        var vertexBufferObjectU32 = vertexDataBuffer.uintView;
        var vertexOffset = 0;
        var uvs = frame.uvs;
        var width = frame.width * (flipX ? -1 : 1);
        var height = frame.height * (flipY ? -1 : 1);
        var translateX = gameObject.x - camera.scrollX;
        var translateY = gameObject.y - camera.scrollY;
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
        var alpha = gameObject.alpha;

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

        this.manager.setRenderer(this, frame.texture.source[frame.sourceIndex].glTexture, gameObject.renderTarget);
        this.drawIndexed = true;
        this.drawingMesh = false;
        vertexOffset = vertexDataBuffer.allocate(24);
        this.elementCount += 6;
        
        vertexBufferObjectF32[vertexOffset++] = tx0;
        vertexBufferObjectF32[vertexOffset++] = ty0;
        vertexBufferObjectF32[vertexOffset++] = uvs.x0;
        vertexBufferObjectF32[vertexOffset++] = uvs.y0;
        vertexBufferObjectU32[vertexOffset++] = 0xFFFFFF; //vertexColor.topLeft;
        vertexBufferObjectF32[vertexOffset++] = alpha;

        vertexBufferObjectF32[vertexOffset++] = tx1;
        vertexBufferObjectF32[vertexOffset++] = ty1;
        vertexBufferObjectF32[vertexOffset++] = uvs.x1;
        vertexBufferObjectF32[vertexOffset++] = uvs.y1;
        vertexBufferObjectU32[vertexOffset++] = 0xFFFFFF; //vertexColor.bottomLeft;
        vertexBufferObjectF32[vertexOffset++] = alpha;

        vertexBufferObjectF32[vertexOffset++] = tx2;
        vertexBufferObjectF32[vertexOffset++] = ty2;
        vertexBufferObjectF32[vertexOffset++] = uvs.x2;
        vertexBufferObjectF32[vertexOffset++] = uvs.y2;
        vertexBufferObjectU32[vertexOffset++] = 0xFFFFFF; //vertexColor.bottomRight;
        vertexBufferObjectF32[vertexOffset++] = alpha;

        vertexBufferObjectF32[vertexOffset++] = tx3;
        vertexBufferObjectF32[vertexOffset++] = ty3;
        vertexBufferObjectF32[vertexOffset++] = uvs.x3;
        vertexBufferObjectF32[vertexOffset++] = uvs.y3;
        vertexBufferObjectU32[vertexOffset++] = 0xFFFFFF; //vertexColor.topRight;
        vertexBufferObjectF32[vertexOffset++] = alpha;
    }

};

module.exports = SpriteBatch;
