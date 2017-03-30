var Texture = function (texture, unit, width, height) 
{
    this.texture = texture;
    this.unit = unit;
    this.width = width;
    this.height = height;
};

Texture.prototype.constructor = Texture;

Texture.prototype = {

    setTextureUnit: function (unit) {
        this.unit = unit;
    }

};

module.exports = Texture;
