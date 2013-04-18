/// <reference path="../../Phaser/Phaser.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('background', 'assets/pics/large-color-wheel.png');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');

        myGame.loader.load();

    }

    var car: Phaser.Sprite;

    function create() {

        myGame.createSprite(0, 0, 'background');

        car = myGame.createSprite(400, 300, 'car');

    }

    function update() {

        car.renderDebugInfo(32, 32);

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
            var motion:Phaser.Point = myGame.motion.velocityFromAngle(car.angle, 300);

            car.velocity.copyFrom(motion);
        }

        //  Fade when the car hits the edges, a different colour per edge

        if (car.x < 0)
        {
            myGame.camera.fade(0x330066, 3);
            car.x = 0;
        }
        else if (car.x > myGame.world.width)
        {
            myGame.camera.fade(0x000066, 3);
            car.x = myGame.world.width - car.width;
        }

        if (car.y > myGame.world.height)
        {
            myGame.camera.fade(0x000000, 3);
            car.y = myGame.world.height - car.height;
        }

    }

})();
