/// <reference path="../../Phaser/gameobjects/Tilemap.ts" />
/// <reference path="../../Phaser/system/Tile.ts" />
/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../build/phaser-fx.d.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addTextFile('desert', 'assets/maps/desert.json');
        myGame.loader.addImageFile('tiles', 'assets/tiles/tmw_desert_spacing.png');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');
        myGame.loader.load();
    }
    var CACTUS = 31;
    var SIGN_POST = 46;
    var map;
    var car;
    var tile;
    var flash;
    function create() {
        map = myGame.add.tilemap('tiles', 'desert', Phaser.Tilemap.FORMAT_TILED_JSON);
        //  When the car collides with the cactus tile we'll flash the screen red briefly,
        //  but it won't stop the car (the separateX/Y values are set to false)
        map.setCollisionByIndex([
            CACTUS
        ], Phaser.Collision.ANY, true, false, false);
        //  When the car collides with the sign post tile we'll stop the car moving (separation is set to true)
        map.setCollisionByIndex([
            SIGN_POST
        ], Phaser.Collision.ANY, true, true, true);
        //  This is the callback that will be called every time map.collide() returns true
        map.collisionCallback = collide;
        //  This is the context in which the callback is called (usually 'this' if you want to be able to access local vars)
        map.collisionCallbackContext = this;
        car = myGame.add.sprite(250, 200, 'car');
        car.setBounds(0, 0, map.widthInPixels - 32, map.heightInPixels - 32);
        myGame.camera.follow(car);
        flash = myGame.camera.fx.add(Phaser.FX.Camera.Flash);
    }
    function update() {
        //  Collide the car object with the tilemap
        //  It's important to do this BEFORE you adjust the object velocity (below) otherwise it can jitter around a lot
        map.collide(car);
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
    function collide(object, collisionData) {
        //  collisionData is an array containing all of the tiles the object overlapped with (can be more than 1)
        for(var i = 0; i < collisionData.length; i++) {
            if(collisionData[i].tile.index == CACTUS) {
                console.log('you hit a cactus!');
                flash.start(0xff0000, 1);
            } else if(collisionData[i].tile.index == SIGN_POST) {
                console.log('you hit a sign post!');
            }
        }
    }
})();
