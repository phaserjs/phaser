BasicGame.Game = function (game) {

	//	Honestly, just about anything could go here.

};

BasicGame.Game.prototype = {

	create: function () {

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

	},

	update: function () {

		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.game.state.start('MainMenu');

	}

};
