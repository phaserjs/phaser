/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var GameObject = require('../GameObject');
var Components = require('../components');
var NineSliceRender = require('./NineSliceRender');
var Vertex = require('../../geom/mesh/Vertex');

/**
 * @classdesc
 * A Nine Slice Game Object allows you to have a Sprite that can be stretched
 * both horizontally and vertically but that retains fixed-sized corners.
 * This is useful for UI and Button-like elements.
 *
 *      A                          B
 *    +---+----------------------+---+
 *  C | 1 |          2           | 3 |
 *    +---+----------------------+---+
 *    |   |                      |   |
 *    | 4 |          5           | 6 |
 *    |   |                      |   |
 *    +---+----------------------+---+
 *  D | 7 |          8           | 9 |
 *    +---+----------------------+---+
 *
 *  When changing this objects width and/or height:
 *
 *     areas 1, 3, 7 and 9 will remain unscaled.
 *     areas 2 and 8 will be stretched horizontally
 *     areas 4 and 6 will be stretched vertically
 *     area 5 will be stretched both horizontally and vertically
 *
 * You can also have a 3 slice:
 *
 * This works in a similar way, except you can only stretch it horizontally.
 * Therefore, it requires less configuration:
 *
 *      A                          B
 *    +---+----------------------+---+
 *    |   |                      |   |
 *  C | 1 |          2           | 3 |
 *    |   |                      |   |
 *    +---+----------------------+---+
 *
 *  When changing this objects width:
 *
 *     areas 1 and 3 will remain unscaled.
 *     area 2 will be stretched horizontally
 *
 * The above configuration concept is adapted from the Pixi NiceSlicePlane.
 *
 * @class NineSlice
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.60.0
 *
 * @extends Phaser.GameObjects.Components.AlphaSingle
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * @extends Phaser.GameObjects.Components.ScrollFactor
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var NineSlice = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
        Components.Pipeline,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        NineSliceRender
    ],

    initialize:

    function NineSlice (scene, sliceConfig, x, y, texture, frame)
    {
        if (x === undefined) { x = GetFastValue(sliceConfig, 'x', 0); }
        if (y === undefined) { y = GetFastValue(sliceConfig, 'y', 0); }
        if (texture === undefined) { texture = GetFastValue(sliceConfig, 'texture'); }
        if (frame === undefined) { frame = GetFastValue(sliceConfig, 'frame'); }

        GameObject.call(this, scene, 'NineSlice');

        this._width = 0;
        this._height = 0;

        this.vertices = [];
        this.tintFill = false;

        for (var i = 0; i < 54; i++)
        {
            this.vertices.push(new Vertex());
        }

        this.setPosition(x, y);
        this.setTexture(texture, frame);

        var width = GetFastValue(sliceConfig, 'width', this.frame.width);
        var height = GetFastValue(sliceConfig, 'height', this.frame.height);

        this.setSize(width, height);

        // size of the left vertical bar (A)
        this.leftWidth = GetFastValue(sliceConfig, 'left', 0);

        // size of the right vertical bar (B)
        this.rightWidth = GetFastValue(sliceConfig, 'right', 0);

        // size of the top horizontal bar (C)
        this.topHeight = GetFastValue(sliceConfig, 'top', 0);

        // size of the bottom horizontal bar (D)
        this.bottomHeight = GetFastValue(sliceConfig, 'bottom', 0);

        this.updateVertices();
        this.updateUVs();

        this.initPipeline();
    },

    is3Slice: function ()
    {
        return (this.vertices.length < 54);
    },

    is9Slice: function ()
    {
        return (this.vertices.length === 54);
    },

    updateUVs: function ()
    {
        var left = this.leftWidth;
        var right = this.rightWidth;
        var top = this.topHeight;
        var bot = this.bottomHeight;

        var width = this.frame.width;
        var height = this.frame.height;

        //  Top Left
        this.updateQuadUVs(0, 0, 0, left / width, top / height);

        //  Top Center
        this.updateQuadUVs(6, left / width, 0, 1 - (right / width), top / height);

        //  Top Right
        this.updateQuadUVs(12, 1 - (right / width), 0, 1, top / height);

        //  Center Left
        this.updateQuadUVs(18, 0, top / height, left / width, 1 - (bot / height));

        //  Center
        this.updateQuadUVs(24, left / width, top / height, 1 - right / width, 1 - (bot / height));

        //  Center Right
        this.updateQuadUVs(30, 1 - right / width, top / height, 1, 1 - (bot / height));

        //  Bottom Left
        this.updateQuadUVs(36, 0, 1 - bot / height, left / width, 1);

        //  Bottom Center
        this.updateQuadUVs(42, left / width, 1 - bot / height, 1 - right / width, 1);

        //  Bottom Right
        this.updateQuadUVs(48, 1 - right / width, 1 - bot / height, 1, 1);
    },

    updateVertices: function ()
    {
        var left = this.leftWidth;
        var right = this.rightWidth;
        var top = this.topHeight;
        var bot = this.bottomHeight;

        var width = this.width;
        var height = this.height;

        //  Top Left - Index 0 - 5
        this.updateQuad(0, -0.5, 0.5, -0.5 + (left / width), 0.5 - (top / height));

        //  Top Center - Index 6 - 11
        this.updateQuad(6, -0.5 + (left / width), 0.5, 0.5 - (right / width), 0.5 - (top / height));

        //  Top Right - Index 12 - 17
        this.updateQuad(12, 0.5 - (right / width), 0.5, 0.5, 0.5 - (top / height));

        //  Center Left - Index 18 - 23
        this.updateQuad(18, -0.5, 0.5 - (top / height), -0.5 + (left / width), -0.5 + (bot / height));

        //  Center - Index 24 - 29
        this.updateQuad(24, -0.5 + (left / width), 0.5 - (top / height), 0.5 - (right / width), -0.5 + (bot / height));

        //  Center Right - Index 30 - 35
        this.updateQuad(30, 0.5 - (right / width), 0.5 - (top / height), 0.5, -0.5 + (bot / height));

        //  Bottom Left - Index 36 - 41
        this.updateQuad(36, -0.5, -0.5 + (bot / height), -0.5 + (left / width), -0.5);

        //  Bottom Center - Index 42 - 47
        this.updateQuad(42, -0.5 + (left / width), -0.5 + (bot / height), 0.5 - (right / width), -0.5);

        //  Bottom Right - Index 48 - 53
        this.updateQuad(48, 0.5 - (right / width), -0.5 + (bot / height), 0.5, -0.5);
    },

    updateQuad: function (offset, x1, y1, x2, y2)
    {
        var width = this.width;
        var height = this.height;

        var verts = this.vertices;

        verts[offset + 0].set(x1, y1, 0).transformIdentity(width, height);
        verts[offset + 1].set(x1, y2, 0).transformIdentity(width, height);
        verts[offset + 2].set(x2, y1, 0).transformIdentity(width, height);
        verts[offset + 3].set(x1, y2, 0).transformIdentity(width, height);
        verts[offset + 4].set(x2, y2, 0).transformIdentity(width, height);
        verts[offset + 5].set(x2, y1, 0).transformIdentity(width, height);
    },

    updateQuadUVs: function (offset, u1, v1, u2, v2)
    {
        var verts = this.vertices;

        verts[offset + 0].setUVs(u1, v1);
        verts[offset + 1].setUVs(u1, v2);
        verts[offset + 2].setUVs(u2, v1);
        verts[offset + 3].setUVs(u1, v2);
        verts[offset + 4].setUVs(u2, v2);
        verts[offset + 5].setUVs(u2, v1);
    },

    /**
     * The displayed width of this Game Object.
     *
     * Setting this value will adjust the way in which this Nine Slice
     * object scales horizontally, if configured to do so.
     *
     * @name Phaser.GameObjects.NiceSlice#width
     * @type {number}
     * @since 3.60.0
     */
    width: {

        get: function ()
        {
            return this._width;
        },

        set: function (value)
        {
            this._width = value;

            this.updateVertices();
        }

    },

    /**
     * The displayed height of this Game Object.
     *
     * Setting this value will adjust the way in which this Nine Slice
     * object scales vertically, if configured to do so.
     *
     * @name Phaser.GameObjects.NiceSlice#height
     * @type {number}
     * @since 3.60.0
     */
    height: {

        get: function ()
        {
            return this._height;
        },

        set: function (value)
        {
            this._height = value;

            this.updateVertices();
        }

    },

    /**
     * The displayed width of this Game Object.
     *
     * This value takes into account the scale factor.
     *
     * Setting this value will adjust the Game Object's scale property.
     *
     * @name Phaser.GameObjects.NineSlice#displayWidth
     * @type {number}
     * @since 3.60.0
     */
    displayWidth: {

        get: function ()
        {
            return this.scaleX * this.width;
        },

        set: function (value)
        {
            this.scaleX = value / this.width;
        }

    },

    /**
     * The displayed height of this Game Object.
     *
     * This value takes into account the scale factor.
     *
     * Setting this value will adjust the Game Object's scale property.
     *
     * @name Phaser.GameObjects.NineSlice#displayHeight
     * @type {number}
     * @since 3.60.0
     */
    displayHeight: {

        get: function ()
        {
            return this.scaleY * this.height;
        },

        set: function (value)
        {
            this.scaleY = value / this.height;
        }

    },

    /**
     * Sets the internal size of this Game Object, as used for frame or physics body creation.
     *
     * This will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or call the
     * `setDisplaySize` method, which is the same thing as changing the scale but allows you
     * to do so by giving pixel values.
     *
     * If you have enabled this Game Object for input, changing the size will _not_ change the
     * size of the hit area. To do this you should adjust the `input.hitArea` object directly.
     *
     * @method Phaser.GameObjects.NineSlice#setSize
     * @since 3.60.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setSize: function (width, height)
    {
        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * Sets the display size of this Game Object.
     *
     * Calling this will adjust the scale.
     *
     * @method Phaser.GameObjects.NineSlice#setDisplaySize
     * @since 3.60.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setDisplaySize: function (width, height)
    {
        this.displayWidth = width;
        this.displayHeight = height;

        return this;
    }

});

module.exports = NineSlice;
