/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
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
 * @extends Phaser.GameObjects.Components.FX
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {number} [width=256] - The width of the NineSlice Game Object in pixels. This is the width you want it displayed as, in game.
 * @param {number} [height=256] - The height of the NineSlice Game Object in pixels. This is the height you want it displayed as, in game.
 * @param {number} [leftWidth=0] - The size of the left vertical column (A). Set to zero to disable this column.
 * @param {number} [rightWidth=0] - The size of the right vertical column (B). Set to zero to disable this column.
 * @param {number} [topHeight=0] - The size of the top horiztonal row (C). Set to zero to disable this row.
 * @param {number} [bottomHeight=0] - The size of the bottom horiztonal row (D). Set to zero to disable this row.
 */
var NineSlice = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.FX,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.ScrollFactor,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        NineSliceRender
    ],

    initialize:

    function NineSlice (scene, x, y, texture, frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight)
    {
        if (width === undefined) { width = 256; }
        if (height === undefined) { height = 256; }
        if (leftWidth === undefined) { leftWidth = 0; }
        if (rightWidth === undefined) { rightWidth = 0; }
        if (topHeight === undefined) { topHeight = 0; }
        if (bottomHeight === undefined) { bottomHeight = 0; }

        GameObject.call(this, scene, 'NineSlice');

        this._width = width;
        this._height = height;

        this._originX = 0.5;
        this._originY = 0.5;

        this.vertices = [];

        for (var i = 0; i < 54; i++)
        {
            this.vertices.push(new Vertex());
        }

        this.setPosition(x, y);
        this.setTexture(texture, frame);

        // size of the left vertical bar (A)
        this.leftWidth = leftWidth;

        // size of the right vertical bar (B)
        this.rightWidth = rightWidth;

        // size of the top horizontal bar (C)
        this.topHeight = topHeight;

        // size of the bottom horizontal bar (D)
        this.bottomHeight = bottomHeight;

        /**
         * The tint value being applied to the top-left vertice of the Game Object.
         * This value is interpolated from the corner to the center of the Game Object.
         * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
         *
         * @name Phaser.GameObjects.Components.Tint#tint
         * @type {number}
         * @default 0xffffff
         * @since 3.60.0
         */
        this.tint = 0xffffff;

        /**
         * The tint fill mode.
         *
         * `false` = An additive tint (the default), where vertices colors are blended with the texture.
         * `true` = A fill tint, where the vertices colors replace the texture, but respects texture alpha.
         *
         * @name Phaser.GameObjects.Components.Tint#tintFill
         * @type {boolean}
         * @default false
         * @since 3.60.0
         */
        this.tintFill = false;

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
        var originX = this.originX;
        var originY = this.originY;

        var verts = this.vertices;

        verts[offset + 0].resize(x1, y1, width, height, originX, originY);
        verts[offset + 1].resize(x1, y2, width, height, originX, originY);
        verts[offset + 2].resize(x2, y1, width, height, originX, originY);
        verts[offset + 3].resize(x1, y2, width, height, originX, originY);
        verts[offset + 4].resize(x2, y2, width, height, originX, originY);
        verts[offset + 5].resize(x2, y1, width, height, originX, originY);
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
     * Clears all tint values associated with this Game Object.
     *
     * Immediately sets the color values back to 0xffffff and the tint type to 'additive',
     * which results in no visible change to the texture.
     *
     * @method Phaser.GameObjects.Components.Tint#clearTint
     * @webglOnly
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    clearTint: function ()
    {
        this.setTint(0xffffff);

        return this;
    },

    /**
     * Sets an additive tint on this Game Object.
     *
     * The tint works by taking the pixel color values from the Game Objects texture, and then
     * multiplying it by the color value of the tint.
     *
     * To modify the tint color once set, either call this method again with new values or use the
     * `tint` property.
     *
     * To remove a tint call `clearTint`, or call this method with no parameters.
     *
     * To swap this from being an additive tint to a fill based tint set the property `tintFill` to `true`.
     *
     * @method Phaser.GameObjects.Components.Tint#setTint
     * @webglOnly
     * @since 3.0.0
     *
     * @param {number} [color=0xffffff] - The tint being applied to the entire Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setTint: function (color)
    {
        if (color === undefined) { color = 0xffffff; }

        this.tint = color;

        this.tintFill = false;

        return this;
    },

    /**
     * Sets a fill-based tint on this Game Object.
     *
     * Unlike an additive tint, a fill-tint literally replaces the pixel colors from the texture
     * with those in the tint. You can use this for effects such as making a player flash 'white'
     * if hit by something. The whole Game Object will be rendered in the given color.
     *
     * To modify the tint color once set, either call this method again with new values or use the
     * `tint` property.
     *
     * To remove a tint call `clearTint`, or call this method with no parameters.
     *
     * To swap this from being a fill-tint to an additive tint set the property `tintFill` to `false`.
     *
     * @method Phaser.GameObjects.Components.Tint#setTintFill
     * @webglOnly
     * @since 3.11.0
     *
     * @param {number} [color=0xffffff] - The tint being applied to the entire Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setTintFill: function (color)
    {
        this.setTint(color);

        this.tintFill = true;

        return this;
    },

    /**
     * Does this Game Object have a tint applied?
     *
     * It checks to see if the tint property is set to a value other than 0xffffff.
     * This indicates that a Game Object is tinted.
     *
     * @name Phaser.GameObjects.Components.Tint#isTinted
     * @type {boolean}
     * @webglOnly
     * @readonly
     * @since 3.11.0
     */
    isTinted: {

        get: function ()
        {
            return (this.tint !== 0xffffff);
        }

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
    },

    /**
     * The horizontal origin of this Game Object.
     * The origin maps the relationship between the size and position of the Game Object.
     * The default value is 0.5, meaning all Game Objects are positioned based on their center.
     * Setting the value to 0 means the position now relates to the left of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Origin#originX
     * @type {number}
     * @since 3.60.0
     */
    originX: {

        get: function ()
        {
            return this._originX;
        },

        set: function (value)
        {
            this._originX = value;
            this.updateVertices();
        }

    },

    /**
     * The vertical origin of this Game Object.
     * The origin maps the relationship between the size and position of the Game Object.
     * The default value is 0.5, meaning all Game Objects are positioned based on their center.
     * Setting the value to 0 means the position now relates to the top of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Origin#originY
     * @type {number}
     * @since 3.60.0
     */
    originY: {

        get: function ()
        {
            return this._originY;
        },

        set: function (value)
        {
            this._originY = value;
            this.updateVertices();
        }

    },

    /**
     * Sets the origin of this Game Object.
     *
     * The values are given in the range 0 to 1.
     *
     * @method Phaser.GameObjects.Components.Origin#setOrigin
     * @since 3.60.0
     *
     * @param {number} [x=0.5] - The horizontal origin value.
     * @param {number} [y=x] - The vertical origin value. If not defined it will be set to the value of `x`.
     *
     * @return {this} This Game Object instance.
     */
    setOrigin: function (x, y)
    {
        if (x === undefined) { x = 0.5; }
        if (y === undefined) { y = x; }

        this._originX = x;
        this._originY = y;

        this.updateVertices();

        return this.updateDisplayOrigin();
    },

    preDestroy: function ()
    {
        this.vertices = [];
    }

});

module.exports = NineSlice;
