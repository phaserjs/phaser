
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

var emitter;

function preload() {

    game.load.image('sky', 'assets/skies/sky4.png');
    game.load.spritesheet('veggies', 'assets/sprites/fruitnveg32wh37.png', 32, 32);

}

function create() {

    game.add.image(0, 0, 'sky');

    emitter = game.add.emitter(game.world.centerX, game.world.centerY, 250);

    emitter.makeParticles('veggies', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20], 200, true, true);

    emitter.minParticleSpeed.setTo(-200, -300);
    emitter.maxParticleSpeed.setTo(200, -400);
    emitter.gravity = 150;
    emitter.bounce.setTo(0.5, 0.5);
    emitter.angularDrag = 30;

    emitter.start(false, 8000, 400);

}

function update() {

    game.physics.arcade.collide(emitter);

}
