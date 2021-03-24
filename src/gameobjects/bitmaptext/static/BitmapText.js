/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Clamp = require('../../../math/Clamp');
var Components = require('../../components');
var GameObject = require('../../GameObject');
var GetBitmapTextSize = require('../GetBitmapTextSize');
var ParseFromAtlas = require('../ParseFromAtlas');
var ParseXMLBitmapFont = require('../ParseXMLBitmapFont');
var Rectangle = require('../../../geom/rectangle/Rectangle');
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
 * @param {number} [align=0] - The alignment of the text in a multi-line BitmapText object.
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

        if (!entry)
        {
            console.warn('Invalid BitmapText key: ' + font);
        }

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
         * @type {number}
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

        /**
         * Internal array holding the character tint color data.
         *
         * @name Phaser.GameObjects.BitmapText#charColors
         * @type {array}
         * @private
         * @since 3.50.0
         */
        this.charColors = [];

        /**
         * The horizontal offset of the drop shadow.
         *
         * You can set this directly, or use `Phaser.GameObjects.BitmapText#setDropShadow`.
         *
         * @name Phaser.GameObjects.BitmapText#dropShadowX
         * @type {number}
         * @since 3.50.0
         */
        this.dropShadowX = 0;

        /**
         * The vertical offset of the drop shadow.
         *
         * You can set this directly, or use `Phaser.GameObjects.BitmapText#setDropShadow`.
         *
         * @name Phaser.GameObjects.BitmapText#dropShadowY
         * @type {number}
         * @since 3.50.0
         */
        this.dropShadowY = 0;

        /**
         * The color of the drop shadow.
         *
         * You can set this directly, or use `Phaser.GameObjects.BitmapText#setDropShadow`.
         *
         * @name Phaser.GameObjects.BitmapText#dropShadowColor
         * @type {number}
         * @since 3.50.0
         */
        this.dropShadowColor = 0x000000;

        /**
         * The alpha value of the drop shadow.
         *
         * You can set this directly, or use `Phaser.GameObjects.BitmapText#setDropShadow`.
         *
         * @name Phaser.GameObjects.BitmapText#dropShadowAlpha
         * @type {number}
         * @since 3.50.0
         */
        this.dropShadowAlpha = 0.5;

        /**
         * Indicates whether the font texture is from an atlas or not.
         *
         * @name Phaser.GameObjects.BitmapText#fromAtlas
         * @type {boolean}
         * @since 3.54.0
         * @readonly
         */
        this.fromAtlas = entry.fromAtlas;

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
     * Sets a drop shadow effect on this Bitmap Text.
     *
     * This is a WebGL only feature and only works with Static Bitmap Text, not Dynamic.
     *
     * You can set the vertical and horizontal offset of the shadow, as well as the color and alpha.
     *
     * Once a shadow has been enabled you can modify the `dropShadowX` and `dropShadowY` properties of this
     * Bitmap Text directly to adjust the position of the shadow in real-time.
     *
     * If you wish to clear the shadow, call this method with no parameters specified.
     *
     * @method Phaser.GameObjects.BitmapText#setDropShadow
     * @webglOnly
     * @since 3.50.0
     *
     * @param {number} [x=0] - The horizontal offset of the drop shadow.
     * @param {number} [y=0] - The vertical offset of the drop shadow.
     * @param {number} [color=0x000000] - The color of the drop shadow, given as a hex value, i.e. `0x000000` for black.
     * @param {number} [alpha=0.5] - The alpha of the drop shadow, given as a float between 0 and 1. This is combined with the Bitmap Text alpha as well.
     *
     * @return {this} This BitmapText Object.
     */
    setDropShadow: function (x, y, color, alpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (color === undefined) { color = 0x000000; }
        if (alpha === undefined) { alpha = 0.5; }

        this.dropShadowX = x;
        this.dropShadowY = y;
        this.dropShadowColor = color;
        this.dropShadowAlpha = alpha;

        return this;
    },

    /**
     * Sets a tint on a range of characters in this Bitmap Text, starting from the `start` parameter index
     * and running for `length` quantity of characters.
     *
     * The `start` parameter can be negative. In this case, it starts at the end of the text and counts
     * backwards `start` places.
     *
     * You can also pass in -1 as the `length` and it will tint all characters from `start`
     * up until the end of the string.

     * Remember that spaces and punctuation count as characters.
     *
     * This is a WebGL only feature and only works with Static Bitmap Text, not Dynamic.
     *
     * The tint works by taking the pixel color values from the Bitmap Text texture, and then
     * multiplying it by the color value of the tint. You can provide either one color value,
     * in which case the whole character will be tinted in that color. Or you can provide a color
     * per corner. The colors are blended together across the extent of the character range.
     *
     * To swap this from being an additive tint to a fill based tint, set the `tintFill` parameter to `true`.
     *
     * To modify the tint color once set, call this method again with new color values.
     *
     * Using `setWordTint` can override tints set by this function, and vice versa.
     *
     * To remove a tint call this method with just the `start`, and optionally, the `length` parameters defined.
     *
     * @method Phaser.GameObjects.BitmapText#setCharacterTint
     * @webglOnly
     * @since 3.50.0
     *
     * @param {number} [start=0] - The starting character to begin the tint at. If negative, it counts back from the end of the text.
     * @param {number} [length=1] - The number of characters to tint. Remember that spaces count as a character too. Pass -1 to tint all characters from `start` onwards.
     * @param {boolean} [tintFill=false] - Use a fill-based tint (true), or an additive tint (false)
     * @param {number} [topLeft=0xffffff] - The tint being applied to the top-left of the character. If not other values are given this value is applied evenly, tinting the whole character.
     * @param {number} [topRight] - The tint being applied to the top-right of the character.
     * @param {number} [bottomLeft] - The tint being applied to the bottom-left of the character.
     * @param {number} [bottomRight] - The tint being applied to the bottom-right of the character.
     *
     * @return {this} This BitmapText Object.
     */
    setCharacterTint: function (start, length, tintFill, topLeft, topRight, bottomLeft, bottomRight)
    {
        if (start === undefined) { start = 0; }
        if (length === undefined) { length = 1; }
        if (tintFill === undefined) { tintFill = false; }
        if (topLeft === undefined) { topLeft = -1; }

        if (topRight === undefined)
        {
            topRight = topLeft;
            bottomLeft = topLeft;
            bottomRight = topLeft;
        }

        var len = this.text.length;

        if (length === -1)
        {
            length = len;
        }

        if (start < 0)
        {
            start = len + start;
        }

        start = Clamp(start, 0, len - 1);

        var end = Clamp(start + length, start, len);

        var charColors = this.charColors;

        for (var i = start; i < end; i++)
        {
            var color = charColors[i];

            if (topLeft === -1)
            {
                charColors[i] = null;
            }
            else
            {
                var tintEffect = (tintFill) ? 1 : 0;

                if (color)
                {
                    color.tintEffect = tintEffect;
                    color.tintTL = topLeft;
                    color.tintTR = topRight;
                    color.tintBL = bottomLeft;
                    color.tintBR = bottomRight;
                }
                else
                {
                    charColors[i] = {
                        tintEffect: tintEffect,
                        tintTL: topLeft,
                        tintTR: topRight,
                        tintBL: bottomLeft,
                        tintBR: bottomRight
                    };
                }
            }
        }

        return this;
    },

    /**
     * Sets a tint on a matching word within this Bitmap Text.
     *
     * The `word` parameter can be either a string or a number.
     *
     * If a string, it will run a string comparison against the text contents, and if matching,
     * it will tint the whole word.
     *
     * If a number, if till that word, based on its offset within the text contents.
     *
     * The `count` parameter controls how many words are replaced. Pass in -1 to replace them all.
     *
     * This parameter is ignored if you pass a number as the `word` to be searched for.
     *
     * This is a WebGL only feature and only works with Static Bitmap Text, not Dynamic.
     *
     * The tint works by taking the pixel color values from the Bitmap Text texture, and then
     * multiplying it by the color value of the tint. You can provide either one color value,
     * in which case the whole character will be tinted in that color. Or you can provide a color
     * per corner. The colors are blended together across the extent of the character range.
     *
     * To swap this from being an additive tint to a fill based tint, set the `tintFill` parameter to `true`.
     *
     * To modify the tint color once set, call this method again with new color values.
     *
     * Using `setCharacterTint` can override tints set by this function, and vice versa.
     *
     * @method Phaser.GameObjects.BitmapText#setWordTint
     * @webglOnly
     * @since 3.50.0
     *
     * @param {(string|number)} word - The word to search for. Either a string, or an index of the word in the words array.
     * @param {number} [count=1] - The number of matching words to tint. Pass -1 to tint all matching words.
     * @param {boolean} [tintFill=false] - Use a fill-based tint (true), or an additive tint (false)
     * @param {number} [topLeft=0xffffff] - The tint being applied to the top-left of the word. If not other values are given this value is applied evenly, tinting the whole word.
     * @param {number} [topRight] - The tint being applied to the top-right of the word.
     * @param {number} [bottomLeft] - The tint being applied to the bottom-left of the word.
     * @param {number} [bottomRight] - The tint being applied to the bottom-right of the word.
     *
     * @return {this} This BitmapText Object.
     */
    setWordTint: function (word, count, tintFill, topLeft, topRight, bottomLeft, bottomRight)
    {
        if (count === undefined) { count = 1; }

        var bounds = this.getTextBounds();

        var words = bounds.words;

        var wordIsNumber = (typeof(word) === 'number');

        var total = 0;

        for (var i = 0; i < words.length; i++)
        {
            var lineword = words[i];

            if ((wordIsNumber && i === word) || (!wordIsNumber && lineword.word === word))
            {
                this.setCharacterTint(lineword.i, lineword.word.length, tintFill, topLeft, topRight, bottomLeft, bottomRight);

                total++;

                if (total === count)
                {
                    return this;
                }
            }
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
     * @param {boolean} [round=false] - Whether to round the results up to the nearest integer.
     *
     * @return {Phaser.Types.GameObjects.BitmapText.BitmapTextSize} An object that describes the size of this Bitmap Text.
     */
    getTextBounds: function (round)
    {
        //  local = The BitmapText based on fontSize and 0x0 coords
        //  global = The BitmapText, taking into account scale and world position
        //  lines = The BitmapText line data

        var bounds = this._bounds;

        if (this._dirty || round || this.scaleX !== bounds.scaleX || this.scaleY !== bounds.scaleY)
        {
            GetBitmapTextSize(this, round, true, bounds);

            this._dirty = false;
        }

        return bounds;
    },

    /**
     * Gets the character located at the given x/y coordinate within this Bitmap Text.
     *
     * The coordinates you pass in are translated into the local space of the
     * Bitmap Text, however, it is up to you to first translate the input coordinates to world space.
     *
     * If you wish to use this in combination with an input event, be sure
     * to pass in `Pointer.worldX` and `worldY` so they are in world space.
     *
     * In some cases, based on kerning, characters can overlap. When this happens,
     * the first character in the word is returned.
     *
     * Note that this does not work for DynamicBitmapText if you have changed the
     * character positions during render. It will only scan characters in their un-translated state.
     *
     * @method Phaser.GameObjects.BitmapText#getCharacterAt
     * @since 3.50.0
     *
     * @param {number} x - The x position to check.
     * @param {number} y - The y position to check.
     * @param {Phaser.Cameras.Scene2D.Camera} [camera] - The Camera which is being tested against. If not given will use the Scene default camera.
     *
     * @return {Phaser.Types.GameObjects.BitmapText.BitmapTextCharacter} The character object at the given position, or `null`.
     */
    getCharacterAt: function (x, y, camera)
    {
        var point = this.getLocalPoint(x, y, null, camera);

        var bounds = this.getTextBounds();

        var chars = bounds.characters;

        var tempRect = new Rectangle();

        for (var i = 0; i < chars.length; i++)
        {
            var char = chars[i];

            tempRect.setTo(char.x, char.t, char.r - char.x, char.b);

            if (tempRect.contains(point.x, point.y))
            {
                return char;
            }
        }

        return null;
    },

    /**
     * Updates the Display Origin cached values internally stored on this Game Object.
     * You don't usually call this directly, but it is exposed for edge-cases where you may.
     *
     * @method Phaser.GameObjects.BitmapText#updateDisplayOrigin
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    updateDisplayOrigin: function ()
    {
        this._dirty = true;

        this.getTextBounds(false);

        return this;
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
     * @param {number} [align=0] - The alignment of the text in a multi-line BitmapText object. If not specified the current alignment will be used.
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
                this.fromAtlas = entry.fromAtlas === true;

                this.setTexture(entry.texture, entry.frame);

                GetBitmapTextSize(this, false, true, this._bounds);
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
     * @type {number}
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
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.BitmapText#preDestroy
     * @protected
     * @since 3.50.0
     */
    preDestroy: function ()
    {
        this.charColors.length = 0;
        this._bounds = null;
        this.fontData = null;
    }

});

