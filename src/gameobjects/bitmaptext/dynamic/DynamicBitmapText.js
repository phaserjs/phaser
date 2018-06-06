/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../utils/Class');
var Components = require('../../components');
var GameObject = require('../../GameObject');
var GetBitmapTextSize = require('../GetBitmapTextSize');
var Render = require('./DynamicBitmapTextRender');

/**
 * @typedef {object} DisplayCallbackConfig
 * @property {{topLeft:number,topRight:number,bottomLeft:number,bottomRight:number}} tint - The tint of the character being rendered.
 * @property {number} index - The index of the character being rendered.
 * @property {number} charCode - The character code of the character being rendered.
 * @property {number} x - The x position of the character being rendered.
 * @property {number} y - The y position of the character being rendered.
 * @property {number} scale - The scale of the character being rendered.
 * @property {number} rotation - The rotation of the character being rendered.
 * @property {any} data - Custom data stored with the character being rendered.
 */

/**
 * @callback DisplayCallback
 *
 * @param {DisplayCallbackConfig} display - Settings of the character that is about to be rendered.
 *
 * @return {{x:number, y:number, scale:number, rotation:number}} Altered position, scale and rotation values for the character that is about to be rendered.
 */

/**
 * @classdesc
 * [description]
 *
 * @class DynamicBitmapText
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
var DynamicBitmapText = new Class({

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

    function DynamicBitmapText (scene, x, y, font, text, size)
    {
        if (text === undefined) { text = ''; }

        GameObject.call(this, scene, 'DynamicBitmapText');

        /**
         * The key of the Bitmap Font used by this Bitmap Text.
         *
         * @name Phaser.GameObjects.DynamicBitmapText#font
         * @type {string}
         * @since 3.0.0
         */
        this.font = font;

        var entry = this.scene.sys.cache.bitmapFont.get(font);

        /**
         * The data of the Bitmap Font used by this Bitmap Text.
         *
         * @name Phaser.GameObjects.DynamicBitmapText#fontData
         * @type {BitmapFontData}
         * @since 3.0.0
         */
        this.fontData = entry.data;

        /**
         * The text that this Bitmap Text object displays.
         *
         * @name Phaser.GameObjects.DynamicBitmapText#text
         * @type {string}
         * @since 3.0.0
         */
        this.text = '';

        /**
         * The font size of this Bitmap Text.
         *
         * @name Phaser.GameObjects.DynamicBitmapText#fontSize
         * @type {number}
         * @since 3.0.0
         */
        this.fontSize = size || this.fontData.size;

        /**
         * Adds/Removes spacing between characters
         * Can be a negative or positive number
         *
         * @name Phaser.GameObjects.DynamicBitmapText#letterSpacing
         * @type {number}
         * @since 3.5.0
         */
        this.letterSpacing = 0;

        this.setText(text);

        this.setTexture(entry.texture, entry.frame);
        this.setPosition(x, y);
        this.setOrigin(0, 0);
        this.initPipeline('TextureTintPipeline');

        /**
         * An object that describes the size of this BitmapText.
         *
         * @name Phaser.GameObjects.DynamicBitmapText#_bounds
         * @type {BitmapTextSize}
         * @private
         * @since 3.0.0
         */
        this._bounds = this.getTextBounds();

        /**
         * The horizontal scroll position of the Bitmap Text.
         *
         * @name Phaser.GameObjects.DynamicBitmapText#scrollX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.scrollX = 0;

        /**
         * The vertical scroll position of the Bitmap Text.
         *
         * @name Phaser.GameObjects.DynamicBitmapText#scrollY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.scrollY = 0;

        /**
         * The crop width of the Bitmap Text.
         *
         * @name Phaser.GameObjects.DynamicBitmapText#cropWidth
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.cropWidth = 0;

        /**
         * The crop height of the Bitmap Text.
         *
         * @name Phaser.GameObjects.DynamicBitmapText#cropHeight
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.cropHeight = 0;

        /**
         * A callback that alters how each character of the Bitmap Text is rendered.
         *
         * @name Phaser.GameObjects.DynamicBitmapText#displayCallback;
         * @type {DisplayCallback}
         * @since 3.0.0
         */
        this.displayCallback;
    },

    /**
     * Set the crop size of this Bitmap Text.
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setSize
     * @since 3.0.0
     *
     * @param {number} width - The width of the crop.
     * @param {number} height - The height of the crop.
     *
     * @return {Phaser.GameObjects.DynamicBitmapText} This Game Object.
     */
    setSize: function (width, height)
    {
        this.cropWidth = width;
        this.cropHeight = height;

        return this;
    },

    /**
     * Set a callback that alters how each character of the Bitmap Text is rendered.
     *
     * The callback receives a {@link DisplayCallbackConfig} object that contains information about the character that's
     * about to be rendered.
     *
     * It should return an object with `x`, `y`, `scale` and `rotation` properties that will be used instead of the
     * usual values when rendering.
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setDisplayCallback
     * @since 3.0.0
     *
     * @param {DisplayCallback} callback - The display callback to set.
     *
     * @return {Phaser.GameObjects.DynamicBitmapText} This Game Object.
     */
    setDisplayCallback: function (callback)
    {
        this.displayCallback = callback;

        return this;
    },

    /**
     * Set the font size of this Bitmap Text.
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setFontSize
     * @since 3.0.0
     *
     * @param {number} size - The font size to set.
     *
     * @return {Phaser.GameObjects.DynamicBitmapText} This Game Object.
     */
    setFontSize: function (size)
    {
        this.fontSize = size;

        return this;
    },

    /**
     * Set the content of this BitmapText.
     *
     * An array of strings will be converted multi-line text.
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setText
     * @since 3.0.0
     *
     * @param {(string|string[])} value - The string, or array of strings, to be set as the content of this BitmapText.
     *
     * @return {Phaser.GameObjects.DynamicBitmapText} This Game Object.
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
     * Set the horizontal scroll position of this Bitmap Text.
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setScrollX
     * @since 3.0.0
     *
     * @param {number} value - The horizontal scroll position to set.
     *
     * @return {Phaser.GameObjects.DynamicBitmapText} This Game Object.
     */
    setScrollX: function (value)
    {
        this.scrollX = value;

        return this;
    },

    /**
     * Set the vertical scroll position of this Bitmap Text.
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setScrollY
     * @since 3.0.0
     *
     * @param {number} value - The vertical scroll position to set.
     *
     * @return {Phaser.GameObjects.DynamicBitmapText} This Game Object.
     */
    setScrollY: function (value)
    {
        this.scrollY = value;

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
     * @method Phaser.GameObjects.DynamicBitmapText#getTextBounds
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
     * @name Phaser.GameObjects.DynamicBitmapText#width
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
     * The height of this Bitmap Text.
     *
     * @name Phaser.GameObjects.DynamicBitmapText#height
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
     * @method Phaser.GameObjects.DynamicBitmapText#toJSON
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
            fontSize: this.fontSize
        };

        out.data = data;

        return out;
    }

});

module.exports = DynamicBitmapText;
