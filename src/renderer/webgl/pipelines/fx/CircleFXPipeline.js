/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var CircleFrag = require('../../shaders/FXCircle-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

/**
 * @classdesc
 * The Circle FX Pipeline.
 *
 * This effect will draw a circle around the texture of the Game Object, effectively masking off
 * any area outside of the circle without the need for an actual mask. You can control the thickness
 * of the circle, the color of the circle and the color of the background, should the texture be
 * transparent. You can also control the feathering applied to the circle, allowing for a harsh or soft edge.
 *
 * Please note that adding this effect to a Game Object will not change the input area or physics body of
 * the Game Object, should it have one.
 *
 * A Circle effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.postFX.addCircle();
 * ```
 *
 * @class CircleFXPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser Game instance.
 */
var CircleFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function CircleFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: CircleFrag
        });

        /**
         * The scale of the circle. The default scale is 1, which is a circle
         * the full size of the underlying texture. Reduce this value to create
         * a smaller circle, or increase it to create a circle that extends off
         * the edges of the texture.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.CircleFXPipeline#scale
         * @type {number}
         * @since 3.60.0
         */
        this.scale = 1;

        /**
         * The amount of feathering to apply to the circle from the ring,
         * extending into the middle of the circle. The default is 0.005,
         * which is a very low amount of feathering just making sure the ring
         * has a smooth edge. Increase this amount to a value such as 0.5
         * or 0.025 for larger amounts of feathering.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.CircleFXPipeline#feather
         * @type {number}
         * @since 3.60.0
         */
        this.feather = 0.005;

        /**
         * The width of the circle around the texture, in pixels. This value
         * doesn't factor in the feather, which can extend the thickness
         * internally depending on its value.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.CircleFXPipeline#thickness
         * @type {number}
         * @since 3.60.0
         */
        this.thickness = 8;

        /**
         * The internal gl color array for the ring color.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.CircleFXPipeline#glcolor
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor = [ 1, 0.2, 0.7 ];

        /**
         * The internal gl color array for the background color.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.CircleFXPipeline#glcolor2
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor2 = [ 1, 0, 0, 0.4 ];
    },

    onPreRender: function (controller, shader, width, height)
    {
        controller = this.getController(controller);

        this.set1f('scale', controller.scale, shader);
        this.set1f('feather', controller.feather, shader);
        this.set1f('thickness', controller.thickness, shader);
        this.set3fv('color', controller.glcolor, shader);
        this.set4fv('backgroundColor', controller.glcolor2, shader);

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

module.exports = CircleFXPipeline;
