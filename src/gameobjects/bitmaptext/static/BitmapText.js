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
 * @typedef {object} TextBounds
 *
 * @property {object} local - [description]
 * @property {number} local.x - [description]
 * @property {number} local.y - [description]
 * @property {number} local.width - [description]
 * @property {number} local.height - [description]
 * @property {object} global - [description]
 * @property {number} global.x - [description]
 * @property {number} global.y - [description]
 * @property {number} global.width - [description]
 * @property {number} global.height - [description]
 */

/**
 * @typedef {object} JSONBitmapText
 * @extends {JSONGameObject}
 *
 * @property {string} font - [description]
 * @property {string} text - [description]
 * @property {number} fontSize - [description]
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
 * @param {string} font - [description]
 * @param {(string|string[])} [text] - [description]
 * @param {number} [size] - [description]
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
         * [description]
         *
         * @name Phaser.GameObjects.BitmapText#font
         * @type {string}
         * @since 3.0.0
         */
        this.font = font;

        var entry = this.scene.sys.cache.bitmapFont.get(font);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.BitmapText#fontData
         * @type {object}
         * @since 3.0.0
         */
        this.fontData = entry.data;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.BitmapText#text
         * @type {string}
         * @since 3.0.0
         */
        this.text = '';

        /**
         * [description]
         *
         * @name Phaser.GameObjects.BitmapText#fontSize
         * @type {number}
         * @since 3.0.0
         */
        this.fontSize = size || this.fontData.size;

        /**
         * Adds/Removes spacing between characters
         * Can be a negative or positive number
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
         * [description]
         *
         * @name Phaser.GameObjects.BitmapText#_bounds
         * @type {TextBounds}
         * @private
         * @since 3.0.0
         */
        this._bounds = this.getTextBounds();
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.BitmapText#setFontSize
     * @since 3.0.0
     *
     * @param {number} size - [description]
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
     * [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.BitmapText#getTextBounds
     * @since 3.0.0
     *
     * @param {boolean} round - [description]
     *
     * @return {TextBounds} [description]
     */
    getTextBounds: function (round)
    {
        //  local = the BitmapText based on fontSize and 0x0 coords
        //  global = the BitmapText, taking into account scale and world position

        this._bounds = GetBitmapTextSize(this, round);

        return this._bounds;
    },

    /**
     * [description]
     *
     * @name Phaser.GameObjects.BitmapText#width
     * @type {number}
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
     * [description]
     *
     * @name Phaser.GameObjects.BitmapText#height
     * @type {number}
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
     * [description]
     *
     * @method Phaser.GameObjects.BitmapText#toJSON
     * @since 3.0.0
     *
     * @return {JSONBitmapText} [description]
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
