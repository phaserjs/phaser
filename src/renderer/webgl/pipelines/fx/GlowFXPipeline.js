/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var GetFastValue = require('../../../../utils/object/GetFastValue');
var GlowFrag = require('../../shaders/FXGlow-frag.js');
var PostFXPipeline = require('../PostFXPipeline');
var Utils = require('../../Utils');

/**
 * @classdesc
 * The Glow FX Pipeline.
 *
 * The glow effect is a visual technique that creates a soft, luminous halo around game objects,
 * characters, or UI elements. This effect is used to emphasize importance, enhance visual appeal,
 * or convey a sense of energy, magic, or otherworldly presence. The effect can also be set on
 * the inside of the Game Object. The color and strength of the glow can be modified.
 *
 * A Glow effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.postFX.addGlow();
 * ```
 *
 * @class GlowFXPipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser Game instance.
 * @param {object} config - The configuration options for this pipeline.
 */
var GlowFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function GlowFXPipeline (game, config)
    {
        var quality = GetFastValue(config, 'quality', 0.1);
        var distance = GetFastValue(config, 'distance', 10);

        PostFXPipeline.call(this, {
            game: game,
            fragShader: Utils.setGlowQuality(GlowFrag, game, quality, distance)
        });

        /**
         * The strength of the glow outward from the edge of the Sprite.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.GlowFXPipeline#outerStrength
         * @type {number}
         * @since 3.60.0
         */
        this.outerStrength = 4;

        /**
         * The strength of the glow inward from the edge of the Sprite.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.GlowFXPipeline#innerStrength
         * @type {number}
         * @since 3.60.0
         */
        this.innerStrength = 0;

        /**
         * If `true` only the glow is drawn, not the texture itself.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.GlowFXPipeline#knockout
         * @type {number}
         * @since 3.60.0
         */
        this.knockout = false;

        /**
         * A 4 element array of gl color values.
         *
         * @name Phaser.Renderer.WebGL.Pipelines.FX.GlowFXPipeline#glcolor
         * @type {number[]}
         * @since 3.60.0
         */
        this.glcolor = [ 1, 1, 1, 1 ];
    },

    onPreRender: function (controller, shader, width, height)
    {
        controller = this.getController(controller);

        this.set1f('outerStrength', controller.outerStrength, shader);
        this.set1f('innerStrength', controller.innerStrength, shader);
        this.set4fv('glowColor', controller.glcolor, shader);
        this.setBoolean('knockout', controller.knockout, shader);

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

module.exports = GlowFXPipeline;
