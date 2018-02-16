/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var AddToDOM = require('../../../dom/AddToDOM');
var CanvasPool = require('../../../display/canvas/CanvasPool');
var Class = require('../../../utils/Class');
var Components = require('../../components');
var GameObject = require('../../GameObject');
var GetTextSize = require('../GetTextSize');
var GetValue = require('../../../utils/object/GetValue');
var RemoveFromDOM = require('../../../dom/RemoveFromDOM');
var TextRender = require('./TextRender');
var TextStyle = require('../TextStyle');

/**
 * @classdesc
 * [description]
 *
 * @class Text
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
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
 * @param {string|string[]} text - The text this Text object will display.
 * @param {object} style - The text style configuration object.
 */
var Text = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
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

        this.setPosition(x, y);
        this.setOrigin(0, 0);
        this.initPipeline('TextureTintPipeline');

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
         * [description]
         *
         * @name Phaser.GameObjects.Text#style
         * @type {Phaser.GameObjects.Components.TextStyle}
         * @since 3.0.0
         */
        this.style = new TextStyle(this, style);

        /**
         * [description]
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
         * [description]
         *
         * @name Phaser.GameObjects.Text#text
         * @type {string}
         * @since 3.0.0
         */
        this.text = '';

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Text#resolution
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.resolution = 1;

        /**
         * Specify a padding value which is added to the line width and height when calculating the Text size.
         * Allows you to add extra spacing if the browser is unable to accurately determine the true font dimensions.
         *
         * @name Phaser.GameObjects.Text#padding
         * @type {object}
         * @since 3.0.0
         */
        this.padding = { left: 0, right: 0, top: 0, bottom: 0 };

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Text#width
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.width = 1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Text#height
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.height = 1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Text#canvasTexture
         * @type {?[type]}
         * @default null
         * @since 3.0.0
         */
        this.canvasTexture = null;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Text#dirty
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.dirty = false;

        this.initRTL();

        if (style && style.padding)
        {
            this.setPadding(style.padding);
        }

        this.setText(text);

        var _this = this;

        scene.sys.game.renderer.onContextRestored(function ()
        {
            _this.canvasTexture = null;
            _this.dirty = true;
        });
    },

    /**
     * [description]
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
     * @param {CanvasRenderingContext2D} context - [description]
     * @param {number} wordWrapWidth - [description]
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
     * @param {CanvasRenderingContext2D} context - [description]
     * @param {number} wordWrapWidth - [description]
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
                    result += words[j] + ' ';
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
        if (text === undefined) { text = this.text; }

        var wrappedLines = this.runWordWrap(text);

        return wrappedLines.split(this.splitRegExp);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setText
     * @since 3.0.0
     *
     * @param {string|string[]} value - The text to set.
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setText: function (value)
    {
        if (!value)
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

            this.updateText();
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setStyle
     * @since 3.0.0
     *
     * @param {object} style - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setStyle: function (style)
    {
        return this.style.setStyle(style);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setFont
     * @since 3.0.0
     *
     * @param {string} font - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setFont: function (font)
    {
        return this.style.setFont(font);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setFontFamily
     * @since 3.0.0
     *
     * @param {string} family - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setFontFamily: function (family)
    {
        return this.style.setFontFamily(family);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setFontSize
     * @since 3.0.0
     *
     * @param {number} size - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setFontSize: function (size)
    {
        return this.style.setFontSize(size);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setFontStyle
     * @since 3.0.0
     *
     * @param {string} style - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setFontStyle: function (style)
    {
        return this.style.setFontStyle(style);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setFixedSize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setFixedSize: function (width, height)
    {
        return this.style.setFixedSize(width, height);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setBackgroundColor
     * @since 3.0.0
     *
     * @param {string} color - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setBackgroundColor: function (color)
    {
        return this.style.setBackgroundColor(color);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setFill
     * @since 3.0.0
     *
     * @param {string} color - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setFill: function (color)
    {
        return this.style.setFill(color);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setColor
     * @since 3.0.0
     *
     * @param {string} color - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setColor: function (color)
    {
        return this.style.setColor(color);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setStroke
     * @since 3.0.0
     *
     * @param {string} color - [description]
     * @param {number} thickness - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setStroke: function (color, thickness)
    {
        return this.style.setStroke(color, thickness);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setShadow
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {string} color - [description]
     * @param {number} blur - [description]
     * @param {boolean} shadowStroke - [description]
     * @param {boolean} shadowFill - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setShadow: function (x, y, color, blur, shadowStroke, shadowFill)
    {
        return this.style.setShadow(x, y, color, blur, shadowStroke, shadowFill);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setShadowOffset
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setShadowOffset: function (x, y)
    {
        return this.style.setShadowOffset(x, y);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setShadowColor
     * @since 3.0.0
     *
     * @param {string} color - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setShadowColor: function (color)
    {
        return this.style.setShadowColor(color);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setShadowBlur
     * @since 3.0.0
     *
     * @param {number} blur - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setShadowBlur: function (blur)
    {
        return this.style.setShadowBlur(blur);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setShadowStroke
     * @since 3.0.0
     *
     * @param {boolean} enabled - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setShadowStroke: function (enabled)
    {
        return this.style.setShadowStroke(enabled);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#setShadowFill
     * @since 3.0.0
     *
     * @param {boolean} enabled - [description]
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
     * @param {number|null} width - The maximum width of a line in pixels. Set to null to remove wrapping.
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
     * @param {function} callback - A custom function that will be responsible for wrapping the
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
     * [description]
     *
     * @method Phaser.GameObjects.Text#setAlign
     * @since 3.0.0
     *
     * @param {string} align - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setAlign: function (align)
    {
        return this.style.setAlign(align);
    },

    /**
     * 'left' can be an object.
     * If only 'left' and 'top' are given they are treated as 'x' and 'y'
     *
     * @method Phaser.GameObjects.Text#setPadding
     * @since 3.0.0
     *
     * @param {number|object} left - [description]
     * @param {number} top - [description]
     * @param {number} right - [description]
     * @param {number} bottom - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.Text#setMaxLines
     * @since 3.0.0
     *
     * @param {integer} [max=0] - [description]
     *
     * @return {Phaser.GameObjects.Text} This Text object.
     */
    setMaxLines: function (max)
    {
        return this.style.setMaxLines(max);
    },

    /**
     * [description]
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
        var resolution = this.resolution;
        var size = style.metrics;

        style.syncFont(canvas, context);

        var outputText = this.text;

        if (style.wordWrapWidth || style.wordWrapCallback)
        {
            outputText = this.runWordWrap(this.text);
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
            style.syncFont(canvas, context); // Resizing resets the context
        }
        else
        {
            context.clearRect(0, 0, w, h);
        }

        context.save();

        // context.scale(resolution, resolution);

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

        this.dirty = true;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#getTextMetrics
     * @since 3.0.0
     *
     * @return {object} [description]
     */
    getTextMetrics: function ()
    {
        return this.style.getTextMetrics();
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Text#toJSON
     * @since 3.0.0
     *
     * @return {object} [description]
     */
    toJSON: function ()
    {
        var out = Components.ToJSON(this);

        //  Extra Text data is added here

        var data = {
            autoRound: this.autoRound,
            text: this.text,
            style: this.style.toJSON(),
            resolution: this.resolution,
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
     * [description]
     *
     * @method Phaser.GameObjects.Text#preDestroy
     * @since 3.0.0
     */
    preDestroy: function ()
    {
        if (this.style.rtl)
        {
            RemoveFromDOM(this.canvas);
        }

        CanvasPool.remove(this.canvas);
    }

});

module.exports = Text;
