TestGame.MainMenu = function (game) {

	//	Our main menu
	this.game = game;

};

TestGame.MainMenu.prototype = {

	create: function () {

		var bg = this.game.add.sprite(0, 100, 'nocooper');
		bg.scale.setTo(2.5, 2.5);

		var t = this.game.add.sprite(100, 600, 'touhou');
		t.anchor.setTo(0, 1);

        button = this.game.add.button(this.game.world.centerX, 400, 'button', this.startGame, this, 2, 1, 0);
        button.anchor.setTo(0.5, 0.5);

	},

	startGame: function () {

		console.log('lets play');
		this.game.state.start('game');

	}

}
