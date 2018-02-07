var GetFastValue = require('../../../utils/object/GetFastValue');

var ParseImageLayers = function (json)
{
    var images = [];

    for (var i = 0; i < json.layers.length; i++)
    {
        if (json.layers[i].type !== 'imagelayer')
        {
            continue;
        }

        var curi = json.layers[i];

        images.push({
            name: curi.name,
            image: curi.image,
            x: GetFastValue(curi, 'offsetx', 0) + curi.x,
            y: GetFastValue(curi, 'offsety', 0) + curi.y,
            alpha: curi.opacity,
            visible: curi.visible,
            properties: GetFastValue(curi, 'properties', {})
        });
    }

    return images;
};

module.exports = ParseImageLayers;
