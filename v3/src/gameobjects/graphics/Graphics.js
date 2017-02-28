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

    beginFill: function (color) 
    {
        this.commandBuffer.push(
            Commands.BEGIN_FILL,
            color
        );
    },

    endFill: function () 
    {
        this.commandBuffer.push(
            Commands.END_FILL
        );
    },

    drawCircle: function (x, y, radius) 
    {
        this.commandBuffer.push(
            Commands.DRAW_CIRCLE,
            x, y, radius
        );
    },

    drawRect: function (x, y, width, height) 
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
