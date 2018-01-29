var BlitterRender = require('./BlitterRender');
var Bob = require('./Bob');
var Class = require('../../utils/Class');
var Components = require('../components');
var DisplayList = require('../DisplayList');
var Frame = require('../../textures/Frame');
var GameObject = require('../GameObject');

var Blitter = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Pipeline,
        Components.ScaleMode,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        Components.ScrollFactor,
        BlitterRender
    ],

    initialize:

    /**
     * A Blitter Game Object.
     *
     * The Blitter Game Object is a special type of Container, that contains Blitter.Bob objects.
     * These objects can be thought of as just texture frames with a position and nothing more.
     * Bobs don't have any update methods, or the ability to have children, or any kind of special effects.
     * They are essentially just super-fast texture frame renderers, and the Blitter object creates and manages them.
     *
     * @class Blitter
     * @extends Phaser.GameObjects.GameObject
     * @memberOf Phaser.GameObjects
     * @constructor
     * @since 3.0.0
     *
     * @mixes Phaser.GameObjects.Components.Alpha
     *
     * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. It can only belong to one Scene at any given time.
     * @param {number} [x==] - The x coordinate of this Game Object in world space.
     * @param {number} [y=0] - The y coordinate of this Game Object in world space.
     * @param {string} [texture='__DEFAULT'] - The key of the texture this Game Object will use for rendering. The Texture must already exist in the Texture Manager.
     * @param {string|integer} [frame=0] - The Frame of the Texture that this Game Object will use. Only set if the Texture has multiple frames, such as a Texture Atlas or Sprite Sheet.
     */
    function Blitter (scene, x, y, texture, frame)
    {
        GameObject.call(this, scene, 'Blitter');

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.initPipeline('TextureTintPipeline');

        /**
         * [description]
         *
         * @property {Phaser.GameObjects.DisplayList} children
         * @since 3.0.0
         */
        this.children = new DisplayList();

        /**
         * [description]
         *
         * @property {array} renderList
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

    //  frame MUST be part of the Blitter texture
    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter#createFromCallback
     * @since 3.0.0
     *
     * @param {[type]} callback - [description]
     * @param {[type]} quantity - [description]
     * @param {[type]} frame - [description]
     * @param {[type]} visible - [description]
     *
     * @return {[type]} [description]
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

    //  frame MUST be part of the Blitter texture
    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter#createMultiple
     * @since 3.0.0
     *
     * @param {[type]} quantity - [description]
     * @param {[type]} frame - [description]
     * @param {[type]} visible - [description]
     *
     * @return {[type]} [description]
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
     * @param {[type]} child - [description]
     *
     * @return {[type]} [description]
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
     * @return {[type]} [description]
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
