TestGame.Game = function (game) {

	this.game = game;

};

TestGame.Game.prototype = {

	preload: function () {

        this.game.load.spritesheet('balls', '../assets/sprites/balls.png', 17, 17);

	},

	create: function () {

		this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'cougar').anchor.setTo(0.5, 0.5);

        p = this.game.add.emitter(100, 100, 250);
        p.makeParticles('balls', [0,1,2,3,4,5]);
        p.minParticleSpeed.setTo(-100, -100);
        p.maxParticleSpeed.setTo(100, -200);
        p.gravity = 10;
        p.start(false, 3000, 10);

        this.game.add.tween(p).to({ x: 700 }, 1000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);

		this.game.input.onDown.add(this.quitToMenu, this);

	},

	quitToMenu: function () {

		console.log('lets quit! back to the main menu');

		this.game.state.start('mainmenu');

	}

}
