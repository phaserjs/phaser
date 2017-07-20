var GetTransformedPoint = require('./GetTransformedPoint');
var PointWithinHitArea = require('./PointWithinHitArea');

//  Will always return an array.
//  Array contains matching Interactive Objects.
//  Array will be empty if no objects were matched.

var HitTest = function (tempMatrix, x, y, gameObjects, camera, output)
{
    var cameraW = camera.width;
    var cameraH = camera.height;

    output.length = 0;

    if (!(x >= camera.x && y >= camera.y && x <= camera.x + cameraW && y <= camera.y + cameraH))
    {
        return output;
    }

    var screenPoint = camera.cameraToScreen({ x: x, y: y });
    var culledGameObjects = camera.cull(gameObjects);

    for (var i = 0; i < culledGameObjects.length; i++)
    {
        var gameObject = culledGameObjects[i];

        if (!gameObject.input.enabled)
        {
            continue;
        }

        var point = GetTransformedPoint(
            tempMatrix,
            gameObject,
            (screenPoint.x + camera.scrollX) * gameObject.scrollFactorX,
            (screenPoint.y + camera.scrollY) * gameObject.scrollFactorY
        );

        if (PointWithinHitArea(gameObject, point.x, point.y))
        {
            output.push(gameObject);
        }
    }

    return output;
};

module.exports = HitTest;
