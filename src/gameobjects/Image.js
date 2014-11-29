/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* An Image is a light-weight {@link Pixi.DisplayObject Display Object} that can be used when physics and animation are not required.
*
* Like other display objects, an Image can still be rotated, scaled, cropped and receive input events.
* This makes it perfect for logos, backgrounds, simple buttons and other non-Sprite graphics.
*
* The documentation uses 'sprite' to generically talk about Images and other Phaser.Sprite objects, which share much of the same behavior.
*
* @constructor Phaser.Image
* @extends PIXI.Sprite
* -- Googe Closure Compiler and future jsdoc can use @implements instead of @extends
* @extends Phaser.GameObject
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - The x coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
* @param {number} y - The y coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
* @param {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - The texture used by the Image during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
* @param {string|number} frame - If this Image is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.Image = function (game, x, y, key, frame) {

    x = x || 0;
    y = y || 0;
    key = key || null;
    frame = frame || null;

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    * @protected
    */
    this.game = game;

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    * @protected
    */
    this.type = Phaser.IMAGE;

    Phaser.GameObject.createProperties(this);

    PIXI.Sprite.call(this, PIXI.TextureCache['__default']);

    this.transformCallback = this.checkTransform;
    this.transformCallbackContext = this;

    this.position.set(x, y);
    this.world.setTo(x, y);

    /**
    * Is the sprite 'alive'?
    *
    * This is useful for game logic, but does not affect rendering.
    *
    * @property {boolean} alive.
    * @default
    */
    this.alive = true;

    this.loadTexture(key, frame);

};

Phaser.Image.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Image.prototype.constructor = Phaser.Image;

Phaser.Image.prototype.preUpdate = Phaser.GameObject.prototype.preUpdate;
Phaser.Image.prototype.update = Phaser.GameObject.prototype.update;
Phaser.Image.prototype.postUpdate = Phaser.GameObject.prototype.postUpdate;

Phaser.Image.prototype.loadTexture = Phaser.GameObject.prototype.loadTexture;
Phaser.Image.prototype.setFrame = Phaser.GameObject.prototype.setFrame;
Phaser.Image.prototype.resetFrame = Phaser.GameObject.prototype.resetFrame;
Phaser.Image.prototype.crop = Phaser.GameObject.prototype.crop;
Phaser.Image.prototype.updateCrop = Phaser.GameObject.prototype.updateCrop;

/**
* Brings a 'dead' sprite back to life.
*
* A resurrected Image has its `alive`, `exists`, and `visible` properties set to true
* and the `onRevived` event will be dispatched.
*
* @method Phaser.Image#revive
* @memberof Phaser.Image
* @return {Phaser.Image} This instance.
*/
Phaser.Image.prototype.revive = function() {

    this.alive = true;
    this.exists = true;
    this.visible = true;

    if (this.events)
    {
        this.events.onRevived.dispatch(this);
    }

    return this;

};

/**
* Kills the sprite.
*
* A killed sprite has its `alive`, `exists`, and `visible` properties all set to false
* and the `onKilled` event will be dispatched.
*
* Killing a sprite is a way to recycle the Image (eg. in a Group/pool) but it doesn't free it from memory.
* Use {@link Phaser.Sprite#destroy} if the sprite is no longer needed.
*
* @method Phaser.Image#kill
* @memberof Phaser.Image
* @return {Phaser.Image} This instance.
*/
Phaser.Image.prototype.kill = function() {

    this.alive = false;
    this.exists = false;
    this.visible = false;

    if (this.events)
    {
        this.events.onKilled.dispatch(this);
    }

    return this;

};

Phaser.Image.prototype.destroy = Phaser.GameObject.prototype.destroy;

/**
* Resets the sprite.
*
* This places the sprite at the given x/y world coordinates and then
* sets `alive`, `exists`, `visible`, and `renderable` all to true.
*
* @method Phaser.Image#reset
* @memberof Phaser.Image
* @param {number} x - The x coordinate (in world space) to position the Image at.
* @param {number} y - The y coordinate (in world space) to position the Image at.
* @return {Phaser.Image} This instance.
*/
Phaser.Image.prototype.reset = function(x, y) {

    this.world.setTo(x, y);
    this.position.x = x;
    this.position.y = y;
    this.alive = true;
    this.exists = true;
    this.visible = true;
    this.renderable = true;

    return this;

};

Phaser.Image.prototype.bringToTop = Phaser.GameObject.prototype.bringToTop;
Phaser.Image.prototype.checkTransform = Phaser.GameObject.prototype.checkTransform;
Phaser.Image.prototype.setScaleMinMax = Phaser.GameObject.prototype.setScaleMinMax;

Object.defineProperty(Phaser.Image.prototype, "smoothed", Phaser.GameObject.prototype.prop_smoothed);
Object.defineProperty(Phaser.Image.prototype, "angle", Phaser.GameObject.prototype.prop_angle);

Object.defineProperty(Phaser.Image.prototype, "deltaX", Phaser.GameObject.prototype.prop_deltaX);
Object.defineProperty(Phaser.Image.prototype, "deltaY", Phaser.GameObject.prototype.prop_deltaY);
Object.defineProperty(Phaser.Image.prototype, "deltaZ", Phaser.GameObject.prototype.prop_deltaZ);

Object.defineProperty(Phaser.Image.prototype, "inWorld", Phaser.GameObject.prototype.prop_inWorld);
Object.defineProperty(Phaser.Image.prototype, "inCamera", Phaser.GameObject.prototype.prop_inCamera);
