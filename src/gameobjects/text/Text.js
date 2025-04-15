/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AddToDOM = require('../../dom/AddToDOM');
var CanvasPool = require('../../display/canvas/CanvasPool');
var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var GetTextSize = require('./GetTextSize');
var GetValue = require('../../utils/object/GetValue');
var RemoveFromDOM = require('../../dom/RemoveFromDOM');
var TextRender = require('./TextRender');
var TextStyle = require('./TextStyle');
var UUID = require('../../utils/string/UUID');

/**
 * @classdesc
 * A Text Game Object.
 *
 * Text objects work by creating their own internal hidden Canvas and then renders text to it using
 * the standard Canvas `fillText` API. It then creates a texture from this canvas which is rendered
 * to your game during the render pass.
 *
 * Because it uses the Canvas API you can take advantage of all the features this offers, such as
 * applying gradient fills to the text, or strokes, shadows and more. You can also use custom fonts
 * loaded externally, such as Google or TypeKit Web fonts.
 *
 * **Important:** The font name must be quoted if it contains certain combinations of digits or
 * special characters, either when creating the Text object, or when setting the font via `setFont`
 * or `setFontFamily`, e.g.:
 *
 * ```javascript
 * this.add.text(0, 0, 'Hello World', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
 * ```
 *
 * ```javascript
 * this.add.text(0, 0, 'Hello World', { font: '"Press Start 2P"' });
 * ```
 *
 * You can only display fonts that are currently loaded and available to the browser: therefore fonts must
 * be pre-loaded. Phaser does not do this for you, so you will require the use of a 3rd party font loader,
 * or have the fonts ready available in the CSS on the page in which your Phaser game resides.
 *
 * See {@link http://www.jordanm.co.uk/tinytype this compatibility table} for the available default fonts
 * across mobile browsers.
 *
 * A note on performance: Every time the contents of a Text object changes, i.e. changing the text being
 * displayed, or the style of the text, it needs to remake the Text canvas, and if on WebGL, re-upload the
 * new texture to the GPU. This can be an expensive operation if used often, or with large quantities of
 * Text objects in your game. If you run into performance issues you would be better off using Bitmap Text
 * instead, as it benefits from batching and avoids expensive Canvas API calls.
 *
 * @class Text
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.ComputedSize
 * @extends Phaser.GameObjects.Components.Crop
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.PostPipeline
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|string[])} text - The text this Text object will display.
 * @param {Phaser.Types.GameObjects.Text.TextStyle} style - The text style configuration object.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#Valid_family_names
 */
