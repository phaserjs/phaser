var GetTransformedPoint = require('./GetTransformedPoint');
var PointWithinGameObject = require('./PointWithinGameObject');

//  Will always return an array.
//  Array contains matching Game Objects.
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
    var culled = camera.cull(gameObjectArray);

    for (var i = 0; i < culled.length; i++)
    {
        var object = culled[i];

        var tpoint = GetTransformedPoint(tempMatrix, object, screenPoint.x + scrollX * object.scrollFactorX, screenPoint.y + scrollY * object.scrollFactorY);

        if (PointWithinGameObject(object, tpoint.x, tpoint.y))
        {
            // output.push({ gameObject: object, x: tpoint.x, y: tpoint.y });
            output.push(object);
        }
    }

    return output;
};

module.exports = HitTest;
