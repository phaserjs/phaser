/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DrawingContext = require('../../renderer/webgl/DrawingContext.js');
var DefaultQuadNodes = require('../../renderer/webgl/renderNodes/defaults/DefaultQuadNodes');
var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject.js');
var CaptureFrameRender = require('./CaptureFrameRender.js');

/**
 * @classdesc
 * A CaptureFrame is a special type of GameObject that allows you to
 * capture the current state of the render.
 * For example, if you place a CaptureFrame between two other objects,
 * it will capture the first object to a texture, but not the second.
 * This is useful for full-scene post-processing prior to render completion,
 * such as a layer of water.
 *
 * This is a WebGL only feature and is not available in Canvas mode.
 *
 * You must activate the `forceComposite` property of the Camera,
 * or otherwise use this object within a framebuffer, to use this feature.
 * Examples of framebuffer situations include Filters, DynamicTexture,
 * and a camera with alpha between 0 and 1.
 *
 * This object does not render anything. It simply captures a texture
 * from the current framebuffer at the moment it 'renders'.
 * If you add filters to this object, it will capture the clear, temporary
 * framebuffer used for the filter, not the main framebuffer.
 * If you add filters to a Container that contains this object,
 * it will capture only objects within that Container.
 * If you set `visible` to `false`, it will just stop capturing.
 *
 * @example
 * // Within a Scene's `create` method:
 *
 * // This image will be captured:
 * var image1 = this.add.image(0, 0, 'image1');
 *
 * // Enable framebuffer usage:
 * this.cameras.main.setForceComposite(true);
 *
 * // Set up a CaptureFrame:
 * var captureFrame = this.add.captureFrame('myCaptureFrame');
 *
 * // This image will not be captured, and can display the captured image:
 * var image2 = this.add.image(0, 0, 'myCaptureFrame');
 * // Add filters to image2 to distort the captured image.
 *
 * @class CaptureFrame
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 4.0.0
 * @webglOnly
 *
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this CaptureFrame belongs.
 * @param {string} key - The key of the texture to create from this CaptureFrame.
 */
var CaptureFrame = new Class({
    Extends: GameObject,

    Mixins: [
        Components.BlendMode,
        Components.Depth,
        Components.RenderNodes,
        Components.Visible,
        CaptureFrameRender
    ],

    initialize: function CaptureFrame (scene, key)
    {
        GameObject.call(this, scene, 'CaptureFrame');

        var renderer = scene.renderer;

        /**
         * The drawing context of this CaptureFrame.
         * This contains the WebGL framebuffer and texture data.
         *
         * @name Phaser.GameObjects.CaptureFrame#drawingContext
         * @type {Phaser.Renderer.WebGL.DrawingContext}
         * @webglOnly
         * @since 4.0.0
         */
        this.drawingContext = new DrawingContext(renderer, {
            width: renderer.width,
            height: renderer.height
        });

        /**
         * A texture containing the captured frame.
         * This is updated when the GameObject renders.
         *
         * @name Phaser.GameObjects.CaptureFrame#captureTexture
         * @type {Phaser.Textures.Texture}
         * @webglOnly
         * @since 4.0.0
         */
        this.captureTexture = scene.sys.textures.addGLTexture(key, this.drawingContext.texture);

        this.initRenderNodes(this._defaultRenderNodesMap);
    },

    /**
     * The default render nodes for this Game Object.
     *
     * @name Phaser.GameObjects.CaptureFrame#_defaultRenderNodesMap
     * @type {Map<string, string>}
     * @private
     * @webglOnly
     * @readonly
     * @since 4.0.0
     */
    _defaultRenderNodesMap: {
        get: function ()
        {
            return DefaultQuadNodes;
        }
    },

    /**
     * Set the alpha value of this CaptureFrame.
     * This has no effect and is only present for compatibility with other Game Objects.
     *
     * @method Phaser.GameObjects.CaptureFrame#setAlpha
     * @since 4.0.0
     * @webglOnly
     * @param {number} alpha - The alpha value (not used).
     * @returns {this}
     */
    setAlpha: function (alpha)
    {
        return this;
    },

    /**
     * Set the scroll factor of this CaptureFrame.
     * This has no effect and is only present for compatibility with other Game Objects.
     *
     * @method Phaser.GameObjects.CaptureFrame#setScrollFactor
     * @since 4.0.0
     * @webglOnly
     * @param {number} x - The horizontal scroll factor (not used).
     * @param {number} y - The vertical scroll factor (not used).
     * @returns {this}
     */
    setScrollFactor: function (x, y)
    {
        return this;
    }
});

module.exports = CaptureFrame;
