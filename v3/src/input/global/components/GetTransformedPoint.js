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

    matrix.applyITRS(gameObject.x, gameObject.y, -gameObject.rotation, gameObject.scaleX, gameObject.scaleY);

    matrix.invert();

    return matrix.transformPoint(x, y, output);
};

module.exports = GetTransformedPoint;
