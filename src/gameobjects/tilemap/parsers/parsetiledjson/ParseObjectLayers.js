var GetFastValue = require('../../../../utils/object/GetFastValue');
var ParseObject = require('./ParseObject');

var ParseObjectLayers = function (json)
{
    var objects = {};

    for (var i = 0; i < json.layers.length; i++)
    {
        if (json.layers[i].type !== 'objectgroup')
        {
            continue;
        }

        var curo = json.layers[i];
        var layerName = curo.name;
        var offsetX = GetFastValue(curo, 'offsetx', 0);
        var offsetY = GetFastValue(curo, 'offsety', 0);

        objects[layerName] = [];

        for (var j = 0; j < curo.objects.length; j++)
        {
            var parsedObject = ParseObject(curo.objects[j], offsetX, offsetY);

            objects[layerName].push(parsedObject);
        }
    }

    return objects;
};

module.exports = ParseObjectLayers;
