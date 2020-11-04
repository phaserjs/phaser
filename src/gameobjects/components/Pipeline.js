/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DeepCopy = require('../../utils/object/DeepCopy');
var PIPELINE_CONST = require('../../renderer/webgl/pipelines/const');

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
     * The WebGL Pipeline this Game Object uses for post-render effects.
     *
     * @name Phaser.GameObjects.Components.Pipeline#postPipeline
     * @type {Phaser.Renderer.WebGL.WebGLPipeline}
     * @default null
     * @webglOnly
     * @since 3.50.0
     */
    postPipeline: null,

    /**
     * An object to store pipeline specific data in, to be read by the pipelines this Game Object uses.
     *
     * @name Phaser.GameObjects.Components.Pipeline#pipelineData
     * @type {object}
     * @webglOnly
     * @since 3.50.0
     */
    pipelineData: {},

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
     * Sets the main WebGL Pipeline of this Game Object, and optionally the post-render pipeline as well.
     *
     * Also sets the `pipelineData` property, if the parameter is given.
     *
     * Both the pipeline and post pipeline share the pipeline data object together.
     *
     * @method Phaser.GameObjects.Components.Pipeline#setPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} pipeline - Either the string-based name of the pipeline, or a pipeline instance to set.
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} [postPipeline] - The post-render pipeline. Set to `null` to skip if you need to set `pipelineData`. Can be either the string-based name of the pipeline, or a pipeline instance to set.
     * @param {object} [pipelineData] - Optional pipeline data object that is _deep copied_ into the `pipelineData` property of this Game Object.
     * @param {boolean} [copyData=true] - Should the pipeline data object be _deep copied_ into the `pipelineData` property of this Game Object? If `false` it will be set by reference instead.
     *
     * @return {this} This Game Object instance.
     */
    setPipeline: function (pipeline, postPipeline, pipelineData, copyData)
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

            if (postPipeline)
            {
                instance = pipelines.get(postPipeline);

                if (instance)
                {
                    this.postPipeline = instance;
                }
            }

            if (pipelineData)
            {
                this.pipelineData = (copyData) ? DeepCopy(pipelineData) : pipelineData;
            }
        }

        return this;
    },

    /**
     * Sets the post-render WebGL Pipeline of this Game Object.
     *
     * Post Pipelines are invoked after this Game Object has rendered to its target and
     * are commonly used for post-fx.
     *
     * Also sets the `pipelineData` property, if the parameter is given and the pipeline is successfully set.
     *
     * Both the pipeline and post pipeline share the pipeline data object together.
     *
     * @method Phaser.GameObjects.Components.Pipeline#setPostPipeline
     * @webglOnly
     * @since 3.50.0
     *
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} pipeline - Either the string-based name of the pipeline, or a pipeline instance to set.
     * @param {object} [pipelineData] - Optional pipeline data object that is _deep copied_ into the `pipelineData` property of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setPostPipeline: function (pipeline, pipelineData)
    {
        var renderer = this.scene.sys.renderer;
        var pipelines = renderer.pipelines;

        if (pipelines)
        {
            var instance = pipelines.get(pipeline);

            if (instance)
            {
                this.postPipeline = instance;

                if (pipelineData)
                {
                    this.pipelineData = DeepCopy(pipelineData);
                }
            }
        }

        return this;
    },

    /**
     * Adds an entry to the `pipelineData` object belonging to this Game Object.
     *
     * If the 'key' already exists, its value is updated. If it doesn't exist, it is created.
     *
     * If `value` is undefined, and `key` exists, `key` is removed from the data object.
     *
     * Both the pipeline and post pipeline share the pipeline data object together.
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
     * Resets the WebGL Pipeline of this Game Object back to the default it was created with.
     *
     * @method Phaser.GameObjects.Components.Pipeline#resetPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {boolean} [resetPostPipeline=false] - Reset the `postPipeline`?
     * @param {boolean} [resetData=false] - Reset the `pipelineData` object to being an empty object?
     *
     * @return {boolean} `true` if the pipeline was reset successfully, otherwise `false`.
     */
    resetPipeline: function (resetPostPipeline, resetData)
    {
        if (resetPostPipeline === undefined) { resetPostPipeline = false; }
        if (resetData === undefined) { resetData = false; }

        this.pipeline = this.defaultPipeline;

        if (resetPostPipeline)
        {
            this.postPipeline = null;
        }

        if (resetData)
        {
            this.pipelineData = {};
        }

        return (this.pipeline !== null);
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
    },

    /**
     * Gets the name of the Post Pipeline this Game Object is currently using, if any.
     *
     * @method Phaser.GameObjects.Components.Pipeline#getPostPipelineName
     * @webglOnly
     * @since 3.50.0
     *
     * @return {string} The string-based name of the post pipeline being used by this Game Object.
     */
    getPostPipelineName: function ()
    {
        return (this.postPipeline) ? this.postPipeline.name : '';
    }

};

module.exports = Pipeline;
