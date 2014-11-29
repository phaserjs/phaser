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
* @class Phaser.Image
* @extends PIXI.Sprite
* -- Google Closure Compiler and future jsdoc can use @implements instead of @extends
* @extends Phaser.GameObject.CoreMixin
* @extends Phaser.GameObject.CullingMixin
* @extends Phaser.GameObject.TextureMixin
* @extends Phaser.GameObject.InputMixin
* @extends Phaser.GameObject.EventsMixin
* @extends Phaser.GameObject.LifeMixin
* @constructor
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

    PIXI.Sprite.call(this, PIXI.TextureCache['__default']);

    Phaser.GameObject.init.call(this);

    this.transformCallback = this.checkTransform;
    this.transformCallbackContext = this;

    this.position.set(x, y);
    this.world.setTo(x, y);

    this.loadTexture(key, frame);

};

Phaser.Image.prototype = Object.create(PIXI.Sprite.prototype);
Phaser.Image.prototype.constructor = Phaser.Image;

/**
* @memberof Phaser.Image
* @property {number} type - The const type of this object.
* @readonly
* @protected
*/
Phaser.Image.prototype.type = Phaser.IMAGE;

Phaser.GameObject.mix(Phaser.Image.prototype, Phaser.GameObject.IMAGE_LIKE);
