/// <reference path="../../Phaser/gameobjects/Tilemap.ts" />
/// <reference path="../../Phaser/system/Tile.ts" />
/// <reference path="../../Phaser/Game.ts" />

(function () {

    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);

    function init() {

        myGame.loader.addTextFile('desert', 'assets/maps/desert.json');
        myGame.loader.addImageFile('tiles', 'assets/tiles/tmw_desert_spacing.png');
        myGame.loader.addImageFile('car', 'assets/sprites/car90.png');

        myGame.loader.load();

    }

    var map: Phaser.Tilemap;
    var car: Phaser.Sprite;

    function create() {

        map = myGame.createTilemap('tiles', 'desert', Phaser.Tilemap.FORMAT_TILED_JSON);

        //  Fills the whole map to one tile
        map.currentLayer.fillTile(30);

        car = myGame.createSprite(250, 200, 'car');
        car.setBounds(0, 0, map.widthInPixels - 32, map.heightInPixels - 32);

        myGame.camera.follow(car);
    }

    function update() {

        map.putTile(car.x + 16, car.y + 16, 34);

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
