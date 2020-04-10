/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Components = require('../../components');
var GameObject = require('../../GameObject');
var GetBitmapTextSize = require('../GetBitmapTextSize');
var ParseFromAtlas = require('../ParseFromAtlas');
var ParseXMLBitmapFont = require('../ParseXMLBitmapFont');
var Render = require('./BitmapTextRender');

/**
 * @classdesc
 * BitmapText objects work by taking a texture file and an XML or JSON file that describes the font structure.
 *
 * During rendering for each letter of the text is rendered to the display, proportionally spaced out and aligned to
 * match the font structure.
 *
 * BitmapText objects are less flexible than Text objects, in that they have less features such as shadows, fills and the ability
 * to use Web Fonts, however you trade this flexibility for rendering speed. You can also create visually compelling BitmapTexts by
 * processing the font texture in an image editor, applying fills and any other effects required.
 *
 * To create multi-line text insert \r, \n or \r\n escape codes into the text string.
 *
 * To create a BitmapText data files you need a 3rd party app such as:
 *
 * BMFont (Windows, free): {@link http://www.angelcode.com/products/bmfont/|http://www.angelcode.com/products/bmfont/}
 * Glyph Designer (OS X, commercial): {@link http://www.71squared.com/en/glyphdesigner|http://www.71squared.com/en/glyphdesigner}
 * Littera (Web-based, free): {@link http://kvazars.com/littera/|http://kvazars.com/littera/}
 *
 * For most use cases it is recommended to use XML. If you wish to use JSON, the formatting should be equal to the result of
 * converting a valid XML file through the popular X2JS library. An online tool for conversion can be found here: {@link http://codebeautify.org/xmltojson|http://codebeautify.org/xmltojson}
 *
 * @class BitmapText
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
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
 * @param {integer} [align=0] - The alignment of the text in a multi-line BitmapText object.
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
        Components.ScrollFactor,
        Components.Texture,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function BitmapText (scene, x, y, font, text, size, align)
    {
        if (text === undefined) { text = ''; }
        if (align === undefined) { align = 0; }

        GameObject.call(this, scene, 'BitmapText');

        /**
         * The key of the Bitmap Font used by this Bitmap Text.
         * To change the font after creation please use `setFont`.
         *
         * @name Phaser.GameObjects.BitmapText#font
         * @type {string}
         * @readonly
         * @since 3.0.0
         */
        this.font = font;

        var entry = this.scene.sys.cache.bitmapFont.get(font);

        /**
         * The data of the Bitmap Font used by this Bitmap Text.
         *
         * @name Phaser.GameObjects.BitmapText#fontData
         * @type {Phaser.Types.GameObjects.BitmapText.BitmapFontData}
         * @readonly
         * @since 3.0.0
         */
        this.fontData = entry.data;

        /**
         * The text that this Bitmap Text object displays.
         *
         * @name Phaser.GameObjects.BitmapText#_text
         * @type {string}
         * @private
         * @since 3.0.0
         */
        this._text = '';

        /**
         * The font size of this Bitmap Text.
         *
         * @name Phaser.GameObjects.BitmapText#_fontSize
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._fontSize = size || this.fontData.size;

        /**
         * Adds / Removes spacing between characters.
         *
         * Can be a negative or positive number.
         *
         * @name Phaser.GameObjects.BitmapText#_letterSpacing
         * @type {number}
         * @private
         * @since 3.4.0
         */
        this._letterSpacing = 0;

        /**
         * Controls the alignment of each line of text in this BitmapText object.
         * Only has any effect when this BitmapText contains multiple lines of text, split with carriage-returns.
         * Has no effect with single-lines of text.
         *
         * See the methods `setLeftAlign`, `setCenterAlign` and `setRightAlign`.
         *
         * 0 = Left aligned (default)
         * 1 = Middle aligned
         * 2 = Right aligned
         *
         * The alignment position is based on the longest line of text.
         *
         * @name Phaser.GameObjects.BitmapText#_align
         * @type {integer}
         * @private
         * @since 3.11.0
         */
        this._align = align;

        /**
         * An object that describes the size of this Bitmap Text.
         *
         * @name Phaser.GameObjects.BitmapText#_bounds
         * @type {Phaser.Types.GameObjects.BitmapText.BitmapTextSize}
         * @private
         * @since 3.0.0
         */
        this._bounds = GetBitmapTextSize();

        /**
         * An internal dirty flag for bounds calculation.
         *
         * @name Phaser.GameObjects.BitmapText#_dirty
         * @type {boolean}
         * @private
         * @since 3.11.0
         */
        this._dirty = true;

        /**
         * Internal cache var holding the maxWidth.
         *
         * @name Phaser.GameObjects.BitmapText#_maxWidth
         * @type {number}
         * @private
         * @since 3.21.0
         */
        this._maxWidth = 0;

        /**
         * The character code used to detect for word wrapping.
         * Defaults to 32 (a space character).
         *
         * @name Phaser.GameObjects.BitmapText#wordWrapCharCode
         * @type {number}
         * @since 3.21.0
         */
        this.wordWrapCharCode = 32;

        this.setTexture(entry.texture, entry.frame);
        this.setPosition(x, y);
        this.setOrigin(0, 0);
        this.initPipeline();

        this.setText(text);
    },

    /**
     * Set the lines of text in this BitmapText to be left-aligned.
     * This only has any effect if this BitmapText contains more than one line of text.
     *
     * @method Phaser.GameObjects.BitmapText#setLeftAlign
     * @since 3.11.0
     *
     * @return {this} This BitmapText Object.
     */
    setLeftAlign: function ()
    {
        this._align = BitmapText.ALIGN_LEFT;

        this._dirty = true;

        return this;
    },

    /**
     * Set the lines of text in this BitmapText to be center-aligned.
     * This only has any effect if this BitmapText contains more than one line of text.
     *
     * @method Phaser.GameObjects.BitmapText#setCenterAlign
     * @since 3.11.0
     *
     * @return {this} This BitmapText Object.
     */
    setCenterAlign: function ()
    {
        this._align = BitmapText.ALIGN_CENTER;

        this._dirty = true;

        return this;
    },

    /**
     * Set the lines of text in this BitmapText to be right-aligned.
     * This only has any effect if this BitmapText contains more than one line of text.
     *
     * @method Phaser.GameObjects.BitmapText#setRightAlign
     * @since 3.11.0
     *
     * @return {this} This BitmapText Object.
     */
    setRightAlign: function ()
    {
        this._align = BitmapText.ALIGN_RIGHT;

        this._dirty = true;

        return this;
    },

    /**
     * Set the font size of this Bitmap Text.
     *
     * @method Phaser.GameObjects.BitmapText#setFontSize
     * @since 3.0.0
     *
     * @param {number} size - The font size to set.
     *
     * @return {this} This BitmapText Object.
     */
    setFontSize: function (size)
    {
        this._fontSize = size;

        this._dirty = true;

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
     * @return {this} This BitmapText Object.
     */
    setLetterSpacing: function (spacing)
    {
        if (spacing === undefined) { spacing = 0; }

        this._letterSpacing = spacing;

        this._dirty = true;

        return this;
    },

    /**
     * Set the textual content of this BitmapText.
     *
     * An array of strings will be converted into multi-line text. Use the align methods to change multi-line alignment.
     *
     * @method Phaser.GameObjects.BitmapText#setText
     * @since 3.0.0
     *
     * @param {(string|string[])} value - The string, or array of strings, to be set as the content of this BitmapText.
     *
     * @return {this} This BitmapText Object.
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
            this._text = value.toString();

            this._dirty = true;

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
     * Global size takes into account the Game Object's scale, world position and display origin.
     *
     * Also in the object is data regarding the length of each line, should this be a multi-line BitmapText.
     *
     * @method Phaser.GameObjects.BitmapText#getTextBounds
     * @since 3.0.0
     *
     * @param {boolean} [round] - Whether to round the results to the nearest integer.
     *
     * @return {Phaser.Types.GameObjects.BitmapText.BitmapTextSize} An object that describes the size of this Bitmap Text.
     */
    getTextBounds: function (round)
    {
        //  local = The BitmapText based on fontSize and 0x0 coords
        //  global = The BitmapText, taking into account scale and world position
        //  lines = The BitmapText line data

        var bounds = this._bounds;

        if (this._dirty || this.scaleX !== bounds.scaleX || this.scaleY !== bounds.scaleY)
        {
            GetBitmapTextSize(this, round, bounds);

            this._dirty = false;

            this.updateDisplayOrigin();
        }

        return bounds;
    },

    /**
     * Changes the font this BitmapText is using to render.
     *
     * The new texture is loaded and applied to the BitmapText. The existing test, size and alignment are preserved,
     * unless overridden via the arguments.
     *
     * @method Phaser.GameObjects.BitmapText#setFont
     * @since 3.11.0
     *
     * @param {string} font - The key of the font to use from the Bitmap Font cache.
     * @param {number} [size] - The font size of this Bitmap Text. If not specified the current size will be used.
     * @param {integer} [align=0] - The alignment of the text in a multi-line BitmapText object. If not specified the current alignment will be used.
     *
     * @return {this} This BitmapText Object.
     */
    setFont: function (key, size, align)
    {
        if (size === undefined) { size = this._fontSize; }
        if (align === undefined) { align = this._align; }

        if (key !== this.font)
        {
            var entry = this.scene.sys.cache.bitmapFont.get(key);

            if (entry)
            {
                this.font = key;
                this.fontData = entry.data;
                this._fontSize = size;
                this._align = align;

                this.setTexture(entry.texture, entry.frame);

                GetBitmapTextSize(this, false, this._bounds);
            }
        }

        return this;
    },

    /**
     * Sets the maximum display width of this BitmapText in pixels.
     *
     * If `BitmapText.text` is longer than `maxWidth` then the lines will be automatically wrapped
     * based on the previous whitespace character found in the line.
     *
     * If no whitespace was found then no wrapping will take place and consequently the `maxWidth` value will not be honored.
     *
     * Disable maxWidth by setting the value to 0.
     *
     * You can set the whitespace character to be searched for by setting the `wordWrapCharCode` parameter or property.
     *
     * @method Phaser.GameObjects.BitmapText#setMaxWidth
     * @since 3.21.0
     *
     * @param {number} value - The maximum display width of this BitmapText in pixels. Set to zero to disable.
     * @param {number} [wordWrapCharCode] - The character code to check for when word wrapping. Defaults to 32 (the space character).
     *
     * @return {this} This BitmapText Object.
     */
    setMaxWidth: function (value, wordWrapCharCode)
    {
        this._maxWidth = value;

        this._dirty = true;

        if (wordWrapCharCode !== undefined)
        {
            this.wordWrapCharCode = wordWrapCharCode;
        }

        return this;
    },

    /**
     * Controls the alignment of each line of text in this BitmapText object.
     *
     * Only has any effect when this BitmapText contains multiple lines of text, split with carriage-returns.
     * Has no effect with single-lines of text.
     *
     * See the methods `setLeftAlign`, `setCenterAlign` and `setRightAlign`.
     *
     * 0 = Left aligned (default)
     * 1 = Middle aligned
     * 2 = Right aligned
     *
     * The alignment position is based on the longest line of text.
     *
     * @name Phaser.GameObjects.BitmapText#align
     * @type {integer}
     * @since 3.11.0
     */
    align: {

        set: function (value)
        {
            this._align = value;
            this._dirty = true;
        },

        get: function ()
        {
            return this._align;
        }

    },

    /**
     * The text that this Bitmap Text object displays.
     *
     * You can also use the method `setText` if you want a chainable way to change the text content.
     *
     * @name Phaser.GameObjects.BitmapText#text
     * @type {string}
     * @since 3.0.0
     */
    text: {

        set: function (value)
        {
            this.setText(value);
        },

        get: function ()
        {
            return this._text;
        }

    },

    /**
     * The font size of this Bitmap Text.
     *
     * You can also use the method `setFontSize` if you want a chainable way to change the font size.
     *
     * @name Phaser.GameObjects.BitmapText#fontSize
     * @type {number}
     * @since 3.0.0
     */
    fontSize: {

        set: function (value)
        {
            this._fontSize = value;
            this._dirty = true;
        },

        get: function ()
        {
            return this._fontSize;
        }

    },

    /**
     * Adds / Removes spacing between characters.
     *
     * Can be a negative or positive number.
     *
     * You can also use the method `setLetterSpacing` if you want a chainable way to change the letter spacing.
     *
     * @name Phaser.GameObjects.BitmapText#letterSpacing
     * @type {number}
     * @since 3.0.0
     */
    letterSpacing: {

        set: function (value)
        {
            this._letterSpacing = value;
            this._dirty = true;
        },

        get: function ()
        {
            return this._letterSpacing;
        }

    },

    /**
     * The maximum display width of this BitmapText in pixels.
     *
     * If BitmapText.text is longer than maxWidth then the lines will be automatically wrapped
     * based on the last whitespace character found in the line.
     *
     * If no whitespace was found then no wrapping will take place and consequently the maxWidth value will not be honored.
     *
     * Disable maxWidth by setting the value to 0.
     *
     * @name Phaser.GameObjects.BitmapText#maxWidth
     * @type {number}
     * @since 3.21.0
     */
    maxWidth: {

        set: function (value)
        {
            this._maxWidth = value;
            this._dirty = true;
        },

        get: function ()
        {
            return this._maxWidth;
        }

    },

    /**
     * The width of this Bitmap Text.
     *
     * @name Phaser.GameObjects.BitmapText#width
     * @type {number}
     * @readonly
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
     * @readonly
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
     * @return {Phaser.Types.GameObjects.BitmapText.JSONBitmapText} A JSON representation of this Bitmap Text.
     */
    toJSON: function ()
    {
        var out = Components.ToJSON(this);

        //  Extra data is added here

        var data = {
            font: this.font,
            text: this.text,
            fontSize: this.fontSize,
            letterSpacing: this.letterSpacing,
            align: this.align
        };

        out.data = data;

        return out;
    }

});

