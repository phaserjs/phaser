/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var MATH_CONST = require('../math/const');
var BlendModes = require('../renderer/BlendModes');
var ScaleModes = require('../renderer/ScaleModes');
var WrapAngle = require('../math/angle/Wrap');

/**
* This is the base Game Object class that you can use when creating your own extended Game Objects.
*
* @class
*/

//  Texture is globally shared between GameObjects, not specific to this one
//  Frame is globally shared between GameObjects, not specific to this one

var GameObject = function (state, x, y, texture, frame)
{
    this.state = state;

    this.game = state.sys.game;

    this.name = '';

    this.texture = texture;

    this.frame = frame;

    this.x = x;
    this.y = y;
    this.z = 0;
    this.scaleX = 1;
    this.scaleY = 1;
    this.rotation = 0;
    this.anchorX = 0;
    this.anchorY = 0;

    this.alpha = 1;
    this.blendMode = BlendModes.NORMAL;
    this.scaleMode = ScaleModes.DEFAULT;

    this.visible = true;
};

GameObject.prototype.constructor = GameObject;

GameObject.prototype = {

    destroy: function ()
    {
        this.state = undefined;
        this.game = undefined;
        this.texture = undefined;
        this.frame = undefined;
    }

};

Object.defineProperties(GameObject.prototype, {

    angle: {

        enumerable: true,

        get: function ()
        {
            return WrapAngle(this.rotation * MATH_CONST.RAD_TO_DEG);
        },

        set: function (value)
        {
            //  value is in degrees
            this.rotation = WrapAngle(value * MATH_CONST.DEG_TO_RAD);
        }

    }

});

module.exports = GameObject;
