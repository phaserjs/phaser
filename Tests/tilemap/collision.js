/// <reference path="../../Phaser/gameobjects/Tilemap.ts" />
/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addTextFile('platform', 'assets/maps/platform-test-1.json');
        myGame.loader.addImageFile('tiles', 'assets/tiles/platformer_tiles.png');
        myGame.loader.addImageFile('ufo', 'assets/sprites/ufo.png');
        myGame.loader.addImageFile('ilkke', 'assets/sprites/ilkke.png');
        myGame.loader.addImageFile('chunk', 'assets/sprites/chunk.png');
        myGame.loader.addImageFile('healthbar', 'assets/sprites/healthbar.png');
        myGame.loader.load();
    }
    var map;
    var car;
    var marker;
    var tile;
    function create() {
        map = myGame.createTilemap('tiles', 'platform', Phaser.Tilemap.FORMAT_TILED_JSON);
        map.setCollisionRange(21, 53);
        map.setCollisionRange(105, 109);
        myGame.camera.backgroundColor = 'rgb(47,154,204)';
        car = myGame.createSprite(250, 0, 'ufo');
        car.renderRotation = false;
        car.renderDebug = true;
        car.setBounds(0, 0, map.widthInPixels - 32, map.heightInPixels - 32);
        //car.velocity.y = 10;
        marker = myGame.createGeomSprite(0, 0);
        marker.createRectangle(16, 16);
        marker.renderFill = false;
        myGame.onRenderCallback = render;
    }
    function update() {
        marker.x = myGame.math.snapToFloor(myGame.input.worldX, 16);
        marker.y = myGame.math.snapToFloor(myGame.input.worldY, 16);
        //myGame.collide(car, map.currentLayer);
        car.velocity.x = 0;
        car.velocity.y = 0;
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            car.velocity.x = -100;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            car.velocity.x = 100;
        }
        if(myGame.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            car.velocity.y = -100;
        } else if(myGame.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            car.velocity.y = 100;
        }
    }
    function render() {
        tile = map.getTileFromInputXY();
        var b = map.getTileOverlaps(car);
        myGame.stage.context.font = '18px Arial';
        myGame.stage.context.fillStyle = 'rgb(255,255,255)';
        myGame.stage.context.fillText(tile.toString(), 32, 32);
        myGame.input.renderDebugInfo(32, 64, 'rgb(255,255,255)');
        myGame.stage.context.fillStyle = 'rgb(255,255,255)';
        myGame.stage.context.fillText(b.x + ' ' + b.y + ' ' + b.w + ' ' + b.h, 32, 200);
        myGame.stage.context.fillText(car.bounds.x + ' ' + car.bounds.y + ' ' + car.bounds.width + ' ' + car.bounds.height, 32, 232);
        var i = 0;
        for(var y = b.y; y < b.y + b.h; y++) {
            for(var x = b.x; x < b.x + b.w; x++) {
                if(b.collision[i] == true) {
                    myGame.stage.context.fillStyle = 'rgba(255,0,0,0.5)';
                } else {
                    myGame.stage.context.fillStyle = 'rgba(0,255,0,0.5)';
                }
                myGame.stage.context.fillRect(x * 16, y * 16, 16, 16);
                i++;
            }
        }
    }
})();
