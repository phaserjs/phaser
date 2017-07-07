var GetTransformedPoint = require('./GetTransformedPoint');
var PointWithinGameObject = require('./PointWithinGameObject');

var PointScreenToWorldHitTest = function (tempMatrix, x, y, gameObjectArray, camera, output) 
{
    var length = gameObjectArray.length;
    var scrollX = camera.scrollX;
    var scrollY = camera.scrollY;
    var cameraW = camera.width;
    var cameraH = camera.height;

    output.length = 0;

    if (gameObjectArray instanceof Array)
    {
        var culled = camera.cull(gameObjectArray);
        var culledLength = culled.length;

        for (var index = 0; index < culledLength; ++index)
        {
            var object = culled[index];
            var tpoint = GetTransformedPoint(tempMatrix, object, x + scrollX * object.scrollFactorX, y + scrollY * object.scrollFactorY);

            if (PointWithinGameObject(object, tpoint.x, tpoint.y))
            {
                output.push(object);
            }
        }

        return output;
    }
    else
    {
        var tpoint = GetTransformedPoint(tempMatrix, object, x + scrollX * object.scrollFactorX, y + scrollY * object.scrollFactorY);
        
        if (PointWithinGameObject(object, tpoint.x, tpoint.y))
        {
            return object;
        }
    }

    return null;
};

module.exports = PointScreenToWorldHitTest;
