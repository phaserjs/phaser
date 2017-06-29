/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

var Systems = require('./Systems');

/**
* A Base State Class.
*
* @class Phaser.State
* @constructor
*/
var State = function (config)
{
    //  The State Systems. You must never overwrite this property, or all hell will break lose.
    this.sys = new Systems(this, config);
};

State.prototype = {

    //  Should be overridden by your own States
    update: function ()
    {
    },

    //  Should be overridden by your own States
    render: function ()
    {
    }

};

State.prototype.constructor = State;

module.exports = State;
