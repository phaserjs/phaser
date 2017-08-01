var Image = function (texture, sourceIndex)
{
    var source = texture.source[sourceIndex];

    texture.add('__BASE', sourceIndex, 0, 0, source.width, source.height);

    return texture;
};

module.exports = Image;
