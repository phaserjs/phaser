var TestGame = {};

TestGame.Preloader = function (game) {

	this.game = game;

};

TestGame.Preloader.prototype = {

	preload: function () {

		this.game.load.image('nocooper', '../assets/pics/1984-nocooper-space.png');
		this.game.load.image('touhou', '../assets/pics/aya_touhou_teng_soldier.png');
		this.game.load.image('cougar', '../assets/pics/cougar_ihsf.png');
        this.game.load.spritesheet('button', '../assets/buttons/button_sprite_sheet.png', 193, 71);

	},

	create: function () {

		console.log('Preloade finished, lets go to the main menu automatically');

		this.game.state.start('mainmenu');

	}

}
