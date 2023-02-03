/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DeepCopy = require('../../utils/object/DeepCopy');
var SpliceOne = require('../../utils/array/SpliceOne');

/**
 * Provides methods used for setting the WebGL rendering post pipeline of a Game Object.
 *
 * @namespace Phaser.GameObjects.Components.PostPipeline
 * @webglOnly
 * @since 3.60.0
 */

var PostPipeline = {

    /**
     * Does this Game Object have any Post Pipelines set?
     *
     * @name Phaser.GameObjects.Components.PostPipeline#hasPostPipeline
     * @type {boolean}
     * @webglOnly
     * @since 3.60.0
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
     * @name Phaser.GameObjects.Components.PostPipeline#postPipelines
     * @type {Phaser.Renderer.WebGL.Pipelines.PostFXPipeline[]}
     * @webglOnly
     * @since 3.60.0
     */
    postPipelines: null,

    /**
     * An object to store pipeline specific data in, to be read by the pipelines this Game Object uses.
     *
     * @name Phaser.GameObjects.Components.PostPipeline#postPipelineData
     * @type {object}
     * @webglOnly
     * @since 3.60.0
     */
    postPipelineData: null,

    /**
     * This should only be called during the instantiation of the Game Object. After that, use `setPostPipeline`.
     *
     * @method Phaser.GameObjects.Components.PostPipeline#initPostPipeline
     * @webglOnly
     * @since 3.60.0
     */
    initPostPipeline: function ()
    {
        this.postPipelines = [];
        this.postPipelineData = {};
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
     * You can optionally also set the `pipelineData` property, if the parameter is given.
     *
     * Both the pipeline and post pipelines share the pipeline data object together.
     *
     * @method Phaser.GameObjects.Components.PostPipeline#setPostPipeline
     * @webglOnly
     * @since 3.60.0
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

        if (!renderer)
        {
            return this;
        }

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
                this.postPipelineData = (copyData) ? DeepCopy(pipelineData) : pipelineData;
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
     * @method Phaser.GameObjects.Components.PostPipeline#setPostPipelineData
     * @webglOnly
     * @since 3.60.0
     *
     * @param {string} key - The key of the pipeline data to set, update, or delete.
     * @param {any} [value] - The value to be set with the key. If `undefined` then `key` will be deleted from the object.
     *
     * @return {this} This Game Object instance.
     */
    setPostPipelineData: function (key, value)
    {
        var data = this.postPipelineData;

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
     * @method Phaser.GameObjects.Components.PostPipeline#getPostPipeline
     * @webglOnly
     * @since 3.60.0
     *
     * @param {(string|function|Phaser.Renderer.WebGL.Pipelines.PostFXPipeline)} pipeline - The string-based name of the pipeline, or a pipeline class.
     *
     * @return {(Phaser.Renderer.WebGL.Pipelines.PostFXPipeline|Phaser.Renderer.WebGL.Pipelines.PostFXPipeline[])} The Post Pipeline/s matching the name, or undefined if no match. If more than one match they are returned in an array.
     */
    getPostPipeline: function (pipeline)
    {
        var isString = (typeof pipeline === 'string');

        var pipelines = this.postPipelines;

        var results = [];

        for (var i = 0; i < pipelines.length; i++)
        {
            var instance = pipelines[i];

            if ((isString && instance.name === pipeline) || (!isString && instance instanceof pipeline))
            {
                results.push(instance);
            }
        }

        return (results.length === 1) ? results[0] : results;
    },

    /**
     * Resets the WebGL Post Pipelines of this Game Object. It does this by calling
     * the `destroy` method on each post pipeline and then clearing the local array.
     *
     * @method Phaser.GameObjects.Components.PostPipeline#resetPostPipeline
     * @webglOnly
     * @since 3.60.0
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
            this.postPipelineData = {};
        }
    },

    /**
     * Removes a type of Post Pipeline instances from this Game Object, based on the given name, and destroys them.
     *
     * If you wish to remove all Post Pipelines use the `resetPostPipeline` method instead.
     *
     * @method Phaser.GameObjects.Components.PostPipeline#removePostPipeline
     * @webglOnly
     * @since 3.60.0
     *
     * @param {string|Phaser.Renderer.WebGL.Pipelines.PostFXPipeline} pipeline - The string-based name of the pipeline, or a pipeline class.
     *
     * @return {this} This Game Object.
     */
    removePostPipeline: function (pipeline)
    {
        var pipelines = this.postPipelines;

        for (var i = pipelines.length - 1; i >= 0; i--)
        {
            var instance = pipelines[i];

            if (
                (typeof pipeline === 'string' && instance.name === pipeline) ||
                (typeof pipeline !== 'string' && instance instanceof pipeline))
            {
                instance.destroy();

                SpliceOne(pipelines, i);
            }
        }

        this.hasPostPipeline = (this.postPipelines.length > 0);

        return this;
    }

};

module.exports = PostPipeline;
