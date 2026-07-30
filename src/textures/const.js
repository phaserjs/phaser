/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Texture Filter Mode constants, used when setting the filter mode on a texture via `Texture.setFilter`.
 * The filter mode controls how WebGL samples a texture when it is scaled or displayed at a non-native resolution.
 * Use `LINEAR` for smooth scaling of high-resolution artwork, or `NEAREST` to preserve hard pixel edges in pixel art games.
 *
 * @namespace Phaser.Textures.FilterMode
 * @memberof Phaser.Textures
 * @since 3.0.0
 */
var CONST = {

    /**
     * Linear (bilinear) filter type. Smooths textures by interpolating between neighbouring pixels when scaling,
     * producing a blended, anti-aliased result. Suitable for high-resolution artwork but will appear blurry on pixel art.
     *
     * @name Phaser.Textures.FilterMode.LINEAR
     * @type {number}
     * @const
     * @since 3.0.0
     */
    LINEAR: 0,

    /**
     * Nearest neighbor filter type. Samples the single closest pixel when scaling, preserving hard edges and
     * producing a crisp, blocky result. Ideal for pixel art games where texture sharpness is important.
     *
     * @name Phaser.Textures.FilterMode.NEAREST
     * @type {number}
     * @const
     * @since 3.0.0
     */
    NEAREST: 1

};

module.exports = CONST;
