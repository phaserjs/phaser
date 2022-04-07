/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var BlitterRender = require('./BlitterRender');
var Bob = require('./Bob');
var Class = require('../../utils/Class');
var Components = require('../components');
var Frame = require('../../textures/Frame');
var GameObject = require('../GameObject');
var List = require('../../structs/List');

/**
 * @callback CreateCallback
 *
 * @param {Phaser.GameObjects.Bob} bob - The Bob that was created by the Blitter.
 * @param {number} index - The position of the Bob within the Blitter display list.
 */

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
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Pipeline
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
 * @param {(string|number)} [frame=0] - The Frame of the Texture that this Game Object will use. Only set if the Texture has multiple frames, such as a Texture Atlas or Sprite Sheet.
 */
var Blitter = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Mask,
        Components.Pipeline,
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
        this.initPipeline();

        /**
         * The children of this Blitter.
         * This List contains all of the Bob objects created by the Blitter.
         *
         * @name Phaser.GameObjects.Blitter#children
         * @type {Phaser.Structs.List.<Phaser.GameObjects.Bob>}
         * @since 3.0.0
         */
        this.children = new List();

        /**
         * A transient array that holds all of the Bobs that will be rendered this frame.
         * The array is re-populated whenever the dirty flag is set.
         *
         * @name Phaser.GameObjects.Blitter#renderList
         * @type {Phaser.GameObjects.Bob[]}
         * @default []
         * @private
         * @since 3.0.0
         */
        this.renderList = [];

        /**
         * Is the Blitter considered dirty?
         * A 'dirty' Blitter has had its child count changed since the last frame.
         *
         * @name Phaser.GameObjects.Blitter#dirty
         * @type {boolean}
         * @since 3.0.0
         */
        this.dirty = false;
    },

    /**
     * Creates a new Bob in this Blitter.
     *
     * The Bob is created at the given coordinates, relative to the Blitter and uses the given frame.
     * A Bob can use any frame belonging to the texture bound to the Blitter.
     *
     * @method Phaser.GameObjects.Blitter#create
     * @since 3.0.0
     *
     * @param {number} x - The x position of the Bob. Bob coordinate are relative to the position of the Blitter object.
     * @param {number} y - The y position of the Bob. Bob coordinate are relative to the position of the Blitter object.
     * @param {(string|number|Phaser.Textures.Frame)} [frame] - The Frame the Bob will use. It _must_ be part of the Texture the parent Blitter object is using.
     * @param {boolean} [visible=true] - Should the created Bob render or not?
     * @param {number} [index] - The position in the Blitters Display List to add the new Bob at. Defaults to the top of the list.
     *
     * @return {Phaser.GameObjects.Bob} The newly created Bob object.
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
     * Creates multiple Bob objects within this Blitter and then passes each of them to the specified callback.
     *
     * @method Phaser.GameObjects.Blitter#createFromCallback
     * @since 3.0.0
     *
     * @param {CreateCallback} callback - The callback to invoke after creating a bob. It will be sent two arguments: The Bob and the index of the Bob.
     * @param {number} quantity - The quantity of Bob objects to create.
     * @param {(string|number|Phaser.Textures.Frame|string[]|number[]|Phaser.Textures.Frame[])} [frame] - The Frame the Bobs will use. It must be part of the Blitter Texture.
     * @param {boolean} [visible=true] - Should the created Bob render or not?
     *
     * @return {Phaser.GameObjects.Bob[]} An array of Bob objects that were created.
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
     * Creates multiple Bobs in one call.
     *
     * The amount created is controlled by a combination of the `quantity` argument and the number of frames provided.
     *
     * If the quantity is set to 10 and you provide 2 frames, then 20 Bobs will be created. 10 with the first
     * frame and 10 with the second.
     *
     * @method Phaser.GameObjects.Blitter#createMultiple
     * @since 3.0.0
     *
     * @param {number} quantity - The quantity of Bob objects to create.
     * @param {(string|number|Phaser.Textures.Frame|string[]|number[]|Phaser.Textures.Frame[])} [frame] - The Frame the Bobs will use. It must be part of the Blitter Texture.
     * @param {boolean} [visible=true] - Should the created Bob render or not?
     *
     * @return {Phaser.GameObjects.Bob[]} An array of Bob objects that were created.
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
     * Checks if the given child can render or not, by checking its `visible` and `alpha` values.
     *
     * @method Phaser.GameObjects.Blitter#childCanRender
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Bob} child - The Bob to check for rendering.
     *
     * @return {boolean} Returns `true` if the given child can render, otherwise `false`.
     */
    childCanRender: function (child)
    {
        return (child.visible && child.alpha > 0);
    },

    /**
     * Returns an array of Bobs to be rendered.
     * If the Blitter is dirty then a new list is generated and stored in `renderList`.
     *
     * @method Phaser.GameObjects.Blitter#getRenderList
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Bob[]} An array of Bob objects that will be rendered this frame.
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
     * Removes all Bobs from the children List and clears the dirty flag.
     *
     * @method Phaser.GameObjects.Blitter#clear
     * @since 3.0.0
     */
    clear: function ()
    {
        this.children.removeAll();
        this.dirty = true;
    },

    /**
     * Internal destroy handler, called as part of the destroy process.
     *
     * @method Phaser.GameObjects.Blitter#preDestroy
     * @protected
     * @since 3.9.0
     */
    preDestroy: function ()
    {
        this.children.destroy();

        this.renderList = [];
    }

});

module.exports = Blitter;
