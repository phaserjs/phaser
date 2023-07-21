/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var DisplacementFrag = require('../../shaders/FXDisplacement-frag.js');
var PostFXPipeline = require('../PostFXPipeline');

/**
 * @classdesc
 * The Displacement FX Pipeline.
 *
 * The displacement effect is a visual technique that alters the position of pixels in an image
 * or texture based on the values of a displacement map. This effect is used to create the illusion
 * of depth, surface irregularities, or distortion in otherwise flat elements. It can be applied to
 * characters, objects, or backgrounds to enhance realism, convey movement, or achieve various
 * stylistic appearances.
 *
 * A Displacement effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.postFX.addDisplacement();
 * ```
 *
 * @class DisplacementFXPipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser Game instance.
 */
var DisplacementFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function DisplacementFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game,
            fragShader: DisplacementFrag
        });

        /**
         * The amount of horizontal displacement to apply.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.DisplacementFXPipeline#x
         * @type {number}
         * @since 3.60.0
         */
        this.x = 0.005;

        /**
         * The amount of vertical displacement to apply.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.DisplacementFXPipeline#y
         * @type {number}
         * @since 3.60.0
         */
        this.y = 0.005;

        /**
         * The underlying WebGLTexture used for displacement.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.DisplacementFXPipeline#glTexture
         * @type {WebGLTexture}
         * @since 3.60.0
         */
        this.glTexture;
    },

    onBoot: function ()
    {
        this.setTexture('__WHITE');
    },

    setTexture: function (texture)
    {
        var phaserTexture = this.game.textures.getFrame(texture);

        if (phaserTexture)
        {
            this.glTexture = phaserTexture.glTexture;
        }
    },

    onDraw: function (source)
    {
        var controller = this.getController();

        var target = this.fullFrame1;

        this.bind();

        this.set1i('uMainSampler', 0);
        this.set1i('uDisplacementSampler', 1);
        this.set2f('amount', controller.x, controller.y);

        this.bindTexture(controller.glTexture, 1);

        this.copySprite(source, target);

        this.copyToGame(target);
    }

});

module.exports = DisplacementFXPipeline;
