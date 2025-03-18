/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DefaultStampNodes = require('../../renderer/webgl/renderNodes/defaults/DefaultStampNodes');
var Class = require('../../utils/Class');
var Image = require('../image/Image');
var StampRender = require('./StampRender');

/**
 * @classdesc
 * A Stamp Game Object.
 *
 * A Stamp is a light-weight Game Object which ignores camera scroll and transform,
 * so it is rendered at a fixed position on-screen.
 * This is useful for HUDs, counters, etc.
 * Its main role is for DynamicTexture rendering.
 * It is otherwise similar to Image.
 *
 * @class Stamp
 * @extends Phaser.GameObjects.Image
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 4.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Lighting
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var Stamp = new Class({
    Extends: Image,

    Mixins: [
        StampRender
    ],

    initialize: function Stamp (scene, x, y, texture, frame)
    {
        Image.call(this, scene, x, y, texture, frame);

        this.type = 'Stamp';
    },

    _defaultRenderNodesMap: {
        get: function ()
        {
            return DefaultStampNodes;
        }
    }
});

module.exports = Stamp;
