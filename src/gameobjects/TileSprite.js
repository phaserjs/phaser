/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A TileSprite is a Sprite that has a repeating texture. The texture can be scrolled and scaled and will automatically wrap on the edges as it does so.
* Please note that TileSprites, as with normal Sprites, have no input handler or physics bodies by default. Both need enabling.
*
* @class Phaser.TileSprite
* @constructor
* @extends PIXI.TilingSprite
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate (in world space) to position the TileSprite at.
* @param {number} y - The y coordinate (in world space) to position the TileSprite at.
* @param {number} width - The width of the TileSprite.
* @param {number} height - The height of the TileSprite.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the TileSprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
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
    * @property {Phaser.Point} _scroll - Internal cache var.
    * @private
    */
    this._scroll = new Phaser.Point();

    PIXI.TilingSprite.call(this, PIXI.TextureCache['__default'], width, height);

    Phaser.Component.Core.init.call(this, game, x, y, key, frame);

};

Phaser.TileSprite.prototype = Object.create(PIXI.TilingSprite.prototype);
Phaser.TileSprite.prototype.constructor = Phaser.TileSprite;

var components = [
    'Angle',
    'Animation',
    'AutoCull',
    'Bounds',
    'Destroy',
    'FixedToCamera',
    'InputEnabled',
    'InWorld',
    'LoadTexture',
    'Overlap',
    'PhysicsBody',
    'Reset',
    'Smoothed'
];

Phaser.Component.Core.install.call(Phaser.TileSprite.prototype, components);

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
* @return (Phaser.TileSprite) This instance.
*/
Phaser.TileSprite.prototype.reset = function(x, y) {

    Phaser.Component.Reset.prototype.reset.call(this, x, y);

    this.tilePosition.x = 0;
    this.tilePosition.y = 0;

    return this;

};
