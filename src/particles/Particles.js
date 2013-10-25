/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* Phaser.Particles is the Particle Manager for the game. It is called during the game update loop and in turn updates any Emitters attached to it.
*
* @class Phaser.Particles
* @classdesc Phaser Particles
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.Particles = function (game) {

	/**
    * @property {Description} emitters - Description.
	*/
	this.emitters = {};

	/**
	* @property {number} ID - Description.
	* @default
	*/
	this.ID = 0;

};

Phaser.Particles.prototype = {

	/**
	* Adds a new Particle Emitter to the Particle Manager.
	* @method Phaser.Particles#add
	* @param {Phaser.Emitter} emitter - Description.
	* @return {Phaser.Emitter} The emitter that was added.
	*/
	add: function (emitter) {

		this.emitters[emitter.name] = emitter;

		return emitter;

	},

	/**
	* Removes an existing Particle Emitter from the Particle Manager.
	* @method Phaser.Particles#remove
	* @param {Phaser.Emitter} emitter - The emitter to remove.
	*/
	remove: function (emitter) {

		delete this.emitters[emitter.name];

	},

	/**
	* Called by the core game loop. Updates all Emitters who have their exists value set to true.
	* @method Phaser.Particles#update
	* @protected
	*/
	update: function () {

		for (var key in this.emitters)
		{
			if (this.emitters[key].exists)
			{
				this.emitters[key].update();
			}
		}

	}

};