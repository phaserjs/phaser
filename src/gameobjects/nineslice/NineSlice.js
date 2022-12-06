/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GetFastValue = require('../../utils/object/GetFastValue');
var GameObject = require('../GameObject');
var Components = require('../components');
var Face = require('../../geom/mesh/Face');
var GenerateGridVerts = require('../../geom/mesh/GenerateGridVerts');
var NineSliceRender = require('./NineSliceRender');
var Matrix4 = require('../../math/Matrix4');
var Vector3 = require('../../math/Vector3');
var DegToRad = require('../../math/DegToRad');
var Vertex = require('../../geom/mesh/Vertex');
var Utils = require('../../renderer/webgl/Utils');

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

        this.setPosition(x, y);
        this.setTexture(texture, frame);

        var width = GetFastValue(sliceConfig, 'width', this.frame.width);
        var height = GetFastValue(sliceConfig, 'height', this.frame.height);

        var left = GetFastValue(sliceConfig, 'left', width / 3);
        var right = GetFastValue(sliceConfig, 'right', null);
        var top = GetFastValue(sliceConfig, 'top', null);
        var bottom = GetFastValue(sliceConfig, 'bottom', null);

        this._width = width;
        this._height = height;

        this.sizes = {
            left: left,
            right: right,
            top: top,
            bottom: bottom
        };

        // this.setSize(width, height);

        this.faces = [];
        this.vertices = [];
        this.tintFill = false;

        /*
        this.dirtyCache = [];
        this.dirtyCache[11] = false;
        this.vertices = [];

        GenerateGridVerts({
            mesh: this,
            widthSegments: 3,
            heightSegments: 3
        });

        for (var i = 0; i < this.faces.length; i++)
        {
            this.faces[i].transformIdentity(this.width, this.height);
        }
        */

        //  Todo - 2 slice, 9 slice, variable slice

        if (left && right && !top && !bottom)
        {
            // this.create3Slice(left, right);
        }

        console.log(this);

        this.initPipeline();
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        // this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        // this.scene.sys.updateList.remove(this);
    },

    is3Slice: function ()
    {
        return (this.faces.length === 6);
    },

    is9Slice: function ()
    {
        return (this.faces.length === 12);
    },

    create3Slice: function (leftWidth, rightWidth)
    {
        var faces = this.faces;

        //  In case there is already data in there
        faces.length = 0;

        //  The display dimensions
        var width = this.width;
        var height = this.height;

        var left = 0.5 - (leftWidth / width);
        var uvLeftA = leftWidth / this.frame.width;
        var uvLeftB = 1 - uvLeftA;

        var right = 0.5 - (rightWidth / width);
        var uvRightA = rightWidth / this.frame.width;
        var uvRightB = 1 - uvRightA;

        var pos = [
            //  face 1 - left
            -0.5, 0.5,
            -0.5, -0.5,
            -left, 0.5,

            //  face 2 - left
            -0.5, -0.5,
            -left, -0.5,
            -left, 0.5,

            //  face 3 - middle
            -left, 0.5,
            -left, -0.5,
            left, 0.5,

            //  face 4 - middle
            -left, -0.5,
            left, -0.5,
            left, 0.5,

            //  face 5 - right
            right, 0.5,
            right, -0.5,
            0.5, 0.5,

            //  face 6 - right
            right, -0.5,
            0.5, -0.5,
            0.5, 0.5
        ];

        var uv = [
            //  face 1 - left
            0, 0,
            0, 1,
            uvLeftA, 0,

            //  face 2 - left
            0, 1,
            uvLeftA, 1,
            uvLeftA, 0,

            //  face 3 - middle
            uvLeftA, 0,
            uvLeftA, 1,
            uvLeftB, 0,

            //  face 4 - middle
            uvLeftA, 1,
            uvLeftB, 1,
            uvLeftB, 0,

            //  face 5 - right
            uvRightB, 0,
            uvRightB, 1,
            1, 0,

            //  face 6 - right
            uvRightB, 1,
            1, 1,
            1, 0
        ];

        var c = 0;

        for (var i = 0; i < 6; i++)
        {
            var vertex1 = new Vertex(pos[c], pos[c + 1], 0, uv[c], uv[c + 1]);
            var vertex2 = new Vertex(pos[c + 2], pos[c + 3], 0, uv[c + 2], uv[c + 3]);
            var vertex3 = new Vertex(pos[c + 4], pos[c + 5], 0, uv[c + 4], uv[c + 5]);

            var face = new Face(vertex1, vertex2, vertex3);

            face.transformIdentity(width, height);

            faces.push(face);

            c += 6;
        }
    },



    createArea1: function ()
    {
    },

    update3Slice: function ()
    {
        // this.create3Slice(this.sizes.left, this.sizes.right);


    },

    /**
     * Loads the data from this Vertex into the given Typed Arrays.
     *
     * @method Phaser.Geom.Mesh.Face#load
     * @since 3.50.0
     *
     * @param {Float32Array} F32 - A Float32 Array to insert the position, UV and unit data in to.
     * @param {Uint32Array} U32 - A Uint32 Array to insert the color and alpha data in to.
     * @param {number} offset - The index of the array to insert this Vertex to.
     * @param {number} textureUnit - The texture unit currently in use.
     * @param {number} tintEffect - The tint effect to use.
     *
     * @return {number} The new vertex index array offset.
     */
    load: function (F32, U32, offset, textureUnit, tintEffect)
    {
        // offset = this.vertex1.load(F32, U32, offset, textureUnit, tintEffect);
        // offset = this.vertex2.load(F32, U32, offset, textureUnit, tintEffect);
        // offset = this.vertex3.load(F32, U32, offset, textureUnit, tintEffect);

        return offset;
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

            this.updateSlices();
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

            this.updateSlices();
        }

    },

    /**
     * The displayed width of this Game Object.
     *
     * This value takes into account the scale factor.
     *
     * Setting this value will adjust the Game Object's scale property.
     *
     * @name Phaser.GameObjects.Components.ComputedSize#displayWidth
     * @type {number}
     * @since 3.0.0
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
     * @name Phaser.GameObjects.Components.ComputedSize#displayHeight
     * @type {number}
     * @since 3.0.0
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
     * @method Phaser.GameObjects.Components.ComputedSize#setSize
     * @since 3.4.0
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
     * @method Phaser.GameObjects.Components.ComputedSize#setDisplaySize
     * @since 3.4.0
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
