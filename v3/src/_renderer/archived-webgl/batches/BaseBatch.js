/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
*
*
* @class BaseBatch
* @constructor
* @param {Phaser.Renderer.WebGL} renderer - The WebGL Renderer.
*/
var BaseBatch = function (manager, batchSize, vertSize)
{
    this.batchManager = manager;

    this.renderer = manager.renderer;

    this.gl = null;

    this.type = 0;

    //  Total number of objects we'll batch before flushing and rendering
    //  Integer
    this.maxSize = batchSize;

    //  Integer
    this.halfSize = Math.floor(this.maxSize / 2);

    //  Integer
    this.vertSize = vertSize;

    //  * 4 because there are 4 verts per batch entry (each corner of the quad)
    var numVerts = this.vertSize * this.maxSize * 4;

    //  ArrayBuffer
    //  This data is what changes every frame, populated by the game objects
    //  passed in. There are often views into it (position, color, etc)
    this.vertices = new ArrayBuffer(numVerts);

    //  Number of total quads allowed in the batch * 6
    //  6 because there are 2 triangles per quad, and each triangle has 3 indices
    //  This Typed Array is set in the build method of the extended class, and then
    //  doesn't change again (it's populated just once)
    this.indices = new Uint16Array(this.maxSize * 6);

    //  Populated by the flush operation when the batch is < 50% of the max size
    this.view = null;

    //  Integer
    this.size = 0;

    //  Boolean
    this.dirty = true;

    /**
     * The WebGL program.
     * @property program
     * @type WebGLProgram
     */
    this.program = null;

    /**
    * The Default Vertex shader source.
    *
    * @property defaultVertexSrc
    * @type Array
    */
    this.vertexSrc = [];

    /**
     * The fragment shader.
     * @property fragmentSrc
     * @type Array
    */
    this.fragmentSrc = [];

    //   WebGLBuffer
    this.indexBuffer = null;

    //   WebGLBuffer
    this.vertexBuffer = null;

    //  Internal index count
    //  Integer
    this._i = 0;
};

BaseBatch.prototype.constructor = BaseBatch;

BaseBatch.prototype = {

    start: function ()
    {
        this._i = 0;

        this.size = 0;

        //  We only need to do this if this batch isn't the current one

        if (this.renderer.shaderManager.setShader(this.program))
        {
            this.bindShader();
        }

        // if (this.dirty || force)
        // {
            // this.bindShader();
            // this.dirty = false;
        // }
    },

    stop: function ()
    {
        this.flush();
    },

    //  Can be overridden by custom Batch processors
    flush: function ()
    {
        if (this.size === 0)
        {
            return;
        }

        var gl = this.gl;

        //  Upload the vertex data to the GPU - is this cheaper (overall) than creating a new TypedArray view?
        //  The tradeoff is sending 224KB of data to the GPU every frame, even if most of it is empty should the
        //  batch be only slightly populated, vs. the creation of a new TypedArray view and its corresponding gc every frame.

        if (this.size > this.halfSize)
        {
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        }
        else
        {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

            this.view = this.positions.subarray(0, this.size * this.vertSize);

            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.view);
        }

        gl.drawElements(gl.TRIANGLES, this.size * 6, gl.UNSIGNED_SHORT, 0);

        this.renderer.drawCount++;

        //  Reset the batch
        this.size = 0;

        this._i = 0;
    }

};

module.exports = BaseBatch;
