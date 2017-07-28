/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Class = require('../utils/Class');
var Components = require('./components');

/**
* This is the base Game Object class that you can use when creating your own extended Game Objects.
*
* @class
*/

var GameObject = new Class({

    initialize:

    function GameObject (scene, type)
    {
        this.scene = scene;

        this.type = type;

        this.name = '';

        this.active = true;

        this.tabIndex = -1;

        this.parent;

        //  0001 | 0010 | 0100 | 1000
        //  Will Render bitmask flags for the components Visible, Alpha, Transform and Texture respectively
        this.renderMask = 15;
        this.renderFlags = 15;

        this.input = null;

        //  Trigger a scene z-depth sort
        this.scene.sys.sortChildrenFlag = true;
    },

    //  For GameObject Pooling and item selection
    setActive: function (value)
    {
        this.active = value;

        return this;
    },

    setName: function (value)
    {
        this.name = value;

        return this;
    },

    setInteractive: function (shape, callback)
    {
        this.scene.sys.inputManager.enable(this, shape, callback);

        return this;
    },

    //  To be overridden by custom GameObjects. Allows base objects to be used in a Pool.
    update: function ()
    {
    },

    //  Can be overridden by custom Game Objects, but provides default export functionality
    toJSON: function ()
    {
        return Components.ToJSON(this);
    },

    willRender: function ()
    {
        return (this.renderMask === this.renderFlags);
    },

    destroy: function ()
    {
        this.parent.remove(this);

        if (this.input)
        {
            this.scene.sys.inputManager.clear(this);
        }

        this.scene = undefined;
    }

});

module.exports = GameObject;
