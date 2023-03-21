/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var GradientFrag = require('../../shaders/FXGradient-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

/**
 * @classdesc
 * The Gradient FX Pipeline.
 *
 * The gradient overlay effect is a visual technique where a smooth color transition is applied over Game Objects,
 * such as sprites or UI components. This effect is used to enhance visual appeal, emphasize depth, or create
 * stylistic and atmospheric variations. It can also be utilized to convey information, such as representing
 * progress or health status through color changes.
 *
 * A Gradient effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.postFX.addGradient();
 * ```
 *
 * @class GradientFXPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser Game instance.
 */
var GradientFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function GradientFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: GradientFrag
        });

        /**
         * The alpha value of the gradient effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.GradientFXPipeline#alpha
         * @type {number}
         * @since 3.60.0
         */
        this.alpha = 0.2;

        /**
         * Sets how many 'chunks' the gradient is divided in to, as spread over the
         * entire height of the texture. Leave this at zero for a smooth gradient,
         * or set to a higher number to split the gradient into that many sections, giving
         * a more banded 'retro' effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.GradientFXPipeline#size
         * @type {number}
         * @since 3.60.0
         */
        this.size = 0;

        /**
         * The horizontal position the gradient will start from. This value is noralized, between 0 and 1 and is not in pixels.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.GradientFXPipeline#fromX
         * @type {number}
         * @since 3.60.0
         */
        this.fromX = 0;

        /**
         * The vertical position the gradient will start from. This value is noralized, between 0 and 1 and is not in pixels.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.GradientFXPipeline#fromY
         * @type {number}
         * @since 3.60.0
         */
        this.fromY = 0;

        /**
         * The horizontal position the gradient will end. This value is noralized, between 0 and 1 and is not in pixels.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.GradientFXPipeline#toX
         * @type {number}
         * @since 3.60.0
         */
        this.toX = 0;

        /**
         * The vertical position the gradient will end. This value is noralized, between 0 and 1 and is not in pixels.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.GradientFXPipeline#toY
         * @type {number}
         * @since 3.60.0
         */
        this.toY = 1;

        /**
         * The internal gl color array for the starting color.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.GradientFXPipeline#glcolor1
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor1 = [ 255, 0, 0 ];

        /**
         * The internal gl color array for the ending color.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.GradientFXPipeline#glcolor2
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor2 = [ 0, 255, 0 ];
    },

    onPreRender: function (controller, shader)
    {
        controller = this.getController(controller);

        this.set1f('alpha', controller.alpha, shader);
        this.set1i('size', controller.size, shader);
        this.set3fv('color1', controller.glcolor1, shader);
        this.set3fv('color2', controller.glcolor2, shader);
        this.set2f('positionFrom', controller.fromX, controller.fromY, shader);
        this.set2f('positionTo', controller.toX, controller.toY, shader);
    }

});

module.exports = GradientFXPipeline;
