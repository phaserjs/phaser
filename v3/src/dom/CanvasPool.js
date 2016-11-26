/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
 * The pool into which the canvas elements are placed.
 *
 * @property pool
 * @type Array
 */
var pool = [];

//  This singleton is instantiated as soon as Phaser loads,
//  before a Phaser.Game instance has even been created.
//  Which means all instances of Phaser Games on the same page
//  can share the one single pool

/**
* The CanvasPool is a global static object, that allows Phaser to recycle and pool Canvas DOM elements.
*
* @class Phaser.CanvasPool
* @static
*/
var CanvasPool = function ()
{
    /**
    * Creates a new Canvas DOM element, or pulls one from the pool if free.
    * 
    * @method Phaser.CanvasPool.create
    * @static
    * @param {any} parent - The parent of the canvas element.
    * @param {number} width - The width of the canvas element.
    * @param {number} height - The height of the canvas element.
    * @return {HTMLCanvasElement} The canvas element.
    */
    var create = function (parent, width, height)
    {
        var idx = first();
        var canvas;

        console.log('CanvasPool.create', idx);

        if (idx === -1)
        {
            var container = {
                parent: parent,
                canvas: document.createElement('canvas')
            };

            pool.push(container);

            canvas = container.canvas;
        }
        else
        {
            pool[idx].parent = parent;

            canvas = pool[idx].canvas;
        }

        if (width !== undefined)
        {
            canvas.width = width;
            canvas.height = height;
        }

        return canvas;
    };

    /**
    * Gets the first free canvas index from the pool.
    * 
    * @static
    * @method Phaser.CanvasPool.getFirst
    * @return {number}
    */
    var first = function ()
    {
        for (var i = 0; i < pool.length; i++)
        {
            if (!pool[i].parent)
            {
                return i;
            }
        }

        return -1;
    };

    /**
    * Looks up a canvas based on its parent, and if found puts it back in the pool, freeing it up for re-use.
    * The canvas has its width and height set to 1, and its parent attribute nulled.
    * 
    * @static
    * @method Phaser.CanvasPool.remove
    * @param {any} parent - The parent of the canvas element.
    */
    var remove = function (parent)
    {
        //  Check to see if the parent is a canvas object, then do removeByCanvas stuff instead
        //  CanvasRenderingContext2D

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].parent === parent)
            {
                pool[i].parent = null;
                pool[i].canvas.width = 1;
                pool[i].canvas.height = 1;
            }
        }

    };

    /**
    * Looks up a canvas based on its type, and if found puts it back in the pool, freeing it up for re-use.
    * The canvas has its width and height set to 1, and its parent attribute nulled.
    * 
    * @static
    * @method Phaser.CanvasPool.removeByCanvas
    * @param {HTMLCanvasElement} canvas - The canvas element to remove.
    */
    var removeByCanvas = function (canvas)
    {
        console.log('removeByCanvas');

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].canvas === canvas)
            {
                console.log('found and removed');

                pool[i].parent = null;
                pool[i].canvas.width = 1;
                pool[i].canvas.height = 1;
            }
        }

    };

    /**
    * Gets the total number of used canvas elements in the pool.
    * 
    * @static
    * @method Phaser.CanvasPool.getTotal
    * @return {number} The number of in-use (parented) canvas elements in the pool.
    */
    var getTotal = function ()
    {
        var c = 0;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].parent)
            {
                c++;
            }
        }

        return c;
    };

    /**
    * Gets the total number of free canvas elements in the pool.
    * 
    * @static
    * @method Phaser.CanvasPool.getFree
    * @return {number} The number of free (un-parented) canvas elements in the pool.
    */
    var getFree = function ()
    {
        var c = 0;

        for (var i = 0; i < pool.length; i++)
        {
            if (!pool[i].parent)
            {
                c++;
            }
        }

        return c;
    };

    return {
        create: create,
        first: first,
        remove: remove,
        removeByCanvas: removeByCanvas,
        getTotal: getTotal,
        getFree: getFree,
        pool: pool
    };
};

//  If we export the called function here, it'll only be invoked once (not every time it's required).
//  This function must return something though
module.exports = CanvasPool();
