/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var BlitterRender = require('./BlitterRender');
var Bob = require('./Bob');
var Class = require('../../utils/Class');
var Components = require('../components');
var Frame = require('../../textures/Frame');
var GameObject = require('../GameObject');
var List = require('../../structs/List');

/**
 * @classdesc
 * A Blitter Game Object.
 *
 * The Blitter Game Object is a special kind of container that creates, updates and manages Bob objects.
 * Bobs are designed for rendering speed rather than flexibility. They consist of a texture, or frame from a texture,
 * a position and an alpha value. You cannot scale or rotate them. They use a batched drawing method for speed
 * during rendering.
 *
 * A Blitter Game Object has one texture bound to it. Bobs created by the Blitter can use any Frame from this
 * Texture to render with, but they cannot use any other Texture. It is this single texture-bind that allows
 * them their speed.
 *
 * If you have a need to blast a large volume of frames around the screen then Blitter objects are well worth
 * investigating. They are especially useful for using as a base for your own special effects systems.
 *
 * @class Blitter
 * @extends Phaser.GameObjects.GameObject
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 * 
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. It can only belong to one Scene at any given time.
 * @param {number} [x=0] - The x coordinate of this Game Object in world space.
 * @param {number} [y=0] - The y coordinate of this Game Object in world space.
 * @param {string} [texture='__DEFAULT'] - The key of the texture this Game Object will use for rendering. The Texture must already exist in the Texture Manager.
 * @param {string|integer} [frame=0] - The Frame of the Texture that this Game Object will use. Only set if the Texture has multiple frames, such as a Texture Atlas or Sprite Sheet.
 */
var Blitter = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Pipeline,
        Components.ScaleMode,
        Components.ScrollFactor,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        BlitterRender
    ],

    initialize:

    function Blitter (scene, x, y, texture, frame)
    {
        GameObject.call(this, scene, 'Blitter');

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.initPipeline('TextureTintPipeline');

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Blitter#children
         * @type {Phaser.Structs.List}
         * @since 3.0.0
         */
        this.children = new List();

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Blitter#renderList
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.renderList = [];

        this.dirty = false;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter#create
     * @since 3.0.0
     *
     * @param {number} x - The x position of the Bob. Bob coordinate are relative to the position of the Blitter object.
     * @param {number} y - The y position of the Bob. Bob coordinate are relative to the position of the Blitter object.
     * @param {string|integer|Phaser.Textures.Frame} [frame] - The Frame the Bob will use. It _must_ be part of the Texture the parent Blitter object is using.
     * @param {boolean} [visible=true] - Should the created Bob render or not?
     * @param {integer} [index] - The position in the Blitters Display List to add the new Bob at. Defaults to the top of the list.
     *
     * @return {Phaser.GameObjects.Blitter.Bob} The newly created Bob object.
     */
    create: function (x, y, frame, visible, index)
    {
        if (visible === undefined) { visible = true; }
        if (index === undefined) { index = this.children.length; }

        if (frame === undefined)
        {
            frame = this.frame;
        }
        else if (!(frame instanceof Frame))
        {
            frame = this.texture.get(frame);
        }

        var bob = new Bob(this, x, y, frame, visible);

        this.children.addAt(bob, index, false);

        this.dirty = true;

        return bob;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter#createFromCallback
     * @since 3.0.0
     *
     * @param {function} callback - The callback to invoke after creating a bob. It will be sent two arguments: The Bob and the index of the Bob.
     * @param {integer} quantity - The quantity of Bob objects to create.
     * @param {string} [frame] - The Frame the Bobs will use. It must be part of the Blitter Texture.
     * @param {boolean} [visible=true] - [description]
     *
     * @return {Phaser.GameObjects.Blitter.Bob[]} An array of Bob objects that were created.
     */
    createFromCallback: function (callback, quantity, frame, visible)
    {
        var bobs = this.createMultiple(quantity, frame, visible);

        for (var i = 0; i < bobs.length; i++)
        {
            var bob = bobs[i];

            callback.call(this, bob, i);
        }

        return bobs;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter#createMultiple
     * @since 3.0.0
     *
     * @param {integer} quantity - The quantity of Bob objects to create.
     * @param {string} [frame] - The Frame the Bobs will use. It must be part of the Blitter Texture.
     * @param {boolean} [visible=true] - [description]
     *
     * @return {Phaser.GameObjects.Blitter.Bob[]} An array of Bob objects that were created.
     */
    createMultiple: function (quantity, frame, visible)
    {
        if (frame === undefined) { frame = this.frame.name; }
        if (visible === undefined) { visible = true; }

        if (!Array.isArray(frame))
        {
            frame = [ frame ];
        }

        var bobs = [];
        var _this = this;

        frame.forEach(function (singleFrame)
        {
            for (var i = 0; i < quantity; i++)
            {
                bobs.push(_this.create(0, 0, singleFrame, visible));
            }
        });

        return bobs;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter#childCanRender
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Blitter.Bob} child - [description]
     *
     * @return {boolean} [description]
     */
    childCanRender: function (child)
    {
        return (child.visible && child.alpha > 0);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter#getRenderList
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Blitter.Bob[]} An array of Bob objects that will be rendered this frame.
     */
    getRenderList: function ()
    {
        if (this.dirty)
        {
            this.renderList = this.children.list.filter(this.childCanRender, this);
            this.dirty = false;
        }

        return this.renderList;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter#clear
     * @since 3.0.0
     */
    clear: function ()
    {
        this.children.removeAll();
        this.dirty = true;
    }

});

module.exports = Blitter;
