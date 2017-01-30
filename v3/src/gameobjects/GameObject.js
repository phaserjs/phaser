/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

// var CONST = require('../const');
// var MATH_CONST = require('../math/const');
var ScaleModes = require('../renderer/ScaleModes');
var Component = require('../components');
// var WrapAngle = require('../math/angle/Wrap');

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
    this.transform = new Component.Transform(this);

    this.transform.positionX = x;
    this.transform.positionY = y;

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
        }

    },

    /*
    scale: {

        enumerable: true,

        get: function ()
        {
            return this.transform._scaleX;
        },

        set: function (value)
        {
            this.transform._scaleX = value;
            this.transform._scaleY = value;
            this.transform.dirty = true;
            this.transform.updateCache();
        }

    },

    scaleX: {

        enumerable: true,

        get: function ()
        {
            return this.transform._scaleX;
        },

        set: function (value)
        {
            this.transform._scaleX = value;
            this.transform.dirty = true;
            this.transform.updateCache();
        }

    },

    scaleY: {

        enumerable: true,

        get: function ()
        {
            return this.transform._scaleY;
        },

        set: function (value)
        {
            this.transform._scaleY = value;
            this.transform.dirty = true;
            this.transform.updateCache();
        }

    },

    anchor: {

        enumerable: true,

        get: function ()
        {
            return this.transform._anchorX;
        },

        set: function (value)
        {
            this.transform.setAnchor(value);
        }

    },

    anchorX: {

        enumerable: true,

        get: function ()
        {
            return this.transform._anchorX;
        },

        set: function (value)
        {
            this.transform._anchorX = value;
            this.transform.dirty = true;
        }

    },

    anchorY: {

        enumerable: true,

        get: function ()
        {
            return this.transform._anchorY;
        },

        set: function (value)
        {
            this.transform._anchorY = value;
            this.transform.dirty = true;
        }

    },

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

    angle: {

        enumerable: true,

        get: function ()
        {
            return WrapAngle(this.rotation * MATH_CONST.RAD_TO_DEG);
        },

        set: function (value)
        {
            this.rotation = WrapAngle(value) * MATH_CONST.DEG_TO_RAD;
        }

    },

    rotation: {

        enumerable: true,

        get: function ()
        {
            return this.transform._rotation;
        },

        set: function (value)
        {
            if (this.transform._rotation === value)
            {
                return;
            }

            this.transform._rotation = value;
            this.transform.dirty = true;

            if (this.transform._rotation % MATH_CONST.PI2)
            {
                this.transform.cache.sr = Math.sin(this.transform._rotation);
                this.transform.cache.cr = Math.cos(this.transform._rotation);
                this.transform.updateCache();
                this.transform.hasLocalRotation = true;
            }
            else
            {
                this.transform.hasLocalRotation = false;
            }
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
