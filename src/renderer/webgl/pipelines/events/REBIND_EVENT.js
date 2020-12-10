/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The WebGLPipeline ReBind Event.
 *
 * This event is dispatched by a WebGLPipeline when it is re-bound by the Pipeline Manager.
 *
 * @event Phaser.Renderer.WebGL.Pipelines.Events#REBIND
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The pipeline that was rebound.
 * @param {Phaser.Renderer.WebGL.WebGLShader} currentShader - The shader that was set as being current.
 */
module.exports = 'pipelinerebind';
