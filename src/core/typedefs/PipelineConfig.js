/**
 * @typedef {object} Phaser.Types.Core.PipelineConfig
 * @since 3.50.0
 *
 * @property {string} name - The name of the pipeline. Must be unique within the Pipeline Manager.
 * @property {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The pipeline class. This should be a constructable object, **not** an instance of a class.
 * @property {number} [frameInc=32] - Sets the `PipelineManager.frameInc` value to control the dimension increase in the Render Targets.
 */
