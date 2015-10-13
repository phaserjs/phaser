/**
 * @author Mat Groves http://matgroves.com/
 */

/**
 * A tiling sprite is a fast way of rendering a tiling image
 *
 * @class TilingSprite
 * @extends Sprite
 * @constructor
 * @param texture {Texture} the texture of the tiling sprite
 * @param width {Number}  the width of the tiling sprite
 * @param height {Number} the height of the tiling sprite
 */
PIXI.TilingSprite = function(texture, width, height)
{
    PIXI.Sprite.call(this, texture);

    /**
     * The width of the tiling sprite
     *
     * @property width
     * @type Number
     */
    this._width = width || 128;

    /**
     * The height of the tiling sprite
     *
     * @property height
     * @type Number
     */
    this._height = height || 128;

    /**
     * The scaling of the image that is being tiled
     *
     * @property tileScale
     * @type Point
     */
    this.tileScale = new PIXI.Point(1, 1);

    /**
     * A point that represents the scale of the texture object
     *
     * @property tileScaleOffset
     * @type Point
     */
    this.tileScaleOffset = new PIXI.Point(1, 1);
    
    /**
     * The offset position of the image that is being tiled
     *
     * @property tilePosition
     * @type Point
     */
    this.tilePosition = new PIXI.Point();

    /**
     * Whether this sprite is renderable or not
     *
     * @property renderable
     * @type Boolean
     * @default true
     */
    this.renderable = true;

    /**
     * The tint applied to the sprite. This is a hex value
     *
     * @property tint
     * @type Number
     * @default 0xFFFFFF
     */
    this.tint = 0xFFFFFF;

    /**
     * If enabled a green rectangle will be drawn behind the generated tiling texture, allowing you to visually
     * debug the texture being used.
     *
     * @property textureDebug
     * @type Boolean
     */
    this.textureDebug = false;
    
    /**
     * The blend mode to be applied to the sprite
     *
     * @property blendMode
     * @type Number
     * @default PIXI.blendModes.NORMAL;
     */
    this.blendMode = PIXI.blendModes.NORMAL;

    /**
     * The CanvasBuffer object that the tiled texture is drawn to.
     *
     * @property canvasBuffer
     * @type PIXI.CanvasBuffer
     */
    this.canvasBuffer = null;

    /**
     * An internal Texture object that holds the tiling texture that was generated from TilingSprite.texture.
     *
     * @property tilingTexture
     * @type PIXI.Texture
     */
    this.tilingTexture = null;

    /**
     * The Context fill pattern that is used to draw the TilingSprite in Canvas mode only (will be null in WebGL).
     *
     * @property tilePattern
     * @type PIXI.Texture
     */
    this.tilePattern = null;

    /**
     * If true the TilingSprite will run generateTexture on its **next** render pass.
     * This is set by the likes of Phaser.LoadTexture.setFrame.
     *
     * @property refreshTexture
     * @type Boolean
     * @default true
     */
    this.refreshTexture = true;

    this.frameWidth = 0;
    this.frameHeight = 0;

};

PIXI.TilingSprite.prototype = Object.create(PIXI.Sprite.prototype);
PIXI.TilingSprite.prototype.constructor = PIXI.TilingSprite;

PIXI.TilingSprite.prototype.setTexture = function(texture)
{
    if (this.texture !== texture)
    {
        this.texture = texture;
        this.refreshTexture = true;
        this.cachedTint = 0xFFFFFF;
    }

};

