/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CONST = require('../../const');
var Bob = require('./Bob');
var GameObject = require('../GameObject');
var Children = require('../../components/Children');

/**
* A Blitter Game Object.
*
* The Blitter Game Object is a special type of Container, that contains Blitter.Bob objects.
* These objects can be thought of as just texture frames with a transform, and nothing more.
* Bobs don't have any update methods, or the ability to have children, or any kind of special effects.
* They are essentially just texture renderers, and the Blitter object creates and manages them.
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
var Blitter = function (state, x, y, key, frame)
{
    var _texture = state.sys.textures.get(key);
    var _frame = _texture.get(frame);

    GameObject.call(this, state, x, y, _texture, _frame);

    this.type = CONST.BLITTER;

    this.children = new Children(this);
};

Blitter.prototype = Object.create(GameObject.prototype);
Blitter.prototype.constructor = Blitter;

// Blitter.prototype.renderCanvas = require('./BlitterCanvasRenderer');
Blitter.prototype.renderWebGL = require('./BlitterWebGLRenderer');

//  frame MUST be part of the Blitter texture
Blitter.prototype.create = function (x, y, frame, visible, index)
{
    if (frame === undefined) { frame = this.frame; }
    if (visible === undefined) { visible = true; }
    if (index === undefined) { index = 0; }

    var bob = new Bob(this, x, y, frame, visible);

    this.children.addAt(bob, index, false);

    return bob;
};

//  frame MUST be part of the Blitter texture
Blitter.prototype.createFromCallback = function (callback, quantity, frame, visible)
{
    var bobs = this.createMultiple(quantity, frame, visible);

    for (var i = 0; i < bobs.length; i++)
    {
        var bob = bobs[i];

        callback.call(this, bob, i);
    }

    return bobs;
};

//  frame MUST be part of the Blitter texture
Blitter.prototype.createMultiple = function (quantity, frame, visible)
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
};

module.exports = Blitter;
