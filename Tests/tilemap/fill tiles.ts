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
    var marker: Phaser.GeomSprite;
    var tile: Phaser.Tile;

    function create() {

        map = myGame.add.tilemap('tiles', 'desert', Phaser.Tilemap.FORMAT_TILED_JSON);

        car = myGame.add.sprite(250, 200, 'car');
        car.setBounds(0, 0, map.widthInPixels - 32, map.heightInPixels - 32);

        marker = myGame.add.geomSprite(0, 0);
        marker.createRectangle(32, 32);
        marker.renderFill = false;
        marker.lineColor = 'rgb(0,0,0)';

        myGame.camera.follow(car);
        myGame.onRenderCallback = render;

        myGame.input.onDown.add(fillTiles);
    }

    function fillTiles() {

        //   Fills the given region of the map (2,2,10,20) with tile index 15
        map.currentLayer.fillTile(15, 2, 2, 10, 20);

    }

    function update() {

        marker.x = myGame.math.snapToFloor(myGame.input.getWorldX(), 32);
        marker.y = myGame.math.snapToFloor(myGame.input.getWorldY(), 32);

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

    function render {

        tile = map.getTileFromInputXY();

        myGame.stage.context.font = '18px Arial';
        myGame.stage.context.fillStyle = 'rgb(0,0,0)';
        myGame.stage.context.fillText(tile.toString(), 32, 32);

        myGame.input.renderDebugInfo(32, 64, 'rgb(0,0,0)');

    }

})();
