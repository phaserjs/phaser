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

var Text = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Flip,
        Components.GetBounds,
        Components.Origin,
        Components.RenderTarget,
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

        /**
         * @property {HTMLCanvasElement} canvas - The canvas element that the text is rendered.
         */
        this.canvas = CanvasPool.create(this);

        /**
         * @property {HTMLCanvasElement} context - The context of the canvas element that the text is rendered to.
         */
        this.context = this.canvas.getContext('2d');

        this.style = new TextStyle(this, style);

        this.autoRound = true;

        /**
         * The Regular Expression that is used to split the text up into lines, in
         * multi-line text. By default this is `/(?:\r\n|\r|\n)/`.
         * You can change this RegExp to be anything else that you may need.
         * @property {Object} splitRegExp
         */
        this.splitRegExp = /(?:\r\n|\r|\n)/;

        //  This is populated in this.setText
        this.text = '';

        this.resolution = 1;

        /**
        * Specify a padding value which is added to the line width and height when calculating the Text size.
        * Allows you to add extra spacing if the browser is unable to accurately determine the true font dimensions.
        * @property {Phaser.Point} padding
        */
        this.padding = { left: 0, right: 0, top: 0, bottom: 0 };

        this.width = 1;
        this.height = 1;

        this.canvasTexture = null;
        this.dirty = false;

        this.initRTL();

        if (style && style.padding)
        {
            this.setPadding(style.padding);
        }

        this.setText(text);

        var _this = this;

        scene.sys.game.renderer.addContextRestoredCallback(function ()
        {
            _this.canvasTexture = null;
            _this.dirty = true;
        });
    },

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
     * @param {string} text - The text to perform word wrap detection against.
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
     * @param {string} text - The text to perform word wrap detection against.
     * @param {CanvasRenderingContext2D} context
     * @param {number} wordWrapWidth
     * @return {string} The wrapped text.
     */
    advancedWordWrap: function (text, context, wordWrapWidth)
    {
        var output = '';

        // condense consecutive spaces and split into lines
        var lines = text
            .replace(/ +/gi, ' ')
            .split(/\r?\n/gi);

        var linesCount = lines.length;

        for (var i = 0; i < linesCount; i++)
        {
            var line = lines[i];
            var out = '';

            // trim whitespace
            line = line.replace(/^ *|\s*$/gi, '');

            // if entire line is less than wordWrapWidth append the entire line and exit early
            var lineWidth = context.measureText(line).width;

            if (lineWidth < wordWrapWidth)
            {
                output += line + '\n';
                continue;
            }

            // otherwise, calculate new lines
            var currentLineWidth = wordWrapWidth;

            // split into words
            var words = line.split(' ');

            for (var j = 0; j < words.length; j++)
            {
                var word = words[j];
                var wordWithSpace = word + ' ';
                var wordWidth = context.measureText(wordWithSpace).width;

                if (wordWidth > currentLineWidth)
                {
                    // break word
                    if (j === 0)
                    {
                        // shave off letters from word until it's small enough
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

                        // if wordWrapWidth is too small for even a single letter, shame user
                        // failure with a fatal error
                        if (!newWord.length)
                        {
                            throw new Error('This text\'s wordWrapWidth setting is less than a single character!');
                        }

                        // replace current word in array with remainder
                        var secondPart = word.substr(newWord.length);

                        words[j] = secondPart;

                        // append first piece to output
                        out += newWord;
                    }

                    // if existing word length is 0, don't include it
                    var offset = (words[j].length) ? j : j + 1;

                    // collapse rest of sentence and remove any trailing white space
                    var remainder = words.slice(offset).join(' ')
                        .replace(/[ \n]*$/gi, '');

                    // prepend remainder to next line
                    lines[i + 1] = remainder + ' ' + (lines[i + 1] || '');
                    linesCount = lines.length;

                    break; // processing on this line

                    // append word with space to output
                }
                else
                {
                    out += wordWithSpace;
                    currentLineWidth -= wordWidth;
                }
            }

            // append processed line to output
            output += out.replace(/[ \n]*$/gi, '') + '\n';
        }

        // trim the end of the string
        output = output.replace(/[\s|\n]*$/gi, '');

        return output;
    },

    /**
     * Greedy wrapping algorithm that will wrap words as the line grows longer than its horizontal
     * bounds. Spaces are not collapsed and whitespace is not trimmed.
     *
     * @param {string} text - The text to perform word wrap detection against.
     * @param {CanvasRenderingContext2D} context
     * @param {number} wordWrapWidth
     * @return {string} The wrapped text.
     */
    basicWordWrap: function (text, context, wordWrapWidth)
    {
        var result = '';
        var lines = text.split('\n');

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
     * Runs the given text through this Text object's word wrapping and returns the results as an
     * array, where each element of the array corresponds to a wrapped line of text.
     *
     * @param {string} [text] - The text for which the wrapping will be calculated. If unspecified,
     * the Text object's current text will be used.
     * @return {array} An array of strings with the pieces of wrapped text.
     */
    getWrappedText: function (text)
    {
        if (text === undefined) { text = this.text; }

        var wrappedLines = this.runWordWrap(text);

        return wrappedLines.split(/(?:\r\n|\r|\n)/);
    },

    setText: function (value)
    {
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

    setStyle: function (style)
    {
        return this.style.setStyle(style);
    },

    setFont: function (font)
    {
        return this.style.setFont(font);
    },

    setFontFamily: function (family)
    {
        return this.style.setFontFamily(family);
    },

    setFontSize: function (size)
    {
        return this.style.setFontSize(size);
    },

    setFontStyle: function (style)
    {
        return this.style.setFontStyle(style);
    },

    setFixedSize: function (width, height)
    {
        return this.style.setFixedSize(width, height);
    },

    setBackgroundColor: function (color)
    {
        return this.style.setBackgroundColor(color);
    },

    setFill: function (color)
    {
        return this.style.setFill(color);
    },

    setColor: function (color)
    {
        return this.style.setColor(color);
    },

    setStroke: function (color, thickness)
    {
        return this.style.setStroke(color, thickness);
    },

    setShadow: function (x, y, color, blur, shadowStroke, shadowFill)
    {
        return this.style.setShadow(x, y, color, blur, shadowStroke, shadowFill);
    },

    setShadowOffset: function (x, y)
    {
        return this.style.setShadowOffset(x, y);
    },

    setShadowColor: function (color)
    {
        return this.style.setShadowColor(color);
    },

    setShadowBlur: function (blur)
    {
        return this.style.setShadowBlur(blur);
    },

    setShadowStroke: function (enabled)
    {
        return this.style.setShadowStroke(enabled);
    },

    setShadowFill: function (enabled)
    {
        return this.style.setShadowFill(enabled);
    },

    /**
     * Set the width (in pixels) to use for wrapping lines. Pass in null to remove wrapping by
     * width.
     *
     * @param {number|null} width - The maximum width of a line in pixels. Set to null to remove
     * wrapping.
     * @param {boolean} [useAdvancedWrap=false] - Whether or not to use the advanced wrapping
     * algorithm. If true, spaces are collapsed and whitespace is trimmed from lines. If false,
     * spaces and whitespace are left as is.
     * @return {this}
     */
    setWordWrapWidth: function (width, useAdvancedWrap)
    {
        return this.style.setWordWrapWidth(width, useAdvancedWrap);
    },

    /**
     * Set a custom callback for wrapping lines. Pass in null to remove wrapping by callback.
     *
     * @param {function} callback - A custom function that will be responsible for wrapping the
     * text. It will receive two arguments: text (the string to wrap), textObject (this Text
     * instance). It should return the wrapped lines either as an array of lines or as a string with
     * newline characters in place to indicate where breaks should happen.
     * @param {object} [scope=null] - The scope that will be applied when the callback is invoked.
     * @return {this}
     */
    setWordWrapCallback: function (callback, scope)
    {
        return this.style.setWordWrapCallback(callback, scope);
    },

    setAlign: function (align)
    {
        return this.style.setAlign(align);
    },

    //  'left' can be an object
    //  if only 'left' and 'top' are given they are treated as 'x' and 'y'
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

    setMaxLines: function (max)
    {
        return this.style.setMaxLines(max);
    },

    updateText: function ()
    {
        var canvas = this.canvas;
        var context = this.context;
        var style = this.style;
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

        if (!style.fixedWidth)
        {
            this.width = w;
        }

        if (!style.fixedHeight)
        {
            this.height = h;
        }

        this.updateDisplayOrigin();

        w *= this.resolution;
        h *= this.resolution;

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

    getTextMetrics: function ()
    {
        return this.style.getTextMetrics();
    },

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
