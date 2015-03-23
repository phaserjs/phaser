/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* BitmapText objects work by taking a texture file and an XML file that describes the font structure.
* It then generates a new Sprite object for each letter of the text, proportionally spaced out and aligned to 
* match the font structure.
* 
* BitmapText objects are less flexible than Text objects, in that they have less features such as shadows, fills and the ability 
* to use Web Fonts, however you trade this flexibility for rendering speed. You can also create visually compelling BitmapTexts by 
* processing the font texture in an image editor, applying fills and any other effects required.
*
* To create a BitmapText you can use:
*
* BMFont (Windows, free): http://www.angelcode.com/products/bmfont/
* Glyph Designer (OS X, commercial): http://www.71squared.com/en/glyphdesigner
* Littera (Web-based, free): http://kvazars.com/littera/
*
* @class Phaser.BitmapText
* @constructor
* @extends PIXI.BitmapText
* @extends Phaser.Component.Core
* @extends Phaser.Component.Angle
* @extends Phaser.Component.AutoCull
* @extends Phaser.Component.Bounds
* @extends Phaser.Component.Destroy
* @extends Phaser.Component.FixedToCamera
* @extends Phaser.Component.InputEnabled
* @extends Phaser.Component.InWorld
* @extends Phaser.Component.LifeSpan
* @extends Phaser.Component.PhysicsBody
* @extends Phaser.Component.Reset
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} x - X position of the new bitmapText object.
* @param {number} y - Y position of the new bitmapText object.
* @param {string} font - The key of the BitmapFont as stored in Game.Cache.
* @param {string} [text=''] - The actual text that will be rendered. Can be set later via BitmapText.text.
* @param {number} [size=32] - The size the font will be rendered in, in pixels.
*/
Phaser.BitmapText = function (game, x, y, font, text, size) {

    x = x || 0;
    y = y || 0;
    font = font || '';
    text = text || '';
    size = size || 32;

    /**
    * @property {number} type - The const type of this object.
    * @readonly
    */
    this.type = Phaser.BITMAPTEXT;

    /**
    * @property {number} physicsType - The const physics body type of this object.
    * @readonly
    */
    this.physicsType = Phaser.SPRITE;

    /**
    * @property {string} _text - Internal cache var.
    * @private
    */
    this._text = text;

    /**
    * @property {string} _font - Internal cache var.
    * @private
    */
    this._font = font;

    /**
    * @property {number} _fontSize - Internal cache var.
    * @private
    */
    this._fontSize = size;

    /**
    * @property {string} _align - Internal cache var.
    * @private
    */
    this._align = 'left';

    /**
    * @property {number} _tint - Internal cache var.
    * @private
    */
    this._tint = 0xFFFFFF;

    /**
    * @property {number} _tw - Internal cache var. Holds the previous textWidth.
    * @private
    */
    this._tw = 0;

    /**
    * @property {number} _th - Internal cache var. Holds the previous textHeight.
    * @private
    */
    this._th = 0;

    PIXI.BitmapText.call(this, text);

    Phaser.Component.Core.init.call(this, game, x, y, '', null);

};

Phaser.BitmapText.prototype = Object.create(PIXI.BitmapText.prototype);
Phaser.BitmapText.prototype.constructor = Phaser.BitmapText;

Phaser.Component.Core.install.call(Phaser.BitmapText.prototype, [
    'Angle',
    'AutoCull',
    'Bounds',
    'Destroy',
    'FixedToCamera',
    'InputEnabled',
    'InWorld',
    'LifeSpan',
    'PhysicsBody',
    'Reset'
]);

Phaser.BitmapText.prototype.preUpdatePhysics = Phaser.Component.PhysicsBody.preUpdate;
Phaser.BitmapText.prototype.preUpdateLifeSpan = Phaser.Component.LifeSpan.preUpdate;
Phaser.BitmapText.prototype.preUpdateInWorld = Phaser.Component.InWorld.preUpdate;
Phaser.BitmapText.prototype.preUpdateCore = Phaser.Component.Core.preUpdate;

/**
* Automatically called by World.preUpdate.
*
* @method
* @memberof Phaser.BitmapText
* @return {boolean} True if the BitmapText was rendered, otherwise false.
*/
Phaser.BitmapText.prototype.preUpdate = function () {

    if (!this.preUpdatePhysics() || !this.preUpdateLifeSpan() || !this.preUpdateInWorld())
    {
        return false;
    }

    return this.preUpdateCore();

};

/**
* Automatically called by World.preUpdate.
* @method Phaser.BitmapText.prototype.postUpdate
*/
Phaser.BitmapText.prototype.postUpdate = function () {

    Phaser.Component.PhysicsBody.postUpdate.call(this);
    Phaser.Component.FixedToCamera.postUpdate.call(this);

    if (this.body && ((this.textWidth !== this._tw) || (this.textHeight !== this._th)))
    {
        this.body.setSize(this.textWidth, this.textHeight);
        this._tw = this.textWidth;
        this._th = this.textHeight;
    }

};

/**
* @method Phaser.BitmapText.prototype.setStyle
* @private
*/
Phaser.BitmapText.prototype.setStyle = function() {

    this.style = { align: this._align };
    this.fontName = this._font;
    this.fontSize = this._fontSize;
    this.dirty = true;

};

/**
* @name Phaser.BitmapText#align
* @property {string} align - Alignment for multiline text ('left', 'center' or 'right'), does not affect single line text.
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'align', {

    get: function() {
        return this._align;
    },

    set: function(value) {

        if (value !== this._align)
        {
            this._align = value;
            this.setStyle();
        }

    }

});

/**
* @name Phaser.BitmapText#tint
* @property {number} tint - The tint applied to the BitmapText. This is a hex value. Set to white to disable (0xFFFFFF)
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'tint', {

    get: function() {
        return this._tint;
    },

    set: function(value) {

        if (value !== this._tint)
        {
            this._tint = value;
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.BitmapText#font
* @property {string} font - The font the text will be rendered in, i.e. 'Arial'. Must be loaded in the browser before use.
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'font', {

    get: function() {
        return this._font;
    },

    set: function(value) {

        if (value !== this._font)
        {
            this._font = value.trim();
            this.fontName = this._font;
            this.style.font = this._fontSize + "px '" + this._font + "'";
            this.dirty = true;
        }

    }

});

/**
* @name Phaser.BitmapText#fontSize
* @property {number} fontSize - The size of the font in pixels.
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'fontSize', {

    get: function() {
        return this._fontSize;
    },

    set: function(value) {

        value = parseInt(value, 10);

        if (value !== this._fontSize)
        {
            this._fontSize = value;
            this.style.font = this._fontSize + "px '" + this._font + "'";
            this.dirty = true;
        }

    }

});

/**
* The text string to be displayed by this Text object, taking into account the style settings.
* @name Phaser.BitmapText#text
* @property {string} text - The text string to be displayed by this Text object, taking into account the style settings.
*/
Object.defineProperty(Phaser.BitmapText.prototype, 'text', {

    get: function() {
        return this._text;
    },

    set: function(value) {

        if (value !== this._text)
        {
            this._text = value.toString() || ' ';
            this.dirty = true;
        }

    }

});
