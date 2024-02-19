/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../../utils/Class');
var PostFXPipeline = require('../PostFXPipeline');

/**
 * @classdesc
 * The ColorMatrix FX Pipeline.
 *
 * The color matrix effect is a visual technique that involves manipulating the colors of an image
 * or scene using a mathematical matrix. This process can adjust hue, saturation, brightness, and contrast,
 * allowing developers to create various stylistic appearances or mood settings within the game.
 * Common applications include simulating different lighting conditions, applying color filters,
 * or achieving a specific visual style.
 *
 * A ColorMatrix effect is added to a Game Object via the FX component:
 *
 * ```js
 * const sprite = this.add.sprite();
 *
 * sprite.postFX.addColorMatrix();
 * ```
 *
 * @class ColorMatrixFXPipeline
 * @extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
 * @memberof Phaser.Renderer.WebGL.Pipelines.FX
 * @constructor
 * @since 3.60.0
 *
 * @param {Phaser.Game} game - A reference to the Phaser Game instance.
 */
var ColorMatrixFXPipeline = new Class({

    Extends: PostFXPipeline,

    initialize:

    function ColorMatrixFXPipeline (game)
    {
        PostFXPipeline.call(this, {
            game: game
        });
    },

    onDraw: function (source)
    {
        var target = this.fullFrame1;

        if (this.controller)
        {
            this.manager.drawFrame(source, target, true, this.controller);
        }
        else
        {
            this.drawFrame(source, target);
        }

        this.copyToGame(target);
    }

});

module.exports = ColorMatrixFXPipeline;
