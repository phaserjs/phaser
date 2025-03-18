/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Merge = require('../../../utils/object/Merge');
var RenderNode = require('./RenderNode');

var RebindContext = new Class({
    Extends: RenderNode,

    initialize: function RebindContext (manager)
    {
        RenderNode.call(this, 'RebindContext', manager);

        /**
         * The WebGL state to set when this node is run.
         * This is read-only.
         *
         * @name Phaser.Renderer.WebGL.RenderNodes.RebindContext#_state
         * @type {Partial<Phaser.Renderer.WebGL.Wrappers.WebGLGlobalWrapper>}
         * @private
         * @since 4.0.0
         * @readonly
         */
        this._state = {
            bindings: {
                activeTexture: 0,
                arrayBuffer: null,
                elementArrayBuffer: null,
                framebuffer: null,
                program: null,
                renderbuffer: null
            },
            vao: null
        };
    },

    run: function (displayContext)
    {
        this.onRunBegin(displayContext);

        var renderer = this.manager.renderer;
        var glWrapper = renderer.glWrapper;

        // Clear the current framebuffer's stencil and depth renderbuffers.
        renderer.clearFramebuffer(
            undefined,
            undefined, // Stencil is currently not implemented by DrawingContext.
            0
        );

        // Rebind the entire WebGL state, setting resources to null.
        glWrapper.update(Merge(this._state, glWrapper.state), true);

        this.onRunEnd(displayContext);
    }
});

module.exports = RebindContext;
