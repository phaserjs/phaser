/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Sprite.ts" />

(function () {

    var myGame = new Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.world.setSize(2240, 2240);

        myGame.loader.addImageFile('grid', 'assets/tests/debug-grid-1920x1920.png');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');

        myGame.loader.load();

    }

    var car: Sprite;

    function create() {

        myGame.createSprite(0, 0, 'grid');

        car = myGame.createSprite(400, 300, 'car');

        myGame.camera.follow(car, Camera.STYLE_TOPDOWN);
        myGame.camera.setBounds(0, 0, myGame.world.width, myGame.world.height);

    }

    function update() {

        myGame.camera.renderDebugInfo(32, 32);
        car.renderDebugInfo(200, 32);

        car.velocity.x = 0;
        car.velocity.y = 0;
		car.angularVelocity = 0;
		car.angularAcceleration = 0;

        if (myGame.input.keyboard.isDown(Keyboard.LEFT))
        {
            car.angularVelocity = -200;
        }
        else if (myGame.input.keyboard.isDown(Keyboard.RIGHT))
        {
            car.angularVelocity = 200;
        }

        if (myGame.input.keyboard.isDown(Keyboard.UP))
        {
            var motion:Point = myGame.math.velocityFromAngle(car.angle, 300);

            car.velocity.copyFrom(motion);
        }

    }

})();
