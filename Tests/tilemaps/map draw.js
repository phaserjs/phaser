/// <reference path="../../Phaser/gameobjects/Tilemap.ts" />
/// <reference path="../../Phaser/Game.ts" />
(function () {
    var game = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        game.load.text('platform', 'assets/maps/mapdraw.json');
        game.load.image('tiles', 'assets/tiles/platformer_tiles.png');
        game.load.image('carrot', 'assets/sprites/carrot.png');
        game.load.start();
    }
    var map;
    var emitter;
    var marker;
    function create() {
        map = game.add.tilemap('tiles', 'platform', Phaser.Tilemap.FORMAT_TILED_JSON);
        map.setCollisionRange(21, 53);
        map.setCollisionRange(105, 109);
        game.camera.texture.opaque = true;
        game.camera.texture.backgroundColor = 'rgb(47,154,204)';
        marker = game.add.sprite(0, 0);
        marker.texture.width = 16;
        marker.texture.height = 16;
        marker.texture.opaque = true;
        marker.texture.backgroundColor = 'rgba(255,0,0,0.4)';
        //emitter = game.add.emitter(32, 80);
        //emitter.width = 700;
        //emitter.makeParticles('carrot', 100, false, 1);
        //emitter.gravity = 150;
        //emitter.bounce = 0.8;
        //emitter.start(false, 20, 0.05);
            }
    function update() {
        //  Collide everything with the map
        //map.collide();
        marker.x = game.math.snapToFloor(game.input.getWorldX(), 16);
        marker.y = game.math.snapToFloor(game.input.getWorldY(), 16);
        if(game.input.mousePointer.isDown) {
            map.putTile(marker.x, marker.y, 32);
        }
    }
})();
