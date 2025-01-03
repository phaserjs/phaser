/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BlurLowFrag = require('../../shaders/FXBlurLow-frag');
var BlurMedFrag = require('../../shaders/FXBlurMed-frag');
var BlurHighFrag = require('../../shaders/FXBlurHigh-frag');
var PostFXPipeline = require('../PostFXPipeline');

/**
 * @classdesc
 * The Blur FX Pipeline.
 *
 * A Gaussian blur is the result of blurring an image by a Gaussian function. It is a widely used effect,
 * typically to reduce image noise and reduce detail. The visual effect of this blurring technique is a
 * smooth blur resembling that of viewing the image through a translucent screen, distinctly different
 * from the bokeh effect produced by an out-of-focus lens or the shadow of an object under usual illumination.
 *
 * A Blur effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.postFX.addBlur();
 * ```
 *
 * @class BlurFXPipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser Game instance.
 */
var BlurFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function BlurFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            shaders: [
                {
                    name: 'Gaussian5',
                    fragShader: BlurLowFrag
                },
                {
                    name: 'Gaussian9',
                    fragShader: BlurMedFrag
                },
                {
                    name: 'Gaussian13',
                    fragShader: BlurHighFrag
                }
            ]
        });

        this.activeShader = this.shaders[0];

        /**
         * The horizontal offset of the blur effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BlurFXPipeline#x
         * @type {number}
         * @since 3.60.0
         */
        this.x = 2;

        /**
         * The vertical offset of the blur effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BlurFXPipeline#y
         * @type {number}
         * @since 3.60.0
         */
        this.y = 2;

        /**
         * The number of steps to run the Blur effect for.
         *
         * This value should always be an integer.
         *
         * It defaults to 4. The higher the value, the smoother the blur,
         * but at the cost of exponentially more gl operations.
         *
         * Keep this to the lowest possible number you can have it, while
         * still looking correct for your game.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BlurFXPipeline#steps
         * @type {number}
         * @since 3.60.0
         */
        this.steps = 4;

        /**
         * The strength of the blur effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BlurFXPipeline#strength
         * @type {number}
         * @since 3.60.0
         */
        this.strength = 1;

        /**
         * The internal gl color array.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BlurFXPipeline#glcolor
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor = [ 1, 1, 1 ];
    },

    /**
     * Sets the quality of the blur effect to low.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FX.BlurFXPipeline#setQualityLow
     * @since 3.60.0
     *
     * @return {this} This FX Pipeline.
     */
    setQualityLow: function ()
    {
        this.activeShader = this.shaders[0];

        return this;
    },

    /**
     * Sets the quality of the blur effect to medium.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FX.BlurFXPipeline#setQualityMedium
     * @since 3.60.0
     *
     * @return {this} This FX Pipeline.
     */
    setQualityMedium: function ()
    {
        this.activeShader = this.shaders[1];

        return this;
    },

    /**
     * Sets the quality of the blur effect to high.
     *
     * @method Phaser.Renderer.WebGL.Pipelines.FX.BlurFXPipeline#setQualityHigh
     * @since 3.60.0
     *
     * @return {this} This FX Pipeline.
     */
    setQualityHigh: function ()
    {
        this.activeShader = this.shaders[2];

        return this;
    },

    onDraw: function (target1)
    {
        var controller = this.getController();

        var gl = this.gl;
        var target2 = this.fullFrame1;

        var currentFBO = gl.getParameter(gl.FRAMEBUFFER_BINDING);

        this.bind(this.shaders[controller.quality]);

        gl.activeTexture(gl.TEXTURE0);
        gl.viewport(0, 0, target1.width, target1.height);

        this.set1i('uMainSampler', 0);
        this.set2f('resolution', target1.width, target1.height);
        this.set1f('strength', controller.strength);
        this.set3fv('color', controller.glcolor);

        for (var i = 0; i < controller.steps; i++)
        {
            this.set2f('offset', controller.x, 0);
            this.copySprite(target1, target2);

            this.set2f('offset', 0, controller.y);
            this.copySprite(target2, target1);
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, currentFBO);
        gl.bindTexture(gl.TEXTURE_2D, null);

        this.copyToGame(target1);
    }

});

module.exports = BlurFXPipeline;
