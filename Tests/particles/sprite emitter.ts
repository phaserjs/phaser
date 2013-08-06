/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/particles/ArcadeParticle.ts" />
/// <reference path="../../Phaser/particles/ArcadeEmitter.ts" />

//  Actually we could achieve the same result as this by using a sprite sheet and basic Particle
//  but it still shows you how to use it properly from TypeScript, so it was worth making
class customParticle extends Phaser.ArcadeParticle {

    constructor(game:Phaser.Game) {

        super(game);

        var s = ['carrot', 'melon', 'eggplant', 'mushroom', 'pineapple'];

        this.texture.loadImage(game.math.getRandom(s));
    }

}

(function () {

    var game = new Phaser.Game(this, 'game', 800, 600, init, create);

    var emitter: Phaser.ArcadeEmitter;

    function init() {

        game.load.image('carrot', 'assets/sprites/carrot.png');
        game.load.image('melon', 'assets/sprites/melon.png');
        game.load.image('eggplant', 'assets/sprites/eggplant.png');
        game.load.image('mushroom', 'assets/sprites/mushroom.png');
        game.load.image('pineapple', 'assets/sprites/pineapple.png');

        game.load.start();

    }

    function create() {

        emitter = game.add.emitter(game.stage.centerX, 50);
        emitter.gravity = 100;

        //  Here we tell the emitter to use our customParticle class
        //  The customParticle needs to extend Particle and must take game:Game as the first constructor parameter, otherwise it's free as a bird
        emitter.particleClass = customParticle;

        emitter.makeParticles(null, 500, false, 0);
        emitter.start(false, 10, 0.05);

    }

})();
