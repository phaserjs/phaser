/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var WEBGL_CONST = require('./const');
var Extend = require('../../utils/object/Extend');

/**
 * @namespace Phaser.Renderer.WebGL
 */

var WebGL = {

    Shaders: require('./shaders'),
    ShaderAdditionMakers: require('./shaders/additionMakers'),

    DrawingContext: require('./DrawingContext'),
    DrawingContextPool: require('./DrawingContextPool'),
    ProgramManager: require('./ProgramManager'),
    RenderNodes: require('./renderNodes'),
    ShaderProgramFactory: require('./ShaderProgramFactory'),
    Utils: require('./Utils'),
    WebGLRenderer: require('./WebGLRenderer'),
    Wrappers: require('./wrappers')

};

//   Merge in the consts

WebGL = Extend(false, WebGL, WEBGL_CONST);

//  Export it

module.exports = WebGL;
