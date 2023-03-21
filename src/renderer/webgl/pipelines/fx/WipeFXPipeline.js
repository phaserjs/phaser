/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var WipeFrag = require('../../shaders/FXWipe-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

/**
 * @classdesc
 * The Wipe FX Pipeline.
 *
 * The wipe or reveal effect is a visual technique that gradually uncovers or conceals elements
 * in the game, such as images, text, or scene transitions. This effect is often used to create
 * a sense of progression, reveal hidden content, or provide a smooth and visually appealing transition
 * between game states.
 *
 * You can set both the direction and the axis of the wipe effect. The following combinations are possible:
 *
 * * left to right: direction 0, axis 0
 * * right to left: direction 1, axis 0
 * * top to bottom: direction 1, axis 1
 * * bottom to top: direction 1, axis 0
 *
 * It is up to you to set the `progress` value yourself, i.e. via a Tween, in order to transition the effect.
 *
 * A Wipe effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.postFX.addWipe();
 * sprite.postFX.addReveal();
 * ```
 *
 * @class WipeFXPipeline
 * @extends Phaser.Renderer.WebGL.WebGLPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser Game instance.
 */
var WipeFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function WipeFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: WipeFrag
        });

        /**
         * The progress of the Wipe effect. This value is normalized to the range 0 to 1.
         *
         * Adjust this value to make the wipe transition (i.e. via a Tween)
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.WipeFXPipeline#progress
         * @type {number}
         * @since 3.60.0
         */
        this.progress = 0;

        /**
         * The width of the wipe effect. This value is normalized in the range 0 to 1.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.WipeFXPipeline#wipeWidth
         * @type {number}
         * @since 3.60.0
         */
        this.wipeWidth = 0.1;

        /**
         * The direction of the wipe effect. Either 0 or 1. Set in conjunction with the axis property.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.WipeFXPipeline#direction
         * @type {number}
         * @since 3.60.0
         */
        this.direction = 0;

        /**
         * The axis of the wipe effect. Either 0 or 1. Set in conjunction with the direction property.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.WipeFXPipeline#axis
         * @type {number}
         * @since 3.60.0
         */
        this.axis = 0;

        /**
         * Is this a reveal (true) or a fade (false) effect?
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.WipeFXPipeline#reveal
         * @type {boolean}
         * @since 3.60.0
         */
        this.reveal = false;
    },

    onPreRender: function (controller, shader)
    {
        controller = this.getController(controller);

        var progress = controller.progress;
        var wipeWidth = controller.wipeWidth;
        var direction = controller.direction;
        var axis = controller.axis;

        this.set4f('config', progress, wipeWidth, direction, axis, shader);
        this.setBoolean('reveal', controller.reveal, shader);
    }

});

module.exports = WipeFXPipeline;
