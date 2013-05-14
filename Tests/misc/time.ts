/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('car', 'assets/sprites/asteroids_ship.png');

        myGame.loader.load();

    }

    var car: Phaser.Sprite;

    function create() {

        car = myGame.createSprite(200, 300, 'car');

        myGame.onRenderCallback = render;

        myGame.stage.context.font = '16px Arial';
        myGame.stage.context.fillStyle = 'rgb(255,255,255)';

    }

    function update() {

        car.velocity.x = 0;
        car.velocity.y = 0;
		car.angularVelocity = 0;
		car.angularAcceleration = 0;

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT))
        {
            car.angularVelocity = -200;
        }
        else if (myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
        {
            car.angularVelocity = 200;
        }

        if (myGame.input.keyboard.isDown(Phaser.Keyboard.UP))
        {
            var motion:Phaser.Point = myGame.motion.velocityFromAngle(car.angle, 200);
            car.velocity.copyFrom(motion);
        }

    }

    function render() {

        myGame.stage.context.fillText(myGame.time.time.toString(), 32, 32);

    }

})();
