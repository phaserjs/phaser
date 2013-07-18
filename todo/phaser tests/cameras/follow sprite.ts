/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.world.setSize(1920, 1920);

        myGame.loader.addImageFile('grid', 'assets/tests/debug-grid-1920x1920.png');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');

        myGame.loader.load();

    }

    var car;

    function create() {

        myGame.add.sprite(0, 0, 'grid');

        car = myGame.add.sprite(400, 300, 'car');

        myGame.camera.follow(car);

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

    }

    function render() {

        myGame.camera.renderDebugInfo(32, 32);
        car.renderDebugInfo(200, 32);

    }

})();
