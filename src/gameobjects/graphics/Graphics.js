/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Camera = require('../../cameras/2d/Camera.js');
var Class = require('../../utils/Class');
var Commands = require('./Commands');
var Components = require('../components');
var Ellipse = require('../../geom/ellipse/');
var GameObject = require('../GameObject');
var GetValue = require('../../utils/object/GetValue');
var MATH_CONST = require('../../math/const');
var Render = require('./GraphicsRender');

/**
 * @classdesc
 * [description]
 *
 * @class Graphics
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - [description]
 * @param {object} options - [description]
 */
var Graphics = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Pipeline,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        Render
    ],

    initialize:

    function Graphics (scene, options)
    {
        var x = GetValue(options, 'x', 0);
        var y = GetValue(options, 'y', 0);

        GameObject.call(this, scene, 'Graphics');

        this.setPosition(x, y);
        this.initPipeline('FlatTintPipeline');

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#displayOriginX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.displayOriginX = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#displayOriginY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.displayOriginY = 0;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#commandBuffer
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.commandBuffer = [];

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#defaultFillColor
         * @type {number}
         * @default -1
         * @since 3.0.0
         */
        this.defaultFillColor = -1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#defaultFillAlpha
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.defaultFillAlpha = 1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#defaultStrokeWidth
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.defaultStrokeWidth = 1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#defaultStrokeColor
         * @type {number}
         * @default -1
         * @since 3.0.0
         */
        this.defaultStrokeColor = -1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#defaultStrokeAlpha
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.defaultStrokeAlpha = 1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Graphics#_lineWidth
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._lineWidth = 1.0;

        this.setDefaultStyles(options);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#setDefaultStyles
     * @since 3.0.0
     *
     * @param {object} options - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
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

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#lineStyle
     * @since 3.0.0
     *
     * @param {number} lineWidth - [description]
     * @param {number} color - [description]
     * @param {float} [alpha=1] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    lineStyle: function (lineWidth, color, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

        this.commandBuffer.push(
            Commands.LINE_STYLE,
            lineWidth, color, alpha
        );

        this._lineWidth = lineWidth;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillStyle
     * @since 3.0.0
     *
     * @param {number} color - [description]
     * @param {float} [alpha=1] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillStyle: function (color, alpha)
    {
        if (alpha === undefined) { alpha = 1; }

        this.commandBuffer.push(
            Commands.FILL_STYLE,
            color, alpha
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#beginPath
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    beginPath: function ()
    {
        this.commandBuffer.push(
            Commands.BEGIN_PATH
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#closePath
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    closePath: function ()
    {
        this.commandBuffer.push(
            Commands.CLOSE_PATH
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillPath
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillPath: function ()
    {
        this.commandBuffer.push(
            Commands.FILL_PATH
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#strokePath
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokePath: function ()
    {
        this.commandBuffer.push(
            Commands.STROKE_PATH
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillCircleShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Circle} circle - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillCircleShape: function (circle)
    {
        return this.fillCircle(circle.x, circle.y, circle.radius);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#strokeCircleShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Circle} circle - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeCircleShape: function (circle)
    {
        return this.strokeCircle(circle.x, circle.y, circle.radius);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillCircle
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} radius - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillCircle: function (x, y, radius)
    {
        this.beginPath();
        this.arc(x, y, radius, 0, MATH_CONST.PI2);
        this.fillPath();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#strokeCircle
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} radius - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeCircle: function (x, y, radius)
    {
        this.beginPath();
        this.arc(x, y, radius, 0, MATH_CONST.PI2);
        this.strokePath();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillRectShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Rectangle} rect - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillRectShape: function (rect)
    {
        return this.fillRect(rect.x, rect.y, rect.width, rect.height);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#strokeRectShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Rectangle} rect - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeRectShape: function (rect)
    {
        return this.strokeRect(rect.x, rect.y, rect.width, rect.height);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillRect
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillRect: function (x, y, width, height)
    {
        this.commandBuffer.push(
            Commands.FILL_RECT,
            x, y, width, height
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#strokeRect
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeRect: function (x, y, width, height)
    {
        var lineWidthHalf = this._lineWidth / 2;
        var minx = x - lineWidthHalf;
        var maxx = x + lineWidthHalf;

        this.beginPath();
        this.moveTo(x, y);
        this.lineTo(x, y + height);
        this.strokePath();

        this.beginPath();
        this.moveTo(x + width, y);
        this.lineTo(x + width, y + height);
        this.strokePath();

        this.beginPath();
        this.moveTo(minx, y);
        this.lineTo(maxx + width, y);
        this.strokePath();

        this.beginPath();
        this.moveTo(minx, y + height);
        this.lineTo(maxx + width, y + height);
        this.strokePath();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillPointShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Point|Phaser.Math.Vector2|object} point - [description]
     * @param {number} [size=1] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillPointShape: function (point, size)
    {
        return this.fillPoint(point.x, point.y, size);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillPoint
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} [size=1] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillPoint: function (x, y, size)
    {
        if (!size || size < 1)
        {
            size = 1;
        }
        else
        {
            x -= (size / 2);
            y -= (size / 2);
        }

        this.commandBuffer.push(
            Commands.FILL_RECT,
            x, y, size, size
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillTriangleShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Triangle} triangle - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillTriangleShape: function (triangle)
    {
        return this.fillTriangle(triangle.x1, triangle.y1, triangle.x2, triangle.y2, triangle.x3, triangle.y3);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#strokeTriangleShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Triangle} triangle - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeTriangleShape: function (triangle)
    {
        return this.strokeTriangle(triangle.x1, triangle.y1, triangle.x2, triangle.y2, triangle.x3, triangle.y3);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillTriangle
     * @since 3.0.0
     *
     * @param {number} x0 - [description]
     * @param {number} y0 - [description]
     * @param {number} x1 - [description]
     * @param {number} y1 - [description]
     * @param {number} x2 - [description]
     * @param {number} y2 - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillTriangle: function (x0, y0, x1, y1, x2, y2)
    {
        this.commandBuffer.push(
            Commands.FILL_TRIANGLE,
            x0, y0, x1, y1, x2, y2
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#strokeTriangle
     * @since 3.0.0
     *
     * @param {number} x0 - [description]
     * @param {number} y0 - [description]
     * @param {number} x1 - [description]
     * @param {number} y1 - [description]
     * @param {number} x2 - [description]
     * @param {number} y2 - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeTriangle: function (x0, y0, x1, y1, x2, y2)
    {
        this.commandBuffer.push(
            Commands.STROKE_TRIANGLE,
            x0, y0, x1, y1, x2, y2
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#strokeLineShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Line} line - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeLineShape: function (line)
    {
        return this.lineBetween(line.x1, line.y1, line.x2, line.y2);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#lineBetween
     * @since 3.0.0
     *
     * @param {number} x1 - [description]
     * @param {number} y1 - [description]
     * @param {number} x2 - [description]
     * @param {number} y2 - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    lineBetween: function (x1, y1, x2, y2)
    {
        this.beginPath();
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        this.strokePath();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#lineTo
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    lineTo: function (x, y)
    {
        this.commandBuffer.push(
            Commands.LINE_TO,
            x, y
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#moveTo
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    moveTo: function (x, y)
    {
        this.commandBuffer.push(
            Commands.MOVE_TO,
            x, y
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#lineFxTo
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} rgb - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    lineFxTo: function (x, y, width, rgb)
    {
        this.commandBuffer.push(
            Commands.LINE_FX_TO,
            x, y, width, rgb, 1
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#moveFxTo
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} rgb - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    moveFxTo: function (x, y, width, rgb)
    {
        this.commandBuffer.push(
            Commands.MOVE_FX_TO,
            x, y, width, rgb, 1
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#strokePoints
     * @since 3.0.0
     *
     * @param {array|Phaser.Geom.Point[]} points - [description]
     * @param {boolean} [autoClose=false] - [description]
     * @param {integer} [endIndex] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokePoints: function (points, autoClose, endIndex)
    {
        if (autoClose === undefined) { autoClose = false; }
        if (endIndex === undefined) { endIndex = points.length; }

        this.beginPath();

        this.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < endIndex; i++)
        {
            this.lineTo(points[i].x, points[i].y);
        }

        if (autoClose)
        {
            this.lineTo(points[0].x, points[0].y);
        }

        this.strokePath();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillPoints
     * @since 3.0.0
     *
     * @param {array|Phaser.Geom.Point[]} points - [description]
     * @param {boolean} [autoClose=false] - [description]
     * @param {integer} [endIndex] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillPoints: function (points, autoClose, endIndex)
    {
        if (autoClose === undefined) { autoClose = false; }
        if (endIndex === undefined) { endIndex = points.length; }

        this.beginPath();

        this.moveTo(points[0].x, points[0].y);

        for (var i = 1; i < endIndex; i++)
        {
            this.lineTo(points[i].x, points[i].y);
        }

        if (autoClose)
        {
            this.lineTo(points[0].x, points[0].y);
        }

        this.fillPath();

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#strokeEllipseShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Ellipse} ellipse - [description]
     * @param {integer} [smoothness=32] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeEllipseShape: function (ellipse, smoothness)
    {
        if (smoothness === undefined) { smoothness = 32; }

        var points = ellipse.getPoints(smoothness);

        return this.strokePoints(points, true);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#strokeEllipse
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {integer} [smoothness=32] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeEllipse: function (x, y, width, height, smoothness)
    {
        if (smoothness === undefined) { smoothness = 32; }

        var ellipse = new Ellipse(x, y, width, height);

        var points = ellipse.getPoints(smoothness);

        return this.strokePoints(points, true);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillEllipseShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Ellipse} ellipse - [description]
     * @param {integer} [smoothness=32] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillEllipseShape: function (ellipse, smoothness)
    {
        if (smoothness === undefined) { smoothness = 32; }

        var points = ellipse.getPoints(smoothness);

        return this.fillPoints(points, true);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#fillEllipse
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     * @param {integer} [smoothness=32] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillEllipse: function (x, y, width, height, smoothness)
    {
        if (smoothness === undefined) { smoothness = 32; }

        var ellipse = new Ellipse(x, y, width, height);

        var points = ellipse.getPoints(smoothness);

        return this.fillPoints(points, true);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#arc
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} radius - [description]
     * @param {number} startAngle - [description]
     * @param {number} endAngle - [description]
     * @param {boolean} anticlockwise - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    arc: function (x, y, radius, startAngle, endAngle, anticlockwise)
    {
        this.commandBuffer.push(
            Commands.ARC,
            x, y, radius, startAngle, endAngle, anticlockwise
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#save
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    save: function ()
    {
        this.commandBuffer.push(
            Commands.SAVE
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#restore
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    restore: function ()
    {
        this.commandBuffer.push(
            Commands.RESTORE
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#translate
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    translate: function (x, y)
    {
        this.commandBuffer.push(
            Commands.TRANSLATE,
            x, y
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#scale
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    scale: function (x, y)
    {
        this.commandBuffer.push(
            Commands.SCALE,
            x, y
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#rotate
     * @since 3.0.0
     *
     * @param {number} radians - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    rotate: function (radians)
    {
        this.commandBuffer.push(
            Commands.ROTATE,
            radians
        );

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Graphics#clear
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
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

    /**
     * If key is a string it'll generate a new texture using it and add it into the
     * Texture Manager (assuming no key conflict happens).
     *
     * If key is a Canvas it will draw the texture to that canvas context. Note that it will NOT
     * automatically upload it to the GPU in WebGL mode.
     *
     * @method Phaser.GameObjects.Graphics#generateTexture
     * @since 3.0.0
     *
     * @param {string|HTMLCanvasElement} key - [description]
     * @param {integer} [width] - [description]
     * @param {integer} [height] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    generateTexture: function (key, width, height)
    {
        var sys = this.scene.sys;

        if (width === undefined) { width = sys.game.config.width; }
        if (height === undefined) { height = sys.game.config.height; }

        Graphics.TargetCamera.setViewport(0, 0, width, height);
        Graphics.TargetCamera.scrollX = this.x;
        Graphics.TargetCamera.scrollY = this.y;

        var texture;
        var ctx;

        if (typeof key === 'string')
        {
            if (sys.textures.exists(key))
            {
                //  Key is a string, it DOES exist in the Texture Manager AND is a canvas, so draw to it

                texture = sys.textures.get(key);

                var src = texture.getSourceImage();

                if (src instanceof HTMLCanvasElement)
                {
                    ctx = src.getContext('2d');
                }
            }
            else
            {
                //  Key is a string and doesn't exist in the Texture Manager, so generate and save it

                texture = sys.textures.createCanvas(key, width, height);

                ctx = texture.getSourceImage().getContext('2d');
            }
        }
        else if (key instanceof HTMLCanvasElement)
        {
            //  Key is a Canvas, so draw to it

            ctx = key.getContext('2d');
        }

        if (ctx)
        {
            this.renderCanvas(sys.game.renderer, this, 0, Graphics.TargetCamera, ctx);

            if (sys.game.renderer.gl && texture)
            {
                texture.source[0].glTexture = sys.game.renderer.canvasToTexture(ctx.canvas, texture.source[0].glTexture, true, 0);
            }
        }

        return this;
    }

});

/**
 * A Camera used specifically by the Graphics system for rendering to textures.
 *
 * @name Phaser.GameObjects.Graphics.TargetCamera
 * @type {Phaser.Cameras.Scene2D.Camera}
 * @since 3.1.0
 */
Graphics.TargetCamera = new Camera(0, 0, 0, 0);

module.exports = Graphics;
