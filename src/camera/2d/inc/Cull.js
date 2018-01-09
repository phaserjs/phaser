var Cull = function (renderableObjects)
{
    if (this.disableCull)
    {
        return renderableObjects;
    }

    var cameraMatrix = this.matrix.matrix;

    var mva = cameraMatrix[0];
    var mvb = cameraMatrix[1];
    var mvc = cameraMatrix[2];
    var mvd = cameraMatrix[3];
    
    /* First Invert Matrix */
    var determinant = (mva * mvd) - (mvb * mvc);

    if (!determinant)
    {
        return renderableObjects;
    }

    var mve = cameraMatrix[4];
    var mvf = cameraMatrix[5];

    var scrollX = this.scrollX;
    var scrollY = this.scrollY;
    var cameraW = this.width;
    var cameraH = this.height;
    var culledObjects = this.culledObjects;
    var length = renderableObjects.length;

    determinant = 1 / determinant;

    culledObjects.length = 0;

    for (var index = 0; index < length; ++index)
    {
        var object = renderableObjects[index];

        if (!object.hasOwnProperty('width'))
        {
            culledObjects.push(object);
            continue;
        }

        var objectW = object.width;
        var objectH = object.height;
        var objectX = (object.x - (scrollX * object.scrollFactorX)) - (objectW * object.originX);
        var objectY = (object.y - (scrollY * object.scrollFactorY)) - (objectH * object.originY);
        var tx = (objectX * mva + objectY * mvc + mve);
        var ty = (objectX * mvb + objectY * mvd + mvf);
        var tw = ((objectX + objectW) * mva + (objectY + objectH) * mvc + mve);
        var th = ((objectX + objectW) * mvb + (objectY + objectH) * mvd + mvf);
        var cullW = cameraW + objectW;
        var cullH = cameraH + objectH;

        if (tx > -objectW || ty > -objectH || tx < cullW || ty < cullH ||
            tw > -objectW || th > -objectH || tw < cullW || th < cullH)
        {
            culledObjects.push(object);
        }
    }

    return culledObjects;
};

module.exports = Cull;
