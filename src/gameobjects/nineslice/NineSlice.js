/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var DefaultNineSliceNodes = require('../../renderer/webgl/renderNodes/defaults/DefaultQuadNodes');
var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var NineSliceRender = require('./NineSliceRender');
var TintModes = require('../../renderer/TintModes');
var Vertex = require('./NineSliceVertex');

/**
 * @classdesc
 * A Nine Slice Game Object allows you to display a texture-based object that
 * can be stretched both horizontally and vertically, but that retains
 * fixed-sized corners. The dimensions of the corners are set via the
 * parameters to this class.
 *
 * This is extremely useful for UI and button like elements, where you need
 * them to expand to accommodate the content without distorting the texture.
 *
 * The texture you provide for this Game Object should be based on the
 * following layout structure:
 *
 * ```
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
 * ```
 *
 * When changing this objects width and / or height:
 *
 *     areas 1, 3, 7 and 9 (the corners) will remain unscaled
 *     areas 2 and 8 will be stretched horizontally only
 *     areas 4 and 6 will be stretched vertically only
 *     area 5 will be stretched both horizontally and vertically
 *
 * You can also create a 3 slice Game Object:
 *
 * This works in a similar way, except you can only stretch it horizontally.
 * Therefore, it requires less configuration:
 *
 * ```
 *      A                          B
 *    +---+----------------------+---+
 *    |   |                      |   |
 *  C | 1 |          2           | 3 |
 *    |   |                      |   |
 *    +---+----------------------+---+
 * ```
 *
 * When changing this objects width (you cannot change its height)
 *
 *     areas 1 and 3 will remain unscaled
 *     area 2 will be stretched horizontally
 *
 * The above configuration concept is adapted from the Pixi NineSlicePlane.
 *
 * To specify a 3 slice object instead of a 9 slice you should only
 * provide the `leftWidth` and `rightWidth` parameters. To create a 9 slice
 * you must supply all parameters.
 *
 * The _minimum_ width this Game Object can be is the total of
 * `leftWidth` + `rightWidth`.  The _minimum_ height this Game Object
 * can be is the total of `topHeight` + `bottomHeight`.
 * If you need to display this object at a smaller size, you can scale it.
 *
 * In terms of performance, using a 3 slice Game Object is the equivalent of
 * having 3 Sprites in a row. Using a 9 slice Game Object is the equivalent
 * of having 9 Sprites in a row. The vertices of this object are all batched
 * together and can co-exist with other Sprites and graphics on the display
 * list, without incurring any additional overhead.
 *
 * This Game Object can now populate its values automatically
 * if they have been set within Texture Packer 7.1.0 or above and exported with
 * the atlas json. If this is the case, you can just create this Game Object without
 * specifying anything more than the texture key and frame and it will pull the
 * area data from the atlas.
 *
 * This object does not support trimmed textures from Texture Packer.
 * Trimming interferes with the ability to stretch the texture correctly.
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
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.RenderNodes
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of the center of this Game Object in the world.
 * @param {number} y - The vertical position of the center of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {number} [width=256] - The width of the Nine Slice Game Object. You can adjust the width post-creation.
 * @param {number} [height=256] - The height of the Nine Slice Game Object. If this is a 3 slice object the height will be fixed to the height of the texture and cannot be changed.
 * @param {number} [leftWidth=10] - The size of the left vertical column (A).
 * @param {number} [rightWidth=10] - The size of the right vertical column (B).
 * @param {number} [topHeight=0] - The size of the top horizontal row (C). Set to zero or undefined to create a 3 slice object.
 * @param {number} [bottomHeight=0] - The size of the bottom horizontal row (D). Set to zero or undefined to create a 3 slice object.
 * @param {boolean} [tileX=false] - When enabled, the scalable horizontal regions are repeated across the object instead of being stretched. Each tile is still slightly stretched so that it remains visible in full, which may cause minor distortion but far less than pure stretching. The texture should be seamless to avoid visible artifacts between tiles.
 * @param {boolean} [tileY=false] - When enabled, the scalable vertical regions are repeated across the object instead of being stretched. Each tile is still slightly stretched so that it remains visible in full, which may cause minor distortion but far less than pure stretching. The texture should be seamless to avoid visible artifacts between tiles.
 */
