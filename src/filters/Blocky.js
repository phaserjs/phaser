/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Controller = require('./Controller');

/**
 * @classdesc
 * The Blocky Filter Controller.
 *
 * This filter controller manages a blocky effect.
 *
 * The blocky effect works by taking the central pixel of a block of pixels
 * and using it to fill the entire block, creating a pixelated effect.
 *
 * It reduces the resolution of an image,
 * creating a pixelated or blocky appearance.
 * This is often used for stylistic purposes, such as pixel art.
 * One technique is to render the game at a higher resolution,
 * scaled up by a factor of N,
 * and then apply the blocky effect at size N.
 * This creates large, visible pixels, suitable for further stylization.
 * The effect can also be used to obscure certain elements within the game,
 * such as during a transition or to censor specific content.
 *
 * Blocky works best on games with no anti-aliasing,
 * so it can read unfiltered pixel colors from the original image.
 * It preserves the colors of the original art, instead of blending them
 * like the Pixelate filter.
 *
 * A Blocky effect is added to a Camera via the FilterList component:
 *
 * ```js
 * const camera = this.cameras.main;
 * camera.filters.internal.addBlocky({ size: 4 });
 * camera.filters.external.addBlocky({ size: { x: 2, y: 4 } }, offset: { x: 1, y: 2 });
 * ```
 *
 * @class Blocky
 * @extends Phaser.Filters.Controller
 * @memberof Phaser.Filters
 * @constructor
 * @since 4.0.0
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The Camera that owns this filter.
 * @param {Phaser.Types.Filters.BlockyConfig} [config] - The configuration object for the Blocky effect.
 */
var Blocky = new Class({
    Extends: Controller,

    initialize: function Blocky (camera, config)
    {
        Controller.call(this, camera, 'FilterBlocky');

        /**
         * The size of the blocks.
         *
         * @name Phaser.Filters.Blocky#size
         * @type {Phaser.Types.Math.Vector2Like}
         * @default { x: 4, y: 4 }
         * @since 4.0.0
         */
        this.size = {
            x: 4,
            y: 4
        };

        /**
         * The offset of the blocks from the top left corner of the image.
         *
         * @name Phaser.Filters.Blocky#offset
         * @type {Phaser.Types.Math.Vector2Like}
         * @default { x: 0, y: 0 }
         * @since 4.0.0
         */
        this.offset = {
            x: 0,
            y: 0
        };

        if (config)
        {
            if (config.size)
            {
                if (typeof config.size === 'number')
                {
                    this.size.x = config.size;
                    this.size.y = config.size;
                }
                else
                {
                    this.size.x = config.size.x;
                    this.size.y = config.size.y;
                }
            }

            if (config.offset)
            {
                if (typeof config.offset === 'number')
                {
                    this.offset.x = config.offset;
                    this.offset.y = config.offset;
                }
                else
                {
                    this.offset.x = config.offset.x;
                    this.offset.y = config.offset.y;
                }
            }
        }
    }

});

module.exports = Blocky;
