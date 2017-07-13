var GetTransformedPoint = require('./GetTransformedPoint');
var PointWithinGameObject = require('./PointWithinGameObject');

//  Will always return an array.
//  Array contains matching Game Objects.
//  Array will be empty if no objects were matched.

var PointScreenToWorldHitTest = function (tempMatrix, x, y, gameObjectArray, camera, output) 
{
    var length = gameObjectArray.length;
    var scrollX = camera.scrollX;
    var scrollY = camera.scrollY;
    var cameraW = camera.width;
    var cameraH = camera.height;

    output.length = 0;

    if (!(x >= camera.x && y >= camera.y &&
        x <= camera.x + cameraW && y <= camera.y + cameraH))
    {
        return output;
    }

    var screenPoint = camera.cameraToScreen({x: x, y: y});

    if (Array.isArray(gameObjectArray))
    {
        var culled = camera.cull(gameObjectArray);
        var culledLength = culled.length;

        for (var index = 0; index < culledLength; ++index)
        {
            var object = culled[index];
            var tpoint = GetTransformedPoint(tempMatrix, object, screenPoint.x + scrollX * object.scrollFactorX, screenPoint.y + scrollY * object.scrollFactorY);

            if (PointWithinGameObject(object, tpoint.x, tpoint.y))
            {
                output.push(object);
            }
        }
    }
    else
    {
        var object = gameObjectArray;

        var tpoint = GetTransformedPoint(tempMatrix, object, screenPoint.x + scrollX * object.scrollFactorX, screenPoint.y + scrollY * object.scrollFactorY);
        
        if (PointWithinGameObject(object, tpoint.x, tpoint.y))
        {
            output.push(object);
        }
    }

    return output;
};

module.exports = PointScreenToWorldHitTest;
