/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Sprite.ts" />
/// <reference path="../../Phaser/Tilemap.ts" />

(function () {

    var myGame = new Game(this, 'game', 800, 600, init, create, update);

    function init() {

        //  Tiled JSON Test
        myGame.loader.addTextFile('jsontest', 'assets/maps/test.json');
        myGame.loader.addImageFile('jsontiles', 'assets/tiles/platformer_tiles.png');

        //  CSV Test
        myGame.loader.addTextFile('csvtest', 'assets/maps/catastrophi_level2.csv');
        myGame.loader.addImageFile('csvtiles', 'assets/tiles/catastrophi_tiles_16.png');

        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');

        myGame.loader.load();

    }

    var car: Sprite;
    var map: Tilemap;
    var bigCam: Camera;

    function create() {

        myGame.camera.deadzone = new Rectangle(64, 64, myGame.stage.width - 128, myGame.stage.height - 128);

        bigCam = myGame.createCamera(30, 30, 200, 200);
        bigCam.showBorder = true;
        bigCam.scale.setTo(1.5, 1.5);

        //map = myGame.createTilemap('jsontiles', 'jsontest', Tilemap.FORMAT_TILED_JSON);
        map = myGame.createTilemap('csvtiles', 'csvtest', Tilemap.FORMAT_CSV, 16, 16);

        //  for now like this, but change to auto soon
        myGame.world.setSize(map.widthInPixels, map.heightInPixels);
        console.log('world size', map.widthInPixels, map.heightInPixels);

        myGame.camera.setBounds(0, 0, myGame.world.width, myGame.world.height);
        bigCam.setBounds(0, 0, myGame.world.width, myGame.world.height);

        car = myGame.createSprite(300, 100, 'car');

        myGame.camera.follow(car);
        bigCam.follow(car, Camera.STYLE_LOCKON);

        myGame.onRenderCallback = render;

    }

    function update() {

        //bigCam.rotation += 0.5;

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

    function render {

        map.renderDebugInfo(400, 16);

    }

})();
