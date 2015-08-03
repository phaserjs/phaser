/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2015 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* 
*
* @class PIXI.CanvasPool
* @static
*/
PIXI.CanvasPool = {

    /**
    * 
    * 
    * @method PIXI.CanvasPool.create
    * @static
    * @param {any} parent - The parent of the canvas element.
    * @param {number} width - The width of the canvas element.
    * @param {number} height - The height of the canvas element.
    * @return {HTMLCanvasElement} The canvas element.
    */
    create: function (parent, width, height) {

        var idx = PIXI.CanvasPool.getFirst();
        var canvas;

        if (idx === -1)
        {
            var container = {
                parent: parent,
                canvas: document.createElement("canvas")
            }

            PIXI.CanvasPool.pool.push(container);

            canvas = container.canvas;

            console.log('CanvasPool created', PIXI.CanvasPool.pool.length);
        }
        else
        {
            PIXI.CanvasPool.pool[idx].parent = parent;

            canvas = PIXI.CanvasPool.pool[idx].canvas;

            console.log('CanvasPool recycled', idx);
        }

        if (width !== undefined)
        {
            canvas.width = width;
            canvas.height = height;
            canvas.clearRect(0, 0, width, height);
        }

        return canvas;

    },

    getFirst: function () {

        var pool = PIXI.CanvasPool.pool;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].parent === null)
            {
                return i;
            }
        }

        return -1;

    },

    remove: function (parent) {

        var pool = PIXI.CanvasPool.pool;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].parent === parent)
            {
                pool[i].parent = null;

                console.log('CanvasPool removed', i);
            }
        }

    },

    removeByCanvas: function (canvas) {

        var pool = PIXI.CanvasPool.pool;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].canvas === canvas)
            {
                pool[i].parent = null;
            }
        }

    },

    getTotal: function () {

        var pool = PIXI.CanvasPool.pool;
        var c = 0;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].parent !== null)
            {
                c++;
            }
        }

        return c;

    },

    getFree: function () {

        var pool = PIXI.CanvasPool.pool;
        var c = 0;

        for (var i = 0; i < pool.length; i++)
        {
            if (pool[i].parent === null)
            {
                c++;
            }
        }

        return c;

    }

};

PIXI.CanvasPool.pool = [];
