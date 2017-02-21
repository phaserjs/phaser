//  Texture Component

var Texture = function (gameObject, texture, frame)
{
    this.gameObject = gameObject;

    this.texture = texture;

    this.frame = frame;
};

Texture.prototype.constructor = Texture;

Texture.prototype = {
};

module.exports = Texture;
