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

        var outputText = this.text;

        // if (style.wordWrap)
        // {
        //     outputText = this.runWordWrap(this.text);
        // }

        //  Split text into lines
        var lines = outputText.split(this.splitRegExp);

        var textSize = GetTextSize(this, size, lines);

        var padding = this.padding;

        var w = textSize.width + padding.left + padding.right;
        var h = textSize.height + padding.top + padding.bottom;

        // console.log(textSize);
        // console.log(padding);
        // console.log(w, 'x', h);
        // console.log('');

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
        }
        else
        {
            context.clearRect(0, 0, w, h);
        }

        if (style.backgroundColor)
        {
            context.fillStyle = style.backgroundColor;
            context.fillRect(0, 0, w, h);
        }

        style.syncFont(canvas, context);

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
