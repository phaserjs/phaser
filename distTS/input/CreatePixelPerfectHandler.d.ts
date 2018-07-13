/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
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
declare var CreatePixelPerfectHandler: (textureManager: any, alphaTolerance: any) => (hitArea: any, x: any, y: any, gameObject: any) => boolean;
