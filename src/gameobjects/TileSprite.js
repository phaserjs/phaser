/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A TileSprite is a Sprite whos texture is set to repeat and can be scrolled. As it scrolls the texture repeats (wraps) on the edges.
* @class Phaser.Tilemap
* @extends Phaser.Sprite
* @constructor
* @param {Phaser.Game} game - Current game instance.
* @param {number} x - X position of the new tileSprite.
* @param {number} y - Y position of the new tileSprite.
* @param {number} width - the width of the tilesprite.
* @param {number} height - the height of the tilesprite.
* @param {string|Phaser.RenderTexture|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture or PIXI.Texture.
* @param {string|number} frame - If this Sprite is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/
Phaser.TileSprite = function (game, x, y, width, height, key, frame) {

    x = x || 0;
    y = y || 0;
    width = width || 256;
    height = height || 256;
    key = key || null;
    frame = frame || null;

    Phaser.Sprite.call(this, game, x, y, key, frame);

    /**
    * @property {PIXI.Texture} texture - The texture that the sprite renders with.
    */
    this.texture = PIXI.TextureCache[key];

    PIXI.TilingSprite.call(this, this.texture, width, height);

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.TILESPRITE;

    /**
    * @property {Phaser.Point} tileScale - The scaling of the image that is being tiled.
    */
    this.tileScale = new Phaser.Point(1, 1);

    /**
    * @property {Phaser.Point} tilePosition - The offset position of the image that is being tiled.
    */
    this.tilePosition = new Phaser.Point(0, 0);

    this.body.width = width;
    this.body.height = height;

};

Phaser.TileSprite.prototype = Phaser.Utils.extend(true, PIXI.TilingSprite.prototype, Phaser.Sprite.prototype);
Phaser.TileSprite.prototype.constructor = Phaser.TileSprite;

/**
* Indicates the rotation of the Sprite, in degrees, from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
* If you wish to work in radians instead of degrees use the property Sprite.rotation instead.
* @name Phaser.TileSprite#angle
* @property {number} angle - Gets or sets the Sprites angle of rotation in degrees.
*/
Object.defineProperty(Phaser.TileSprite.prototype, 'angle', {

    get: function() {
        return Phaser.Math.wrapAngle(Phaser.Math.radToDeg(this.rotation));
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(Phaser.Math.wrapAngle(value));
    }

});

/**
* @name Phaser.TileSprite#frame
* @property {number} frame - Gets or sets the current frame index and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.TileSprite.prototype, "frame", {
    
    get: function () {
        return this.animations.frame;
    },

    set: function (value) {
        this.animations.frame = value;
    }

});

/**
* @name Phaser.TileSprite#frameName
* @property {string} frameName - Gets or sets the current frame name and updates the Texture Cache for display.
*/
Object.defineProperty(Phaser.TileSprite.prototype, "frameName", {
    
    get: function () {
        return this.animations.frameName;
    },

    set: function (value) {
        this.animations.frameName = value;
    }

});

/**
* @name Phaser.TileSprite#inCamera
* @property {boolean} inCamera - Is this sprite visible to the camera or not?
* @readonly
*/
Object.defineProperty(Phaser.TileSprite.prototype, "inCamera", {
    
    get: function () {
        return this._cache.cameraVisible;
    }

});

/**
* By default a Sprite won't process any input events at all. By setting inputEnabled to true the Phaser.InputHandler is
* activated for this Sprite instance and it will then start to process click/touch events and more.
*
* @name Phaser.TileSprite#inputEnabled
* @property {boolean} inputEnabled - Set to true to allow this Sprite to receive input events, otherwise false.
*/
Object.defineProperty(Phaser.TileSprite.prototype, "inputEnabled", {
    
    get: function () {

        return (this.input.enabled);

    },

    set: function (value) {

        if (value)
        {
            if (this.input.enabled === false)
            {
                this.input.start();
            }
        }
        else
        {
            if (this.input.enabled)
            {
                this.input.stop();
            }
        }

    }

});
