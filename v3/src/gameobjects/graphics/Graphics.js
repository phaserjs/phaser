var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var Render = require('./GraphicsRender');
var Commands = require('./Commands');
var MATH_CONST = require('../../math/const');
var GetObjectValue = require('../../utils/object/GetObjectValue');

var Graphics = new Class({

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function Graphics (state, options)
    {
        var x = GetObjectValue(options, 'x', 0);
        var y = GetObjectValue(options, 'y', 0);

        GameObject.call(this, state);

        this.setPosition(x, y);

        this.commandBuffer = [];

        this.defaultFillColor = -1;
        this.defaultFillAlpha = 1;

        this.defaultStrokeWidth = 1;
        this.defaultStrokeColor = -1;
        this.defaultStrokeAlpha = 1;

        this.setDefaultStyles(options);
    },

    setDefaultStyles: function (options)
    {
        if (GetObjectValue(options, 'lineStyle', null))
        {
            this.defaultStrokeWidth = GetObjectValue(options, 'lineStyle.width', 1);
            this.defaultStrokeColor = GetObjectValue(options, 'lineStyle.color', 0xffffff);
            this.defaultStrokeAlpha = GetObjectValue(options, 'lineStyle.alpha', 1);

            this.lineStyle(this.defaultStrokeWidth, this.defaultStrokeColor, this.defaultStrokeAlpha);
        }

        if (GetObjectValue(options, 'fillStyle', null))
        {
            this.defaultFillColor = GetObjectValue(options, 'fillStyle.color', 0xffffff);
            this.defaultFillAlpha = GetObjectValue(options, 'fillStyle.alpha', 1);

            this.fillStyle(this.defaultFillColor, this.defaultFillAlpha);
        }

        return this;
    },

    arc: function (x, y, radius, startAngle, endAngle, anticlockwise)
    {
        this.commandBuffer.push(
            Commands.ARC,
            x, y, radius, startAngle, endAngle, anticlockwise
        );

        return this;
    },

    lineStyle: function (lineWidth, color, alpha)
    {
        this.commandBuffer.push(
            Commands.LINE_STYLE,
            lineWidth, color, alpha
        );

        return this;
    },

    fillStyle: function (color, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

        this.commandBuffer.push(
            Commands.FILL_STYLE,
            color, alpha
        );

        return this;
    },

    beginPath: function ()
    {
        this.commandBuffer.push(
            Commands.BEGIN_PATH
        );

        return this;
    },

    closePath: function ()
    {
        this.commandBuffer.push(
            Commands.CLOSE_PATH
        );

        return this;
    },

    fillPath: function ()
    {
        this.commandBuffer.push(
            Commands.FILL_PATH
        );

        return this;
    },

    strokePath: function ()
    {
        this.commandBuffer.push(
            Commands.STROKE_PATH
        );

        return this;
    },

    strokeShape: function (shape)
    {

    },

    fillShape: function (shape)
    {

    },

    fillCircle: function (x, y, radius)
    {
        this.beginPath();
        this.arc(x, y, radius, 0, MATH_CONST.PI2);
        this.fillPath();
        this.closePath();

        return this;
    },

    fillRect: function (x, y, width, height)
    {
        this.commandBuffer.push(
            Commands.FILL_RECT,
            x, y, width, height
        );

        return this;
    },

    fillTriangle: function (x0, y0, x1, y1, x2, y2)
    {
        this.commandBuffer.push(
            Commands.FILL_TRIANGLE,
            x0, y0, x1, y1, x2, y2
        );

        return this;
    },

    strokeCircle: function (x, y, radius)
    {
        this.beginPath();
        this.arc(x, y, radius, 0, MATH_CONST.PI2);
        this.closePath();
        this.strokePath();

        return this;
    },

    strokeRect: function (x, y, width, height)
    {
        this.beginPath();
        this.moveTo(x, y);
        this.lineTo(x + width, y);
        this.lineTo(x + width, y + height);
        this.lineTo(x, y + height);
        this.lineTo(x, y);
        this.strokePath();
        this.closePath();

        return this;
    },

    strokeTriangle: function (x0, y0, x1, y1, x2, y2)
    {
        this.commandBuffer.push(
            Commands.STROKE_TRIANGLE,
            x0, y0, x1, y1, x2, y2
        );

        return this;
    },

    lineTo: function (x, y)
    {
        this.commandBuffer.push(
            Commands.LINE_TO,
            x, y
        );

        return this;
    },

    moveTo: function (x, y)
    {
        this.commandBuffer.push(
            Commands.MOVE_TO,
            x, y
        );

        return this;
    },

    lineFxTo: function (x, y, width, rgb)
    {
        this.commandBuffer.push(
            Commands.LINE_FX_TO,
            x, y, width, rgb, 1
        );

        return this;
    },

    moveFxTo: function (x, y, width, rgb)
    {
        this.commandBuffer.push(
            Commands.MOVE_FX_TO,
            x, y, width, rgb, 1
        );

        return this;
    },

    clear: function ()
    {
        this.commandBuffer.length = 0;

        if (this.defaultFillColor > -1)
        {
            this.fillStyle(this.defaultFillColor, this.defaultFillAlpha);
        }

        if (this.defaultStrokeColor > -1)
        {
            this.lineStyle(this.defaultStrokeWidth, this.defaultStrokeColor, this.defaultStrokeAlpha);
        }

        return this;
    }

});

module.exports = Graphics;