/**
 * Left align the text characters in a multi-line BitmapText object.
 *
 * @name Phaser.GameObjects.BitmapText.ALIGN_LEFT
 * @type {number}
 * @since 3.11.0
 */
BitmapText.ALIGN_LEFT = 0;

/**
 * Center align the text characters in a multi-line BitmapText object.
 *
 * @name Phaser.GameObjects.BitmapText.ALIGN_CENTER
 * @type {number}
 * @since 3.11.0
 */
BitmapText.ALIGN_CENTER = 1;

/**
 * Right align the text characters in a multi-line BitmapText object.
 *
 * @name Phaser.GameObjects.BitmapText.ALIGN_RIGHT
 * @type {number}
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
 * @param {number} [xSpacing] - The x-axis spacing to add between each letter.
 * @param {number} [ySpacing] - The y-axis spacing to add to the line height.
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
 * @param {Phaser.Textures.Frame} frame - The texture frame to take into account when creating the uv data.
 * @param {number} [xSpacing=0] - The x-axis spacing to add between each letter.
 * @param {number} [ySpacing=0] - The y-axis spacing to add to the line height.
 *
 * @return {Phaser.Types.GameObjects.BitmapText.BitmapFontData} The parsed Bitmap Font data.
 */
BitmapText.ParseXMLBitmapFont = ParseXMLBitmapFont;

module.exports = BitmapText;