var Text = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.ComputedSize,
        Components.Crop,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.PostPipeline,
        Components.ScrollFactor,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        TextRender
    ],

    initialize:

    function Text (scene, x, y, text, style)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        GameObject.call(this, scene, 'Text');

        /**
         * The renderer in use by this Text object.
         *
         * @name Phaser.GameObjects.Text#renderer
         * @type {(Phaser.Renderer.Canvas.CanvasRenderer|Phaser.Renderer.WebGL.WebGLRenderer)}
         * @since 3.12.0
         */
        this.renderer = scene.sys.renderer;

        this.setPosition(x, y);
        this.setOrigin(0, 0);
        this.initPipeline();
        this.initPostPipeline(true);

        /**
         * The canvas element that the text is rendered to.
         *
         * @name Phaser.GameObjects.Text#canvas
         * @type {HTMLCanvasElement}
         * @since 3.0.0
         */
        this.canvas = CanvasPool.create(this);

        /**
         * The context of the canvas element that the text is rendered to.
         *
         * @name Phaser.GameObjects.Text#context
         * @type {CanvasRenderingContext2D}
         * @since 3.0.0
         */
        this.context;

        /**
         * The Text Style object.
         *
         * Manages the style of this Text object.
         *
         * @name Phaser.GameObjects.Text#style
         * @type {Phaser.GameObjects.TextStyle}
         * @since 3.0.0
         */
        this.style = new TextStyle(this, style);

        /**
         * Whether to automatically round line positions.
         *
         * @name Phaser.GameObjects.Text#autoRound
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.autoRound = true;

        /**
         * The Regular Expression that is used to split the text up into lines, in
         * multi-line text. By default this is `/(?:\r\n|\r|\n)/`.
         * You can change this RegExp to be anything else that you may need.
         *
         * @name Phaser.GameObjects.Text#splitRegExp
         * @type {object}
         * @since 3.0.0
         */
        this.splitRegExp = /(?:\r\n|\r|\n)/;

        /**
         * The text to display.
         *
         * @name Phaser.GameObjects.Text#_text
         * @type {string}
         * @private
         * @since 3.12.0
         */
        this._text = undefined;

        /**
         * Specify a padding value which is added to the line width and height when calculating the Text size.
         * Allows you to add extra spacing if the browser is unable to accurately determine the true font dimensions.
         *
         * @name Phaser.GameObjects.Text#padding
         * @type {Phaser.Types.GameObjects.Text.TextPadding}
         * @since 3.0.0
         */
        this.padding = { left: 0, right: 0, top: 0, bottom: 0 };

        /**
         * The width of this Text object.
         *
         * @name Phaser.GameObjects.Text#width
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.width = 1;

        /**
         * The height of this Text object.
         *
         * @name Phaser.GameObjects.Text#height
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.height = 1;

        /**
         * The line spacing value.
         * This value is added to the font height to calculate the overall line height.
         * Only has an effect if this Text object contains multiple lines of text.
         *
         * If you update this property directly, instead of using the `setLineSpacing` method, then
         * be sure to call `updateText` after, or you won't see the change reflected in the Text object.
         *
         * @name Phaser.GameObjects.Text#lineSpacing
         * @type {number}
         * @since 3.13.0
         */
        this.lineSpacing = 0;

        /**
         * Adds / Removes spacing between characters.
         * Can be a negative or positive number.
         *
         * If you update this property directly, instead of using the `setLetterSpacing` method, then
         * be sure to call `updateText` after, or you won't see the change reflected in the Text object.
         *
         * @name Phaser.GameObjects.Text#letterSpacing
         * @type {number}
         * @since 3.60.0
         */
        this.letterSpacing = 0;

        //  If resolution wasn't set, force it to 1
        if (this.style.resolution === 0)
        {
            this.style.resolution = 1;
        }

        /**
         * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
         *
         * @name Phaser.GameObjects.Text#_crop
         * @type {object}
         * @private
         * @since 3.12.0
         */
        this._crop = this.resetCropObject();

        /**
         * The internal unique key to refer to the texture in the TextureManager.
         *
         * @name Phaser.GameObjects.Text#_textureKey
         * @type {string}
         * @private
         * @since 3.80.0
         */
        this._textureKey = UUID();

        //  Create a Texture for this Text object
        this.texture = scene.sys.textures.addCanvas(this._textureKey, this.canvas);

        //  Set the context to be the CanvasTexture context
        this.context = this.texture.context;

        //  Get the frame
        this.frame = this.texture.get();

        //  Set the resolution
        this.frame.source.resolution = this.style.resolution;

        if (this.renderer && this.renderer.gl)
        {
            //  Clear the default 1x1 glTexture, as we override it later
            this.renderer.deleteTexture(this.frame.source.glTexture);

            this.frame.source.glTexture = null;
        }

        this.initRTL();

        this.setText(text);

        if (style && style.padding)
        {
            this.setPadding(style.padding);
        }

        if (style && style.lineSpacing)
        {
            this.setLineSpacing(style.lineSpacing);
        }

        if (style && style.letterSpacing)
        {
            this.setLetterSpacing(style.letterSpacing);
        }
    },

    /**
     * Initialize right to left text.
     *
     * @method Phaser.GameObjects.Text#initRTL
     * @since 3.0.0
     */
    initRTL: function ()
    {
        if (!this.style.rtl)
        {
            return;
        }

        //  Here is where the crazy starts.
        //
        //  Due to browser implementation issues, you cannot fillText BiDi text to a canvas
        //  that is not part of the DOM. It just completely ignores the direction property.

        this.canvas.dir = 'rtl';

        //  Experimental atm, but one day ...
        this.context.direction = 'rtl';

        //  Add it to the DOM, but hidden within the parent canvas.
        this.canvas.style.display = 'none';

        AddToDOM(this.canvas, this.scene.sys.canvas);

        //  And finally we set the x origin
        this.originX = 1;
    },

    /**
     * Greedy wrapping algorithm that will wrap words as the line grows longer than its horizontal
     * bounds.
     *
     * @method Phaser.GameObjects.Text#runWordWrap
     * @since 3.0.0
     *
     * @param {string} text - The text to perform word wrap detection against.
     *
     * @return {string} The text after wrapping has been applied.
     */
    runWordWrap: function (text)
    {
        var style = this.style;

        if (style.wordWrapCallback)
        {
            var wrappedLines = style.wordWrapCallback.call(style.wordWrapCallbackScope, text, this);

            if (Array.isArray(wrappedLines))
            {
                wrappedLines = wrappedLines.join('\n');
            }

            return wrappedLines;
        }
        else if (style.wordWrapWidth)
        {
            if (style.wordWrapUseAdvanced)
            {
                return this.advancedWordWrap(text, this.context, this.style.wordWrapWidth);
            }
            else
            {
                return this.basicWordWrap(text, this.context, this.style.wordWrapWidth);
            }
        }
        else
        {
            return text;
        }
    },

    /**
     * Advanced wrapping algorithm that will wrap words as the line grows longer than its horizontal
     * bounds. Consecutive spaces will be collapsed and replaced with a single space. Lines will be
     * trimmed of white space before processing. Throws an error if wordWrapWidth is less than a
     * single character.
     *
     * @method Phaser.GameObjects.Text#advancedWordWrap
     * @since 3.0.0
     *
     * @param {string} text - The text to perform word wrap detection against.
     * @param {CanvasRenderingContext2D} context - The Canvas Rendering Context.
     * @param {number} wordWrapWidth - The word wrap width.
     *
     * @return {string} The wrapped text.
     */
    advancedWordWrap: function (text, context, wordWrapWidth)
    {
        var output = '';

        // Condense consecutive spaces and split into lines
        var lines = text
            .replace(/ +/gi, ' ')
            .split(this.splitRegExp);

        var linesCount = lines.length;

        for (var i = 0; i < linesCount; i++)
        {
            var line = lines[i];
            var out = '';

            // Trim whitespace
            line = line.replace(/^ *|\s*$/gi, '');

            // If entire line is less than wordWrapWidth append the entire line and exit early
            var lineLetterSpacingWidth = line.length * this.letterSpacing;
            var lineWidth = context.measureText(line).width + lineLetterSpacingWidth;

            if (lineWidth < wordWrapWidth)
            {
                output += line + '\n';
                continue;
            }

            // Otherwise, calculate new lines
            var currentLineWidth = wordWrapWidth;

            // Split into words
            var words = line.split(' ');

            for (var j = 0; j < words.length; j++)
            {
                var word = words[j];
                var wordWithSpace = word + ' ';
                var letterSpacingWidth = wordWithSpace.length * this.letterSpacing;
                var wordWidth = context.measureText(wordWithSpace).width + letterSpacingWidth;

                if (wordWidth > currentLineWidth)
                {
                    // Break word
                    if (j === 0)
                    {
                        // Shave off letters from word until it's small enough
                        var newWord = wordWithSpace;

                        while (newWord.length)
                        {
                            newWord = newWord.slice(0, -1);
                            var newLetterSpacingWidth = newWord.length * this.letterSpacing;
                            wordWidth = context.measureText(newWord).width + newLetterSpacingWidth;

                            if (wordWidth <= currentLineWidth)
                            {
                                break;
                            }
                        }

                        // If wordWrapWidth is too small for even a single letter, shame user
                        // failure with a fatal error
                        if (!newWord.length)
                        {
                            throw new Error('wordWrapWidth < a single character');
                        }

                        // Replace current word in array with remainder
                        var secondPart = word.substr(newWord.length);

                        words[j] = secondPart;

                        // Append first piece to output
                        out += newWord;
                    }

                    // If existing word length is 0, don't include it
                    var offset = (words[j].length) ? j : j + 1;

                    // Collapse rest of sentence and remove any trailing white space
                    var remainder = words.slice(offset).join(' ').replace(/[ \n]*$/gi, '');

                    // Prepend remainder to next line
                    lines.splice(i + 1, 0, remainder);

                    linesCount = lines.length;
                    break; // Processing on this line

                    // Append word with space to output
                }
                else
                {
                    out += wordWithSpace;
                    currentLineWidth -= wordWidth;
                }
            }

            // Append processed line to output
            output += out.replace(/[ \n]*$/gi, '') + '\n';
        }

        // Trim the end of the string
        output = output.replace(/[\s|\n]*$/gi, '');

        return output;
    },

    /**
     * Greedy wrapping algorithm that will wrap words as the line grows longer than its horizontal
     * bounds. Spaces are not collapsed and whitespace is not trimmed.
     *
     * @method Phaser.GameObjects.Text#basicWordWrap
     * @since 3.0.0
     *
     * @param {string} text - The text to perform word wrap detection against.
     * @param {CanvasRenderingContext2D} context - The Canvas Rendering Context.
     * @param {number} wordWrapWidth - The word wrap width.
     *
     * @return {string} The wrapped text.
     */
    basicWordWrap: function (text, context, wordWrapWidth)
    {
        var result = '';
        var lines = text.split(this.splitRegExp);
        var lastLineIndex = lines.length - 1;
        var whiteSpaceWidth = context.measureText(' ').width;

        for (var i = 0; i <= lastLineIndex; i++)
        {
            var spaceLeft = wordWrapWidth;
            var words = lines[i].split(' ');
            var lastWordIndex = words.length - 1;

            for (var j = 0; j <= lastWordIndex; j++)
            {
                var word = words[j];
                var letterSpacingWidth = word.length * this.letterSpacing;
                var wordWidth = context.measureText(word).width + letterSpacingWidth;
                var wordWidthWithSpace = wordWidth;

                if (j < lastWordIndex)
                {
                    wordWidthWithSpace += whiteSpaceWidth;
                }

                if (wordWidthWithSpace > spaceLeft)
                {
                    // Skip printing the newline if it's the first word of the line that is greater
                    // than the word wrap width.
                    if (j > 0)
                    {
                        result += '\n';
                        spaceLeft = wordWrapWidth;
                    }
                }

                result += word;

                if (j < lastWordIndex)
                {
                    result += ' ';
                    spaceLeft -= wordWidthWithSpace;
                }
                else
                {
                    spaceLeft -= wordWidth;
                }
            }

            if (i < lastLineIndex)
            {
                result += '\n';
            }
        }

        return result;
    },

    /**
     * Runs the given text through this Text objects word wrapping and returns the results as an
     * array, where each element of the array corresponds to a wrapped line of text.
     *
     * @method Phaser.GameObjects.Text#getWrappedText
     * @since 3.0.0
     *
     * @param {string} [text] - The text for which the wrapping will be calculated. If unspecified, the Text objects current text will be used.
     *
     * @return {string[]} An array of strings with the pieces of wrapped text.
     */
    getWrappedText: function (text)
    {
        if (text === undefined) { text = this._text; }

        this.style.syncFont(this.canvas, this.context);

        var wrappedLines = this.runWordWrap(text);

        return wrappedLines.split(this.splitRegExp);
    },

    /**
     * Set the text to display.
     *
     * An array of strings will be joined with `\n` line breaks.
     *
     * @method Phaser.GameObjects.Text#setText
     * @since 3.0.0
     *
     * @param {(string|string[])} value - The string, or array of strings, to be set as the content of this Text object.
     *
     * @return {this} This Text object.
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

        if (value !== this._text)
        {
            this._text = value.toString();

            this.updateText();
        }

        return this;
    },

    /**
     * Appends the given text to the content already being displayed by this Text object.
     *
     * An array of strings will be joined with `\n` line breaks.
     *
     * @method Phaser.GameObjects.Text#appendText
     * @since 3.60.0
     *
     * @param {(string|string[])} value - The string, or array of strings, to be appended to the existing content of this Text object.
     * @param {boolean} [addCR=true] - Insert a carriage-return before the string value.
     *
     * @return {this} This Text object.
     */
    appendText: function (value, addCR)
    {
        if (addCR === undefined) { addCR = true; }

        if (!value && value !== 0)
        {
            value = '';
        }

        if (Array.isArray(value))
        {
            value = value.join('\n');
        }

        value = value.toString();

        var newText = this._text.concat((addCR) ? '\n' + value : value);

        if (newText !== this._text)
        {
            this._text = newText;

            this.updateText();
        }

        return this;
    },

    /**
     * Set the text style.
     *
     * @example
     * text.setStyle({
     *     fontSize: '64px',
     *     fontFamily: 'Arial',
     *     color: '#ffffff',
     *     align: 'center',
     *     backgroundColor: '#ff00ff'
     * });
     *
     * @method Phaser.GameObjects.Text#setStyle
     * @since 3.0.0
     *
     * @param {object} style - The style settings to set.
     *
     * @return {this} This Text object.
     */
    setStyle: function (style)
    {
        return this.style.setStyle(style);
    },

    /**
     * Set the font.
     *
     * If a string is given, the font family is set.
     *
     * If an object is given, the `fontFamily`, `fontSize` and `fontStyle`
     * properties of that object are set.
     *
     * **Important:** The font name must be quoted if it contains certain combinations of digits or
     * special characters:
     *
     * ```javascript
     * Text.setFont('"Press Start 2P"');
     * ```
     *
     * Equally, if you wish to provide a list of fallback fonts, then you should ensure they are all
     * quoted properly, too:
     *
     * ```javascript
     * Text.setFont('Georgia, "Goudy Bookletter 1911", Times, serif');
     * ```
     *
     * @method Phaser.GameObjects.Text#setFont
     * @since 3.0.0
     *
     * @param {string} font - The font family or font settings to set.
     *
     * @return {this} This Text object.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#Valid_family_names
     */
    setFont: function (font)
    {
        return this.style.setFont(font);
    },

    /**
     * Set the font family.
     *
     * **Important:** The font name must be quoted if it contains certain combinations of digits or
     * special characters:
     *
     * ```javascript
     * Text.setFont('"Press Start 2P"');
     * ```
     *
     * Equally, if you wish to provide a list of fallback fonts, then you should ensure they are all
     * quoted properly, too:
     *
     * ```javascript
     * Text.setFont('Georgia, "Goudy Bookletter 1911", Times, serif');
     * ```
     *
     * @method Phaser.GameObjects.Text#setFontFamily
     * @since 3.0.0
     *
     * @param {string} family - The font family.
     *
     * @return {this} This Text object.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/font-family#Valid_family_names
     */
    setFontFamily: function (family)
    {
        return this.style.setFontFamily(family);
    },

    /**
     * Set the font size. Can be a string with a valid CSS unit, i.e. `16px`, or a number.
     *
     * @method Phaser.GameObjects.Text#setFontSize
     * @since 3.0.0
     *
     * @param {(string|number)} size - The font size.
     *
     * @return {this} This Text object.
     */
    setFontSize: function (size)
    {
        return this.style.setFontSize(size);
    },

    /**
     * Set the font style.
     *
     * @method Phaser.GameObjects.Text#setFontStyle
     * @since 3.0.0
     *
     * @param {string} style - The font style.
     *
     * @return {this} This Text object.
     */
    setFontStyle: function (style)
    {
        return this.style.setFontStyle(style);
    },

    /**
     * Set a fixed width and height for the text.
     *
     * Pass in `0` for either of these parameters to disable fixed width or height respectively.
     *
     * @method Phaser.GameObjects.Text#setFixedSize
     * @since 3.0.0
     *
     * @param {number} width - The fixed width to set. `0` disables fixed width.
     * @param {number} height - The fixed height to set. `0` disables fixed height.
     *
     * @return {this} This Text object.
     */
    setFixedSize: function (width, height)
    {
        return this.style.setFixedSize(width, height);
    },

    /**
     * Set the background color.
     *
     * @method Phaser.GameObjects.Text#setBackgroundColor
     * @since 3.0.0
     *
     * @param {string} color - The background color.
     *
     * @return {this} This Text object.
     */
    setBackgroundColor: function (color)
    {
        return this.style.setBackgroundColor(color);
    },

    /**
     * Set the fill style to be used by the Text object.
     *
     * This can be any valid CanvasRenderingContext2D fillStyle value, such as
     * a color (in hex, rgb, rgba, hsl or named values), a gradient or a pattern.
     *
     * See the [MDN fillStyle docs](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle) for more details.
     *
     * @method Phaser.GameObjects.Text#setFill
     * @since 3.0.0
     *
     * @param {(string|CanvasGradient|CanvasPattern)} color - The text fill style. Can be any valid CanvasRenderingContext `fillStyle` value.
     *
     * @return {this} This Text object.
     */
    setFill: function (fillStyle)
    {
        return this.style.setFill(fillStyle);
    },

    /**
     * Set the text fill color.
     *
     * @method Phaser.GameObjects.Text#setColor
     * @since 3.0.0
     *
     * @param {(string|CanvasGradient|CanvasPattern)} color - The text fill color.
     *
     * @return {this} This Text object.
     */
    setColor: function (color)
    {
        return this.style.setColor(color);
    },

    /**
     * Set the stroke settings.
     *
     * @method Phaser.GameObjects.Text#setStroke
     * @since 3.0.0
     *
     * @param {(string|CanvasGradient|CanvasPattern)} color - The stroke color.
     * @param {number} thickness - The stroke thickness.
     *
     * @return {this} This Text object.
     */
    setStroke: function (color, thickness)
    {
        return this.style.setStroke(color, thickness);
    },

    /**
     * Set the shadow settings.
     *
     * @method Phaser.GameObjects.Text#setShadow
     * @since 3.0.0
     *
     * @param {number} [x=0] - The horizontal shadow offset.
     * @param {number} [y=0] - The vertical shadow offset.
     * @param {string} [color='#000'] - The shadow color.
     * @param {number} [blur=0] - The shadow blur radius.
     * @param {boolean} [shadowStroke=false] - Whether to stroke the shadow.
     * @param {boolean} [shadowFill=true] - Whether to fill the shadow.
     *
     * @return {this} This Text object.
     */
    setShadow: function (x, y, color, blur, shadowStroke, shadowFill)
    {
        return this.style.setShadow(x, y, color, blur, shadowStroke, shadowFill);
    },

    /**
     * Set the shadow offset.
     *
     * @method Phaser.GameObjects.Text#setShadowOffset
     * @since 3.0.0
     *
     * @param {number} x - The horizontal shadow offset.
     * @param {number} y - The vertical shadow offset.
     *
     * @return {this} This Text object.
     */
    setShadowOffset: function (x, y)
    {
        return this.style.setShadowOffset(x, y);
    },

    /**
     * Set the shadow color.
     *
     * @method Phaser.GameObjects.Text#setShadowColor
     * @since 3.0.0
     *
     * @param {string} color - The shadow color.
     *
     * @return {this} This Text object.
     */
    setShadowColor: function (color)
    {
        return this.style.setShadowColor(color);
    },

    /**
     * Set the shadow blur radius.
     *
     * @method Phaser.GameObjects.Text#setShadowBlur
     * @since 3.0.0
     *
     * @param {number} blur - The shadow blur radius.
     *
     * @return {this} This Text object.
     */
    setShadowBlur: function (blur)
    {
        return this.style.setShadowBlur(blur);
    },

    /**
     * Enable or disable shadow stroke.
     *
     * @method Phaser.GameObjects.Text#setShadowStroke
     * @since 3.0.0
     *
     * @param {boolean} enabled - Whether shadow stroke is enabled or not.
     *
     * @return {this} This Text object.
     */
    setShadowStroke: function (enabled)
    {
        return this.style.setShadowStroke(enabled);
    },

    /**
     * Enable or disable shadow fill.
     *
     * @method Phaser.GameObjects.Text#setShadowFill
     * @since 3.0.0
     *
     * @param {boolean} enabled - Whether shadow fill is enabled or not.
     *
     * @return {this} This Text object.
     */
    setShadowFill: function (enabled)
    {
        return this.style.setShadowFill(enabled);
    },

    /**
     * Set the width (in pixels) to use for wrapping lines. Pass in null to remove wrapping by width.
     *
     * @method Phaser.GameObjects.Text#setWordWrapWidth
     * @since 3.0.0
     *
     * @param {number | null} width - The maximum width of a line in pixels. Set to null to remove wrapping.
     * @param {boolean} [useAdvancedWrap=false] - Whether or not to use the advanced wrapping
     * algorithm. If true, spaces are collapsed and whitespace is trimmed from lines. If false,
     * spaces and whitespace are left as is.
     *
     * @return {this} This Text object.
     */
    setWordWrapWidth: function (width, useAdvancedWrap)
    {
        return this.style.setWordWrapWidth(width, useAdvancedWrap);
    },

    /**
     * Set a custom callback for wrapping lines. Pass in null to remove wrapping by callback.
     *
     * @method Phaser.GameObjects.Text#setWordWrapCallback
     * @since 3.0.0
     *
     * @param {TextStyleWordWrapCallback} callback - A custom function that will be responsible for wrapping the
     * text. It will receive two arguments: text (the string to wrap), textObject (this Text
     * instance). It should return the wrapped lines either as an array of lines or as a string with
     * newline characters in place to indicate where breaks should happen.
     * @param {object} [scope=null] - The scope that will be applied when the callback is invoked.
     *
     * @return {this} This Text object.
     */
    setWordWrapCallback: function (callback, scope)
    {
        return this.style.setWordWrapCallback(callback, scope);
    },

    /**
     * Set the alignment of the text in this Text object.
     *
     * The argument can be one of: `left`, `right`, `center` or `justify`.
     *
     * Alignment only works if the Text object has more than one line of text.
     *
     * @method Phaser.GameObjects.Text#setAlign
     * @since 3.0.0
     *
     * @param {string} [align='left'] - The text alignment for multi-line text.
     *
     * @return {this} This Text object.
     */
    setAlign: function (align)
    {
        return this.style.setAlign(align);
    },

    /**
     * Set the resolution used by this Text object.
     *
     * It allows for much clearer text on High DPI devices, at the cost of memory because it uses larger
     * internal Canvas textures for the Text.
     *
     * Therefore, please use with caution, as the more high res Text you have, the more memory it uses.
     *
     * @method Phaser.GameObjects.Text#setResolution
     * @since 3.12.0
     *
     * @param {number} value - The resolution for this Text object to use.
     *
     * @return {this} This Text object.
     */
    setResolution: function (value)
    {
        return this.style.setResolution(value);
    },

    /**
     * Sets the line spacing value.
     *
     * This value is _added_ to the height of the font when calculating the overall line height.
     * This only has an effect if this Text object consists of multiple lines of text.
     *
     * @method Phaser.GameObjects.Text#setLineSpacing
     * @since 3.13.0
     *
     * @param {number} value - The amount to add to the font height to achieve the overall line height.
     *
     * @return {this} This Text object.
     */
    setLineSpacing: function (value)
    {
        this.lineSpacing = value;

        return this.updateText();
    },

    /**
     * Sets the letter spacing value.
     *
     * This will add, or remove spacing between each character of this Text Game Object. The value can be
     * either positive or negative. Positive values increase the space between each character, whilst negative
     * values decrease it. Note that some fonts are spaced naturally closer together than others.
     *
     * Please understand that enabling this feature will cause Phaser to render each character in this Text object
     * one by one, rather than use a draw for the whole string. This makes it extremely expensive when used with
     * either long strings, or lots of strings in total. You will be better off creating bitmap font text if you
     * need to display large quantities of characters with fine control over the letter spacing.
     *
     * @method Phaser.GameObjects.Text#setLetterSpacing
     * @since 3.70.0
     *
     * @param {number} value - The amount to add to the letter width. Set to zero to disable.
     *
     * @return {this} This Text object.
     */
    setLetterSpacing: function (value)
    {
        this.letterSpacing = value;

        return this.updateText();
    },

    /**
     * Set the text padding.
     *
     * 'left' can be an object.
     *
     * If only 'left' and 'top' are given they are treated as 'x' and 'y'.
     *
     * @method Phaser.GameObjects.Text#setPadding
     * @since 3.0.0
     *
     * @param {(number|Phaser.Types.GameObjects.Text.TextPadding)} left - The left padding value, or a padding config object.
     * @param {number} [top] - The top padding value.
     * @param {number} [right] - The right padding value.
     * @param {number} [bottom] - The bottom padding value.
     *
     * @return {this} This Text object.
     */
    setPadding: function (left, top, right, bottom)
    {
        if (typeof left === 'object')
        {
            var config = left;

            //  If they specify x and/or y this applies to all
            var x = GetValue(config, 'x', null);

            if (x !== null)
            {
                left = x;
                right = x;
            }
            else
            {
                left = GetValue(config, 'left', 0);
                right = GetValue(config, 'right', left);
            }

            var y = GetValue(config, 'y', null);

            if (y !== null)
            {
                top = y;
                bottom = y;
            }
            else
            {
                top = GetValue(config, 'top', 0);
                bottom = GetValue(config, 'bottom', top);
            }
        }
        else
        {
            if (left === undefined) { left = 0; }
            if (top === undefined) { top = left; }
            if (right === undefined) { right = left; }
            if (bottom === undefined) { bottom = top; }
        }

        this.padding.left = left;
        this.padding.top = top;
        this.padding.right = right;
        this.padding.bottom = bottom;

        return this.updateText();
    },

    /**
     * Set the maximum number of lines to draw.
     *
     * @method Phaser.GameObjects.Text#setMaxLines
     * @since 3.0.0
     *
     * @param {number} [max=0] - The maximum number of lines to draw.
     *
     * @return {this} This Text object.
     */
    setMaxLines: function (max)
    {
        return this.style.setMaxLines(max);
    },

    /**
     * Render text from right-to-left or left-to-right.
     *
     * @method Phaser.GameObjects.Text#setRTL
     * @since 3.70.0
     *
     * @param {boolean} [rtl=true] - Set to `true` to render from right-to-left.
     *
     * @return {this} This Text object.
     */
    setRTL: function (rtl)
    {
        if (rtl === undefined) { rtl = true; }

        var style = this.style;

        if (style.rtl === rtl)
        {
            return this;
        }

        style.rtl = rtl;

        if (rtl)
        {
            this.canvas.dir = 'rtl';
            this.context.direction = 'rtl';
            this.canvas.style.display = 'none';

            AddToDOM(this.canvas, this.scene.sys.canvas);
        }
        else
        {
            this.canvas.dir = 'ltr';
            this.context.direction = 'ltr';
        }

        if (style.align === 'left')
        {
            style.align = 'right';
        }
        else if (style.align === 'right')
        {
            style.align = 'left';
        }

        return this;
    },

    /**
     * Update the displayed text.
     *
     * @method Phaser.GameObjects.Text#updateText
     * @since 3.0.0
     *
     * @return {this} This Text object.
     */
    updateText: function ()
    {
        var canvas = this.canvas;
        var context = this.context;
        var style = this.style;
        var resolution = style.resolution;
        var size = style.metrics;

        style.syncFont(canvas, context);

        var outputText = this._text;

        if (style.wordWrapWidth || style.wordWrapCallback)
        {
            outputText = this.runWordWrap(this._text);
        }

        //  Split text into lines
        var lines = outputText.split(this.splitRegExp);

        var textSize = GetTextSize(this, size, lines);

        var padding = this.padding;

        var textWidth;

        if (style.fixedWidth === 0)
        {
            this.width = textSize.width + padding.left + padding.right;

            textWidth = textSize.width;
        }
        else
        {
            this.width = style.fixedWidth;

            textWidth = this.width - padding.left - padding.right;

            if (textWidth < textSize.width)
            {
                textWidth = textSize.width;
            }
        }

        if (style.fixedHeight === 0)
        {
            this.height = textSize.height + padding.top + padding.bottom;
        }
        else
        {
            this.height = style.fixedHeight;
        }

        var w = this.width;
        var h = this.height;

        this.updateDisplayOrigin();

        w *= resolution;
        h *= resolution;

        w = Math.max(w, 1);
        h = Math.max(h, 1);

        if (canvas.width !== w || canvas.height !== h)
        {
            canvas.width = w;
            canvas.height = h;

            this.frame.setSize(w, h);

            //  Because resizing the canvas resets the context
            style.syncFont(canvas, context);

            if (style.rtl)
            {
                context.direction = 'rtl';
            }
        }
        else
        {
            context.clearRect(0, 0, w, h);
        }

        context.save();

        context.scale(resolution, resolution);

        if (style.backgroundColor)
        {
            context.fillStyle = style.backgroundColor;
            context.fillRect(0, 0, w, h);
        }

        style.syncStyle(canvas, context);

        //  Apply padding
        context.translate(padding.left, padding.top);

        var linePositionX;
        var linePositionY;

        //  Draw text line by line
        for (var i = 0; i < textSize.lines; i++)
        {
            linePositionX = style.strokeThickness / 2;
            linePositionY = (style.strokeThickness / 2 + i * textSize.lineHeight) + size.ascent;

            if (i > 0)
            {
                linePositionY += (textSize.lineSpacing * i);
            }

            if (style.rtl)
            {
                linePositionX = w - linePositionX - padding.left - padding.right;
            }
            else if (style.align === 'right')
            {
                linePositionX += textWidth - textSize.lineWidths[i];
            }
            else if (style.align === 'center')
            {
                linePositionX += (textWidth - textSize.lineWidths[i]) / 2;
            }
            else if (style.align === 'justify')
            {
                //  To justify text line its width must be no less than 85% of defined width
                var minimumLengthToApplyJustification = 0.85;

                if (textSize.lineWidths[i] / textSize.width >= minimumLengthToApplyJustification)
                {
                    var extraSpace = textSize.width - textSize.lineWidths[i];
                    var spaceSize = context.measureText(' ').width;
                    var trimmedLine = lines[i].trim();
                    var array = trimmedLine.split(' ');

                    extraSpace += (lines[i].length - trimmedLine.length) * spaceSize;

                    var extraSpaceCharacters = Math.floor(extraSpace / spaceSize);
                    var idx = 0;

                    while (extraSpaceCharacters > 0)
                    {
                        array[idx] += ' ';
                        idx = (idx + 1) % (array.length - 1 || 1);
                        --extraSpaceCharacters;
                    }

                    lines[i] = array.join(' ');
                }
            }

            if (this.autoRound)
            {
                linePositionX = Math.round(linePositionX);
                linePositionY = Math.round(linePositionY);
            }

            var letterSpacing = this.letterSpacing;

            // Apply stroke to the whole line only if there's no custom letter spacing

            if (style.strokeThickness && letterSpacing === 0)
            {
                style.syncShadow(context, style.shadowStroke);

                context.strokeText(lines[i], linePositionX, linePositionY);
            }

            if (style.color)
            {
                style.syncShadow(context, style.shadowFill);

                // Looping fillText could be an expensive operation, we should ignore it if it is not needed

                if (letterSpacing !== 0)
                {
                    var charPositionX = 0;

                    var line = lines[i].split('');

                    //  Draw text letter by letter
                    for (var l = 0; l < line.length; l++)
                    {
                        if (style.strokeThickness)
                        {
                            style.syncShadow(context, style.shadowStroke);

                            context.strokeText(line[l], linePositionX + charPositionX, linePositionY);

                            style.syncShadow(context, style.shadowFill);
                        }

                        context.fillText(line[l], linePositionX + charPositionX, linePositionY);

                        charPositionX += context.measureText(line[l]).width + letterSpacing;
                    }
                }
                else
                {
                    context.fillText(lines[i], linePositionX, linePositionY);
                }
            }
        }

        context.restore();

        if (this.renderer && this.renderer.gl)
        {
            this.frame.source.glTexture = this.renderer.canvasToTexture(canvas, this.frame.source.glTexture, true);

            if (typeof WEBGL_DEBUG)
            {
                this.frame.glTexture.spectorMetadata = { textureKey: 'Text Game Object' };
            }
        }

        var input = this.input;

        if (input && !input.customHitArea)
        {
            input.hitArea.width = this.width;
            input.hitArea.height = this.height;
        }

        return this;
    },

    /**
     * Get the current text metrics.
     *
     * @method Phaser.GameObjects.Text#getTextMetrics
     * @since 3.0.0
     *
     * @return {Phaser.Types.GameObjects.Text.TextMetrics} The text metrics.
     */
    getTextMetrics: function ()
    {
        return this.style.getTextMetrics();
    },

    /**
     * The text string being rendered by this Text Game Object.
     *
     * @name Phaser.GameObjects.Text#text
     * @type {string}
     * @since 3.0.0
     */
    text: {

        get: function ()
        {
            return this._text;
        },

        set: function (value)
        {
            this.setText(value);
        }

    },

    /**
     * Build a JSON representation of the Text object.
     *
     * @method Phaser.GameObjects.Text#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.GameObjects.JSONGameObject} A JSON representation of the Text object.
     */
    toJSON: function ()
    {
        var out = Components.ToJSON(this);

        //  Extra Text data is added here

        var data = {
            autoRound: this.autoRound,
            text: this._text,
            style: this.style.toJSON(),
            padding: {
                left: this.padding.left,
                right: this.padding.right,
                top: this.padding.top,
                bottom: this.padding.bottom
            }
        };

        out.data = data;

        return out;
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.Text#preDestroy
     * @protected
     * @since 3.0.0
     */
    preDestroy: function ()
    {
        RemoveFromDOM(this.canvas);

        CanvasPool.remove(this.canvas);

        var texture = this.texture;

        if (texture)
        {
            texture.destroy();
        }
    }

    /**
     * The horizontal origin of this Game Object.
     * The origin maps the relationship between the size and position of the Game Object.
     * The default value is 0.5, meaning all Game Objects are positioned based on their center.
     * Setting the value to 0 means the position now relates to the left of the Game Object.
     *
     * @name Phaser.GameObjects.Text#originX
     * @type {number}
     * @default 0
     * @since 3.0.0
     */

    /**
     * The vertical origin of this Game Object.
     * The origin maps the relationship between the size and position of the Game Object.
     * The default value is 0.5, meaning all Game Objects are positioned based on their center.
     * Setting the value to 0 means the position now relates to the top of the Game Object.
     *
     * @name Phaser.GameObjects.Text#originY
     * @type {number}
     * @default 0
     * @since 3.0.0
     */

});

module.exports = Text;
