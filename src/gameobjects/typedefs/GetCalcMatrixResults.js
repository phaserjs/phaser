/**
 * @typedef {object} Phaser.Types.GameObjects.GetCalcMatrixResults
 * @since 3.50.0
 *
 * @property {Phaser.GameObjects.Components.TransformMatrix} cameraExternal - The calculated Camera external matrix (where the camera is on the screen).
 * @property {Phaser.GameObjects.Components.TransformMatrix} camera - The calculated Camera view matrix, including scroll modified by scroll factor.
 * @property {Phaser.GameObjects.Components.TransformMatrix} sprite - The calculated Sprite (Game Object) matrix (world position).
 * @property {Phaser.GameObjects.Components.TransformMatrix} calc - The calculated results matrix, factoring all others in.
 */
