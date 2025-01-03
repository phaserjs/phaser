/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DeepCopy = require('../../utils/object/DeepCopy');

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
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} [pipeline] - Either the string-based name of the pipeline, or a pipeline instance to set.
     *
     * @return {boolean} `true` if the pipeline was set successfully, otherwise `false`.
     */
    initPipeline: function (pipeline)
    {
        this.pipelineData = {};

        var renderer = this.scene.sys.renderer;

        if (!renderer)
        {
            return false;
        }

        var pipelines = renderer.pipelines;

        if (pipelines)
        {
            if (pipeline === undefined)
            {
                pipeline = pipelines.default;
            }

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
     * @method Phaser.GameObjects.Components.Pipeline#setPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {(string|Phaser.Renderer.WebGL.WebGLPipeline)} pipeline - Either the string-based name of the pipeline, or a pipeline instance to set.
     * @param {object} [pipelineData] - Optional pipeline data object that is set in to the `pipelineData` property of this Game Object.
     * @param {boolean} [copyData=true] - Should the pipeline data object be _deep copied_ into the `pipelineData` property of this Game Object? If `false` it will be set by reference instead.
     *
     * @return {this} This Game Object instance.
     */
    setPipeline: function (pipeline, pipelineData, copyData)
    {
        var renderer = this.scene.sys.renderer;

        if (!renderer)
        {
            return this;
        }

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
     * Adds an entry to the `pipelineData` object belonging to this Game Object.
     *
     * If the 'key' already exists, its value is updated. If it doesn't exist, it is created.
     *
     * If `value` is undefined, and `key` exists, `key` is removed from the data object.
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
     * @param {boolean} [resetData=false] - Reset the `pipelineData` object to being an empty object?
     *
     * @return {boolean} `true` if the pipeline was reset successfully, otherwise `false`.
     */
    resetPipeline: function (resetData)
    {
        if (resetData === undefined) { resetData = false; }

        this.pipeline = this.defaultPipeline;

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
     * @return {?string} The string-based name of the pipeline being used by this Game Object, or null.
     */
    getPipelineName: function ()
    {
        return (this.pipeline === null) ? null : this.pipeline.name;
    }

};

module.exports = Pipeline;
