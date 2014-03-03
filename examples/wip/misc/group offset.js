var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    // game.load.image('atari1', 'assets/sprites/atari130xe.png');
    // game.load.image('atari2', 'assets/sprites/atari800xl.png');
    // game.load.image('atari4', 'assets/sprites/atari800.png');
    // game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
    // game.load.image('duck', 'assets/sprites/darkwing_crazy.png');
    // game.load.image('firstaid', 'assets/sprites/firstaid.png');
    // game.load.image('diamond', 'assets/sprites/diamond.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var group;
var sprite;

function create() {

    var images = game.cache.getImageKeys();

    group = game.add.group();

    // for (var i = 0; i < 20; i++)
    // {
    	sprite = group.create(200, game.world.randomY, game.rnd.pick(images));
    // }

    group.x = 200;

}

function render() {

    game.debug.text('sx: ' + sprite.x + ' wx: ' + sprite.world.x, 32, 32);

}