/**
* Renders the object using the WebGL renderer
*
* @method _renderWebGL
* @param renderSession {RenderSession} 
* @private
*/
PIXI.TilingSprite.prototype._renderWebGL = function(renderSession)
{
    if (this.visible === false || this.alpha === 0)
    {
        return;
    }

    if (this._mask)
    {
        renderSession.spriteBatch.stop();
        renderSession.maskManager.pushMask(this.mask, renderSession);
        renderSession.spriteBatch.start();
    }

    if (this._filters)
    {
        renderSession.spriteBatch.flush();
        renderSession.filterManager.pushFilter(this._filterBlock);
    }

    if (this.refreshTexture)
    {
        this.generateTilingTexture(true, renderSession);

        if (this.tilingTexture)
        {
            if (this.tilingTexture.needsUpdate)
            {
                renderSession.renderer.updateTexture(this.tilingTexture.baseTexture);
                this.tilingTexture.needsUpdate = false;
            }
        }
        else
        {
            return;
        }
    }
    
    renderSession.spriteBatch.renderTilingSprite(this);

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i]._renderWebGL(renderSession);
    }

    renderSession.spriteBatch.stop();

    if (this._filters)
    {
        renderSession.filterManager.popFilter();
    }

    if (this._mask)
    {
        renderSession.maskManager.popMask(this._mask, renderSession);
    }
    
    renderSession.spriteBatch.start();

};

/**
* Renders the object using the Canvas renderer
*
* @method _renderCanvas
* @param renderSession {RenderSession} 
* @private
*/
PIXI.TilingSprite.prototype._renderCanvas = function(renderSession)
{
    if (this.visible === false || this.alpha === 0)
    {
        return;
    }
    
    var context = renderSession.context;

    if (this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession);
    }

    context.globalAlpha = this.worldAlpha;
    
    var wt = this.worldTransform;
    var resolution = renderSession.resolution;

    context.setTransform(wt.a * resolution, wt.b * resolution, wt.c * resolution, wt.d * resolution, wt.tx * resolution, wt.ty * resolution);

    if (this.refreshTexture)
    {
        this.generateTilingTexture(false, renderSession);
    
        if (this.tilingTexture)
        {
            this.tilePattern = context.createPattern(this.tilingTexture.baseTexture.source, 'repeat');
        }
        else
        {
            return;
        }
    }

    var sessionBlendMode = renderSession.currentBlendMode;

    //  Check blend mode
    if (this.blendMode !== renderSession.currentBlendMode)
    {
        renderSession.currentBlendMode = this.blendMode;
        context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];
    }

    var tilePosition = this.tilePosition;
    var tileScale = this.tileScale;

    tilePosition.x %= this.tilingTexture.baseTexture.width;
    tilePosition.y %= this.tilingTexture.baseTexture.height;

    //  Translate
    context.scale(tileScale.x, tileScale.y);
    context.translate(tilePosition.x + (this.anchor.x * -this._width), tilePosition.y + (this.anchor.y * -this._height));

    context.fillStyle = this.tilePattern;

    var tx = -tilePosition.x;
    var ty = -tilePosition.y;
    var tw = this._width / tileScale.x;
    var th = this._height / tileScale.y;

    //  Allow for pixel rounding
    if (renderSession.roundPixels)
    {
        tx |= 0;
        ty |= 0;
        tw |= 0;
        th |= 0;
    }

    context.fillRect(tx, ty, tw, th);

    //  Translate back again
    context.scale(1 / tileScale.x, 1 / tileScale.y);
    context.translate(-tilePosition.x + (this.anchor.x * this._width), -tilePosition.y + (this.anchor.y * this._height));

    if (this._mask)
    {
        renderSession.maskManager.popMask(renderSession);
    }

    for (var i = 0; i < this.children.length; i++)
    {
        this.children[i]._renderCanvas(renderSession);
    }

    //  Reset blend mode
    if (sessionBlendMode !== this.blendMode)
    {
        renderSession.currentBlendMode = sessionBlendMode;
        context.globalCompositeOperation = PIXI.blendModesCanvas[sessionBlendMode];
    }

};

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */
PIXI.TilingSprite.prototype.onTextureUpdate = function()
{
   // overriding the sprite version of this!
};

