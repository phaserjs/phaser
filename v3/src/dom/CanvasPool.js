var CONST = require('../const');
var Smoothing = require('./Smoothing');

// The pool into which the canvas elements are placed.
var pool = [];

//  Automatically apply smoothing(false) to created Canvas elements
var _disableContextSmoothing = false;

//  This singleton is instantiated as soon as Phaser loads,
//  before a Phaser.Game instance has even been created.
//  Which means all instances of Phaser Games on the same page
//  can share the one single pool

// The CanvasPool is a global static object, that allows Phaser to recycle and pool Canvas DOM elements.
var CanvasPool = function ()
{
    // Creates a new Canvas DOM element, or pulls one from the pool if free.
    var create = function (parent, width, height, type)
    {
        if (width === undefined) { width = 1; }
        if (height === undefined) { height = 1; }
        if (type === undefined) { type = CONST.CANVAS; }

        var canvas;
        var container = first(type);

        if (container === null)
        {
            container = {
                parent: parent,
                canvas: document.createElement('canvas'),
                type: type
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

        if (_disableContextSmoothing && type === CONST.CANVAS)
        {
            Smoothing.disable(canvas.getContext('2d'));
        }
        
        return canvas;
    };

    var create2D = function (parent, width, height)
    {
        return create(parent, width, height, CONST.CANVAS);
    };

    var createWebGL = function (parent, width, height)
    {
        return create(parent, width, height, CONST.WEBGL);
    };

    // Gets the first free canvas index from the pool.
    var first = function (type)
    {
        if (type === undefined) { type = CONST.CANVAS; }

        pool.forEach(function (container)
        {
            if (!container.parent && container.type === type)
            {
                return container;
            }
        });

        return null;
    };

    //  Looks up a canvas based on its parent, and if found puts it back in the pool, freeing it up for re-use.
    //  The canvas has its width and height set to 1, and its parent attribute nulled.
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

    //  Gets the total number of used canvas elements in the pool.
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

    //  Gets the total number of free canvas elements in the pool.
    var free = function ()
    {
        return pool.length - total();
    };

    //  Disable context smoothing on any new Canvas element created
    var disableSmoothing = function ()
    {
        _disableContextSmoothing = true;
    };

    //  Enable context smoothing on any new Canvas element created
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
