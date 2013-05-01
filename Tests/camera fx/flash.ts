/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../build/phaser-fx.d.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('background', 'assets/pics/large-color-wheel.png');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');

        myGame.loader.load();

    }

    var car: Phaser.Sprite;
    var flash: Phaser.FX.Camera.Flash;

    function create() {

        myGame.createSprite(0, 0, 'background');

        car = myGame.createSprite(400, 300, 'car');

        //  Add our effect to the camera
        flash = <Phaser.FX.Camera.Flash> myGame.camera.fx.add(Phaser.FX.Camera.Flash);

    }

    function update() {

        car.velocity.x = 0;
        car.velocity.y = 0;
		car.angularVelocity = 0;

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
            car.velocity.copyFrom(myGame.motion.velocityFromAngle(car.angle, 300));
        }

        //  Flash when the car hits the edges, a different colour per edge

        if (car.x < 0)
        {
            flash.start(0xffffff, 1);
            car.x = 0;
        }
        else if (car.x > myGame.world.width)
        {
            flash.start(0xff0000, 2);
            car.x = myGame.world.width - car.width;
        }

        if (car.y < 0)
        {
            flash.start(0xffff00, 2);
            car.y = 0;
        }
        else if (car.y > myGame.world.height)
        {
            flash.start(0xff00ff, 3);
            car.y = myGame.world.height - car.height;
        }

    }

})();
