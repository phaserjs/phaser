/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The Sprite object is the base for all textured objects that are rendered to the screen
 *
 * @class Sprite
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} The texture for this sprite
 *
 * A sprite can be created directly from an image like this :
 * var sprite = new PIXI.Sprite.fromImage('assets/image.png');
 * yourStage.addChild(sprite);
 * then obviously don't forget to add it to the stage you have already created
 */
PIXI.Sprite = function(texture)
{
    PIXI.DisplayObjectContainer.call(this);

    /**
     * The anchor sets the origin point of the texture.
     * The default is 0,0 this means the texture's origin is the top left
     * Setting than anchor to 0.5,0.5 means the textures origin is centered
     * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right corner
     *
     * @property anchor
     * @type Point
     */
    this.anchor = new PIXI.Point();

    /**
     * The texture that the sprite is using
     *
     * @property texture
     * @type Texture
     */
    this.texture = texture || PIXI.Texture.emptyTexture;

    /**
     * The width of the sprite (this is initially set by the texture)
     *
     * @property _width
     * @type Number
     * @private
     */
    this._width = 0;

    /**
     * The height of the sprite (this is initially set by the texture)
     *
     * @property _height
     * @type Number
     * @private
     */
    this._height = 0;

    /**
     * The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
     *
     * @property tint
     * @type Number
     * @default 0xFFFFFF
     */
    this.tint = 0xFFFFFF;

    /**
     * The tint applied to the sprite. This is a hex value. A value of 0xFFFFFF will remove any tint effect.
     *
     * @property cachedTint
     * @private
     * @type Number
     * @default -1
     */
    this.cachedTint = -1;

    /**
     * A canvas that contains the tinted version of the Sprite (in Canvas mode, WebGL doesn't populate this)
     *
     * @property tintedTexture
     * @type Canvas
     * @default null
     */
    this.tintedTexture = null;

    /**
     * The blend mode to be applied to the sprite. Set to PIXI.blendModes.NORMAL to remove any blend mode.
     *
     * Warning: You cannot have a blend mode and a filter active on the same Sprite. Doing so will render the sprite invisible.
     *
     * @property blendMode
     * @type Number
     * @default PIXI.blendModes.NORMAL;
     */
    this.blendMode = PIXI.blendModes.NORMAL;

    /**
     * The shader that will be used to render the texture to the stage. Set to null to remove a current shader.
     *
     * @property shader
     * @type AbstractFilter
     * @default null
     */
    this.shader = null;

    if (this.texture.baseTexture.hasLoaded)
    {
        this.onTextureUpdate();
    }

    this.renderable = true;

};

// constructor
PIXI.Sprite.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.Sprite.prototype.constructor = PIXI.Sprite;

/**
 * The width of the sprite, setting this will actually modify the scale to achieve the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.Sprite.prototype, 'width', {

    get: function() {
        return this.scale.x * this.texture.frame.width;
    },

    set: function(value) {
        this.scale.x = value / this.texture.frame.width;
        this._width = value;
    }

});

/**
 * The height of the sprite, setting this will actually modify the scale to achieve the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.Sprite.prototype, 'height', {

    get: function() {
        return  this.scale.y * this.texture.frame.height;
    },

    set: function(value) {
        this.scale.y = value / this.texture.frame.height;
        this._height = value;
    }

});

/**
 * Sets the texture of the sprite. Be warned that this doesn't remove or destroy the previous
 * texture this Sprite was using.
 *
 * @method setTexture
 * @param texture {Texture} The PIXI texture that is displayed by the sprite
 * @param [destroy=false] {boolean} Call Texture.destroy on the current texture before replacing it with the new one?
 */
PIXI.Sprite.prototype.setTexture = function(texture, destroyBase)
{
    if (destroyBase !== undefined)
    {
        this.texture.baseTexture.destroy();
    }

    //  Over-ridden by loadTexture as needed
    this.texture.baseTexture.skipRender = false;
    this.texture = texture;
    this.texture.valid = true;
};

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */
PIXI.Sprite.prototype.onTextureUpdate = function()
{
    // so if _width is 0 then width was not set..
    if (this._width) this.scale.x = this._width / this.texture.frame.width;
    if (this._height) this.scale.y = this._height / this.texture.frame.height;
};

