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
var GetFastValue = require('../../utils/object/GetFastValue');
var GetValue = require('../../utils/object/GetValue');
var MATH_CONST = require('../../math/const');
var Render = require('./GraphicsRender');

/**
 * Graphics line style (or stroke style) settings.
 *
 * @typedef {object} GraphicsLineStyle
 *
 * @property {number} [width] - The stroke width.
 * @property {number} [color] - The stroke color.
 * @property {number} [alpha] - The stroke alpha.
 */

/**
 * Graphics fill style settings.
 *
 * @typedef {object} GraphicsFillStyle
 *
 * @property {number} [color] - The fill color.
 * @property {number} [alpha] - The fill alpha.
 */

/**
 * Graphics style settings.
 *
 * @typedef {object} GraphicsStyles
 *
 * @property {GraphicsLineStyle} [lineStyle] - The style applied to shape outlines.
 * @property {GraphicsFillStyle} [fillStyle] - The style applied to shape areas.
 */

/**
 * Options for the Graphics game Object.
 *
 * @typedef {object} GraphicsOptions
 * @extends GraphicsStyles
 *
 * @property {number} [x] - The x coordinate of the Graphics.
 * @property {number} [y] - The y coordinate of the Graphics.
 */

/**
 * @classdesc
 * A Graphics object is a way to draw primitive shapes to you game. Primitives include forms of geometry, such as
 * Rectangles, Circles, and Polygons. They also include lines, arcs and curves. When you initially create a Graphics
 * object it will be empty.
 *
 * To draw to it you must first specify a line style or fill style (or both), draw shapes using paths, and finally
 * fill or stroke them. For example:
 *
 * ```javascript
 * graphics.lineStyle(5, 0xFF00FF, 1.0);
 * graphics.beginPath();
 * graphics.moveTo(100, 100);
 * graphics.lineTo(200, 200);
 * graphics.closePath();
 * graphics.strokePath();
 * ```
 *
 * There are also many helpful methods that draw and fill/stroke common shapes for you.
 *
 * ```javascript
 * graphics.lineStyle(5, 0xFF00FF, 1.0);
 * graphics.fillStyle(0xFFFFFF, 1.0);
 * graphics.fillRect(50, 50, 400, 200);
 * graphics.strokeRect(50, 50, 400, 200);
 * ```
 *
 * When a Graphics object is rendered it will render differently based on if the game is running under Canvas or WebGL.
 * Under Canvas it will use the HTML Canvas context drawing operations to draw the path.
 * Under WebGL the graphics data is decomposed into polygons. Both of these are expensive processes, especially with
 * complex shapes.
 *
 * If your Graphics object doesn't change much (or at all) once you've drawn your shape to it, then you will help
 * performance by calling {@link Phaser.GameObjects.Graphics#generateTexture}. This will 'bake' the Graphics object into
 * a Texture, and return it. You can then use this Texture for Sprites or other display objects. If your Graphics object
 * updates frequently then you should avoid doing this, as it will constantly generate new textures, which will consume
 * memory.
 *
 * As you can tell, Graphics objects are a bit of a trade-off. While they are extremely useful, you need to be careful
 * in their complexity and quantity of them in your game.
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
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Graphics object belongs.
 * @param {GraphicsOptions} [options] - Options that set the position and default style of this Graphics object.
 */
