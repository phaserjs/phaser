
BasicGame.MainMenu = function (game) {

	this.bg;
	this.spriteTopLeft;
	this.spriteTopRight;
	this.spriteBottomLeft;
	this.spriteBottomRight;

};

BasicGame.MainMenu.prototype = {

	create: function () {

	    this.bg = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'starfield');

	    this.spriteTopLeft = this.add.sprite(0, 0, 'tetris3');

	    this.spriteTopRight = this.add.sprite(game.width, 0, 'tetris1');
	    this.spriteTopRight.anchor.set(1, 0);

	    this.spriteBottomLeft = this.add.sprite(0, game.height, 'tetris2');
	    this.spriteBottomLeft.anchor.set(0, 1);

	    this.spriteBottomRight = this.add.sprite(game.width, game.height, 'tetris3');
	    this.spriteBottomRight.anchor.set(1, 1);

	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	resize: function (width, height) {

		//	If the game container is resized this function will be called automatically.
		//	You can use it to align sprites that should be fixed in place and other responsive display things.

	    this.bg.width = width;
	    this.bg.height = height;

	    this.spriteMiddle.x = this.game.world.centerX;
	    this.spriteMiddle.y = this.game.world.centerY;

	    this.spriteTopRight.x = this.game.width;
	    this.spriteBottomLeft.y = this.game.height;

	    this.spriteBottomRight.x = this.game.width;
	    this.spriteBottomRight.y = this.game.height;

	}

};
