/// <reference path="../../Phaser/gameobjects/Tilemap.ts" />
/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        //  Tiled JSON Test
        //myGame.loader.addTextFile('jsontest', 'assets/maps/test.json');
        myGame.loader.addTextFile('jsontest', 'assets/maps/multi-layer-test.json');
        myGame.loader.addImageFile('jsontiles', 'assets/tiles/platformer_tiles.png');
        //  CSV Test
        myGame.loader.addTextFile('csvtest', 'assets/maps/catastrophi_level2.csv');
        myGame.loader.addImageFile('csvtiles', 'assets/tiles/catastrophi_tiles_16.png');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');
        myGame.loader.load();
    }
    var car;
    var map;
    var bigCam;
    function create() {
        myGame.camera.deadzone = new Phaser.Rectangle(64, 64, myGame.stage.width - 128, myGame.stage.height - 128);
        //bigCam = myGame.add.camera(30, 30, 200, 200);
        //bigCam.showBorder = true;
        //bigCam.scale.setTo(1.5, 1.5);
        //map = myGame.add.tilemap('jsontiles', 'jsontest', Phaser.Tilemap.FORMAT_TILED_JSON);
        map = myGame.add.tilemap('csvtiles', 'csvtest', Phaser.Tilemap.FORMAT_CSV, true, 16, 16);
        car = myGame.add.sprite(300, 100, 'car');
        myGame.camera.follow(car);
        //bigCam.follow(car, Phaser.Camera.STYLE_LOCKON);
        myGame.onRenderCallback = render;
    }
    function update() {
        //bigCam.rotation += 0.5;
        car.velocity.x = 0;
        car.velocity.y = 0;
        car.angularVelocity = 0;
        car.angularAcceleration = 0;
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            car.angularVelocity = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            car.angularVelocity = 200;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            var motion = myGame.motion.velocityFromAngle(car.angle, 300);
            car.velocity.copyFrom(motion);
        }
    }
    function render() {
        //map.renderDebugInfo(400, 16);
            }
})();
