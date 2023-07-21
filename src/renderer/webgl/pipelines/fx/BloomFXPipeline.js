/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var BloomFrag = require('../../shaders/FXBloom-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

/**
 * @classdesc
 * The Bloom FX Pipeline.
 *
 * Bloom is an effect used to reproduce an imaging artifact of real-world cameras.
 * The effect produces fringes of light extending from the borders of bright areas in an image,
 * contributing to the illusion of an extremely bright light overwhelming the
 * camera or eye capturing the scene.
 *
 * A Bloom effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.postFX.addBloom();
 * ```
 *
 * @class BloomFXPipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser Game instance.
 */
var BloomFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function BloomFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: BloomFrag
        });

        /**
         * The number of steps to run the Bloom effect for.
         *
         * This value should always be an integer.
         *
         * It defaults to 4. The higher the value, the smoother the Bloom,
         * but at the cost of exponentially more gl operations.
         *
         * Keep this to the lowest possible number you can have it, while
         * still looking correct for your game.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BloomFXPipeline#steps
         * @type {number}
         * @since 3.60.0
         */
        this.steps = 4;

        /**
         * The horizontal offset of the bloom effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BloomFXPipeline#offsetX
         * @type {number}
         * @since 3.60.0
         */
        this.offsetX = 1;

        /**
         * The vertical offset of the bloom effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BloomFXPipeline#offsetY
         * @type {number}
         * @since 3.60.0
         */
        this.offsetY = 1;

        /**
         * The strength of the blur process of the bloom effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BloomFXPipeline#blurStrength
         * @type {number}
         * @since 3.60.0
         */
        this.blurStrength = 1;

        /**
         * The strength of the blend process of the bloom effect.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BloomFXPipeline#strength
         * @type {number}
         * @since 3.60.0
         */
        this.strength = 1;

        /**
         * The internal gl color array.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.BloomFXPipeline#glcolor
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor = [ 1, 1, 1 ];
    },

    onPreRender: function (controller)
    {
        controller = this.getController(controller);

        this.set1f('strength', controller.blurStrength);
        this.set3fv('color', controller.glcolor);
    },

    onDraw: function (target1)
    {
        var controller = this.getController();

        var target2 = this.fullFrame1;
        var target3 = this.fullFrame2;

        this.copyFrame(target1, target3);

        var x = (2 / target1.width) * controller.offsetX;
        var y = (2 / target1.height) * controller.offsetY;

        for (var i = 0; i < controller.steps; i++)
        {
            this.set2f('offset', x, 0);
            this.copySprite(target1, target2);

            this.set2f('offset', 0, y);
            this.copySprite(target2, target1);
        }

        this.blendFrames(target3, target1, target2, controller.strength);

        this.copyToGame(target2);
    }

});

module.exports = BloomFXPipeline;
