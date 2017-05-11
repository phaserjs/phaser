var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var Render = require('./GraphicsRender');
var Commands = require('./Commands');
var MATH_CONST = require('../../math/const');
var GetValue = require('../../utils/object/GetValue');
var CanvasPool = require('../../dom/CanvasPool');
var Camera = require('../../camera/Camera.js');

var Graphics = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Transform,
        Components.RenderTarget,
        Components.Visible,
        Render
    ],

    initialize:

    function Graphics (state, options)
    {
        var x = GetValue(options, 'x', 0);
        var y = GetValue(options, 'y', 0);

        GameObject.call(this, state, 'Graphics');

        this.setPosition(x, y);

        this.commandBuffer = [];

        this.defaultFillColor = -1;
        this.defaultFillAlpha = 1;

        this.defaultStrokeWidth = 1;
        this.defaultStrokeColor = -1;
        this.defaultStrokeAlpha = 1;

        this.setDefaultStyles(options);

        var resourceManager = state.game.renderer.resourceManager;

        if (resourceManager !== undefined)
        {
            this.resourceManager = resourceManager;
            this.gl = state.game.renderer.gl;   
        }
    },

    //  STYLES

    setDefaultStyles: function (options)
    {
        if (GetValue(options, 'lineStyle', null))
        {
            this.defaultStrokeWidth = GetValue(options, 'lineStyle.width', 1);
            this.defaultStrokeColor = GetValue(options, 'lineStyle.color', 0xffffff);
            this.defaultStrokeAlpha = GetValue(options, 'lineStyle.alpha', 1);

            this.lineStyle(this.defaultStrokeWidth, this.defaultStrokeColor, this.defaultStrokeAlpha);
        }

        if (GetValue(options, 'fillStyle', null))
        {
            this.defaultFillColor = GetValue(options, 'fillStyle.color', 0xffffff);
            this.defaultFillAlpha = GetValue(options, 'fillStyle.alpha', 1);

            this.fillStyle(this.defaultFillColor, this.defaultFillAlpha);
        }

        return this;
    },

    lineStyle: function (lineWidth, color, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

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

    //  PATH

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

    //  CIRCLE

    fillCircleShape: function (circle)
    {
        return this.fillCircle(circle.x, circle.y, circle.radius);
    },

    strokeCircleShape: function (circle)
    {
        return this.strokeCircle(circle.x, circle.y, circle.radius);
    },

    fillCircle: function (x, y, radius)
    {
        this.beginPath();
        this.arc(x, y, radius, 0, MATH_CONST.PI2);
        this.fillPath();
        this.closePath();

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

    //  RECTANGLE

    fillRectShape: function (rect)
    {
        return this.fillRect(rect.x, rect.y, rect.width, rect.height);
    },

    strokeRectShape: function (rect)
    {
        return this.strokeRect(rect.x, rect.y, rect.width, rect.height);
    },

    fillRect: function (x, y, width, height)
    {
        this.commandBuffer.push(
            Commands.FILL_RECT,
            x, y, width, height
        );

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

    //  POINT

    fillPointShape: function (point, size)
    {
        return this.fillPoint(point.x, point.y, size);
    },

    fillPoint: function (x, y, size)
    {
        this.commandBuffer.push(
            Commands.FILL_RECT,
            x, y, size, size
        );

        return this;
    },

    //  TRIANGLE

    fillTriangleShape: function (triangle)
    {
        return this.fillTriangle(triangle.x1, triangle.y1, triangle.x2, triangle.y2, triangle.x3, triangle.y3);
    },

    strokeTriangleShape: function (triangle)
    {
        return this.strokeTriangle(triangle.x1, triangle.y1, triangle.x2, triangle.y2, triangle.x3, triangle.y3);
    },

    fillTriangle: function (x0, y0, x1, y1, x2, y2)
    {
        this.commandBuffer.push(
            Commands.FILL_TRIANGLE,
            x0, y0, x1, y1, x2, y2
        );

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

    //  LINE

    strokeLineShape: function (line)
    {
        return this.lineBetween(line.x1, line.y1, line.x2, line.y2);
    },

    lineBetween: function (x1, y1, x2, y2)
    {
        this.beginPath();
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        this.strokePath();
        this.closePath();

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

    //  ARC

    arc: function (x, y, radius, startAngle, endAngle, anticlockwise)
    {
        this.commandBuffer.push(
            Commands.ARC,
            x, y, radius, startAngle, endAngle, anticlockwise
        );

        return this;
    },

    save: function () {
        this.commandBuffer.push(
            Commands.SAVE
        );
        return this;
    },

    restore: function () {
        this.commandBuffer.push(
            Commands.RESTORE
        );
        return this;
    },

    translate: function (x, y) {
        this.commandBuffer.push(
            Commands.TRANSLATE,
            x, y
        );
        return this;
    },

    scale: function (x, y) {
        this.commandBuffer.push(
            Commands.SCALE,
            x, y
        );
        return this;
    },

    rotate: function (radian) {
        this.commandBuffer.push(
            Commands.ROTATE,
            radian
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
    },

    generateTexture: function (key, width, height) 
    {
        var screenWidth = this.state.game.config.width;
        var screenHeight = this.state.game.config.height;
        width = (typeof width === 'number') ? width : screenWidth;
        height = (typeof height === 'number') ? height : screenHeight;
        
        Graphics.TargetCamera.setViewport(0, 0, width, height);
        Graphics.TargetCamera.scrollX = this.x;
        Graphics.TargetCamera.scrollY = this.y;

        var texture = this.state.game.textures.createCanvas(key, width, height);
        var ctx = texture.source[0].image.getContext('2d');
        texture.add('__BASE', 0, 0, 0, width, height);
        this.renderCanvas(this.state.game.renderer, this, 0, Graphics.TargetCamera, ctx);
        if (this.gl)
        {
            this.state.game.renderer.uploadCanvasToGPU(ctx.canvas, texture.source[0].glTexture, true);
        }
    }

});

Graphics.TargetCamera = new Camera(0, 0, 0, 0);

module.exports = Graphics;
