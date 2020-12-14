/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DeepCopy = require('../../utils/object/DeepCopy');
var PIPELINE_CONST = require('../../renderer/webgl/pipelines/const');
var SpliceOne = require('../../utils/array/SpliceOne');

/**
 * Provides methods used for setting the WebGL rendering pipeline of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.Pipeline
 * @webglOnly
 * @since 3.0.0
 */

var Pipeline = {

    /**
     * The initial WebGL pipeline of this Game Object.
     *
     * If you call `resetPipeline` on this Game Object, the pipeline is reset to this default.
     *
     * @name Phaser.GameObjects.Components.Pipeline#defaultPipeline
     * @type {Phaser.Renderer.WebGL.WebGLPipeline}
     * @default null
     * @webglOnly
     * @since 3.0.0
     */
    defaultPipeline: null,

    /**
     * The current WebGL pipeline of this Game Object.
     *
     * @name Phaser.GameObjects.Components.Pipeline#pipeline
     * @type {Phaser.Renderer.WebGL.WebGLPipeline}
     * @default null
     * @webglOnly
     * @since 3.0.0
     */
    pipeline: null,

    /**
     * Does this Game Object have any Post Pipelines set?
     *
     * @name Phaser.GameObjects.Components.Pipeline#hasPostPipeline
     * @type {boolean}
     * @webglOnly
     * @since 3.50.0
     */
    hasPostPipeline: false,

    /**
     * The WebGL Post FX Pipelines this Game Object uses for post-render effects.
     *
     * The pipelines are processed in the order in which they appear in this array.
     *
     * If you modify this array directly, be sure to set the
     * `hasPostPipeline` property accordingly.
     *
     * @name Phaser.GameObjects.Components.Pipeline#postPipeline
     * @type {Phaser.Renderer.WebGL.Pipelines.PostFXPipeline[]}
     * @webglOnly
     * @since 3.50.0
     */
    postPipelines: null,

    /**
     * An object to store pipeline specific data in, to be read by the pipelines this Game Object uses.
     *
     * @name Phaser.GameObjects.Components.Pipeline#pipelineData
     * @type {object}
     * @webglOnly
     * @since 3.50.0
     */
    pipelineData: null,

    /**
     * Sets the initial WebGL Pipeline of this Game Object.
     *
     * This should only be called during the instantiation of the Game Object. After that, use `setPipeline`.
     *
     * @method Phaser.GameObjects.Components.Pipeline#initPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} pipeline - Either the string-based name of the pipeline, or a pipeline instance to set.
     *
     * @return {boolean} `true` if the pipeline was set successfully, otherwise `false`.
     */
    initPipeline: function (pipeline)
    {
        if (pipeline === undefined) { pipeline = PIPELINE_CONST.MULTI_PIPELINE; }

        var renderer = this.scene.sys.renderer;
        var pipelines = renderer.pipelines;

        this.postPipelines = [];
        this.pipelineData = {};

        if (pipelines)
        {
            var instance = pipelines.get(pipeline);

            if (instance)
            {
                this.defaultPipeline = instance;
                this.pipeline = instance;

                return true;
            }
        }

        return false;
    },

    /**
     * Sets the main WebGL Pipeline of this Game Object.
     *
     * Also sets the `pipelineData` property, if the parameter is given.
     *
     * Both the pipeline and post pipelines share the same pipeline data object.
     *
     * @method Phaser.GameObjects.Components.Pipeline#setPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} pipeline - Either the string-based name of the pipeline, or a pipeline instance to set.
     * @param {object} [pipelineData] - Optional pipeline data object that is _deep copied_ into the `pipelineData` property of this Game Object.
     * @param {boolean} [copyData=true] - Should the pipeline data object be _deep copied_ into the `pipelineData` property of this Game Object? If `false` it will be set by reference instead.
     *
     * @return {this} This Game Object instance.
     */
    setPipeline: function (pipeline, pipelineData, copyData)
    {
        var renderer = this.scene.sys.renderer;
        var pipelines = renderer.pipelines;

        if (pipelines)
        {
            var instance = pipelines.get(pipeline);

            if (instance)
            {
                this.pipeline = instance;
            }

            if (pipelineData)
            {
                this.pipelineData = (copyData) ? DeepCopy(pipelineData) : pipelineData;
            }
        }

        return this;
    },

    /**
     * Sets one, or more, Post Pipelines on this Game Object.
     *
     * Post Pipelines are invoked after this Game Object has rendered to its target and
     * are commonly used for post-fx.
     *
     * The post pipelines are appended to the `postPipelines` array belonging to this
     * Game Object. When the renderer processes this Game Object, it iterates through the post
     * pipelines in the order in which they appear in the array. If you are stacking together
     * multiple effects, be aware that the order is important.
     *
     * If you call this method multiple times, the new pipelines will be appended to any existing
     * post pipelines already set. Use the `resetPostPipeline` method to clear them first, if required.
     *
     * You can optionally also sets the `pipelineData` property, if the parameter is given.
     *
     * Both the pipeline and post pipelines share the pipeline data object together.
     *
     * @method Phaser.GameObjects.Components.Pipeline#setPostPipeline
     * @webglOnly
     * @since 3.50.0
     *
     * @param {(string|string[]|function|function[]|Phaser.Renderer.WebGL.Pipelines.PostFXPipeline|Phaser.Renderer.WebGL.Pipelines.PostFXPipeline[])} pipelines - Either the string-based name of the pipeline, or a pipeline instance, or class, or an array of them.
     * @param {object} [pipelineData] - Optional pipeline data object that is _deep copied_ into the `pipelineData` property of this Game Object.
     * @param {boolean} [copyData=true] - Should the pipeline data object be _deep copied_ into the `pipelineData` property of this Game Object? If `false` it will be set by reference instead.
     *
     * @return {this} This Game Object instance.
     */
    setPostPipeline: function (pipelines, pipelineData, copyData)
    {
        var renderer = this.scene.sys.renderer;
        var pipelineManager = renderer.pipelines;

        if (pipelineManager)
        {
            if (!Array.isArray(pipelines))
            {
                pipelines = [ pipelines ];
            }

            for (var i = 0; i < pipelines.length; i++)
            {
                var instance = pipelineManager.getPostPipeline(pipelines[i], this);

                if (instance)
                {
                    this.postPipelines.push(instance);
                }
            }

            if (pipelineData)
            {
                this.pipelineData = (copyData) ? DeepCopy(pipelineData) : pipelineData;
            }
        }

        this.hasPostPipeline = (this.postPipelines.length > 0);

        return this;
    },

    /**
     * Adds an entry to the `pipelineData` object belonging to this Game Object.
     *
     * If the 'key' already exists, its value is updated. If it doesn't exist, it is created.
     *
     * If `value` is undefined, and `key` exists, `key` is removed from the data object.
     *
     * Both the pipeline and post pipelines share the pipeline data object together.
     *
     * @method Phaser.GameObjects.Components.Pipeline#setPipelineData
     * @webglOnly
     * @since 3.50.0
     *
     * @param {string} key - The key of the pipeline data to set, update, or delete.
     * @param {any} [value] - The value to be set with the key. If `undefined` then `key` will be deleted from the object.
     *
     * @return {this} This Game Object instance.
     */
    setPipelineData: function (key, value)
    {
        var data = this.pipelineData;

        if (value === undefined)
        {
            delete data[key];
        }
        else
        {
            data[key] = value;
        }

        return this;
    },

    /**
     * Gets a Post Pipeline instance from this Game Object, based on the given name, and returns it.
     *
     * @method Phaser.GameObjects.Components.Pipeline#getPostPipeline
     * @webglOnly
     * @since 3.50.0
     *
     * @param {(string|function|Phaser.Renderer.WebGL.Pipelines.PostFXPipeline)} pipeline - The string-based name of the pipeline, or a pipeline class.
     *
     * @return {Phaser.Renderer.WebGL.Pipelines.PostFXPipeline} The first Post Pipeline matching the name, or undefined if no match.
     */
    getPostPipeline: function (pipeline)
    {
        var pipelines = this.postPipelines;

        for (var i = 0; i < pipelines.length; i++)
        {
            var instance = pipelines[i];

            if ((typeof pipeline === 'string' && instance.name === pipeline) || instance instanceof pipeline)
            {
                return instance;
            }
        }
    },

    /**
     * Resets the WebGL Pipeline of this Game Object back to the default it was created with.
     *
     * @method Phaser.GameObjects.Components.Pipeline#resetPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {boolean} [resetPostPipelines=false] - Reset all of the post pipelines?
     * @param {boolean} [resetData=false] - Reset the `pipelineData` object to being an empty object?
     *
     * @return {boolean} `true` if the pipeline was reset successfully, otherwise `false`.
     */
    resetPipeline: function (resetPostPipelines, resetData)
    {
        if (resetPostPipelines === undefined) { resetPostPipelines = false; }
        if (resetData === undefined) { resetData = false; }

        this.pipeline = this.defaultPipeline;

        if (resetPostPipelines)
        {
            this.postPipelines = [];
            this.hasPostPipeline = false;
        }

        if (resetData)
        {
            this.pipelineData = {};
        }

        return (this.pipeline !== null);
    },

    /**
     * Resets the WebGL Post Pipelines of this Game Object. It does this by calling
     * the `destroy` method on each post pipeline and then clearing the local array.
     *
     * @method Phaser.GameObjects.Components.Pipeline#resetPostPipeline
     * @webglOnly
     * @since 3.50.0
     *
     * @param {boolean} [resetData=false] - Reset the `pipelineData` object to being an empty object?
     */
    resetPostPipeline: function (resetData)
    {
        if (resetData === undefined) { resetData = false; }

        var pipelines = this.postPipelines;

        for (var i = 0; i < pipelines.length; i++)
        {
            pipelines[i].destroy();
        }

        this.postPipelines = [];
        this.hasPostPipeline = false;

        if (resetData)
        {
            this.pipelineData = {};
        }
    },

    /**
     * Removes a single Post Pipeline instance from this Game Object, based on the given name, and destroys it.
     *
     * If you wish to remove all Post Pipelines use the `resetPostPipeline` method instead.
     *
     * @method Phaser.GameObjects.Components.Pipeline#removePostPipeline
     * @webglOnly
     * @since 3.50.0
     *
     * @param {string|Phaser.Renderer.WebGL.Pipelines.PostFXPipeline} pipeline - The string-based name of the pipeline, or a pipeline class.
     *
     * @return {this} This Game Object.
     */
    removePostPipeline: function (pipeline)
    {
        var pipelines = this.postPipelines;

        for (var i = 0; i < pipelines.length; i++)
        {
            var instance = pipelines[i];

            if (
                (typeof pipeline === 'string' && instance.name === pipeline) ||
                (typeof pipeline !== 'string' && instance instanceof pipeline))
            {
                instance.destroy();

                SpliceOne(pipelines, i);

                return this;
            }
        }

        return this;
    },

    /**
     * Gets the name of the WebGL Pipeline this Game Object is currently using.
     *
     * @method Phaser.GameObjects.Components.Pipeline#getPipelineName
     * @webglOnly
     * @since 3.0.0
     *
     * @return {string} The string-based name of the pipeline being used by this Game Object.
     */
    getPipelineName: function ()
    {
        return this.pipeline.name;
    }

};

module.exports = Pipeline;
