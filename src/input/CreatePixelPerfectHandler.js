/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Creates a new Interactive Object.
 * 
 * This is called automatically by the Input Manager when you enable a Game Object for input.
 *
 * The resulting Interactive Object is mapped to the Game Object's `input` property.
 *
 * @function Phaser.Input.CreatePixelPerfectHandler
 * @since 3.10.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to which this Interactive Object is bound.
 * @param {any} hitArea - The hit area for this Interactive Object. Typically a geometry shape, like a Rectangle or Circle.
 * @param {HitAreaCallback} hitAreaCallback - The 'contains' check callback that the hit area shape will use for all hit tests.
 *
 * @return {Phaser.Input.InteractiveObject} The new Interactive Object.
 */
var CreatePixelPerfectHandler = function (textureManager, alphaTolerance)
{
    return function (hitArea, x, y, gameObject)
    {
        var alpha = textureManager.getPixelAlpha(x, y, gameObject.texture.key, gameObject.frame.key);

        return (alpha && alpha >= alphaTolerance)
    };
};

module.exports = CreatePixelPerfectHandler;
