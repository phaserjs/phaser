var Class = require('../../../../utils/Class');
var CONST = require('./const');
var DataBuffer16 = require('../../utils/DataBuffer16');
var DataBuffer32 = require('../../utils/DataBuffer32');
var PHASER_CONST = require('../../../../const');
var ParticleShader = require('../../shaders/ParticleShader');
var TransformMatrix = require('../../../../gameobjects/components/TransformMatrix');

var ParticleRenderer = new Class({

    initialize:

    function ParticleRenderer (game, gl, manager)
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

        this.init(this.glContext);
    },

    init: function (gl)
    {
        var vertexDataBuffer = new DataBuffer32(CONST.VERTEX_SIZE * CONST.VERTEX_COUNT * CONST.MAX);
        var indexDataBuffer = new DataBuffer16(CONST.INDEX_SIZE * CONST.INDEX_COUNT * CONST.MAX);
        var shader = this.manager.resourceManager.createShader('ParticleShader', ParticleShader);
        var indexBufferObject = this.manager.resourceManager.createBuffer(gl.ELEMENT_ARRAY_BUFFER, indexDataBuffer.getByteCapacity(), gl.STATIC_DRAW);
        var vertexBufferObject = this.manager.resourceManager.createBuffer(gl.ARRAY_BUFFER, vertexDataBuffer.getByteCapacity(), gl.STREAM_DRAW);
        var viewMatrixLocation = shader.getUniformLocation('u_view_matrix');
        var indexBuffer = indexDataBuffer.uintView;
        var max = CONST.MAX * CONST.INDEX_COUNT;

        this.vertexDataBuffer = vertexDataBuffer;
        this.indexDataBuffer = indexDataBuffer;
        this.shader = shader;
        this.indexBufferObject = indexBufferObject;
        this.vertexBufferObject = vertexBufferObject;
        this.viewMatrixLocation = viewMatrixLocation;

        vertexBufferObject.addAttribute(shader.getAttribLocation('a_position'), 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 0);
        vertexBufferObject.addAttribute(shader.getAttribLocation('a_tex_coord'), 2, gl.FLOAT, false, CONST.VERTEX_SIZE, 8);
        vertexBufferObject.addAttribute(shader.getAttribLocation('a_color'), 4, gl.UNSIGNED_BYTE, true, CONST.VERTEX_SIZE, 16);

        // Populate the index buffer only once
        for (var indexA = 0, indexB = 0; indexA < max; indexA += CONST.INDEX_COUNT, indexB += CONST.VERTEX_COUNT)
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
        return this.isFull();
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

        this.indexBufferObject.bind();
        this.vertexBufferObject.bind();
    },

    flush: function (shader, renderTarget)
    {
        var gl = this.glContext;
        var vertexDataBuffer = this.vertexDataBuffer;

        if (this.elementCount === 0)
        {
            return;
        }
        
        if (renderTarget)
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, renderTarget);
        }

        this.bind(shader);
        this.vertexBufferObject.updateResource(vertexDataBuffer.getUsedBufferAsFloat(), 0);

        gl.drawElements(gl.TRIANGLES, this.elementCount, gl.UNSIGNED_SHORT, 0);

        this.elementCount = 0;
        vertexDataBuffer.clear();

        if (renderTarget)
        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }
    },

    resize: function (width, height, resolution, shader)
    {
        var activeShader = (shader !== undefined) ? shader : this.shader;
        var location = (activeShader === this.shader) ? this.viewMatrixLocation : activeShader.getUniformLocation('u_view_matrix');

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

    renderEmitter: function (emitter, camera)
    {
        var particles = emitter.alive;
        var length = particles.length;

        var data = this.vertexDataBuffer;
        var vbF32 = data.floatView;
        var vbU32 = data.uintView;
        var vtxOffset = 0;

        var cameraMatrix = camera.matrix.matrix;
        var cma = cameraMatrix[0];
        var cmb = cameraMatrix[1];
        var cmc = cameraMatrix[2];
        var cmd = cameraMatrix[3];
        var cme = cameraMatrix[4];
        var cmf = cameraMatrix[5];

        var elementCount = this.elementCount;

        var particleCount = 0;
        var batchCount = Math.ceil(length / CONST.MAX);

        var renderTarget = emitter.renderTarget;

        var tempMatrix = this.tempMatrix;
        var tempMatrixMatrix = tempMatrix.matrix;

        var particleOffset = 0;

        var cameraScrollX = camera.scrollX * emitter.scrollFactorX;
        var cameraScrollY = camera.scrollY * emitter.scrollFactorY;

        if (length === 0) return;

        this.manager.setRenderer(this, emitter.frame.source.glTexture, emitter.renderTarget);

        for (var batchIndex = 0; batchIndex < batchCount; ++batchIndex)
        {
            var batchSize = Math.min(length, CONST.MAX);

            for (var index = 0; index < batchSize; index++)
            {
                var particle = particles[particleOffset + index];

                var frame = particle.frame;
                var uvs = frame.uvs;

                var x = -(frame.halfWidth);
                var y = -(frame.halfHeight);

                var color = particle.color;

                var xw = x + frame.width;
                var yh = y + frame.height;
                
                tempMatrix.applyITRS(
                    particle.x - cameraScrollX,
                    particle.y - cameraScrollY,
                    particle.rotation,
                    particle.scaleX,
                    particle.scaleY
                );

                var sra = tempMatrixMatrix[0];
                var srb = tempMatrixMatrix[1];
                var src = tempMatrixMatrix[2];
                var srd = tempMatrixMatrix[3];
                var sre = tempMatrixMatrix[4];
                var srf = tempMatrixMatrix[5];

                var mva = sra * cma + srb * cmc;
                var mvb = sra * cmb + srb * cmd;
                var mvc = src * cma + srd * cmc;
                var mvd = src * cmb + srd * cmd;
                var mve = sre * cma + srf * cmc + cme;
                var mvf = sre * cmb + srf * cmd + cmf;

                var tx0 = x * mva + y * mvc + mve;
                var ty0 = x * mvb + y * mvd + mvf;
                var tx1 = x * mva + yh * mvc + mve;
                var ty1 = x * mvb + yh * mvd + mvf;
                var tx2 = xw * mva + yh * mvc + mve;
                var ty2 = xw * mvb + yh * mvd + mvf;
                var tx3 = xw * mva + y * mvc + mve;
                var ty3 = xw * mvb + y * mvd + mvf;

                vtxOffset = data.allocate(20);
                elementCount += 6;

                //  Top Left
                vbF32[vtxOffset++] = tx0;
                vbF32[vtxOffset++] = ty0;
                vbF32[vtxOffset++] = uvs.x0;
                vbF32[vtxOffset++] = uvs.y0;
                vbU32[vtxOffset++] = color;

                //  Bottom Left
                vbF32[vtxOffset++] = tx1;
                vbF32[vtxOffset++] = ty1;
                vbF32[vtxOffset++] = uvs.x1;
                vbF32[vtxOffset++] = uvs.y1;
                vbU32[vtxOffset++] = color;

                //  Bottom Right
                vbF32[vtxOffset++] = tx2;
                vbF32[vtxOffset++] = ty2;
                vbF32[vtxOffset++] = uvs.x2;
                vbF32[vtxOffset++] = uvs.y2;
                vbU32[vtxOffset++] = color;

                //  Top Right
                vbF32[vtxOffset++] = tx3;
                vbF32[vtxOffset++] = ty3;
                vbF32[vtxOffset++] = uvs.x3;
                vbF32[vtxOffset++] = uvs.y3;
                vbU32[vtxOffset++] = color;
            }

            particleOffset += batchSize;

            length -= batchSize;

            this.elementCount = elementCount;

            this.flush(undefined, renderTarget);

            elementCount = 0;
        }
    },

    destroy: function ()
    {
        this.manager.resourceManager.deleteShader(this.shader);
        this.manager.resourceManager.deleteBuffer(this.indexBufferObject);
        this.manager.resourceManager.deleteBuffer(this.vertexBufferObject);

        this.shader = null;
        this.indexBufferObject = null;
        this.vertexBufferObject = null;
    }

});

module.exports = ParticleRenderer;
