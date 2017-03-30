var Texture = function (texture, width, height) 
{
    this.texture = texture;
    this.width = width;
    this.height = height;
};

Texture.prototype.constructor = Texture;

module.exports = Texture;
