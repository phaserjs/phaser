/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* A PointProxy is an internal class that allows for direct getter/setter style property access to Arrays and TypedArrays.
*
* @class Phaser.Physics.PointProxy
* @classdesc PointProxy
* @constructor
* @param {any} destination - The object to bind to.
*/
Phaser.Physics.PointProxy = function (destination) {

	this.destination = destination;

};

Phaser.Physics.PointProxy.prototype.constructor = Phaser.Physics.PointProxy;

/**
* @name Phaser.Physics.PointProxy#x
* @property {number} x - The x property of this PointProxy.
*/
Object.defineProperty(Phaser.Physics.PointProxy.prototype, "x", {
    
    get: function () {

        return this.destination[0];

    },

    set: function (value) {

        this.destination[0] = value;

    }

});

/**
* @name Phaser.Physics.PointProxy#y
* @property {number} y - The y property of this PointProxy.
*/
Object.defineProperty(Phaser.Physics.PointProxy.prototype, "y", {
    
    get: function () {

        return this.destination[1];

    },

    set: function (value) {

        this.destination[1] = value;

    }

});
