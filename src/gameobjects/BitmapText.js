/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Creates a new BitmapText object.
*
* @class Phaser.BitmapText
*
* @classdesc BitmapText objects work by taking a texture file and an XML file that describes the font layout.
*
* On Windows you can use the free app BMFont: http://www.angelcode.com/products/bmfont/
*
* On OS X we recommend Glyph Designer: http://www.71squared.com/en/glyphdesigner
*
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - X position of the new bitmapText object.
* @param {number} y - Y position of the new bitmapText object.
* @param {string} text - The actual text that will be written.
* @param {object} style - The style object containing style attributes like font, font size , etc.
*/
Phaser.BitmapText = function (game, x, y, text, style) {

    x = x || 0;
    y = y || 0;
    text = text || '';
    style = style || '';

    /**
    * @property {Phaser.Game} game - A reference to the currently running Game.
    */
    this.game = game;

    /** 
    * @property {boolean} exists - If exists = false then the Sprite isn't updated by the core game loop or physics subsystem at all.
    * @default
    */
    this.exists = true;

    /**
    * @property {boolean} alive - This is a handy little var your game can use to determine if a sprite is alive or not, it doesn't effect rendering.
    * @default
    */
    this.alive = true;

    /**
    * @property {Phaser.Group} group - The parent Group of this BitmapText.
    */
    this.group = null;

    /**
    * @property {string} name - The user defined name given to this BitmapText.
    * @default
    */
    this.name = '';

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.BITMAPTEXT;

    PIXI.BitmapText.call(this, text, style);

    /**
    * @property {number} position.x - The x position of this object.
    */
    this.position.x = x;
    
    /**
    * @property {number} position.y - The y position of this object.
    */
    this.position.y = y;

    /**
    * The anchor sets the origin point of the texture.
    * The default is 0,0 this means the textures origin is the top left 
    * Setting than anchor to 0.5,0.5 means the textures origin is centered
    * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right
    *
    * @property {Phaser.Point} anchor - The anchor around which rotation and scaling takes place.
    */
    this.anchor = new Phaser.Point();
    
    /**
    * @property {Phaser.Point} scale - The scale of the object when rendered. By default it's set to 1 (no scale). You can modify it via scale.x or scale.y or scale.setTo(x, y). A value of 1 means no change to the scale, 0.5 means "half the size", 2 means "twice the size", etc.
    */
    this.scale = new Phaser.Point(1, 1);

    /**
    * @property {object} _cache - A mini cache for storing all of the calculated values.
    * @private
    */
    this._cache = {

        dirty: false,

        //  Transform cache
        a00: 1,
        a01: 0,
        a02: x,
        a10: 0,
        a11: 1,
        a12: y,
        id: 1,

        //  The previous calculated position
        x: -1,
        y: -1,

        //  The actual scale values based on the worldTransform
        scaleX: 1,
        scaleY: 1

    };

    this._cache.x = this.x;
    this._cache.y = this.y;

};

Phaser.BitmapText.prototype = Object.create(PIXI.BitmapText.prototype);
Phaser.BitmapText.prototype.constructor = Phaser.BitmapText;

/**
* Automatically called by World.update
* @method Phaser.BitmapText.prototype.update
*/
Phaser.BitmapText.prototype.update = function() {

    if (!this.exists)
    {
        return;
    }

    this._cache.dirty = false;

    this._cache.x = this.x;
    this._cache.y = this.y;

    if (this.position.x != this._cache.x || this.position.y != this._cache.y)
    {
        this.position.x = this._cache.x;
        this.position.y = this._cache.y;
        this._cache.dirty = true;
    }

    this.pivot.x = this.anchor.x * this.width;
    this.pivot.y = this.anchor.y * this.height;

}

/**
* @method Phaser.Text.prototype.destroy
*/
Phaser.BitmapText.prototype.destroy = function() {

    if (this.group)
    {
        this.group.remove(this);
    }

    if (this.canvas && this.canvas.parentNode)
    {
        this.canvas.parentNode.removeChild(this.canvas);
    }
    else
    {
        this.canvas = null;
        this.context = null;
    }

    this.exists = false;

    this.group = null;

}

/**
* Indicates the rotation of the BitmapText, in degrees, from its original orientation. Values from 0 to 180 represent clockwise rotation; values from 0 to -180 represent counterclockwise rotation.
* Values outside this range are added to or subtracted from 360 to obtain a value within the range. For example, the statement player.angle = 450 is the same as player.angle = 90.
* If you wish to work in radians instead of degrees use the property Sprite.rotation instead.
* @name Phaser.BitmapText#angle
* @property {number} angle - Gets or sets the angle of rotation in degrees.
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'angle', {

    get: function() {
        return Phaser.Math.radToDeg(this.rotation);
    },

    set: function(value) {
        this.rotation = Phaser.Math.degToRad(value);
    }

});

/**
* The x coordinate of this object in world space.
* @name Phaser.BitmapText#x
* @property {number} x - The x coordinate of this object in world space.
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'x', {

    get: function() {
        return this.position.x;
    },

    set: function(value) {
        this.position.x = value;
    }

});

/**
* The y coordinate of this object in world space.
* @name Phaser.BitmapText#y
* @property {number} y - The y coordinate of this object in world space.
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'y', {

    get: function() {
        return this.position.y;
    },

    set: function(value) {
        this.position.y = value;
    }

});