/**
* 
* @method generateTilingTexture
* 
* @param forcePowerOfTwo {Boolean} Whether we want to force the texture to be a power of two
* @param renderSession {RenderSession} 
*/
PIXI.TilingSprite.prototype.generateTilingTexture = function(forcePowerOfTwo, renderSession)
{
    if (!this.texture.baseTexture.hasLoaded)
    {
        return;
    }

    var texture = this.texture;
    var frame = texture.frame;

    var targetWidth = this._frame.sourceSizeW;
    var targetHeight = this._frame.sourceSizeH;

    var dx = 0;
    var dy = 0;

    if (this._frame.trimmed)
    {
        dx = this._frame.spriteSourceSizeX;
        dy = this._frame.spriteSourceSizeY;
    }

    if (forcePowerOfTwo)
    {
        targetWidth = PIXI.getNextPowerOfTwo(targetWidth);
        targetHeight = PIXI.getNextPowerOfTwo(targetHeight);
    }

    if (this.canvasBuffer)
    {
        this.canvasBuffer.resize(targetWidth, targetHeight);
        this.tilingTexture.baseTexture.width = targetWidth;
        this.tilingTexture.baseTexture.height = targetHeight;
        this.tilingTexture.needsUpdate = true;
    }
    else
    {
        this.canvasBuffer = new PIXI.CanvasBuffer(targetWidth, targetHeight);
        this.tilingTexture = PIXI.Texture.fromCanvas(this.canvasBuffer.canvas);
        this.tilingTexture.isTiling = true;
        this.tilingTexture.needsUpdate = true;
    }

    if (this.textureDebug)
    {
        this.canvasBuffer.context.strokeStyle = '#00ff00';
        this.canvasBuffer.context.strokeRect(0, 0, targetWidth, targetHeight);
    }

    //  If a sprite sheet we need this:
    var w = texture.crop.width;
    var h = texture.crop.height;

    if (w !== targetWidth || h !== targetHeight)
    {
        w = targetWidth;
        h = targetHeight;
    }

    this.canvasBuffer.context.drawImage(texture.baseTexture.source,
                           texture.crop.x,
                           texture.crop.y,
                           texture.crop.width,
                           texture.crop.height,
                           dx,
                           dy,
                           w,
                           h);

    this.tileScaleOffset.x = frame.width / targetWidth;
    this.tileScaleOffset.y = frame.height / targetHeight;

    this.refreshTexture = false;

    this.tilingTexture.baseTexture._powerOf2 = true;

};

/**
* Returns the framing rectangle of the sprite as a PIXI.Rectangle object
*
* @method getBounds
* @return {Rectangle} the framing rectangle
*/
PIXI.TilingSprite.prototype.getBounds = function()
{
    var width = this._width;
    var height = this._height;

    var w0 = width * (1-this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1-this.anchor.y);
    var h1 = height * -this.anchor.y;

    var worldTransform = this.worldTransform;

    var a = worldTransform.a;
    var b = worldTransform.b;
    var c = worldTransform.c;
    var d = worldTransform.d;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;
    
    var x1 = a * w1 + c * h1 + tx;
    var y1 = d * h1 + b * w1 + ty;

    var x2 = a * w0 + c * h1 + tx;
    var y2 = d * h1 + b * w0 + ty;

    var x3 = a * w0 + c * h0 + tx;
    var y3 = d * h0 + b * w0 + ty;

    var x4 =  a * w1 + c * h0 + tx;
    var y4 =  d * h0 + b * w1 + ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

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

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a reference so that if this function gets called again in the render cycle we do not have to recalculate
    this._currentBounds = bounds;

    return bounds;
};

PIXI.TilingSprite.prototype.destroy = function () {

    PIXI.Sprite.prototype.destroy.call(this);

    if (this.canvasBuffer)
    {
        this.canvasBuffer.destroy();
        this.canvasBuffer = null;
    }

    this.tileScale = null;
    this.tileScaleOffset = null;
    this.tilePosition = null;

    if (this.tilingTexture)
    {
        this.tilingTexture.destroy(true);
        this.tilingTexture = null;
    }

};

/**
 * The width of the sprite, setting this will actually modify the scale to achieve the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.TilingSprite.prototype, 'width', {

    get: function() {
        return this._width;
    },

    set: function(value) {
        this._width = value;
    }

});

/**
 * The height of the TilingSprite, setting this will actually modify the scale to achieve the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.TilingSprite.prototype, 'height', {

    get: function() {
        return  this._height;
    },

    set: function(value) {
        this._height = value;
    }

});
