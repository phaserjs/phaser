/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* BitmapText objects work by taking a texture file and an XML file that describes the font layout.
*
* On Windows you can use the free app BMFont: http://www.angelcode.com/products/bmfont/
* On OS X we recommend Glyph Designer: http://www.71squared.com/en/glyphdesigner
* For Web there is the great Littera: http://kvazars.com/littera/
*
* @class Phaser.BitmapText
* @constructor
* @extends PIXI.BitmapText
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

    PIXI.BitmapText.call(this, text);

    Phaser.Component.Core.init.call(this, game, x, y, '', null);

};

Phaser.BitmapText.prototype = Object.create(PIXI.BitmapText.prototype);
Phaser.BitmapText.prototype.constructor = Phaser.BitmapText;

var components = [
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
];

Phaser.Component.Core.install.call(Phaser.BitmapText.prototype, components);

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
* Automatically called by World.preUpdate.
* @method Phaser.BitmapText.prototype.preUpdate
*/
Phaser.BitmapText.prototype.preUpdate = function () {

    Phaser.Component.InWorld.preUpdate.call(this);
    Phaser.Component.Core.preUpdate.call(this);

    return true;

};

/**
* Automatically called by World.preUpdate.
* @method Phaser.BitmapText.prototype.postUpdate
*/
Phaser.BitmapText.prototype.postUpdate = function () {

    Phaser.Component.PhysicsBody.postUpdate.call(this);
    Phaser.Component.FixedToCamera.postUpdate.call(this);

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
