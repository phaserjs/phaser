PIXI.Tilemap = function(texture)
{
    PIXI.DisplayObjectContainer.call(this);

    /**
     * The texture of the Tilemap
     *
     * @property texture
     * @type Texture
     */
    this.texture = texture;

    /**
     * Whether the Tilemap is dirty or not
     *
     * @property dirty
     * @type Boolean
     */
    this.dirty = true;

    /**
     * The blend mode to be applied to the sprite. Set to PIXI.blendModes.NORMAL to remove any blend mode.
     *
     * @property blendMode
     * @type Number
     * @default PIXI.blendModes.NORMAL;
     */
    this.blendMode = PIXI.blendModes.NORMAL;

    this.uvs = new PIXI.Float32Array([0, 1,
                                      1, 1,
                                      1, 0,
                                      0, 1]);

    this.vertices = new PIXI.Float32Array([0, 0,
                                            100, 0,
                                            100, 100,
                                            0, 100]);

    this.colors = new PIXI.Float32Array([1, 1, 1, 1]);

    this.indices = new PIXI.Uint16Array([0, 1, 2, 0, 2, 3]);

};

// constructor
PIXI.Tilemap.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.Tilemap.prototype.constructor = PIXI.Tilemap;

PIXI.Tilemap.prototype.update = function() {};
PIXI.Tilemap.prototype.postUpdate = function() {};

PIXI.Tilemap.prototype._renderWebGL = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(!this.visible || this.alpha <= 0)return;

    renderSession.spriteBatch.stop();

    // init! init!
    if(!this._vertexBuffer)this._initWebGL(renderSession);

    renderSession.shaderManager.setShader(renderSession.shaderManager.tilemapShader);

    this._renderTilemap(renderSession);

    renderSession.spriteBatch.start();
};

PIXI.Tilemap.prototype._initWebGL = function(renderSession)
{
    var gl = renderSession.gl;

    this._vertexBuffer = gl.createBuffer();
    this._indexBuffer = gl.createBuffer();
    this._uvBuffer = gl.createBuffer();
    this._colorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,  this.uvs, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
};

PIXI.Tilemap.prototype._renderTilemap = function(renderSession)
{
    var gl = renderSession.gl;
    var projection = renderSession.projection,
        offset = renderSession.offset,
        shader = renderSession.shaderManager.tilemapShader;

    renderSession.blendModeManager.setBlendMode(this.blendMode);

    // gl.uniformMatrix3fv(shader.translationMatrix, false, this.worldTransform.toArray(true));
    gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
    gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);
    gl.uniform1f(shader.alpha, this.worldAlpha);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
    gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    // update the uvs
    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
    gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);

    // check if a texture is dirty..
    if(this.texture.baseTexture._dirty[gl.id])
    {
        renderSession.renderer.updateTexture(this.texture.baseTexture);
    }
    else
    {
        // bind the current texture
        gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id]);
    }

    // dont need to upload!
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

};
