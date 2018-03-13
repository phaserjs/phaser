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
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. It can only belong to one Scene at any given time.
 * @param {number} [x=0] - The x coordinate of this Game Object in world space.
 * @param {number} [y=0] - The y coordinate of this Game Object in world space.
 * @param {string} font - [description]
 * @param {string|string[]} [text] - [description]
 * @param {number} [size] - [description]
 */
var DynamicBitmapText = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Origin,
        Components.Pipeline,
        Components.Texture,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        Render
    ],

    initialize:

    function DynamicBitmapText (scene, x, y, font, text, size)
    {
        if (text === undefined) { text = ''; }

        GameObject.call(this, scene, 'DynamicBitmapText');

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DynamicBitmapText#font
         * @type {string}
         * @since 3.0.0
         */
        this.font = font;

        var entry = this.scene.sys.cache.bitmapFont.get(font);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DynamicBitmapText#fontData
         * @type {object}
         * @since 3.0.0
         */
        this.fontData = entry.data;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DynamicBitmapText#text
         * @type {string}
         * @since 3.0.0
         */
        this.text = (Array.isArray(text)) ? text.join('\n') : text;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DynamicBitmapText#fontSize
         * @type {number}
         * @since 3.0.0
         */
        this.fontSize = size || this.fontData.size;

        this.setTexture(entry.texture, entry.frame);
        this.setPosition(x, y);
        this.setOrigin(0, 0);
        this.initPipeline('TextureTintPipeline');

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DynamicBitmapText#_bounds
         * @type {object}
         * @private
         * @since 3.0.0
         */
        this._bounds = this.getTextBounds();

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DynamicBitmapText#scrollX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.scrollX = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DynamicBitmapText#scrollY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.scrollY = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DynamicBitmapText#cropWidth
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.cropWidth = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DynamicBitmapText#cropHeight
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.cropHeight = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DynamicBitmapText#displayCallback;
         * @type {function}
         * @since 3.0.0
         */
        this.displayCallback;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setSize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setDisplayCallback
     * @since 3.0.0
     *
     * @param {function} callback - [description]
     *
     * @return {Phaser.GameObjects.DynamicBitmapText} This Game Object.
     */
    setDisplayCallback: function (callback)
    {
        this.displayCallback = callback;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setFontSize
     * @since 3.0.0
     *
     * @param {number} size - [description]
     *
     * @return {Phaser.GameObjects.DynamicBitmapText} This Game Object.
     */
    setFontSize: function (size)
    {
        this.fontSize = size;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setText
     * @since 3.0.0
     *
     * @param {string|string[]} value - The string, or array of strings, to be set as the content of this BitmapText.
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
     * [description]
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setScrollX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.DynamicBitmapText} This Game Object.
     */
    setScrollX: function (value)
    {
        this.scrollX = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setScrollY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     *
     * @return {Phaser.GameObjects.DynamicBitmapText} This Game Object.
     */
    setScrollY: function (value)
    {
        this.scrollY = value;

        return this;
    },

    // {
    //     local: {
    //         x,
    //         y,
    //         width,
    //         height
    //     },
    //     global: {
    //         x,
    //         y,
    //         width,
    //         height
    //     }
    // }

    /**
     * [description]
     *
     * @method Phaser.GameObjects.DynamicBitmapText#getTextBounds
     * @since 3.0.0
     *
     * @param {boolean} round - [description]
     *
     * @return {object} [description]
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
     * @name Phaser.GameObjects.DynamicBitmapText#width
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
     * @name Phaser.GameObjects.DynamicBitmapText#height
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
     * @method Phaser.GameObjects.DynamicBitmapText#toJSON
     * @since 3.0.0
     *
     * @return {object} [description]
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
