/**
* @author       Richard Davey <rich@photonstorm.com>
* @author       Mat Groves (@Doormat23)
* @author       Rovanion Luckey
* @copyright    2016 Photon Storm Ltd, Richard Davey
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Rope is a Sprite that has a repeating texture.
* 
* The texture will automatically wrap on the edges as it moves.
* 
* Please note that Ropes cannot have an input handler.
*
* @class Phaser.Rope
* @constructor
* @extends PIXI.DisplayObjectContainer
* @extends Phaser.Component.Core
* @extends Phaser.Component.Angle
* @extends Phaser.Component.Animation
* @extends Phaser.Component.AutoCull
* @extends Phaser.Component.Bounds
* @extends Phaser.Component.BringToTop
* @extends Phaser.Component.Crop
* @extends Phaser.Component.Delta
* @extends Phaser.Component.Destroy
* @extends Phaser.Component.FixedToCamera
* @extends Phaser.Component.InWorld
* @extends Phaser.Component.LifeSpan
* @extends Phaser.Component.LoadTexture
* @extends Phaser.Component.Overlap
* @extends Phaser.Component.PhysicsBody
* @extends Phaser.Component.Reset
* @extends Phaser.Component.ScaleMinMax
* @extends Phaser.Component.Smoothed
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in world space) to position the Rope at.
* @param {number} y - The y coordinate (in world space) to position the Rope at.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Rope during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Rope is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
* @param {Array} points - An array of {Phaser.Point}.
*/
Phaser.Rope = function (game, x, y, key, frame, points) {

    this.points = [];
    this.points = points;
    this._hasUpdateAnimation = false;
    this._updateAnimationCallback = null;
    x = x || 0;
    y = y || 0;
    key = key || null;
    frame = frame || null;

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.ROPE;

    this.points = points;

    PIXI.DisplayObjectContainer.call(this);

    this.texture = Phaser.Cache.DEFAULT;

    // set up the main bits..
    this.uvs = new Float32Array([0, 1,
                                      1, 1,
                                      1, 0,
                                      0, 1]);

    this.vertices = new Float32Array([0, 0,
                                            100, 0,
                                            100, 100,
                                            0, 100]);

    this.colors = new Float32Array([1, 1, 1, 1]);

    this.indices = new Uint16Array([0, 1, 2, 3]);

    if (points)
    {
        this.vertices = new Float32Array(points.length * 4);
        this.uvs = new Float32Array(points.length * 4);
        this.colors = new Float32Array(points.length * 2);
        this.indices = new Uint16Array(points.length * 2);
    }

    /**
     * Whether the strip is dirty or not
     *
     * @property dirty
     * @type Boolean
     */
    this.dirty = true;

    /**
     * Triangles in canvas mode are automatically antialiased, use this value to force triangles to overlap a bit with each other.
     *
     * @property canvasPadding
     * @type Number
     */
    this.canvasPadding = 0;

    this.drawMode = Phaser.Rope.TRIANGLE_STRIP;

    Phaser.Component.Core.init.call(this, game, x, y, key, frame);

    this.refresh();

};

Phaser.Rope.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
Phaser.Rope.prototype.constructor = Phaser.Rope;

Phaser.Component.Core.install.call(Phaser.Rope.prototype, [
    'Angle',
    'Animation',
    'AutoCull',
    'Bounds',
    'BringToTop',
    'Crop',
    'Delta',
    'Destroy',
    'FixedToCamera',
    'InWorld',
    'LifeSpan',
    'LoadTexture',
    'Overlap',
    'PhysicsBody',
    'Reset',
    'ScaleMinMax',
    'Smoothed'
]);

Phaser.Rope.prototype.preUpdatePhysics = Phaser.Component.PhysicsBody.preUpdate;
Phaser.Rope.prototype.preUpdateLifeSpan = Phaser.Component.LifeSpan.preUpdate;
Phaser.Rope.prototype.preUpdateInWorld = Phaser.Component.InWorld.preUpdate;
Phaser.Rope.prototype.preUpdateCore = Phaser.Component.Core.preUpdate;

