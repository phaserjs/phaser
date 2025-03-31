/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var TransformMatrix = require('./components/TransformMatrix');

var camMatrix = new TransformMatrix();
var spriteMatrix = new TransformMatrix();
var calcMatrix = new TransformMatrix();
var camExternalMatrix = new TransformMatrix();

var result = {
    camera: camMatrix,
    sprite: spriteMatrix,
    calc: calcMatrix,
    cameraExternal: camExternalMatrix
};

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
 * @param {boolean} [ignoreCameraPosition=false] - Should the camera's translation be ignored? This is what moves a camera around on the screen, but it should be ignored when the camera is being rendered to a framebuffer.
 *
 * @return {Phaser.Types.GameObjects.GetCalcMatrixResults} The results object containing the updated transform matrices.
 */
var GetCalcMatrix = function (src, camera, parentMatrix, ignoreCameraPosition)
{
    if (ignoreCameraPosition)
    {
        camExternalMatrix.loadIdentity();
    }
    else
    {
        camExternalMatrix.copyFrom(camera.matrixExternal);
    }

    camMatrix.copyWithScrollFactorFrom(
        ignoreCameraPosition ? camera.matrix : camera.matrixCombined,
        camera.scrollX, camera.scrollY,
        src.scrollFactorX, src.scrollFactorY
    );

    calcMatrix.copyFrom(camMatrix);

    if (parentMatrix)
    {
        calcMatrix.multiply(parentMatrix);
    }

    spriteMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

    calcMatrix.multiply(spriteMatrix);

    return result;
};

module.exports = GetCalcMatrix;
