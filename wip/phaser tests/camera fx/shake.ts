/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../build/phaser-fx.d.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addImageFile('background', 'assets/pics/remember-me.jpg');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');

        myGame.loader.load();

    }

    var car: Phaser.Sprite;
    var shake: Phaser.FX.Camera.Shake;

    function create() {

        myGame.add.sprite(0, 0, 'background');

        car = myGame.add.sprite(400, 300, 'car');

        //  Add our effect to the camera
        shake = <Phaser.FX.Camera.Shake> myGame.camera.fx.add(Phaser.FX.Camera.Shake);

        myGame.onRenderCallback = render;

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

        //  Shake the camera when the car hits the edges, a different intensity per edge

        if (car.x < 0)
        {
            shake.start();
            car.x = 0;
        }
        else if (car.x > myGame.world.width)
        {
            shake.start(0.02);
            car.x = myGame.world.width - car.width;
        }

        if (car.y < 0)
        {
            shake.start(0.07, 1);
            car.y = 0;
        }
        else if (car.y > myGame.world.height)
        {
            shake.start(0.1);
            car.y = myGame.world.height - car.height;
        }

    }

    function render() {

        myGame.camera.renderDebugInfo(32, 32);

    }

})();
