
var Class = require('../../utils/Class');
var GameObject = require('../GameObject');
var Components = require('../../components');
var BlitterRender = require('./BlitterRender');
var Bob = require('./Bob');

/**
* A Blitter Game Object.
*
* The Blitter Game Object is a special type of Container, that contains Blitter.Bob objects.
* These objects can be thought of as just texture frames with a position and nothing more.
* Bobs don't have any update methods, or the ability to have children, or any kind of special effects.
* They are essentially just super-fast texture frame renderers, and the Blitter object creates and manages them.
*
* @class Blitter
* @extends Phaser.GameObject
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {number} [x=0] - The x coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
* @param {number} [y=0] - The y coordinate of the Image. The coordinate is relative to any parent container this Image may be in.
* @param {string} [key] - The texture used by the Image during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
* @param {string|number} [frame] - If this Image is using part of a sprite sheet or texture atlas you can specify the exact frame to use by giving a string or numeric index.
*/

var Blitter = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.RenderTarget,
        Components.ScaleMode,
        Components.Size,
        Components.Texture,
        Components.Transform,
        Components.Visible,
        BlitterRender
    ],

    initialize:

    function Blitter (state, x, y, texture, frame)
    {
        GameObject.call(this, state, 'Blitter');

        this.setTexture(texture, frame);
        this.setPosition(x, y);

        this.children = new Components.Children(this);

        this.renderList = [];

        this.dirty = false;
    },

    //  frame MUST be part of the Blitter texture
    create: function (x, y, frame, visible, index)
    {
        if (frame === undefined) { frame = this.frame; }
        if (visible === undefined) { visible = true; }
        if (index === undefined) { index = this.children.length; }

        if (typeof frame === 'string')
        {
            frame = this.texture.get(frame);
        }

        var bob = new Bob(this, x, y, frame, visible);

        this.children.addAt(bob, index, false);

        this.dirty = true;

        return bob;
    },

    //  frame MUST be part of the Blitter texture
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
    createMultiple: function (quantity, frame, visible)
    {
        if (frame === undefined) { frame = this.frame; }
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

    childCanRender: function (child)
    {
        return (child.visible && child.alpha > 0);
    },

    getRenderList: function ()
    {
        if (this.dirty)
        {
            this.renderList = this.children.list.filter(this.childCanRender, this);
            this.dirty = false;
        }

        return this.renderList;
    },

    clear: function ()
    {
        this.children.removeAll();
        this.dirty = true;
    }

});

module.exports = Blitter;