Phaser.Rope.TRIANGLE_STRIP = 0;
Phaser.Rope.TRIANGLES = 1;

/**
* Automatically called by World.preUpdate.
*
* @method Phaser.Rope#preUpdate
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype.preUpdate = function () {

    if (!this.preUpdatePhysics() || !this.preUpdateLifeSpan() || !this.preUpdateInWorld())
    {
        return false;
    }

    return this.preUpdateCore();

};

/**
* Override and use this function in your own custom objects to handle any update requirements you may have.
*
* @method Phaser.Rope#update
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype.update = function() {

    if (this._hasUpdateAnimation)
    {
        this.updateAnimation.call(this);
    }

};

/**
* Resets the Rope. This places the Rope at the given x/y world coordinates and then
* sets alive, exists, visible and renderable all to true. Also resets the outOfBounds state.
* If the Rope has a physics body that too is reset.
*
* @method Phaser.Rope#reset
* @memberof Phaser.Rope
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @return {Phaser.Rope} This instance.
*/
Phaser.Rope.prototype.reset = function (x, y) {

    Phaser.Component.Reset.prototype.reset.call(this, x, y);

    return this;

};

/*
* Refreshes the rope texture and UV coordinates.
*
* @method Phaser.Rope#refresh
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype.refresh = function () {

    var points = this.points;

    if (points.length < 1)
    {
        return;
    }

    var uvs = this.uvs;

    var indices = this.indices;
    var colors = this.colors;

    this.count -= 0.2;

    uvs[0] = 0;
    uvs[1] = 0;
    uvs[2] = 0;
    uvs[3] = 1;

    colors[0] = 1;
    colors[1] = 1;

    indices[0] = 0;
    indices[1] = 1;

    var total = points.length;
    var index;
    var amount;

    for (var i = 1; i < total; i++)
    {
        index = i * 4;

        // time to do some smart drawing!
        amount = i / (total - 1);

        if (i % 2)
        {
            uvs[index] = amount;
            uvs[index + 1] = 0;

            uvs[index + 2] = amount;
            uvs[index + 3] = 1;
        }
        else
        {
            uvs[index] = amount;
            uvs[index + 1] = 0;

            uvs[index + 2] = amount;
            uvs[index + 3] = 1;
        }

        index = i * 2;
        colors[index] = 1;
        colors[index + 1] = 1;

        index = i * 2;
        indices[index] = index;
        indices[index + 1] = index + 1;
    }

};

/*
* Updates the Ropes transform ready for rendering.
*
* @method Phaser.Rope#updateTransform
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype.updateTransform = function () {

    var points = this.points;

    if (points.length < 1)
    {
        return;
    }

    var lastPoint = points[0];
    var nextPoint;
    var perp = { x:0, y:0 };

    this.count -= 0.2;

    var vertices = this.vertices;
    var total = points.length;
    var point;
    var index;
    var ratio;
    var perpLength;
    var num;

    for (var i = 0; i < total; i++)
    {
        point = points[i];
        index = i * 4;

        if(i < points.length - 1)
        {
            nextPoint = points[i + 1];
        }
        else
        {
            nextPoint = point;
        }

        perp.y = -(nextPoint.x - lastPoint.x);
        perp.x = nextPoint.y - lastPoint.y;

        ratio = (1 - (i / (total - 1))) * 10;

        if (ratio > 1)
        {
            ratio = 1;
        }

        perpLength = Math.sqrt((perp.x * perp.x) + (perp.y * perp.y));
        num = this.texture.height / 2;
        perp.x /= perpLength;
        perp.y /= perpLength;

        perp.x *= num;
        perp.y *= num;

        vertices[index] = point.x + perp.x;
        vertices[index + 1] = point.y + perp.y;
        vertices[index + 2] = point.x - perp.x;
        vertices[index + 3] = point.y - perp.y;

        lastPoint = point;
    }

    PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);

};

/*
* Sets the Texture this Rope uses for rendering.
*
* @method Phaser.Rope#setTexture
* @memberof Phaser.Rope
* @param {Texture} texture - The texture that will be used.
*/
Phaser.Rope.prototype.setTexture = function (texture) {

    this.texture = texture;

};

