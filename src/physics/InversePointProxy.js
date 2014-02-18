/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A InversePointProxy is an internal class that allows for direct getter/setter style property access to Arrays and TypedArrays but inverses the values on set.
*
* @class Phaser.Physics.InversePointProxy
* @classdesc InversePointProxy
* @constructor
* @param {any} destination - The object to bind to.
*/
Phaser.Physics.InversePointProxy = function (destination) {

	this.destination = destination;

};

Phaser.Physics.InversePointProxy.prototype.constructor = Phaser.Physics.InversePointProxy;

/**
* @name Phaser.Physics.InversePointProxy#x
* @property {number} x - The x property of this InversePointProxy.
*/
Object.defineProperty(Phaser.Physics.InversePointProxy.prototype, "x", {
    
    get: function () {

        return this.destination[0];

    },

    set: function (value) {

        this.destination[0] *= -value;

    }

});

/**
* @name Phaser.Physics.InversePointProxy#y
* @property {number} y - The y property of this InversePointProxy.
*/
Object.defineProperty(Phaser.Physics.InversePointProxy.prototype, "y", {
    
    get: function () {

        return this.destination[1];

    },

    set: function (value) {

        this.destination[1] *= -value;

    }

});
