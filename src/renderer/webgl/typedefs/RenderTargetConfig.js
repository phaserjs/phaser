/**
 * @typedef {object} Phaser.Types.Renderer.WebGL.RenderTargetConfig
 * @since 3.50.0
 *
 * @property {number} [scale=1] - A value between 0 and 1. Controls the size of this Render Target in relation to the Renderer. A value of 1 matches it. 0.5 makes the Render Target half the size of the renderer, etc.
 * @property {number} [minFilter=0] - The minFilter mode of the texture. 0 is `LINEAR`, 1 is `NEAREST`.
 * @property {boolean} [autoClear=true] - Controls if this Render Target is automatically cleared (via `gl.COLOR_BUFFER_BIT`) during the bind.
 * @property {number} [width] - The width of the Render Target. This is optional. If given it overrides the `scale` property.
 * @property {number} [height=width] - The height of the Render Target. This is optional. If not given, it will be set to the same as the `width` value.
 */