/**
* Returns the bounds of the Sprite as a rectangle. The bounds calculation takes the worldTransform into account.
*
* @method getBounds
* @param matrix {Matrix} the transformation matrix of the sprite
* @return {Rectangle} the framing rectangle
*/
PIXI.Sprite.prototype.getBounds = function(matrix)
{
    var width = this.texture.frame.width;
    var height = this.texture.frame.height;

    var w0 = width * (1-this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1-this.anchor.y);
    var h1 = height * -this.anchor.y;

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

    if (b === 0 && c === 0)
    {
        // scale may be negative!
        if (a < 0)
        {
            a *= -1;
            var temp = w0;
            w0 = -w1;
            w1 = -temp; 
        }

        if (d < 0)
        {
            d *= -1;
            var temp = h0;
            h0 = -h1;
            h1 = -temp; 
        }

        // this means there is no rotation going on right? RIGHT?
        // if thats the case then we can avoid checking the bound values! yay         
        minX = a * w1 + tx;
        maxX = a * w0 + tx;
        minY = d * h1 + ty;
        maxY = d * h0 + ty;
    }
    else
    {
        var x1 = a * w1 + c * h1 + tx;
        var y1 = d * h1 + b * w1 + ty;

        var x2 = a * w0 + c * h1 + tx;
        var y2 = d * h1 + b * w0 + ty;

        var x3 = a * w0 + c * h0 + tx;
        var y3 = d * h0 + b * w0 + ty;

        var x4 =  a * w1 + c * h0 + tx;
        var y4 =  d * h0 + b * w1 + ty;

        minX = x1 < minX ? x1 : minX;
        minX = x2 < minX ? x2 : minX;
        minX = x3 < minX ? x3 : minX;
        minX = x4 < minX ? x4 : minX;

        minY = y1 < minY ? y1 : minY;
        minY = y2 < minY ? y2 : minY;
        minY = y3 < minY ? y3 : minY;
        minY = y4 < minY ? y4 : minY;

        maxX = x1 > maxX ? x1 : maxX;
        maxX = x2 > maxX ? x2 : maxX;
        maxX = x3 > maxX ? x3 : maxX;
        maxX = x4 > maxX ? x4 : maxX;

        maxY = y1 > maxY ? y1 : maxY;
        maxY = y2 > maxY ? y2 : maxY;
        maxY = y3 > maxY ? y3 : maxY;
        maxY = y4 > maxY ? y4 : maxY;
    }

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    this._currentBounds = bounds;

    return bounds;
};

/**
* Renders the object using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession}
* @param {Matrix} [matrix] - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
* @private
*/
PIXI.Sprite.prototype._renderWebGL = function(renderSession, matrix)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if (!this.visible || this.alpha <= 0 || !this.renderable) return;

    //  They provided an alternative rendering matrix, so use it
    var wt = this.worldTransform;

    if (matrix)
    {
        wt = matrix;
    }

    //  A quick check to see if this element has a mask or a filter.
    if (this._mask || this._filters)
    {
        var spriteBatch = renderSession.spriteBatch;

        // push filter first as we need to ensure the stencil buffer is correct for any masking
        if (this._filters)
        {
            spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }

        if (this._mask)
        {
            spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession);
            spriteBatch.start();
        }

        // add this sprite to the batch
        spriteBatch.render(this);

        // now loop through the children and make sure they get rendered
        for (var i = 0; i < this.children.length; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }

        // time to stop the sprite batch as either a mask element or a filter draw will happen next
        spriteBatch.stop();

        if (this._mask) renderSession.maskManager.popMask(this._mask, renderSession);
        if (this._filters) renderSession.filterManager.popFilter();

        spriteBatch.start();
    }
    else
    {
        renderSession.spriteBatch.render(this);

        //  Render children!
        for (var i = 0; i < this.children.length; i++)
        {
            this.children[i]._renderWebGL(renderSession, wt);
        }

    }
};

