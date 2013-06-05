var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/Particle.ts" />
/// <reference path="../../Phaser/gameobjects/Emitter.ts" />
var fruitParticle = (function (_super) {
    __extends(fruitParticle, _super);
    function fruitParticle(game) {
        _super.call(this, game);
        var s = [
            'carrot', 
            'melon', 
            'eggplant', 
            'mushroom', 
            'pineapple'
        ];
        this.texture.loadImage(game.math.getRandom(s));
    }
    return fruitParticle;
})(Phaser.Particle);
(function () {
    var game = new Phaser.Game(this, 'game', 320, 200, init, create);
    var emitter;
    function init() {
        game.load.image('carrot', '../assets/sprites/carrot.png');
        game.load.image('melon', '../assets/sprites/melon.png');
        game.load.image('eggplant', '../assets/sprites/eggplant.png');
        game.load.image('mushroom', '../assets/sprites/mushroom.png');
        game.load.image('pineapple', '../assets/sprites/pineapple.png');
        game.load.start();
    }
    function create() {
        emitter = game.add.emitter(game.stage.centerX, 50);
        emitter.gravity = 100;
        //  Here we tell the emitter to use our customParticle class
        //  The customParticle needs to extend Particle and must take game:Game as the first constructor parameter, otherwise it's free as a bird
        emitter.particleClass = fruitParticle;
        emitter.makeParticles(null, 50, false, 0);
        emitter.start(false, 10, 0.05);
    }
})();
