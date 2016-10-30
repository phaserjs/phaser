/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
*
*
* @class Phaser.Renderer.WebGL.Batch
* @constructor
* @param {Phaser.Renderer.WebGL} renderer - The WebGL Renderer.
*/
Phaser.Renderer.WebGL.Batch = function (manager, batchSize, vertSize)
{
    this.batchManager = manager;

    this.renderer = manager.renderer;

    this.gl = null;

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

Phaser.Renderer.WebGL.Batch.prototype.constructor = Phaser.Renderer.WebGL.Batch;

Phaser.Renderer.WebGL.Batch.prototype = {

    start: function ()
    {
        this._i = 0;

        this.size = 0;

        //  We only need to do this if this batch isn't the current one

        if (this.dirty)
        {
            this.bindShader();
            this.dirty = false;
        }
    },

    stop: function ()
    {
        this.flush();
    }

};