/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession}
* @param {Matrix} [matrix] - Optional matrix. If provided the Display Object will be rendered using this matrix, otherwise it will use its worldTransform.
* @private
*/
PIXI.Sprite.prototype._renderCanvas = function(renderSession, matrix)
{
    // If the sprite is not visible or the alpha is 0 then no need to render this element
    if (!this.visible || this.alpha === 0 || !this.renderable || this.texture.crop.width <= 0 || this.texture.crop.height <= 0)
    {
        return;
    }

    var wt = this.worldTransform;

    //  If they provided an alternative rendering matrix then use it
    if (matrix)
    {
        wt = matrix;
    }

    if (this.blendMode !== renderSession.currentBlendMode)
    {
        renderSession.currentBlendMode = this.blendMode;
        renderSession.context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];
    }

    if (this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession);
    }

    //  Ignore null sources
    if (this.texture.valid)
    {
        var resolution = this.texture.baseTexture.resolution / renderSession.resolution;

        renderSession.context.globalAlpha = this.worldAlpha;

         //  If smoothingEnabled is supported and we need to change the smoothing property for this texture
        if (renderSession.smoothProperty && renderSession.scaleMode !== this.texture.baseTexture.scaleMode)
        {
            renderSession.scaleMode = this.texture.baseTexture.scaleMode;
            renderSession.context[renderSession.smoothProperty] = (renderSession.scaleMode === PIXI.scaleModes.LINEAR);
        }

        //  If the texture is trimmed we offset by the trim x/y, otherwise we use the frame dimensions
        var dx = (this.texture.trim) ? this.texture.trim.x - this.anchor.x * this.texture.trim.width : this.anchor.x * -this.texture.frame.width;
        var dy = (this.texture.trim) ? this.texture.trim.y - this.anchor.y * this.texture.trim.height : this.anchor.y * -this.texture.frame.height;

        //  Allow for pixel rounding
        if (renderSession.roundPixels)
        {
            renderSession.context.setTransform(wt.a, wt.b, wt.c, wt.d, (wt.tx * renderSession.resolution) | 0, (wt.ty * renderSession.resolution) | 0);
            dx |= 0;
            dy |= 0;
        }
        else
        {
            renderSession.context.setTransform(wt.a, wt.b, wt.c, wt.d, wt.tx * renderSession.resolution, wt.ty * renderSession.resolution);
        }

        var cw = this.texture.crop.width;
        var ch = this.texture.crop.height;

        dx /= resolution;
        dy /= resolution;

        if (this.tint !== 0xFFFFFF)
        {
            if (this.texture.requiresReTint || this.cachedTint !== this.tint)
            {
                this.tintedTexture = PIXI.CanvasTinter.getTintedTexture(this, this.tint);

                this.cachedTint = this.tint;
            }

            renderSession.context.drawImage(this.tintedTexture, 0, 0, cw, ch, dx, dy, cw / resolution, ch / resolution);
        }
        else
        {
            var cx = this.texture.crop.x;
            var cy = this.texture.crop.y;
            renderSession.context.drawImage(this.texture.baseTexture.source, cx, cy, cw, ch, dx, dy, cw / resolution, ch / resolution);
        }
    }

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i]._renderCanvas(renderSession);
    }

    if (this._mask)
    {
        renderSession.maskManager.popMask(renderSession);
    }

};

// some helper functions..

/**
 *
 * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
 * The frame ids are created when a Texture packer file has been loaded
 *
 * @method fromFrame
 * @static
 * @param frameId {String} The frame Id of the texture in the cache
 * @return {Sprite} A new Sprite using a texture from the texture cache matching the frameId
 */
PIXI.Sprite.fromFrame = function(frameId)
{
    var texture = PIXI.TextureCache[frameId];

    if (!texture) throw new Error('The frameId "' + frameId + '" does not exist in the texture cache' + this);

    return new PIXI.Sprite(texture);
};

/**
 *
 * Helper function that creates a sprite that will contain a texture based on an image url
 * If the image is not in the texture cache it will be loaded
 *
 * @method fromImage
 * @static
 * @param imageId {String} The image url of the texture
 * @return {Sprite} A new Sprite using a texture from the texture cache matching the image id
 */
PIXI.Sprite.fromImage = function(imageId, crossorigin, scaleMode)
{
    var texture = PIXI.Texture.fromImage(imageId, crossorigin, scaleMode);

    return new PIXI.Sprite(texture);
};
