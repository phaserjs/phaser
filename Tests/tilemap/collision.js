var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../Phaser/gameobjects/Tilemap.ts" />
/// <reference path="../../Phaser/Game.ts" />
var customParticle2 = (function (_super) {
    __extends(customParticle2, _super);
    function customParticle2(game) {
        _super.call(this, game);
        var s = [
            'carrot', 
            'melon', 
            'eggplant', 
            'mushroom', 
            'pineapple'
        ];
        this.loadGraphic(game.math.getRandom(s));
        this.elasticity = 0.8;
    }
    return customParticle2;
})(Phaser.Particle);
(function () {
    var myGame = new Phaser.Game(this, 'game', 800, 600, init, create, update);
    function init() {
        myGame.loader.addTextFile('platform', 'assets/maps/platform-test-1.json');
        myGame.loader.addImageFile('tiles', 'assets/tiles/platformer_tiles.png');
        myGame.loader.addImageFile('ufo', 'assets/sprites/ufo.png');
        myGame.loader.addImageFile('carrot', 'assets/sprites/carrot.png');
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');
        myGame.loader.addImageFile('eggplant', 'assets/sprites/eggplant.png');
        myGame.loader.addImageFile('mushroom', 'assets/sprites/mushroom.png');
        myGame.loader.addImageFile('pineapple', 'assets/sprites/pineapple.png');
        myGame.loader.load();
    }
    var map;
    var car;
    var tile;
    var emitter;
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
        emitter.particleClass = customParticle2;
        emitter.makeParticles(null, 100, 0, false, 0.7);
        emitter.gravity = 100;
        emitter.setRotation(0, 0);
        emitter.start(false, 10, 0.05);
        car = myGame.createSprite(250, 64, 'ufo');
        car.renderRotation = false;
        //car.renderDebug = true;
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
        //  Collide the space ship with the particles
        myGame.collide(car, emitter);
        //  Collide everything with the map
        //map.collide();
        map.collide(emitter);
    }
})();
