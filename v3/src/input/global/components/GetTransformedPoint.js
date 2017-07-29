/**
* This will return the local coordinates of the specified displayObject based on the given Pointer.
*/
var GetTransformedPoint = function (matrix, gameObject, x, y, output)
{
    if (output === undefined) { output = { x: 0, y: 0 }; }

    matrix.applyITRS(gameObject.x, gameObject.y, -gameObject.rotation, gameObject.scaleX, gameObject.scaleY);

    matrix.invert();

    return matrix.transformPoint(x, y, output);
};

module.exports = GetTransformedPoint;
