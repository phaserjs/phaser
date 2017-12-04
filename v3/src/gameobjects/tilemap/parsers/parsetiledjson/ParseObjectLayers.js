var GetFastValue = require('../../../../utils/object/GetFastValue');
var ParseObject = require('./ParseObject');

//  Objects & Collision Data (polylines, etc)
var ParseObjectLayers = function (json)
{
    var objects = {};
    var collision = {};

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
        collision[layerName] = [];

        for (var j = 0; j < curo.objects.length; j++)
        {
            var parsedObject = ParseObject(curo.objects[j], offsetX, offsetY);

            // Matching v2 where only polylines were added to collision prop of the map
            if (parsedObject.polyline) { collision[layerName].push(parsedObject); }

            objects[layerName].push(parsedObject);
        }
    }

    return { objects: objects, collision: collision };
};

module.exports = ParseObjectLayers;
