
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('coke', 'assets/sprites/cokecan.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('ball', 'assets/sprites/shinyball.png');

}

var bmd;

function create() {

	bmd = game.add.bitmapData(800, 600);

    console.log('isLittleEndian', bmd.isLittleEndian);
    bmd.isLittleEndian = false;

    bmd.beginPath();
    bmd.beginLinearGradientFill(["#ff0000", "#ffff00"], [0, 1], 0, 0, 0, 600);
    bmd.rect(0, 0, 800, 600);
    bmd.closePath();
    bmd.fill();

    bmd.refreshBuffer();

    for (var i = 0; i < 100; i++)
    {
    	bmd.setPixel(game.world.randomX, game.world.randomY, 0, 0, 0);
    }

    var d = game.add.sprite(0, 0, bmd);

}

function update() {

    bmd.refreshBuffer();
    bmd.setPixel(game.input.x, game.input.y, 0, 0, 0);

}


function render() {

	bmd.render();

}
