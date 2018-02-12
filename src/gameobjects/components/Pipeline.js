/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for setting the WebGL rendering pipeline of a Game Object.
 * 
 * @name Phaser.GameObjects.Components.Pipeline
 * @webglOnly
 * @since 3.0.0
 */

var Pipeline = {
    
    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Components.Pipeline#defaultPipeline
     * @type {Phaser.Renderer.WebGL.WebGLPipeline}
     * @default null
     * @webglOnly
     * @since 3.0.0
     */
    defaultPipeline: null,

    /**
     * [description]
     * 
     * @name Phaser.GameObjects.Components.Pipeline#pipeline
     * @type {Phaser.Renderer.WebGL.WebGLPipeline}
     * @default null
     * @webglOnly
     * @since 3.0.0
     */
    pipeline: null,

    /**
     * Sets the initial WebGL Pipeline of this Game Object.
     * This should only be called during the instantiation of the Game Object.
     * 
     * @method Phaser.GameObjects.Components.Pipeline#initPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {string} pipelineName - The name of the pipeline to set on this Game Object.
     * 
     * @return {boolean} `true` if the pipeline was set successfully, otherwise `false`.
     */
    initPipeline: function (pipelineName)
    {
        var renderer = this.scene.sys.game.renderer;

        if (renderer.gl && renderer.hasPipeline(pipelineName))
        {
            this.defaultPipeline = renderer.getPipeline(pipelineName);
            this.pipeline = this.defaultPipeline;
            return true;
        }

        return false;
    },

    /**
     * Sets the active WebGL Pipeline of this Game Object.
     * 
     * @method Phaser.GameObjects.Components.Pipeline#setPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @param {string} pipelineName - The name of the pipeline to set on this Game Object.
     * 
     * @return {boolean} `true` if the pipeline was set successfully, otherwise `false`.
     */
    setPipeline: function (pipelineName)
    {
        var renderer = this.scene.sys.game.renderer;

        if (renderer.gl && renderer.hasPipeline(pipelineName))
        {
            this.pipeline = renderer.getPipeline(pipelineName);
            return true;
        }
        
        return false;
    },

    /**
     * Resets the WebGL Pipeline of this Game Object back to the default it was created with.
     * 
     * @method Phaser.GameObjects.Components.Pipeline#resetPipeline
     * @webglOnly
     * @since 3.0.0
     *
     * @return {boolean} `true` if the pipeline was set successfully, otherwise `false`.
     */
    resetPipeline: function ()
    {
        this.pipeline = this.defaultPipeline;
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
    }

};

module.exports = Pipeline;
