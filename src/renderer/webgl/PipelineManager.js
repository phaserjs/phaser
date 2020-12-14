/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var CONST = require('./pipelines/const');
var CustomMap = require('../../structs/Map');

//  Default Phaser 3 Pipelines
var BitmapMaskPipeline = require('./pipelines/BitmapMaskPipeline');
var GraphicsPipeline = require('./pipelines/GraphicsPipeline');
var LightPipeline = require('./pipelines/LightPipeline');
var MultiPipeline = require('./pipelines/MultiPipeline');
var PointLightPipeline = require('./pipelines/PointLightPipeline');
var RopePipeline = require('./pipelines/RopePipeline');
var SinglePipeline = require('./pipelines/SinglePipeline');
var UtilityPipeline = require('./pipelines/UtilityPipeline');

/**
 * @classdesc
 * The Pipeline Manager is responsible for the creation, activation, running and destruction
 * of WebGL Pipelines and Post FX Pipelines in Phaser 3.
 *
 * The `WebGLRenderer` owns a single instance of the Pipeline Manager, which you can access
 * via the `WebGLRenderer.pipelines` property.
 *
 * By default, there are 8 pipelines installed into the Pipeline Manager when Phaser boots:
 *
 * 1. The Multi Pipeline. Responsible for all multi-texture rendering, i.e. Sprites and Tilemaps.
 * 2. The Graphics Pipeline. Responsible for rendering Graphics and Shape objects.
 * 3. The Rope Pipeline. Responsible for rendering the Rope Game Object.
 * 4. The Light Pipeline. Responsible for rendering the Light Game Object.
 * 5. The Point Light Pipeline. Responsible for rendering the Point Light Game Object.
 * 6. The Single Pipeline. Responsible for rendering Game Objects that explicitly require one bound texture.
 * 7. The Bitmap Mask Pipeline. Responsible for Bitmap Mask rendering.
 * 8. The Utility Pipeline. Responsible for providing lots of handy texture manipulation functions.
 *
 * You can add your own custom pipeline via the `PipelineManager.add` method. Pipelines are
 * identified by unique string-based keys.
 *
 * @class PipelineManager
 * @memberof Phaser.Renderer.WebGL
 * @constructor
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the WebGL Renderer that owns this Pipeline Manager.
 */
