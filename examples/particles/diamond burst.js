
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

var p;

function preload() {

    game.load.image('diamond', 'assets/sprites/diamond.png');

}

function create() {

    game.stage.backgroundColor = '#337799';

    p = game.add.emitter(game.world.centerX, 200, 200);

    p.makeParticles('diamond');

    p.start(false, 5000, 20);

}
