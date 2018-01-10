var PointWithinHitArea = require('./PointWithinHitArea');
var TransformXY = require('../../../math/TransformXY');

//  Will always return an array.
//  Array contains matching Interactive Objects.
//  Array will be empty if no objects were matched.

//  x/y = pointer x/y (un-translated)

var HitTest = function (tempPoint, x, y, gameObjects, camera, output)
{
    var cameraW = camera.width;
    var cameraH = camera.height;

    output.length = 0;

    if (!(x >= camera.x && y >= camera.y && x <= camera.x + cameraW && y <= camera.y + cameraH))
    {
        return output;
    }

    //  Stores the world point inside of tempPoint
    camera.getWorldPoint(x, y, tempPoint);

    var culledGameObjects = camera.cull(gameObjects);

    var point = { x: 0, y: 0 };

    for (var i = 0; i < culledGameObjects.length; i++)
    {
        var gameObject = culledGameObjects[i];

        if (!gameObject.input || !gameObject.input.enabled || !gameObject.willRender())
        {
            continue;
        }

        var px = tempPoint.x + (camera.scrollX * gameObject.scrollFactorX) - camera.scrollX;
        var py = tempPoint.y + (camera.scrollY * gameObject.scrollFactorY) - camera.scrollY;

        TransformXY(px, py, gameObject.x, gameObject.y, gameObject.rotation, gameObject.scaleX, gameObject.scaleY, point);

        if (PointWithinHitArea(gameObject, point.x, point.y))
        {
            output.push(gameObject);
        }
    }

    return output;
};

module.exports = HitTest;
