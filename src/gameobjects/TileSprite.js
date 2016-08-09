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
* a power of two in size (i.e. 4, 8, 16, 32, 64, 128, 256, 512, etch pixels width by height). If the texture isn't a power of two
* it will be rendered to a blank canvas that is the correct size, which means you may have 'blank' areas appearing to the right and
* bottom of your frame. To avoid this ensure your textures are perfect powers of two.
* 
* TileSprites support animations in the same way that Sprites do. You add and play animations using the AnimationManager. However
* if your game is running under WebGL please note that each frame of the animation must be a power of two in size, or it will receive
* additional padding to enforce it to be so.
*
* @class Phaser.TileSprite
* @constructor
* @extends PIXI.TilingSprite
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
* @param {number} x - The x coordinate (in world space) to position the TileSprite at.
* @param {number} y - The y coordinate (in world space) to position the TileSprite at.
* @param {number} width - The width of the TileSprite.
* @param {number} height - The height of the TileSprite.
* @param {string|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the TileSprite during rendering. It can be a string which is a reference to the Phaser Image Cache entry, or an instance of a PIXI.Texture or BitmapData.
* @param {string|number} frame - If this TileSprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.TileSprite = function (game, x, y, width, height, key, frame) {

    x = x || 0;
    y = y || 0;
    width = width || 256;
    height = height || 256;
    key = key || null;
    frame = frame || null;

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

    var def = game.cache.getImage('__default', true);

    PIXI.TilingSprite.call(this, new PIXI.Texture(def.base), width, height);

    Phaser.Component.Core.init.call(this, game, x, y, key, frame);

};

Phaser.TileSprite.prototype = Object.create(PIXI.TilingSprite.prototype);
Phaser.TileSprite.prototype.constructor = Phaser.TileSprite;

Phaser.Component.Core.install.call(Phaser.TileSprite.prototype, [
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

Phaser.TileSprite.prototype.preUpdatePhysics = Phaser.Component.PhysicsBody.preUpdate;
Phaser.TileSprite.prototype.preUpdateLifeSpan = Phaser.Component.LifeSpan.preUpdate;
Phaser.TileSprite.prototype.preUpdateInWorld = Phaser.Component.InWorld.preUpdate;
Phaser.TileSprite.prototype.preUpdateCore = Phaser.Component.Core.preUpdate;

/**
* Automatically called by World.preUpdate.
*
* @method Phaser.TileSprite#preUpdate
* @memberof Phaser.TileSprite
*/
Phaser.TileSprite.prototype.preUpdate = function() {

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
* @method Phaser.TileSprite#autoScroll
* @memberof Phaser.TileSprite
* @param {number} x - Horizontal scroll speed in pixels per second.
* @param {number} y - Vertical scroll speed in pixels per second.
*/
Phaser.TileSprite.prototype.autoScroll = function(x, y) {

    this._scroll.set(x, y);

};

/**
* Stops an automatically scrolling TileSprite.
*
* @method Phaser.TileSprite#stopScroll
* @memberof Phaser.TileSprite
*/
Phaser.TileSprite.prototype.stopScroll = function() {

    this._scroll.set(0, 0);

};

/**
* Destroys the TileSprite. This removes it from its parent group, destroys the event and animation handlers if present
* and nulls its reference to game, freeing it up for garbage collection.
*
* @method Phaser.TileSprite#destroy
* @memberof Phaser.TileSprite
* @param {boolean} [destroyChildren=true] - Should every child of this object have its destroy method called?
*/
Phaser.TileSprite.prototype.destroy = function(destroyChildren) {

    Phaser.Component.Destroy.prototype.destroy.call(this, destroyChildren);

    PIXI.TilingSprite.prototype.destroy.call(this);

};

/**
* Resets the TileSprite. This places the TileSprite at the given x/y world coordinates, resets the tilePosition and then
* sets alive, exists, visible and renderable all to true. Also resets the outOfBounds state.
* If the TileSprite has a physics body that too is reset.
*
* @method Phaser.TileSprite#reset
* @memberof Phaser.TileSprite
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @return {Phaser.TileSprite} This instance.
*/
Phaser.TileSprite.prototype.reset = function(x, y) {

    Phaser.Component.Reset.prototype.reset.call(this, x, y);

    this.tilePosition.x = 0;
    this.tilePosition.y = 0;

    return this;

};
