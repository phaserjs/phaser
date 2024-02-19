/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var ShadowFrag = require('../../shaders/FXShadow-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

/**
 * @classdesc
 * The Shadow FX Pipeline.
 *
 * The shadow effect is a visual technique used to create the illusion of depth and realism by adding darker,
 * offset silhouettes or shapes beneath game objects, characters, or environments. These simulated shadows
 * help to enhance the visual appeal and immersion, making the 2D game world appear more dynamic and three-dimensional.
 *
 * A Shadow effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.postFX.addShadow();
 * ```
 *
 * @class ShadowFXPipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser Game instance.
 */
var ShadowFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function ShadowFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: ShadowFrag
        });

        /**
         * The horizontal offset of the shadow effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.ShadowFXPipeline#x
         * @type {number}
         * @since 3.60.0
         */
        this.x = 0;

        /**
         * The vertical offset of the shadow effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.ShadowFXPipeline#y
         * @type {number}
         * @since 3.60.0
         */
        this.y = 0;

        /**
         * The amount of decay for the shadow effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.ShadowFXPipeline#decay
         * @type {number}
         * @since 3.60.0
         */
        this.decay = 0.1;

        /**
         * The power of the shadow effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.ShadowFXPipeline#power
         * @type {number}
         * @since 3.60.0
         */
        this.power = 1;

        /**
         * The internal gl color array.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.ShadowFXPipeline#glcolor
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor = [ 0, 0, 0, 1 ];

        /**
         * The number of samples that the shadow effect will run for.
         *
         * This should be an integer with a minimum value of 1 and a maximum of 12.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.ShadowFXPipeline#samples
         * @type {number}
         * @since 3.60.0
         */
        this.samples = 6;

        /**
         * The intensity of the shadow effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.ShadowFXPipeline#intensity
         * @type {number}
         * @since 3.60.0
         */
        this.intensity = 1;
    },

    onPreRender: function (controller, shader)
    {
        controller = this.getController(controller);

        var samples = controller.samples;

        this.set1i('samples', samples, shader);
        this.set1f('intensity', controller.intensity, shader);
        this.set1f('decay', controller.decay, shader);
        this.set1f('power', (controller.power / samples), shader);
        this.set2f('lightPosition', controller.x, controller.y, shader);
        this.set4fv('color', controller.glcolor, shader);
    }

});

module.exports = ShadowFXPipeline;
