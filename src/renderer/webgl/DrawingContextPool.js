/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var DrawingContext = require('./DrawingContext');

/**
 * @classdesc
 * A pool of DrawingContexts.
 *
 * This class is used internally by the WebGLRenderer to manage DrawingContexts.
 * It attempts to reuse DrawingContexts efficiently. When `get` is called,
 * it will return a DrawingContext of the given dimensions,
 * using the following priority:
 *
 * 1. A spare DrawingContext that has the same dimensions.
 * 2. A spare DrawingContext that has not been used recently, resized.
 * 3. A new DrawingContext, within the maximum pool size.
 * 4. The oldest spare DrawingContext, resized.
 * 5. A new DrawingContext, exceeding the maximum pool size.
 *
 * We assume that DrawingContexts of a given size are likely to be reused
 * from frame to frame, so we try to preserve them for greater efficiency.
 *
 * @class DrawingContextPool
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The renderer that owns this DrawingContextPool.
 */
var DrawingContextPool = new Class({
    initialize: function DrawingContextPool (renderer, maxAge, maxPoolSize)
    {
        /**
         * The renderer that owns this DrawingContextPool.
         *
         * @name Phaser.Renderer.WebGL.DrawingContextPool#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 4.0.0
         */
        this.renderer = renderer;

        /**
         * The maximum age of a DrawingContext in milliseconds.
         * After this time, the DrawingContext will be available for resizing.
         *
         * @name Phaser.Renderer.WebGL.DrawingContextPool#maxAge
         * @type {number}
         * @since 4.0.0
         */
        this.maxAge = maxAge;

        /**
         * The maximum number of DrawingContexts to store.
         * This is not a hard limit, but the pool will attempt to
         * reuse DrawingContexts rather than create new ones.
         *
         * @name Phaser.Renderer.WebGL.DrawingContextPool#maxPoolSize
         * @type {number}
         * @since 4.0.0
         */
        this.maxPoolSize = maxPoolSize;

        /**
         * The pool of DrawingContexts by age.
         * This is an array of DrawingContexts, oldest first.
         *
         * @name Phaser.Renderer.WebGL.DrawingContextPool#agePool
         * @type {Phaser.Renderer.WebGL.DrawingContext[]}
         * @since 4.0.0
         */
        this.agePool = [];

        /**
         * The pool of DrawingContexts by size.
         * This is an object with keys of the form `${width}x${height}`.
         * Each value is an array of DrawingContexts.
         *
         * @name Phaser.Renderer.WebGL.DrawingContextPool#sizePool
         * @type {object}
         * @since 4.0.0
         */
        this.sizePool = {};
    },

    /**
     * Adds a DrawingContext to the pool.
     * This is used by a DrawingContext to signal that it is available for reuse.
     *
     * @method Phaser.Renderer.WebGL.DrawingContextPool#add
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The DrawingContext to add to the pool.
     */
    add: function (drawingContext)
    {
        if (this.agePool.indexOf(drawingContext) !== -1)
        {
            return;
        }

        var key = drawingContext.width + 'x' + drawingContext.height;

        if (this.sizePool[key])
        {
            this.sizePool[key].push(drawingContext);
        }
        else
        {
            this.sizePool[key] = [ drawingContext ];
        }

        this.agePool.push(drawingContext);
    },

    /**
     * Returns a DrawingContext of the given dimensions.
     *
     * @method Phaser.Renderer.WebGL.DrawingContextPool#get
     * @since 4.0.0
     * @param {number} [width] - The width of the DrawingContext.
     * @param {number} [height] - The height of the DrawingContext.
     * @return {Phaser.Renderer.WebGL.DrawingContext} The DrawingContext.
     */
    get: function (width, height)
    {
        var drawingContext;

        var index;

        var renderer = this.renderer;
        if (width === undefined) { width = renderer.width; }
        if (height === undefined) { height = renderer.height; }
        if (width > 4096) { width = 4096; }
        if (height > 4096) { height = 4096; }

        // Seek a DrawingContext of the given size.

        var key = width + 'x' + height;

        var sizePool = this.sizePool[key];

        if (sizePool && sizePool.length > 0)
        {
            drawingContext = sizePool.pop();

            // Extract the DrawingContext from the agePool
            index = this.agePool.indexOf(drawingContext);
            this.agePool.splice(index, 1);

            return drawingContext;
        }

        // Seek a DrawingContext that is old enough to reuse.

        if (this.agePool.length > 0)
        {
            var now = Date.now();
            var maxAge = this.maxAge;
            drawingContext = this.agePool[0];
            if (now - drawingContext.lastUsed > maxAge)
            {
                // Remove the DrawingContext from the agePool
                this.agePool.shift();

                // Remove the DrawingContext from the sizePool
                var oldKey = drawingContext.width + 'x' + drawingContext.height;
                sizePool = this.sizePool[oldKey];
                index = sizePool.indexOf(drawingContext);
                sizePool.splice(index, 1);

                // Resize the DrawingContext
                drawingContext.resize(width, height);

                return drawingContext;
            }
        }

        // Create a new DrawingContext within the pool size limit.

        if (this.agePool.length < this.maxPoolSize)
        {
            drawingContext = new DrawingContext(renderer, {
                autoClear: true,
                pool: this,
                width: width,
                height: height
            });

            return drawingContext;
        }

        // Seek the oldest DrawingContext to resize.

        drawingContext = this.agePool.shift();
        if (drawingContext)
        {
            // Remove the DrawingContext from the sizePool
            sizePool = this.sizePool[key];
            index = sizePool.indexOf(drawingContext);
            sizePool.splice(index, 1);

            // Resize the DrawingContext
            drawingContext.resize(width, height);

            return drawingContext;
        }

        // Create a new DrawingContext exceeding the pool size limit.

        drawingContext = new DrawingContext(renderer, {
            autoClear: true,
            pool: this,
            width: width,
            height: height
        });

        return drawingContext;
    },

    /**
     * Sets the maximum age of a DrawingContext in milliseconds.
     *
     * @method Phaser.Renderer.WebGL.DrawingContextPool#setMaxAge
     * @since 4.0.0
     * @param {number} maxAge - The maximum age of a DrawingContext in milliseconds.
     */
    setMaxAge: function (maxAge)
    {
        this.maxAge = maxAge;
    },

    /**
     * Sets the maximum number of DrawingContexts to store.
     *
     * @method Phaser.Renderer.WebGL.DrawingContextPool#setMaxPoolSize
     * @since 4.0.0
     * @param {number} maxPoolSize - The maximum number of DrawingContexts to store.
     */
    setMaxPoolSize: function (maxPoolSize)
    {
        this.maxPoolSize = maxPoolSize;
    },

    /**
     * Clears the DrawingContextPool. This will not destroy any DrawingContexts
     * that are currently in use.
     *
     * @method Phaser.Renderer.WebGL.DrawingContextPool#clear
     * @since 4.0.0
     */
    clear: function ()
    {
        for (var i = 0; i < this.agePool.length; i++)
        {
            this.agePool[i].destroy();
        }

        this.sizePool = {};
        this.agePool.length = 0;
    },

    /**
     * Prunes the DrawingContextPool down to the maximum pool size.
     * Oldest DrawingContexts will be destroyed first.
     * This will not destroy any DrawingContexts that are currently in use.
     *
     * @method Phaser.Renderer.WebGL.DrawingContextPool#prune
     * @since 4.0.0
     */
    prune: function ()
    {
        var sizePool = this.sizePool;
        var agePool = this.agePool;

        var excess = agePool.length - this.maxPoolSize;
        if (excess > 0)
        {
            var excessAgePool = agePool.splice(0, excess);
            for (var i = 0; i < excess; i++)
            {
                var drawingContext = excessAgePool[i];
                var key = drawingContext.width + 'x' + drawingContext.height;
                var sizePoolKey = sizePool[key];
                var index = sizePoolKey.indexOf(drawingContext);
                sizePoolKey.splice(index, 1);

                drawingContext.destroy();
            }
        }
    }
});

module.exports = DrawingContextPool;