/**
 * Left align the text characters in a multi-line BitmapText object.
 *
 * @name Phaser.GameObjects.BitmapText.ALIGN_LEFT
 * @type {integer}
 * @since 3.11.0
 */
BitmapText.ALIGN_LEFT = 0;

/**
 * Center align the text characters in a multi-line BitmapText object.
 *
 * @name Phaser.GameObjects.BitmapText.ALIGN_CENTER
 * @type {integer}
 * @since 3.11.0
 */
BitmapText.ALIGN_CENTER = 1;

/**
 * Right align the text characters in a multi-line BitmapText object.
 *
 * @name Phaser.GameObjects.BitmapText.ALIGN_RIGHT
 * @type {integer}
 * @since 3.11.0
 */
BitmapText.ALIGN_RIGHT = 2;

/**
 * Parse an XML Bitmap Font from an Atlas.
 *
 * Adds the parsed Bitmap Font data to the cache with the `fontName` key.
 *
 * @method Phaser.GameObjects.BitmapText.ParseFromAtlas
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to parse the Bitmap Font for.
 * @param {string} fontName - The key of the font to add to the Bitmap Font cache.
 * @param {string} textureKey - The key of the BitmapFont's texture.
 * @param {string} frameKey - The key of the BitmapFont texture's frame.
 * @param {string} xmlKey - The key of the XML data of the font to parse.
 * @param {integer} [xSpacing] - The x-axis spacing to add between each letter.
 * @param {integer} [ySpacing] - The y-axis spacing to add to the line height.
 *
 * @return {boolean} Whether the parsing was successful or not.
 */
BitmapText.ParseFromAtlas = ParseFromAtlas;

/**
 * Parse an XML font to Bitmap Font data for the Bitmap Font cache.
 *
 * @method Phaser.GameObjects.BitmapText.ParseXMLBitmapFont
 * @since 3.17.0
 *
 * @param {XMLDocument} xml - The XML Document to parse the font from.
 * @param {integer} [xSpacing=0] - The x-axis spacing to add between each letter.
 * @param {integer} [ySpacing=0] - The y-axis spacing to add to the line height.
 * @param {Phaser.Textures.Frame} [frame] - The texture frame to take into account while parsing.
 *
 * @return {Phaser.Types.GameObjects.BitmapText.BitmapFontData} The parsed Bitmap Font data.
 */
BitmapText.ParseXMLBitmapFont = ParseXMLBitmapFont;

module.exports = BitmapText;
