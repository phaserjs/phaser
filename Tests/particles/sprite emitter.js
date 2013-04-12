var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/Sprite.ts" />
/// <reference path="../../Phaser/Emitter.ts" />
//  Actually we could achieve the same result as this by using a sprite sheet and basic Particle
//  but it still shows you how to use it properly from TypeScript, so it was worth making
var customParticle = (function (_super) {
    __extends(customParticle, _super);
    function customParticle(game) {
        _super.call(this, game);
        var s = [
            'carrot', 
            'melon', 
            'eggplant', 
            'mushroom', 
            'pineapple'
        ];
        this.loadGraphic(game.math.getRandom(s));
    }
    return customParticle;
})(Particle);
(function () {
    var myGame = new Game(this, 'game', 800, 600, init, create);
    var emitter;
    function init() {
        myGame.loader.addImageFile('carrot', 'assets/sprites/carrot.png');
        myGame.loader.addImageFile('melon', 'assets/sprites/melon.png');
        myGame.loader.addImageFile('eggplant', 'assets/sprites/eggplant.png');
        myGame.loader.addImageFile('mushroom', 'assets/sprites/mushroom.png');
        myGame.loader.addImageFile('pineapple', 'assets/sprites/pineapple.png');
        myGame.loader.load();
    }
    function create() {
        emitter = myGame.createEmitter(myGame.stage.centerX, 50);
        emitter.gravity = 100;
        //  Here we tell the emitter to use our customParticle class
        //  The customParticle needs to extend Particle and must take game:Game as the first constructor parameter, otherwise it's free as a bird
        emitter.particleClass = customParticle;
        emitter.makeParticles(null, 500, 0, false, 0);
        emitter.start(false, 10, 0.05);
    }
})();
