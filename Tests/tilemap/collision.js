/// <reference path="../../Phaser/gameobjects/Tilemap.ts" />
/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addTextFile('platform', 'assets/maps/platform-test-1.json');
        myGame.loader.addImageFile('tiles', 'assets/tiles/platformer_tiles.png');
        myGame.loader.addImageFile('ufo', 'assets/sprites/ufo.png');
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');
        myGame.loader.addImageFile('chunk', 'assets/sprites/chunk.png');
        myGame.loader.load();
    }
    var map;
    var ufo;
    var tile;
    var emitter;
    var test;
    function create() {
        map = myGame.add.tilemap('tiles', 'platform', Phaser.Tilemap.FORMAT_TILED_JSON);
        map.setCollisionRange(21, 53);
        map.setCollisionRange(105, 109);
        myGame.camera.opaque = true;
        myGame.camera.backgroundColor = 'rgb(47,154,204)';
        myGame.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT, 
            Phaser.Keyboard.RIGHT, 
            Phaser.Keyboard.UP, 
            Phaser.Keyboard.DOWN
        ]);
        //emitter = myGame.add.emitter(32, 80);
        //emitter.width = 700;
        //emitter.makeParticles('chunk', 100, false, 1);
        //emitter.gravity = 200;
        //emitter.bounce = 0.8;
        //emitter.start(false, 10, 0.05);
        ufo = myGame.add.sprite(250, 64, 'ufo');
        ufo.renderDebug = true;
        ufo.renderRotation = false;
        test = myGame.add.sprite(200, 64, 'ufo');
        test.elasticity = 1;
        test.velocity.x = 50;
        test.velocity.y = 100;
        ufo.setBounds(0, 0, map.widthInPixels - 32, map.heightInPixels - 32);
    }
    function update() {
        //  Collide everything with the map
        map.collide();
        //  And collide everything in the game :)
        myGame.collide();
        ufo.velocity.x = 0;
        ufo.velocity.y = 0;
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            ufo.velocity.x = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            ufo.velocity.x = 200;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            ufo.velocity.y = -200;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            ufo.velocity.y = 200;
        }
    }
})();
