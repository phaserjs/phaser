/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var CONST = require('../../../const');
var DeepCopy = require('../../../utils/object/DeepCopy');
var WebGLStencilParametersFactory = require('./WebGLStencilParametersFactory');

/**
 * A factory namespace that creates `WebGLGlobalParameters` objects for use by the
 * WebGL Renderer. A `WebGLGlobalParameters` object captures the complete set of
 * global WebGL state tracked by Phaser, including buffer bindings, blend mode,
 * color masks, scissor region, stencil settings, texturing options, and viewport
 * dimensions. The renderer uses these objects to detect state changes and avoid
 * redundant WebGL calls, which improves rendering performance.
 *
 * @namespace Phaser.Renderer.WebGL.WebGLGlobalParametersFactory
 * @webglOnly
 * @since 4.0.0
 */
var WebGLGlobalParametersFactory = {

    /**
     * Creates a new `WebGLGlobalParameters` object populated with sensible default
     * values. The defaults reflect the initial WebGL state expected at the start of
     * each render: the NORMAL blend mode, a fully-opaque black clear color, all
     * color channels enabled for writing, face culling and depth testing disabled,
     * scissor testing enabled with a zero-sized box, default stencil parameters
     * (obtained via `WebGLStencilParametersFactory`), and a zero-sized viewport.
     * This object is typically used by the WebGL Renderer to initialise or reset
     * its tracked global state.
     *
     * @method Phaser.Renderer.WebGL.WebGLGlobalParametersFactory#getDefault
     * @since 4.0.0
     * @param {Phaser.Renderer.WebGL.WebGLRenderer} renderer - The WebGLRenderer to create the WebGLGlobalParameters for.
     * @return {Phaser.Types.Renderer.WebGL.WebGLGlobalParameters} The default WebGLGlobalParameters.
     */
    getDefault: function (renderer)
    {
        var parameters = {
            bindings: {
                activeTexture: 0,
                arrayBuffer: null,
                elementArrayBuffer: null,
                framebuffer: null,
                program: null,
                renderbuffer: null
            },
            blend: DeepCopy(renderer.blendModes[CONST.BlendModes.NORMAL]),
            colorClearValue: [ 0, 0, 0, 1 ],
            colorWritemask: [ true, true, true, true ],
            cullFace: false,
            depthTest: false,
            scissor: {
                enable: true,
                box: [ 0, 0, 0, 0 ]
            },
            stencil: WebGLStencilParametersFactory.create(renderer),
            texturing: {
                flipY: false,
                premultiplyAlpha: false
            },
            vao: null,
            viewport: [ 0, 0, 0, 0 ]
        };

        return parameters;
    }
};

module.exports = WebGLGlobalParametersFactory;
