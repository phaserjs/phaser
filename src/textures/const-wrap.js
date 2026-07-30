/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * WebGL Texture Wrap Modes.
 *
 * These constants define how a texture is sampled when UV coordinates fall
 * outside the standard [0, 1] range. They correspond directly to WebGL
 * texture wrap parameter values and are used when configuring how textures
 * tile or clamp on geometry.
 *
 * @namespace Phaser.Textures.WrapMode
 * @memberof Phaser.Textures
 * @since 4.0.0
 */
var CONST = {
    /**
     * Clamp to edge wrap mode. UV coordinates outside the [0, 1] range are
     * clamped to the nearest edge of the texture. This stretches the edge
     * pixels outward rather than repeating the texture, and is the default
     * wrap mode for most textures in Phaser.
     *
     * @name Phaser.Textures.WrapMode.CLAMP_TO_EDGE
     * @type {number}
     * @const
     * @since 4.0.0
     */
    CLAMP_TO_EDGE: 33071,

    /**
     * Repeat wrap mode. The texture tiles seamlessly in both directions when
     * UV coordinates exceed the [0, 1] range. Useful for repeating background
     * patterns or tiling surfaces. Note that the texture dimensions must be
     * powers of two for this mode to work correctly in WebGL.
     *
     * @name Phaser.Textures.WrapMode.REPEAT
     * @type {number}
     * @const
     * @since 4.0.0
     */
    REPEAT: 10497,

    /**
     * Mirrored repeat wrap mode. Similar to `REPEAT`, but the texture is
     * flipped (mirrored) on each repetition. For example, a texture spanning
     * UV 0–1 will appear mirrored from 1–2, normal from 2–3, and so on.
     * This can produce smoother-looking tiling by eliminating visible seams
     * at tile boundaries.
     *
     * @name Phaser.Textures.WrapMode.MIRRORED_REPEAT
     * @type {number}
     * @const
     * @since 4.0.0
     */
    MIRRORED_REPEAT: 33648
};

module.exports = CONST;
