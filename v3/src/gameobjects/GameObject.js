/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Class = require('../utils/Class');
var Components = require('../components');

/**
* This is the base Game Object class that you can use when creating your own extended Game Objects.
*
* @class
*/

var GameObject = new Class({

    initialize:

    function GameObject (state, type)
    {
        this.state = state;

        this.id = 0;
        this.type = type;
        this.name = '';
        this.tabIndex = -1;

        this.parent;

        //  0001 | 0010 | 0100 | 1000
        //  Will Render bitmask flags for the components Visible, Alpha, Transform and Texture respectively
        this.renderMask = 15;
        this.renderFlags = 15;
    },

    //  To be overridden by custom Game Objects
    preUpdate: function ()
    {
    },

    //  Can be overridden by custom Game Objects, but provides default export functionality
    toJSON: function ()
    {
        return Components.ToJSON(this);
    },

    destroy: function ()
    {
        this.parent.remove(this);

        this.state = undefined;
    }

});

module.exports = GameObject;
