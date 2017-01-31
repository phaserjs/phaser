/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

// var CONST = require('../const');
var MATH_CONST = require('../math/const');
var ScaleModes = require('../renderer/ScaleModes');
var Component = require('../components');
var WrapAngle = require('../math/angle/Wrap');

/**
* This is the base Game Object class that you can use when creating your own extended Game Objects.
* It hides away the 'private' stuff and exposes only the useful getters, setters and properties.
*
* @class
*/

//  Phaser.Texture and Phaser.Frame objects passed in here, instead of looked-up.
//  Allows override from non-standard GO types

var GameObject = function (state, x, y, texture, frame, parent)
{
    this.state = state;

    this.game = state.sys.game;

    this.name = '';

    this.type = 0;

    this.parent = parent;

    //  Texture is globally shared between GameObjects, not specific to this one
    this.texture = texture;

    //  Frame is globally shared between GameObjects, not specific to this one
    this.frame = frame;

    //  All GameObjects have the following components, always:
    this.transform = new Component.Transform(this, this.state.sys.transform);
    this.transform.positionX = x;
    this.transform.positionY = y;

    this.anchor = new Component.Anchor();

    //  Optional? Maybe set on a per GO basis?
    this.data = new Component.Data(this);

    this.color = new Component.Color(this);

    //  ----------------------------------------------------------------
    //  ----------------------------------------------------------------
    //  The following properties are debatable to have in this class
    //  ----------------------------------------------------------------
    //  ----------------------------------------------------------------

    this.scaleMode = ScaleModes.DEFAULT;

    //  Allows you to turn off a GameObject from rendering, but still render its children (if it has any)
    //  Maybe this should move?
    // this.skipRender = (key === undefined);
    this.skipRender = false;

    this.visible = true;

    //  Either null, or the Children component
    this.children = null;

    this.exists = true;
};

GameObject.prototype.constructor = GameObject;

GameObject.prototype = {

    preUpdate: function ()
    {
        //  NOOP
    },

    update: function ()
    {
        //  NOOP
    },

    postUpdate: function ()
    {
        //  NOOP
    },

    render: function ()
    {
        //  NOOP
    },

    destroy: function ()
    {
        //  NOOP
    }

};

Object.defineProperties(GameObject.prototype, {

    //  Transform getters / setters

    x: {

        enumerable: true,

        get: function ()
        {
            return this.transform.positionX;
        },

        set: function (value)
        {
            this.transform.positionX = value;
            this.transform.dirtyLocal = true;
        }

    },

    y: {

        enumerable: true,

        get: function ()
        {
            return this.transform.positionY;
        },

        set: function (value)
        {
            this.transform.positionY = value;
            this.transform.dirtyLocal = true;
        }

    },

    scale: {

        enumerable: true,

        get: function ()
        {
            return this.transform.scaleX;
        },

        set: function (value)
        {
            this.transform.scaleX = value;
            this.transform.scaleY = value;
            this.transform.dirtyLocal = true;
        }

    },

    scaleX: {

        enumerable: true,

        get: function ()
        {
            return this.transform.scaleX;
        },

        set: function (value)
        {
            this.transform.scaleX = value;
            this.transform.dirtyLocal = true;
        }

    },

    scaleY: {

        enumerable: true,

        get: function ()
        {
            return this.transform.scaleY;
        },

        set: function (value)
        {
            this.transform.scaleY = value;
            this.transform.dirtyLocal = true;
        }

    },

    rotation: {

        enumerable: true,

        get: function ()
        {
            return this.transform.rotation;
        },

        set: function (value)
        {
            this.transform.rotation = value;
            this.transform.dirtyLocal = true;
        }

    },

    angle: {

        enumerable: true,

        get: function ()
        {
            return WrapAngle(this.transform.rotation * MATH_CONST.RAD_TO_DEG);
        },

        set: function (value)
        {
            //  value is in degrees
            this.transform.rotation = WrapAngle(value * MATH_CONST.DEG_TO_RAD);
            this.transform.dirtyLocal = true;
        }

    },

    anchorX: {

        enumerable: true,

        get: function ()
        {
            return this.anchor.getX();
        },

        set: function (value)
        {
            this.anchor.setX(value);
        }

    },

    anchorY: {

        enumerable: true,

        get: function ()
        {
            return this.anchor.getY();
        },

        set: function (value)
        {
            this.anchor.setY(value);
        }

    },

    /*
    pivotX: {

        enumerable: true,

        get: function ()
        {
            return this.transform._pivotX;
        },

        set: function (value)
        {
            this.transform._pivotX = value;
            this.transform.dirty = true;
            this.transform.updateCache();
        }

    },

    pivotY: {

        enumerable: true,

        get: function ()
        {
            return this.transform._pivotY;
        },

        set: function (value)
        {
            this.transform._pivotY = value;
            this.transform.dirty = true;
            this.transform.updateCache();
        }

    },
    */

    //  Color getters / setters

    alpha: {

        enumerable: true,

        get: function ()
        {
            return this.color._alpha;
        },

        set: function (value)
        {
            this.color.alpha = value;
        }

    },

    blendMode: {

        enumerable: true,

        get: function ()
        {
            return this.color._blendMode;
        },

        set: function (value)
        {
            this.color.blendMode = value;
        }

    }

});

module.exports = GameObject;
