/// <reference path="../../Phaser/gameobjects/Tilemap.ts" />
/// <reference path="../../Phaser/Game.ts" />
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addTextFile('platform', 'assets/maps/mapdraw.json');
        myGame.loader.addImageFile('tiles', 'assets/tiles/platformer_tiles.png');
        myGame.loader.addImageFile('carrot', 'assets/sprites/carrot.png');
        myGame.loader.load();
    }
    var map;
    var emitter;
    var marker;
    function create() {
        map = myGame.createTilemap('tiles', 'platform', Phaser.Tilemap.FORMAT_TILED_JSON);
        map.setCollisionRange(21, 53);
        map.setCollisionRange(105, 109);
        myGame.camera.backgroundColor = 'rgb(47,154,204)';
        marker = myGame.createGeomSprite(0, 0);
        marker.createRectangle(16, 16);
        marker.renderFill = false;
        marker.lineColor = 'rgb(0,0,0)';
        emitter = myGame.createEmitter(32, 80);
        emitter.width = 700;
        emitter.makeParticles('carrot', 100, 0, false, 1);
        emitter.gravity = 150;
        emitter.bounce = 0.8;
        emitter.start(false, 20, 0.05);
    }
    function update() {
        //  Collide everything with the map
        map.collide();
        marker.x = myGame.math.snapToFloor(myGame.input.worldX, 16);
        marker.y = myGame.math.snapToFloor(myGame.input.worldY, 16);
        if(myGame.input.mouse.isDown) {
            map.putTile(marker.x, marker.y, 32);
        }
    }
})();
