//	The first parameter to your function should always be 'game' which is an instance of the Game object.
MainMenu = function (game) {

	//	Store the reference and then use it through-out your code
	this.game = game;

    this.monster;
    this.isFalling = false;

    this.hasClicked = false;

};

MainMenu.prototype = {

	init: function () {

        this.game.loader.addImageFile('car', '../../assets/pics/supercars_parsec.png');
        this.game.loader.addSpriteSheet('monster', '../../assets/sprites/metalslug_monster39x40.png', 39, 40);

        this.game.loader.load();

	},

	create: function () {

		this.game.camera.backgroundColor = 'rgb(85,85,85)';

		this.game.createSprite(80, 150, 'car');

        this.monster = this.game.createSprite(80, 60, 'monster');

        this.monster.animations.add('walk');
        this.monster.animations.play('walk', 30, true);
        this.monster.velocity.x = 50;

	},

	update: function () {

		if (this.monster.x >= 710 && this.isFalling == false)
		{
			this.isFalling = true;
			this.monster.velocity.x = 20;
			this.monster.acceleration.y = 200;
			this.monster.angularAcceleration = 100;
			this.monster.animations.stop('walk');
		}

        if (this.game.input.mouse.isDown && this.hasClicked == false)
        {
        	this.hasClicked = true;
            this.game.switchState(FakeGame);
        }

	},

	render: function () {

		this.game.stage.context.fillStyle = 'rgb(0,0,0)';

		this.game.stage.context.font = 'bold 48px Arial';
		this.game.stage.context.textAlign = 'center';
		this.game.stage.context.fillText('Super Racer', this.game.stage.centerX, 60);

		this.game.stage.context.font = 'bold 22px Arial';
		this.game.stage.context.textAlign = 'center';
		this.game.stage.context.fillText('Click to "Play"', this.game.stage.centerX, 370);

	}

}
