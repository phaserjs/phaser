/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Wrappers
 */

var Wrappers = {
    WebGLAttribLocationWrapper: require('./WebGLAttribLocationWrapper'),
    WebGLBufferWrapper: require('./WebGLBufferWrapper'),
    WebGLProgramWrapper: require('./WebGLProgramWrapper'),
    WebGLTextureWrapper: require('./WebGLTextureWrapper'),
    WebGLFramebufferWrapper: require('./WebGLFramebufferWrapper'),
    WebGLUniformLocationWrapper: require('./WebGLUniformLocationWrapper')
};

module.exports = Wrappers;
