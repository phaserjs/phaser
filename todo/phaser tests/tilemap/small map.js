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
    var car;
    var map;
    var overlay;
    var smallCam;
    function create() {
        map = myGame.add.tilemap('jsontiles', 'jsontest', Phaser.Tilemap.FORMAT_TILED_JSON);
        car = myGame.add.sprite(300, 100, 'car');
        car.setBounds(0, 0, map.widthInPixels - 32, map.heightInPixels - 32);
        //  Hide the tilemap and car sprite from the main camera (it will still be seen by the smallCam)
        map.hideFromCamera(myGame.camera);
        car.hideFromCamera(myGame.camera);
        smallCam = myGame.add.camera(32, 32, 352, 240);
        smallCam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        smallCam.follow(car);
        overlay = myGame.add.sprite(0, 0, 'overlay');
        overlay.hideFromCamera(smallCam);
    }
    function update() {
        car.velocity.x = 0;
        car.velocity.y = 0;
        car.angularVelocity = 0;
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            car.angularVelocity = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            car.angularVelocity = 200;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            car.velocity.copyFrom(myGame.motion.velocityFromAngle(car.angle, 300));
        }
    }
})();
