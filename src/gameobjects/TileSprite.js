/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A TileSprite is a Sprite that has a repeating texture. The texture can be scrolled and scaled and will automatically wrap on the edges as it does so.
* Please note that TileSprites, as with normal Sprites, have no input handler or physics bodies by default. Both need enabling.
*
* @class Phaser.TileSprite
* @extends PIXI.TilingSprite
* -- Google Closure Compiler and future jsdoc can use @implements instead of @extends
* @extends Phaser.GameObject.CoreMixin
* @extends Phaser.GameObject.CullingMixin
* @extends Phaser.GameObject.TextureMixin
* @extends Phaser.GameObject.InputMixin
* @extends Phaser.GameObject.EventsMixin
* @extends Phaser.GameObject.PhysicsMixin
* @extends Phaser.GameObject.LifeMixin
* @constructor
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
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    PIXI.TilingSprite.call(this, PIXI.TextureCache['__default'], width, height);

    Phaser.GameObject.init.call(this, Phaser.GameObject.SPRITE_LIKE);

    /**
    * @property {Phaser.Point} _scroll - Internal cache var.
    * @private
    */
    this._scroll = new Phaser.Point();

    this.transformCallback = this.checkTransform;
    this.transformCallbackContext = this;

    this.position.set(x, y);
    this.world.setTo(x, y);

    this.loadTexture(key, frame);

};

Phaser.TileSprite.prototype = Object.create(PIXI.TilingSprite.prototype);
Phaser.TileSprite.prototype.constructor = Phaser.TileSprite;

/**
* @property {number} type - The const type of this object.
* @readonly
* @default
*/
Phaser.TileSprite.prototype.type = Phaser.TILESPRITE;

Phaser.GameObject.mix(Phaser.TileSprite.prototype, Phaser.GameObject.SPRITE_LIKE);

/**
* Automatically called by World.preUpdate.
*
* @method Phaser.TileSprite#preUpdate
* @memberof Phaser.TileSprite
*/
Phaser.TileSprite.prototype.preUpdateCustom = function() {

    if (this._scroll.x !== 0)
    {
        this.tilePosition.x += this._scroll.x * this.game.time.physicsElapsed;
    }

    if (this._scroll.y !== 0)
    {
        this.tilePosition.y += this._scroll.y * this.game.time.physicsElapsed;
    }

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
* Play an animation based on the given key. The animation should previously have been added via sprite.animations.add()
* If the requested animation is already playing this request will be ignored. If you need to reset an already running animation do so directly on the Animation object itself.
*
* @method Phaser.TileSprite#play
* @memberof Phaser.TileSprite
* @param {string} name - The name of the animation to be played, e.g. "fire", "walk", "jump".
* @param {number} [frameRate=null] - The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
* @param {boolean} [loop=false] - Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
* @param {boolean} [killOnComplete=false] - If set to true when the animation completes (only happens if loop=false) the parent Sprite will be killed.
* @return {Phaser.Animation} A reference to playing Animation instance.
*/
Phaser.TileSprite.prototype.play = function (name, frameRate, loop, killOnComplete) {

    return this.animations.play(name, frameRate, loop, killOnComplete);

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

    this.tilePosition.x = 0;
    this.tilePosition.y = 0;

    return Phaser.GameObject.CoreMixin.prototype.reset.call(this, x, y);

};
