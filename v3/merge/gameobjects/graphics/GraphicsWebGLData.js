Phaser.Renderer.WebGL.GameObjects.GraphicsData = function (gl)
{
    this.gl = gl;

    this.color = [0, 0, 0];
    this.points = [];
    this.indices = [];
    this.buffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();
    this.mode = 1;
    this.alpha = 1;
    this.dirty = true;
};

Phaser.Renderer.WebGL.GameObjects.GraphicsData.prototype.constructor = Phaser.Renderer.WebGL.GameObjects.GraphicsData;

Phaser.Renderer.WebGL.GameObjects.GraphicsData.prototype = {

    reset: function ()
    {
        this.points = [];
        this.indices = [];
    },

    upload: function ()
    {
        var gl = this.gl;

        this.glPoints = new Float32Array(this.points);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.glPoints, gl.STATIC_DRAW);

        this.glIndicies = new Uint16Array(this.indices);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.glIndicies, gl.STATIC_DRAW);

        this.dirty = false;
    },

    destroy: function ()
    {
        this.gl = null;
        this.color = null;
        this.points = null;
        this.indices = null;
        this.buffer = null;
        this.indexBuffer = null;
    }

};
