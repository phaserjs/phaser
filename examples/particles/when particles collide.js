
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

var leftEmitter;
var rightEmitter;

function preload() {

    game.load.image('sky', 'assets/skies/cavern2.png');
    game.load.spritesheet('balls', 'assets/sprites/balls.png', 17, 17);

}

function create() {

    game.add.image(0, 0, 'sky');

    leftEmitter = game.add.emitter(50, game.world.centerY - 200);
    leftEmitter.bounce.setTo(0.5, 0.5);
    leftEmitter.setXSpeed(100, 200);
    leftEmitter.setYSpeed(-50, 50);
    leftEmitter.makeParticles('balls', 0, 250, 1, true);

    rightEmitter = game.add.emitter(game.world.width - 50, game.world.centerY - 200);
    rightEmitter.bounce.setTo(0.5, 0.5);
    rightEmitter.setXSpeed(-100, -200);
    rightEmitter.setYSpeed(-50, 50);
    rightEmitter.makeParticles('balls', 1, 250, 1, true);

    // explode, lifespan, frequency, quantity
    leftEmitter.start(false, 5000, 20);
    rightEmitter.start(false, 5000, 20);

}

function update() {

    game.physics.arcade.collide(leftEmitter, rightEmitter, change, null, this);

}

function change(a, b) {

    a.frame = 3;
    b.frame = 3;

}