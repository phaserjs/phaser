/// <reference path="../../Phaser/gameobjects/Tilemap.ts" />
/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addTextFile('platform', 'assets/maps/platform-test-1.json');
        myGame.loader.addImageFile('tiles', 'assets/tiles/platformer_tiles.png');
        myGame.loader.addImageFile('ufo', 'assets/sprites/ufo.png');
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');
        myGame.loader.load();
    }
    var map;
    var car;
    var tile;
    var emitter;
    var test;
    function create() {
        map = myGame.createTilemap('tiles', 'platform', Phaser.Tilemap.FORMAT_TILED_JSON);
        map.setCollisionRange(21, 53);
        map.setCollisionRange(105, 109);
        myGame.camera.backgroundColor = 'rgb(47,154,204)';
        myGame.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT, 
            Phaser.Keyboard.RIGHT, 
            Phaser.Keyboard.UP, 
            Phaser.Keyboard.DOWN
        ]);
        emitter = myGame.createEmitter(32, 80);
        emitter.width = 700;
        emitter.makeParticles('melon', 100, 0, false, 1);
        emitter.gravity = 200;
        emitter.bounce = 0.8;
        //emitter.setRotation(0, 0);
        emitter.start(false, 10, 0.1);
        car = myGame.createSprite(250, 64, 'ufo');
        car.renderRotation = false;
        test = myGame.createSprite(200, 64, 'ufo');
        test.elasticity = 1;
        test.velocity.x = 50;
        test.velocity.y = 100;
        car.setBounds(0, 0, map.widthInPixels - 32, map.heightInPixels - 32);
    }
    function update() {
        car.velocity.x = 0;
        car.velocity.y = 0;
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            car.velocity.x = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            car.velocity.x = 200;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            car.velocity.y = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            car.velocity.y = 200;
        }
        //  Collide everything with the map
        map.collide();
        //  And collide everything in the game :)
        myGame.collide();
    }
})();
