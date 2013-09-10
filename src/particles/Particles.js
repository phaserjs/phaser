Phaser.Particles = function (game) {

	this.emitters = {};

	this.ID = 0;

};

Phaser.Particles.prototype = {

	emitters: null,

	add: function (emitter) {

		this.emitters[emitter.name] = emitter;

		return emitter;

	},

	remove: function (emitter) {

		delete this.emitters[emitter.name];

	},

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