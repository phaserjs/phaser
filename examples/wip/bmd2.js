
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('coke', 'assets/sprites/cokecan.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');
    game.load.image('ball', 'assets/sprites/shinyball.png');

}

var bmd;

function create() {

	//game.stage.backgroundColor = '#450034';

	bmd = game.add.bitmapData('bob', 800, 600);

    //  And apply it to 100 randomly positioned sprites
    for (var i = 0; i < 100; i++)
    {
    	bmd.setPixel(game.world.randomX, game.world.randomY, Math.random() * 255, Math.random() * 255, 255);
    }

    bmd.context.fillStyle = '#ffffff';
    bmd.context.fillRect(20,20,16,16);

    var d = game.add.sprite(0, 0, bmd);

}

function update() {

	// bmd.clear();

	// updateWobblyBall();

}


function render() {

	// bmd.render();

}
