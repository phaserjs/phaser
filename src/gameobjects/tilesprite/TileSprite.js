/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A TileSprite is a Sprite that has a repeating texture. The texture can be scrolled and scaled independently of the TileSprite itself.
* Textures will automatically wrap and are designed so that you can create game backdrops using seamless textures as a source.
* 
* TileSprites have no input handler or physics bodies by default, both need enabling in the same way as for normal Sprites.
*
* You shouldn't ever create a TileSprite any larger than your actual screen size. If you want to create a large repeating background
* that scrolls across the whole map of your game, then you create a TileSprite that fits the screen size and then use the `tilePosition`
* property to scroll the texture as the player moves. If you create a TileSprite that is thousands of pixels in size then it will 
* consume huge amounts of memory and cause performance issues. Remember: use `tilePosition` to scroll your texture and `tileScale` to
* adjust the scale of the texture - don't resize the sprite itself or make it larger than it needs.
*
* An important note about texture dimensions:
*
* When running under Canvas a TileSprite can use any texture size without issue. When running under WebGL the texture should ideally be
* a power of two in size (i.e. 4, 8, 16, 32, 64, 128, 256, 512, etc pixels width by height). If the texture isn't a power of two
* it will be rendered to a blank canvas that is the correct size, which means you may have 'blank' areas appearing to the right and
* bottom of your frame. To avoid this ensure your textures are perfect powers of two.
* 
* TileSprites support animations in the same way that Sprites do. You add and play animations using the AnimationManager. However
* if your game is running under WebGL please note that each frame of the animation must be a power of two in size, or it will receive
* additional padding to enforce it to be so.
*
* @class Phaser.GameObject.TileSprite
* @constructor
* @extends PIXI.Sprite
* @extends Phaser.Component.Core
* @extends Phaser.Component.Angle
* @extends Phaser.Component.Animation
* @extends Phaser.Component.AutoCull
* @extends Phaser.Component.Bounds
* @extends Phaser.Component.BringToTop
* @extends Phaser.Component.Destroy
* @extends Phaser.Component.FixedToCamera
* @extends Phaser.Component.Health
* @extends Phaser.Component.InCamera
* @extends Phaser.Component.InputEnabled
* @extends Phaser.Component.InWorld
* @extends Phaser.Component.LifeSpan
* @extends Phaser.Component.LoadTexture
* @extends Phaser.Component.Overlap
* @extends Phaser.Component.PhysicsBody
* @extends Phaser.Component.Reset
* @extends Phaser.Component.Smoothed
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} [x=0] - The x coordinate (in world space) to position the TileSprite at.
* @param {number} [y=0] - The y coordinate (in world space) to position the TileSprite at.
* @param {number} [width=256] - The width of the TileSprite.
* @param {number} [height=256] - The height of the TileSprite.
* @param {string|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the TileSprite during rendering. It can be a string which is a reference to the Phaser Image Cache entry, or an instance of a PIXI.Texture or BitmapData.
* @param {string|number} frame - If this TileSprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.GameObject.TileSprite = function (game, x, y, width, height, key, frame) {

    x = x || 0;
    y = y || 0;
    width = width || 256;
    height = height || 256;
    key = key || null;
    frame = frame || null;

    var def = game.cache.getImage('__default', true);

    PIXI.Sprite.call(this, new PIXI.Texture(def.base), width, height);

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.TILESPRITE;

    /**
    * @property {number} physicsType - The const physics body type of this object.
    * @readonly
    */
    this.physicsType = Phaser.SPRITE;

    /**
    * @property {Phaser.Point} _scroll - Internal cache var.
    * @private
    */
    this._scroll = new Phaser.Point();

    /**
    * @property {Phaser.Point} tileScale - The scale applied to the image being tiled.
    */
    this.tileScale = new Phaser.Point(1, 1);

    /**
    * @property {Phaser.Point} tileScaleOffset - The scale offset applied to the image being tiled.
    */
    this.tileScaleOffset = new Phaser.Point(1, 1);
    
    /**
    * @property {Phaser.Point} tilePosition - The offset position of the image being tiled.
    */
    this.tilePosition = new Phaser.Point();

    /**
    * If enabled a green rectangle will be drawn behind the generated tiling texture,
    * allowing you to visually debug the texture being used.
    *
    * @property {boolean} textureDebug
    */
    this.textureDebug = false;

    /**
    * The CanvasBuffer object that the tiled texture is drawn to.
    *
    * @property {PIXI.CanvasBuffer} canvasBuffer
    */
    this.canvasBuffer = null;

    /**
    * An internal Texture object that holds the tiling texture that was generated from TilingSprite.texture.
    *
    * @property {PIXI.Texture} tilingTexture
    */
    this.tilingTexture = null;

    /**
    * The Context fill pattern that is used to draw the TilingSprite in Canvas mode only (will be null in WebGL).
    *
    * @property {object} tilePattern
    */
    this.tilePattern = null;

    /**
    * If true the TileSprite will run `generateTexture` on its **next** render pass.
    * This is set by the likes of Phaser.LoadTexture.setFrame.
    *
    * @property {boolean} refreshTexture
    */
    this.refreshTexture = true;

    this.frameWidth = 0;
    this.frameHeight = 0;

    this._width = width;
    this._height = height;

    Phaser.Component.Core.init.call(this, game, x, y, key, frame);

};

Phaser.GameObject.TileSprite.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.GameObject.TileSprite.prototype.constructor = Phaser.GameObject.TileSprite;

Phaser.Component.Core.install.call(Phaser.GameObject.TileSprite.prototype, [
    'Angle',
    'Animation',
    'AutoCull',
    'Bounds',
    'BringToTop',
    'Destroy',
    'FixedToCamera',
    'Health',
    'InCamera',
    'InputEnabled',
    'InWorld',
    'LifeSpan',
    'LoadTexture',
    'Overlap',
    'PhysicsBody',
    'Reset',
    'Smoothed'
]);

Phaser.GameObject.TileSprite.prototype.preUpdatePhysics = Phaser.Component.PhysicsBody.preUpdate;
Phaser.GameObject.TileSprite.prototype.preUpdateLifeSpan = Phaser.Component.LifeSpan.preUpdate;
Phaser.GameObject.TileSprite.prototype.preUpdateInWorld = Phaser.Component.InWorld.preUpdate;
Phaser.GameObject.TileSprite.prototype.preUpdateCore = Phaser.Component.Core.preUpdate;

/**
* Automatically called by World.preUpdate.
*
* @method Phaser.GameObject.TileSprite#preUpdate
* @memberof Phaser.GameObject.TileSprite
* @return {boolean}
*/
Phaser.GameObject.TileSprite.prototype.preUpdate = function () {

    if (this._scroll.x !== 0)
    {
        this.tilePosition.x += this._scroll.x * this.game.time.physicsElapsed;
    }

    if (this._scroll.y !== 0)
    {
        this.tilePosition.y += this._scroll.y * this.game.time.physicsElapsed;
    }

    if (!this.preUpdatePhysics() || !this.preUpdateLifeSpan() || !this.preUpdateInWorld())
    {
        return false;
    }

    return this.preUpdateCore();

};

/**
* Sets this TileSprite to automatically scroll in the given direction until stopped via TileSprite.stopScroll().
* The scroll speed is specified in pixels per second.
* A negative x value will scroll to the left. A positive x value will scroll to the right.
* A negative y value will scroll up. A positive y value will scroll down.
*
* @method Phaser.GameObject.TileSprite#autoScroll
* @memberof Phaser.GameObject.TileSprite
* @param {number} x - Horizontal scroll speed in pixels per second.
* @param {number} y - Vertical scroll speed in pixels per second.
* @return {Phaser.GameObject.TileSprite} This instance.
*/
Phaser.GameObject.TileSprite.prototype.autoScroll = function (x, y) {

    this._scroll.set(x, y);

    return this;

};

/**
* Stops an automatically scrolling TileSprite.
*
* @method Phaser.GameObject.TileSprite#stopScroll
* @memberof Phaser.GameObject.TileSprite
* @return {Phaser.GameObject.TileSprite} This instance.
*/
Phaser.GameObject.TileSprite.prototype.stopScroll = function () {

    this._scroll.set(0, 0);

    return this;

};

/**
* Destroys the TileSprite. This removes it from its parent group, destroys the event and animation handlers if present
* and nulls its reference to game, freeing it up for garbage collection.
*
* @method Phaser.GameObject.TileSprite#destroy
* @memberof Phaser.GameObject.TileSprite
* @param {boolean} [destroyChildren=true] - Should every child of this object have its destroy method called?
*/
Phaser.GameObject.TileSprite.prototype.destroy = function (destroyChildren) {

    Phaser.Component.Destroy.prototype.destroy.call(this, destroyChildren);

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
* Resets the TileSprite. This places the TileSprite at the given x/y world coordinates, resets the tilePosition and then
* sets alive, exists, visible and renderable all to true. Also resets the outOfBounds state.
* If the TileSprite has a physics body that too is reset.
*
* @method Phaser.GameObject.TileSprite#reset
* @memberof Phaser.GameObject.TileSprite
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @return {Phaser.GameObject.TileSprite} This instance.
*/
Phaser.GameObject.TileSprite.prototype.reset = function (x, y) {

    Phaser.Component.Reset.prototype.reset.call(this, x, y);

    this.tilePosition.x = 0;
    this.tilePosition.y = 0;

    return this;

};

/**
* Changes the texture being rendered by this TileSprite.
* Causes a texture refresh to take place on the next render.
*
* @method Phaser.GameObject.TileSprite#setTexture
* @memberof Phaser.GameObject.TileSprite
* @param {PIXI.Texture} texture - The texture to apply to this TileSprite.
* @return {Phaser.GameObject.TileSprite} This instance.
*/
Phaser.GameObject.TileSprite.prototype.setTexture = function (texture) {

    if (this.texture !== texture)
    {
        this.texture = texture;
        this.refreshTexture = true;
        this.cachedTint = 0xFFFFFF;
    }

    return this;

};

/**
* Override the Sprite method.
*
* @private
* @method Phaser.GameObject.TileSprite#onTextureUpdate
* @memberof Phaser.GameObject.TileSprite
*/
Phaser.GameObject.TileSprite.prototype.onTextureUpdate = function () {

   // overriding the sprite version of this!

};

/**
* Internal method that generates a new tiling texture.
*
* @method Phaser.GameObject.TileSprite#generateTilingTexture
* @memberof Phaser.GameObject.TileSprite
* @param {boolean} forcePowerOfTwo - Whether we want to force the texture to be a power of two
*/
Phaser.GameObject.TileSprite.prototype.generateTilingTexture = function (forcePowerOfTwo) {

    if (!this.texture.baseTexture.hasLoaded)
    {
        return;
    }

    var texture = this.texture;
    var frame = texture.frame;

    var targetWidth = this._frame.sourceSizeW || this._frame.width;
    var targetHeight = this._frame.sourceSizeH || this._frame.height;

    var dx = 0;
    var dy = 0;

    if (this._frame.trimmed)
    {
        dx = this._frame.spriteSourceSizeX;
        dy = this._frame.spriteSourceSizeY;
    }

    if (forcePowerOfTwo)
    {
        targetWidth = Phaser.Math.getNextPowerOfTwo(targetWidth);
        targetHeight = Phaser.Math.getNextPowerOfTwo(targetHeight);
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

    this.canvasBuffer.context.drawImage(
        texture.baseTexture.source,
        texture.crop.x,
        texture.crop.y,
        texture.crop.width,
        texture.crop.height,
        dx,
        dy,
        w,
        h
    );

    this.tileScaleOffset.x = frame.width / targetWidth;
    this.tileScaleOffset.y = frame.height / targetHeight;

    this.refreshTexture = false;

    this.tilingTexture.baseTexture._powerOf2 = true;

};

/**
* Returns the framing rectangle of the Tile Sprite.
*
* @method Phaser.GameObject.TileSprite#getBounds
* @memberof Phaser.GameObject.TileSprite
* @return {Phaser.Rectangle} The bounds of the Tile Sprite.
*/
Phaser.GameObject.TileSprite.prototype.getBounds = function () {

    var width = this._width;
    var height = this._height;

    var w0 = width * (1 - this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1 - this.anchor.y);
    var h1 = height * -this.anchor.y;

    var worldTransform = this.worldTransform;

    var a = worldTransform.a;
    var b = worldTransform.b;
    var c = worldTransform.c;
    var d = worldTransform.d;
    var tx = worldTransform.tx;
    var ty = worldTransform.ty;
    
    var x1 = (a * w1) + (c * h1) + tx;
    var y1 = (d * h1) + (b * w1) + ty;

    var x2 = (a * w0) + (c * h1) + tx;
    var y2 = (d * h1) + (b * w0) + ty;

    var x3 = (a * w0) + (c * h0) + tx;
    var y3 = (d * h0) + (b * w0) + ty;

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

    //  TODO: This is surely always undefined? As it's not set anywhere in the parent objects
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
* The width of the sprite, setting this will actually modify the scale to achieve the value set
*
* @property width
* @type Number
*/
Object.defineProperty(Phaser.GameObject.TileSprite.prototype, 'width', {

    get: function () {

        return this._width;

    },

    set: function (value) {

        this._width = value;

    }

});

/**
* The height of the TilingSprite, setting this will actually modify the scale to achieve the value set
*
* @property height
* @type Number
*/
Object.defineProperty(Phaser.GameObject.TileSprite.prototype, 'height', {

    get: function () {

        return this._height;

    },

    set: function (value) {

        this._height = value;

    }

});