/*
* Renders the Rope to WebGL.
*
* @private
* @method Phaser.Rope#_renderWebGL
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype._renderWebGL = function (renderSession) {

    if (!this.visible || this.alpha <= 0)
    {
        return;
    }

    renderSession.spriteBatch.stop();

    if (!this._vertexBuffer)
    {
        this._initWebGL(renderSession);
    }

    renderSession.shaderManager.setShader(renderSession.shaderManager.stripShader);

    this._renderStrip(renderSession);

    renderSession.spriteBatch.start();

};

/*
* Builds the Strip.
*
* @private
* @method Phaser.Rope#_initWebGL
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype._initWebGL = function (renderSession) {

    // build the strip!
    var gl = renderSession.gl;

    this._vertexBuffer = gl.createBuffer();
    this._indexBuffer = gl.createBuffer();
    this._uvBuffer = gl.createBuffer();
    this._colorBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

};

/*
* Renders the Strip to WebGL.
*
* @private
* @method Phaser.Rope#_renderStrip
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype._renderStrip = function (renderSession) {

    var gl = renderSession.gl;
    var projection = renderSession.projection;
    var offset = renderSession.offset;
    var shader = renderSession.shaderManager.stripShader;

    var drawMode = (this.drawMode === Phaser.Rope.TRIANGLE_STRIP) ? gl.TRIANGLE_STRIP : gl.TRIANGLES;

    renderSession.blendModeManager.setBlendMode(this.blendMode);

    // set uniforms
    gl.uniformMatrix3fv(shader.translationMatrix, false, this.worldTransform.toArray(true));
    gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
    gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);
    gl.uniform1f(shader.alpha, this.worldAlpha);

    if (!this.dirty)
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

        // update the uvs
        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);

        // check if a texture is dirty..
        if (this.texture.baseTexture._dirty[gl.id])
        {
            renderSession.renderer.updateTexture(this.texture.baseTexture);
        }
        else
        {
            // bind the current texture
            gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id]);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    }
    else
    {
        this.dirty = false;

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

        // update the uvs
        gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

        gl.activeTexture(gl.TEXTURE0);

        // check if a texture is dirty..
        if (this.texture.baseTexture._dirty[gl.id])
        {
            renderSession.renderer.updateTexture(this.texture.baseTexture);
        }
        else
        {
            gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id]);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
    }

    gl.drawElements(drawMode, this.indices.length, gl.UNSIGNED_SHORT, 0);

};

/*
* Renders the Strip to Canvas.
*
* @private
* @method Phaser.Rope#_renderCanvas
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype._renderCanvas = function (renderSession) {

    var context = renderSession.context;

    var transform = this.worldTransform;

    var tx = (transform.tx * renderSession.resolution) + renderSession.shakeX;
    var ty = (transform.ty * renderSession.resolution) + renderSession.shakeY;

    if (renderSession.roundPixels)
    {
        context.setTransform(transform.a, transform.b, transform.c, transform.d, tx | 0, ty | 0);
    }
    else
    {
        context.setTransform(transform.a, transform.b, transform.c, transform.d, tx, ty);
    }

    if (this.drawMode === Phaser.Rope.TRIANGLE_STRIP)
    {
        this._renderCanvasTriangleStrip(context);
    }
    else
    {
        this._renderCanvasTriangles(context);
    }

};

/*
* Renders a Triangle Strip to Canvas.
*
* @private
* @method Phaser.Rope#_renderCanvasTriangleStrip
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype._renderCanvasTriangleStrip = function (context) {

    // draw triangles!!
    var vertices = this.vertices;
    var uvs = this.uvs;

    var length = vertices.length / 2;

    this.count++;

    for (var i = 0; i < length - 2; i++)
    {
        var index = i * 2;
        this._renderCanvasDrawTriangle(context, vertices, uvs, index, (index + 2), (index + 4));
    }

};

/*
* Renders a Triangle to Canvas.
*
* @private
* @method Phaser.Rope#_renderCanvasTriangles
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype._renderCanvasTriangles = function (context) {

    var vertices = this.vertices;
    var uvs = this.uvs;
    var indices = this.indices;

    var length = indices.length;

    this.count++;

    for (var i = 0; i < length; i += 3)
    {
        var index0 = indices[i] * 2;
        var index1 = indices[i + 1] * 2;
        var index2 = indices[i + 2] * 2;

        this._renderCanvasDrawTriangle(context, vertices, uvs, index0, index1, index2);
    }

};

/*
* Renders a Triangle to Canvas.
*
* @private
* @method Phaser.Rope#_renderCanvasDrawTriangle
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype._renderCanvasDrawTriangle = function (context, vertices, uvs, index0, index1, index2) {

    var textureSource = this.texture.baseTexture.source;
    var textureWidth = this.texture.width;
    var textureHeight = this.texture.height;

    var x0 = vertices[index0];
    var x1 = vertices[index1];
    var x2 = vertices[index2];
    var y0 = vertices[index0 + 1];
    var y1 = vertices[index1 + 1];
    var y2 = vertices[index2 + 1];

    var u0 = uvs[index0] * textureWidth;
    var u1 = uvs[index1] * textureWidth;
    var u2 = uvs[index2] * textureWidth;
    var v0 = uvs[index0 + 1] * textureHeight;
    var v1 = uvs[index1 + 1] * textureHeight;
    var v2 = uvs[index2 + 1] * textureHeight;

    if (this.canvasPadding > 0)
    {
        var paddingX = this.canvasPadding / this.worldTransform.a;
        var paddingY = this.canvasPadding / this.worldTransform.d;
        var centerX = (x0 + x1 + x2) / 3;
        var centerY = (y0 + y1 + y2) / 3;

        var normX = x0 - centerX;
        var normY = y0 - centerY;

        var dist = Math.sqrt((normX * normX) + (normY * normY));
        x0 = centerX + (normX / dist) * (dist + paddingX);
        y0 = centerY + (normY / dist) * (dist + paddingY);

        normX = x1 - centerX;
        normY = y1 - centerY;

        dist = Math.sqrt((normX * normX) + (normY * normY));
        x1 = centerX + (normX / dist) * (dist + paddingX);
        y1 = centerY + (normY / dist) * (dist + paddingY);

        normX = x2 - centerX;
        normY = y2 - centerY;

        dist = Math.sqrt((normX * normX) + (normY * normY));
        x2 = centerX + (normX / dist) * (dist + paddingX);
        y2 = centerY + (normY / dist) * (dist + paddingY);
    }

    context.save();
    context.beginPath();

    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineTo(x2, y2);

    context.closePath();

    context.clip();

    // Compute matrix transform
    var delta =  (u0 * v1)      + (v0 * u2)      + (u1 * v2)      - (v1 * u2)      - (v0 * u1)      - (u0 * v2);
    var deltaA = (x0 * v1)      + (v0 * x2)      + (x1 * v2)      - (v1 * x2)      - (v0 * x1)      - (x0 * v2);
    var deltaB = (u0 * x1)      + (x0 * u2)      + (u1 * x2)      - (x1 * u2)      - (x0 * u1)      - (u0 * x2);
    var deltaC = (u0 * v1 * x2) + (v0 * x1 * u2) + (x0 * u1 * v2) - (x0 * v1 * u2) - (v0 * u1 * x2) - (u0 * x1 * v2);
    var deltaD = (y0 * v1)      + (v0 * y2)      + (y1 * v2)      - (v1 * y2)      - (v0 * y1)      - (y0 * v2);
    var deltaE = (u0 * y1)      + (y0 * u2)      + (u1 * y2)      - (y1 * u2)      - (y0 * u1)      - (u0 * y2);
    var deltaF = (u0 * v1 * y2) + (v0 * y1 * u2) + (y0 * u1 * v2) - (y0 * v1 * u2) - (v0 * u1 * y2) - (u0 * y1 * v2);

    context.transform(
        deltaA / delta,
        deltaD / delta,
        deltaB / delta,
        deltaE / delta,
        deltaC / delta,
        deltaF / delta);

    context.drawImage(textureSource, 0, 0);
    context.restore();

};

/*
* Renders a flat strip.
*
* @method Phaser.Rope#renderStripFlat
* @memberof Phaser.Rope
*/
Phaser.Rope.prototype.renderStripFlat = function (strip) {

    var context = this.context;
    var vertices = strip.vertices;

    var length = vertices.length / 2;

    this.count++;

    context.beginPath();

    for (var i = 1; i < length - 2; i++)
    {
        // draw some triangles!
        var index = i * 2;

        var x0 = vertices[index];
        var x1 = vertices[index + 2];
        var x2 = vertices[index + 4];
        var y0 = vertices[index + 1];
        var y1 = vertices[index + 3];
        var y2 = vertices[index + 5];

        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);
    }

    context.fillStyle = '#FF0000';
    context.fill();
    context.closePath();

};

