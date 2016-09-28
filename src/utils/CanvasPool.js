/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The CanvasPool is a global static object, that allows Phaser to recycle and pool Canvas DOM elements.
*
* @class Phaser.CanvasPool
* @static
*/
Phaser.CanvasPool = {

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
    create: function (parent, width, height) {

        var idx = Phaser.CanvasPool.getFirst();
        var canvas;

        if (idx === -1)
        {
            var container = {
                parent: parent,
                canvas: document.createElement('canvas')
            };

            Phaser.CanvasPool.pool.push(container);

            canvas = container.canvas;
        }
        else
        {
            Phaser.CanvasPool.pool[idx].parent = parent;

            canvas = Phaser.CanvasPool.pool[idx].canvas;
        }

        if (width !== undefined)
        {
            canvas.width = width;
            canvas.height = height;
        }

        return canvas;

    },

    /**
    * Gets the first free canvas index from the pool.
    * 
    * @static
    * @method Phaser.CanvasPool.getFirst
    * @return {number}
    */
    getFirst: function () {

        var pool = Phaser.CanvasPool.pool;

        for (var i = 0; i < pool.length; i++)
        {
            if (!pool[i].parent)
            {
                return i;
            }
        }

        return -1;

    },

    /**
    * Looks up a canvas based on its parent, and if found puts it back in the pool, freeing it up for re-use.
    * The canvas has its width and height set to 1, and its parent attribute nulled.
    * 
    * @static
    * @method Phaser.CanvasPool.remove
    * @param {any} parent - The parent of the canvas element.
    */
    remove: function (parent) {

        var pool = Phaser.CanvasPool.pool;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].parent === parent)
            {
                pool[i].parent = null;
                pool[i].canvas.width = 1;
                pool[i].canvas.height = 1;
            }
        }

    },

    /**
    * Looks up a canvas based on its type, and if found puts it back in the pool, freeing it up for re-use.
    * The canvas has its width and height set to 1, and its parent attribute nulled.
    * 
    * @static
    * @method Phaser.CanvasPool.removeByCanvas
    * @param {HTMLCanvasElement} canvas - The canvas element to remove.
    */
    removeByCanvas: function (canvas) {

        var pool = Phaser.CanvasPool.pool;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].canvas === canvas)
            {
                pool[i].parent = null;
                pool[i].canvas.width = 1;
                pool[i].canvas.height = 1;
            }
        }

    },

    /**
    * Gets the total number of used canvas elements in the pool.
    * 
    * @static
    * @method Phaser.CanvasPool.getTotal
    * @return {number} The number of in-use (parented) canvas elements in the pool.
    */
    getTotal: function () {

        var pool = Phaser.CanvasPool.pool;
        var c = 0;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].parent)
            {
                c++;
            }
        }

        return c;

    },

    /**
    * Gets the total number of free canvas elements in the pool.
    * 
    * @static
    * @method Phaser.CanvasPool.getFree
    * @return {number} The number of free (un-parented) canvas elements in the pool.
    */
    getFree: function () {

        var pool = Phaser.CanvasPool.pool;
        var c = 0;

        for (var i = 0; i < pool.length; i++)
        {
            if (!pool[i].parent)
            {
                c++;
            }
        }

        return c;

    }

};

/**
 * The pool into which the canvas elements are placed.
 *
 * @property pool
 * @type Array
 * @static
 */
Phaser.CanvasPool.pool = [];
