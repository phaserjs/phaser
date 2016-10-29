/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
*
*
* @class Phaser.Renderer.WebGL.Batch.Base
* @constructor
* @param {Phaser.Renderer.WebGL} renderer - The WebGL Renderer.
*/
Phaser.Renderer.WebGL.Batch.Base = function (manager, batchSize, vertSize)
{
    this.batchManager = manager;

    this.renderer = manager.renderer;

    this.gl = null;

    //  Total number of objects we'll batch before flushing and rendering
    //  Integer
    this.maxBatchSize = batchSize;

    //  Integer
    this.halfBatchSize = Math.floor(this.maxBatchSize / 2);

    //  Integer
    this.vertSize = vertSize;

    //  * 4 because there are 4 verts per batch entry (each corner of the quad)
    var numVerts = this.vertSize * this.maxBatchSize * 4;

    //  ArrayBuffer
    //  This data is what changes every frame, populated by the game objects
    //  passed in. There are often views into it (position, color, etc)
    this.vertices = new ArrayBuffer(numVerts);

    //  Number of total quads allowed in the batch * 6
    //  6 because there are 2 triangles per quad, and each triangle has 3 indices
    //  This Typed Array is set in the build method of the extended class, and then
    //  doesn't change again (it's populated just once)
    this.indices = new Uint16Array(this.maxBatchSize * 6);

    //  Integer
    this.currentBatchSize = 0;

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

Phaser.Renderer.WebGL.Batch.Base.prototype.constructor = Phaser.Renderer.WebGL.Batch.Base;

Phaser.Renderer.WebGL.Batch.Base.prototype = {

    start: function ()
    {
        this._i = 0;
        // this.dirty = true;
        this.currentBatchSize = 0;

        this.init();
    },

    stop: function ()
    {
        if (this.currentBatchSize > 0)
        {
            this.flush();
        }

        // this.dirty = true;
    },

    /*
    flush: function ()
    {
        if (currentSize > 0)
        {
            gl.drawElements(gl.TRIANGLES, currentSize * 6, gl.UNSIGNED_SHORT, start * 6 * 2);
            this.renderer.drawCount++;
        }

        //  Reset the batch
        this.currentBatchSize = 0;
        this._i = 0;
    },
    */

    setCurrentTexture: function (source)
    {
        var gl = this.gl;

        if (this.currentBatchSize > 0)
        {
            this.flush();
        }

        gl.activeTexture(gl.TEXTURE0 + source.glTextureIndex);

        gl.bindTexture(gl.TEXTURE_2D, source.glTexture);

        this.renderer.textureArray[source.glTextureIndex] = source;
    }

};
