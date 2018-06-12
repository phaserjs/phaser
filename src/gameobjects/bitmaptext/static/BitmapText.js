/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var Components = require('../../components');
var GameObject = require('../../GameObject');
var GetBitmapTextSize = require('../GetBitmapTextSize');
var ParseFromAtlas = require('../ParseFromAtlas');
var Render = require('./BitmapTextRender');

/**
 * The font data for an individual character of a Bitmap Font.
 *
 * Describes the character's position, size, offset and kerning.
 *
 * @typedef {object} BitmapFontCharacterData
 *
 * @property {number} x - The x position of the character.
 * @property {number} y - The y position of the character.
 * @property {number} width - The width of the character.
 * @property {number} height - The height of the character.
 * @property {number} centerX - The center x position of the character.
 * @property {number} centerY - The center y position of the character.
 * @property {number} xOffset - The x offset of the character.
 * @property {number} yOffset - The y offset of the character.
 * @property {object} data - Extra data for the character.
 * @property {Object.<number>} kerning - Kerning values, keyed by character code.
 */

/**
 * Bitmap Font data that can be used by a BitmapText Game Object.
 *
 * @typedef {object} BitmapFontData
 *
 * @property {string} font - The name of the font.
 * @property {number} size - The size of the font.
 * @property {number} lineHeight - The line height of the font.
 * @property {boolean} retroFont - Whether this font is a retro font (monospace).
 * @property {Object.<number, BitmapFontCharacterData>} chars - The character data of the font, keyed by character code. Each character datum includes a position, size, offset and more.
 */

/**
 * @typedef {object} JSONBitmapText
 * @extends {JSONGameObject}
 *
 * @property {string} font - The name of the font.
 * @property {string} text - The text that this Bitmap Text displays.
 * @property {number} fontSize - The size of the font.
 * @property {number} letterSpacing - Adds/Removes spacing between characters
 */

/**
 * @classdesc
 * [description]
 *
 * @class BitmapText
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. It can only belong to one Scene at any given time.
 * @param {number} x - The x coordinate of this Game Object in world space.
 * @param {number} y - The y coordinate of this Game Object in world space.
 * @param {string} font - The key of the font to use from the Bitmap Font cache.
 * @param {(string|string[])} [text] - The string, or array of strings, to be set as the content of this Bitmap Text.
 * @param {number} [size] - The font size of this Bitmap Text.
 */
