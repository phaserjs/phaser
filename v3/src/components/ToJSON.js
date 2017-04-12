//  Default Game Object JSON export
//  Is extended further by Game Object specific implementations

var ToJSON = function (gameObject)
{
    var out = {
        name: gameObject.name,
        type: gameObject.type,
        position: {
            x: gameObject.x,
            y: gameObject.y,
            z: gameObject.z
        },
        scale: {
            x: gameObject.scaleX,
            y: gameObject.scaleY
        },
        origin: {
            x: gameObject.originX,
            y: gameObject.originY
        },
        flip: {
            x: gameObject.flipX,
            y: gameObject.flipY
        },
        rotation: gameObject.rotation,
        alpha: gameObject.alpha,
        visible: gameObject.visible,
        scaleMode: gameObject.scaleMode,
        blendMode: gameObject.blendMode,
        textureKey: '',
        frameKey: ''
    };

    if (gameObject.texture)
    {
        out.textureKey = gameObject.texture.key;
        out.frameKey = gameObject.frame.key;
    }

    return out;
};

module.exports = ToJSON;
