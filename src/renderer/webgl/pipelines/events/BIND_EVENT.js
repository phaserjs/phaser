/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The WebGLPipeline Bind Event.
 *
 * This event is dispatched by a WebGLPipeline when it is bound by the Pipeline Manager.
 *
 * @event Phaser.Renderer.WebGL.Pipelines.Events#BIND
 * @since 3.50.0
 *
 * @param {Phaser.Renderer.WebGL.WebGLPipeline} pipeline - The pipeline that was bound.
 * @param {Phaser.Renderer.WebGL.WebGLShader} currentShader - The shader that was set as being current.
 */
module.exports = 'pipelinebind';
