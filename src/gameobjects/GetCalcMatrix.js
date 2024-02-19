/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('./components/TransformMatrix');

var tempMatrix1 = new TransformMatrix();
var tempMatrix2 = new TransformMatrix();
var tempMatrix3 = new TransformMatrix();

var result = { camera: tempMatrix1, sprite: tempMatrix2, calc: tempMatrix3 };

/**
 * Calculates the Transform Matrix of the given Game Object and Camera, factoring in
 * the parent matrix if provided.
 *
 * Note that the object this results contains _references_ to the Transform Matrices,
 * not new instances of them. Therefore, you should use their values immediately, or
 * copy them to your own matrix, as they will be replaced as soon as another Game
 * Object is rendered.
 *
 * @function Phaser.GameObjects.GetCalcMatrix
 * @memberof Phaser.GameObjects
 * @since 3.50.0
 *
 * @param {Phaser.GameObjects.GameObject} src - The Game Object to calculate the transform matrix for.
 * @param {Phaser.Cameras.Scene2D.Camera} camera - The camera being used to render the Game Object.
 * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - The transform matrix of the parent container, if any.
 *
 * @return {Phaser.Types.GameObjects.GetCalcMatrixResults} The results object containing the updated transform matrices.
 */
var GetCalcMatrix = function (src, camera, parentMatrix)
{
    var camMatrix = tempMatrix1;
    var spriteMatrix = tempMatrix2;
    var calcMatrix = tempMatrix3;

    spriteMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

    camMatrix.copyFrom(camera.matrix);

    if (parentMatrix)
    {
        //  Multiply the camera by the parent matrix
        camMatrix.multiplyWithOffset(parentMatrix, -camera.scrollX * src.scrollFactorX, -camera.scrollY * src.scrollFactorY);

        //  Undo the camera scroll
        spriteMatrix.e = src.x;
        spriteMatrix.f = src.y;
    }
    else
    {
        spriteMatrix.e -= camera.scrollX * src.scrollFactorX;
        spriteMatrix.f -= camera.scrollY * src.scrollFactorY;
    }

    //  Multiply by the Sprite matrix, store result in calcMatrix
    camMatrix.multiply(spriteMatrix, calcMatrix);

    return result;
};

module.exports = GetCalcMatrix;