var Graphics = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
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
         * The horizontal display origin of the Graphics.
         *
         * @name Phaser.GameObjects.Graphics#displayOriginX
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.displayOriginX = 0;

        /**
         * The vertical display origin of the Graphics.
         *
         * @name Phaser.GameObjects.Graphics#displayOriginY
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.displayOriginY = 0;

        /**
         * The array of commands used to render the Graphics.
         *
         * @name Phaser.GameObjects.Graphics#commandBuffer
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.commandBuffer = [];

        /**
         * The default fill color for shapes rendered by this Graphics object.
         *
         * @name Phaser.GameObjects.Graphics#defaultFillColor
         * @type {number}
         * @default -1
         * @since 3.0.0
         */
        this.defaultFillColor = -1;

        /**
         * The default fill alpha for shapes rendered by this Graphics object.
         *
         * @name Phaser.GameObjects.Graphics#defaultFillAlpha
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.defaultFillAlpha = 1;

        /**
         * The default stroke width for shapes rendered by this Graphics object.
         *
         * @name Phaser.GameObjects.Graphics#defaultStrokeWidth
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.defaultStrokeWidth = 1;

        /**
         * The default stroke color for shapes rendered by this Graphics object.
         *
         * @name Phaser.GameObjects.Graphics#defaultStrokeColor
         * @type {number}
         * @default -1
         * @since 3.0.0
         */
        this.defaultStrokeColor = -1;

        /**
         * The default stroke alpha for shapes rendered by this Graphics object.
         *
         * @name Phaser.GameObjects.Graphics#defaultStrokeAlpha
         * @type {number}
         * @default 1
         * @since 3.0.0
         */
        this.defaultStrokeAlpha = 1;

        /**
         * Internal property that keeps track of the line width style setting.
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
     * Set the default style settings for this Graphics object.
     *
     * @method Phaser.GameObjects.Graphics#setDefaultStyles
     * @since 3.0.0
     *
     * @param {GraphicsStyles} options - The styles to set as defaults.
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
     * Set the current line style.
     *
     * @method Phaser.GameObjects.Graphics#lineStyle
     * @since 3.0.0
     *
     * @param {number} lineWidth - The stroke width.
     * @param {number} color - The stroke color.
     * @param {number} [alpha=1] - The stroke alpha.
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
     * Set the current fill style.
     *
     * @method Phaser.GameObjects.Graphics#fillStyle
     * @since 3.0.0
     *
     * @param {number} color - The fill color.
     * @param {number} [alpha=1] - The fill alpha.
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
     * Start a new shape path.
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
     * Close the current path.
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
     * Fill the current path.
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
     * Stroke the current path.
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
     * Fill the given circle.
     *
     * @method Phaser.GameObjects.Graphics#fillCircleShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Circle} circle - The circle to fill.
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillCircleShape: function (circle)
    {
        return this.fillCircle(circle.x, circle.y, circle.radius);
    },

    /**
     * Stroke the given circle.
     *
     * @method Phaser.GameObjects.Graphics#strokeCircleShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Circle} circle - The circle to stroke.
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeCircleShape: function (circle)
    {
        return this.strokeCircle(circle.x, circle.y, circle.radius);
    },

    /**
     * Fill a circle with the given position and radius.
     *
     * @method Phaser.GameObjects.Graphics#fillCircle
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the center of the circle.
     * @param {number} y - The y coordinate of the center of the circle.
     * @param {number} radius - The radius of the circle.
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
     * Stroke a circle with the given position and radius.
     *
     * @method Phaser.GameObjects.Graphics#strokeCircle
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the center of the circle.
     * @param {number} y - The y coordinate of the center of the circle.
     * @param {number} radius - The radius of the circle.
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
     * Fill the given rectangle.
     *
     * @method Phaser.GameObjects.Graphics#fillRectShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Rectangle} rect - The rectangle to fill.
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillRectShape: function (rect)
    {
        return this.fillRect(rect.x, rect.y, rect.width, rect.height);
    },

    /**
     * Stroke the given rectangle.
     *
     * @method Phaser.GameObjects.Graphics#strokeRectShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Rectangle} rect - The rectangle to stroke.
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeRectShape: function (rect)
    {
        return this.strokeRect(rect.x, rect.y, rect.width, rect.height);
    },

    /**
     * Fill a rectangle with the given position and size.
     *
     * @method Phaser.GameObjects.Graphics#fillRect
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the top-left of the rectangle.
     * @param {number} y - The y coordinate of the top-left of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
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
     * Stroke a rectangle with the given position and size.
     *
     * @method Phaser.GameObjects.Graphics#strokeRect
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the top-left of the rectangle.
     * @param {number} y - The y coordinate of the top-left of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
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
     * Fill a rounded rectangle with the given position, size and radius.
     *
     * @method Phaser.GameObjects.Graphics#fillRoundedRect
     * @since 3.11.0
     *
     * @param {number} x - The x coordinate of the top-left of the rectangle.
     * @param {number} y - The y coordinate of the top-left of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {number} [radius = 20] - The corner radius; It can also be an object to specify different radii for corners
     * @param {number} [radius.tl = 20] Top left
     * @param {number} [radius.tr = 20] Top right
     * @param {number} [radius.br = 20] Bottom right
     * @param {number} [radius.bl = 20] Bottom left
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillRoundedRect: function (x, y, width, height, radius)
    {
        if (radius === undefined) { radius = 20; }

        var tl = radius;
        var tr = radius;
        var bl = radius;
        var br = radius;

        if (typeof radius !== 'number')
        {
            tl = GetFastValue(radius, 'tl', 20);
            tr = GetFastValue(radius, 'tr', 20);
            bl = GetFastValue(radius, 'bl', 20);
            br = GetFastValue(radius, 'br', 20);
        }

        this.beginPath();
        this.moveTo(x + tl, y);
        this.lineTo(x + width - tr, y);
        this.arc(x + width - tr, y + tr, tr, -MATH_CONST.TAU, 0);
        this.lineTo(x + width, y + height - br);
        this.arc(x + width - br, y + height - br, br, 0, MATH_CONST.TAU);
        this.lineTo(x + bl, y + height);
        this.arc(x + bl, y + height - bl, bl, MATH_CONST.TAU, Math.PI);
        this.lineTo(x, y + tl);
        this.arc(x + tl, y + tl, tl, -Math.PI, -MATH_CONST.TAU);
        this.fillPath();

        return this;
    },

    /**
     * Stroke a rounded rectangle with the given position, size and radius.
     *
     * @method Phaser.GameObjects.Graphics#strokeRoundedRect
     * @since 3.11.0
     *
     * @param {number} x - The x coordinate of the top-left of the rectangle.
     * @param {number} y - The y coordinate of the top-left of the rectangle.
     * @param {number} width - The width of the rectangle.
     * @param {number} height - The height of the rectangle.
     * @param {number} [radius = 20] - The corner radius; It can also be an object to specify different radii for corners
     * @param {number} [radius.tl = 20] Top left
     * @param {number} [radius.tr = 20] Top right
     * @param {number} [radius.br = 20] Bottom right
     * @param {number} [radius.bl = 20] Bottom left
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeRoundedRect: function (x, y, width, height, radius)
    {
        if (radius === undefined) { radius = 20; }

        var tl = radius;
        var tr = radius;
        var bl = radius;
        var br = radius;

        if (typeof radius !== 'number')
        {
            tl = GetFastValue(radius, 'tl', 20);
            tr = GetFastValue(radius, 'tr', 20);
            bl = GetFastValue(radius, 'bl', 20);
            br = GetFastValue(radius, 'br', 20);
        }

        this.beginPath();
        this.moveTo(x + tl, y);
        this.lineTo(x + width - tr, y);
        this.arc(x + width - tr, y + tr, tr, -MATH_CONST.TAU, 0);
        this.lineTo(x + width, y + height - br);
        this.arc(x + width - br, y + height - br, br, 0, MATH_CONST.TAU);
        this.lineTo(x + bl, y + height);
        this.arc(x + bl, y + height - bl, bl, MATH_CONST.TAU, Math.PI);
        this.lineTo(x, y + tl);
        this.arc(x + tl, y + tl, tl, -Math.PI, -MATH_CONST.TAU);
        this.strokePath();

        return this;
    },

    /**
     * Fill the given point.
     *
     * Draws a square at the given position, 1 pixel in size by default.
     *
     * @method Phaser.GameObjects.Graphics#fillPointShape
     * @since 3.0.0
     *
     * @param {(Phaser.Geom.Point|Phaser.Math.Vector2|object)} point - The point to fill.
     * @param {number} [size=1] - The size of the square to draw.
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillPointShape: function (point, size)
    {
        return this.fillPoint(point.x, point.y, size);
    },

    /**
     * Fill a point at the given position.
     *
     * Draws a square at the given position, 1 pixel in size by default.
     *
     * @method Phaser.GameObjects.Graphics#fillPoint
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the point.
     * @param {number} y - The y coordinate of the point.
     * @param {number} [size=1] - The size of the square to draw.
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
     * Fill the given triangle.
     *
     * @method Phaser.GameObjects.Graphics#fillTriangleShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Triangle} triangle - The triangle to fill.
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    fillTriangleShape: function (triangle)
    {
        return this.fillTriangle(triangle.x1, triangle.y1, triangle.x2, triangle.y2, triangle.x3, triangle.y3);
    },

    /**
     * Stroke the given triangle.
     *
     * @method Phaser.GameObjects.Graphics#strokeTriangleShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Triangle} triangle - The triangle to stroke.
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeTriangleShape: function (triangle)
    {
        return this.strokeTriangle(triangle.x1, triangle.y1, triangle.x2, triangle.y2, triangle.x3, triangle.y3);
    },

    /**
     * Fill a triangle with the given points.
     *
     * @method Phaser.GameObjects.Graphics#fillTriangle
     * @since 3.0.0
     *
     * @param {number} x0 - The x coordinate of the first point.
     * @param {number} y0 - The y coordinate of the first point.
     * @param {number} x1 - The x coordinate of the second point.
     * @param {number} y1 - The y coordinate of the second point.
     * @param {number} x2 - The x coordinate of the third point.
     * @param {number} y2 - The y coordinate of the third point.
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
     * Stroke a triangle with the given points.
     *
     * @method Phaser.GameObjects.Graphics#strokeTriangle
     * @since 3.0.0
     *
     * @param {number} x0 - The x coordinate of the first point.
     * @param {number} y0 - The y coordinate of the first point.
     * @param {number} x1 - The x coordinate of the second point.
     * @param {number} y1 - The y coordinate of the second point.
     * @param {number} x2 - The x coordinate of the third point.
     * @param {number} y2 - The y coordinate of the third point.
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
     * Draw the given line.
     *
     * @method Phaser.GameObjects.Graphics#strokeLineShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Line} line - The line to stroke.
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    strokeLineShape: function (line)
    {
        return this.lineBetween(line.x1, line.y1, line.x2, line.y2);
    },

    /**
     * Draw a line between the given points.
     *
     * @method Phaser.GameObjects.Graphics#lineBetween
     * @since 3.0.0
     *
     * @param {number} x1 - The x coordinate of the start point of the line.
     * @param {number} y1 - The y coordinate of the start point of the line.
     * @param {number} x2 - The x coordinate of the end point of the line.
     * @param {number} y2 - The y coordinate of the end point of the line.
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
     * Draw a line from the current drawing position to the given position.
     *
     * Moves the current drawing position to the given position.
     *
     * @method Phaser.GameObjects.Graphics#lineTo
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate to draw the line to.
     * @param {number} y - The y coordinate to draw the line to.
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
     * Move the current drawing position to the given position.
     *
     * @method Phaser.GameObjects.Graphics#moveTo
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate to move to.
     * @param {number} y - The y coordinate to move to.
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
     * Stroke the shape represented by the given array of points.
     *
     * Pass `true` to `autoClose` to close the shape automatically.
     *
     * @method Phaser.GameObjects.Graphics#strokePoints
     * @since 3.0.0
     *
     * @param {(array|Phaser.Geom.Point[])} points - The points to stroke.
     * @param {boolean} [autoClose=false] - When `true`, the shape is closed by joining the last point to the first point.
     * @param {integer} [endIndex] - The index of `points` to stop drawing at. Defaults to `points.length`.
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
     * Fill the shape represented by the given array of points.
     *
     * Pass `true` to `autoClose` to close the shape automatically.
     *
     * @method Phaser.GameObjects.Graphics#fillPoints
     * @since 3.0.0
     *
     * @param {(array|Phaser.Geom.Point[])} points - The points to fill.
     * @param {boolean} [autoClose=false] - Whether to automatically close the polygon.
     * @param {integer} [endIndex] - The index of `points` to stop at. Defaults to `points.length`.
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
     * Stroke the given ellipse.
     *
     * @method Phaser.GameObjects.Graphics#strokeEllipseShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Ellipse} ellipse - The ellipse to stroke.
     * @param {integer} [smoothness=32] - The number of points to draw the ellipse with.
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
     * Stroke an ellipse with the given position and size.
     *
     * @method Phaser.GameObjects.Graphics#strokeEllipse
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the center of the ellipse.
     * @param {number} y - The y coordinate of the center of the ellipse.
     * @param {number} width - The width of the ellipse.
     * @param {number} height - The height of the ellipse.
     * @param {integer} [smoothness=32] - The number of points to draw the ellipse with.
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
     * Fill the given ellipse.
     *
     * @method Phaser.GameObjects.Graphics#fillEllipseShape
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Ellipse} ellipse - The ellipse to fill.
     * @param {integer} [smoothness=32] - The number of points to draw the ellipse with.
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
     * Fill an ellipse with the given position and size.
     *
     * @method Phaser.GameObjects.Graphics#fillEllipse
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the center of the ellipse.
     * @param {number} y - The y coordinate of the center of the ellipse.
     * @param {number} width - The width of the ellipse.
     * @param {number} height - The height of the ellipse.
     * @param {integer} [smoothness=32] - The number of points to draw the ellipse with.
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
     * Draw an arc.
     *
     * This method can be used to create circles, or parts of circles.
     * 
     * Use the optional `overshoot` argument to allow the arc to extend beyond 360 degrees. This is useful if you're drawing
     * an arc with an especially thick line, as it will allow the arc to fully join-up. Try small values at first, i.e. 0.01.
     *
     * Call {@link Phaser.GameObjects.Graphics#fillPath} or {@link Phaser.GameObjects.Graphics#strokePath} after calling
     * this method to draw the arc.
     *
     * @method Phaser.GameObjects.Graphics#arc
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the center of the circle.
     * @param {number} y - The y coordinate of the center of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {number} startAngle - The starting angle, in radians.
     * @param {number} endAngle - The ending angle, in radians.
     * @param {boolean} [anticlockwise=false] - Whether the drawing should be anticlockwise or clockwise.
     * @param {number} [overshoot=0] - This value allows you to overshoot the endAngle by this amount. Useful if the arc has a thick stroke and needs to overshoot to join-up cleanly.
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    arc: function (x, y, radius, startAngle, endAngle, anticlockwise, overshoot)
    {
        if (anticlockwise === undefined) { anticlockwise = false; }
        if (overshoot === undefined) { overshoot = 0; }

        var PI2 = Math.PI * 2;

        if (anticlockwise)
        {
            if (endAngle < -PI2)
            {
                endAngle = -PI2 - overshoot;
            }
            else if (endAngle >= 0)
            {
                endAngle = -PI2 + endAngle % PI2 - overshoot;
            }
        }
        else
        {
            endAngle -= startAngle;
            endAngle += overshoot;

            if (endAngle > PI2 + overshoot)
            {
                endAngle = PI2 + overshoot;
                
            }
            else if (endAngle < -overshoot)
            {
                endAngle = PI2 + endAngle % PI2 - overshoot;
            }
        }

        this.commandBuffer.push(
            Commands.ARC,
            x, y, radius, startAngle, endAngle, anticlockwise
        );

        return this;
    },

    /**
     * Creates a pie-chart slice shape centered at `x`, `y` with the given radius.
     * You must define the start and end angle of the slice.
     *
     * Setting the `anticlockwise` argument to `true` creates a shape similar to Pacman.
     * Setting it to `false` creates a shape like a slice of pie.
     *
     * This method will begin a new path and close the path at the end of it.
     * To display the actual slice you need to call either `strokePath` or `fillPath` after it.
     *
     * @method Phaser.GameObjects.Graphics#slice
     * @since 3.4.0
     *
     * @param {number} x - The horizontal center of the slice.
     * @param {number} y - The vertical center of the slice.
     * @param {number} radius - The radius of the slice.
     * @param {number} startAngle - The start angle of the slice, given in radians.
     * @param {number} endAngle - The end angle of the slice, given in radians.
     * @param {boolean} [anticlockwise=false] - Whether the drawing should be anticlockwise or clockwise.
     * @param {number} [overshoot=0] - This value allows you to overshoot the endAngle by this amount. Useful if the arc has a thick stroke and needs to overshoot to join-up cleanly.
     *
     * @return {Phaser.GameObjects.Graphics} This Game Object.
     */
    slice: function (x, y, radius, startAngle, endAngle, anticlockwise, overshoot)
    {
        if (anticlockwise === undefined) { anticlockwise = false; }
        if (overshoot === undefined) { overshoot = 0; }

        var PI2 = Math.PI * 2;

        if (anticlockwise)
        {
            if (endAngle < -PI2)
            {
                endAngle = -PI2 - overshoot;
            }
            else if (endAngle >= 0)
            {
                endAngle = -PI2 + endAngle % PI2 - overshoot;
            }
        }
        else
        {
            endAngle -= startAngle;
            endAngle += overshoot;

            if (endAngle > PI2 + overshoot)
            {
                endAngle = PI2 + overshoot;
                
            }
            else if (endAngle <= -overshoot)
            {
                endAngle = PI2 + endAngle % PI2 - overshoot;
            }
        }

        this.commandBuffer.push(Commands.BEGIN_PATH);

        this.commandBuffer.push(Commands.MOVE_TO, x, y);

        this.commandBuffer.push(Commands.ARC, x, y, radius, startAngle, endAngle, anticlockwise);

        this.commandBuffer.push(Commands.CLOSE_PATH);

        return this;
    },

    /**
     * Saves the state of the Graphics by pushing the current state onto a stack.
     *
     * The most recently saved state can then be restored with {@link Phaser.GameObjects.Graphics#restore}.
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
     * Restores the most recently saved state of the Graphics by popping from the state stack.
     *
     * Use {@link Phaser.GameObjects.Graphics#save} to save the current state, and call this afterwards to restore that state.
     *
     * If there is no saved state, this command does nothing.
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
     * Translate the graphics.
     *
     * @method Phaser.GameObjects.Graphics#translate
     * @since 3.0.0
     *
     * @param {number} x - The horizontal translation to apply.
     * @param {number} y - The vertical translation to apply.
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
     * Scale the graphics.
     *
     * @method Phaser.GameObjects.Graphics#scale
     * @since 3.0.0
     *
     * @param {number} x - The horizontal scale to apply.
     * @param {number} y - The vertical scale to apply.
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
     * Rotate the graphics.
     *
     * @method Phaser.GameObjects.Graphics#rotate
     * @since 3.0.0
     *
     * @param {number} radians - The rotation angle, in radians.
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
     * Clear the command buffer and reset the fill style and line style to their defaults.
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
     * Generate a texture from this Graphics object.
     *
     * If `key` is a string it'll generate a new texture using it and add it into the
     * Texture Manager (assuming no key conflict happens).
     *
     * If `key` is a Canvas it will draw the texture to that canvas context. Note that it will NOT
     * automatically upload it to the GPU in WebGL mode.
     *
     * @method Phaser.GameObjects.Graphics#generateTexture
     * @since 3.0.0
     *
     * @param {(string|HTMLCanvasElement)} key - The key to store the texture with in the Texture Manager, or a Canvas to draw to.
     * @param {integer} [width] - The width of the graphics to generate.
     * @param {integer} [height] - The height of the graphics to generate.
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
            this.renderCanvas(sys.game.renderer, this, 0.0, Graphics.TargetCamera, null, ctx);

            if (sys.game.renderer.gl && texture)
            {
                texture.source[0].glTexture = sys.game.renderer.canvasToTexture(ctx.canvas, texture.source[0].glTexture);
            }
        }

        return this;
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.Graphics#preDestroy
     * @protected
     * @since 3.9.0
     */
    preDestroy: function ()
    {
        this.commandBuffer = [];
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
