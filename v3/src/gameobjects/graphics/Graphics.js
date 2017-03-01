var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var Render = require('./GraphicsRender');
var Commands = require('./Commands');

var Graphics = new Class({

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Transform,
        Components.Visible,
        Render
    ],

    initialize:

    function Graphics (state, x, y)
    {
        GameObject.call(this, state);
        this.commandBuffer = [];
        this.setPosition(x, y);
    },

    arc: function (x, y, radius, startAngle, endAngle, anticlockwise) 
    {
        this.commandBuffer.push(
            Commands.ARC,
            x, y, radius, startAngle, endAngle, anticlockwise
        );
    },

    lineStyle: function (lineWidth, color, alpha)
    {
        this.commandBuffer.push(
            Commands.LINE_STYLE,
            lineWidth, color, alpha
        );
    },

    fillStyle: function (color, alpha)
    {
        alpha = (alpha !== undefined ? alpha : 1);
        this.commandBuffer.push(
            Commands.FILL_STYLE,
            color, alpha
        );
    },

    beginPath: function () 
    {
        this.commandBuffer.push(
            Commands.BEGIN_PATH
        );
    },

    closePath: function () 
    {
        this.commandBuffer.push(
            Commands.CLOSE_PATH
        );
    },

    fillPath: function ()
    {
        this.commandBuffer.push(
            Commands.FILL_PATH
        );
    },

    strokePath: function ()
    {
        this.commandBuffer.push(
            Commands.STROKE_PATH
        );
    },

    fillCircle: function (x, y, radius) 
    {
        this.commandBuffer.push(
            Commands.DRAW_CIRCLE,
            x, y, radius
        );
    },

    fillRect: function (x, y, width, height) 
    {
        this.commandBuffer.push(
            Commands.DRAW_RECT,
            x, y, width, height
        );
    },

    strokeCircle: function (x, y, radius) 
    {
        this.commandBuffer.push(
            Commands.DRAW_CIRCLE,
            x, y, radius
        );
    },

    strokeRect: function (x, y, width, height) 
    {
        this.commandBuffer.push(
            Commands.DRAW_RECT,
            x, y, width, height
        );
    },

    lineTo: function (x, y) 
    {
        this.commandBuffer.push(
            Commands.LINE_TO,
            x, y
        );
    },

    moveTo: function (x, y) 
    {
        this.commandBuffer.push(
            Commands.MOVE_TO,
            x, y
        );
    },

    clear: function () 
    {
        commandBuffer.length = 0;
    }
});

module.exports = Graphics;
