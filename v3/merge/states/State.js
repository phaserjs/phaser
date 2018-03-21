/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A Base State Class.
*
* @class Phaser.State
* @constructor
*/
Phaser.State = function (config)
{
    //  The properties a State *must* have, that cannot be changed without breaking it:

    this.game = null;

    this.settings = new Phaser.State.Settings(this, config);

    this.sys = new Phaser.State.Systems(this, config);

    //  Reference to sys.children, set during sys.init only
    this.children;
};

Phaser.State.prototype.constructor = Phaser.State;

Phaser.State.prototype = {

    //  Can be overridden by your own States
    preUpdate: function ()
    {
    },

    //  Can be overridden by your own States
    update: function ()
    {
    },

    //  Can be overridden by your own States
    postUpdate: function ()
    {
    },

    //  Can be overridden by your own States
    render: function ()
    {
    }

};
