/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DeepCopy = require('../../utils/object/DeepCopy');
var FX = require('../components/FX');
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
     * The Pre FX component of this Game Object.
     *
     * This component allows you to apply a variety of built-in effects to this Game Object, such
     * as glow, blur, bloom, displacements, vignettes and more. You access them via this property,
     * for example:
     *
     * ```js
     * const player = this.add.sprite();
     * player.preFX.addBloom();
     * ```
     *
     * Only the following Game Objects support Pre FX:
     *
     * * Image
     * * Sprite
     * * TileSprite
     * * Text
     * * RenderTexture
     * * Video
     *
     * All FX are WebGL only and do not have Canvas counterparts.
     *
     * Please see the FX Class for more details and available methods.
     *
     * @name Phaser.GameObjects.Components.PostPipeline#preFX
     * @type {?Phaser.GameObjects.Components.FX}
     * @webglOnly
     * @since 3.60.0
     */
    preFX: null,

    /**
     * The Post FX component of this Game Object.
     *
     * This component allows you to apply a variety of built-in effects to this Game Object, such
     * as glow, blur, bloom, displacements, vignettes and more. You access them via this property,
     * for example:
     *
     * ```js
     * const player = this.add.sprite();
     * player.postFX.addBloom();
     * ```
     *
     * All FX are WebGL only and do not have Canvas counterparts.
     *
     * Please see the FX Class for more details and available methods.
     *
     * This property is always `null` until the `initPostPipeline` method is called.
     *
     * @name Phaser.GameObjects.Components.PostPipeline#postFX
     * @type {Phaser.GameObjects.Components.FX}
     * @webglOnly
     * @since 3.60.0
     */
    postFX: null,

    /**
     * This should only be called during the instantiation of the Game Object.
     *
     * It is called by default by all core Game Objects and doesn't need
     * calling again.
     *
     * After that, use `setPostPipeline`.
     *
     * @method Phaser.GameObjects.Components.PostPipeline#initPostPipeline
     * @webglOnly
     * @since 3.60.0
     *
     * @param {boolean} [preFX=false] - Does this Game Object support Pre FX?
     */
    initPostPipeline: function (preFX)
    {
        this.postPipelines = [];
        this.postPipelineData = {};

        this.postFX = new FX(this, true);

        if (preFX)
        {
            this.preFX = new FX(this, false);
        }
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
     * You can optionally also set the `postPipelineData` property, if the parameter is given.
     *
     * @method Phaser.GameObjects.Components.PostPipeline#setPostPipeline
     * @webglOnly
     * @since 3.60.0
     *
     * @param {(string|string[]|function|function[]|Phaser.Renderer.WebGL.Pipelines.PostFXPipeline|Phaser.Renderer.WebGL.Pipelines.PostFXPipeline[])} pipelines - Either the string-based name of the pipeline, or a pipeline instance, or class, or an array of them.
     * @param {object} [pipelineData] - Optional pipeline data object that is set in to the `postPipelineData` property of this Game Object.
     * @param {boolean} [copyData=true] - Should the pipeline data object be _deep copied_ into the `postPipelineData` property of this Game Object? If `false` it will be set by reference instead.
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
                var instance = pipelineManager.getPostPipeline(pipelines[i], this, pipelineData);

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
     * Adds an entry to the `postPipelineData` object belonging to this Game Object.
     *
     * If the 'key' already exists, its value is updated. If it doesn't exist, it is created.
     *
     * If `value` is undefined, and `key` exists, `key` is removed from the data object.
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
     * @return {(Phaser.Renderer.WebGL.Pipelines.PostFXPipeline|Phaser.Renderer.WebGL.Pipelines.PostFXPipeline[])} An array of all the Post Pipelines matching the name. This array will be empty if there was no match. If there was only one single match, that pipeline is returned directly, not in an array.
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
     * @param {boolean} [resetData=false] - Reset the `postPipelineData` object to being an empty object?
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
        var isString = (typeof pipeline === 'string');

        var pipelines = this.postPipelines;

        for (var i = pipelines.length - 1; i >= 0; i--)
        {
            var instance = pipelines[i];

            if (
                (isString && instance.name === pipeline) ||
                (!isString && instance === pipeline))
            {
                instance.destroy();

                SpliceOne(pipelines, i);
            }
        }

        this.hasPostPipeline = (this.postPipelines.length > 0);

        return this;
    },

    /**
     * Removes all Pre and Post FX Controllers from this Game Object.
     *
     * If you wish to remove a single controller, use the `preFX.remove(fx)` or `postFX.remove(fx)` methods instead.
     *
     * If you wish to clear a single controller, use the `preFX.clear()` or `postFX.clear()` methods instead.
     *
     * @method Phaser.GameObjects.Components.PostPipeline#clearFX
     * @webglOnly
     * @since 3.60.0
     *
     * @return {this} This Game Object.
     */
    clearFX: function ()
    {
        if (this.preFX)
        {
            this.preFX.clear();
        }

        if (this.postFX)
        {
            this.postFX.clear();
        }

        return this;
    }

};

module.exports = PostPipeline;
