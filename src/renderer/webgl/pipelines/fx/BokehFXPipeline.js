/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BokehFrag = require('../../shaders/FXBokeh-frag');
var PostFXPipeline = require('../PostFXPipeline');

/**
 * @classdesc
 * The Bokeh FX Pipeline.
 *
 * Bokeh refers to a visual effect that mimics the photographic technique of creating a shallow depth of field.
 * This effect is used to emphasize the game's main subject or action, by blurring the background or foreground
 * elements, resulting in a more immersive and visually appealing experience. It is achieved through rendering
 * techniques that simulate the out-of-focus areas, giving a sense of depth and realism to the game's graphics.
 *
 * This effect can also be used to generate a Tilt Shift effect, which is a technique used to create a miniature
 * effect by blurring everything except a small area of the image. This effect is achieved by blurring the
 * top and bottom elements, while keeping the center area in focus.
 *
 * A Bokeh effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.postFX.addBokeh();
 * ```
 *
 * @class BokehFXPipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser Game instance.
 */
var BokehFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function BokehFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: BokehFrag
        });

        /**
         * Is this a Tilt Shift effect or a standard bokeh effect?
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BokehFXPipeline#isTiltShift
         * @type {boolean}
         * @since 3.60.0
         */
        this.isTiltShift = false;

        /**
         * If a Tilt Shift effect this controls the strength of the blur.
         *
         * Setting this value on a non-Tilt Shift effect will have no effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BokehFXPipeline#strength
         * @type {number}
         * @since 3.60.0
         */
        this.strength = 1;

        /**
         * If a Tilt Shift effect this controls the amount of horizontal blur.
         *
         * Setting this value on a non-Tilt Shift effect will have no effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BokehFXPipeline#blurX
         * @type {number}
         * @since 3.60.0
         */
        this.blurX = 1;

        /**
         * If a Tilt Shift effect this controls the amount of vertical blur.
         *
         * Setting this value on a non-Tilt Shift effect will have no effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BokehFXPipeline#blurY
         * @type {number}
         * @since 3.60.0
         */
        this.blurY = 1;

        /**
         * The radius of the bokeh effect.
         *
         * This is a float value, where a radius of 0 will result in no effect being applied,
         * and a radius of 1 will result in a strong bokeh. However, you can exceed this value
         * for even stronger effects.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BokehFXPipeline#radius
         * @type {number}
         * @since 3.60.0
         */
        this.radius = 0.5;

        /**
         * The amount, or strength, of the bokeh effect. Defaults to 1.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BokehFXPipeline#amount
         * @type {number}
         * @since 3.60.0
         */
        this.amount = 1;

        /**
         * The color contrast, or brightness, of the bokeh effect. Defaults to 0.2.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BokehFXPipeline#contrast
         * @type {number}
         * @since 3.60.0
         */
        this.contrast = 0.2;
    },

    onPreRender: function (controller, shader, width, height)
    {
        controller = this.getController(controller);

        this.set1f('radius', controller.radius, shader);
        this.set1f('amount', controller.amount, shader);
        this.set1f('contrast', controller.contrast, shader);
        this.set1f('strength', controller.strength, shader);
        this.set2f('blur', controller.blurX, controller.blurY, shader);
        this.setBoolean('isTiltShift', controller.isTiltShift, shader);

        if (width && height)
        {
            this.set2f('resolution', width, height, shader);
        }
    },

    onDraw: function (target)
    {
        this.set2f('resolution', target.width, target.height);

        this.bindAndDraw(target);
    }

});

module.exports = BokehFXPipeline;
