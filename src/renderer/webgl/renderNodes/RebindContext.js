/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Merge = require('../../../utils/object/Merge');
var RenderNode = require('./RenderNode');

/**
 * @classdesc
 * RebindContext is a RenderNode which sets the WebGL context to
 * a default state, resetting important properties
 * that might have been changed by an external renderer.
 *
 * This is used by the Extern GameObject after rendering.
 * It is the counterpart of YieldContext.
 *
 * @class RebindContext
 * @memberof Phaser.Renderer.WebGL.RenderNodes
 * @constructor
 * @since 4.0.0
 * @extends Phaser.Renderer.WebGL.RenderNodes.RenderNode
 * @param {Phaser.Renderer.WebGL.RenderNodes.RenderNodeManager} manager - The manager that owns this RenderNode.
 */
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

        // Unbind all texture units, forcing rebind on use.
        renderer.glTextureUnits.unbindAllUnits();

        this.onRunEnd(displayContext);
    }
});

module.exports = RebindContext;
