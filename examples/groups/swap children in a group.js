
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('atari2', 'assets/sprites/atari800xl.png');

}

var atari1;
var atari2;

function create() {

    //  Items are rendered in the depth order in which they are added to the Group
    atari1 = game.add.sprite(100, 100, 'atari1');
    atari2 = game.add.sprite(250, 90, 'atari2');

    game.input.onTap.add(swapSprites, this);

}

function swapSprites() {

    //The 2 Sprites are in the global world Group (World class extends the Group class), but this will work for any Group:
    game.world.swap(atari1, atari2);

}

function render () {

    game.debug.text('Tap screen to swap the children and therefore swap their indexes.', 10, 280);

}
