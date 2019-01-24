/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} JSONGameObject
 *
 * @property {string} name - The name of this Game Object.
 * @property {string} type - A textual representation of this Game Object, i.e. `sprite`.
 * @property {number} x - The x position of this Game Object.
 * @property {number} y - The y position of this Game Object.
 * @property {object} scale - The scale of this Game Object
 * @property {number} scale.x - The horizontal scale of this Game Object.
 * @property {number} scale.y - The vertical scale of this Game Object.
 * @property {object} origin - The origin of this Game Object.
 * @property {number} origin.x - The horizontal origin of this Game Object.
 * @property {number} origin.y - The vertical origin of this Game Object.
 * @property {boolean} flipX - The horizontally flipped state of the Game Object.
 * @property {boolean} flipY - The vertically flipped state of the Game Object.
 * @property {number} rotation - The angle of this Game Object in radians.
 * @property {number} alpha - The alpha value of the Game Object.
 * @property {boolean} visible - The visible state of the Game Object.
 * @property {integer} scaleMode - The Scale Mode being used by this Game Object.
 * @property {(integer|string)} blendMode - Sets the Blend Mode being used by this Game Object.
 * @property {string} textureKey - The texture key of this Game Object.
 * @property {string} frameKey - The frame key of this Game Object.
 * @property {object} data - The data of this Game Object.
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
 * @return {JSONGameObject} A JSON representation of the Game Object.
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
        scaleMode: gameObject.scaleMode,
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
