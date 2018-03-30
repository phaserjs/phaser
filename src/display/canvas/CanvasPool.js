/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('../../const');
var Smoothing = require('./Smoothing');

// The pool into which the canvas elements are placed.
var pool = [];

//  Automatically apply smoothing(false) to created Canvas elements
var _disableContextSmoothing = false;

/**
 * The CanvasPool is a global static object, that allows Phaser to recycle and pool Canvas DOM elements.
 *
 * This singleton is instantiated as soon as Phaser loads,
 * before a Phaser.Game instance has even been created.
 * Which means all instances of Phaser Games on the same page
 * can share the one single pool
 *
 * @namespace Phaser.Display.Canvas.CanvasPool
 * @since 3.0.0
 */
var CanvasPool = function ()
{
    /**
     * Creates a new Canvas DOM element, or pulls one from the pool if free.
     *
     * @function Phaser.Display.Canvas.CanvasPool.create
     * @since 3.0.0
     *
     * @param {*} parent - The parent of the Canvas object.
     * @param {integer} [width=1] - The width of the Canvas.
     * @param {integer} [height=1] - The height of the Canvas.
     * @param {integer} [canvasType=Phaser.CANVAS] - The type of the Canvas. Either `Phaser.CANVAS` or `Phaser.WEBGL`.
     *
     * @return {HTMLCanvasElement} [description]
     */
    var create = function (parent, width, height, canvasType)
    {
        if (width === undefined) { width = 1; }
        if (height === undefined) { height = 1; }
        if (canvasType === undefined) { canvasType = CONST.CANVAS; }

        var canvas;
        var container = first(canvasType);

        if (container === null)
        {
            container = {
                parent: parent,
                canvas: document.createElement('canvas'),
                type: canvasType
            };

            pool.push(container);

            canvas = container.canvas;
        }
        else
        {
            container.parent = parent;

            canvas = container.canvas;
        }

        canvas.width = width;
        canvas.height = height;

        if (_disableContextSmoothing && canvasType === CONST.CANVAS)
        {
            Smoothing.disable(canvas.getContext('2d'));
        }

        return canvas;
    };

    /**
     * Creates a new Canvas DOM element, or pulls one from the pool if free.
     *
     * @function Phaser.Display.Canvas.CanvasPool.create2D
     * @since 3.0.0
     *
     * @param {*} parent - The parent of the Canvas object.
     * @param {integer} [width=1] - The width of the Canvas.
     * @param {integer} [height=1] - The height of the Canvas.
     *
     * @return {HTMLCanvasElement} [description]
     */
    var create2D = function (parent, width, height)
    {
        return create(parent, width, height, CONST.CANVAS);
    };

    /**
     * Creates a new Canvas DOM element, or pulls one from the pool if free.
     *
     * @function Phaser.Display.Canvas.CanvasPool.createWebGL
     * @since 3.0.0
     *
     * @param {*} parent - The parent of the Canvas object.
     * @param {integer} [width=1] - The width of the Canvas.
     * @param {integer} [height=1] - The height of the Canvas.
     *
     * @return {HTMLCanvasElement} [description]
     */
    var createWebGL = function (parent, width, height)
    {
        return create(parent, width, height, CONST.WEBGL);
    };

    /**
     * Gets the first free canvas index from the pool.
     *
     * @function Phaser.Display.Canvas.CanvasPool.first
     * @since 3.0.0
     *
     * @param {integer} [canvasType=Phaser.CANVAS] - The type of the Canvas. Either `Phaser.CANVAS` or `Phaser.WEBGL`.
     *
     * @return {HTMLCanvasElement} [description]
     */
    var first = function (canvasType)
    {
        if (canvasType === undefined) { canvasType = CONST.CANVAS; }

        pool.forEach(function (container)
        {
            if (!container.parent && container.type === canvasType)
            {
                return container;
            }
        });

        return null;
    };

    /**
     * Looks up a canvas based on its parent, and if found puts it back in the pool, freeing it up for re-use.
     * The canvas has its width and height set to 1, and its parent attribute nulled.
     *
     * @function Phaser.Display.Canvas.CanvasPool.remove
     * @since 3.0.0
     *
     * @param {*} parent - [description]
     */
    var remove = function (parent)
    {
        //  Check to see if the parent is a canvas object
        var isCanvas = parent instanceof HTMLCanvasElement;

        pool.forEach(function (container)
        {
            if ((isCanvas && container.canvas === parent) || (!isCanvas && container.parent === parent))
            {
                // console.log('CanvasPool.remove found and removed');
                container.parent = null;
                container.canvas.width = 1;
                container.canvas.height = 1;
            }
        });
    };

    /**
     * Gets the total number of used canvas elements in the pool.
     *
     * @function Phaser.Display.Canvas.CanvasPool.total
     * @since 3.0.0
     *
     * @return {integer} [description]
     */
    var total = function ()
    {
        var c = 0;

        pool.forEach(function (container)
        {
            if (container.parent)
            {
                c++;
            }
        });

        return c;
    };

    /**
     * Gets the total number of free canvas elements in the pool.
     *
     * @function Phaser.Display.Canvas.CanvasPool.free
     * @since 3.0.0
     *
     * @return {integer} [description]
     */
    var free = function ()
    {
        return pool.length - total();
    };

    /**
     * Disable context smoothing on any new Canvas element created.
     *
     * @function Phaser.Display.Canvas.CanvasPool.disableSmoothing
     * @since 3.0.0
     */
    var disableSmoothing = function ()
    {
        _disableContextSmoothing = true;
    };

    /**
     * Enable context smoothing on any new Canvas element created.
     *
     * @function Phaser.Display.Canvas.CanvasPool.enableSmoothing
     * @since 3.0.0
     */
    var enableSmoothing = function ()
    {
        _disableContextSmoothing = false;
    };

    return {
        create2D: create2D,
        create: create,
        createWebGL: createWebGL,
        disableSmoothing: disableSmoothing,
        enableSmoothing: enableSmoothing,
        first: first,
        free: free,
        pool: pool,
        remove: remove,
        total: total
    };
};

//  If we export the called function here, it'll only be invoked once (not every time it's required).
module.exports = CanvasPool();
