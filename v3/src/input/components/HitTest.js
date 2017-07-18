var GetTransformedPoint = require('./GetTransformedPoint');
var PointWithinGameObject = require('./PointWithinGameObject');
var PointWithinInteractiveObject = require('./PointWithinInteractiveObject');

//  Will always return an array.
//  Array contains matching Interactive Objects.
//  Array will be empty if no objects were matched.

var HitTest = function (tempMatrix, x, y, gameObjectArray, camera, output)
{
    var cameraW = camera.width;
    var cameraH = camera.height;

    output.length = 0;

    if (!(x >= camera.x && y >= camera.y && x <= camera.x + cameraW && y <= camera.y + cameraH))
    {
        return output;
    }

    var scrollX = camera.scrollX;
    var scrollY = camera.scrollY;
    var screenPoint = camera.cameraToScreen({ x: x, y: y });
    var culled = camera.cullHitTest(gameObjectArray);

    for (var i = 0; i < culled.length; i++)
    {
        var object = culled[i];
        var gameObject = object.gameObject;

        var tpoint = GetTransformedPoint(tempMatrix, gameObject, screenPoint.x + scrollX * gameObject.scrollFactorX, screenPoint.y + scrollY * gameObject.scrollFactorY);

        if (PointWithinInteractiveObject(object, tpoint.x, tpoint.y))
        {
            output.push(object);
        }
    }

    return output;
};

module.exports = HitTest;
