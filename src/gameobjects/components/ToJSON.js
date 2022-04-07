/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Build a JSON representation of the given Game Object.
 *
 * This is typically extended further by Game Object specific implementations.
 *
 * @method Phaser.GameObjects.Components.ToJSON
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object to export as JSON.
 *
 * @return {Phaser.Types.GameObjects.JSONGameObject} A JSON representation of the Game Object.
 */
var ToJSON = function (gameObject)
{
    var out = {
        name: gameObject.name,
        type: gameObject.type,
        x: gameObject.x,
        y: gameObject.y,
        depth: gameObject.depth,
        scale: {
            x: gameObject.scaleX,
            y: gameObject.scaleY
        },
        origin: {
            x: gameObject.originX,
            y: gameObject.originY
        },
        flipX: gameObject.flipX,
        flipY: gameObject.flipY,
        rotation: gameObject.rotation,
        alpha: gameObject.alpha,
        visible: gameObject.visible,
        blendMode: gameObject.blendMode,
        textureKey: '',
        frameKey: '',
        data: {}
    };

    if (gameObject.texture)
    {
        out.textureKey = gameObject.texture.key;
        out.frameKey = gameObject.frame.name;
    }

    return out;
};

module.exports = ToJSON;
