/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * @namespace Phaser.Renderer.WebGL.Wrappers
 */

var Wrappers = {
    WebGLBufferWrapper: require('./WebGLBufferWrapper'),
    WebGLTextureWrapper: require('./WebGLTextureWrapper'),
    WebGLFramebufferWrapper: require('./WebGLFramebufferWrapper')
};

module.exports = Wrappers;
