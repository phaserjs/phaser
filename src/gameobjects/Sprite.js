/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Sprites are the lifeblood of your game, used for nearly everything visual.
*
* At its most basic a Sprite consists of a set of coordinates and a texture that is rendered to the canvas.
* They also contain additional properties allowing for physics motion (via Sprite.body), input handling (via Sprite.input),
* events (via Sprite.events), animation (via Sprite.animations), camera culling and more. Please see the Examples for use cases.
*
* @class Phaser.Sprite
* @extends PIXI.Sprite
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
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.Sprite = function (game, x, y, key, frame) {

    x = x || 0;
    y = y || 0;
    key = key || null;
    frame = frame || null;

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    * @protected
    */
    this.game = game;

    PIXI.Sprite.call(this, PIXI.TextureCache['__default']);

    Phaser.GameObject.init.call(this, Phaser.GameObject.SPRITE_LIKE);

    /**
    * @property {number} health - Health value. Used in combination with damage() to allow for quick killing of Sprites.
    */
    this.health = 1;

    /**
    * To given a Sprite a lifespan, in milliseconds, once 'born' you can set this to a positive value. Handy for particles, bullets, etc.
    *
    * The lifespan is decremented by `game.time.physicsElapsed` (converted to milliseconds) each logic update,
    * and {@link Phaser.Sprite.kill kill} is called once the lifespan reaches 0.
    *
    * @property {number} lifespan
    * @default
    */
    this.lifespan = 0;

    this.transformCallback = this.checkTransform;
    this.transformCallbackContext = this;

    this.position.set(x, y);
    this.world.setTo(x, y);

    this.loadTexture(key, frame);

};

Phaser.Sprite.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Sprite.prototype.constructor = Phaser.Sprite;

/**
* @property {number} type - The const type of this object.
* @readonly
* @protected
*/
Phaser.Sprite.prototype.type = Phaser.SPRITE;

Phaser.GameObject.mix(Phaser.Image.prototype, Phaser.GameObject.SPRITE_LIKE);

Phaser.Sprite.prototype.preUpdateCustom = function () {

    if (this.lifespan > 0)
    {
        this.lifespan -= this.game.time.physicsElapsedMS;

        if (this.lifespan <= 0)
        {
            this.kill();
        }
    }

};

/**
* Brings a 'dead' sprite back to life.
*
* A resurrected Image has its `alive`, `exists`, and `visible` properties set to true
* and the `onRevived` event will be dispatched.
*
* @method Phaser.Sprite#revive
* @memberof Phaser.Sprite
* @param {number} [health=1] - The health to give the Sprite.
* @return (Phaser.Sprite) This instance.
*/
Phaser.Sprite.prototype.revive = function(health) {

    if (typeof health === 'undefined') { health = 1; }

    this.health = health;
    return Phaser.GameObject.Life.prototype.revive.call(this);

};

/**
* Damages the Sprite by removing the given amount of health.
*
* {@link Phaser.Sprite#kill} is called if `health` fals to 0 (or less).
*
* @method Phaser.Sprite#damage
* @memberof Phaser.Sprite
* @param {number} amount - The amount to subtract from the Sprite.health value.
* @return {Phaser.Sprite} This instance.
*/
Phaser.Sprite.prototype.damage = function(amount) {

    if (this.alive)
    {
        this.health -= amount;

        if (this.health <= 0)
        {
            this.kill();
        }
    }

    return this;

};

/**
* Resets the sprite.
*
* This places the sprite at the given x/y world coordinates and then
* sets `alive`, `exists`, `visible`, and `renderable` all to true.
*
* @method Phaser.Sprite#reset
* @memberof Phaser.Sprite
* @param {number} x - The x coordinate (in world space) to position the Sprite at.
* @param {number} y - The y coordinate (in world space) to position the Sprite at.
* @param {number} [health=1] - The health to give the Sprite.
* @return {Phaser.Sprite} This instance.
*/
Phaser.Sprite.prototype.reset = function(x, y, health) {

    if (typeof health === 'undefined') { health = 1; }

    this.health = health;

    return Phaser.GameObject.Core.reset.call(this, x, y);

};

/**
* Play an animation based on the given key.
*
* The animation should previously have been added via sprite.animations.add()
* If the requested animation is already playing this request will be ignored:
* to reset an already running animation, do so directly on the Animation object itself.
*
* @method Phaser.Sprite#play
* @memberof Phaser.Sprite
* @param {string} name - The name of the animation to be played, e.g. "fire", "walk", "jump".
* @param {number} [frameRate=null] - The framerate to play the animation at. The speed is given in frames per second. If not provided the previously set frameRate of the Animation is used.
* @param {boolean} [loop=false] - Should the animation be looped after playback. If not provided the previously set loop value of the Animation is used.
* @param {boolean} [killOnComplete=false] - If set to true when the animation completes (only happens if loop=false) the parent Sprite will be killed.
* @return {Phaser.Animation} A reference to playing Animation instance.
*/
Phaser.Sprite.prototype.play = function (name, frameRate, loop, killOnComplete) {

    if (this.animations)
    {
        return this.animations.play(name, frameRate, loop, killOnComplete);
    }

};

/**
* Checks to see if the bounds of this Sprite overlaps with the bounds of the given Display Object.
*
* The display object can be a Sprite, Image, TileSprite or anything that extends those such as a Button.
*
* This check ignores the Sprites hitArea property and runs a Sprite.getBounds comparison on both objects to determine the result.
* Therefore it's relatively expensive to use in large quantities (i.e. with lots of Sprites at a high frequency), but should be fine for low-volume testing where physics isn't required.
*
* @method Phaser.Sprite#overlap
* @memberof Phaser.Sprite
* @param {Phaser.Sprite|Phaser.Image|Phaser.TileSprite|Phaser.Button|PIXI.DisplayObject} displayObject - The display object to check against.
* @return {boolean} True if the bounds of this Sprite intersects at any point with the bounds of the given display object.
*/
Phaser.Sprite.prototype.overlap = function (displayObject) {

    return Phaser.Rectangle.intersects(this.getBounds(), displayObject.getBounds());

};
