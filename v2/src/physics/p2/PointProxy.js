/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2016 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A PointProxy is an internal class that allows for direct getter/setter style property access to Arrays and TypedArrays.
*
* @class Phaser.Physics.P2.PointProxy
* @constructor
* @param {Phaser.Physics.P2} world - A reference to the P2 World.
* @param {any} destination - The object to bind to.
*/
Phaser.Physics.P2.PointProxy = function (world, destination) {

    this.world = world;
	this.destination = destination;

};

Phaser.Physics.P2.PointProxy.prototype.constructor = Phaser.Physics.P2.PointProxy;

/**
* @name Phaser.Physics.P2.PointProxy#x
* @property {number} x - The x property of this PointProxy get and set in pixels.
*/
Object.defineProperty(Phaser.Physics.P2.PointProxy.prototype, "x", {

    get: function () {

        return this.world.mpx(this.destination[0]);

    },

    set: function (value) {

        this.destination[0] = this.world.pxm(value);

    }

});

/**
* @name Phaser.Physics.P2.PointProxy#y
* @property {number} y - The y property of this PointProxy get and set in pixels.
*/
Object.defineProperty(Phaser.Physics.P2.PointProxy.prototype, "y", {

    get: function () {

        return this.world.mpx(this.destination[1]);

    },

    set: function (value) {

        this.destination[1] = this.world.pxm(value);

    }

});

/**
* @name Phaser.Physics.P2.PointProxy#mx
* @property {number} mx - The x property of this PointProxy get and set in meters.
*/
Object.defineProperty(Phaser.Physics.P2.PointProxy.prototype, "mx", {

    get: function () {

        return this.destination[0];

    },

    set: function (value) {

        this.destination[0] = value;

    }

});

/**
* @name Phaser.Physics.P2.PointProxy#my
* @property {number} my - The x property of this PointProxy get and set in meters.
*/
Object.defineProperty(Phaser.Physics.P2.PointProxy.prototype, "my", {

    get: function () {

        return this.destination[1];

    },

    set: function (value) {

        this.destination[1] = value;

    }

});
