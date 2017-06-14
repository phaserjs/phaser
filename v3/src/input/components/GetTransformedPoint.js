/**
* This will return the local coordinates of the specified displayObject based on the given Pointer.
*
* @method Phaser.Input#getLocalPosition
* @param {Phaser.Sprite|Phaser.Image} gameObject - The DisplayObject to get the local coordinates for.
* @param {Phaser.Pointer} pointer - The Pointer to use in the check against the gameObject.
* @return {Phaser.Point} A point containing the coordinates of the Pointer position relative to the DisplayObject.
*/
var GetTransformedPoint = function (matrix, gameObject, x, y, output)
{
    if (output === undefined) { output = { x: 0, y: 0 }; }

    matrix.applyITRS(gameObject.x, gameObject.y, gameObject.rotation, gameObject.scaleX, gameObject.scaleY);

    var a = matrix.matrix[0];
    var b = matrix.matrix[1];
    var c = matrix.matrix[2];
    var d = matrix.matrix[3];
    var tx = matrix.matrix[4];
    var ty = matrix.matrix[5];

    var id = 1 / (a * d + c * -b);

    output.x = d * id * x + -c * id * y + (ty * c - tx * d) * id;
    output.y = a * id * y + -b * id * x + (-ty * a + tx * b) * id;

    return output;
};

module.exports = GetTransformedPoint;
