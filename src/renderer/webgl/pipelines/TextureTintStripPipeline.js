/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Felipe Alfonso <@bitnenfer>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');
var ModelViewProjection = require('./components/ModelViewProjection');
var ShaderSourceFS = require('../shaders/TextureTint-frag.js');
var ShaderSourceVS = require('../shaders/TextureTint-vert.js');
var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * TextureTintStripPipeline implements the rendering infrastructure
 * for displaying textured objects
 * The config properties are:
 * - game: Current game instance.
 * - renderer: Current WebGL renderer.
 * - vertShader: Source for vertex shader as a string.
 * - fragShader: Source for fragment shader as a string.
 * - vertexCapacity: The amount of vertices that shall be allocated
 * - vertexSize: The size of a single vertex in bytes.
 *
 * @class TextureTintStripPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.23.0
 *
 * @param {object} config - The configuration options for this Texture Tint Pipeline, as described above.
 */
var TextureTintStripPipeline = new Class({

    Extends: WebGLPipeline,

    Mixins: [
        ModelViewProjection
    ],

    initialize:

    function TextureTintStripPipeline (config)
    {
        var rendererConfig = config.renderer.config;

        //  Vertex Size = attribute size added together (2 + 2 + 1 + 4)

        WebGLPipeline.call(this, {
            game: config.game,
            renderer: config.renderer,
            gl: config.renderer.gl,
            topology: config.renderer.gl.TRIANGLE_STRIP,
            vertShader: GetFastValue(config, 'vertShader', ShaderSourceVS),
            fragShader: GetFastValue(config, 'fragShader', ShaderSourceFS),
            vertexCapacity: GetFastValue(config, 'vertexCapacity', 6 * rendererConfig.batchSize),
            vertexSize: GetFastValue(config, 'vertexSize', Float32Array.BYTES_PER_ELEMENT * 5 + Uint8Array.BYTES_PER_ELEMENT * 4),
            attributes: [
                {
                    name: 'inPosition',
                    size: 2,
                    type: config.renderer.gl.FLOAT,
                    normalized: false,
                    offset: 0
                },
                {
                    name: 'inTexCoord',
                    size: 2,
                    type: config.renderer.gl.FLOAT,
                    normalized: false,
                    offset: Float32Array.BYTES_PER_ELEMENT * 2
                },
                {
                    name: 'inTintEffect',
                    size: 1,
                    type: config.renderer.gl.FLOAT,
                    normalized: false,
                    offset: Float32Array.BYTES_PER_ELEMENT * 4
                },
                {
                    name: 'inTint',
                    size: 4,
                    type: config.renderer.gl.UNSIGNED_BYTE,
                    normalized: true,
                    offset: Float32Array.BYTES_PER_ELEMENT * 5
                }
            ]
        });

        /**
         * Float32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.23.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        /**
         * Uint32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#vertexViewU32
         * @type {Uint32Array}
         * @since 3.23.0
         */
        this.vertexViewU32 = new Uint32Array(this.vertexData);

        /**
         * Size of the batch.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#maxQuads
         * @type {integer}
         * @since 3.23.0
         */
        this.maxQuads = rendererConfig.batchSize;

        /**
         * Collection of batch information
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#batches
         * @type {array}
         * @since 3.23.0
         */
        this.batches = [];

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#_tempMatrix1
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.23.0
         */
        this._tempMatrix1 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#_tempMatrix2
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.23.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#_tempMatrix3
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.23.0
         */
        this._tempMatrix3 = new TransformMatrix();

        this.mvpInit();
    },

    /**
     * Called every time the pipeline needs to be used.
     * It binds all necessary resources.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#onBind
     * @since 3.23.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    onBind: function ()
    {
        WebGLPipeline.prototype.onBind.call(this);

        this.mvpUpdate();

        return this;
    },

    /**
     * Resizes this pipeline and updates the projection.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#resize
     * @since 3.23.0
     *
     * @param {number} width - The new width.
     * @param {number} height - The new height.
     * @param {number} resolution - The resolution.
     *
     * @return {this} This WebGLPipeline instance.
     */
    resize: function (width, height, resolution)
    {
        WebGLPipeline.prototype.resize.call(this, width, height, resolution);

        this.projOrtho(0, this.width, this.height, 0, -1000.0, 1000.0);

        return this;
    },

    /**
     * Assigns a texture to the current batch. If a different texture is already set it creates a new batch object.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#setTexture2D
     * @since 3.23.0
     *
     * @param {WebGLTexture} [texture] - WebGLTexture that will be assigned to the current batch. If not given uses blankTexture.
     * @param {integer} [unit=0] - Texture unit to which the texture needs to be bound.
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline} This pipeline instance.
     */
    setTexture2D: function (texture, unit)
    {
        if (texture === undefined) { texture = this.renderer.blankTexture.glTexture; }
        if (unit === undefined) { unit = 0; }

        if (this.requireTextureBatch(texture, unit))
        {
            this.pushBatch(texture, unit);
        }

        return this;
    },

    /**
     * Checks if the current batch has the same texture and texture unit, or if we need to create a new batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#requireTextureBatch
     * @since 3.23.0
     *
     * @param {WebGLTexture} texture - WebGLTexture that will be assigned to the current batch. If not given uses blankTexture.
     * @param {integer} unit - Texture unit to which the texture needs to be bound.
     *
     * @return {boolean} `true` if the pipeline needs to create a new batch, otherwise `false`.
     */
    requireTextureBatch: function (texture, unit)
    {
        var batches = this.batches;
        var batchLength = batches.length;

        if (batchLength > 0)
        {
            //  If Texture Unit specified, we get the texture from the textures array, otherwise we use the texture property
            var currentTexture = (unit > 0) ? batches[batchLength - 1].textures[unit - 1] : batches[batchLength - 1].texture;

            return !(currentTexture === texture);
        }

        return true;
    },

    /**
     * Creates a new batch object and pushes it to a batch array.
     * The batch object contains information relevant to the current 
     * vertex batch like the offset in the vertex buffer, vertex count and 
     * the textures used by that batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#pushBatch
     * @since 3.23.0
     * 
     * @param {WebGLTexture} texture - Optional WebGLTexture that will be assigned to the created batch.
     * @param {integer} unit - Texture unit to which the texture needs to be bound.
     */
    pushBatch: function (texture, unit)
    {
        if (unit === 0)
        {
            this.batches.push({
                first: this.vertexCount,
                texture: texture,
                textures: []
            });
        }
        else
        {
            var textures = [];

            textures[unit - 1] = texture;

            this.batches.push({
                first: this.vertexCount,
                texture: null,
                textures: textures
            });
        }
    },

    /**
     * Uploads the vertex data and emits a draw call for the current batch of vertices.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.TextureTintStripPipeline#flush
     * @since 3.23.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    flush: function ()
    {
        if (this.flushLocked)
        {
            return this;
        }

        this.flushLocked = true;

        var gl = this.gl;
        var vertexCount = this.vertexCount;
        var topology = this.topology;
        var vertexSize = this.vertexSize;
        var renderer = this.renderer;

        var batches = this.batches;
        var batchCount = batches.length;
        var batchVertexCount = 0;
        var batch = null;
        var batchNext;
        var textureIndex;
        var nTexture;

        if (batchCount === 0 || vertexCount === 0)
        {
            this.flushLocked = false;

            return this;
        }

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));

        //  Process the TEXTURE BATCHES

        for (var index = 0; index < batchCount - 1; index++)
        {
            batch = batches[index];
            batchNext = batches[index + 1];

            //  Multi-texture check (for non-zero texture units)
            if (batch.textures.length > 0)
            {
                for (textureIndex = 0; textureIndex < batch.textures.length; ++textureIndex)
                {
                    nTexture = batch.textures[textureIndex];

                    if (nTexture)
                    {
                        renderer.setTexture2D(nTexture, 1 + textureIndex, false);
                    }
                }

                gl.activeTexture(gl.TEXTURE0);
            }

            batchVertexCount = batchNext.first - batch.first;

            //  Bail out if texture property is null (i.e. if a texture unit > 0)
            if (batch.texture === null || batchVertexCount <= 0)
            {
                continue;
            }

            renderer.setTexture2D(batch.texture, 0, false);

            gl.drawArrays(topology, batch.first, batchVertexCount);
        }

        // Left over data
        batch = batches[batchCount - 1];

        //  Multi-texture check (for non-zero texture units)

        if (batch.textures.length > 0)
        {
            for (textureIndex = 0; textureIndex < batch.textures.length; ++textureIndex)
            {
                nTexture = batch.textures[textureIndex];

                if (nTexture)
                {
                    renderer.setTexture2D(nTexture, 1 + textureIndex, false);
                }
            }

            gl.activeTexture(gl.TEXTURE0);
        }

        batchVertexCount = vertexCount - batch.first;

        if (batch.texture && batchVertexCount > 0)
        {
            renderer.setTexture2D(batch.texture, 0, false);

            gl.drawArrays(topology, batch.first, batchVertexCount);
        }

        this.vertexCount = 0;

        batches.length = 0;

        this.flushLocked = false;

        return this;
    }

});

module.exports = TextureTintStripPipeline;
