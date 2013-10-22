
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

}

function create() {

    var emitter = game.add.emitter(game.world.centerX, game.world.centerY, 250);

    emitter.makeParticles('balls', [0, 1, 2, 3, 4, 5]);

    emitter.minParticleSpeed.setTo(-400, -400);
    emitter.maxParticleSpeed.setTo(400, 400);
    emitter.gravity = 0;
    emitter.start(false, 4000, 15);

}
