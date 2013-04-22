/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addTextFile('jsontest', 'assets/maps/test.json');
        myGame.loader.addImageFile('jsontiles', 'assets/tiles/platformer_tiles.png');

        myGame.loader.load();

    }

    var car: Phaser.Sprite;
    var map: Phaser.Tilemap;
    var hasGrabbed: bool = false;

    function create() {

        myGame.camera.deadzone = new Phaser.Rectangle(64, 64, myGame.stage.width - 128, myGame.stage.height - 128);

        map = myGame.createTilemap('jsontiles', 'jsontest', Phaser.Tilemap.FORMAT_TILED_JSON);

        //  for now like this, but change to auto soon
        myGame.world.setSize(map.widthInPixels, map.heightInPixels);
        myGame.camera.setBounds(0, 0, myGame.world.width, myGame.world.height);

        car = myGame.createSprite(300, 100, 'car');

        myGame.camera.follow(car);

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
            var motion:Phaser.Point = myGame.motion.velocityFromAngle(car.angle, 300);

            car.velocity.copyFrom(motion);
        }

        if (myGame.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR) && hasGrabbed == false)
        {
            console.log('graboids');
            hasGrabbed = true;
        }

    }

})();
