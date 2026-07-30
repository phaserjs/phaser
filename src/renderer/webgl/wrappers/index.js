/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Wrappers
 */

var Wrappers = {
    WebGLGlobalWrapper: require('./WebGLGlobalWrapper'),
    WebGLBufferWrapper: require('./WebGLBufferWrapper'),
    WebGLProgramWrapper: require('./WebGLProgramWrapper'),
    WebGLShaderSetterWrapper: require('./WebGLShaderSetterWrapper'),
    WebGLTextureWrapper: require('./WebGLTextureWrapper'),
    WebGLTextureUnitsWrapper: require('./WebGLTextureUnitsWrapper'),
    WebGLFramebufferWrapper: require('./WebGLFramebufferWrapper'),
    WebGLVAOWrapper: require('./WebGLVAOWrapper'),
    WebGLVertexBufferLayoutWrapper: require('./WebGLVertexBufferLayoutWrapper')
};

module.exports = Wrappers;
