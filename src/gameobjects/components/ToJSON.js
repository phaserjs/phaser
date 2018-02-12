/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Default Game Object JSON export
//  Is extended further by Game Object specific implementations

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
