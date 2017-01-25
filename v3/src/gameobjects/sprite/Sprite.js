/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var CONST = require('../../const');
var GameObject = require('../GameObject');
var Children = require('../../components/Children');

var Sprite = function (state, x, y, key, frame)
{
    var _texture = state.sys.textures.get(key);
    var _frame = _texture.get(frame);

    GameObject.call(this, state, x, y, _texture, _frame);

    this.type = CONST.SPRITE;

    this.children = new Children(this);
};

Sprite.prototype = Object.create(GameObject.prototype);
Sprite.prototype.constructor = Sprite;

Sprite.prototype.renderCanvas = require('./SpriteCanvasRenderer');
Sprite.prototype.renderWebGL = require('./SpriteWebGLRenderer');

Object.defineProperties(Sprite.prototype, {

    width: {

        enumerable: true,

        get: function ()
        {
            return this.transform._scaleX * this.frame.realWidth;
        },

        set: function (value)
        {
            this.scaleX = value / this.frame.realWidth;
        }

    },

    height: {

        enumerable: true,

        get: function ()
        {
            return this.transform._scaleY * this.frame.realHeight;
        },

        set: function (value)
        {
            this.scaleY = value / this.frame.realHeight;
        }

    }

});

module.exports = Sprite;
