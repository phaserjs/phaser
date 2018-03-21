/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A InversePointProxy is an internal class that allows for direct getter/setter style property access to Arrays and TypedArrays but inverses the values on set.
*
* @class Phaser.Physics.P2.InversePointProxy
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
* @property {number} x - The x property of this InversePointProxy get and set in pixels.
*/
Object.defineProperty(Phaser.Physics.P2.InversePointProxy.prototype, "x", {

    get: function () {

        return this.world.mpxi(this.destination[0]);

    },

    set: function (value) {

        this.destination[0] = this.world.pxmi(value);

    }

});

/**
* @name Phaser.Physics.P2.InversePointProxy#y
* @property {number} y - The y property of this InversePointProxy get and set in pixels.
*/
Object.defineProperty(Phaser.Physics.P2.InversePointProxy.prototype, "y", {

    get: function () {

        return this.world.mpxi(this.destination[1]);

    },

    set: function (value) {

        this.destination[1] = this.world.pxmi(value);

    }

});

/**
* @name Phaser.Physics.P2.InversePointProxy#mx
* @property {number} mx - The x property of this InversePointProxy get and set in meters.
*/
Object.defineProperty(Phaser.Physics.P2.InversePointProxy.prototype, "mx", {

    get: function () {

        return this.destination[0];

    },

    set: function (value) {

        this.destination[0] = -value;

    }

});

/**
* @name Phaser.Physics.P2.InversePointProxy#my
* @property {number} my - The y property of this InversePointProxy get and set in meters.
*/
Object.defineProperty(Phaser.Physics.P2.InversePointProxy.prototype, "my", {

    get: function () {

        return this.destination[1];

    },

    set: function (value) {

        this.destination[1] = -value;

    }

});
