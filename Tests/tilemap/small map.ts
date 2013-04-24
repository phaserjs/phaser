/// <reference path="../../Phaser/gameobjects/Tilemap.ts" />
/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addTextFile('jsontest', 'assets/maps/multi-layer-test.json');
        myGame.loader.addImageFile('jsontiles', 'assets/tiles/platformer_tiles.png');
        myGame.loader.addImageFile('overlay', 'assets/pics/scrollframe.png');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');

        myGame.loader.load();

    }

    var car: Phaser.Sprite;
    var map: Phaser.Tilemap;
    var overlay: Phaser.Sprite;
    var smallCam: Phaser.Camera;

    function create() {

        map = myGame.createTilemap('jsontiles', 'jsontest', Phaser.Tilemap.FORMAT_TILED_JSON);

        car = myGame.createSprite(300, 100, 'car');
        car.setBounds(0, 0, map.widthInPixels - 32, map.heightInPixels - 32);

        //  Hide the tilemap and car sprite from the main camera (it will still be seen by the smallCam)
        map.hideFromCamera(myGame.camera);
        car.hideFromCamera(myGame.camera);

        smallCam = myGame.world.createCamera(32, 32, 352, 240);
        smallCam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        smallCam.follow(car);

        overlay = myGame.createSprite(0, 0, 'overlay');
        overlay.hideFromCamera(smallCam);

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

})();
