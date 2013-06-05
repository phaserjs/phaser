/// <reference path="../../Phaser/Game.ts" />
/// <reference path="../../Phaser/gameobjects/Particle.ts" />
/// <reference path="../../Phaser/gameobjects/Emitter.ts" />

class fruitParticle extends Phaser.Particle {

    constructor(game:Phaser.Game) {

        super(game);

        var s = ['carrot', 'melon', 'eggplant', 'mushroom', 'pineapple'];

        this.texture.loadImage(game.math.getRandom(s));
    }

}

(function () {

    var game = new Phaser.Game(this, 'game', 320, 200, init, create);

    var emitter: Phaser.Emitter;

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