var NineSlice = new Class({

    Extends: GameObject,

    Mixins: [
        Components.AlphaSingle,
        Components.BlendMode,
        Components.Depth,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.RenderNodes,
        Components.ScrollFactor,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        NineSliceRender
    ],

    initialize:

    function NineSlice (scene, x, y, texture, frame, width, height, leftWidth, rightWidth, topHeight, bottomHeight, tileX, tileY)
    {
        // if (width === undefined) { width = 256; }
        // if (height === undefined) { height = 256; }

        // if (leftWidth === undefined) { leftWidth = 10; }
        // if (rightWidth === undefined) { rightWidth = 10; }
        // if (topHeight === undefined) { topHeight = 0; }
        // if (bottomHeight === undefined) { bottomHeight = 0; }

        GameObject.call(this, scene, 'NineSlice');

        /**
         * Internal width value. Do not modify this property directly.
         *
         * @name Phaser.GameObjects.NineSlice#_width
         * @private
         * @type {number}
         * @since 3.60.0
         */
        this._width;

        /**
         * Internal height value. Do not modify this property directly.
         *
         * @name Phaser.GameObjects.NineSlice#_height
         * @private
         * @type {number}
         * @since 3.60.0
         */
        this._height;

        /**
         * Internal originX value. Do not modify this property directly.
         *
         * @name Phaser.GameObjects.NineSlice#_originX
         * @private
         * @type {number}
         * @since 3.60.0
         */
        this._originX = 0.5;

        /**
         * Internal originY value. Do not modify this property directly.
         *
         * @name Phaser.GameObjects.NineSlice#_originY
         * @private
         * @type {number}
         * @since 3.60.0
         */
        this._originY = 0.5;

        /**
         * Internal component value. Do not modify this property directly.
         *
         * @name Phaser.GameObjects.NineSlice#_sizeComponent
         * @private
         * @type {boolean}
         * @since 3.60.0
         */
        this._sizeComponent = true;

        /**
         * An array of Vertex objects that correspond to the quads that make-up
         * this Nine Slice Game Object. They are stored in the following order:
         *
         * Top Left - Indexes 0 - 5
         * Top Center - Indexes 6 - 11
         * Top Right - Indexes 12 - 17
         * Center Left - Indexes 18 - 23
         * Center - Indexes 24 - 29
         * Center Right - Indexes 30 - 35
         * Bottom Left - Indexes 36 - 41
         * Bottom Center - Indexes 42 - 47
         * Bottom Right - Indexes 48 - 53
         *
         * Each quad is represented by 6 Vertex instances.
         *
         * This array will contain 18 elements for a 3 slice object
         * and 54 for a nine slice object.
         *
         * You should never modify this array once it has been populated.
         *
         * @name Phaser.GameObjects.NineSlice#vertices
         * @type {Phaser.GameObjects.NineSliceVertex[]}
         * @since 3.60.0
         */
        this.vertices = [];

        /**
         * The size of the left vertical bar (A).
         *
         * @name Phaser.GameObjects.NineSlice#leftWidth
         * @type {number}
         * @readonly
         * @since 3.60.0
         */
        this.leftWidth;

        /**
         * The size of the right vertical bar (B).
         *
         * @name Phaser.GameObjects.NineSlice#rightWidth
         * @type {number}
         * @readonly
         * @since 3.60.0
         */
        this.rightWidth;

        /**
         * The size of the top horizontal bar (C).
         *
         * If this is a 3 slice object this property will be set to the
         * height of the texture being used.
         *
         * @name Phaser.GameObjects.NineSlice#topHeight
         * @type {number}
         * @readonly
         * @since 3.60.0
         */
        this.topHeight;

        /**
         * The size of the bottom horizontal bar (D).
         *
         * If this is a 3 slice object this property will be set to zero.
         *
         * @name Phaser.GameObjects.NineSlice#bottomHeight
         * @type {number}
         * @readonly
         * @since 3.60.0
         */
        this.bottomHeight;

        /**
         * Indicates whether the scalable horizontal regions of the Nine Slice
         * are repeated across the object instead of being stretched. Each tile
         * is still slightly stretched so that it remains visible in full.
         *
         * @name Phaser.GameObjects.NineSlice#tileX
         * @type {boolean}
         * @readonly
         * @since 4.0.0
         */
        this.tileX = tileX || false;

        /**
         * Indicates whether the scalable vertical regions of the Nine Slice
         * are repeated across the object instead of being stretched. Each tile
         * is still slightly stretched so that it remains visible in full.
         *
         * @name Phaser.GameObjects.NineSlice#tileY
         * @type {boolean}
         * @readonly
         * @since 4.0.0
         */
        this.tileY = tileY || false;

        /**
         * Internal horizontal repeat count. Do not modify directly.
         *
         * @name Phaser.GameObjects.NineSlice#_repeatCountX
         * @private
         * @type {number}
         * @since 4.0.0
         */
        this._repeatCountX = 1;

        /**
         * Internal vertical repeat count. Do not modify directly.
         *
         * @name Phaser.GameObjects.NineSlice#_repeatCountY
         * @private
         * @type {number}
         * @since 4.0.0
         */
        this._repeatCountY = 1;

        /**
         * The tint value being applied to the Game Object.
         * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
         *
         * @name Phaser.GameObjects.NineSlice#tint
         * @type {number}
         * @default 0xffffff
         * @since 3.60.0
         */
        this.tint = 0xffffff;

        /**
         * The tint mode to use when applying the tint to the texture.
         *
         * Available modes are:
         * - Phaser.TintModes.MULTIPLY (default)
         * - Phaser.TintModes.FILL
         * - Phaser.TintModes.ADD
         * - Phaser.TintModes.SCREEN
         * - Phaser.TintModes.OVERLAY
         * - Phaser.TintModes.HARD_LIGHT
         *
         * @name Phaser.GameObjects.NineSlice#tintMode
         * @type {Phaser.TintModes}
         * @default Phaser.TintModes.MULTIPLY
         * @since 4.0.0
         */
        this.tintMode = TintModes.MULTIPLY;

        var textureFrame = scene.textures.getFrame(texture, frame);

        /**
         * This property is `true` if this Nine Slice Game Object was configured
         * with just `leftWidth` and `rightWidth` values, making it a 3-slice
         * instead of a 9-slice object.
         *
         * @name Phaser.GameObjects.NineSlice#is3Slice
         * @type {boolean}
         * @since 3.60.0
         */
        this.is3Slice = (!topHeight && !bottomHeight);

        if (textureFrame && textureFrame.scale9)
        {
            //  If we're using the scale9 data from the frame, override the values from above
            this.is3Slice = textureFrame.is3Slice;
        }

        var size = this.is3Slice ? 18 : 54;

        for (var i = 0; i < size; i++)
        {
            this.vertices.push(new Vertex());
        }

        this.setPosition(x, y);

        this.setTexture(texture, frame);

        this.setSlices(width, height, leftWidth, rightWidth, topHeight, bottomHeight, false);

        this.updateDisplayOrigin();

        this.initRenderNodes(this._defaultRenderNodesMap);
    },

    /**
     * The default render nodes for this Game Object.
     *
     * @name Phaser.GameObjects.NineSlice#_defaultRenderNodesMap
     * @type {Map<string, string>}
     * @private
     * @webglOnly
     * @readonly
     * @since 4.0.0
     */
    _defaultRenderNodesMap: {
        get: function ()
        {
            return DefaultNineSliceNodes;
        }
    },

    /**
     * Resets the width, height and slices for this NineSlice Game Object.
     *
     * This allows you to modify the texture being used by this object and then reset the slice configuration,
     * to avoid having to destroy this Game Object in order to use it for a different game element.
     *
     * Please note that you cannot change a 9-slice to a 3-slice or vice versa.
     *
     * @method Phaser.GameObjects.NineSlice#setSlices
     * @since 3.60.0
     *
     * @param {number} [width=256] - The width of the Nine Slice Game Object. You can adjust the width post-creation.
     * @param {number} [height=256] - The height of the Nine Slice Game Object. If this is a 3 slice object the height will be fixed to the height of the texture and cannot be changed.
     * @param {number} [leftWidth=10] - The size of the left vertical column (A).
     * @param {number} [rightWidth=10] - The size of the right vertical column (B).
     * @param {number} [topHeight=0] - The size of the top horizontal row (C). Set to zero or undefined to create a 3 slice object.
     * @param {number} [bottomHeight=0] - The size of the bottom horizontal row (D). Set to zero or undefined to create a 3 slice object.
     * @param {boolean} [skipScale9=false] - If this Nine Slice was created from Texture Packer scale9 atlas data, set this property to use the given column sizes instead of those specified in the JSON.
     *
     * @return {this} This Game Object instance.
     */
    setSlices: function (width, height, leftWidth, rightWidth, topHeight, bottomHeight, skipScale9)
    {
        if (leftWidth === undefined) { leftWidth = 10; }
        if (rightWidth === undefined) { rightWidth = 10; }
        if (topHeight === undefined) { topHeight = 0; }
        if (bottomHeight === undefined) { bottomHeight = 0; }

        if (skipScale9 === undefined) { skipScale9 = false; }

        var frame = this.frame;

        var sliceChange = false;

        if (this.is3Slice && skipScale9 && topHeight !== 0 && bottomHeight !== 0)
        {
            sliceChange = true;
        }

        if (sliceChange)
        {
            console.warn('Cannot change 9 slice to 3 slice');
        }
        else
        {
            if (frame && frame.scale9 && !skipScale9)
            {
                var data = frame.data.scale9Borders;

                var x = data.x;
                var y = data.y;

                leftWidth = x;
                rightWidth = frame.width - data.w - x;
                topHeight = y;
                bottomHeight = frame.height - data.h - y;

                if (width === undefined)
                {
                    width = frame.width;
                }

                if (height === undefined)
                {
                    height = frame.height;
                }
            }
            else
            {
                if (width === undefined) { width = 256; }
                if (height === undefined) { height = 256; }
            }

            this._width = width;
            this._height = height;

            this.leftWidth = leftWidth;
            this.rightWidth = rightWidth;
            this.topHeight = topHeight;
            this.bottomHeight = bottomHeight;

            if (this.is3Slice)
            {
                height = frame.height;

                this._height = height;
                this.topHeight = height;
                this.bottomHeight = 0;
            }

            this.updateVertices();
            this.updateUVs();
        }

        return this;
    },

    /**
     * Updates all of the vertex UV coordinates. This is called automatically
     * when the NineSlice Game Object is created, or if the texture frame changes.
     *
     * Unlike with the `updateVertices` method, you do not need to call this
     * method if the Nine Slice changes size. Only if it changes texture frame.
     *
     * @method Phaser.GameObjects.NineSlice#updateUVs
     * @since 3.60.0
     */
    updateUVs: function ()
    {
        var left = this.leftWidth;
        var right = this.rightWidth;
        var top = this.topHeight;
        var bot = this.bottomHeight;

        var width = this.frame.width;
        var height = this.frame.height;

        var uL = left / width;
        var uR = 1 - right / width;
        var vT = top / height;
        var vB = 1 - bot / height;

        var idx = 0;

        if (this.is3Slice)
        {
            this._updateUVRow(idx, uL, uR, 0, vT);
        }
        else
        {
            idx = this._updateUVRow(idx, uL, uR, 0, vT);

            for (var j = 0; j < this._repeatCountY; j++)
            {
                idx = this._updateUVRow(idx, uL, uR, vT, vB);
            }

            this._updateUVRow(idx, uL, uR, vB, 1);
        }
    },

    /**
     * Emits UVs for one row: left cap, `_repeatCountX` tiled middles, right cap.
     *
     * @method Phaser.GameObjects.NineSlice#_updateUVRow
     * @private
     * @since 4.0.0
     *
     * @param {number} idx - The starting vertex index.
     * @param {number} uL - Middle tile U start.
     * @param {number} uR - Middle tile U end.
     * @param {number} vT - Row V top.
     * @param {number} vB - Row V bottom.
     *
     * @return {number} The new vertex index after this row.
     */
    _updateUVRow: function (idx, uL, uR, vT, vB)
    {
        this.updateQuadUVs(idx, 0, vT, uL, vB);
        idx += 6;

        for (var i = 0; i < this._repeatCountX; i++)
        {
            this.updateQuadUVs(idx, uL, vT, uR, vB);
            idx += 6;
        }

        this.updateQuadUVs(idx, uR, vT, 1, vB);
        idx += 6;

        return idx;
    },

    /**
     * Recalculates all of the vertices in this Nine Slice Game Object
     * based on the `leftWidth`, `rightWidth`, `topHeight`, `bottomHeight`,
     * `tileX` and `tileY` properties, combined with the Game Object size.
     *
     * This method is called automatically when this object is created
     * or if its origin is changed.
     *
     * You should not typically need to call this method directly, but it
     * is left public should you find a need to modify one of those properties
     * after creation.
     *
     * @method Phaser.GameObjects.NineSlice#updateVertices
     * @since 3.60.0
     */
    updateVertices: function ()
    {
        var left = this.leftWidth;
        var right = this.rightWidth;
        var top = this.topHeight;
        var bot = this.bottomHeight;

        var width = this.width;
        var height = this.height;
        var frame = this.frame;

        var repeatCountX = this.tileX
            ? this._calcRepeatCount(width - left - right, frame.width - left - right)
            : 1;

        var repeatCountY = (this.tileY && !this.is3Slice)
            ? this._calcRepeatCount(height - top - bot, frame.height - top - bot)
            : 1;

        var needRebuild = this._rebuildVertexArray(repeatCountX, repeatCountY);

        //  Key positions in normalized coordinates (-0.5 to 0.5)
        var xL = -0.5;
        var xML = -0.5 + left / width;
        var xMR = 0.5 - right / width;
        var xR = 0.5;

        var yT = 0.5;
        var yMT = 0.5 - top / height;

        var tileWidth = (xMR - xML) / repeatCountX;
        var idx = 0;

        if (this.is3Slice)
        {
            this._updateVertexRow(idx, xL, xML, xMR, xR, yT, yMT, tileWidth);
        }
        else
        {
            var yMB = -0.5 + bot / height;
            var yB = -0.5;
            var tileHeight = (yMT - yMB) / repeatCountY;

            idx = this._updateVertexRow(idx, xL, xML, xMR, xR, yT, yMT, tileWidth);

            for (var j = 0; j < repeatCountY; j++)
            {
                var rowTop = yMT - j * tileHeight;
                var rowBot = yMT - (j + 1) * tileHeight;

                idx = this._updateVertexRow(idx, xL, xML, xMR, xR, rowTop, rowBot, tileWidth);
            }

            this._updateVertexRow(idx, xL, xML, xMR, xR, yMB, yB, tileWidth);
        }

        if (needRebuild)
        {
            this.updateUVs();
        }
    },

    /**
     * Returns the number of tile repeats that fit in the given scalable
     * region, or 1 if the original size is zero.
     *
     * @method Phaser.GameObjects.NineSlice#_calcRepeatCount
     * @private
     * @since 4.0.0
     *
     * @param {number} scalableSize - The current scalable region size.
     * @param {number} originalSize - The original (texture) scalable region size.
     *
     * @return {number} The repeat count (at least 1).
     */
    _calcRepeatCount: function (scalableSize, originalSize)
    {
        if (originalSize > 0)
        {
            return Math.max(1, Math.floor(scalableSize / originalSize));
        }

        return 1;
    },

    /**
     * Rebuilds the vertex array if the repeat counts have changed.
     * Updates `_repeatCountX` and `_repeatCountY` and resizes `vertices`.
     *
     * @method Phaser.GameObjects.NineSlice#_rebuildVertexArray
     * @private
     * @since 4.0.0
     *
     * @param {number} repeatCountX - Horizontal repeat count.
     * @param {number} repeatCountY - Vertical repeat count.
     *
     * @return {boolean} `true` if the vertex array was rebuilt.
     */
    _rebuildVertexArray: function (repeatCountX, repeatCountY)
    {
        if (repeatCountX === this._repeatCountX && repeatCountY === this._repeatCountY)
        {
            return false;
        }

        this._repeatCountX = repeatCountX;
        this._repeatCountY = repeatCountY;

        var rowCount = this.is3Slice ? 1 : (repeatCountY + 2);
        var size = (repeatCountX + 2) * rowCount * 6;
        var verts = this.vertices;

        if (verts.length !== size)
        {
            verts.length = 0;

            for (var k = 0; k < size; k++)
            {
                verts.push(new Vertex());
            }
        }

        return true;
    },

    /**
     * Emits vertex positions for one row: left cap quad, `_repeatCountX`
     * tiled middle quads, right cap quad.
     *
     * @method Phaser.GameObjects.NineSlice#_updateVertexRow
     * @private
     * @since 4.0.0
     *
     * @param {number} idx - The starting vertex index.
     * @param {number} xL - Left edge X.
     * @param {number} xML - Left middle edge X.
     * @param {number} xMR - Right middle edge X.
     * @param {number} xR - Right edge X.
     * @param {number} yT - Row top Y.
     * @param {number} yB - Row bottom Y.
     * @param {number} tileWidth - Width of each middle tile.
     *
     * @return {number} The new vertex index after this row.
     */
    _updateVertexRow: function (idx, xL, xML, xMR, xR, yT, yB, tileWidth)
    {
        this.updateQuad(idx, xL, yT, xML, yB);
        idx += 6;

        for (var i = 0; i < this._repeatCountX; i++)
        {
            this.updateQuad(idx, xML + i * tileWidth, yT, xML + (i + 1) * tileWidth, yB);
            idx += 6;
        }

        this.updateQuad(idx, xMR, yT, xR, yB);
        idx += 6;

        return idx;
    },

    /**
     * Internally updates the position coordinates across all vertices of the
     * given quad offset.
     *
     * You should not typically need to call this method directly, but it
     * is left public should an extended class require it.
     *
     * @method Phaser.GameObjects.NineSlice#updateQuad
     * @since 3.60.0
     *
     * @param {number} offset - The offset in the vertices array of the quad to update.
     * @param {number} x1 - The top-left X coordinate of the quad, in normalized space (-0.5 to 0.5).
     * @param {number} y1 - The top-left Y coordinate of the quad, in normalized space (-0.5 to 0.5).
     * @param {number} x2 - The bottom-right X coordinate of the quad, in normalized space (-0.5 to 0.5).
     * @param {number} y2 - The bottom-right Y coordinate of the quad, in normalized space (-0.5 to 0.5).
     */
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

    /**
     * Internally updates the UV coordinates across all vertices of the
     * given quad offset, based on the frame size.
     *
     * You should not typically need to call this method directly, but it
     * is left public should an extended class require it.
     *
     * @method Phaser.GameObjects.NineSlice#updateQuadUVs
     * @since 3.60.0
     *
     * @param {number} offset - The offset in the vertices array of the quad to update.
     * @param {number} u1 - The top-left U coordinate of the quad, in the range 0 to 1.
     * @param {number} v1 - The top-left V coordinate of the quad, in the range 0 to 1.
     * @param {number} u2 - The bottom-right U coordinate of the quad, in the range 0 to 1.
     * @param {number} v2 - The bottom-right V coordinate of the quad, in the range 0 to 1.
     */
    updateQuadUVs: function (offset, u1, v1, u2, v2)
    {
        var verts = this.vertices;

        //  Adjust for frame offset
        //  Incoming values will always be in the range 0-1
        var frame = this.frame;

        var fu1 = frame.u0;
        var fv1 = frame.v0;
        var fu2 = frame.u1;
        var fv2 = frame.v1;

        if (fu1 !== 0 || fu2 !== 1)
        {
            //  adjust horizontal
            var udiff = fu2 - fu1;
            u1 = fu1 + u1 * udiff;
            u2 = fu1 + u2 * udiff;
        }

        if (fv1 !== 0 || fv2 !== 1)
        {
            //  adjust vertical
            var vdiff = fv2 - fv1;
            v1 = fv1 + v1 * vdiff;
            v2 = fv1 + v2 * vdiff;
        }

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
     * Immediately sets the color values back to 0xffffff and the tint type to 'multiply',
     * which results in no visible change to the texture.
     *
     * @method Phaser.GameObjects.NineSlice#clearTint
     * @webglOnly
     * @since 3.60.0
     *
     * @return {this} This Game Object instance.
     */
    clearTint: function ()
    {
        this.setTint(0xffffff);
        this.setTintMode();

        return this;
    },

    /**
     * Sets a tint on this Game Object.
     *
     * The tint applies a color to the pixel color values
     * from the GameObject's texture in one of several modes,
     * set with `setTintMode` or the `tintMode` property.
     *
     * To modify the tint color once set, either call this method again with new values or use the
     * `tint` property.
     *
     * To remove a tint call `clearTint`, or call this method with no parameters.
     *
     * @method Phaser.GameObjects.NineSlice#setTint
     * @webglOnly
     * @since 3.60.0
     *
     * @param {number} [color=0xffffff] - The tint being applied to the entire Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setTint: function (color)
    {
        if (color === undefined) { color = 0xffffff; }

        this.tint = color;

        return this;
    },

    /**
     * Sets the tint mode for this Game Object.
     *
     * The tint mode applies a color to the pixel color values
     * from the GameObject's texture in one of several modes:
     *
     * - Phaser.TintModes.MULTIPLY (default)
     * - Phaser.TintModes.FILL
     * - Phaser.TintModes.ADD
     * - Phaser.TintModes.SCREEN
     * - Phaser.TintModes.OVERLAY
     * - Phaser.TintModes.HARD_LIGHT
     *
     * @method Phaser.GameObjects.NineSlice#setTintMode
     * @webglOnly
     * @since 4.0.0
     *
     * @param {Phaser.TintModes} [mode=Phaser.TintModes.MULTIPLY] - The tint mode to use.
     *
     * @return {this} This Game Object instance.
    */
    setTintMode: function (mode)
    {
        if (mode === undefined) { mode = TintModes.MULTIPLY; }

        this.tintMode = mode;
        return this;
    },

    /**
     * Does this Game Object have a tint applied?
     *
     * It checks to see if the tint property is set to a value other than 0xffffff
     * or the tint mode is not the default Phaser.TintModes.MULTIPLY.
     * This indicates that a Game Object is tinted.
     *
     * @name Phaser.GameObjects.NineSlice#isTinted
     * @type {boolean}
     * @webglOnly
     * @readonly
     * @since 3.60.0
     */
    isTinted: {

        get: function ()
        {
            return (this.tint !== 0xffffff || this.tintMode !== TintModes.MULTIPLY);
        }

    },

    /**
     * The displayed width of this Game Object.
     *
     * Setting this value will adjust the way in which this Nine Slice
     * object scales horizontally, if configured to do so.
     *
     * The _minimum_ width this Game Object can be is the total of
     * `leftWidth` + `rightWidth`. If you need to display this object
     * at a smaller size, you can also scale it.
     *
     * @name Phaser.GameObjects.NineSlice#width
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
            this._width = Math.max(value, this.leftWidth + this.rightWidth);

            this.updateVertices();
        }

    },

    /**
     * The displayed height of this Game Object.
     *
     * Setting this value will adjust the way in which this Nine Slice
     * object scales vertically, if configured to do so.
     *
     * The _minimum_ height this Game Object can be is the total of
     * `topHeight` + `bottomHeight`. If you need to display this object
     * at a smaller size, you can also scale it.
     *
     * If this is a 3-slice object, you can only stretch it horizontally
     * and changing the height will be ignored.
     *
     * @name Phaser.GameObjects.NineSlice#height
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
            if (!this.is3Slice)
            {
                this._height = Math.max(value, this.topHeight + this.bottomHeight);

                this.updateVertices();
            }
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
     * Sets the size of this Game Object.
     *
     * For a Nine Slice Game Object this means it will be stretched (or shrunk) horizontally
     * and vertically depending on the dimensions given to this method, in accordance with
     * how it has been configured for the various corner sizes.
     *
     * If this is a 3-slice object, you can only stretch it horizontally
     * and changing the height will be ignored.
     *
     * If you have enabled this Game Object for input, changing the size will also change the
     * size of the hit area.
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

        this.updateDisplayOrigin();

        var input = this.input;

        if (input && !input.customHitArea)
        {
            input.hitArea.width = this.width;
            input.hitArea.height = this.height;
        }

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
     * @name Phaser.GameObjects.NineSlice#originX
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
     * @name Phaser.GameObjects.NineSlice#originY
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
     * @method Phaser.GameObjects.NineSlice#setOrigin
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

    /**
     * Resets the size of this Nine Slice Game Object to match the current texture frame.
     *
     * For a 3-slice object, this sets the height to match the frame height and refreshes
     * the UV coordinates. For a 9-slice object, only the UVs are refreshed. This is called
     * automatically when the texture frame changes and should not normally need to be
     * called directly.
     *
     * @method Phaser.GameObjects.NineSlice#setSizeToFrame
     * @since 3.60.0
     *
     * @return {this} This Game Object instance.
     */
    setSizeToFrame: function ()
    {
        if (this.is3Slice)
        {
            var height = this.frame.height;

            this._height = height;
            this.topHeight = height;
            this.bottomHeight = 0;
        }

        this.updateUVs();

        return this;
    },

    /**
     * Handles the pre-destroy step for the Nine Slice, which removes the vertices.
     *
     * @method Phaser.GameObjects.NineSlice#preDestroy
     * @private
     * @since 3.60.0
     */
    preDestroy: function ()
    {
        this.vertices = [];
    }

});

module.exports = NineSlice;
