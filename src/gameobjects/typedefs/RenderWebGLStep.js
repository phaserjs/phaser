/**
 * A function which performs a rendering operation on the given Game Object.
 * This is usually the `renderWebGL` method of the Game Object itself,
 * but `Phaser.GameObjects.Components.RenderSteps` allows you to define
 * a series of steps that are run in sequence.
 * The function is not expected to run in any particular scope,
 * so it should not use `this`. Instead, all required properties should be
 * accessed via `gameObject`.
 *
 * @callback Phaser.Types.GameObjects.RenderWebGLStep
 * @since 4.0.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - A reference to the current active WebGL renderer.
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object being rendered in this call.
 * @param {Phaser.Renderer.WebGL.DrawingContext} drawingContext - The current drawing context.
 * @param {Phaser.GameObjects.Components.TransformMatrix} [parentMatrix] - This transform matrix is defined if the game object is nested
 * @param {number} [renderStep=0] - The index of this function in the Game Object's list of render processes. Used to support multiple rendering functions.
 * @param {Phaser.GameObjects.GameObject[]} [displayList] - The display list which is currently being rendered.
 * @param {number} [displayListIndex] - The index of the Game Object within the display list.
 *
 * @returns {void}
 */
