/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* @class Phaser.Physics
*/
Phaser.Physics = {};

/**
* @class Phaser.Physics.World
* @classdesc Physics World Constructor
* @constructor
* @param {Phaser.Game} 
*/
Phaser.Physics.World = function (game) {

    /**
    * @property {Phaser.Game} game - Local reference to game.
    */
    this.game = game;

    p2.World.call(this, { gravity: [0, 0] });

};

Phaser.Physics.World.prototype = Object.create(p2.World.prototype);
Phaser.Physics.World.prototype.constructor = Phaser.Physics.World;

/**
* @method Phaser.Physics.World.prototype.update
*/
Phaser.Physics.World.prototype.update = function () {

	this.step(1 / 60);

};
