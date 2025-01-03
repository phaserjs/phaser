/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var WEBGL_CONST = require('./const');
var Extend = require('../../utils/object/Extend');

/**
 * @namespace Phaser.Renderer.WebGL
 */

var WebGL = {

    PipelineManager: require('./PipelineManager'),
    Pipelines: require('./pipelines'),
    RenderTarget: require('./RenderTarget'),
    Utils: require('./Utils'),
    WebGLPipeline: require('./WebGLPipeline'),
    WebGLRenderer: require('./WebGLRenderer'),
    WebGLShader: require('./WebGLShader'),
    Wrappers: require('./wrappers')

};

//   Merge in the consts

WebGL = Extend(false, WebGL, WEBGL_CONST);

//  Export it

module.exports = WebGL;
