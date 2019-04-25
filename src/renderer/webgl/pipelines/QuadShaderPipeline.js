/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var ModelViewProjection = require('./components/ModelViewProjection');
var ShaderSourceFS = require('../shaders/QuadShader-frag.js');
var ShaderSourceVS = require('../shaders/QuadShader-vert.js');
var TransformMatrix = require('../../../gameobjects/components/TransformMatrix');
var WebGLPipeline = require('../WebGLPipeline');

/**
 * @classdesc
 * 
 * A single quad with its own custom shader applied to it.
 * The quad can have a size, position, rotation and scale.
 * 
 * Once the quad is drawn the batch is flushed. There is no batching of these objects.
 *
 * @class QuadShaderPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines
 * @constructor
 * @since 3.17.0
 *
 * @param {object} config - The configuration options for this Pipeline, as described above.
 */
var QuadShaderPipeline = new Class({

    Extends: WebGLPipeline,

    Mixins: [
        ModelViewProjection
    ],

    initialize:

    function QuadShaderPipeline (config)
    {
        WebGLPipeline.call(this, {
            game: config.game,
            renderer: config.renderer,
            gl: config.renderer.gl,
            topology: config.renderer.gl.TRIANGLES,
            vertShader: ShaderSourceVS,
            fragShader: ShaderSourceFS,
            vertexCapacity: 6,
            vertexSize: Float32Array.BYTES_PER_ELEMENT * 2,
            attributes: [
                {
                    name: 'inPosition',
                    size: 2,
                    type: config.renderer.gl.FLOAT,
                    normalized: false,
                    offset: 0
                }
            ]
        });

        /**
         * Float32 view of the array buffer containing the pipeline's vertices.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#vertexViewF32
         * @type {Float32Array}
         * @since 3.17.0
         */
        this.vertexViewF32 = new Float32Array(this.vertexData);

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#_tempMatrix1
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix1 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#_tempMatrix2
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix2 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#_tempMatrix3
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix3 = new TransformMatrix();

        /**
         * A temporary Transform Matrix, re-used internally during batching.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#_tempMatrix4
         * @private
         * @type {Phaser.GameObjects.Components.TransformMatrix}
         * @since 3.17.0
         */
        this._tempMatrix4 = new TransformMatrix();

        this.defaultProgram = this.program;

        this.mvpInit();
    },

    /**
     * Called every time the pipeline needs to be used.
     * It binds all necessary resources.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#bind
     * @since 3.17.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    // bind: function ()
    // {
        // WebGLPipeline.prototype.bind.call(this);
    // },

    /**
     * Resizes this pipeline and updates the projection.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#resize
     * @since 3.17.0
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
     * Uploads the vertex data and emits a draw call for the current batch of vertices.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#flush
     * @since 3.17.0
     *
     * @return {this} This WebGLPipeline instance.
     */
    flush: function ()
    {
        if (this.flushLocked)
        {
            return this;
        }

        var gl = this.gl;
        var vertexCount = 6;
        var topology = this.topology;
        var vertexSize = this.vertexSize;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.bytes.subarray(0, vertexCount * vertexSize));

        //  0 = first batch index
        //  6 = batchVertexCount
        gl.drawArrays(topology, 0, vertexCount);

        return this;
    },

    /**
     * Renders a single quad using the current shader and then flushes the batch.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.QuadShaderPipeline#draw
     * @since 3.17.0
     *
     * @param {number} x - Horizontal top left coordinate of the rectangle.
     * @param {number} y - Vertical top left coordinate of the rectangle.
     * @param {number} width - Width of the rectangle.
     * @param {number} height - Height of the rectangle.
     * @param {Phaser.GameObjects.Components.TransformMatrix} currentMatrix - The current transform.
     * @param {Phaser.GameObjects.Components.TransformMatrix} parentMatrix - The parent transform.
     */
    draw: function (x, y, width, height, currentMatrix, parentMatrix)
    {
        var calcMatrix = this._tempMatrix3;

        //  Multiply and store result in calcMatrix, only if the parentMatrix is set, otherwise we'll use whatever values are already in the calcMatrix
        if (parentMatrix)
        {
            parentMatrix.multiply(currentMatrix, calcMatrix);
        }
        
        var xw = x + width;
        var yh = y + height;

        var x0 = calcMatrix.getX(x, y);
        var y0 = calcMatrix.getY(x, y);

        var x1 = calcMatrix.getX(x, yh);
        var y1 = calcMatrix.getY(x, yh);

        var x2 = calcMatrix.getX(xw, yh);
        var y2 = calcMatrix.getY(xw, yh);

        var x3 = calcMatrix.getX(xw, y);
        var y3 = calcMatrix.getY(xw, y);

        var vertexViewF32 = this.vertexViewF32;

        vertexViewF32[0] = x0;
        vertexViewF32[1] = y0;
        vertexViewF32[2] = x1;
        vertexViewF32[3] = y1;
        vertexViewF32[4] = x2;
        vertexViewF32[5] = y2;
        vertexViewF32[6] = x0;
        vertexViewF32[7] = y0;
        vertexViewF32[8] = x2;
        vertexViewF32[9] = y2;
        vertexViewF32[10] = x3;
        vertexViewF32[11] = y3;

        this.flush();
    }

});

module.exports = QuadShaderPipeline;
