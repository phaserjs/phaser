/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.Particles
*/


/**
* Phaser.Particles constructor
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
	* Description.
	* @method emitters
	*/
	emitters: null,

	/**
	* Description.
	* @method add
	* @param {Description} emitter - Description.
	* @return {Description} Description.
	*/
	add: function (emitter) {

		this.emitters[emitter.name] = emitter;

		return emitter;

	},

	/**
	* Description.
	* @method remove
	* @param {Description} emitter - Description.
	*/
	remove: function (emitter) {

		delete this.emitters[emitter.name];

	},

	/**
	* Description.
	* @method update
	* @param {Description} emitter - Description.
	*/
	update: function () {

		for (var key in this.emitters)
		{
			if (this.emitters[key].exists)
			{
				this.emitters[key].update();
			}
		}

	},

};