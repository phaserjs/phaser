/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Class = require('../utils/Class');

/**
* This is the base Game Object class that you can use when creating your own extended Game Objects.
*
* @class
*/

var GameObject = new Class({

    initialize:

    function GameObject (state)
    {
        this.state = state;

        this.id = 0;
        this.name = '';

        this.parent;

        //  0001 | 0010 | 0100 | 1000
        //  Will Render bitmask flags for the components Visible, Alpha, Transform and Texture respectively
        this.renderMask = 15;
        this.renderFlags = 15;
    },

    destroy: function ()
    {
        this.state = undefined;
        this.parent = undefined;
    }

});

module.exports = GameObject;
