/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A InversePointProxy is an internal class that allows for direct getter/setter style property access to Arrays and TypedArrays but inverses the values on set.
*
* @class Phaser.Physics.P2.InversePointProxy
* @classdesc InversePointProxy
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {any} destination - The object to bind to.
*/
Phaser.Physics.P2.InversePointProxy = function (world, destination) {

    this.world = world;
	this.destination = destination;

};

Phaser.Physics.P2.InversePointProxy.prototype.constructor = Phaser.Physics.P2.InversePointProxy;

/**
* @name Phaser.Physics.P2.InversePointProxy#x
* @property {number} x - The x property of this InversePointProxy.
*/
Object.defineProperty(Phaser.Physics.P2.InversePointProxy.prototype, "x", {

    get: function () {

        return this.destination[0];

    },

    set: function (value) {

        this.destination[0] = this.world.pxm(-value);

    }

});

/**
* @name Phaser.Physics.P2.InversePointProxy#y
* @property {number} y - The y property of this InversePointProxy.
*/
Object.defineProperty(Phaser.Physics.P2.InversePointProxy.prototype, "y", {

    get: function () {

        return this.destination[1];

    },

    set: function (value) {

        this.destination[1] = this.world.pxm(-value);

    }

});
