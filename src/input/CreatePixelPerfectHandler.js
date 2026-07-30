/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Creates a new Pixel Perfect Handler function.
 *
 * Pixel perfect hit detection tests the alpha value of the specific pixel at the point
 * of interaction on a Game Object's texture, rather than relying solely on its bounding
 * box or hit area geometry. This allows fully transparent regions of a sprite to be
 * correctly ignored during pointer and overlap checks, at the cost of a texture lookup
 * per test.
 *
 * Access via `InputPlugin.makePixelPerfect` rather than calling it directly.
 *
 * @function Phaser.Input.CreatePixelPerfectHandler
 * @since 3.10.0
 *
 * @param {Phaser.Textures.TextureManager} textureManager - A reference to the Texture Manager.
 * @param {number} alphaTolerance - The alpha level that the pixel must be at or above to be counted as a successful interaction.
 *
 * @return {function} The new Pixel Perfect Handler function.
 */
var CreatePixelPerfectHandler = function (textureManager, alphaTolerance)
{
    return function (hitArea, x, y, gameObject)
    {
        var alpha = textureManager.getPixelAlpha(x, y, gameObject.texture.key, gameObject.frame.name);

        return (alpha && alpha >= alphaTolerance);
    };
};

module.exports = CreatePixelPerfectHandler;
