/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Creates a new Pixel Perfect Handler function.
 *
 * Access via `InputPlugin.makePixelPerfect` rather than calling it directly.
 *
 * @function Phaser.Input.CreatePixelPerfectHandler
 * @since 3.10.0
 *
 * @param {Phaser.Textures.TextureManager} textureManager - A reference to the Texture Manager.
 * @param {integer} alphaTolerance - The alpha level that the pixel should be above to be included as a successful interaction.
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
