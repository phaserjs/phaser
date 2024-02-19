/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var ShineFrag = require('../../shaders/FXShine-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

/**
 * @classdesc
 * The Shine FX Pipeline.
 *
 * The shine effect is a visual technique that simulates the appearance of reflective
 * or glossy surfaces by passing a light beam across a Game Object. This effect is used to
 * enhance visual appeal, emphasize certain features, and create a sense of depth or
 * material properties.
 *
 * A Shine effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.postFX.addShine();
 * ```
 *
 * @class ShineFXPipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser Game instance.
 */
var ShineFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function ShineFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: ShineFrag
        });

        /**
         * The speed of the Shine effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.ShineFXPipeline#speed
         * @type {number}
         * @since 3.60.0
         */
        this.speed = 0.5;

        /**
         * The line width of the Shine effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.ShineFXPipeline#lineWidth
         * @type {number}
         * @since 3.60.0
         */
        this.lineWidth = 0.5;

        /**
         * The gradient of the Shine effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.ShineFXPipeline#gradient
         * @type {number}
         * @since 3.60.0
         */
        this.gradient = 3;

        /**
         * Does this Shine effect reveal or get added to its target?
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.ShineFXPipeline#reveal
         * @type {boolean}
         * @since 3.60.0
         */
        this.reveal = false;
    },

    onPreRender: function (controller, shader, width, height)
    {
        controller = this.getController(controller);

        this.setTime('time', shader);

        this.set1f('speed', controller.speed, shader);
        this.set1f('lineWidth', controller.lineWidth, shader);
        this.set1f('gradient', controller.gradient, shader);
        this.setBoolean('reveal', controller.reveal, shader);

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

module.exports = ShineFXPipeline;
