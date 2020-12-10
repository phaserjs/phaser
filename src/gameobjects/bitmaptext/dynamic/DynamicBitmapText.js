/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BitmapText = require('../static/BitmapText');
var Class = require('../../../utils/Class');
var Render = require('./DynamicBitmapTextRender');

/**
 * @classdesc
 * BitmapText objects work by taking a texture file and an XML or JSON file that describes the font structure.
 *
 * During rendering for each letter of the text is rendered to the display, proportionally spaced out and aligned to
 * match the font structure.
 *
 * Dynamic Bitmap Text objects are different from Static Bitmap Text in that they invoke a callback for each
 * letter being rendered during the render pass. This callback allows you to manipulate the properties of
 * each letter being rendered, such as its position, scale or tint, allowing you to create interesting effects
 * like jiggling text, which can't be done with Static text. This means that Dynamic Text takes more processing
 * time, so only use them if you require the callback ability they have.
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
 * @class DynamicBitmapText
 * @extends Phaser.GameObjects.BitmapText
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. It can only belong to one Scene at any given time.
 * @param {number} x - The x coordinate of this Game Object in world space.
 * @param {number} y - The y coordinate of this Game Object in world space.
 * @param {string} font - The key of the font to use from the Bitmap Font cache.
 * @param {(string|string[])} [text] - The string, or array of strings, to be set as the content of this Bitmap Text.
 * @param {number} [size] - The font size of this Bitmap Text.
 * @param {number} [align=0] - The alignment of the text in a multi-line BitmapText object.
 */
var DynamicBitmapText = new Class({

    Extends: BitmapText,

    Mixins: [
        Render
    ],

    initialize:

    function DynamicBitmapText (scene, x, y, font, text, size, align)
    {
        BitmapText.call(this, scene, x, y, font, text, size, align);

        this.type = 'DynamicBitmapText';

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
         * @name Phaser.GameObjects.DynamicBitmapText#displayCallback
         * @type {Phaser.Types.GameObjects.BitmapText.DisplayCallback}
         * @since 3.0.0
         */
        this.displayCallback;

        /**
         * The data object that is populated during rendering, then passed to the displayCallback.
         * You should modify this object then return it back from the callback. It's updated values
         * will be used to render the specific glyph.
         *
         * Please note that if you need a reference to this object locally in your game code then you
         * should shallow copy it, as it's updated and re-used for every glyph in the text.
         *
         * @name Phaser.GameObjects.DynamicBitmapText#callbackData
         * @type {Phaser.Types.GameObjects.BitmapText.DisplayCallbackConfig}
         * @since 3.11.0
         */
        this.callbackData = {
            parent: this,
            color: 0,
            tint: {
                topLeft: 0,
                topRight: 0,
                bottomLeft: 0,
                bottomRight: 0
            },
            index: 0,
            charCode: 0,
            x: 0,
            y: 0,
            scale: 0,
            rotation: 0,
            data: 0
        };
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
     * @return {this} This Game Object.
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
     * The callback receives a {@link Phaser.Types.GameObjects.BitmapText.DisplayCallbackConfig} object that contains information about the character that's
     * about to be rendered.
     *
     * It should return an object with `x`, `y`, `scale` and `rotation` properties that will be used instead of the
     * usual values when rendering.
     *
     * @method Phaser.GameObjects.DynamicBitmapText#setDisplayCallback
     * @since 3.0.0
     *
     * @param {Phaser.Types.GameObjects.BitmapText.DisplayCallback} callback - The display callback to set.
     *
     * @return {this} This Game Object.
     */
    setDisplayCallback: function (callback)
    {
        this.displayCallback = callback;

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
     * @return {this} This Game Object.
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
     * @return {this} This Game Object.
     */
    setScrollY: function (value)
    {
        this.scrollY = value;

        return this;
    }

});

module.exports = DynamicBitmapText;
