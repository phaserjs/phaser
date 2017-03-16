
var Class = require('../../../utils/Class');
var GameObject = require('../../GameObject');
var Components = require('../../../components');
var CanvasPool = require('../../../dom/CanvasPool');
var TextRender = require('./TextRender');
var TextStyle = require('../TextStyle');
var MeasureText = require('../MeasureText');
var GetTextSize = require('../GetTextSize');

var Text = new Class({

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.GetBounds,
        Components.Origin,
        Components.ScaleMode,
        Components.Transform,
        Components.Visible,
        TextRender
    ],

    initialize:

    function Text (state, x, y, text, style)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (text === undefined) { text = ''; }

        GameObject.call(this, state);

        this.setPosition(x, y);

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

        this.text = text;

        this.resolution = 1;

        this.padding = { x: 0, y: 0 };

        this.width = 1;
        this.height = 1;

        if (text !== '')
        {
            this.updateText();
        }
    },

    setText: function (value)
    {
        if (value !== this.text)
        {
            this.text = value;
            this.updateText();
        }

        return this;
    },

    setStyle: function (style)
    {
        return this.style.setStyle(style);
    },

    updateText: function ()
    {
        var canvas = this.canvas;
        var context = this.context;
        var style = this.style;

        var size = MeasureText(style);

        var outputText = this.text;

        // if (style.wordWrap)
        // {
        //     outputText = this.runWordWrap(this.text);
        // }

        //  Split text into lines
        var lines = outputText.split(this.splitRegExp);

        var textSize = GetTextSize(this, size, lines);

        this.width = textSize.width;
        this.height = textSize.height;

        this.updateOrigin();

        canvas.width = textSize.width * this.resolution;
        canvas.height = textSize.height * this.resolution;

        if (style.backgroundColor)
        {
            context.fillStyle = style.backgroundColor;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        style.syncToCanvas(canvas, context);

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

            if (style.align === 'right')
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
                this.style.syncShadow(style.shadowStroke);

                context.strokeText(lines[i], linePositionX, linePositionY);
            }

            if (style.fill)
            {
                this.style.syncShadow(style.shadowFill);

                context.fillText(lines[i], linePositionX, linePositionY);
            }
        }
    }

    //  Add style callback so we can chain filter effects


});

module.exports = Text;