var BitmapText = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.ScaleMode,
        Components.ScrollFactor,
        Components.Texture,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function BitmapText (scene, x, y, font, text, size)
    {
        if (text === undefined) { text = ''; }

        GameObject.call(this, scene, 'BitmapText');

        /**
         * The key of the Bitmap Font used by this Bitmap Text.
         *
         * @name Phaser.GameObjects.BitmapText#font
         * @type {string}
         * @since 3.0.0
         */
        this.font = font;

        var entry = this.scene.sys.cache.bitmapFont.get(font);

        /**
         * The data of the Bitmap Font used by this Bitmap Text.
         *
         * @name Phaser.GameObjects.BitmapText#fontData
         * @type {BitmapFontData}
         * @since 3.0.0
         */
        this.fontData = entry.data;

        /**
         * The text that this Bitmap Text object displays.
         *
         * @name Phaser.GameObjects.BitmapText#text
         * @type {string}
         * @since 3.0.0
         */
        this.text = '';

        /**
         * The font size of this Bitmap Text.
         *
         * @name Phaser.GameObjects.BitmapText#fontSize
         * @type {number}
         * @since 3.0.0
         */
        this.fontSize = size || this.fontData.size;

        /**
         * Adds/Removes spacing between characters.
         *
         * Can be a negative or positive number.
         *
         * @name Phaser.GameObjects.BitmapText#letterSpacing
         * @type {number}
         * @since 3.4.0
         */
        this.letterSpacing = 0;

        this.setText(text);

        this.setTexture(entry.texture, entry.frame);
        this.setPosition(x, y);
        this.setOrigin(0, 0);
        this.initPipeline('TextureTintPipeline');

        /**
         * An object that describes the size of this Bitmap Text.
         *
         * @name Phaser.GameObjects.BitmapText#_bounds
         * @type {BitmapTextSize}
         * @private
         * @since 3.0.0
         */
        this._bounds = this.getTextBounds();
    },

    /**
     * Set the font size of this Bitmap Text.
     *
     * @method Phaser.GameObjects.BitmapText#setFontSize
     * @since 3.0.0
     *
     * @param {number} size - The font size to set.
     *
     * @return {Phaser.GameObjects.BitmapText} This Game Object.
     */
    setFontSize: function (size)
    {
        this.fontSize = size;

        return this;
    },

    /**
     * Sets the letter spacing between each character of this Bitmap Text.
     * Can be a positive value to increase the space, or negative to reduce it.
     * Spacing is applied after the kerning values have been set.
     *
     * @method Phaser.GameObjects.BitmapText#setLetterSpacing
     * @since 3.4.0
     *
     * @param {number} [spacing=0] - The amount of horizontal space to add between each character.
     *
     * @return {Phaser.GameObjects.BitmapText} This Game Object.
     */
    setLetterSpacing: function (spacing)
    {
        if (spacing === undefined) { spacing = 0; }

        this.letterSpacing = spacing;

        return this;
    },

    /**
     * Set the content of this BitmapText.
     *
     * An array of strings will be converted multi-line text.
     *
     * @method Phaser.GameObjects.BitmapText#setText
     * @since 3.0.0
     *
     * @param {(string|string[])} value - The string, or array of strings, to be set as the content of this BitmapText.
     *
     * @return {Phaser.GameObjects.BitmapText} This Game Object.
     */
    setText: function (value)
    {
        if (!value && value !== 0)
        {
            value = '';
        }

        if (Array.isArray(value))
        {
            value = value.join('\n');
        }

        if (value !== this.text)
        {
            this.text = value.toString();

            this.updateDisplayOrigin();
        }

        return this;
    },

    /**
     * Calculate the bounds of this Bitmap Text.
     *
     * An object is returned that contains the position, width and height of the Bitmap Text in local and global
     * contexts.
     *
     * Local size is based on just the font size and a [0, 0] position.
     *
     * Global size takes into account the Game Object's scale and world position.
     *
     * @method Phaser.GameObjects.BitmapText#getTextBounds
     * @since 3.0.0
     *
     * @param {boolean} [round] - Whether to round the results to the nearest integer.
     *
     * @return {BitmapTextSize} An object that describes the size of this Bitmap Text.
     */
    getTextBounds: function (round)
    {
        //  local = the BitmapText based on fontSize and 0x0 coords
        //  global = the BitmapText, taking into account scale and world position

        this._bounds = GetBitmapTextSize(this, round);

        return this._bounds;
    },

    /**
     * The width of this Bitmap Text.
     *
     * @name Phaser.GameObjects.BitmapText#width
     * @type {number}
     * @readOnly
     * @since 3.0.0
     */
    width: {

        get: function ()
        {
            this.getTextBounds(false);

            return this._bounds.global.width;
        }

    },

    /**
     * The height of this bitmap text.
     *
     * @name Phaser.GameObjects.BitmapText#height
     * @type {number}
     * @readOnly
     * @since 3.0.0
     */
    height: {

        get: function ()
        {
            this.getTextBounds(false);

            return this._bounds.global.height;
        }

    },

    /**
     * Build a JSON representation of this Bitmap Text.
     *
     * @method Phaser.GameObjects.BitmapText#toJSON
     * @since 3.0.0
     *
     * @return {JSONBitmapText} The JSON representation of this Bitmap Text.
     */
    toJSON: function ()
    {
        var out = Components.ToJSON(this);

        //  Extra data is added here

        var data = {
            font: this.font,
            text: this.text,
            fontSize: this.fontSize,
            letterSpacing: this.letterSpacing
        };

        out.data = data;

        return out;
    }

});

BitmapText.ParseFromAtlas = ParseFromAtlas;

module.exports = BitmapText;
