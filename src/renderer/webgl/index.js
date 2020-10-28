/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
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
    Utils: require('./Utils'),
    WebGLPipeline: require('./WebGLPipeline'),
    WebGLRenderer: require('./WebGLRenderer')

};

//   Merge in the consts

WebGL = Extend(false, WebGL, WEBGL_CONST);

//  Export it

module.exports = WebGL;
