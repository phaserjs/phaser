/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The WebGLPipeline After Flush Event.
 *
 * This event is dispatched by a WebGLPipeline right after it has issued a drawArrays command
 * and cleared its vertex count.
 *
 * @event Phaser.Renderer.WebGL.Pipelines.Events#AFTER_FLUSH
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The pipeline that has flushed.
 * @param {boolean} isPostFlush - Was this flush invoked as part of a post-process, or not?
 */
module.exports = 'pipelineafterflush';
