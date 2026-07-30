/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * A strategy to use when rendering transparent fragments.
 *
 * - 'keep' - Keep the alpha channel as is.
 * - 'dither' - Use a dithering strategy to discard fragments.
 * - number - Use a thresholding strategy to discard fragments.
 *   The number is the threshold value, between 0 and 1.
 *
 * @typedef {'keep'|'dither'|number} Phaser.Types.Renderer.WebGL.AlphaStrategy
 */
