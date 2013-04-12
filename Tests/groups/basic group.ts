/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Group.ts" />
/// <reference path="../../Phaser/Sprite.ts" />

(function () {

    var myGame = new Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.world.setSize(1920, 1920);

        myGame.loader.addImageFile('grid', 'assets/tests/debug-grid-1920x1920.png');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');

        myGame.loader.load();

    }

    var car: Sprite;
    var melons: Group;

    function create() {

        myGame.createSprite(0, 0, 'grid');

        melons = myGame.createGroup();

        for (var i = 0; i < 100; i++)
        {
            var tempSprite = myGame.createSprite(Math.random() * myGame.world.width, Math.random() * myGame.world.height, 'melon');
            tempSprite.scrollFactor.setTo(1.2, 1.2);
            melons.add(tempSprite);
        }

        car = myGame.createSprite(400, 300, 'car');

        myGame.camera.follow(car);

    }

    function update() {

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
