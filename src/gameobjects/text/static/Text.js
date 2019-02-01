/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var AddToDOM = require('../../../dom/AddToDOM');
var CanvasPool = require('../../../display/canvas/CanvasPool');
var Class = require('../../../utils/Class');
var Components = require('../../components');
var CONST = require('../../../const');
var GameObject = require('../../GameObject');
var GetTextSize = require('../GetTextSize');
var GetValue = require('../../../utils/object/GetValue');
var RemoveFromDOM = require('../../../dom/RemoveFromDOM');
var TextRender = require('./TextRender');
var TextStyle = require('../TextStyle');

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
 * **Important:** If the font you wish to use has a space or digit in its name, such as
 * 'Press Start 2P' or 'Roboto Condensed', then you _must_ put the font name in quotes, either
 * when creating the Text object, or when setting the font via `setFont` or `setFontFamily`. I.e.:
 * 
 * ```javascript
 * this.add.text(0, 0, 'Hello World', { fontFamily: '"Roboto Condensed"' });
 * ```
 * 
 * Equally, if you wish to provide a list of fallback fonts, then you should ensure they are all
 * quoted properly, too:
 * 
 * ```javascript
 * this.add.text(0, 0, 'Hello World', { fontFamily: 'Verdana, "Times New Roman", Tahoma, serif' });
 * ```
 *
 * You can only display fonts that are currently loaded and available to the browser: therefore fonts must
 * be pre-loaded. Phaser does not do ths for you, so you will require the use of a 3rd party font loader,
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
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|string[])} text - The text this Text object will display.
 * @param {object} style - The text style configuration object.
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
        Components.ScaleMode,
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
        this.renderer = scene.sys.game.renderer;

        this.setPosition(x, y);
        this.setOrigin(0, 0);
        this.initPipeline();

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
        this.context = this.canvas.getContext('2d');

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
        this._text = '';

        /**
         * Specify a padding value which is added to the line width and height when calculating the Text size.
         * Allows you to add extra spacing if the browser is unable to accurately determine the true font dimensions.
         *
         * @name Phaser.GameObjects.Text#padding
         * @type {{left:number,right:number,top:number,bottom:number}}
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
         * Whether the text or its settings have changed and need updating.
         *
         * @name Phaser.GameObjects.Text#dirty
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.dirty = false;

        //  If resolution wasn't set, then we get it from the game config
        if (this.style.resolution === 0)
        {
            this.style.resolution = scene.sys.game.config.resolution;
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

        //  Create a Texture for this Text object
        this.texture = scene.sys.textures.addCanvas(null, this.canvas, true);

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

        if (style && style.padding)
        {
            this.setPadding(style.padding);
        }

        if (style && style.lineSpacing)
        {
            this.lineSpacing = style.lineSpacing;
        }

        this.setText(text);

        if (scene.sys.game.config.renderType === CONST.WEBGL)
        {
            scene.sys.game.renderer.onContextRestored(function ()
            {
                this.dirty = true;
            }, this);
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
            var lineWidth = context.measureText(line).width;

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
                var wordWidth = context.measureText(wordWithSpace).width;

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
                            wordWidth = context.measureText(newWord).width;

                            if (wordWidth <= currentLineWidth)
                            {
                                break;
                            }
                        }

                        // If wordWrapWidth is too small for even a single letter, shame user
                        // failure with a fatal error
                        if (!newWord.length)
                        {
                            throw new Error('This text\'s wordWrapWidth setting is less than a single character!');
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
                    var remainder = words.slice(offset).join(' ')
                        .replace(/[ \n]*$/gi, '');

                    // Prepend remainder to next line
                    lines[i + 1] = remainder + ' ' + (lines[i + 1] || '');
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

        for (var i = 0; i < lines.length; i++)
        {
            var spaceLeft = wordWrapWidth;
            var words = lines[i].split(' ');

            for (var j = 0; j < words.length; j++)
            {
                var wordWidth = context.measureText(words[j]).width;
                var wordWidthWithSpace = wordWidth + context.measureText(' ').width;

                if (wordWidthWithSpace > spaceLeft)
                {
                    // Skip printing the newline if it's the first word of the line that is greater
                    // than the word wrap width.
                    if (j > 0)
                    {
                        result += '\n';
                    }

                    result += words[j] + ' ';
                    spaceLeft = wordWrapWidth - wordWidth;
                }
                else
                {
                    spaceLeft -= wordWidthWithSpace;
                    result += words[j];

                    if (j < (words.length - 1))
                    {
                        result += ' ';
                    }
                }
            }

            if (i < lines.length - 1)
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
     * @param {string} text - The text for which the wrapping will be calculated. If unspecified, the Text objects current text will be used.
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
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * **Important:** If the font you wish to use has a space or digit in its name, such as
     * 'Press Start 2P' or 'Roboto Condensed', then you _must_ put the font name in quotes:
     * 
     * ```javascript
     * Text.setFont('"Roboto Condensed"');
     * ```
     * 
     * Equally, if you wish to provide a list of fallback fonts, then you should ensure they are all
     * quoted properly, too:
     * 
     * ```javascript
     * Text.setFont('Verdana, "Times New Roman", Tahoma, serif');
     * ```
     *
     * @method Phaser.GameObjects.Text#setFont
     * @since 3.0.0
     *
     * @param {string} font - The font family or font settings to set.
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setFont: function (font)
    {
        return this.style.setFont(font);
    },

    /**
     * Set the font family.
     * 
     * **Important:** If the font you wish to use has a space or digit in its name, such as
     * 'Press Start 2P' or 'Roboto Condensed', then you _must_ put the font name in quotes:
     * 
     * ```javascript
     * Text.setFont('"Roboto Condensed"');
     * ```
     * 
     * Equally, if you wish to provide a list of fallback fonts, then you should ensure they are all
     * quoted properly, too:
     * 
     * ```javascript
     * Text.setFont('Verdana, "Times New Roman", Tahoma, serif');
     * ```
     *
     * @method Phaser.GameObjects.Text#setFontFamily
     * @since 3.0.0
     *
     * @param {string} family - The font family.
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setFontFamily: function (family)
    {
        return this.style.setFontFamily(family);
    },

    /**
     * Set the font size.
     *
     * @method Phaser.GameObjects.Text#setFontSize
     * @since 3.0.0
     *
     * @param {number} size - The font size.
     *
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @param {(string|any)} color - The text fill style. Can be any valid CanvasRenderingContext `fillStyle` value.
     *
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @param {string} color - The text fill color.
     *
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @param {string} color - The stroke color.
     * @param {number} thickness - The stroke thickness.
     *
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @param {?number} width - The maximum width of a line in pixels. Set to null to remove wrapping.
     * @param {boolean} [useAdvancedWrap=false] - Whether or not to use the advanced wrapping
     * algorithm. If true, spaces are collapsed and whitespace is trimmed from lines. If false,
     * spaces and whitespace are left as is.
     *
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setWordWrapCallback: function (callback, scope)
    {
        return this.style.setWordWrapCallback(callback, scope);
    },

    /**
     * Set the text alignment.
     *
     * Expects values like `'left'`, `'right'`, `'center'` or `'justified'`.
     *
     * @method Phaser.GameObjects.Text#setAlign
     * @since 3.0.0
     *
     * @param {string} align - The text alignment.
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setAlign: function (align)
    {
        return this.style.setAlign(align);
    },

    /**
     * Set the resolution used by this Text object.
     *
     * By default it will be set to match the resolution set in the Game Config,
     * but you can override it via this method, or by specifying it in the Text style configuration object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setLineSpacing: function (value)
    {
        this.lineSpacing = value;

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
     * @param {(number|object)} left - The left padding value, or a padding config object.
     * @param {number} top - The top padding value.
     * @param {number} right - The right padding value.
     * @param {number} bottom - The bottom padding value.
     *
     * @return {Phaser.GameObjects.Text} This Text object.
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
     * @param {integer} [max=0] - The maximum number of lines to draw.
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setMaxLines: function (max)
    {
        return this.style.setMaxLines(max);
    },

    /**
     * Update the displayed text.
     *
     * @method Phaser.GameObjects.Text#updateText
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Text} This Text object.
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

        var w = textSize.width + padding.left + padding.right;
        var h = textSize.height + padding.top + padding.bottom;

        if (style.fixedWidth === 0)
        {
            this.width = w;
        }

        if (style.fixedHeight === 0)
        {
            this.height = h;
        }

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

            style.syncFont(canvas, context); // Resizing resets the context
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

        context.textBaseline = 'alphabetic';

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
                linePositionX = w - linePositionX;
            }
            else if (style.align === 'right')
            {
                linePositionX += textSize.width - textSize.lineWidths[i];
            }
            else if (style.align === 'center')
            {
                linePositionX += (textSize.width - textSize.lineWidths[i]) / 2;
            }

            if (this.autoRound)
            {
                linePositionX = Math.round(linePositionX);
                linePositionY = Math.round(linePositionY);
            }

            if (style.strokeThickness)
            {
                this.style.syncShadow(context, style.shadowStroke);

                context.strokeText(lines[i], linePositionX, linePositionY);
            }

            if (style.color)
            {
                this.style.syncShadow(context, style.shadowFill);

                context.fillText(lines[i], linePositionX, linePositionY);
            }
        }

        context.restore();

        if (this.renderer.gl)
        {
            this.frame.source.glTexture = this.renderer.canvasToTexture(canvas, this.frame.source.glTexture, true);

            this.frame.glTexture = this.frame.source.glTexture;
        }

        this.dirty = true;

        return this;
    },

    /**
     * Get the current text metrics.
     *
     * @method Phaser.GameObjects.Text#getTextMetrics
     * @since 3.0.0
     *
     * @return {object} The text metrics.
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
     * @return {JSONGameObject} A JSON representation of the Text object.
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
        if (this.style.rtl)
        {
            RemoveFromDOM(this.canvas);
        }

        CanvasPool.remove(this.canvas);

        this.texture.destroy();
    }

});

module.exports = Text;