/*
* Returns the bounds of the mesh as a rectangle. The bounds calculation takes the worldTransform into account.
*
* @method Phaser.Rope#getBounds
* @memberof Phaser.Rope
* @param {Matrix} matrix - The transformation matrix of the Sprite.
* @return {Rectangle} The framing rectangle.
*/
Phaser.Rope.prototype.getBounds = function (matrix) {

    var worldTransform = matrix || this.worldTransform;

    var a = worldTransform.a;
    var b = worldTransform.b;
    var c = worldTransform.c;
    var d = worldTransform.d;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

    var vertices = this.vertices;

    for (var i = 0; i < vertices.length; i += 2)
    {
        var rawX = vertices[i];
        var rawY = vertices[i + 1];
        var x = (a * rawX) + (c * rawY) + tx;
        var y = (d * rawY) + (b * rawX) + ty;

        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;

        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;
    }

    if (minX === -Infinity || maxY === Infinity)
    {
        return PIXI.EmptyRectangle;
    }

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    //  Store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    this._currentBounds = bounds;

    return bounds;

};

/**
* A Rope will call its updateAnimation function on each update loop if it has one.
*
* @name Phaser.Rope#updateAnimation
* @property {function} updateAnimation - Set to a function if you'd like the rope to animate during the update phase. Set to false or null to remove it.
*/
Object.defineProperty(Phaser.Rope.prototype, "updateAnimation", {

    get: function () {

        return this._updateAnimation;

    },

    set: function (value) {

        if (value && typeof value === 'function')
        {
            this._hasUpdateAnimation = true;
            this._updateAnimation = value;
        }
        else
        {
            this._hasUpdateAnimation = false;
            this._updateAnimation = null;
        }

    }

});

/**
* The segments that make up the rope body as an array of Phaser.Rectangles
*
* @name Phaser.Rope#segments
* @property {Phaser.Rectangles[]} updateAnimation - Returns an array of Phaser.Rectangles that represent the segments of the given rope
*/
Object.defineProperty(Phaser.Rope.prototype, "segments", {

    get: function () {

        var segments = [];
        var index, x1, y1, x2, y2, width, height, rect;

        for (var i = 0; i < this.points.length; i++)
        {
            index = i * 4;

            x1 = this.vertices[index] * this.scale.x;
            y1 = this.vertices[index + 1] * this.scale.y;
            x2 = this.vertices[index + 4] * this.scale.x;
            y2 = this.vertices[index + 3] * this.scale.y;

            width = Phaser.Math.difference(x1, x2);
            height = Phaser.Math.difference(y1, y2);

            x1 += this.world.x;
            y1 += this.world.y;
            rect = new Phaser.Rectangle(x1, y1, width, height);
            segments.push(rect);
        }

        return segments;
    }

});
