/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Phaser Scale Modes.
 *
 * @namespace Phaser.ScaleModes
 * @since 3.0.0
 */

var ScaleModes = {

    /**
     * Default Scale Mode (Linear).
     *
     * @name Phaser.ScaleModes.DEFAULT
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    DEFAULT: 0,

    /**
     * Linear Scale Mode. Uses bilinear interpolation when scaling textures, producing smooth results. Best for non-pixel-art graphics where smooth scaling is desired.
     *
     * @name Phaser.ScaleModes.LINEAR
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    LINEAR: 0,

    /**
     * Nearest Scale Mode. Uses nearest-neighbor sampling when scaling textures, preserving hard pixel edges without interpolation. Best for pixel art and retro-style graphics.
     *
     * @name Phaser.ScaleModes.NEAREST
     * @type {number}
     * @readonly
     * @since 3.0.0
     */
    NEAREST: 1

};

module.exports = ScaleModes;
