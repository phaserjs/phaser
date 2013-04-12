//	The first parameter to your function should always be 'game' which is an instance of the Game object.
FakeGame = function (game) {

	//	Store the reference and then use it through-out your code
	this.game = game;

    this.car;
    this.bigCam;

};

FakeGame.prototype = {

	init: function () {

        this.game.loader.addImageFile('track', '../../assets/games/f1/track.png');
        this.game.loader.addImageFile('car', '../../assets/games/f1/car1.png');

        this.game.loader.load();

	},

	create: function () {

        this.game.camera.setBounds(0, 0, this.game.stage.width, this.game.stage.height);
        this.game.createSprite(0, 0, 'track');

        this.car = this.game.createSprite(180, 298, 'car');
        this.car.rotation = 180;
        this.car.maxVelocity.setTo(150, 150);

        this.bigCam = this.game.createCamera(640, 0, 100, 200);
        this.bigCam.follow(this.car, Camera.STYLE_LOCKON);
        this.bigCam.setBounds(0, 0, this.game.stage.width, this.game.stage.height);
        this.bigCam.showBorder = true;
        this.bigCam.borderColor = 'rgb(0,0,0)';
        this.bigCam.scale.setTo(2, 2);

	},

	update: function () {

        if (this.game.input.keyboard.isDown(Keyboard.LEFT))
        {
            this.car.rotation -= 4;
        }
        else if (this.game.input.keyboard.isDown(Keyboard.RIGHT))
        {
            this.car.rotation += 4;
        }

        if (this.game.input.keyboard.isDown(Keyboard.UP))
        {
            this.car.velocity.copyFrom(this.game.math.velocityFromAngle(this.car.angle, 150));
        }
        else
        {
            this.car.velocity.copyFrom(this.game.math.velocityFromAngle(this.car.angle, 60));
        }

	}

}