var PipelineManager = new Class({

    initialize:

    function PipelineManager (renderer)
    {
        /**
         * A reference to the Game instance.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#game
         * @type {Phaser.Game}
         * @since 3.50.0
         */
        this.game = renderer.game;

        /**
         * A reference to the WebGL Renderer instance.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#renderer
         * @type {Phaser.Renderer.WebGL.WebGLRenderer}
         * @since 3.50.0
         */
        this.renderer = renderer;

        /**
         * This map stores all pipeline classes available in this manager.
         *
         * The Utility Class must always come first.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#classes
         * @type {Phaser.Structs.Map.<string, Class>}
         * @since 3.50.0
         */
        this.classes = new CustomMap([
            [ CONST.UTILITY_PIPELINE, UtilityPipeline ],
            [ CONST.MULTI_PIPELINE, MultiPipeline ],
            [ CONST.BITMAPMASK_PIPELINE, BitmapMaskPipeline ],
            [ CONST.SINGLE_PIPELINE, SinglePipeline ],
            [ CONST.ROPE_PIPELINE, RopePipeline ],
            [ CONST.LIGHT_PIPELINE, LightPipeline ],
            [ CONST.POINTLIGHT_PIPELINE, PointLightPipeline ],
            [ CONST.GRAPHICS_PIPELINE, GraphicsPipeline ]
        ]);

        /**
         * This map stores all Post FX Pipeline classes available in this manager.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#postPipelineClasses
         * @type {Phaser.Structs.Map.<string, Class>}
         * @since 3.50.0
         */
        this.postPipelineClasses = new CustomMap();

        /**
         * This map stores all pipeline instances in this manager.
         *
         * This is populated with the default pipelines in the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#pipelines
         * @type {Phaser.Structs.Map.<string, Phaser.Renderer.WebGL.WebGLPipeline>}
         * @since 3.50.0
         */
        this.pipelines = new CustomMap();

        /**
         * Current pipeline in use by the WebGLRenderer.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#current
         * @type {Phaser.Renderer.WebGL.WebGLPipeline}
         * @default null
         * @since 3.50.0
         */
        this.current = null;

        /**
         * The previous WebGLPipeline that was in use.
         *
         * This is set when `clearPipeline` is called and restored in `rebindPipeline` if none is given.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#previous
         * @type {Phaser.Renderer.WebGL.WebGLPipeline}
         * @default null
         * @since 3.50.0
         */
        this.previous = null;

        /**
         * A constant-style reference to the Multi Pipeline Instance.
         *
         * This is the default Phaser 3 pipeline and is used by the WebGL Renderer to manage
         * camera effects and more. This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#MULTI_PIPELINE
         * @type {Phaser.Renderer.WebGL.Pipelines.MultiPipeline}
         * @default null
         * @since 3.50.0
         */
        this.MULTI_PIPELINE = null;

        /**
         * A constant-style reference to the Bitmap Mask Pipeline Instance.
         *
         * This is the default Phaser 3 mask pipeline and is used Game Objects using
         * a Bitmap Mask. This property is set during the `boot` method.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#BITMAPMASK_PIPELINE
         * @type {Phaser.Renderer.WebGL.Pipelines.BitmapMaskPipeline}
         * @default null
         * @since 3.50.0
         */
        this.BITMAPMASK_PIPELINE = null;

        /**
         * A constant-style reference to the Utility Pipeline Instance.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#UTILITY_PIPELINE
         * @type {Phaser.Renderer.WebGL.Pipelines.UtilityPipeline}
         * @default null
         * @since 3.50.0
         */
        this.UTILITY_PIPELINE = null;

        /**
         * A reference to the Full Frame 1 Render Target that belongs to the
         * Utility Pipeline. This property is set during the `boot` method.
         *
         * This Render Target is the full size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#fullFrame1
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @default null
         * @since 3.50.0
         */
        this.fullFrame1;

        /**
         * A reference to the Full Frame 2 Render Target that belongs to the
         * Utility Pipeline. This property is set during the `boot` method.
         *
         * This Render Target is the full size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#fullFrame2
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @default null
         * @since 3.50.0
         */
        this.fullFrame2;

        /**
         * A reference to the Half Frame 1 Render Target that belongs to the
         * Utility Pipeline. This property is set during the `boot` method.
         *
         * This Render Target is half the size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#halfFrame1
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @default null
         * @since 3.50.0
         */
        this.halfFrame1;

        /**
         * A reference to the Half Frame 2 Render Target that belongs to the
         * Utility Pipeline. This property is set during the `boot` method.
         *
         * This Render Target is half the size of the renderer.
         *
         * You can use this directly in Post FX Pipelines for multi-target effects.
         * However, be aware that these targets are shared between all post fx pipelines.
         *
         * @name Phaser.Renderer.WebGL.PipelineManager#halfFrame2
         * @type {Phaser.Renderer.WebGL.RenderTarget}
         * @default null
         * @since 3.50.0
         */
        this.halfFrame2;
    },

    /**
     * Internal boot handler, called by the WebGLRenderer durings its boot process.
     *
     * Adds all of the default pipelines, based on the game config, and then calls
     * the `boot` method on each one of them.
     *
     * Finally, the default pipeline is set.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#boot
     * @since 3.50.0
     *
     * @param {Phaser.Types.Core.PipelineConfig} [pipelineConfig] - The pipeline configuration object as set in the Game Config.
     */
    boot: function (pipelineConfig)
    {
        //  Install each of the default pipelines

        var instance;
        var pipelineName;

        var _this = this;
        var game = this.game;

        this.classes.each(function (pipelineName, pipeline)
        {
            instance = _this.add(pipelineName, new pipeline({ game: game }));

            if (pipelineName === CONST.UTILITY_PIPELINE)
            {
                _this.UTILITY_PIPELINE = instance;

                //  FBO references
                _this.fullFrame1 = instance.fullFrame1;
                _this.fullFrame2 = instance.fullFrame2;
                _this.halfFrame1 = instance.halfFrame1;
                _this.halfFrame2 = instance.halfFrame2;
            }
        });

        //  Our const-like references
        this.MULTI_PIPELINE = this.get(CONST.MULTI_PIPELINE);
        this.BITMAPMASK_PIPELINE = this.get(CONST.BITMAPMASK_PIPELINE);

        //  And now the ones in the config, if any

        if (pipelineConfig)
        {
            for (pipelineName in pipelineConfig)
            {
                var pipelineClass = pipelineConfig[pipelineName];

                instance = new pipelineClass(game);

                if (instance.isPostFX)
                {
                    this.postPipelineClasses.set(pipelineName, pipelineClass);
                }
                else if (!this.has(pipelineName))
                {
                    this.classes.set(pipelineName, pipelineClass);

                    this.add(pipelineName, instance);
                }
            }
        }
    },

    /**
     * Adds a pipeline instance to this Pipeline Manager.
     *
     * The name of the instance must be unique within this manager.
     *
     * Make sure to pass an instance to this method, not a base class.
     *
     * For example, you should pass it like this:
     *
     * ```javascript
     * this.add('yourName', new CustomPipeline());`
     * ```
     *
     * and **not** like this:
     *
     * ```javascript
     * this.add('yourName', CustomPipeline);`
     * ```
     *
     * To add a **Post Pipeline**, see `addPostPipeline` instead.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#add
     * @since 3.50.0
     *
     * @param {string} name - A unique string-based key for the pipeline within the manager.
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - A pipeline _instance_ which must extend `WebGLPipeline`.
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} The pipeline instance that was passed.
     */
    add: function (name, pipeline)
    {
        if (pipeline.isPostFX)
        {
            console.warn(name + ' is a Post Pipeline. Use `addPostPipeline` instead');

            return;
        }

        var pipelines = this.pipelines;
        var renderer = this.renderer;

        if (!pipelines.has(name))
        {
            pipeline.name = name;
            pipeline.manager = this;

            pipelines.set(name, pipeline);
        }
        else
        {
            console.warn('Pipeline exists: ' + name);
        }

        if (!pipeline.hasBooted)
        {
            pipeline.boot();
        }

        if (renderer.width !== 0 && renderer.height !== 0)
        {
            pipeline.resize(renderer.width, renderer.height);
        }

        return pipeline;
    },

    /**
     * Adds a Post Pipeline to this Pipeline Manager.
     *
     * Make sure to pass a base class to this method, not an instance.
     *
     * For example, you should pass it like this:
     *
     * ```javascript
     * this.addPostPipeline('yourName', CustomPipeline);`
     * ```
     *
     * and **not** like this:
     *
     * ```javascript
     * this.addPostPipeline('yourName', new CustomPipeline());`
     * ```
     *
     * To add a regular pipeline, see the `add` method instead.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#addPostPipeline
     * @since 3.50.0
     *
     * @param {string} name - A unique string-based key for the pipeline within the manager.
     * @param {function} pipeline - A pipeline class which must extend `PostFXPipeline`.
     *
     * @return {this} This Pipeline Manager.
     */
    addPostPipeline: function (name, pipeline)
    {
        if (!this.postPipelineClasses.has(name))
        {
            this.postPipelineClasses.set(name, pipeline);
        }
    },

    /**
     * Flushes the current pipeline, if one is bound.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#flush
     * @since 3.50.0
     */
    flush: function ()
    {
        if (this.current)
        {
            this.current.flush();
        }
    },

    /**
     * Checks if a pipeline is present in this Pipeline Manager.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#has
     * @since 3.50.0
     *
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} pipeline - Either the string-based name of the pipeline to get, or a pipeline instance to look-up.
     *
     * @return {boolean} `true` if the given pipeline is loaded, otherwise `false`.
     */
    has: function (pipeline)
    {
        var pipelines = this.pipelines;

        if (typeof pipeline === 'string')
        {
            return pipelines.has(pipeline);
        }
        else if (pipelines.contains(pipeline))
        {
            return true;
        }

        return false;
    },

    /**
     * Returns the pipeline instance based on the given name, or instance.
     *
     * If no instance, or matching name, exists in this manager, it returns `undefined`.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#get
     * @since 3.50.0
     *
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} pipeline - Either the string-based name of the pipeline to get, or a pipeline instance to look-up.
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} The pipeline instance, or `undefined` if not found.
     */
    get: function (pipeline)
    {
        var pipelines = this.pipelines;

        if (typeof pipeline === 'string')
        {
            return pipelines.get(pipeline);
        }
        else if (pipelines.contains(pipeline))
        {
            return pipeline;
        }
    },

    /**
     * Returns a _new instance_ of the post pipeline based on the given name, or class.
     *
     * If no instance, or matching name, exists in this manager, it returns `undefined`.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#getPostPipeline
     * @since 3.50.0
     *
     * @param {(string|function|Phaser.Renderer.WebGL.Pipelines.PostFXPipeline)} pipeline - Either the string-based name of the pipeline to get, or a pipeline instance, or class to look-up.
     * @param {Phaser.GameObjects.GameObject} [gameObject] - If this post pipeline is being installed into a Game Object or Camera, this is a reference to it.
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.PostFXPipeline} The pipeline instance, or `undefined` if not found.
     */
    getPostPipeline: function (pipeline, gameObject)
    {
        var pipelineClasses = this.postPipelineClasses;

        var instance;

        if (typeof pipeline === 'string')
        {
            instance = pipelineClasses.get(pipeline);
        }
        else if (typeof pipeline === 'function')
        {
            //  A class
            if (pipelineClasses.contains(pipeline))
            {
                instance = pipeline;
            }
        }
        else if (typeof pipeline === 'object')
        {
            //  Instance
            instance = pipelineClasses.get(pipeline.name);
        }

        if (instance)
        {
            var newPipeline = new instance(this.game);

            if (gameObject)
            {
                newPipeline.gameObject = gameObject;
            }

            return newPipeline;
        }
    },

    /**
     * Removes a pipeline instance based on the given name.
     *
     * If no pipeline matches the name, this method does nothing.
     *
     * Note that the pipeline will not be flushed or destroyed, it's simply removed from
     * this manager.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#remove
     * @since 3.50.0
     *
     * @param {string} name - The name of the pipeline to be removed.
     * @param {boolean} [removeClass=true] - Remove the pipeline class as well as the instance?
     * @param {boolean} [removePostPipelineClass=true] - Remove the post pipeline class as well as the instance?
     */
    remove: function (name, removeClass, removePostPipelineClass)
    {
        if (removeClass === undefined) { removeClass = true; }
        if (removePostPipelineClass === undefined) { removePostPipelineClass = true; }

        this.pipelines.delete(name);

        if (removeClass)
        {
            this.classes.delete(name);
        }

        if (removePostPipelineClass)
        {
            this.postPipelineClasses.delete(name);
        }
    },

    /**
     * Sets the current pipeline to be used by the `WebGLRenderer`.
     *
     * This method accepts a pipeline instance as its parameter, not the name.
     *
     * If the pipeline isn't already the current one it will call `WebGLPipeline.bind` and then `onBind`.
     *
     * You cannot set Post FX Pipelines using this method. To use a Post FX Pipeline, you should
     * apply it to either a Camera, Container or other supporting Game Object.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#set
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The pipeline instance to be set as current.
     * @param {Phaser.GameObjects.GameObject} [gameObject] - The Game Object that invoked this pipeline, if any.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [currentShader] - The shader to set as being current.
     *
     * @return {Phaser.Renderer.WebGL.WebGLPipeline} The pipeline that was set, or undefined if it couldn't be set.
     */
    set: function (pipeline, gameObject, currentShader)
    {
        if (pipeline.isPostFX)
        {
            return;
        }

        if (!this.isCurrent(pipeline, currentShader))
        {
            this.flush();

            if (this.current)
            {
                this.current.unbind();
            }

            this.current = pipeline;

            pipeline.bind(currentShader);
        }

        pipeline.updateProjectionMatrix();

        pipeline.onBind(gameObject);

        return pipeline;
    },

    /**
     * This method is called by the `WebGLPipeline.batchQuad` method, right before a quad
     * belonging to a Game Object is about to be added to the batch. It causes a batch
     * flush, then calls the `preBatch` method on the post-fx pipelines belonging to the
     * Game Object.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#preBatch
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object about to be batched.
     */
    preBatch: function (gameObject)
    {
        if (gameObject.hasPostPipeline)
        {
            this.flush();

            var pipelines = gameObject.postPipelines;

            //  Iterate in reverse because we need them stacked in the order they're in the array
            for (var i = pipelines.length - 1; i >= 0; i--)
            {
                var pipeline = pipelines[i];

                if (pipeline.active)
                {
                    pipeline.preBatch(gameObject);
                }
            }
        }
    },

    /**
     * This method is called by the `WebGLPipeline.batchQuad` method, right after a quad
     * belonging to a Game Object has been added to the batch. It causes a batch
     * flush, then calls the `postBatch` method on the post-fx pipelines belonging to the
     * Game Object.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#postBatch
     * @since 3.50.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object that was just added to the batch.
     */
    postBatch: function (gameObject)
    {
        if (gameObject.hasPostPipeline)
        {
            this.flush();

            var pipelines = gameObject.postPipelines;

            for (var i = 0; i < pipelines.length; i++)
            {
                var pipeline = pipelines[i];

                if (pipeline.active)
                {
                    pipeline.postBatch(gameObject);
                }
            }
        }
    },

    /**
     * Called at the start of the `WebGLRenderer.preRenderCamera` method.
     *
     * If the Camera has post pipelines set, it will flush the batch and then call the
     * `preBatch` method on the post-fx pipelines belonging to the Camera.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#preBatchCamera
     * @since 3.50.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera about to be rendered.
     */
    preBatchCamera: function (camera)
    {
        if (camera.hasPostPipeline)
        {
            this.flush();

            var pipelines = camera.postPipelines;

            //  Iterate in reverse because we need them stacked in the order they're in the array
            for (var i = pipelines.length - 1; i >= 0; i--)
            {
                var pipeline = pipelines[i];

                if (pipeline.active)
                {
                    pipeline.preBatch(camera);
                }
            }
        }
    },

    /**
     * Called at the end of the `WebGLRenderer.postRenderCamera` method.
     *
     * If the Camera has post pipelines set, it will flush the batch and then call the
     * `postBatch` method on the post-fx pipelines belonging to the Camera.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#postBatchCamera
     * @since 3.50.0
     *
     * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that was just rendered.
     */
    postBatchCamera: function (camera)
    {
        if (camera.hasPostPipeline)
        {
            this.flush();

            var pipelines = camera.postPipelines;

            for (var i = 0; i < pipelines.length; i++)
            {
                var pipeline = pipelines[i];

                if (pipeline.active)
                {
                    pipeline.postBatch(camera);
                }
            }
        }
    },

    /**
     * Checks to see if the given pipeline is already the active pipeline, both within this
     * Pipeline Manager and also has the same shader set in the Renderer.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#isCurrent
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The pipeline instance to be checked.
     * @param {Phaser.Renderer.WebGL.WebGLShader} [currentShader] - The shader to set as being current.
     *
     * @return {boolean} `true` if the given pipeline is already the current pipeline, otherwise `false`.
     */
    isCurrent: function (pipeline, currentShader)
    {
        var renderer = this.renderer;
        var current = this.current;

        if (current && !currentShader)
        {
            currentShader = current.currentShader;
        }

        return !(current !== pipeline || currentShader.program !== renderer.currentProgram);
    },

    /**
     * Copy the `source` Render Target to the `target` Render Target.
     *
     * You can optionally set the brightness factor of the copy.
     *
     * The difference between this method and `drawFrame` is that this method
     * uses a faster copy shader, where only the brightness can be modified.
     * If you need color level manipulation, see `drawFrame` instead.
     *
     * The copy itself is handled by the Utility Pipeline.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#copyFrame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The target Render Target.
     * @param {number} [brightness=1] - The brightness value applied to the frame copy.
     * @param {boolean} [clear=true] - Clear the target before copying?
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     *
     * @return {this} This Pipeline Manager instance.
     */
    copyFrame: function (source, target, brightness, clear, clearAlpha)
    {
        this.setUtility(this.UTILITY_PIPELINE.copyShader).copyFrame(source, target, brightness, clear, clearAlpha);

        return this;
    },

    /**
     * Pops the framebuffer from the renderers FBO stack and sets that as the active target,
     * then draws the `source` Render Target to it. It then resets the renderer textures.
     *
     * This should be done when you need to draw the _final_ results of a pipeline to the game
     * canvas, or the next framebuffer in line on the FBO stack. You should only call this once
     * in the `onDraw` handler and it should be the final thing called. Be careful not to call
     * this if you need to actually use the pipeline shader, instead of the copy shader. In
     * those cases, use the `bindAndDraw` method.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#copyToGame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The Render Target to draw from.
     */
    copyToGame: function (source)
    {
        this.setUtility(this.UTILITY_PIPELINE.copyShader).copyToGame(source);

        return this;
    },

    /**
     * Copy the `source` Render Target to the `target` Render Target, using the
     * given Color Matrix.
     *
     * The difference between this method and `copyFrame` is that this method
     * uses a color matrix shader, where you have full control over the luminance
     * values used during the copy. If you don't need this, you can use the faster
     * `copyFrame` method instead.
     *
     * The copy itself is handled by the Utility Pipeline.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#drawFrame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The target Render Target.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     * @param {Phaser.Display.ColorMatrix} [colorMatrix] - The Color Matrix to use when performing the draw.
     *
     * @return {this} This Pipeline Manager instance.
     */
    drawFrame: function (source, target, clearAlpha, colorMatrix)
    {
        this.setUtility(this.UTILITY_PIPELINE.colorMatrixShader).drawFrame(source, target, clearAlpha, colorMatrix);

        return this;
    },

    /**
     * Draws the `source1` and `source2` Render Targets to the `target` Render Target
     * using a linear blend effect, which is controlled by the `strength` parameter.
     *
     * The draw itself is handled by the Utility Pipeline.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#blendFrames
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source1 - The first source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} source2 - The second source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The target Render Target.
     * @param {number} [strength=1] - The strength of the blend.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     *
     * @return {this} This Pipeline Manager instance.
     */
    blendFrames: function (source1, source2, target, strength, clearAlpha)
    {
        this.setUtility(this.UTILITY_PIPELINE.linearShader).blendFrames(source1, source2, target, strength, clearAlpha);

        return this;
    },

    /**
     * Draws the `source1` and `source2` Render Targets to the `target` Render Target
     * using an additive blend effect, which is controlled by the `strength` parameter.
     *
     * The draw itself is handled by the Utility Pipeline.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#blendFramesAdditive
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source1 - The first source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} source2 - The second source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} [target] - The target Render Target.
     * @param {number} [strength=1] - The strength of the blend.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     *
     * @return {this} This Pipeline Manager instance.
     */
    blendFramesAdditive: function (source1, source2, target, strength, clearAlpha)
    {
        this.setUtility(this.UTILITY_PIPELINE.addShader).blendFramesAdditive(source1, source2, target, strength, clearAlpha);

        return this;
    },

    /**
     * Clears the given Render Target.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#clearFrame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The Render Target to clear.
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     *
     * @return {this} This Pipeline Manager instance.
     */
    clearFrame: function (target, clearAlpha)
    {
        this.UTILITY_PIPELINE.clearFrame(target, clearAlpha);

        return this;
    },

    /**
     * Copy the `source` Render Target to the `target` Render Target.
     *
     * The difference with this copy is that no resizing takes place. If the `source`
     * Render Target is larger than the `target` then only a portion the same size as
     * the `target` dimensions is copied across.
     *
     * You can optionally set the brightness factor of the copy.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#blitFrame
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The target Render Target.
     * @param {number} [brightness=1] - The brightness value applied to the frame copy.
     * @param {boolean} [clear=true] - Clear the target before copying?
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     * @param {boolean} [eraseMode=false] - Erase source from target using ERASE Blend Mode?
     *
     * @return {this} This Pipeline Manager instance.
     */
    blitFrame: function (source, target, brightness, clear, clearAlpha, eraseMode)
    {
        this.setUtility(this.UTILITY_PIPELINE.copyShader).blitFrame(source, target, brightness, clear, clearAlpha, eraseMode);

        return this;
    },

    /**
     * Binds the `source` Render Target and then copies a section of it to the `target` Render Target.
     *
     * This method is extremely fast because it uses `gl.copyTexSubImage2D` and doesn't
     * require the use of any shaders. Remember the coordinates are given in standard WebGL format,
     * where x and y specify the lower-left corner of the section, not the top-left. Also, the
     * copy entirely replaces the contents of the target texture, no 'merging' or 'blending' takes
     * place.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#copyFrameRect
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.RenderTarget} source - The source Render Target.
     * @param {Phaser.Renderer.WebGL.RenderTarget} target - The target Render Target.
     * @param {number} x - The x coordinate of the lower left corner where to start copying.
     * @param {number} y - The y coordinate of the lower left corner where to start copying.
     * @param {number} width - The width of the texture.
     * @param {number} height - The height of the texture.
     * @param {boolean} [clear=true] - Clear the target before copying?
     * @param {boolean} [clearAlpha=true] - Clear the alpha channel when running `gl.clear` on the target?
     *
     * @return {this} This Pipeline Manager instance.
     */
    copyFrameRect: function (source, target, x, y, width, height, clear, clearAlpha)
    {
        this.UTILITY_PIPELINE.copyFrameRect(source, target, x, y, width, height, clear, clearAlpha);

        return this;
    },

    /**
     * Returns `true` if the current pipeline is forced to use texture unit zero.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#forceZero
     * @since 3.50.0
     *
     * @return {boolean} `true` if the current pipeline is forced to use texture unit zero.
     */
    forceZero: function ()
    {
        return (this.current && this.current.forceZero);
    },

    /**
     * Sets the Multi Pipeline to be the currently bound pipeline.
     *
     * This is the default Phaser 3 rendering pipeline.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#setMulti
     * @since 3.50.0
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.MultiPipeline} The Multi Pipeline instance.
     */
    setMulti: function ()
    {
        return this.set(this.MULTI_PIPELINE);
    },

    /**
     * Sets the Utility Pipeline to be the currently bound pipeline.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#setUtility
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLShader} [currentShader] - The shader to set as being current.
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.UtilityPipeline} The Utility Pipeline instance.
     */
    setUtility: function (currentShader)
    {
        return this.UTILITY_PIPELINE.bind(currentShader);
    },

    /**
     * Use this to reset the gl context to the state that Phaser requires to continue rendering.
     *
     * Calling this will:
     *
     * * Disable `DEPTH_TEST`, `CULL_FACE` and `STENCIL_TEST`.
     * * Clear the depth buffer and stencil buffers.
     * * Reset the viewport size.
     * * Reset the blend mode.
     * * Bind a blank texture as the active texture on texture unit zero.
     * * Rebinds the given pipeline instance.
     *
     * You should call this if you have previously called `clear`, and then wish to return
     * rendering control to Phaser again.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#rebind
     * @since 3.50.0
     *
     * @param {Phaser.Renderer.WebGL.WebGLPipeline} [pipeline] - The pipeline instance to be rebound. If not given, the previous pipeline will be bound.
     */
    rebind: function (pipeline)
    {
        if (pipeline === undefined && this.previous)
        {
            pipeline = this.previous;
        }

        var renderer = this.renderer;
        var gl = renderer.gl;

        gl.disable(gl.DEPTH_TEST);
        gl.disable(gl.CULL_FACE);

        if (renderer.hasActiveStencilMask())
        {
            gl.clear(gl.DEPTH_BUFFER_BIT);
        }
        else
        {
            //  If there wasn't a stencil mask set before this call, we can disable it safely
            gl.disable(gl.STENCIL_TEST);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.STENCIL_BUFFER_BIT);
        }

        gl.viewport(0, 0, renderer.width, renderer.height);

        renderer.currentProgram = null;

        renderer.setBlendMode(0, true);

        if (pipeline)
        {
            this.current = pipeline;

            pipeline.rebind();
        }

        renderer.resetTextures();
    },

    /**
     * Flushes the current pipeline being used and then clears it, along with the
     * the current shader program and vertex buffer from the `WebGLRenderer`.
     *
     * Then resets the blend mode to NORMAL.
     *
     * Call this before jumping to your own gl context handler, and then call `rebind` when
     * you wish to return control to Phaser again.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#clear
     * @since 3.50.0
     */
    clear: function ()
    {
        var renderer = this.renderer;

        this.flush();

        if (this.current)
        {
            this.current.unbind();
            this.previous = this.current;
            this.current = null;
        }
        else
        {
            this.previous = null;
        }

        renderer.currentProgram = null;

        renderer.setBlendMode(0, true);
    },

    /**
     * Destroy the Pipeline Manager, cleaning up all related resources and references.
     *
     * @method Phaser.Renderer.WebGL.PipelineManager#destroy
     * @since 3.50.0
     */
    destroy: function ()
    {
        this.flush();

        this.classes.clear();
        this.postPipelineClasses.clear();
        this.pipelines.clear();

        this.renderer = null;
        this.game = null;
        this.classes = null;
        this.postPipelineClasses = null;
        this.pipelines = null;
        this.current = null;
        this.previous = null;
    }

});

module.exports = PipelineManager;
